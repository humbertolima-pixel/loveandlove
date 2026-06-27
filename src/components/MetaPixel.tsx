"use client";

import Script from "next/script";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

/**
 * Carrega o Pixel do Meta (Facebook/Instagram Ads) em todo o site.
 * Dispara PageView automaticamente a cada carregamento de página.
 *
 * O evento de Purchase NÃO é disparado por aqui — ele é enviado pelo
 * servidor via Conversions API no momento em que o webhook da Cakto
 * confirma o pagamento (veja `src/lib/meta-conversions-api.ts`), que é
 * mais confiável que depender do navegador do cliente.
 */
export default function MetaPixel() {
  if (!PIXEL_ID) return null;

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}

/**
 * Dispara um evento customizado do Pixel no navegador (ex: ao clicar
 * em "Criar nossa página"). Use com moderação — eventos de conversão
 * de verdade (Purchase) ficam a cargo do servidor via Conversions API.
 */
export function dispararEventoMeta(
  evento: string,
  parametros?: Record<string, unknown>
) {
  if (typeof window === "undefined") return;
  const fbq = (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq;
  if (typeof fbq === "function") {
    fbq("track", evento, parametros);
  }
}
