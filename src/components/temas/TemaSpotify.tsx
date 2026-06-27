"use client";

import type { Casal, Frase } from "@/lib/types";
import PlayerMusica from "@/components/PlayerMusica";

export default function TemaSpotify({
  casal,
  fraseAleatoria,
  comecou,
  onComecar,
}: {
  casal: Casal;
  fraseAleatoria: Frase | null;
  comecou: boolean;
  onComecar: () => void;
}) {
  const fotos = casal.fotos.length > 0 ? casal.fotos : [];
  const capa = fotos[0];

  const paragrafos = casal.historia
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const faixas = paragrafos.length > 0
    ? paragrafos.map((texto, i) => ({
        titulo: `Faixa ${i + 1}`,
        texto,
        duracao: i === paragrafos.length - 1 ? "∞" : `${3 + i}:${(12 * i) % 60}`.padEnd(4, "0"),
        img: fotos[i % Math.max(fotos.length, 1)] ?? capa,
      }))
    : [{ titulo: "Faixa 1", texto: casal.frase, duracao: "∞", img: capa }];

  const momentos = fotos.slice(0, 12);

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

        @keyframes coracao-flutua {
          0% { transform: translateY(0) scale(0.8); opacity: 0; }
          15% { opacity: 1; }
          100% { transform: translateY(-120px) scale(1.1); opacity: 0; }
        }
        .coracao { position: absolute; font-size: 1.4rem; animation: coracao-flutua 3.5s ease-in infinite; pointer-events: none; }

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
        .hero-cover { width: 220px; height: 220px; flex: 0 0 220px; box-shadow: 0 20px 50px rgba(0,0,0,.6); border-radius: 4px; overflow: hidden; animation: fade-in-up 1s ease-out; }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .eyebrow { font-size: .8rem; font-weight: 700; text-transform: uppercase; }
        .hero-info h1 { font-size: clamp(2rem, 6vw, 3.8rem); line-height: 1; margin: .4rem 0 1rem; }
        .meta { font-size: .85rem; color: var(--cinza); }
        .meta b { color: var(--branco); }
        .hero-actions { display: flex; align-items: center; gap: 1.2rem; margin-top: 1.6rem; }
        .play-big { width: 56px; height: 56px; border-radius: 50%; background: var(--verde); display: flex; align-items: center; justify-content: center; border: none; cursor: pointer; }
        .play-big svg { width: 22px; height: 22px; fill: #000; margin-left: 2px; }

        section.fundo { padding: 3.2rem 4vw; }
        .section-head { margin-bottom: 1.3rem; display: flex; align-items: baseline; gap: .7rem; }
        .section-head h2 { font-size: 1.4rem; font-weight: 800; }
        .sub { font-size: .76rem; color: var(--cinza); }

        .tracklist { max-width: 880px; }
        .track { display: grid; grid-template-columns: 24px 56px 1fr auto; align-items: center; gap: 1rem; padding: .7rem .6rem; border-radius: 6px; transition: background .2s; }
        .track:hover { background: #1e1e1e; }
        .track .num { color: #777; font-size: .82rem; text-align: center; }
        .track .thumb { width: 48px; height: 48px; border-radius: 4px; overflow: hidden; }
        .t-title { font-weight: 600; font-size: .9rem; }
        .t-desc { font-size: .78rem; color: var(--cinza); margin-top: .25rem; line-height: 1.45; }
        .dur { color: #777; font-size: .78rem; }

        .grid-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 1rem; max-width: 1100px; }
        .card { aspect-ratio: 1/1; border-radius: 8px; overflow: hidden; transition: transform .25s; }
        .card:hover { transform: scale(1.04); }

        .artist-row { display: flex; gap: 2.2rem; flex-wrap: wrap; justify-content: center; }
        .artist { text-align: center; }
        .a-photo { width: 130px; height: 130px; border-radius: 50%; overflow: hidden; margin-bottom: .8rem; }
        .a-name { font-weight: 700; font-size: .92rem; }
        .a-role { font-size: .78rem; color: var(--cinza); margin-top: .2rem; }

        .final-screen {
          min-height: 90vh; padding: 6vh 6vw 10vh; position: relative; overflow: hidden;
          display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;
          background: radial-gradient(circle at 50% 30%, rgba(30,215,96,.16), transparent 60%), var(--preto);
        }
        .final-cover { width: 200px; height: 200px; border-radius: 8px; overflow: hidden; box-shadow: 0 25px 60px rgba(0,0,0,.6); margin-bottom: 1.8rem; }
        .final-screen .eyebrow { font-size: .78rem; letter-spacing: .15em; text-transform: uppercase; color: var(--cinza); margin-bottom: .6rem; }
        .final-screen h2 { font-size: clamp(2.6rem, 14vw, 6.5rem); color: var(--verde); line-height: 1; text-shadow: 0 0 60px rgba(30,215,96,.4); }
        .final-screen p { margin-top: 1.2rem; max-width: 34ch; color: #e2e2e2; line-height: 1.7; }

        footer { text-align: center; padding: 2rem 1rem 3rem; font-size: .68rem; letter-spacing: .12em; text-transform: uppercase; color: #555; }
      `}</style>

      <header>
        <div className="logo">LOVE <span>&</span> LOVE</div>
      </header>

      <section className="hero">
        {capa && <div className="hero-cover"><img src={capa} alt="capa" /></div>}
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

      <section className="fundo" style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
        <div className="eyebrow" style={{ color: "var(--verde)" }}>sobre a playlist</div>
        <p style={{ marginTop: ".8rem", color: "#dcdcdc", lineHeight: 1.75 }}>{casal.frase}</p>
        {fraseAleatoria && (
          <p style={{ marginTop: "1rem", color: "var(--verde)", fontStyle: "italic", fontSize: ".92rem" }}>
            &ldquo;{fraseAleatoria.texto}&rdquo;
          </p>
        )}
      </section>

      <section className="fundo" id="sp-faixas">
        <div className="section-head"><h2>Faixas</h2><span className="sub">a nossa história</span></div>
        <div className="tracklist">
          {faixas.map((f, i) => (
            <div key={i} className="track">
              <div className="num">{i + 1}</div>
              <div className="thumb">{f.img && <img src={f.img} alt="" />}</div>
              <div>
                <div className="t-title">{f.titulo}</div>
                <div className="t-desc">{f.texto}</div>
              </div>
              <div className="dur">{f.duracao}</div>
            </div>
          ))}
        </div>
      </section>

      {momentos.length > 0 && (
        <section className="fundo">
          <div className="section-head"><h2>Em alta pra você</h2><span className="sub">momentos favoritos</span></div>
          <div className="grid-cards">
            {momentos.map((m, i) => (
              <div key={i} className="card"><img src={m} alt="" /></div>
            ))}
          </div>
        </section>
      )}

      <section className="fundo">
        <div className="section-head"><h2>Artistas principais</h2><span className="sub">quem canta essa história</span></div>
        <div className="artist-row">
          <div className="artist">
            {fotos[0] && <div className="a-photo"><img src={fotos[0]} alt="" /></div>}
            <div className="a-name">{casal.nome1}</div>
            <div className="a-role">vocal principal</div>
          </div>
          <div className="artist">
            {(fotos[1] ?? fotos[0]) && <div className="a-photo"><img src={fotos[1] ?? fotos[0]} alt="" /></div>}
            <div className="a-name">{casal.nome2}</div>
            <div className="a-role">vocal de apoio (sempre)</div>
          </div>
        </div>
      </section>

      {casal.musica_url && (
        <section className="fundo" style={{ textAlign: "center" }}>
          <div className="eyebrow" style={{ color: "var(--verde)" }}>tocando agora</div>
          <div style={{ marginTop: "1.2rem" }}>
            <PlayerMusica url={casal.musica_url} autoplay={comecou} />
          </div>
        </section>
      )}

      <section className="final-screen">
        {comecou && <CoracoesFlutuantes />}
        {capa && <div className="final-cover"><img src={capa} alt="" /></div>}
        <span className="eyebrow">tocando agora</span>
        <h2 className="sp-display">TE AMO</h2>
        <p>{casal.frase}</p>
      </section>

      <footer>Love &amp; Love — feito com carinho, só pra você 💛</footer>

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

function CoracoesFlutuantes() {
  const posicoes = [10, 25, 40, 55, 70, 85];
  return (
    <>
      {posicoes.map((left, i) => (
        <span
          key={i}
          className="coracao"
          style={{ left: `${left}%`, bottom: "10%", animationDelay: `${i * 0.6}s` }}
        >
          💚
        </span>
      ))}
    </>
  );
}
