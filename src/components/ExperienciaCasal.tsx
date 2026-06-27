"use client";

import { useState } from "react";
import type { Casal, Declaracao, Frase } from "@/lib/types";
import TemaPadrao from "@/components/temas/TemaPadrao";
import TemaNetflix from "@/components/temas/TemaNetflix";
import TemaSpotify from "@/components/temas/TemaSpotify";

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

  function handleComecar() {
    setComecou(true);
  }

  const props = {
    casal,
    fraseAleatoria,
    declaracaoAleatoria,
    comecou,
    onComecar: handleComecar,
  };

  switch (casal.tema) {
    case "netflix":
      return <TemaNetflix {...props} />;
    case "spotify":
      return <TemaSpotify {...props} />;
    default:
      return <TemaPadrao {...props} />;
  }
}
