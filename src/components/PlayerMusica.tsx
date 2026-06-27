"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
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
    const id = m1 ? m1[1] : m2 ? m2[1] : null;
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
 * `iniciar` deve ser chamado de dentro de um onClick do usuário.
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
  const [containerId] = useState(
    () => `yt-player-${Math.random().toString(36).slice(2)}`
  );
  const playerCriado = useRef(false);

  useEffect(() => {
    if (!ativo || !midia || midia.tipo !== "youtube" || playerCriado.current) {
      return;
    }
    playerCriado.current = true;

    carregarYoutubeApi(() => {
      new window.YT.Player(containerId, {
        videoId: midia.id,
        playerVars: { autoplay: 1, playsinline: 1 },
        events: {
          onReady: (event) => {
            event.target.playVideo();
          },
        },
      });
    });
  }, [ativo, midia, containerId]);

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
        }}
      >
        <div id={containerId} style={{ width: "100%", height: "100%" }} />
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
