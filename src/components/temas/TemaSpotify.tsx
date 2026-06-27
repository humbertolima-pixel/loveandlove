"use client";

import type { Casal } from "@/lib/types";

export default function TemaSpotify({
  casal,
  comecou,
  onComecar,
}: {
  casal: Casal;
  comecou: boolean;
  onComecar: () => void;
}) {
  const fotos = casal.fotos.length > 0 ? casal.fotos : [];
  const capa = fotos[0];

  const faixas = casal.marcos.length > 0
    ? casal.marcos
        .slice()
        .sort((a, b) => a.data.localeCompare(b.data))
        .map((m, i) => ({
          titulo: m.titulo,
          desc: m.titulo,
          duracao: i === casal.marcos.length - 1 ? "∞" : `${3 + i}:${(12 * i) % 60}`.padEnd(4, "0"),
          img: fotos[i % Math.max(fotos.length, 1)] ?? capa,
        }))
    : [
        {
          titulo: "Aqui, agora",
          desc: casal.frase,
          duracao: "∞",
          img: capa,
        },
      ];

  const momentos = fotos.slice(0, 6).map((f, i) => ({
    titulo: i === 0 ? "O nosso momento" : "Em alta",
    sub: "favorito",
    img: f,
  }));

  const embedMusica = obterEmbedMusica(casal.musica_url);

  return (
    <div className="spotify-root">
      <style jsx>{`
        .spotify-root {
          --preto: #0a0a0a;
          --base: #121212;
          --base-2: #181818;
          --verde: #1ed760;
          --branco: #ffffff;
          --cinza: #b3b3b3;
          background: var(--base);
          color: var(--branco);
          font-family: -apple-system, sans-serif;
          min-height: 100vh;
          overflow-x: hidden;
        }
        .spotify-root img { display: block; width: 100%; height: 100%; object-fit: cover; }
        .sp-display { font-family: Georgia, serif; font-weight: 700; }

        header {
          position: fixed; top: 0; left: 0; right: 0; z-index: 200;
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.1rem 4vw;
          background: linear-gradient(180deg, rgba(0,0,0,.75), transparent);
        }
        .logo { font-weight: 800; font-size: 1.2rem; }
        .logo span { color: var(--verde); }

        .hero {
          display: flex; align-items: flex-end; gap: 2rem;
          padding: 14vh 4vw 4rem;
          background: linear-gradient(180deg, #2a2a2a, var(--base) 75%);
          flex-wrap: wrap;
        }
        .hero-cover { width: 200px; height: 200px; flex: 0 0 200px; box-shadow: 0 20px 50px rgba(0,0,0,.6); border-radius: 4px; overflow: hidden; }
        .eyebrow { font-size: .8rem; font-weight: 700; text-transform: uppercase; }
        .hero-info h1 { font-size: clamp(2rem, 6vw, 3.6rem); line-height: 1; margin: .4rem 0 1rem; }
        .meta { font-size: .85rem; color: var(--cinza); }
        .meta b { color: var(--branco); }
        .hero-actions { display: flex; align-items: center; gap: 1.2rem; margin-top: 1.6rem; }
        .play-big { width: 52px; height: 52px; border-radius: 50%; background: var(--verde); display: flex; align-items: center; justify-content: center; border: none; cursor: pointer; }
        .play-big svg { width: 20px; height: 20px; fill: #000; margin-left: 2px; }

        section { padding: 3rem 4vw; }
        .section-head { margin-bottom: 1.3rem; display: flex; align-items: baseline; gap: .7rem; }
        .section-head h2 { font-size: 1.4rem; font-weight: 800; }
        .sub { font-size: .76rem; color: var(--cinza); }

        .tracklist { max-width: 880px; }
        .track { display: grid; grid-template-columns: 24px 48px 1fr auto; align-items: center; gap: 1rem; padding: .6rem .5rem; border-radius: 6px; }
        .track .num { color: #777; font-size: .82rem; text-align: center; }
        .track .thumb { width: 44px; height: 44px; border-radius: 4px; overflow: hidden; }
        .t-title { font-weight: 600; font-size: .9rem; }
        .t-desc { font-size: .76rem; color: var(--cinza); margin-top: .15rem; line-height: 1.4; }
        .dur { color: #777; font-size: .78rem; }

        .grid-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 1rem; max-width: 1100px; }
        .card { background: var(--base-2); border-radius: 8px; padding: .85rem; }
        .cover { aspect-ratio: 1/1; border-radius: 6px; overflow: hidden; margin-bottom: .7rem; }
        .c-title { font-weight: 600; font-size: .82rem; }
        .c-sub { font-size: .72rem; color: var(--cinza); margin-top: .2rem; }

        .final-screen {
          min-height: 70vh; padding: 6vh 6vw; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;
          background: radial-gradient(circle at 50% 30%, rgba(30,215,96,.16), transparent 60%), var(--preto);
        }
        .final-cover { width: 180px; height: 180px; border-radius: 8px; overflow: hidden; box-shadow: 0 25px 60px rgba(0,0,0,.6); margin-bottom: 1.6rem; }
        .final-screen h2 { font-size: clamp(2.6rem, 14vw, 6rem); color: var(--verde); }
        .final-screen p { margin-top: 1.1rem; max-width: 34ch; color: #e2e2e2; line-height: 1.7; }

        footer { text-align: center; padding: 2rem 1rem 5rem; font-size: .68rem; letter-spacing: .12em; text-transform: uppercase; color: #555; }

        .mini-player {
          position: fixed; bottom: 0; left: 0; right: 0; z-index: 300;
          background: #181818; border-top: 1px solid #282828; padding: .7rem 1.2rem;
          display: flex; align-items: center; gap: .8rem; font-size: .76rem; color: var(--cinza);
        }
        .eq { display: flex; gap: 2px; align-items: flex-end; height: 14px; }
        .eq i { width: 3px; background: var(--verde); display: block; animation: eq 1s infinite ease-in-out; }
        .eq i:nth-child(2) { animation-delay: .2s; }
        .eq i:nth-child(3) { animation-delay: .4s; }
        @keyframes eq { 0%, 100% { height: 4px; } 50% { height: 14px; } }
        .bar { flex: 1; height: 3px; background: #404040; border-radius: 2px; overflow: hidden; }
        .bar i { display: block; height: 100%; width: 100%; background: var(--verde); }
      `}</style>

      <header>
        <div className="logo">LOVE <span>&</span> LOVE</div>
      </header>

      <section className="hero">
        {capa && (
          <div className="hero-cover"><img src={capa} alt="capa" /></div>
        )}
        <div className="hero-info">
          <div className="eyebrow">playlist</div>
          <h1 className="sp-display">{casal.nome1} & {casal.nome2}</h1>
          <p className="meta"><b>Love & Love</b> · {faixas.length} faixas · feito pra durar pra sempre</p>
          <div className="hero-actions">
            <button
              className="play-big"
              onClick={() => document.getElementById("sp-faixas")?.scrollIntoView({ behavior: "smooth" })}
            >
              <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            </button>
          </div>
        </div>
      </section>

      <section id="sp-faixas">
        <div className="section-head"><h2>Faixas</h2><span className="sub">a nossa cronologia</span></div>
        <div className="tracklist">
          {faixas.map((f, i) => (
            <div key={i} className="track">
              <div className="num">{i + 1}</div>
              <div className="thumb">{f.img && <img src={f.img} alt="" />}</div>
              <div>
                <div className="t-title">{f.titulo}</div>
              </div>
              <div className="dur">{f.duracao}</div>
            </div>
          ))}
        </div>
      </section>

      {momentos.length > 0 && (
        <section>
          <div className="section-head"><h2>Em alta pra você</h2><span className="sub">momentos favoritos</span></div>
          <div className="grid-cards">
            {momentos.map((m, i) => (
              <div key={i} className="card">
                <div className="cover"><img src={m.img} alt="" /></div>
                <div className="c-title">{m.titulo}</div>
                <div className="c-sub">{m.sub}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="final-screen">
        {capa && <div className="final-cover"><img src={capa} alt="" /></div>}
        <span className="eyebrow">tocando agora</span>
        <h2 className="sp-display">TE AMO</h2>
        <p>{casal.frase}</p>
      </section>

      <footer>Love &amp; Love — feito com carinho, só pra você</footer>

      {comecou && embedMusica && (
        <div className="mini-player">
          <div className="eq"><i /><i /><i /></div>
          <span>tocando agora</span>
          <div className="bar"><i /></div>
          <div style={{ position: "fixed", width: 1, height: 1, bottom: 0, right: 0, overflow: "hidden", opacity: 0, pointerEvents: "none" }}>
            <iframe src={embedMusica} width="300" height="80" allow="autoplay; encrypted-media" title="música" />
          </div>
        </div>
      )}

      {!comecou && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 999,
            background: "radial-gradient(circle at 50% 35%, #1a3d24, #0a0a0a 70%)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            textAlign: "center", gap: "2rem",
          }}
        >
          <div className="sp-display" style={{ fontSize: "clamp(2rem,8vw,3.6rem)" }}>
            LOVE <span style={{ color: "#1ed760" }}>&</span> LOVE
          </div>
          <p style={{ color: "#b3b3b3", maxWidth: "30ch", lineHeight: 1.5 }}>
            A playlist da história de {casal.nome1} & {casal.nome2}, em loop infinito.
          </p>
          <button
            onClick={onComecar}
            aria-label="Começar"
            style={{
              width: 84, height: 84, borderRadius: "50%", background: "#1ed760",
              display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer",
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="#000"><path d="M8 5v14l11-7z" /></svg>
          </button>
          <span style={{ fontSize: ".7rem", letterSpacing: ".18em", textTransform: "uppercase", color: "#666" }}>
            toque para tocar
          </span>
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
