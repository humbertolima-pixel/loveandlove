"use client";

import type { Casal } from "@/lib/types";

export default function TemaNetflix({
  casal,
  comecou,
  onComecar,
}: {
  casal: Casal;
  comecou: boolean;
  onComecar: () => void;
}) {
  const fotos = casal.fotos.length > 0 ? casal.fotos : [];
  const fotoHero = fotos[0];

  const episodios = casal.marcos.length > 0
    ? casal.marcos
        .slice()
        .sort((a, b) => a.data.localeCompare(b.data))
        .map((m, i) => ({
          numero: i + 1,
          titulo: m.titulo,
          duracao: i === casal.marcos.length - 1 ? "em cartaz" : `${5 + i * 8} min`,
          desc: m.titulo,
          img: fotos[i % Math.max(fotos.length, 1)] ?? fotoHero,
        }))
    : [
        {
          numero: 1,
          titulo: "Como tudo começou",
          duracao: "em cartaz",
          desc: casal.frase,
          img: fotoHero,
        },
      ];

  const momentos = fotos.slice(0, 6).map((f, i) => ({
    legenda: i === 0 ? "esse momento, sabe qual" : "cena favorita",
    img: f,
  }));

  const embedMusica = obterEmbedMusica(casal.musica_url);

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
        .hero h1 { font-size: clamp(2.4rem, 8vw, 5rem); line-height: .98; }
        .match { color: #46d369; font-weight: 700; font-size: .95rem; margin-top: .9rem; }
        .hero .desc { margin-top: .8rem; color: #dcdcdc; font-size: 1rem; line-height: 1.6; max-width: 52ch; }
        .cta-row { display: flex; gap: .8rem; margin-top: 1.6rem; flex-wrap: wrap; }
        .btn { display: flex; align-items: center; gap: .5rem; padding: .75rem 1.5rem; border-radius: 4px; font-weight: 700; font-size: .95rem; border: none; cursor: pointer; }
        .btn-play { background: var(--branco); color: #111; }
        .btn-info { background: rgba(109,109,110,.5); color: var(--branco); }
        .btn svg { width: 18px; height: 18px; fill: currentColor; }

        .row-section { padding: 3.2rem 0 1rem; }
        .row-head { padding: 0 4vw; margin-bottom: 1rem; display: flex; align-items: baseline; gap: .8rem; }
        .row-head h2 { font-size: 1.3rem; font-weight: 700; }
        .row-sub { font-size: .78rem; color: var(--cinza-texto); }
        .row-scroll { display: flex; gap: .9rem; overflow-x: auto; padding: 0 4vw 1.2rem; scrollbar-width: none; }
        .row-scroll::-webkit-scrollbar { display: none; }

        .ep-card { flex: 0 0 260px; background: var(--preto-2); border-radius: 6px; overflow: hidden; }
        .ep-thumb { height: 145px; position: relative; }
        .ep-num {
          position: absolute; top: .6rem; left: .7rem; font-weight: 700;
          font-size: 1rem; background: rgba(0,0,0,.55); padding: .1rem .55rem; border-radius: 3px;
        }
        .ep-body { padding: .9rem 1rem 1.1rem; }
        .ep-title { font-weight: 700; font-size: .92rem; margin-bottom: .35rem; }
        .ep-desc { font-size: .78rem; color: var(--cinza-texto); line-height: 1.5; }
        .ep-dur { font-size: .68rem; color: #777; margin-top: .5rem; letter-spacing: .05em; }

        .photo-card { flex: 0 0 200px; aspect-ratio: 2/3; border-radius: 6px; overflow: hidden; position: relative; }
        .photo-cap {
          position: absolute; left: 0; right: 0; bottom: 0; padding: .8rem .7rem;
          background: linear-gradient(180deg, transparent, rgba(0,0,0,.9)); font-size: .82rem; font-weight: 600;
        }

        .synopsis { max-width: 760px; margin: 0 auto; padding: 4rem 4vw; text-align: center; }
        .eyebrow { font-size: .72rem; letter-spacing: .2em; text-transform: uppercase; color: var(--vermelho); font-weight: 700; }
        .synopsis h2 { font-size: clamp(1.6rem, 4vw, 2.4rem); margin: .8rem 0 1.2rem; }
        .synopsis p { color: #dcdcdc; line-height: 1.75; font-size: 1rem; }

        .final-screen {
          min-height: 70vh; display: flex; flex-direction: column; align-items: center; justify-content: center;
          text-align: center; padding: 6vh 6vw;
          background: radial-gradient(circle at 50% 30%, rgba(229,9,20,.16), transparent 60%), var(--preto);
        }
        .next-ep { font-size: .72rem; letter-spacing: .2em; text-transform: uppercase; color: var(--cinza-texto); margin-bottom: 1.4rem; }
        .final-screen h2 { font-size: clamp(2.8rem, 14vw, 7rem); color: var(--vermelho); text-shadow: 0 0 70px rgba(229,9,20,.5); }
        .final-screen p { margin-top: 1.4rem; max-width: 36ch; color: #e6e6e6; font-size: 1rem; line-height: 1.7; }

        footer { text-align: center; padding: 2.2rem 1rem 3rem; font-size: .68rem; letter-spacing: .12em; text-transform: uppercase; color: #555; }

        .mini-player {
          position: fixed; bottom: 18px; right: 18px; z-index: 300;
          background: rgba(20,20,20,.92); border: 1px solid #333; border-radius: 10px;
          padding: .7rem .9rem; display: flex; align-items: center; gap: .6rem;
          font-size: .72rem; color: var(--cinza-texto);
        }
        .eq { display: flex; gap: 2px; align-items: flex-end; height: 14px; }
        .eq i { width: 3px; background: var(--vermelho); display: block; animation: eq 1s infinite ease-in-out; }
        .eq i:nth-child(2) { animation-delay: .2s; }
        .eq i:nth-child(3) { animation-delay: .4s; }
        @keyframes eq { 0%, 100% { height: 4px; } 50% { height: 14px; } }
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
      </section>

      <section className="row-section" id="nf-temporada">
        <div className="row-head">
          <h2>Temporada 1: Como começou</h2>
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
                <div className="ep-title">{ep.titulo}</div>
                <div className="ep-dur">{ep.duracao}</div>
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
                <img src={m.img} alt="" />
                <div className="photo-cap">{m.legenda}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="final-screen">
        <span className="next-ep">próximo episódio em: para sempre</span>
        <h2 className="nf-display">TE AMO</h2>
        <p>E essa é só a primeira temporada da nossa história.</p>
      </section>

      <footer>Love &amp; Love — feito com carinho, só pra você</footer>

      {comecou && embedMusica && (
        <>
          <div style={{ position: "fixed", width: 1, height: 1, bottom: 0, right: 0, overflow: "hidden", opacity: 0, pointerEvents: "none" }}>
            <iframe
              src={embedMusica}
              width="300"
              height="80"
              allow="autoplay; encrypted-media"
              title="música"
            />
          </div>
          <div className="mini-player">
            <div className="eq"><i /><i /><i /></div>
            <span>tocando agora</span>
          </div>
        </>
      )}

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
