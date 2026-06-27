"use client";

import type { Casal } from "@/lib/types";

export default function TemaFacebook({
  casal,
  comecou,
  onComecar,
}: {
  casal: Casal;
  comecou: boolean;
  onComecar: () => void;
}) {
  const fotos = casal.fotos.length > 0 ? casal.fotos : [];
  const fotoCapa = fotos[0];
  const fotoPerfil = fotos[1] ?? fotos[0];

  const posts = casal.marcos.length > 0
    ? casal.marcos
        .slice()
        .sort((a, b) => b.data.localeCompare(a.data))
        .map((m, i) => ({
          texto: m.titulo,
          data: formatarData(m.data),
          img: fotos[(i + 2) % Math.max(fotos.length, 1)] ?? fotoCapa,
        }))
    : [{ texto: casal.frase, data: "hoje", img: fotoCapa }];

  const embedMusica = obterEmbedMusica(casal.musica_url);

  return (
    <div className="fb-root">
      <style jsx>{`
        .fb-root {
          --azul: #1877f2;
          --fundo: #f0f2f5;
          --branco: #ffffff;
          --preto: #1c1e21;
          --cinza: #65676b;
          background: var(--fundo);
          color: var(--preto);
          font-family: -apple-system, sans-serif;
          min-height: 100vh;
        }
        .fb-root img { display: block; width: 100%; height: 100%; object-fit: cover; }
        .fb-display { font-weight: 700; }

        header { background: var(--branco); padding: .8rem 4vw; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #dadde1; }
        .logo { font-weight: 800; font-size: 1.3rem; color: var(--azul); }

        .profile-card { max-width: 680px; margin: 1rem auto 0; background: var(--branco); border-radius: 8px; overflow: hidden; box-shadow: 0 1px 2px rgba(0,0,0,.1); }
        .cover-photo { aspect-ratio: 16/7; background: var(--fundo); position: relative; }
        .profile-header { padding: 0 1.4rem 1.2rem; position: relative; }
        .profile-pic-wrap { width: 132px; height: 132px; border-radius: 50%; border: 4px solid var(--branco); overflow: hidden; margin-top: -66px; background: #ddd; }
        .profile-name { font-size: 1.5rem; font-weight: 700; margin-top: .8rem; }
        .profile-sub { font-size: .88rem; color: var(--cinza); margin-top: .2rem; }
        .relationship-badge {
          display: inline-flex; align-items: center; gap: .4rem; background: #e7f3ff; color: var(--azul);
          font-size: .8rem; font-weight: 600; padding: .35rem .8rem; border-radius: 20px; margin-top: .7rem;
        }

        .feed { max-width: 680px; margin: 1rem auto 2rem; display: flex; flex-direction: column; gap: 1rem; }
        .post { background: var(--branco); border-radius: 8px; box-shadow: 0 1px 2px rgba(0,0,0,.1); overflow: hidden; }
        .post-head { display: flex; align-items: center; gap: .7rem; padding: .9rem 1.1rem .5rem; }
        .post-avatar { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; background: #ddd; }
        .post-author { font-weight: 600; font-size: .92rem; }
        .post-time { font-size: .76rem; color: var(--cinza); }
        .post-text { padding: .4rem 1.1rem .8rem; font-size: .92rem; line-height: 1.45; }
        .post-img { aspect-ratio: 16/10; background: var(--fundo); }
        .post-actions { display: flex; padding: .5rem 1.1rem; border-top: 1px solid #eee; gap: .4rem; }
        .post-actions button {
          flex: 1; background: none; border: none; padding: .5rem; font-size: .85rem; font-weight: 600;
          color: var(--cinza); display: flex; align-items: center; justify-content: center; gap: .4rem; cursor: pointer;
        }
        .post-actions svg { width: 18px; height: 18px; fill: var(--cinza); }
        .reactions { padding: .3rem 1.1rem; font-size: .82rem; color: var(--cinza); }

        .final-screen {
          min-height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;
          background: var(--azul); color: #fff; padding: 6vh 6vw;
        }
        .final-screen .eyebrow { font-size: .76rem; letter-spacing: .12em; text-transform: uppercase; opacity: .85; margin-bottom: .7rem; }
        .final-screen h2 { font-size: clamp(2.4rem, 12vw, 5rem); }
        .final-screen p { margin-top: 1.1rem; max-width: 34ch; line-height: 1.7; }

        footer { text-align: center; padding: 1.6rem 1rem 3rem; font-size: .66rem; letter-spacing: .1em; text-transform: uppercase; color: #999; }
      `}</style>

      <header>
        <div className="logo">love&love</div>
      </header>

      <div className="profile-card">
        <div className="cover-photo">
          {fotoCapa && <img src={fotoCapa} alt="" />}
        </div>
        <div className="profile-header">
          <div className="profile-pic-wrap">
            {fotoPerfil && <img src={fotoPerfil} alt="" />}
          </div>
          <div className="profile-name">{casal.nome1} & {casal.nome2}</div>
          <div className="profile-sub">Está em um relacionamento</div>
          <div className="relationship-badge">
            <span>💛</span> Namorando desde {formatarData(casal.data_inicio)}
          </div>
        </div>
      </div>

      <div className="feed">
        {posts.map((p, i) => (
          <div key={i} className="post">
            <div className="post-head">
              {fotoPerfil && <div className="post-avatar"><img src={fotoPerfil} alt="" /></div>}
              <div>
                <div className="post-author">{casal.nome1} & {casal.nome2}</div>
                <div className="post-time">{p.data}</div>
              </div>
            </div>
            <div className="post-text">{p.texto}</div>
            {p.img && <div className="post-img"><img src={p.img} alt="" /></div>}
            <div className="reactions">💛 vocês dois curtiram isso</div>
            <div className="post-actions">
              <button>
                <svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-10-9.3C0.3 8.2 2 4.5 5.6 4c2-.3 3.7.7 4.9 2.3.5.6.9 1.3 1.5 1.3s1-.7 1.5-1.3C14.7 4.7 16.4 3.7 18.4 4c3.6.5 5.3 4.2 3.6 7.7C19.5 16.4 12 21 12 21z" /></svg>
                Curtir
              </button>
              <button>
                <svg viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
                Comentar
              </button>
            </div>
          </div>
        ))}
      </div>

      <section className="final-screen">
        <span className="eyebrow">memória compartilhada</span>
        <h2 className="fb-display">TE AMO</h2>
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
            position: "fixed", inset: 0, zIndex: 999, background: "#1877f2",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            textAlign: "center", gap: "2rem", color: "#fff",
          }}
        >
          <div className="fb-display" style={{ fontSize: "clamp(1.8rem,7vw,2.8rem)" }}>love&love</div>
          <p style={{ maxWidth: "30ch", lineHeight: 1.5 }}>
            O perfil de {casal.nome1} & {casal.nome2}. Toque para ver a timeline.
          </p>
          <button
            onClick={onComecar}
            style={{
              background: "#fff", color: "#1877f2", border: "none", padding: ".9rem 2rem",
              borderRadius: 6, fontWeight: 700, fontSize: ".95rem", cursor: "pointer",
            }}
          >
            Ver perfil
          </button>
        </div>
      )}
    </div>
  );
}

function formatarData(data: string): string {
  const [ano, mes, dia] = data.split("-");
  const meses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  return `${dia} de ${meses[Number(mes) - 1]} de ${ano}`;
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
