"use client";

import type { Casal, Frase } from "@/lib/types";
import PlayerMusica from "@/components/PlayerMusica";

export default function TemaNetflix({
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
  const fotoHero = fotos[0];

  // Divide a história livre em "episódios" — um por parágrafo/quebra de linha
  const paragrafos = casal.historia
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const episodios = paragrafos.length > 0
    ? paragrafos.map((texto, i) => ({
        numero: i + 1,
        texto,
        img: fotos[i % Math.max(fotos.length, 1)] ?? fotoHero,
      }))
    : [{ numero: 1, texto: casal.frase, img: fotoHero }];

  const momentos = fotos.slice(0, 12);

  return (
    <div className="netflix-root">
      <style jsx>{`
        .netflix-root {
          --preto: #0a0a0a;
          --preto-2: #141414;
          --vermelho: #e50914;
          --branco: #f5f5f1;
          --cinza-texto: #b3b3b3;
          background: var(--preto);
          color: var(--branco);
          font-family: -apple-system, sans-serif;
          min-height: 100vh;
          overflow-x: hidden;
        }
        .netflix-root img { display: block; width: 100%; height: 100%; object-fit: cover; }
        .nf-display { font-family: Georgia, serif; letter-spacing: 0.02em; }

        @keyframes coracao-flutua {
          0% { transform: translateY(0) scale(0.8); opacity: 0; }
          15% { opacity: 1; }
          100% { transform: translateY(-120px) scale(1.1); opacity: 0; }
        }
        .coracao {
          position: absolute; font-size: 1.4rem; animation: coracao-flutua 3.5s ease-in infinite;
          pointer-events: none;
        }

        header {
          position: fixed; top: 0; left: 0; right: 0; z-index: 200;
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.1rem 4vw;
          background: linear-gradient(180deg, rgba(0,0,0,.85), transparent);
        }
        .logo { font-size: 1.4rem; font-weight: 700; color: var(--vermelho); }
        .logo span { color: var(--branco); }

        .hero {
          position: relative; min-height: 100vh;
          display: flex; align-items: flex-end;
          padding: 0 4vw 8vh;
          background-size: cover; background-position: center;
        }
        .hero::after {
          content: ""; position: absolute; inset: 0;
          background:
            linear-gradient(180deg, rgba(10,10,10,.2) 0%, rgba(10,10,10,.35) 45%, var(--preto) 92%),
            linear-gradient(90deg, rgba(10,10,10,.85) 0%, rgba(10,10,10,.15) 55%);
        }
        .hero-content { position: relative; z-index: 2; max-width: 680px; }
        .tag-row { display: flex; gap: .5rem; margin-bottom: 1rem; flex-wrap: wrap; }
        .tag-row span {
          font-size: .68rem; letter-spacing: .1em; text-transform: uppercase;
          border: 1px solid #555; padding: .25rem .6rem; border-radius: 3px; color: var(--cinza-texto);
        }
        .hero h1 { font-size: clamp(2.4rem, 8vw, 5rem); line-height: .98; animation: fade-in-up 1s ease-out; }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .match { color: #46d369; font-weight: 700; font-size: .95rem; margin-top: .9rem; }
        .hero .desc { margin-top: .8rem; color: #dcdcdc; font-size: 1rem; line-height: 1.6; max-width: 52ch; }
        .cta-row { display: flex; gap: .8rem; margin-top: 1.6rem; flex-wrap: wrap; }
        .btn { display: flex; align-items: center; gap: .5rem; padding: .75rem 1.5rem; border-radius: 4px; font-weight: 700; font-size: .95rem; border: none; cursor: pointer; }
        .btn-play { background: var(--branco); color: #111; }
        .btn svg { width: 18px; height: 18px; fill: currentColor; }

        .row-section { padding: 3.2rem 0 1rem; }
        .row-head { padding: 0 4vw; margin-bottom: 1rem; display: flex; align-items: baseline; gap: .8rem; }
        .row-head h2 { font-size: 1.3rem; font-weight: 700; }
        .row-sub { font-size: .78rem; color: var(--cinza-texto); }
        .row-scroll { display: flex; gap: .9rem; overflow-x: auto; padding: 0 4vw 1.2rem; scrollbar-width: none; }
        .row-scroll::-webkit-scrollbar { display: none; }

        .ep-card { flex: 0 0 280px; background: var(--preto-2); border-radius: 6px; overflow: hidden; transition: transform .3s; }
        .ep-card:hover { transform: scale(1.03); }
        .ep-thumb { height: 150px; position: relative; }
        .ep-num {
          position: absolute; top: .6rem; left: .7rem; font-weight: 700;
          font-size: 1rem; background: rgba(0,0,0,.55); padding: .1rem .55rem; border-radius: 3px;
        }
        .ep-body { padding: .9rem 1rem 1.1rem; }
        .ep-text { font-size: .85rem; color: var(--cinza-texto); line-height: 1.55; max-height: 5.5em; overflow: hidden; }

        .photo-card { flex: 0 0 200px; aspect-ratio: 2/3; border-radius: 6px; overflow: hidden; position: relative; transition: transform .3s; }
        .photo-card:hover { transform: scale(1.04); }

        .synopsis { max-width: 760px; margin: 0 auto; padding: 4rem 4vw; text-align: center; }
        .eyebrow { font-size: .72rem; letter-spacing: .2em; text-transform: uppercase; color: var(--vermelho); font-weight: 700; }
        .synopsis h2 { font-size: clamp(1.6rem, 4vw, 2.4rem); margin: .8rem 0 1.2rem; }
        .synopsis p { color: #dcdcdc; line-height: 1.75; font-size: 1rem; }
        .synopsis .sub-frase { margin-top: 1rem; color: var(--vermelho); font-style: italic; font-size: .92rem; }

        .cast-row { display: flex; gap: 2rem; justify-content: center; flex-wrap: wrap; padding: 0 4vw; }
        .cast-item { text-align: center; }
        .cast-photo { width: 110px; height: 110px; border-radius: 50%; overflow: hidden; margin: 0 auto .7rem; border: 2px solid var(--vermelho); }
        .cast-name { font-weight: 700; font-size: .9rem; }
        .cast-role { font-size: .76rem; color: var(--cinza-texto); margin-top: .2rem; }

        .final-screen {
          min-height: 90vh; display: flex; flex-direction: column; align-items: center; justify-content: center;
          text-align: center; padding: 6vh 6vw; position: relative; overflow: hidden;
          background: radial-gradient(circle at 50% 30%, rgba(229,9,20,.16), transparent 60%), var(--preto);
        }
        .next-ep { font-size: .72rem; letter-spacing: .2em; text-transform: uppercase; color: var(--cinza-texto); margin-bottom: 1.4rem; }
        .final-screen h2 { font-size: clamp(2.8rem, 14vw, 7rem); color: var(--vermelho); text-shadow: 0 0 70px rgba(229,9,20,.5); }
        .final-screen p { margin-top: 1.4rem; max-width: 36ch; color: #e6e6e6; font-size: 1rem; line-height: 1.7; }

        .music-section { padding: 3rem 4vw; text-align: center; }

        footer { text-align: center; padding: 2.2rem 1rem 3rem; font-size: .68rem; letter-spacing: .12em; text-transform: uppercase; color: #555; }
      `}</style>

      <header>
        <div className="logo">LOVE <span>&</span> LOVE</div>
      </header>

      <section
        className="hero"
        style={fotoHero ? { backgroundImage: `url(${fotoHero})` } : undefined}
      >
        <div className="hero-content">
          <div className="tag-row">
            <span>Romance</span><span>Comédia</span><span>Dramalhão</span>
          </div>
          <h1 className="nf-display">{casal.nome1} & {casal.nome2}</h1>
          <div className="match">100% pra você</div>
          <p className="desc">{casal.frase}</p>
          <div className="cta-row">
            <button
              className="btn btn-play"
              onClick={() => document.getElementById("nf-temporada")?.scrollIntoView({ behavior: "smooth" })}
            >
              <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg> Assistir
            </button>
          </div>
        </div>
      </section>

      <section className="synopsis">
        <span className="eyebrow">sinopse</span>
        <h2 className="nf-display">Quando dois se tornam um &ldquo;nós&rdquo;</h2>
        <p>{casal.frase}</p>
        {fraseAleatoria && <p className="sub-frase">&ldquo;{fraseAleatoria.texto}&rdquo;</p>}
      </section>

      <section className="row-section" id="nf-temporada">
        <div className="row-head">
          <h2>Temporada 1: a nossa história</h2>
          <span className="row-sub">{episodios.length} episódios</span>
        </div>
        <div className="row-scroll">
          {episodios.map((ep) => (
            <div key={ep.numero} className="ep-card">
              <div className="ep-thumb">
                {ep.img && <img src={ep.img} alt="" />}
                <span className="ep-num">EP {ep.numero}</span>
              </div>
              <div className="ep-body">
                <div className="ep-text">{ep.texto}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {momentos.length > 0 && (
        <section className="row-section">
          <div className="row-head">
            <h2>Em destaque: nossos momentos</h2>
            <span className="row-sub">cenas favoritas</span>
          </div>
          <div className="row-scroll">
            {momentos.map((m, i) => (
              <div key={i} className="photo-card">
                <img src={m} alt="" />
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="row-section">
        <div className="row-head">
          <h2>Elenco principal</h2>
          <span className="row-sub">os protagonistas</span>
        </div>
        <div className="cast-row">
          <div className="cast-item">
            {fotos[0] && <div className="cast-photo"><img src={fotos[0]} alt="" /></div>}
            <div className="cast-name">{casal.nome1}</div>
            <div className="cast-role">protagonista</div>
          </div>
          <div className="cast-item">
            {(fotos[1] ?? fotos[0]) && <div className="cast-photo"><img src={fotos[1] ?? fotos[0]} alt="" /></div>}
            <div className="cast-name">{casal.nome2}</div>
            <div className="cast-role">protagonista</div>
          </div>
        </div>
      </section>

      {casal.musica_url && (
        <section className="music-section">
          <span className="eyebrow">trilha sonora</span>
          <div style={{ marginTop: "1.2rem" }}>
            <PlayerMusica url={casal.musica_url} autoplay={comecou} />
          </div>
        </section>
      )}

      <section className="final-screen">
        {comecou && <CoracoesFlutuantes />}
        <span className="next-ep">próximo episódio em: para sempre</span>
        <h2 className="nf-display">TE AMO</h2>
        <p>E essa é só a primeira temporada da nossa história.</p>
      </section>

      <footer>Love &amp; Love — feito com carinho, só pra você 💛</footer>

      {!comecou && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 999, background: "#0a0a0a",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            textAlign: "center", gap: "2rem",
          }}
        >
          <div className="nf-display" style={{ fontSize: "clamp(2.2rem,9vw,4.5rem)", color: "#e50914" }}>
            LOVE <span style={{ color: "#f5f5f1" }}>&</span> LOVE
          </div>
          <p style={{ color: "#b3b3b3", maxWidth: "30ch", lineHeight: 1.5 }}>
            Uma minissérie real, estrelada por {casal.nome1} & {casal.nome2}.
          </p>
          <button
            onClick={onComecar}
            aria-label="Começar"
            style={{
              width: 88, height: 88, borderRadius: "50%", background: "#e50914",
              display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer",
            }}
          >
            <svg width="34" height="34" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z" /></svg>
          </button>
          <span style={{ fontSize: ".7rem", letterSpacing: ".18em", textTransform: "uppercase", color: "#666" }}>
            toque para assistir
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
          💛
        </span>
      ))}
    </>
  );
}
