"use client";

import { useState } from "react";
import type { Casal, Frase } from "@/lib/types";
import TemaPadrao from "@/components/temas/TemaPadrao";
import TemaNetflix from "@/components/temas/TemaNetflix";
import TemaSpotify from "@/components/temas/TemaSpotify";
import TemaInstagram from "@/components/temas/TemaInstagram";
import TemaTiktok from "@/components/temas/TemaTiktok";
import TemaMercadoLivre from "@/components/temas/TemaMercadoLivre";
import TemaShopee from "@/components/temas/TemaShopee";
import TemaShein from "@/components/temas/TemaShein";
import TemaFacebook from "@/components/temas/TemaFacebook";
import TemaYoutube from "@/components/temas/TemaYoutube";

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
      return <TemaNetflix casal={casal} comecou={comecou} onComecar={handleComecar} />;
    case "spotify":
      return <TemaSpotify casal={casal} comecou={comecou} onComecar={handleComecar} />;
    case "instagram":
      return <TemaInstagram casal={casal} comecou={comecou} onComecar={handleComecar} />;
    case "tiktok":
      return <TemaTiktok casal={casal} comecou={comecou} onComecar={handleComecar} />;
    case "mercadolivre":
      return <TemaMercadoLivre casal={casal} comecou={comecou} onComecar={handleComecar} />;
    case "shopee":
      return <TemaShopee casal={casal} comecou={comecou} onComecar={handleComecar} />;
    case "shein":
      return <TemaShein casal={casal} comecou={comecou} onComecar={handleComecar} />;
    case "facebook":
      return <TemaFacebook casal={casal} comecou={comecou} onComecar={handleComecar} />;
    case "youtube":
      return <TemaYoutube casal={casal} comecou={comecou} onComecar={handleComecar} />;
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
