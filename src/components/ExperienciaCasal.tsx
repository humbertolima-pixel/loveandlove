"use client";

import { useState } from "react";
import type { Casal, Frase } from "@/lib/types";
import TemaRomantico from "@/components/temas/TemaRomantico";

export default function ExperienciaCasal({
  casal,
  fraseAleatoria,
}: {
  casal: Casal;
  fraseAleatoria: Frase | null;
}) {
  const [comecou, setComecou] = useState(false);

  return (
    <TemaRomantico
      casal={casal}
      fraseAleatoria={fraseAleatoria}
      comecou={comecou}
      onComecar={() => setComecou(true)}
    />
  );
}
