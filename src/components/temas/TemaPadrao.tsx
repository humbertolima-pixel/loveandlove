"use client";

import Link from "next/link";
import type { Casal, Declaracao, Frase } from "@/lib/types";
import ContadorVivo from "@/components/ContadorVivo";
import SlideshowFotos from "@/components/SlideshowFotos";
import MosaicoFotos from "@/components/MosaicoFotos";
import SecaoPergunta from "@/components/SecaoPergunta";
import TelaAbertura from "@/components/TelaAbertura";

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

  return (
    <div className="bg-wine">
      <TelaAbertura
        nome1={casal.nome1}
        nome2={casal.nome2}
        musicaUrl={casal.musica_url}
        onComecar={onComecar}
      />

      <main id="conteudo-principal" className="flex flex-col items-center gap-20 px-6 py-24">
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
    </div>
  );
}
