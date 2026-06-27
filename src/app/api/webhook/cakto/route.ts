import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { enviarCompraParaMeta } from "@/lib/meta-conversions-api";
import type { Bumps } from "@/lib/types";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Webhook da Cakto.
 *
 * Configurar na Cakto: Configurações > Webhooks > URL de destino
 * apontando para https://seudominio.com.br/api/webhook/cakto
 *
 * Evento esperado: compra aprovada (o nome exato do campo de status
 * pode variar — confirme no payload real de teste da Cakto e ajuste
 * a verificação abaixo se necessário).
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Validar a origem da requisição
    const secret = req.headers.get("x-cakto-secret");
    if (secret !== process.env.CAKTO_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const payload = await req.json();

    // 2. Confirmar que é um evento de compra aprovada
    //    (ajustar conforme o payload real da Cakto)
    const status = payload?.data?.status ?? payload?.status;
    if (status !== "approved" && status !== "paid") {
      // Outros eventos (pix_gerado, recusado, etc) — ignora sem erro
      return NextResponse.json({ recebido: true, ignorado: true });
    }

    const email: string | undefined =
      payload?.data?.customer?.email ?? payload?.customer?.email;
    const nomeComprador: string | undefined =
      payload?.data?.customer?.name ?? payload?.customer?.name;
    const planoId: string | undefined =
      payload?.data?.product?.name ?? payload?.product?.name ?? "padrao";
    // Valor pago — ajustar o caminho exato conforme o payload real da
    // Cakto confirmar (pode vir em centavos ou em reais, dependendo).
    const valorPago: number =
      Number(payload?.data?.amount ?? payload?.amount ?? 0) || 34.99;
    const idTransacao: string =
      payload?.data?.id ?? payload?.id ?? randomBytes(8).toString("hex");

    if (!email) {
      return NextResponse.json(
        { error: "Email do comprador não encontrado no payload" },
        { status: 400 }
      );
    }

    // 3. Identificar order bumps comprados
    //    (ajustar a leitura conforme como a Cakto envia itens/bumps)
    const itensComprados: string[] =
      payload?.data?.items?.map((i: { name: string }) => i.name) ?? [];

    const bumps: Bumps = {
      tema_exclusivo: itensComprados.some((i) =>
        i.toLowerCase().includes("tema")
      ),
      para_sempre: itensComprados.some((i) =>
        i.toLowerCase().includes("para sempre") || i.toLowerCase().includes("sem expirar")
      ),
    };

    // 4. Gerar token único de acesso ao formulário de criação
    const token = randomBytes(16).toString("hex");

    const { error: dbError } = await supabaseAdmin.from("pedidos").insert({
      email,
      nome_comprador: nomeComprador ?? "Cliente LoveAndLove",
      token,
      plano: planoId,
      bumps,
      usado: false,
    });

    if (dbError) {
      console.error("Erro ao salvar pedido:", dbError);
      return NextResponse.json(
        { error: "Erro ao registrar pedido" },
        { status: 500 }
      );
    }

    // 5. Enviar email com o link de criação
    const linkCriacao = `${process.env.NEXT_PUBLIC_SITE_URL}/criar?token=${token}`;

    await resend.emails.send({
      from: "LoveAndLove <oi@loveandlove.com.br>",
      to: email,
      subject: "Seu link para criar a página de vocês 💛",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
          <h1 style="color: #3D1F2B;">Falta só uma etapa</h1>
          <p>Oi${nomeComprador ? `, ${nomeComprador}` : ""}! Seu pagamento foi confirmado.</p>
          <p>Agora é só preencher os dados de vocês dois (nomes, data, fotos e a música) para gerar a página e o QR code.</p>
          <p style="margin: 24px 0;">
            <a href="${linkCriacao}" style="background: #C9A875; color: #1A0E12; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
              Criar nossa página
            </a>
          </p>
          <p style="color: #888; font-size: 13px;">Se o botão não funcionar, copie e cole este link: ${linkCriacao}</p>
        </div>
      `,
    });

    // 6. Enviar evento de Purchase pro Meta (Conversions API), sem
    //    bloquear o fluxo principal se isso falhar.
    await enviarCompraParaMeta({
      email,
      valor: valorPago,
      idTransacao,
    });

    return NextResponse.json({ recebido: true, token });
  } catch (err) {
    console.error("Erro no webhook da Cakto:", err);
    return NextResponse.json(
      { error: "Erro interno ao processar webhook" },
      { status: 500 }
    );
  }
}
