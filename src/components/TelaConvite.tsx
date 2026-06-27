"use client";

import { useState } from "react";

export default function TelaConvite({
  nome1,
  nome2,
  onComecar,
}: {
  nome1: string;
  nome2: string;
  onComecar: () => void;
}) {
  const [saindo, setSaindo] = useState(false);

  function handleClick() {
    setSaindo(true);
    setTimeout(onComecar, 500);
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-wine px-6 transition-opacity duration-500 ${
        saindo ? "opacity-0" : "opacity-100"
      }`}
    >
      <p className="fade-up font-body text-xs uppercase tracking-[0.25em] text-rose/80 text-center">
        uma história só de
      </p>
      <h1 className="fade-up font-display text-3xl md:text-5xl text-cream italic text-center">
        {nome1} <span className="text-gold">&</span> {nome2}
      </h1>
      <button
        onClick={handleClick}
        className="fade-up flex items-center gap-3 bg-gold text-wine-black font-body font-semibold px-8 py-4 rounded-full hover:opacity-90 transition pulse-soft"
        style={{ animationDelay: "0.15s" }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
        Tocar a nossa história
      </button>
    </div>
  );
}
