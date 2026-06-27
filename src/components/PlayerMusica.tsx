"use client";

import { useEffect, useState } from "react";

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

function extrairYoutubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/
  );
  return match ? match[1] : null;
}

function extrairSpotifyEmbed(url: string): string | null {
  const match = url.match(
    /open\.spotify\.com\/(track|album|playlist)\/([a-zA-Z0-9]+)/
  );
  if (!match) return null;
  return `https://open.spotify.com/embed/${match[1]}/${match[2]}?theme=0`;
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
 * Player de música robusto.
 *
 * Para YouTube: usa a IFrame API oficial e chama playVideo()
 * explicitamente depois que o player está pronto — isso é respeitado
 * pelos navegadores porque acontece em resposta direta ao clique do
 * usuário em "Tocar a nossa história", diferente de simplesmente
 * passar autoplay=1 na URL do iframe (que muitos navegadores ignoram
 * silenciosamente vindo de outra origem).
 *
 * Para Spotify: o embed deles já gerencia autoplay internamente de
 * forma mais confiável quando carregado após interação do usuário.
 */
export default function PlayerMusica({
  url,
  autoplay = false,
}: {
  url: string;
  autoplay?: boolean;
}) {
  const [containerId] = useState(
    () => `yt-player-${Math.random().toString(36).slice(2)}`
  );
  const [pronto, setPronto] = useState(false);

  const youtubeId = extrairYoutubeId(url);
  const spotifyEmbed = extrairSpotifyEmbed(url);

  useEffect(() => {
    if (!autoplay || !youtubeId) return;

    carregarYoutubeApi(() => {
      new window.YT.Player(containerId, {
        videoId: youtubeId,
        playerVars: { autoplay: 1, controls: 0, playsinline: 1 },
        events: {
          onReady: (event) => {
            event.target.playVideo();
            setPronto(true);
          },
        },
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplay, youtubeId]);

  if (youtubeId) {
    return (
      <div className="fade-up rounded-xl overflow-hidden mx-auto max-w-sm aspect-video bg-black/20">
        <div id={containerId} style={{ width: "100%", height: "100%" }} />
        {!pronto && autoplay && (
          <p className="text-center text-cream/40 font-body text-xs mt-2">
            carregando música...
          </p>
        )}
      </div>
    );
  }

  if (spotifyEmbed) {
    const src = autoplay ? `${spotifyEmbed}&autoplay=1` : spotifyEmbed;
    return (
      <div className="fade-up rounded-xl overflow-hidden mx-auto max-w-sm">
        <iframe
          key={src}
          src={src}
          width="100%"
          height="152"
          style={{ border: "none" }}
          allow="autoplay; encrypted-media"
          loading="lazy"
        />
      </div>
    );
  }

  return null;
}
