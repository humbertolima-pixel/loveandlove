"use client";

import type { Casal } from "@/lib/types";

export default function TemaMercadoLivre({
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
          titulo: m.titulo,
          texto: m.titulo,
          autor: i % 2 === 0 ? casal.nome1 : casal.nome2,
        }))
    : [{ titulo: "Recomendo demais", texto: casal.frase, autor: casal.nome1 }];

  const embedMusica = obterEmbedMusica(casal.musica_url);

  return (
    <div className="ml-root">
      <style jsx>{`
        .ml-root {
          --amarelo: #fff159;
          --azul: #3483fa;
          --verde: #00a650;
          --cinza-fundo: #ebebeb;
          --cinza-texto: #666666;
          --preto: #333333;
          background: #fff;
          color: var(--preto);
          font-family: -apple-system, sans-serif;
          min-height: 100vh;
        }
        .ml-root img { display: block; width: 100%; height: 100%; object-fit: cover; }
        .ml-display { font-weight: 700; }

        header { background: var(--amarelo); padding: .9rem 4vw; }
        .logo { font-weight: 800; font-size: 1.2rem; color: var(--preto); }

        .breadcrumb { padding: 1rem 4vw 0; font-size: .76rem; color: var(--azul); }

        .product { max-width: 1000px; margin: 0 auto; padding: 1.2rem 4vw 2rem; display: flex; gap: 2.4rem; flex-wrap: wrap; }
        .gallery { flex: 1 1 360px; }
        .main-image { aspect-ratio: 1/1; background: var(--cinza-fundo); border-radius: 6px; overflow: hidden; }
        .badge-new {
          display: inline-block; background: #fff159; color: #333; font-size: .68rem; font-weight: 700;
          padding: .25rem .6rem; border-radius: 3px; margin-top: .9rem;
        }

        .buy-box { flex: 1 1 320px; }
        .condition { font-size: .76rem; color: var(--cinza-texto); }
        .title { font-size: 1.25rem; font-weight: 500; line-height: 1.3; margin: .5rem 0 .8rem; }
        .rating { display: flex; align-items: center; gap: .4rem; font-size: .82rem; color: var(--azul); margin-bottom: 1.1rem; }
        .stars { color: var(--azul); }

        .price-block { margin-bottom: 1.3rem; }
        .price { font-size: 2.4rem; font-weight: 400; }
        .price-sub { font-size: .85rem; color: var(--verde); margin-top: .2rem; }

        .cta-buy {
          display: block; width: 100%; background: var(--azul); color: #fff; border: none;
          padding: .85rem; border-radius: 6px; font-size: .95rem; font-weight: 600; cursor: pointer; margin-bottom: .7rem;
        }
        .cta-fav {
          display: block; width: 100%; background: #fff; color: var(--azul); border: 1px solid var(--azul);
          padding: .85rem; border-radius: 6px; font-size: .95rem; font-weight: 600; cursor: pointer;
        }

        .seller-box { margin-top: 1.6rem; padding-top: 1.3rem; border-top: 1px solid #eee; font-size: .82rem; color: var(--cinza-texto); }
        .seller-box b { color: var(--preto); }

        section.feature { max-width: 1000px; margin: 0 auto; padding: 2rem 4vw; border-top: 8px solid var(--cinza-fundo); }
        .feature h2 { font-size: 1.15rem; font-weight: 600; margin-bottom: 1.2rem; }

        .gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px,1fr)); gap: .9rem; }
        .gallery-grid div { aspect-ratio: 1/1; border-radius: 6px; overflow: hidden; background: var(--cinza-fundo); }

        .review { border-bottom: 1px solid #eee; padding: 1.1rem 0; }
        .review-head { display: flex; align-items: center; gap: .6rem; margin-bottom: .4rem; }
        .review-stars { color: var(--azul); font-size: .82rem; }
        .review-title { font-weight: 600; font-size: .9rem; }
        .review-text { font-size: .85rem; color: var(--cinza-texto); line-height: 1.5; }
        .review-author { font-size: .76rem; color: #999; margin-top: .3rem; }

        .final-screen {
          min-height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;
          background: var(--azul); color: #fff; padding: 6vh 6vw;
        }
        .final-screen .eyebrow { font-size: .78rem; letter-spacing: .12em; text-transform: uppercase; opacity: .85; margin-bottom: .7rem; }
        .final-screen h2 { font-size: clamp(2.4rem, 12vw, 5rem); }
        .final-screen p { margin-top: 1.1rem; max-width: 34ch; line-height: 1.7; }

        footer { text-align: center; padding: 1.6rem 1rem 3rem; font-size: .66rem; letter-spacing: .1em; text-transform: uppercase; color: #999; }
      `}</style>

      <header>
        <div className="logo">love<span style={{ color: "#3483fa" }}>&</span>love</div>
      </header>

      <div className="breadcrumb">Início &gt; Relacionamentos &gt; Edição limitada</div>

      <section className="product">
        <div className="gallery">
          <div className="main-image">
            {fotoPrincipal && <img src={fotoPrincipal} alt="" />}
          </div>
          <span className="badge-new">NOVO | Edição única</span>
        </div>

        <div className="buy-box">
          <div className="condition">Novo · 1 vendido</div>
          <h1 className="title">{casal.nome1} & {casal.nome2} — Edição Para Sempre</h1>
          <div className="rating">
            <span className="stars">★★★★★</span> (avaliação máxima)
          </div>

          <div className="price-block">
            <div className="price">R$ 0</div>
            <div className="price-sub">em até ∞x sem juros, pagando com carinho</div>
          </div>

          <button className="cta-buy">Comprar agora</button>
          <button className="cta-fav" onClick={onComecar}>Adicionar aos favoritos ♥</button>

          <div className="seller-box">
            Vendido por <b>{casal.nome1} & {casal.nome2}</b><br />
            Estoque: edição única, não será reposto
          </div>
        </div>
      </section>

      {fotos.length > 1 && (
        <section className="feature">
          <h2>Fotos do produto</h2>
          <div className="gallery-grid">
            {fotos.slice(1, 7).map((f, i) => (
              <div key={i}><img src={f} alt="" /></div>
            ))}
          </div>
        </section>
      )}

      <section className="feature">
        <h2>Descrição</h2>
        <p style={{ fontSize: ".88rem", color: "#666", lineHeight: 1.6 }}>{casal.frase}</p>
      </section>

      <section className="feature">
        <h2>Avaliações ({avaliacoes.length})</h2>
        {avaliacoes.map((a, i) => (
          <div key={i} className="review">
            <div className="review-head">
              <span className="review-stars">★★★★★</span>
              <span className="review-title">{a.titulo}</span>
            </div>
            <div className="review-text">{a.texto}</div>
            <div className="review-author">— {a.autor}</div>
          </div>
        ))}
      </section>

      <section className="final-screen">
        <span className="eyebrow">compra verificada</span>
        <h2 className="ml-display">TE AMO</h2>
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
            position: "fixed", inset: 0, zIndex: 999, background: "#fff159",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            textAlign: "center", gap: "2rem", color: "#333",
          }}
        >
          <div className="ml-display" style={{ fontSize: "clamp(1.8rem,7vw,2.8rem)" }}>
            love<span style={{ color: "#3483fa" }}>&</span>love
          </div>
          <p style={{ maxWidth: "30ch", lineHeight: 1.5 }}>
            Anúncio especial: {casal.nome1} & {casal.nome2}. Toque para ver os detalhes.
          </p>
          <button
            onClick={onComecar}
            style={{
              background: "#3483fa", color: "#fff", border: "none", padding: ".9rem 2rem",
              borderRadius: 6, fontWeight: 700, fontSize: ".95rem", cursor: "pointer",
            }}
          >
            Ver produto
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
