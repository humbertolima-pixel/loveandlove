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
 * Player de música robusto.
 *
 * Para YouTube: usa a IFrame API oficial e chama playVideo()
 * explicitamente dentro do mesmo gesto de clique do usuário — isso é
 * respeitado pelos navegadores, diferente de só colocar autoplay=1 na
 * URL de um iframe escondido (que é silenciosamente bloqueado).
 *
 * Importante sobre tamanho: o YouTube exige um tamanho mínimo pro
 * player (abaixo disso, ele sempre mostra os controles nativos
 * sobrepostos, incluindo o link "abrir no YouTube" — clicar nessa
 * área tira a pessoa da nossa página). Por isso o player nunca é
 * menor que 200x113 (mínimo absoluto do YouTube), usamos
 * `controls: 0` pra esconder os controles deles, e colocamos uma
 * camada transparente por cima que bloqueia qualquer clique no
 * player — assim ele só toca o som, sem nenhuma interação possível
 * que leve a pessoa pra fora da página.
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
          playerVars: {
            autoplay: 1,
            playsinline: 1,
            controls: 0, // remove os controles nativos do YouTube
            disablekb: 1, // desabilita atalhos de teclado
            modestbranding: 1, // reduz a marca do YouTube (não remove 100%, mas minimiza)
            rel: 0,
            fs: 0, // desabilita botão de tela cheia
          },
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

  // 200x113 é o tamanho mínimo absoluto exigido pelo YouTube para o
  // player embutido funcionar corretamente sem forçar controles extras.
  const dimensoes =
    tamanho === "pequeno"
      ? { width: 200, height: 113 }
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
          position: "relative",
        }}
      >
        {erro ? (
          <p style={{ color: "#fff", fontSize: 11, padding: 8 }}>{erro}</p>
        ) : (
          <>
            <div
              ref={montarPlayerYoutube}
              style={{ width: "100%", height: "100%", pointerEvents: "none" }}
            />
            {/* Camada transparente por cima: bloqueia qualquer clique no
                player (incluindo nos controles nativos escondidos do
                YouTube), evitando que a pessoa seja levada pra fora da
                página por engano. O áudio continua tocando normalmente,
                já que isso não pausa o player, só impede interação. */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                cursor: "default",
              }}
              onClick={(e) => e.preventDefault()}
              aria-hidden
            />
          </>
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
