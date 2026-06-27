"use client";

import type { Casal, Frase } from "@/lib/types";
import PlayerMusica from "@/components/PlayerMusica";

export default function TemaInstagram({
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
  const avatar = fotos[0];
  const usuario = `${slugify(casal.nome1)}.e.${slugify(casal.nome2)}`;

  const paragrafos = casal.historia
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const destaques = paragrafos.length > 0
    ? paragrafos.map((texto, i) => ({
        rotulo: `parte ${i + 1}`,
        texto,
        img: fotos[i % Math.max(fotos.length, 1)] ?? avatar,
      }))
    : [{ rotulo: "hoje", texto: casal.frase, img: avatar }];

  const momentos = fotos.slice(0, 12);

  return (
    <div className="ig-root">
      <style jsx>{`
        .ig-root {
          --bg: #fafafa;
          --branco: #ffffff;
          --preto: #262626;
          --cinza: #737373;
          --borda: #dbdbdb;
          --grad: linear-gradient(135deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5);
          --rosa: #d62976;
          background: var(--bg);
          color: var(--preto);
          font-family: -apple-system, sans-serif;
          min-height: 100vh;
          overflow-x: hidden;
        }
        .ig-root img { display: block; width: 100%; height: 100%; object-fit: cover; }
        .ig-display { font-family: Georgia, serif; font-weight: 700; }

        @keyframes coracao-flutua {
          0% { transform: translateY(0) scale(0.8); opacity: 0; }
          15% { opacity: 1; }
          100% { transform: translateY(-120px) scale(1.1); opacity: 0; }
        }
        .coracao { position: absolute; font-size: 1.4rem; animation: coracao-flutua 3.5s ease-in infinite; pointer-events: none; }

        header {
          position: sticky; top: 0; z-index: 200;
          display: flex; align-items: center; justify-content: space-between;
          padding: .9rem 4vw; background: rgba(255,255,255,.92); backdrop-filter: blur(8px);
          border-bottom: 1px solid var(--borda);
        }
        .logo { font-weight: 800; font-size: 1.15rem; }
        .logo span { background: var(--grad); -webkit-background-clip: text; background-clip: text; color: transparent; }

        .profile { max-width: 935px; margin: 0 auto; padding: 2.6rem 5vw 1.6rem; display: flex; gap: 2rem; align-items: center; flex-wrap: wrap; }
        .avatar-ring { width: 130px; height: 130px; border-radius: 50%; padding: 4px; background: var(--grad); flex: 0 0 130px; animation: fade-in-up 1s ease-out; }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .avatar-ring-inner { width: 100%; height: 100%; border-radius: 50%; overflow: hidden; border: 4px solid #fff; }
        .profile-info { flex: 1; min-width: 220px; }
        .uname { font-weight: 700; font-size: 1.5rem; display: flex; align-items: center; gap: .5rem; }
        .uname svg { width: 18px; height: 18px; fill: var(--rosa); }
        .profile-stats { display: flex; gap: 1.7rem; margin: .9rem 0; font-size: .9rem; }
        .profile-stats b { display: block; font-size: .98rem; }
        .profile-bio { font-size: .88rem; line-height: 1.55; }
        .tag { color: var(--rosa); font-weight: 600; }

        .highlights { max-width: 935px; margin: 0 auto; padding: .8rem 5vw 2rem; display: flex; gap: 1.6rem; overflow-x: auto; }
        .highlight { text-align: center; flex: 0 0 130px; }
        .h-ring { width: 70px; height: 70px; border-radius: 50%; padding: 2px; background: linear-gradient(135deg,#ccc,#999); margin: 0 auto .4rem; }
        .h-ring img { border-radius: 50%; border: 3px solid #fff; }
        .highlight span { font-size: .7rem; display: block; word-break: break-word; }
        .highlight-text { font-size: .76rem; color: var(--cinza); margin-top: .3rem; line-height: 1.35; }

        .feed-section { max-width: 935px; margin: 0 auto; padding: 2rem 5vw; }
        .section-title { display: flex; align-items: center; gap: .5rem; margin-bottom: 1.1rem; }
        .section-title h2 { font-size: 1.1rem; font-weight: 700; }

        .feed-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: .4rem; }
        .feed-item { aspect-ratio: 1/1; overflow: hidden; transition: transform .2s; }
        .feed-item:hover { transform: scale(1.02); }

        .post-card { border: 1px solid var(--borda); border-radius: 10px; overflow: hidden; margin-bottom: 1.5rem; background: #fff; }
        .post-head { display: flex; align-items: center; gap: .6rem; padding: .7rem .9rem; }
        .p-avatar { width: 32px; height: 32px; border-radius: 50%; overflow: hidden; }
        .p-name { font-weight: 600; font-size: .85rem; }
        .post-img { aspect-ratio: 4/3; }
        .post-caption { padding: .3rem .9rem 1rem; font-size: .85rem; line-height: 1.5; }
        .post-caption b { margin-right: .4rem; }

        .final-screen {
          min-height: 90vh; position: relative; overflow: hidden;
          display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;
          background: var(--grad); color: #fff; padding: 6vh 6vw;
        }
        .final-screen .eyebrow { font-size: .78rem; letter-spacing: .15em; text-transform: uppercase; opacity: .9; margin-bottom: .7rem; }
        .final-screen h2 { font-size: clamp(2.6rem, 14vw, 6.5rem); }
        .final-screen p { margin-top: 1.2rem; max-width: 34ch; line-height: 1.7; }
        .final-like { margin-top: 1.6rem; display: flex; align-items: center; gap: .5rem; font-size: .85rem; opacity: .95; }
        .final-like svg { width: 24px; height: 24px; fill: #fff; }

        .music-section { max-width: 935px; margin: 0 auto; padding: 2rem 5vw; text-align: center; }

        footer { text-align: center; padding: 2rem 1rem 3rem; font-size: .66rem; letter-spacing: .12em; text-transform: uppercase; color: #aaa; }
      `}</style>

      <header>
        <div className="logo">Love<span>&Love</span></div>
      </header>

      <section className="profile">
        {avatar && (
          <div className="avatar-ring">
            <div className="avatar-ring-inner"><img src={avatar} alt="" /></div>
          </div>
        )}
        <div className="profile-info">
          <div className="uname">
            {usuario}
            <svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-10-9.3C0.3 8.2 2 4.5 5.6 4c2-.3 3.7.7 4.9 2.3.5.6.9 1.3 1.5 1.3s1-.7 1.5-1.3C14.7 4.7 16.4 3.7 18.4 4c3.6.5 5.3 4.2 3.6 7.7C19.5 16.4 12 21 12 21z" /></svg>
          </div>
          <div className="profile-stats">
            <div><b>{Math.max(momentos.length, 1)}</b>publicações</div>
            <div><b>1</b>relacionamento</div>
            <div><b>∞</b>planos juntos</div>
          </div>
          <div className="profile-bio">
            💛 {casal.nome1} & {casal.nome2}, uma história só.<br />
            {casal.frase}<br />
            <span className="tag">#paraSempre</span>
          </div>
        </div>
      </section>

      {destaques.length > 0 && (
        <section className="feed-section" style={{ paddingTop: 0 }}>
          <div className="section-title"><h2>Destaques: a nossa história</h2></div>
          <div className="highlights">
            {destaques.map((d, i) => (
              <div key={i} className="highlight">
                <div className="h-ring">{d.img && <img src={d.img} alt="" />}</div>
                <span>{d.rotulo}</span>
                <div className="highlight-text">{d.texto}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {momentos.length > 0 && (
        <section className="feed-section">
          <div className="section-title"><h2>Momentos</h2></div>
          <div className="feed-grid">
            {momentos.map((m, i) => (
              <div key={i} className="feed-item"><img src={m} alt="" /></div>
            ))}
          </div>
        </section>
      )}

      <section className="feed-section">
        <div className="section-title"><h2>Post fixado</h2></div>
        <div className="post-card">
          <div className="post-head">
            {avatar && <div className="p-avatar"><img src={avatar} alt="" /></div>}
            <div className="p-name">{usuario}</div>
          </div>
          {(fotos[1] ?? fotos[0]) && <div className="post-img"><img src={fotos[1] ?? fotos[0]} alt="" /></div>}
          <div className="post-caption"><b>{usuario}</b>{casal.frase}</div>
        </div>
        {fraseAleatoria && (
          <p style={{ textAlign: "center", color: "var(--rosa)", fontStyle: "italic", fontSize: ".88rem", marginTop: "1rem" }}>
            &ldquo;{fraseAleatoria.texto}&rdquo;
          </p>
        )}
      </section>

      {casal.musica_url && (
        <section className="music-section">
          <div className="section-title" style={{ justifyContent: "center" }}><h2>Som da história</h2></div>
          <div style={{ marginTop: "1rem" }}>
            <PlayerMusica url={casal.musica_url} autoplay={comecou} />
          </div>
        </section>
      )}

      <section className="final-screen">
        {comecou && <CoracoesFlutuantes />}
        <span className="eyebrow">história em destaque</span>
        <h2 className="ig-display">TE AMO</h2>
        <p>{casal.frase}</p>
        <div className="final-like">
          <svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-10-9.3C0.3 8.2 2 4.5 5.6 4c2-.3 3.7.7 4.9 2.3.5.6.9 1.3 1.5 1.3s1-.7 1.5-1.3C14.7 4.7 16.4 3.7 18.4 4c3.6.5 5.3 4.2 3.6 7.7C19.5 16.4 12 21 12 21z" /></svg>
          curtido por nós dois, pra sempre
        </div>
      </section>

      <footer>Love &amp; Love — feito com carinho, só pra você 💛</footer>

      {!comecou && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 999, background: "linear-gradient(135deg,#feda75,#fa7e1e,#d62976,#962fbf,#4f5bd5)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            textAlign: "center", gap: "2rem", color: "#fff",
          }}
        >
          {avatar && (
            <div style={{ width: 120, height: 120, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 104, height: 104, borderRadius: "50%", overflow: "hidden", border: "3px solid #fff" }}>
                <img src={avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            </div>
          )}
          <div className="ig-display" style={{ fontSize: "clamp(1.8rem,7vw,2.6rem)" }}>Love & Love</div>
          <p style={{ maxWidth: "30ch", lineHeight: 1.5, opacity: 0.95 }}>
            Um perfil só de {casal.nome1} & {casal.nome2}, com tudo que já vivemos.
          </p>
          <button
            onClick={onComecar}
            aria-label="Começar"
            style={{
              width: 78, height: 78, borderRadius: "50%", background: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer",
            }}
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="#d62976"><path d="M8 5v14l11-7z" /></svg>
          </button>
          <span style={{ fontSize: ".7rem", letterSpacing: ".18em", textTransform: "uppercase", opacity: 0.85 }}>
            toque para entrar
          </span>
        </div>
      )}
    </div>
  );
}

function slugify(nome: string): string {
  return nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "");
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
          💖
        </span>
      ))}
    </>
  );
}
