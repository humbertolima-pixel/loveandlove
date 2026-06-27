"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import QRCode from "qrcode";
import { detectarMidia } from "@/components/PlayerMusica";
import BuscaMusica from "@/components/BuscaMusica";

type EstadoToken = "verificando" | "valido" | "invalido" | "ja_usado";

interface Bumps {
  tema_exclusivo?: boolean;
  para_sempre?: boolean;
}

const MAX_FOTOS = 15;

/**
 * Gera uma imagem final em alta resolução (pronta para impressão,
 * ~10x12.5cm a 300dpi) no estilo do cartão LoveAndLove: logo no topo,
 * nome do casal, QR code com moldura decorada nos cantos, e a frase
 * "Feito com amor para o amor da minha vida" no rodapé.
 */
async function gerarQrComMoldura(
  url: string,
  nome1: string,
  nome2: string
): Promise<string> {
  const LARGURA = 1200;
  const ALTURA = 1500;
  const ROSA_ESCURO = "#C9536B";
  const DOURADO = "#C9974A";
  const VINHO_TEXTO = "#5A2A3A";
  const FUNDO = "#FFFAF9";

  const canvas = document.createElement("canvas");
  canvas.width = LARGURA;
  canvas.height = ALTURA;
  const ctx = canvas.getContext("2d")!;

  // Fundo
  ctx.fillStyle = FUNDO;
  ctx.fillRect(0, 0, LARGURA, ALTURA);

  // Borda externa fina
  ctx.strokeStyle = DOURADO;
  ctx.lineWidth = 3;
  ctx.strokeRect(30, 30, LARGURA - 60, ALTURA - 60);

  // === Logo: coração desenhado + "LoveAndLove" ===
  const logoY = 140;
  desenharCoracaoLogo(ctx, LARGURA / 2 - 130, logoY, 36, ROSA_ESCURO);
  ctx.fillStyle = "#1A1A1A";
  ctx.textAlign = "left";
  ctx.font = "bold 52px Georgia, serif";
  ctx.fillText("LoveAndLove", LARGURA / 2 - 80, logoY + 18);

  // Linha decorativa com coraçãozinho
  const linhaY = logoY + 60;
  ctx.strokeStyle = DOURADO;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(LARGURA / 2 - 200, linhaY);
  ctx.lineTo(LARGURA / 2 - 24, linhaY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(LARGURA / 2 + 24, linhaY);
  ctx.lineTo(LARGURA / 2 + 200, linhaY);
  ctx.stroke();
  desenharCoracaoLogo(ctx, LARGURA / 2 - 12, linhaY - 8, 12, DOURADO);

  // Nome do casal
  ctx.fillStyle = VINHO_TEXTO;
  ctx.textAlign = "center";
  ctx.font = "italic 600 56px Georgia, serif";
  const nomeTexto = `${nome1 || ""} & ${nome2 || ""}`;
  ctx.fillText(nomeTexto, LARGURA / 2, linhaY + 90, LARGURA - 160);

  // === QR code com moldura decorada nos cantos (sem retângulo completo) ===
  const qrTamanho = 680;
  const qrX = (LARGURA - qrTamanho) / 2;
  const qrY = 340;

  const qrDataUrl = await QRCode.toDataURL(url, {
    width: qrTamanho,
    margin: 1,
    color: { dark: VINHO_TEXTO, light: FUNDO },
  });
  const qrImg = await carregarImagem(qrDataUrl);

  // Cantos decorados (estilo "moldura de convite")
  const margemMoldura = 34;
  desenharCantoDecorado(ctx, qrX - margemMoldura, qrY - margemMoldura, 1, 1, DOURADO);
  desenharCantoDecorado(ctx, qrX + qrTamanho + margemMoldura, qrY - margemMoldura, -1, 1, DOURADO);
  desenharCantoDecorado(ctx, qrX - margemMoldura, qrY + qrTamanho + margemMoldura, 1, -1, DOURADO);
  desenharCantoDecorado(ctx, qrX + qrTamanho + margemMoldura, qrY + qrTamanho + margemMoldura, -1, -1, DOURADO);

  ctx.drawImage(qrImg, qrX, qrY, qrTamanho, qrTamanho);

  // === Frase final ===
  const fraseY = qrY + qrTamanho + 120;
  ctx.fillStyle = ROSA_ESCURO;
  ctx.font = "italic 600 40px Georgia, serif";
  ctx.fillText("Feito com amor", LARGURA / 2, fraseY, LARGURA - 140);
  ctx.fillText("para o amor da minha vida", LARGURA / 2, fraseY + 54, LARGURA - 140);

  desenharCoracaoLogo(ctx, LARGURA / 2 - 16, fraseY + 90, 32, DOURADO);

  return canvas.toDataURL("image/png");
}

/** Desenha um pequeno ícone de coração no canvas, usado na logo e decorações. */
function desenharCoracaoLogo(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  tamanho: number,
  cor: string
) {
  ctx.save();
  ctx.fillStyle = cor;
  ctx.beginPath();
  const topCurveHeight = tamanho * 0.3;
  ctx.moveTo(x, y + topCurveHeight);
  ctx.bezierCurveTo(x, y, x - tamanho / 2, y, x - tamanho / 2, y + topCurveHeight);
  ctx.bezierCurveTo(
    x - tamanho / 2,
    y + (tamanho + topCurveHeight) / 2,
    x,
    y + (tamanho + topCurveHeight) / 1.3,
    x,
    y + tamanho
  );
  ctx.bezierCurveTo(
    x,
    y + (tamanho + topCurveHeight) / 1.3,
    x + tamanho / 2,
    y + (tamanho + topCurveHeight) / 2,
    x + tamanho / 2,
    y + topCurveHeight
  );
  ctx.bezierCurveTo(x + tamanho / 2, y, x, y, x, y + topCurveHeight);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/** Desenha um canto decorado tipo "L" nas extremidades da moldura do QR. */
function desenharCantoDecorado(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  dirX: 1 | -1,
  dirY: 1 | -1,
  cor: string
) {
  const tamanho = 54;
  ctx.save();
  ctx.strokeStyle = cor;
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x, y + tamanho * dirY);
  ctx.lineTo(x, y);
  ctx.lineTo(x + tamanho * dirX, y);
  ctx.stroke();
  ctx.restore();
}

function carregarImagem(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export default function FormularioCriacao({ token }: { token: string }) {
  const [estadoToken, setEstadoToken] = useState<EstadoToken>(() =>
    token ? "verificando" : "invalido"
  );
  const [bumps, setBumps] = useState<Bumps>({});
  const [musicaUrl, setMusicaUrl] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [resultado, setResultado] = useState<{
    slug: string;
    qrCodeDataUrl: string;
  } | null>(null);

  useEffect(() => {
    if (!token) return;
    fetch(`/api/validar-token?token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.valido) {
          setBumps(data.bumps ?? {});
          setEstadoToken("valido");
        } else if (data.motivo === "ja_usado") {
          setEstadoToken("ja_usado");
        } else {
          setEstadoToken("invalido");
        }
      })
      .catch(() => setEstadoToken("invalido"));
  }, [token]);

  const musicaUrlLimpa = musicaUrl.trim();
  const avisoMusica =
    musicaUrlLimpa && !detectarMidia(musicaUrlLimpa)
      ? "Esse link não parece ser do YouTube ou Spotify. Confira se copiou certinho."
      : null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro(null);
    setEnviando(true);

    const formData = new FormData(e.currentTarget);
    formData.set("token", token);
    formData.set("para_sempre", bumps.para_sempre ? "true" : "false");
    formData.set("musica_url", musicaUrlLimpa);

    try {
      const res = await fetch("/api/criar-pagina", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setErro(data.error ?? "Algo deu errado. Tenta de novo.");
        setEnviando(false);
        return;
      }

      const siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;
      const urlPagina = `${siteUrl}/c/${data.slug}`;
      const qrCodeDataUrl = await gerarQrComMoldura(
        urlPagina,
        formData.get("nome1") as string,
        formData.get("nome2") as string
      );

      setResultado({ slug: data.slug, qrCodeDataUrl });
    } catch {
      setErro("Algo deu errado. Tenta de novo.");
    } finally {
      setEnviando(false);
    }
  }

  if (estadoToken === "verificando") {
    return (
      <p className="text-cream/70 text-center font-body">Verificando seu link...</p>
    );
  }

  if (estadoToken === "invalido") {
    return (
      <div className="text-center fade-up">
        <p className="font-display text-2xl text-cream mb-2">Este link não é válido</p>
        <p className="text-cream/70 font-body">
          Verifique se você copiou o link completo do email, ou{" "}
          <Link href="/" className="text-gold underline">
            volte para o início
          </Link>
          .
        </p>
      </div>
    );
  }

  if (estadoToken === "ja_usado") {
    return (
      <div className="text-center fade-up">
        <p className="font-display text-2xl text-cream mb-2">Este link já foi usado</p>
        <p className="text-cream/70 font-body">
          Sua página já foi criada. Se você perdeu o QR code, fale com a gente pelo WhatsApp.
        </p>
      </div>
    );
  }

  if (resultado) {
    const siteUrl =
      typeof window !== "undefined" ? window.location.origin : "";
    return (
      <div className="text-center fade-up max-w-md mx-auto">
        <p className="font-display text-3xl text-cream mb-2">
          Está pronto! 💛
        </p>
        <p className="text-cream/70 font-body mb-6">
          Sua página já está no ar. Baixe o QR code para usar onde quiser.
        </p>
        <img
          src={resultado.qrCodeDataUrl}
          alt="QR code da sua página"
          className="mx-auto rounded-2xl mb-4 w-72 shadow-2xl"
        />
        <a
          href={resultado.qrCodeDataUrl}
          download={`qr-code-${resultado.slug}.png`}
          className="inline-block bg-gold text-wine-black font-body font-semibold px-6 py-3 rounded-full mb-3 hover:opacity-90 transition"
        >
          Baixar QR code (PNG)
        </a>
        <p className="font-body text-sm">
          <a
            href={`/c/${resultado.slug}`}
            target="_blank"
            className="text-rose underline"
          >
            Ver sua página: {siteUrl}/c/{resultado.slug}
          </a>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto fade-up space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Campo label="Seu nome">
          <input name="nome1" required maxLength={40} className="input-base" />
        </Campo>
        <Campo label="Nome da outra pessoa">
          <input name="nome2" required maxLength={40} className="input-base" />
        </Campo>
      </div>

      <Campo label="Data em que começaram">
        <input
          type="date"
          name="data_inicio"
          required
          className="input-base"
        />
      </Campo>

      <Campo label="Uma frase que diz tudo" hint="até 300 caracteres">
        <textarea
          name="frase"
          required
          maxLength={300}
          rows={3}
          className="input-base resize-none"
          placeholder="Ex: De todas as histórias que eu já vivi, essa é a minha favorita."
        />
      </Campo>

      <Campo
        label="Contem a história de vocês"
        hint="onde se conheceram, o primeiro encontro, o que mais amam, sonhos juntos — escreva do seu jeito, a gente organiza"
      >
        <textarea
          name="historia"
          required
          maxLength={2000}
          rows={7}
          className="input-base resize-none"
          placeholder="Ex: A gente se conheceu numa festa de aniversário de um amigo em comum, em 2020. Só fomos conversar de verdade meses depois, num café que ficamos horas. O que eu mais amo nela é o jeito que ela me faz rir até nos dias difíceis. A gente sonha em morar à beira-mar um dia."
        />
      </Campo>

      <Campo label="Fotos de vocês" hint={`até ${MAX_FOTOS} fotos`}>
        <input
          type="file"
          name="fotos"
          accept="image/*"
          multiple
          required
          className="input-base file:text-cream file:mr-3"
        />
      </Campo>

      <BuscaMusica musicaUrl={musicaUrl} setMusicaUrl={setMusicaUrl} avisoMusica={avisoMusica} />

      {bumps.para_sempre && (
        <p className="text-gold font-body text-sm text-center">
          ✓ Sua página nunca vai expirar.
        </p>
      )}

      {erro && (
        <p className="text-rose font-body text-sm text-center">{erro}</p>
      )}

      <button
        type="submit"
        disabled={enviando}
        className="w-full bg-gold text-wine-black font-body font-semibold py-3 rounded-full hover:opacity-90 transition disabled:opacity-50"
      >
        {enviando ? "Criando sua página..." : "Criar nossa página"}
      </button>
    </form>
  );
}

function Campo({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block font-body">
      <span className="block text-cream/90 text-sm font-medium mb-1.5">
        {label}
        {hint && <span className="text-cream/50"> · {hint}</span>}
      </span>
      {children}
    </label>
  );
}
