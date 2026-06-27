"use client";

import type { Casal } from "@/lib/types";

export default function TemaYoutube({
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

  const videos = casal.marcos.length > 0
    ? casal.marcos
        .slice()
        .sort((a, b) => b.data.localeCompare(a.data))
        .map((m, i) => ({
          titulo: m.titulo,
          views: `${(i + 1) * 1200} visualizações`,
          tempo: formatarData(m.data),
          duracao: `${3 + i}:${(15 * i) % 60}`.padEnd(4, "0"),
          img: fotos[i % Math.max(fotos.length, 1)] ?? fotoCapa,
        }))
    : [{ titulo: casal.frase, views: "∞ visualizações", tempo: "hoje", duracao: "∞", img: fotoCapa }];

  const embedMusica = obterEmbedMusica(casal.musica_url);

  return (
    <div className="yt-root">
      <style jsx>{`
        .yt-root {
          --vermelho: #ff0000;
          --preto: #0f0f0f;
          --cinza-fundo: #f9f9f9;
          --cinza-texto: #606060;
          background: var(--cinza-fundo);
          color: var(--preto);
          font-family: -apple-system, sans-serif;
          min-height: 100vh;
        }
        .yt-root img { display: block; width: 100%; height: 100%; object-fit: cover; }
        .yt-display { font-weight: 700; }

        header { background: #fff; padding: .8rem 4vw; display: flex; align-items: center; gap: .6rem; border-bottom: 1px solid #e5e5e5; }
        .logo-icon { width: 26px; height: 18px; background: var(--vermelho); border-radius: 5px; display: flex; align-items: center; justify-content: center; }
        .logo-icon svg { width: 11px; height: 11px; fill: #fff; }
        .logo { font-weight: 700; font-size: 1.15rem; }

        .channel-banner { aspect-ratio: 6/1; background: linear-gradient(135deg, #333, #111); position: relative; min-height: 90px; }
        .channel-banner img { opacity: .55; }

        .channel-header { max-width: 1000px; margin: 0 auto; padding: 1.2rem 4vw 1.6rem; display: flex; gap: 1.2rem; align-items: center; flex-wrap: wrap; border-bottom: 1px solid #e5e5e5; background: #fff; }
        .channel-avatar { width: 80px; height: 80px; border-radius: 50%; overflow: hidden; flex: 0 0 80px; background: #ddd; }
        .channel-name { font-size: 1.4rem; font-weight: 700; }
        .channel-meta { font-size: .82rem; color: var(--cinza-texto); margin-top: .2rem; }
        .subscribe-btn { background: var(--preto); color: #fff; border: none; padding: .55rem 1.3rem; border-radius: 18px; font-weight: 600; font-size: .85rem; cursor: pointer; margin-left: auto; }

        .videos { max-width: 1000px; margin: 1.4rem auto 2rem; padding: 0 4vw; display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1.4rem; }
        .video-card { cursor: pointer; }
        .thumb-wrap { aspect-ratio: 16/9; border-radius: 8px; overflow: hidden; position: relative; background: #ddd; }
        .duration-badge { position: absolute; bottom: .4rem; right: .4rem; background: rgba(0,0,0,.8); color: #fff; font-size: .68rem; padding: .1rem .35rem; border-radius: 3px; }
        .video-info { display: flex; gap: .6rem; margin-top: .6rem; }
        .video-avatar { width: 32px; height: 32px; border-radius: 50%; overflow: hidden; flex: 0 0 32px; background: #ddd; }
        .video-title { font-size: .88rem; font-weight: 600; line-height: 1.3; }
        .video-meta { font-size: .78rem; color: var(--cinza-texto); margin-top: .2rem; }

        .final-screen {
          min-height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;
          background: var(--preto); color: #fff; padding: 6vh 6vw;
        }
        .final-screen .eyebrow { font-size: .76rem; letter-spacing: .12em; text-transform: uppercase; opacity: .85; margin-bottom: .7rem; color: var(--vermelho); }
        .final-screen h2 { font-size: clamp(2.4rem, 12vw, 5rem); color: var(--vermelho); }
        .final-screen p { margin-top: 1.1rem; max-width: 34ch; line-height: 1.7; }

        footer { text-align: center; padding: 1.6rem 1rem 3rem; font-size: .66rem; letter-spacing: .1em; text-transform: uppercase; color: #999; background: #fff; }
      `}</style>

      <header>
        <div className="logo-icon">
          <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
        </div>
        <div className="logo">love&love</div>
      </header>

      <div className="channel-banner">{fotoCapa && <img src={fotoCapa} alt="" />}</div>

      <div className="channel-header">
        <div className="channel-avatar">{fotoCapa && <img src={fotoCapa} alt="" />}</div>
        <div>
          <div className="channel-name">{casal.nome1} & {casal.nome2}</div>
          <div className="channel-meta">∞ inscritos · {videos.length} vídeos</div>
        </div>
        <button className="subscribe-btn" onClick={onComecar}>Inscrever-se</button>
      </div>

      <div className="videos">
        {videos.map((v, i) => (
          <div key={i} className="video-card">
            <div className="thumb-wrap">
              {v.img && <img src={v.img} alt="" />}
              <span className="duration-badge">{v.duracao}</span>
            </div>
            <div className="video-info">
              {fotoCapa && <div className="video-avatar"><img src={fotoCapa} alt="" /></div>}
              <div>
                <div className="video-title">{v.titulo}</div>
                <div className="video-meta">{v.views} · {v.tempo}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <section className="final-screen">
        <span className="eyebrow">em cartaz</span>
        <h2 className="yt-display">TE AMO</h2>
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
            position: "fixed", inset: 0, zIndex: 999, background: "#0f0f0f",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            textAlign: "center", gap: "2rem", color: "#fff",
          }}
        >
          <div className="yt-display" style={{ fontSize: "clamp(1.8rem,7vw,2.8rem)" }}>
            love<span style={{ color: "#ff0000" }}>&</span>love
          </div>
          <p style={{ maxWidth: "30ch", lineHeight: 1.5, color: "#aaa" }}>
            O canal de {casal.nome1} & {casal.nome2}. Toque para assistir.
          </p>
          <button
            onClick={onComecar}
            style={{
              width: 78, height: 78, borderRadius: "50%", background: "#ff0000",
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
