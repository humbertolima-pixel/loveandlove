"use client";

import { useState } from "react";
import type { Casal, Frase } from "@/lib/types";
import TemaPadrao from "@/components/temas/TemaPadrao";
import TemaNetflix from "@/components/temas/TemaNetflix";
import TemaSpotify from "@/components/temas/TemaSpotify";
import TemaInstagram from "@/components/temas/TemaInstagram";

export default function ExperienciaCasal({
  casal,
  fraseAleatoria,
}: {
  casal: Casal;
  fraseAleatoria: Frase | null;
}) {
  const [comecou, setComecou] = useState(false);

  function handleComecar() {
    setComecou(true);
  }

  switch (casal.tema) {
    case "netflix":
      return (
        <TemaNetflix
          casal={casal}
          fraseAleatoria={fraseAleatoria}
          comecou={comecou}
          onComecar={handleComecar}
        />
      );
    case "spotify":
      return (
        <TemaSpotify
          casal={casal}
          fraseAleatoria={fraseAleatoria}
          comecou={comecou}
          onComecar={handleComecar}
        />
      );
    case "instagram":
      return (
        <TemaInstagram
          casal={casal}
          fraseAleatoria={fraseAleatoria}
          comecou={comecou}
          onComecar={handleComecar}
        />
      );
    default:
      return (
        <TemaPadrao
          casal={casal}
          fraseAleatoria={fraseAleatoria}
          comecou={comecou}
          onComecar={handleComecar}
        />
      );
  }
}
