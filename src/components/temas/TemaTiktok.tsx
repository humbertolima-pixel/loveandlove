"use client";

import { useState } from "react";
import type { Casal } from "@/lib/types";

export default function TemaTiktok({
  casal,
  comecou,
  onComecar,
}: {
  casal: Casal;
  comecou: boolean;
  onComecar: () => void;
}) {
  const [curtido, setCurtido] = useState(false);
  const [comentariosAbertos, setComentariosAbertos] = useState(false);

  const fotos = casal.fotos.length > 0 ? casal.fotos : [];
  const fotoAtual = fotos[0];

  const comentarios = casal.marcos.length > 0
    ? casal.marcos
        .slice()
        .sort((a, b) => a.data.localeCompare(b.data))
        .map((m) => ({ texto: m.titulo }))
    : [{ texto: "essa história é tudo 🥺" }];

  const usuario = `${slugify(casal.nome1)}_e_${slugify(casal.nome2)}`;
  const embedMusica = obterEmbedMusica(casal.musica_url);

  return (
    <div className="tk-root">
      <style jsx>{`
        .tk-root {
          --preto: #000000;
          --branco: #ffffff;
          --cinza: #a8a8a8;
          --rosa: #fe2c55;
          --azul: #25f4ee;
          background: var(--preto);
          color: var(--branco);
          font-family: -apple-system, sans-serif;
          min-height: 100vh;
          position: relative;
          overflow: hidden;
        }
        .tk-display { font-family: Georgia, serif; font-weight: 700; }

        .video-stage {
          position: relative;
          height: 100vh;
          width: 100%;
          max-width: 480px;
          margin: 0 auto;
          background-size: cover;
          background-position: center;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }
        .video-stage::after {
          content: "";
          position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,.1) 0%, transparent 30%, rgba(0,0,0,.75) 100%);
        }

        .top-bar {
          position: absolute; top: 0; left: 0; right: 0; z-index: 10;
          display: flex; justify-content: center; gap: 1.4rem;
          padding: 1.2rem 0; font-size: .92rem; font-weight: 600;
        }
        .top-bar .ativo { border-bottom: 2px solid var(--branco); padding-bottom: .3rem; }
        .top-bar .inativo { color: var(--cinza); }

        .content { position: relative; z-index: 5; padding: 0 1rem 2.4rem; display: flex; justify-content: space-between; align-items: flex-end; gap: 1rem; }
        .info { flex: 1; min-width: 0; }
        .username { font-weight: 700; font-size: .98rem; margin-bottom: .5rem; }
        .caption { font-size: .9rem; line-height: 1.4; margin-bottom: .6rem; }
        .music-tag { display: flex; align-items: center; gap: .4rem; font-size: .82rem; color: var(--branco); }
        .music-tag svg { width: 14px; height: 14px; fill: var(--branco); }

        .actions { display: flex; flex-direction: column; align-items: center; gap: 1.4rem; }
        .action-btn { display: flex; flex-direction: column; align-items: center; gap: .25rem; background: none; border: none; color: var(--branco); cursor: pointer; }
        .action-btn svg { width: 32px; height: 32px; fill: var(--branco); }
        .action-btn span { font-size: .72rem; font-weight: 600; }
        .liked svg { fill: var(--rosa) !important; }
        .avatar-circ { width: 44px; height: 44px; border-radius: 50%; overflow: hidden; border: 2px solid var(--branco); margin-bottom: .4rem; }

        .comments-sheet {
          position: fixed; left: 0; right: 0; bottom: 0; z-index: 50;
          background: #121212; border-radius: 16px 16px 0 0;
          max-height: 60vh; overflow-y: auto;
          padding: 1.2rem 1.2rem 2rem;
        }
        .comments-sheet h3 { font-size: .95rem; margin-bottom: 1rem; }
        .comment-row { display: flex; gap: .7rem; margin-bottom: 1rem; align-items: flex-start; }
        .comment-avatar { width: 32px; height: 32px; border-radius: 50%; overflow: hidden; flex: 0 0 32px; background: #333; }
        .comment-body { font-size: .85rem; line-height: 1.4; }
        .comment-user { font-weight: 600; color: var(--cinza); font-size: .78rem; margin-bottom: .15rem; }
        .close-comments {
          display: block; margin: 0 auto; background: #2a2a2a; color: var(--branco); border: none;
          padding: .55rem 1.4rem; border-radius: 20px; font-size: .82rem; cursor: pointer;
        }

        footer { text-align: center; padding: 1rem; font-size: .65rem; letter-spacing: .1em; text-transform: uppercase; color: #555; position: relative; z-index: 5; }
      `}</style>

      <div
        className="video-stage"
        style={fotoAtual ? { backgroundImage: `url(${fotoAtual})` } : undefined}
      >
        <div className="top-bar">
          <span className="inativo">Seguindo</span>
          <span className="ativo">Para Você</span>
        </div>

        <div className="content">
          <div className="info">
            <div className="username">@{usuario}</div>
            <div className="caption">{casal.frase}</div>
            <div className="music-tag">
              <svg viewBox="0 0 24 24"><path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" /></svg>
              som original — {casal.nome1} & {casal.nome2}
            </div>
          </div>

          <div className="actions">
            {fotoAtual && (
              <div className="avatar-circ"><img src={fotoAtual} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
            )}
            <button
              className={`action-btn ${curtido ? "liked" : ""}`}
              onClick={() => setCurtido(!curtido)}
            >
              <svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-10-9.3C0.3 8.2 2 4.5 5.6 4c2-.3 3.7.7 4.9 2.3.5.6.9 1.3 1.5 1.3s1-.7 1.5-1.3C14.7 4.7 16.4 3.7 18.4 4c3.6.5 5.3 4.2 3.6 7.7C19.5 16.4 12 21 12 21z" /></svg>
              <span>{curtido ? "infinitas" : "curtir"}</span>
            </button>
            <button className="action-btn" onClick={() => setComentariosAbertos(true)}>
              <svg viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
              <span>{comentarios.length}</span>
            </button>
          </div>
        </div>
      </div>

      <footer>Love &amp; Love — feito com carinho, só pra você</footer>

      {comentariosAbertos && (
        <div className="comments-sheet">
          <h3>{comentarios.length} comentários</h3>
          {comentarios.map((c, i) => (
            <div key={i} className="comment-row">
              <div className="comment-avatar" />
              <div className="comment-body">
                <div className="comment-user">{i % 2 === 0 ? casal.nome1 : casal.nome2}</div>
                {c.texto}
              </div>
            </div>
          ))}
          <button className="close-comments" onClick={() => setComentariosAbertos(false)}>
            Fechar
          </button>
        </div>
      )}

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
            textAlign: "center", gap: "2rem",
          }}
        >
          <div className="tk-display" style={{ fontSize: "clamp(2rem,8vw,3.2rem)" }}>
            <span style={{ color: "#25f4ee" }}>LOVE</span> & <span style={{ color: "#fe2c55" }}>LOVE</span>
          </div>
          <p style={{ color: "#a8a8a8", maxWidth: "30ch", lineHeight: 1.5 }}>
            @{usuario} tá em alta. Toque pra assistir.
          </p>
          <button
            onClick={onComecar}
            aria-label="Começar"
            style={{
              width: 78, height: 78, borderRadius: "50%", background: "#fe2c55",
              display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer",
            }}
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z" /></svg>
          </button>
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
