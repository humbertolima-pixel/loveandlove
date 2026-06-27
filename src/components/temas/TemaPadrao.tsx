"use client";

import { useState } from "react";
import Link from "next/link";
import type { Casal, Frase } from "@/lib/types";
import ContadorVivo from "@/components/ContadorVivo";
import SlideshowFotos from "@/components/SlideshowFotos";
import MosaicoFotos from "@/components/MosaicoFotos";
import PlayerMusica from "@/components/PlayerMusica";
import Cronologia from "@/components/Cronologia";
import TelaConvite from "@/components/TelaConvite";

export default function TemaPadrao({
  casal,
  fraseAleatoria,
  comecou,
  onComecar,
}: {
  casal: Casal;
  fraseAleatoria: Frase | null;
  comecou: boolean;
  onComecar: () => void;
}) {
  const fotoFundo = casal.fotos[0];

  return (
    <>
      {!comecou && (
        <TelaConvite
          nome1={casal.nome1}
          nome2={casal.nome2}
          onComecar={onComecar}
        />
      )}

      <main
        className="relative min-h-screen bg-wine flex flex-col items-center justify-center gap-14 px-6 py-24 overflow-hidden"
      >
        {/* Fundo desfocado feito da primeira foto, para dar textura sem competir com o conteúdo */}
        {fotoFundo && (
          <div
            className="absolute inset-0 opacity-[0.12] blur-2xl scale-110"
            style={{
              backgroundImage: `url(${fotoFundo})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            aria-hidden
          />
        )}

        <div className="relative z-10 flex flex-col items-center gap-14 w-full">
          <ContadorVivo dataInicio={casal.data_inicio} />

          <div className="fade-up text-center">
            <h1 className="font-display text-3xl md:text-5xl text-cream italic">
              {casal.nome1} <span className="text-gold">&</span> {casal.nome2}
            </h1>
          </div>

          {casal.fotos.length > 0 && <SlideshowFotos fotos={casal.fotos} />}

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

          <MosaicoFotos fotos={casal.fotos} />

          <Cronologia marcos={casal.marcos} />

          {casal.musica_url && (
            <PlayerMusica url={casal.musica_url} autoplay={comecou} />
          )}

          <footer className="font-body text-xs text-cream/40 mt-4 flex items-center gap-1">
            feito com{" "}
            <Link href="/" className="underline">
              LoveAndLove
            </Link>
            <span aria-hidden>💛</span>
          </footer>
        </div>
      </main>
    </>
  );
}
