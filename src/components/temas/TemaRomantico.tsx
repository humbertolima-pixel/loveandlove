"use client";

import { useState } from "react";
import Link from "next/link";
import type { Casal, Declaracao, Frase } from "@/lib/types";
import ContadorVivo from "@/components/ContadorVivo";
import SlideshowFotos from "@/components/SlideshowFotos";
import MosaicoFotos from "@/components/MosaicoFotos";
import SecaoAlbum from "@/components/SecaoAlbum";
import PlayerMusica, { detectarMidia } from "@/components/PlayerMusica";

export default function TemaRomantico({
  casal,
  fraseAleatoria,
  declaracaoAleatoria,
  comecou,
  onComecar,
}: {
  casal: Casal;
  fraseAleatoria: Frase | null;
  declaracaoAleatoria: Declaracao | null;
  comecou: boolean;
  onComecar: () => void;
}) {
  const fotos = casal.fotos;
  const fotoFundo = fotos[0];
  const midia = detectarMidia(casal.musica_url);

  const secoes = [
    { titulo: "onde nos conhecemos", texto: casal.onde_se_conheceram, foto: fotos[1] },
    { titulo: "nosso primeiro encontro", texto: casal.primeiro_encontro, foto: fotos[2] },
    { titulo: "o que eu mais amo em você", texto: casal.o_que_mais_amam, foto: fotos[3] },
    { titulo: "o que sonhamos juntos", texto: casal.sonho_juntos, foto: fotos[4] },
  ];

  return (
    <div className="rom-root">
      <style jsx>{`
        .rom-root {
          --rosa-claro: #fff0f3;
          --rosa: #f7c6d0;
          --rosa-escuro: #e08ba0;
          background: var(--rosa-claro);
          font-family: -apple-system, sans-serif;
          min-height: 100vh;
          overflow-x: hidden;
        }
        .rom-root :global(.font-display) { font-family: Georgia, serif; }
        .rom-root :global(.text-wine-text) { color: #5a2a3a; }

        @keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .rom-root :global(.fade-up) { animation: fadeInUp 0.8s ease-out both; }

        @keyframes pulse-soft { 0%, 100% { opacity: 1; } 50% { opacity: 0.75; } }
        .rom-root :global(.pulse-soft) { animation: pulse-soft 2.4s ease-in-out infinite; }

        @keyframes polaroid-in {
          from { opacity: 0; transform: translateY(20px) rotate(-2deg) scale(0.97); }
          to { opacity: 1; transform: translateY(0) rotate(0deg) scale(1); }
        }
        .rom-root :global(.polaroid-in) { animation: polaroid-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) both; }

        .capa { position: relative; min-height: 70vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 10vh 6vw 6vh; }
        .capa-fundo { position: absolute; inset: 0; background-size: cover; background-position: center; }
        .capa-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(247,198,208,.55), rgba(224,139,160,.75)); }
        .capa-conteudo { position: relative; z-index: 2; color: #fff; }
        .eyebrow { font-size: .7rem; letter-spacing: .25em; text-transform: uppercase; color: rgba(255,255,255,.85); margin-bottom: .6rem; }
        .capa h1 { font-family: Georgia, serif; font-style: italic; font-size: clamp(2.2rem, 7vw, 3.8rem); text-shadow: 0 6px 24px rgba(0,0,0,.3); }

        .play-area { margin-top: 1.8rem; display: flex; flex-direction: column; align-items: center; gap: .8rem; }
        .play-btn {
          width: 70px; height: 70px; border-radius: 50%; background: #fff;
          display: flex; align-items: center; justify-content: center; border: none; cursor: pointer;
          box-shadow: 0 8px 24px rgba(0,0,0,.25); transition: transform .25s;
        }
        .play-btn:hover { transform: scale(1.06); }
        .play-hint { font-size: .68rem; letter-spacing: .14em; text-transform: uppercase; color: rgba(255,255,255,.85); }

        .secao-frase { max-width: 600px; margin: 0 auto; padding: 3rem 6vw; text-align: center; }
        .secao-frase p { font-family: Georgia, serif; font-style: italic; font-size: 1.2rem; line-height: 1.6; color: #5a2a3a; }

        footer { text-align: center; padding: 2rem 1rem 3rem; font-size: .68rem; letter-spacing: .12em; text-transform: uppercase; color: var(--rosa-escuro); }
      `}</style>

      <section className="capa">
        {fotoFundo && <div className="capa-fundo" style={{ backgroundImage: `url(${fotoFundo})` }} />}
        <div className="capa-overlay" />
        <div className="capa-conteudo">
          <div className="eyebrow">uma história de amor entre</div>
          <h1>{casal.nome1} &amp; {casal.nome2}</h1>

          {!comecou ? (
            <div className="play-area">
              <button className="play-btn" aria-label="Tocar a nossa história" onClick={onComecar}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#e08ba0">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
              <span className="play-hint">toque para tocar a nossa história</span>
            </div>
          ) : (
            <p
              className="fade-up"
              style={{ marginTop: "1.6rem", fontStyle: "italic", maxWidth: "42ch", fontFamily: "Georgia, serif" }}
            >
              &ldquo;{casal.frase}&rdquo;
            </p>
          )}
        </div>
      </section>

      <main className="flex flex-col items-center gap-16 px-6 py-16">
        <ContadorVivo dataInicio={casal.data_inicio} />

        {fotos.length > 0 && <SlideshowFotos fotos={fotos} />}

        {secoes.map((s, i) => (
          <SecaoAlbum key={i} titulo={s.titulo} texto={s.texto} foto={s.foto} inverter={i % 2 === 1} />
        ))}

        {fraseAleatoria && (
          <div className="secao-frase fade-up">
            <p>&ldquo;{fraseAleatoria.texto}&rdquo;</p>
          </div>
        )}

        <MosaicoFotos fotos={fotos} inicio={5} quantidade={8} />

        {declaracaoAleatoria && (
          <div className="fade-up max-w-lg text-center px-6">
            <p style={{ fontSize: "1.6rem", marginBottom: ".6rem" }}>💕</p>
            <p className="font-body text-xs uppercase tracking-[0.2em] text-rose-600/70 mb-4">
              uma declaração pra vocês
            </p>
            <p className="font-display text-wine-text text-lg md:text-xl italic leading-relaxed">
              {declaracaoAleatoria.texto}
            </p>
          </div>
        )}

        <footer className="font-body text-xs flex items-center gap-1" style={{ color: "#e08ba0" }}>
          feito com{" "}
          <Link href="/" className="underline">
            LoveAndLove
          </Link>
          <span aria-hidden>💛</span>
        </footer>
      </main>

      {midia && (
        <div
          style={{
            position: "fixed",
            bottom: 14,
            right: 14,
            zIndex: 200,
            borderRadius: 10,
            overflow: "hidden",
            boxShadow: "0 6px 20px rgba(0,0,0,.25)",
          }}
        >
          <PlayerMusica midia={midia} ativo={comecou} tamanho="pequeno" />
        </div>
      )}
    </div>
  );
}
