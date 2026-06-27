"use client";

import Link from "next/link";
import type { Casal, Declaracao, Frase } from "@/lib/types";
import ContadorVivo from "@/components/ContadorVivo";
import SlideshowFotos from "@/components/SlideshowFotos";
import MosaicoFotos from "@/components/MosaicoFotos";
import SecaoPergunta from "@/components/SecaoPergunta";
import PlayerMusica, { detectarMidia } from "@/components/PlayerMusica";

export default function TemaPadrao({
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
  const midia = detectarMidia(casal.musica_url);

  return (
    <div className="bg-wine min-h-screen">
      {!comecou && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-wine px-6">
          <p className="fade-up font-body text-xs uppercase tracking-[0.25em] text-rose/80 text-center">
            uma história só de
          </p>
          <h1 className="fade-up font-display text-3xl md:text-5xl text-cream italic text-center">
            {casal.nome1} <span className="text-gold">&</span> {casal.nome2}
          </h1>
          <button
            onClick={onComecar}
            className="fade-up flex items-center gap-3 bg-gold text-wine-black font-body font-semibold px-8 py-4 rounded-full hover:opacity-90 transition pulse-soft"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
            Tocar a nossa história
          </button>
        </div>
      )}

      <main className="flex flex-col items-center gap-20 px-6 py-24">
        <ContadorVivo dataInicio={casal.data_inicio} />

        {fotos.length > 0 && <SlideshowFotos fotos={fotos} />}

        <div className="flex flex-col items-center gap-3 text-center max-w-md">
          <p className="font-display text-xl md:text-2xl text-cream/90 italic leading-relaxed fade-up">
            &ldquo;{casal.frase}&rdquo;
          </p>
          {fraseAleatoria && (
            <p className="font-body text-sm text-rose/70 italic fade-up">
              {fraseAleatoria.texto}
            </p>
          )}
        </div>

        <SecaoPergunta titulo="Onde se conheceram" texto={casal.onde_se_conheceram} foto={fotos[1]} />
        <SecaoPergunta titulo="O primeiro encontro" texto={casal.primeiro_encontro} foto={fotos[2]} inverter />
        <SecaoPergunta titulo="O que mais amam um no outro" texto={casal.o_que_mais_amam} foto={fotos[3]} />
        <SecaoPergunta titulo="Um sonho que têm juntos" texto={casal.sonho_juntos} foto={fotos[4]} inverter />

        <MosaicoFotos fotos={fotos} inicio={5} quantidade={6} />

        {declaracaoAleatoria && (
          <div className="fade-up max-w-lg text-center">
            <p className="font-body text-xs uppercase tracking-[0.2em] text-gold/80 mb-4">
              uma declaração pra vocês
            </p>
            <p className="font-display text-lg md:text-xl text-cream italic leading-relaxed">
              {declaracaoAleatoria.texto}
            </p>
          </div>
        )}

        <footer className="font-body text-xs text-cream/40 mt-4 flex items-center gap-1">
          feito com{" "}
          <Link href="/" className="underline">
            LoveAndLove
          </Link>
          <span aria-hidden>💛</span>
        </footer>
      </main>

      {comecou && midia && (
        <div className="fixed bottom-4 right-4 z-30 bg-wine-black/90 border border-gold/30 rounded-xl p-2">
          <PlayerMusica midia={midia} ativo={comecou} tamanho="pequeno" />
        </div>
      )}
    </div>
  );
}
