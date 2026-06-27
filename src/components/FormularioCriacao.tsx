"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import QRCode from "qrcode";

type EstadoToken = "verificando" | "valido" | "invalido" | "ja_usado";

interface Bumps {
  tema_exclusivo?: boolean;
  para_sempre?: boolean;
}

export default function FormularioCriacao({ token }: { token: string }) {
  const [estadoToken, setEstadoToken] = useState<EstadoToken>(() =>
    token ? "verificando" : "invalido"
  );
  const [bumps, setBumps] = useState<Bumps>({});
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
      const qrCodeDataUrl = await QRCode.toDataURL(urlPagina, {
        width: 480,
        margin: 2,
        color: { dark: "#1A0E12", light: "#F7EDE2" },
      });

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
          className="mx-auto rounded-2xl mb-4 w-64 h-64"
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

      <Campo label="Fotos de vocês" hint="até 6 fotos">
        <input
          type="file"
          name="fotos"
          accept="image/*"
          multiple
          required
          className="input-base file:text-cream file:mr-3"
        />
      </Campo>

      <Campo
        label="Link de uma música"
        hint="Spotify ou YouTube — cole o link da faixa"
      >
        <input
          type="url"
          name="musica_url"
          placeholder="https://open.spotify.com/track/..."
          className="input-base"
        />
      </Campo>

      {bumps.tema_exclusivo && (
        <Campo label="Tema da página">
          <select name="tema" className="input-base">
            <option value="padrao">Padrão</option>
            <option value="netflix">Estilo Netflix</option>
            <option value="polaroid-vintage">Polaroid vintage</option>
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
