"use client";

import { useState } from "react";

interface ResultadoBusca {
  videoId: string;
  titulo: string;
  canal: string;
  thumbnail: string;
}

export default function BuscaMusica({
  musicaUrl,
  setMusicaUrl,
  avisoMusica,
}: {
  musicaUrl: string;
  setMusicaUrl: (v: string) => void;
  avisoMusica: string | null;
}) {
  const [termo, setTermo] = useState("");
  const [resultados, setResultados] = useState<ResultadoBusca[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [usarFallback, setUsarFallback] = useState(false);
  const [videoSelecionado, setVideoSelecionado] = useState<string | null>(null);

  async function buscar() {
    if (!termo.trim()) return;
    setBuscando(true);
    setResultados([]);

    try {
      const res = await fetch(`/api/buscar-musica?q=${encodeURIComponent(termo)}`);
      const data = await res.json();

      if (data.quotaExcedida) {
        setUsarFallback(true);
        return;
      }

      setResultados(data.resultados ?? []);
    } catch {
      setUsarFallback(true);
    } finally {
      setBuscando(false);
    }
  }

  function escolherResultado(r: ResultadoBusca) {
    setMusicaUrl(`https://www.youtube.com/watch?v=${r.videoId}`);
    setVideoSelecionado(r.videoId);
    setResultados([]);
  }

  function abrirBuscaYoutubeExterna() {
    if (!termo.trim()) return;
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(termo)}`;
    window.open(url, "_blank");
  }

  return (
    <div className="space-y-2">
      <span className="block text-cream/90 text-sm font-medium font-body">
        Música de vocês
      </span>

      <div className="flex gap-2">
        <input
          type="text"
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              usarFallback ? abrirBuscaYoutubeExterna() : buscar();
            }
          }}
          placeholder="Nome da música ou artista"
          className="input-base flex-1"
        />
        <button
          type="button"
          onClick={usarFallback ? abrirBuscaYoutubeExterna : buscar}
          disabled={buscando}
          className="px-4 py-2 rounded-xl bg-cream/10 text-cream text-sm font-body whitespace-nowrap hover:bg-cream/20 transition disabled:opacity-50"
        >
          {buscando ? "Buscando..." : usarFallback ? "Buscar no YouTube" : "Buscar"}
        </button>
      </div>

      {usarFallback && (
        <p className="text-cream/50 font-body text-xs">
          Nossa busca chegou ao limite por hoje — esse botão vai te levar pro
          YouTube. Copie o link da música e cole no campo abaixo.
        </p>
      )}

      {resultados.length > 0 && (
        <div className="space-y-1.5 max-h-72 overflow-y-auto rounded-xl border border-gold/20 p-2">
          {resultados.map((r) => (
            <button
              key={r.videoId}
              type="button"
              onClick={() => escolherResultado(r)}
              className={`w-full flex gap-3 items-center p-2 rounded-lg text-left transition hover:bg-cream/10 ${
                videoSelecionado === r.videoId ? "bg-gold/15" : ""
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={r.thumbnail}
                alt=""
                className="w-16 h-12 rounded object-cover shrink-0"
              />
              <div className="min-w-0">
                <p className="text-cream text-sm font-body truncate">{r.titulo}</p>
                <p className="text-cream/50 text-xs font-body truncate">{r.canal}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      <input
        type="text"
        name="musica_url"
        value={musicaUrl}
        onChange={(e) => setMusicaUrl(e.target.value)}
        placeholder="Ou cole aqui o link direto (Spotify ou YouTube)"
        className="input-base"
      />
      {avisoMusica && (
        <p className="text-rose font-body text-xs">{avisoMusica}</p>
      )}
    </div>
  );
}
