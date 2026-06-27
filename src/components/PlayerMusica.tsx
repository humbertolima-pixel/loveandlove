"use client";

import { useRef, useState } from "react";

declare global {
  interface Window {
    YT: {
      Player: new (
        elementOrId: string | HTMLElement,
        config: {
          videoId: string;
          playerVars?: Record<string, number>;
          events?: {
            onReady?: (event: { target: { playVideo: () => void } }) => void;
          };
        }
      ) => unknown;
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

export interface MidiaDetectada {
  tipo: "youtube" | "spotify";
  id: string;
}

export function detectarMidia(link: string | null): MidiaDetectada | null {
  if (!link) return null;

  if (link.includes("spotify.com")) {
    const match = link.match(/track\/([a-zA-Z0-9]+)/);
    return match ? { tipo: "spotify", id: match[1] } : null;
  }

  if (link.includes("youtube.com") || link.includes("youtu.be")) {
    const m1 = link.match(/[?&]v=([^&]+)/);
    const m2 = link.match(/youtu\.be\/([^?&]+)/);
    const m3 = link.match(/youtube\.com\/shorts\/([^?&]+)/);
    const id = m1 ? m1[1] : m2 ? m2[1] : m3 ? m3[1] : null;
    return id ? { tipo: "youtube", id } : null;
  }

  return null;
}

let apiCarregada = false;
let apiCarregando = false;
const callbacksEspera: (() => void)[] = [];

function carregarYoutubeApi(callback: () => void) {
  if (apiCarregada) {
    callback();
    return;
  }
  callbacksEspera.push(callback);
  if (apiCarregando) return;
  apiCarregando = true;

  const script = document.createElement("script");
  script.src = "https://www.youtube.com/iframe_api";
  document.body.appendChild(script);

  window.onYouTubeIframeAPIReady = () => {
    apiCarregada = true;
    callbacksEspera.forEach((cb) => cb());
    callbacksEspera.length = 0;
  };
}

/**
 * Player de música robusto e visível.
 *
 * Para YouTube: usa a IFrame API oficial e chama playVideo()
 * explicitamente dentro do mesmo gesto de clique do usuário — isso é
 * respeitado pelos navegadores, diferente de só colocar autoplay=1 na
 * URL de um iframe escondido (que é silenciosamente bloqueado).
 *
 * Importante: o player só é criado depois que o elemento alvo já
 * está garantidamente no DOM (via callback ref), nunca antes — criar
 * o YT.Player apontando para um id que ainda não existe falha em
 * silêncio, sem erro no console, o que parece "não fazer nada".
 */
export default function PlayerMusica({
  midia,
  ativo,
  tamanho = "pequeno",
}: {
  midia: MidiaDetectada | null;
  ativo: boolean;
  tamanho?: "pequeno" | "medio";
}) {
  const playerCriado = useRef(false);
  const [erro, setErro] = useState<string | null>(null);

  function montarPlayerYoutube(el: HTMLDivElement | null) {
    if (!el || !midia || midia.tipo !== "youtube" || playerCriado.current) {
      return;
    }
    playerCriado.current = true;

    carregarYoutubeApi(() => {
      try {
        new window.YT.Player(el, {
          videoId: midia.id,
          playerVars: { autoplay: 1, playsinline: 1 },
          events: {
            onReady: (event) => {
              event.target.playVideo();
            },
          },
        });
      } catch {
        setErro("Não foi possível carregar o vídeo.");
      }
    });
  }

  if (!ativo || !midia) return null;

  const dimensoes =
    tamanho === "pequeno"
      ? { width: 160, height: 90 }
      : { width: 320, height: 180 };

  if (midia.tipo === "youtube") {
    return (
      <div
        style={{
          width: dimensoes.width,
          height: dimensoes.height,
          borderRadius: 10,
          overflow: "hidden",
          background: "rgba(0,0,0,0.3)",
        }}
      >
        {erro ? (
          <p style={{ color: "#fff", fontSize: 11, padding: 8 }}>{erro}</p>
        ) : (
          <div ref={montarPlayerYoutube} style={{ width: "100%", height: "100%" }} />
        )}
      </div>
    );
  }

  // Spotify: o embed deles gerencia autoplay de forma confiável quando
  // carregado após interação do usuário.
  return (
    <iframe
      src={`https://open.spotify.com/embed/track/${midia.id}?utm_source=generator&autoplay=1`}
      width={tamanho === "pequeno" ? 280 : 320}
      height={80}
      style={{ border: "none", borderRadius: 10 }}
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
    />
  );
}
