"use client";

import { useState } from "react";
import type { Casal, Declaracao, Frase } from "@/lib/types";
import TemaRomantico from "@/components/temas/TemaRomantico";

export default function ExperienciaCasal({
  casal,
  fraseAleatoria,
  declaracaoAleatoria,
}: {
  casal: Casal;
  fraseAleatoria: Frase | null;
  declaracaoAleatoria: Declaracao | null;
}) {
  const [comecou, setComecou] = useState(false);

  return (
    <TemaRomantico
      casal={casal}
      fraseAleatoria={fraseAleatoria}
      declaracaoAleatoria={declaracaoAleatoria}
      comecou={comecou}
      onComecar={() => setComecou(true)}
    />
  );
}
