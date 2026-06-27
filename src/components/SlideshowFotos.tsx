"use client";

import { useEffect, useState } from "react";

export default function SlideshowFotos({ fotos }: { fotos: string[] }) {
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [chaveAnimacao, setChaveAnimacao] = useState(0);

  useEffect(() => {
    if (fotos.length <= 1) return;
    const intervalo = setInterval(() => {
      setIndiceAtual((i) => (i + 1) % fotos.length);
      setChaveAnimacao((k) => k + 1);
    }, 4200);
    return () => clearInterval(intervalo);
  }, [fotos.length]);

  if (fotos.length === 0) return null;

  return (
    <div className="flex justify-center">
      <div
        key={chaveAnimacao}
        className="polaroid-in bg-cream p-3 pb-6 rounded-sm shadow-2xl rotate-[-1.5deg]"
        style={{ maxWidth: "min(85vw, 360px)" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={fotos[indiceAtual]}
          alt="Foto do casal"
          className="w-full aspect-square object-cover"
        />
      </div>
    </div>
  );
}
