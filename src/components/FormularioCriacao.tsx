"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import QRCode from "qrcode";

type EstadoToken = "verificando" | "valido" | "invalido" | "ja_usado";

interface Bumps {
  tema_exclusivo?: boolean;
  para_sempre?: boolean;
}

const MAX_FOTOS = 15;

/**
 * Gera uma imagem final em alta resolução (pronta para impressão,
 * ~10x12.5cm a 300dpi) com o QR code centralizado dentro de uma
 * moldura, com o nome do casal acima dele.
 */
async function gerarQrComMoldura(
  url: string,
  nome1: string,
  nome2: string
): Promise<string> {
  const LARGURA = 1200;
  const ALTURA = 1500;

  const canvas = document.createElement("canvas");
  canvas.width = LARGURA;
  canvas.height = ALTURA;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#F7EDE2";
  ctx.fillRect(0, 0, LARGURA, ALTURA);

  ctx.strokeStyle = "#C9A875";
  ctx.lineWidth = 6;
  ctx.strokeRect(40, 40, LARGURA - 80, ALTURA - 80);
  ctx.lineWidth = 1.5;
  ctx.strokeRect(70, 70, LARGURA - 140, ALTURA - 140);

  ctx.fillStyle = "#1A0E12";
  ctx.textAlign = "center";
  ctx.font = "italic 600 64px Georgia, serif";
  const nomeTexto = `${nome1 || ""} & ${nome2 || ""}`;
  ctx.fillText(nomeTexto, LARGURA / 2, 220, LARGURA - 200);

  const qrDataUrl = await QRCode.toDataURL(url, {
    width: 760,
    margin: 1,
    color: { dark: "#1A0E12", light: "#F7EDE2" },
  });
  const qrImg = await carregarImagem(qrDataUrl);
  const qrTamanho = 760;
  const qrX = (LARGURA - qrTamanho) / 2;
  const qrY = 300;
  ctx.drawImage(qrImg, qrX, qrY, qrTamanho, qrTamanho);

  ctx.font = "32px Georgia, serif";
  ctx.fillStyle = "#3D1F2B";
  ctx.fillText("aponte a câmera e reviva a história de vocês", LARGURA / 2, qrY + qrTamanho + 70, LARGURA - 160);

  ctx.font = "italic 28px Georgia, serif";
  ctx.fillStyle = "#C9A875";
  ctx.fillText("LoveAndLove", LARGURA / 2, ALTURA - 80);

  return canvas.toDataURL("image/png");
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
  const [buscaMusica, setBuscaMusica] = useState("");
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

  function abrirBuscaYoutube() {
    if (!buscaMusica.trim()) return;
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(buscaMusica)}`;
    window.open(url, "_blank");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro(null);
    setEnviando(true);

    const formData = new FormData(e.currentTarget);
    formData.set("token", token);
    formData.set("para_sempre", bumps.para_sempre ? "true" : "false");

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
        hint="do jeito que quiser — a gente cuida do resto"
      >
        <textarea
          name="historia"
          required
          maxLength={2000}
          rows={6}
          className="input-base resize-none"
          placeholder="Ex: A gente se conheceu numa festa em 2020, mas só começou a conversar de verdade meses depois. Em 2022 fomos morar juntos e desde então..."
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

      <div className="space-y-2">
        <span className="block text-cream/90 text-sm font-medium font-body">
          Música de vocês
        </span>
        <div className="flex gap-2">
          <input
            type="text"
            value={buscaMusica}
            onChange={(e) => setBuscaMusica(e.target.value)}
            placeholder="Nome da música ou artista"
            className="input-base flex-1"
          />
          <button
            type="button"
            onClick={abrirBuscaYoutube}
            className="px-4 py-2 rounded-xl bg-cream/10 text-cream text-sm font-body whitespace-nowrap hover:bg-cream/20 transition"
          >
            Buscar no YouTube
          </button>
        </div>
        <input
          type="url"
          name="musica_url"
          placeholder="Cole aqui o link que você encontrou (Spotify ou YouTube)"
          className="input-base"
        />
      </div>

      {bumps.tema_exclusivo && (
        <Campo label="Tema da página">
          <select name="tema" className="input-base">
            <option value="padrao">Padrão</option>
            <option value="netflix">Netflix</option>
            <option value="spotify">Spotify</option>
            <option value="instagram">Instagram</option>
          </select>
        </Campo>
      )}

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
