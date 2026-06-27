import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { organizarHistoriaComIA } from "@/lib/organizar-historia";
import type { Tema } from "@/lib/types";

const MAX_FOTOS = 15;

function gerarSlug(nome1: string, nome2: string): string {
  const limpar = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const base = `${limpar(nome1)}-e-${limpar(nome2)}`;
  const sufixo = Math.random().toString(36).slice(2, 6);
  return `${base}-${sufixo}`;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const token = formData.get("token") as string;
    const nome1 = formData.get("nome1") as string;
    const nome2 = formData.get("nome2") as string;
    const dataInicio = formData.get("data_inicio") as string;
    const frase = formData.get("frase") as string;
    const historiaBruta = (formData.get("historia") as string) || "";
    const musicaUrlBruta = (formData.get("musica_url") as string) || "";
    const musicaUrl = musicaUrlBruta.trim() || null;
    const tema: Tema = "romantico";
    const paraSempre = formData.get("para_sempre") === "true";

    if (!token || !nome1 || !nome2 || !dataInicio || !frase) {
      return NextResponse.json(
        { error: "Preencha todos os campos obrigatórios" },
        { status: 400 }
      );
    }

    // 1. Validar o token
    const { data: pedido, error: pedidoError } = await supabaseAdmin
      .from("pedidos")
      .select("*")
      .eq("token", token)
      .eq("usado", false)
      .single();

    if (pedidoError || !pedido) {
      return NextResponse.json(
        { error: "Link inválido ou já utilizado" },
        { status: 403 }
      );
    }

    // 2. Upload das fotos pro Supabase Storage
    const fotos = formData.getAll("fotos") as File[];
    const urlsFotos: string[] = [];

    for (const foto of fotos.slice(0, MAX_FOTOS)) {
      if (!(foto instanceof File) || foto.size === 0) continue;

      const extensao = foto.name.split(".").pop();
      const caminho = `${token}/${crypto.randomUUID()}.${extensao}`;
      const buffer = await foto.arrayBuffer();

      const { error: uploadError } = await supabaseAdmin.storage
        .from("fotos-casais")
        .upload(caminho, buffer, {
          contentType: foto.type,
          upsert: false,
        });

      if (uploadError) {
        console.error("Erro no upload da foto:", uploadError);
        continue;
      }

      const { data: publicUrlData } = supabaseAdmin.storage
        .from("fotos-casais")
        .getPublicUrl(caminho);

      urlsFotos.push(publicUrlData.publicUrl);
    }

    // 3. Gerar slug único
    const slug = gerarSlug(nome1, nome2);

    // 3.5. Organizar a história livre em 4 seções com IA
    const historiaOrganizada = await organizarHistoriaComIA(historiaBruta);

    // 4. Salvar o casal
    const { error: casalError } = await supabaseAdmin.from("casais").insert({
      slug,
      nome1,
      nome2,
      data_inicio: dataInicio,
      frase,
      historia_bruta: historiaBruta,
      onde_se_conheceram: historiaOrganizada.onde_se_conheceram,
      primeiro_encontro: historiaOrganizada.primeiro_encontro,
      o_que_mais_amam: historiaOrganizada.o_que_mais_amam,
      sonho_juntos: historiaOrganizada.sonho_juntos,
      fotos: urlsFotos,
      musica_url: musicaUrl,
      tema,
      expira: !paraSempre,
    });

    if (casalError) {
      console.error("Erro ao salvar casal:", casalError);
      return NextResponse.json(
        { error: "Erro ao criar a página" },
        { status: 500 }
      );
    }

    // 5. Marcar o pedido como usado
    await supabaseAdmin
      .from("pedidos")
      .update({ usado: true })
      .eq("token", token);

    return NextResponse.json({ slug });
  } catch (err) {
    console.error("Erro ao criar página:", err);
    return NextResponse.json(
      { error: "Erro interno ao criar a página" },
      { status: 500 }
    );
  }
}
