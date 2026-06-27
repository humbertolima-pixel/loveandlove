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

function extrairYoutubeId(url: string | null): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/
  );
  return match ? match[1] : null;
}

function extrairSpotifyEmbed(url: string | null): string | null {
  if (!url) return null;
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

export default function TelaAbertura({
  nome1,
  nome2,
  musicaUrl,
  onComecar,
}: {
  nome1: string;
  nome2: string;
  musicaUrl: string | null;
  onComecar: () => void;
}) {
  const [tocando, setTocando] = useState(false);
  const [containerId] = useState(
    () => `yt-abertura-${Math.random().toString(36).slice(2)}`
  );
  const playerRef = useRef<{ playVideo: () => void } | null>(null);

  const youtubeId = extrairYoutubeId(musicaUrl);
  const spotifyEmbed = extrairSpotifyEmbed(musicaUrl);

  useEffect(() => {
    if (!tocando || !youtubeId) return;

    carregarYoutubeApi(() => {
      const player = new window.YT.Player(containerId, {
        videoId: youtubeId,
        playerVars: { autoplay: 1, playsinline: 1 },
        events: {
          onReady: (event) => {
            event.target.playVideo();
          },
        },
      });
      playerRef.current = player as { playVideo: () => void };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tocando, youtubeId]);

  function handlePlay() {
    setTocando(true);
    onComecar();
  }

  return (
    <section className="min-h-screen bg-wine flex flex-col items-center justify-center gap-8 px-6 py-16 relative">
      <div className="fade-up text-center">
        <p className="font-body text-xs uppercase tracking-[0.25em] text-rose/80 mb-3">
          uma história só de
        </p>
        <h1 className="font-display text-3xl md:text-5xl text-cream italic">
          {nome1} <span className="text-gold">&</span> {nome2}
        </h1>
      </div>

      <div className="fade-up w-full max-w-md aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black/30 relative">
        {!tocando && (
          <button
            onClick={handlePlay}
            className="absolute inset-0 z-10 flex items-center justify-center bg-wine-black/40 hover:bg-wine-black/30 transition group"
            aria-label="Tocar"
          >
            <span className="w-20 h-20 rounded-full bg-gold flex items-center justify-center group-hover:scale-105 transition">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="#1A0E12">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        )}

        {youtubeId ? (
          <div id={containerId} style={{ width: "100%", height: "100%" }} />
        ) : spotifyEmbed ? (
          tocando ? (
            <iframe
              src={`${spotifyEmbed}&autoplay=1`}
              width="100%"
              height="100%"
              style={{ border: "none" }}
              allow="autoplay; encrypted-media"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-cream/60 font-body text-sm">
                toque para tocar a nossa música
              </span>
            </div>
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-cream/40 font-body text-sm">
              {nome1} & {nome2}
            </span>
          </div>
        )}
      </div>

      {tocando && (
        <button
          onClick={() =>
            document
              .getElementById("conteudo-principal")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="fade-up flex flex-col items-center gap-2 text-cream/60 font-body text-xs uppercase tracking-[0.15em] mt-4 pulse-soft"
        >
          role pra baixo
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </button>
      )}
    </section>
  );
}
