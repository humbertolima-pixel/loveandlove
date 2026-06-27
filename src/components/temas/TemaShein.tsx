"use client";

import { useState } from "react";
import type { Casal } from "@/lib/types";

export default function TemaShein({
  casal,
  comecou,
  onComecar,
}: {
  casal: Casal;
  comecou: boolean;
  onComecar: () => void;
}) {
  const [indiceFoto, setIndiceFoto] = useState(0);
  const fotos = casal.fotos.length > 0 ? casal.fotos : [];
  const fotoAtual = fotos[indiceFoto] ?? fotos[0];

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
    <div className="sh-root">
      <style jsx>{`
        .sh-root {
          --preto: #000;
          --rosa: #ff5c8a;
          --cinza: #999;
          background: #fff;
          color: var(--preto);
          font-family: -apple-system, sans-serif;
          min-height: 100vh;
        }
        .sh-root img { display: block; width: 100%; height: 100%; object-fit: cover; }
        .sh-display { font-weight: 800; letter-spacing: -.02em; }

        header { padding: .9rem 4vw; border-bottom: 1px solid #eee; }
        .logo { font-weight: 900; font-size: 1.3rem; letter-spacing: -.03em; }
        .logo span { color: var(--rosa); }

        .product { max-width: 1000px; margin: 0 auto; padding: 1.2rem 4vw 2rem; display: flex; gap: 2rem; flex-wrap: wrap; }
        .gallery { flex: 1 1 360px; }
        .main-image { aspect-ratio: 3/4; border-radius: 4px; overflow: hidden; position: relative; background: #f5f5f5; }
        .discount-tag {
          position: absolute; top: .7rem; left: .7rem; background: var(--preto); color: #fff;
          font-size: .7rem; font-weight: 700; padding: .3rem .6rem; border-radius: 2px;
        }
        .thumbs { display: flex; gap: .5rem; margin-top: .6rem; }
        .thumb { width: 56px; height: 70px; border-radius: 3px; overflow: hidden; cursor: pointer; opacity: .6; border: none; padding: 0; }
        .thumb.ativo { opacity: 1; outline: 2px solid var(--preto); }

        .buy-box { flex: 1 1 320px; }
        .brand-tag { font-size: .72rem; color: var(--rosa); font-weight: 700; text-transform: uppercase; letter-spacing: .05em; }
        .title { font-size: 1rem; line-height: 1.4; margin: .4rem 0 .8rem; }
        .rating-row { display: flex; align-items: center; gap: .5rem; font-size: .78rem; color: var(--cinza); margin-bottom: 1rem; }
        .stars { color: #ffb800; }

        .price-row { display: flex; align-items: baseline; gap: .6rem; margin-bottom: 1.2rem; }
        .price { font-size: 1.9rem; font-weight: 800; color: var(--rosa); }
        .price-old { font-size: .9rem; color: var(--cinza); text-decoration: line-through; }
        .price-pct { font-size: .76rem; font-weight: 700; color: var(--rosa); }

        .cta-buy {
          display: block; width: 100%; background: var(--preto); color: #fff; border: none;
          padding: .85rem; border-radius: 4px; font-size: .9rem; font-weight: 700; cursor: pointer; margin-bottom: .7rem;
          text-transform: uppercase; letter-spacing: .03em;
        }
        .cta-cart {
          display: block; width: 100%; background: #fff; color: var(--preto); border: 1px solid var(--preto);
          padding: .85rem; border-radius: 4px; font-size: .9rem; font-weight: 700; cursor: pointer;
          text-transform: uppercase; letter-spacing: .03em;
        }

        section.feature { max-width: 1000px; margin: 0 auto; padding: 1.8rem 4vw; border-top: 1px solid #eee; }
        .feature h2 { font-size: .95rem; font-weight: 700; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: .03em; }

        .review { border-bottom: 1px solid #f0f0f0; padding: 1rem 0; }
        .review-stars { color: #ffb800; font-size: .85rem; margin-bottom: .3rem; }
        .review-text { font-size: .85rem; color: #333; line-height: 1.5; }
        .review-author { font-size: .76rem; color: #999; margin-top: .3rem; }

        .final-screen {
          min-height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;
          background: var(--preto); color: #fff; padding: 6vh 6vw;
        }
        .final-screen .eyebrow { font-size: .76rem; letter-spacing: .15em; text-transform: uppercase; opacity: .8; margin-bottom: .7rem; color: var(--rosa); }
        .final-screen h2 { font-size: clamp(2.4rem, 12vw, 5rem); color: var(--rosa); }
        .final-screen p { margin-top: 1.1rem; max-width: 34ch; line-height: 1.7; }

        footer { text-align: center; padding: 1.6rem 1rem 3rem; font-size: .66rem; letter-spacing: .1em; text-transform: uppercase; color: #999; }
      `}</style>

      <header>
        <div className="logo">love<span>&</span>love</div>
      </header>

      <section className="product">
        <div className="gallery">
          <div className="main-image">
            {fotoAtual && <img src={fotoAtual} alt="" />}
            <span className="discount-tag">SÓ HOJE</span>
          </div>
          {fotos.length > 1 && (
            <div className="thumbs">
              {fotos.slice(0, 5).map((f, i) => (
                <button
                  key={i}
                  className={`thumb ${i === indiceFoto ? "ativo" : ""}`}
                  onClick={() => setIndiceFoto(i)}
                >
                  <img src={f} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="buy-box">
          <div className="brand-tag">LOVE&LOVE</div>
          <h1 className="title">{casal.nome1} & {casal.nome2} — Peça única, edição limitada</h1>
          <div className="rating-row">
            <span className="stars">★★★★★</span> avaliação perfeita
          </div>

          <div className="price-row">
            <span className="price">R$ 0,00</span>
            <span className="price-old">R$ 199,90</span>
            <span className="price-pct">-100%</span>
          </div>

          <button className="cta-buy">Comprar agora</button>
          <button className="cta-cart" onClick={onComecar}>Adicionar à bolsa ♥</button>
        </div>
      </section>

      <section className="feature">
        <h2>Descrição</h2>
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
        <h2 className="sh-display">TE AMO</h2>
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
            position: "fixed", inset: 0, zIndex: 999, background: "#000",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            textAlign: "center", gap: "2rem", color: "#fff",
          }}
        >
          <div className="sh-display" style={{ fontSize: "clamp(1.8rem,7vw,2.8rem)" }}>
            love<span style={{ color: "#ff5c8a" }}>&</span>love
          </div>
          <p style={{ maxWidth: "30ch", lineHeight: 1.5, color: "#ccc" }}>
            Nova coleção: {casal.nome1} & {casal.nome2}. Toque para ver.
          </p>
          <button
            onClick={onComecar}
            style={{
              background: "#ff5c8a", color: "#fff", border: "none", padding: ".9rem 2rem",
              borderRadius: 4, fontWeight: 800, fontSize: ".9rem", cursor: "pointer", textTransform: "uppercase",
            }}
          >
            Ver coleção
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
