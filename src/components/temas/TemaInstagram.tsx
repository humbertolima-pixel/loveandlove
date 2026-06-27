"use client";

import type { Casal } from "@/lib/types";

export default function TemaInstagram({
  casal,
  comecou,
  onComecar,
}: {
  casal: Casal;
  comecou: boolean;
  onComecar: () => void;
}) {
  const fotos = casal.fotos.length > 0 ? casal.fotos : [];
  const avatar = fotos[0];
  const usuario = `${slugify(casal.nome1)}.e.${slugify(casal.nome2)}`;

  const destaques = casal.marcos.length > 0
    ? casal.marcos
        .slice()
        .sort((a, b) => a.data.localeCompare(b.data))
        .map((m, i) => ({
          rotulo: m.titulo,
          img: fotos[i % Math.max(fotos.length, 1)] ?? avatar,
        }))
    : [{ rotulo: "hoje", img: avatar }];

  const momentos = fotos.slice(0, 6);
  const embedMusica = obterEmbedMusica(casal.musica_url);

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
        }
        .ig-root img { display: block; width: 100%; height: 100%; object-fit: cover; }
        .ig-display { font-family: Georgia, serif; font-weight: 700; }

        header {
          position: sticky; top: 0; z-index: 200;
          display: flex; align-items: center; justify-content: space-between;
          padding: .9rem 4vw; background: rgba(255,255,255,.92); backdrop-filter: blur(8px);
          border-bottom: 1px solid var(--borda);
        }
        .logo { font-weight: 800; font-size: 1.15rem; }
        .logo span { background: var(--grad); -webkit-background-clip: text; background-clip: text; color: transparent; }

        .profile { max-width: 935px; margin: 0 auto; padding: 2.6rem 5vw 1.6rem; display: flex; gap: 2rem; align-items: center; flex-wrap: wrap; }
        .avatar-ring { width: 120px; height: 120px; border-radius: 50%; padding: 4px; background: var(--grad); flex: 0 0 120px; }
        .avatar-ring-inner { width: 100%; height: 100%; border-radius: 50%; overflow: hidden; border: 4px solid #fff; }
        .profile-info { flex: 1; min-width: 220px; }
        .uname { font-weight: 700; font-size: 1.4rem; display: flex; align-items: center; gap: .5rem; }
        .uname svg { width: 18px; height: 18px; fill: var(--rosa); }
        .profile-stats { display: flex; gap: 1.6rem; margin: .9rem 0; font-size: .88rem; }
        .profile-stats b { display: block; font-size: .95rem; }
        .profile-bio { font-size: .86rem; line-height: 1.55; }
        .tag { color: var(--rosa); font-weight: 600; }

        .highlights { max-width: 935px; margin: 0 auto; padding: .8rem 5vw 2rem; display: flex; gap: 1.6rem; overflow-x: auto; }
        .highlight { text-align: center; flex: 0 0 auto; }
        .h-ring { width: 66px; height: 66px; border-radius: 50%; padding: 2px; background: linear-gradient(135deg,#ccc,#999); margin: 0 auto .4rem; }
        .h-ring img { border-radius: 50%; border: 3px solid #fff; }
        .highlight span { font-size: .68rem; max-width: 66px; display: block; word-break: break-word; }

        .feed-section { max-width: 935px; margin: 0 auto; padding: 1.8rem 5vw; }
        .section-title { display: flex; align-items: center; gap: .5rem; margin-bottom: 1.1rem; }
        .section-title h2 { font-size: 1.05rem; font-weight: 700; }

        .feed-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: .35rem; }
        .feed-item { aspect-ratio: 1/1; overflow: hidden; }

        .post-card { border: 1px solid var(--borda); border-radius: 10px; overflow: hidden; margin-bottom: 1.4rem; background: #fff; }
        .post-head { display: flex; align-items: center; gap: .55rem; padding: .65rem .85rem; }
        .p-avatar { width: 30px; height: 30px; border-radius: 50%; overflow: hidden; }
        .p-name { font-weight: 600; font-size: .82rem; }
        .post-img { aspect-ratio: 4/3; }
        .post-caption { padding: .3rem .85rem .9rem; font-size: .82rem; line-height: 1.5; }
        .post-caption b { margin-right: .4rem; }

        .cast-grid { display: flex; gap: 2rem; flex-wrap: wrap; justify-content: center; padding: .8rem 0 2.2rem; }
        .cast-item { text-align: center; }
        .cast-photo { width: 88px; height: 88px; border-radius: 50%; overflow: hidden; margin: 0 auto .55rem; border: 3px solid var(--rosa); }
        .c-name { font-weight: 700; font-size: .85rem; }
        .c-role { font-size: .72rem; color: var(--cinza); margin-top: .15rem; }

        .final-screen {
          min-height: 70vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;
          background: var(--grad); color: #fff; padding: 6vh 6vw;
        }
        .final-screen .eyebrow { font-size: .78rem; letter-spacing: .15em; text-transform: uppercase; opacity: .9; margin-bottom: .7rem; }
        .final-screen h2 { font-size: clamp(2.6rem, 14vw, 6rem); }
        .final-screen p { margin-top: 1.2rem; max-width: 34ch; line-height: 1.7; }
        .final-like { margin-top: 1.6rem; display: flex; align-items: center; gap: .5rem; font-size: .82rem; opacity: .95; }
        .final-like svg { width: 22px; height: 22px; fill: #fff; }

        footer { text-align: center; padding: 1.8rem 1rem 3rem; font-size: .66rem; letter-spacing: .12em; text-transform: uppercase; color: #aaa; }

        .mini-player {
          position: fixed; top: 14px; left: 50%; transform: translateX(-50%); z-index: 300;
          background: #fff; border: 1px solid var(--borda); border-radius: 30px; padding: .5rem 1rem;
          display: flex; align-items: center; gap: .6rem; font-size: .72rem; color: var(--cinza);
          box-shadow: 0 4px 16px rgba(0,0,0,.08);
        }
        .eq { display: flex; gap: 2px; align-items: flex-end; height: 12px; }
        .eq i { width: 3px; background: var(--rosa); display: block; animation: eq 1s infinite ease-in-out; }
        .eq i:nth-child(2) { animation-delay: .2s; }
        .eq i:nth-child(3) { animation-delay: .4s; }
        @keyframes eq { 0%, 100% { height: 4px; } 50% { height: 12px; } }
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
        <section className="feed-section">
          <div className="highlights">
            {destaques.map((d, i) => (
              <div key={i} className="highlight">
                <div className="h-ring">{d.img && <img src={d.img} alt="" />}</div>
                <span>{d.rotulo}</span>
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
        <div className="section-title"><h2>Post especial</h2></div>
        <div className="post-card">
          <div className="post-head">
            {avatar && <div className="p-avatar"><img src={avatar} alt="" /></div>}
            <div className="p-name">{usuario}</div>
          </div>
          {fotos[1] && <div className="post-img"><img src={fotos[1]} alt="" /></div>}
          <div className="post-caption"><b>{usuario}</b>{casal.frase}</div>
        </div>
      </section>

      <section className="final-screen">
        <span className="eyebrow">história em destaque</span>
        <h2 className="ig-display">TE AMO</h2>
        <p>{casal.frase}</p>
        <div className="final-like">
          <svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-10-9.3C0.3 8.2 2 4.5 5.6 4c2-.3 3.7.7 4.9 2.3.5.6.9 1.3 1.5 1.3s1-.7 1.5-1.3C14.7 4.7 16.4 3.7 18.4 4c3.6.5 5.3 4.2 3.6 7.7C19.5 16.4 12 21 12 21z" /></svg>
          curtido por nós dois, pra sempre
        </div>
      </section>

      <footer>Love &amp; Love — feito com carinho, só pra você</footer>

      {comecou && embedMusica && (
        <>
          <div style={{ position: "fixed", width: 1, height: 1, bottom: 0, right: 0, overflow: "hidden", opacity: 0, pointerEvents: "none" }}>
            <iframe src={embedMusica} width="300" height="80" allow="autoplay; encrypted-media" title="música" />
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
