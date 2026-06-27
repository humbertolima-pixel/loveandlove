"use client";

import type { Casal } from "@/lib/types";

export default function TemaShopee({
  casal,
  comecou,
  onComecar,
}: {
  casal: Casal;
  comecou: boolean;
  onComecar: () => void;
}) {
  const fotos = casal.fotos.length > 0 ? casal.fotos : [];
  const fotoPrincipal = fotos[0];

  const avaliacoes = casal.marcos.length > 0
    ? casal.marcos
        .slice()
        .sort((a, b) => a.data.localeCompare(b.data))
        .map((m, i) => ({
          texto: m.titulo,
          autor: i % 2 === 0 ? casal.nome1 : casal.nome2,
        }))
    : [{ texto: casal.frase, autor: casal.nome1 }];

  const embedMusica = obterEmbedMusica(casal.musica_url);

  return (
    <div className="shp-root">
      <style jsx>{`
        .shp-root {
          --laranja: #ee4d2d;
          --laranja-clara: #fff4f1;
          --amarelo: #ffd700;
          --preto: #222;
          --cinza: #757575;
          background: #f5f5f5;
          color: var(--preto);
          font-family: -apple-system, sans-serif;
          min-height: 100vh;
        }
        .shp-root img { display: block; width: 100%; height: 100%; object-fit: cover; }
        .shp-display { font-weight: 800; }

        header { background: var(--laranja); padding: .9rem 4vw; }
        .logo { font-weight: 800; font-size: 1.25rem; color: #fff; }

        .product { max-width: 1000px; margin: 1rem auto; padding: 0 4vw; display: flex; gap: 2rem; flex-wrap: wrap; }
        .gallery { flex: 1 1 360px; background: #fff; border-radius: 8px; padding: 1rem; }
        .main-image { aspect-ratio: 1/1; border-radius: 6px; overflow: hidden; position: relative; }
        .discount-badge {
          position: absolute; top: .6rem; left: .6rem; background: var(--laranja); color: #fff;
          font-size: .72rem; font-weight: 800; padding: .3rem .6rem; border-radius: 4px;
        }

        .buy-box { flex: 1 1 320px; background: #fff; border-radius: 8px; padding: 1.4rem; }
        .title { font-size: 1.15rem; font-weight: 500; line-height: 1.35; margin-bottom: .7rem; }
        .rating-row { display: flex; align-items: center; gap: .6rem; font-size: .82rem; color: var(--cinza); margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid #eee; }
        .stars { color: var(--amarelo); }

        .price-block { background: var(--laranja-clara); border-radius: 6px; padding: 1rem; margin-bottom: 1.2rem; }
        .price-old { font-size: .82rem; color: var(--cinza); text-decoration: line-through; }
        .price { font-size: 2rem; font-weight: 700; color: var(--laranja); }
        .price-off { display: inline-block; background: var(--laranja); color: #fff; font-size: .72rem; font-weight: 700; padding: .15rem .5rem; border-radius: 3px; margin-left: .5rem; }

        .cta-buy {
          display: block; width: 100%; background: var(--laranja); color: #fff; border: none;
          padding: .85rem; border-radius: 6px; font-size: .95rem; font-weight: 700; cursor: pointer; margin-bottom: .7rem;
        }
        .cta-cart {
          display: block; width: 100%; background: #fff; color: var(--laranja); border: 1px solid var(--laranja);
          padding: .85rem; border-radius: 6px; font-size: .95rem; font-weight: 700; cursor: pointer;
        }

        .shop-info { margin-top: 1.3rem; padding-top: 1.1rem; border-top: 1px solid #eee; font-size: .82rem; color: var(--cinza); }
        .shop-info b { color: var(--preto); }

        section.feature { max-width: 1000px; margin: 1rem auto; padding: 1.5rem 4vw; background: #fff; border-radius: 8px; }
        .feature h2 { font-size: 1.05rem; font-weight: 700; margin-bottom: 1rem; color: var(--laranja); }

        .gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px,1fr)); gap: .8rem; }
        .gallery-grid div { aspect-ratio: 1/1; border-radius: 6px; overflow: hidden; background: #f0f0f0; }

        .review { border-bottom: 1px solid #f0f0f0; padding: 1rem 0; }
        .review-stars { color: var(--amarelo); font-size: .85rem; margin-bottom: .3rem; }
        .review-text { font-size: .85rem; color: #444; line-height: 1.5; }
        .review-author { font-size: .76rem; color: #999; margin-top: .3rem; }

        .final-screen {
          min-height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;
          background: var(--laranja); color: #fff; padding: 6vh 6vw; margin-top: 1rem;
        }
        .final-screen .eyebrow { font-size: .78rem; letter-spacing: .12em; text-transform: uppercase; opacity: .9; margin-bottom: .7rem; }
        .final-screen h2 { font-size: clamp(2.4rem, 12vw, 5rem); }
        .final-screen p { margin-top: 1.1rem; max-width: 34ch; line-height: 1.7; }

        footer { text-align: center; padding: 1.6rem 1rem 3rem; font-size: .66rem; letter-spacing: .1em; text-transform: uppercase; color: #999; }
      `}</style>

      <header>
        <div className="logo">love&love</div>
      </header>

      <section className="product">
        <div className="gallery">
          <div className="main-image">
            {fotoPrincipal && <img src={fotoPrincipal} alt="" />}
            <span className="discount-badge">-100% PARA SEMPRE</span>
          </div>
        </div>

        <div className="buy-box">
          <h1 className="title">{casal.nome1} & {casal.nome2} — Edição Especial</h1>
          <div className="rating-row">
            <span className="stars">★★★★★</span> 5.0 · estoque: edição única
          </div>

          <div className="price-block">
            <div className="price-old">R$ 999,90</div>
            <span className="price">R$ 0</span>
            <span className="price-off">-100%</span>
          </div>

          <button className="cta-buy">Comprar agora</button>
          <button className="cta-cart" onClick={onComecar}>Adicionar à lista de desejos ♥</button>

          <div className="shop-info">
            Vendido e entregue por <b>{casal.nome1} & {casal.nome2}</b>
          </div>
        </div>
      </section>

      {fotos.length > 1 && (
        <section className="feature">
          <h2>Galeria do produto</h2>
          <div className="gallery-grid">
            {fotos.slice(1, 7).map((f, i) => (
              <div key={i}><img src={f} alt="" /></div>
            ))}
          </div>
        </section>
      )}

      <section className="feature">
        <h2>Descrição do produto</h2>
        <p style={{ fontSize: ".88rem", color: "#444", lineHeight: 1.6 }}>{casal.frase}</p>
      </section>

      <section className="feature">
        <h2>Avaliações ({avaliacoes.length})</h2>
        {avaliacoes.map((a, i) => (
          <div key={i} className="review">
            <div className="review-stars">★★★★★</div>
            <div className="review-text">{a.texto}</div>
            <div className="review-author">— {a.autor}</div>
          </div>
        ))}
      </section>

      <section className="final-screen">
        <span className="eyebrow">pedido confirmado</span>
        <h2 className="shp-display">TE AMO</h2>
        <p>{casal.frase}</p>
      </section>

      <footer>Love &amp; Love — feito com carinho, só pra você</footer>

      {comecou && embedMusica && (
        <div style={{ position: "fixed", width: 1, height: 1, bottom: 0, right: 0, overflow: "hidden", opacity: 0, pointerEvents: "none" }}>
          <iframe src={embedMusica} width="300" height="80" allow="autoplay; encrypted-media" title="música" />
        </div>
      )}

      {!comecou && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 999, background: "#ee4d2d",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            textAlign: "center", gap: "2rem", color: "#fff",
          }}
        >
          <div className="shp-display" style={{ fontSize: "clamp(1.8rem,7vw,2.8rem)" }}>love&love</div>
          <p style={{ maxWidth: "30ch", lineHeight: 1.5 }}>
            Oferta exclusiva: {casal.nome1} & {casal.nome2}. Toque para ver.
          </p>
          <button
            onClick={onComecar}
            style={{
              background: "#fff", color: "#ee4d2d", border: "none", padding: ".9rem 2rem",
              borderRadius: 6, fontWeight: 800, fontSize: ".95rem", cursor: "pointer",
            }}
          >
            Ver oferta
          </button>
        </div>
      )}
    </div>
  );
}

function obterEmbedMusica(url: string | null): string | null {
  if (!url) return null;
  const spotify = url.match(/open\.spotify\.com\/(track|album|playlist)\/([a-zA-Z0-9]+)/);
  if (spotify) {
    return `https://open.spotify.com/embed/${spotify[1]}/${spotify[2]}?autoplay=1`;
  }
  const youtube = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (youtube) {
    return `https://www.youtube.com/embed/${youtube[1]}?autoplay=1&controls=0`;
  }
  return null;
}
