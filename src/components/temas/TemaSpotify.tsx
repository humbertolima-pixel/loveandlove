"use client";

import { useState } from "react";
import type { Casal, Declaracao, Frase } from "@/lib/types";
import PlayerMusica, { detectarMidia } from "@/components/PlayerMusica";

function formatarData(iso: string): string {
  const [y, m, d] = iso.split("-");
  const meses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  return `desde ${d} de ${meses[parseInt(m, 10) - 1]} de ${y}`;
}

export default function TemaSpotify({
  casal,
  fraseAleatoria,
  declaracaoAleatoria,
  comecou,
  onComecar,
}: {
  casal: Casal;
  fraseAleatoria: Frase | null;
  declaracaoAleatoria: Declaracao | null;
  comecou: boolean;
  onComecar: () => void;
}) {
  const fotos = casal.fotos.length > 0 ? casal.fotos : [];
  const capa = fotos[0];
  const midia = detectarMidia(casal.musica_url);

  const faixas = [
    { numero: 1, titulo: "Onde tudo começou", texto: casal.onde_se_conheceram, img: fotos[1] ?? capa },
    { numero: 2, titulo: "O primeiro encontro", texto: casal.primeiro_encontro, img: fotos[2] ?? capa },
    { numero: 3, titulo: "O que a gente mais ama", texto: casal.o_que_mais_amam, img: fotos[3] ?? capa },
    { numero: 4, titulo: "O nosso sonho", texto: casal.sonho_juntos, img: fotos[4] ?? capa },
  ].filter((f) => f.texto);

  const fotosMosaico = fotos.slice(5, 15);
  const padroes = ["big", "", "tall", "wide", "", "big", "", "tall", "", ""];

  const [particulas] = useState(() =>
    Array.from({ length: 22 }, () => ({
      left: Math.random() * 100,
      fontSize: 0.8 + Math.random() * 1.3,
      duration: 6 + Math.random() * 6,
      delay: Math.random() * 8,
    }))
  );

  return (
    <div className="sp2-root">
      <style jsx>{`
        .sp2-root {
          --preto: #0a0a0a;
          --verde: #1ed760;
          --verde-escuro: #0d4d27;
          --dourado: #c9974a;
          --branco: #ffffff;
          --cinza: #b3b3b3;
          background: var(--preto);
          color: var(--branco);
          font-family: -apple-system, sans-serif;
          overflow-x: hidden;
        }
        .sp2-root img { display: block; width: 100%; height: 100%; object-fit: cover; }
        .script { font-family: Georgia, serif; font-style: italic; }

        @keyframes fadein { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse-btn {
          0% { box-shadow: 0 0 0 0 rgba(30,215,96,.45); }
          70% { box-shadow: 0 0 0 22px rgba(30,215,96,0); }
          100% { box-shadow: 0 0 0 0 rgba(30,215,96,0); }
        }
        @keyframes pulse-line { 0%, 100% { opacity: .3; } 50% { opacity: 1; } }
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: .85; }
          100% { transform: translateY(115vh) rotate(40deg); opacity: 0; }
        }

        .capa {
          position: relative; min-height: 100vh;
          display: flex; flex-direction: column; align-items: center; justify-content: flex-end;
          text-align: center; padding: 8vh 6vw 9vh;
          background-size: cover; background-position: center;
        }
        .capa::before {
          content: ""; position: absolute; inset: 0;
          background:
            linear-gradient(180deg, rgba(10,10,10,.15) 0%, rgba(10,10,10,.35) 40%, var(--preto) 96%),
            radial-gradient(circle at 50% 20%, rgba(0,0,0,.1), rgba(0,0,0,.55));
        }
        .capa-content { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; }
        .eyebrow { font-size: .68rem; letter-spacing: .28em; text-transform: uppercase; color: rgba(255,255,255,.55); margin-bottom: .4rem; }
        .eyebrow-2 { font-size: .72rem; letter-spacing: .2em; text-transform: uppercase; color: var(--verde); font-weight: 600; margin-bottom: 1.1rem; }
        .capa h1 { font-size: clamp(2.6rem, 8vw, 5.2rem); line-height: 1.05; text-shadow: 0 10px 40px rgba(0,0,0,.5); }
        .capa h1 .amp { color: var(--verde); }
        .desde { margin-top: .7rem; font-size: .85rem; color: rgba(255,255,255,.7); letter-spacing: .05em; }

        .play-gate { margin-top: 2.6rem; display: flex; flex-direction: column; align-items: center; gap: 1rem; }
        .play-btn {
          width: 78px; height: 78px; border-radius: 50%; background: var(--verde);
          display: flex; align-items: center; justify-content: center;
          animation: pulse-btn 2.2s infinite; transition: transform .25s; border: none; cursor: pointer;
        }
        .play-btn:hover { transform: scale(1.08); }
        .play-hint { font-size: .7rem; letter-spacing: .18em; text-transform: uppercase; color: var(--verde); opacity: .85; }

        .frase-final { max-width: 46ch; margin-top: 1.8rem; color: rgba(255,255,255,.8); font-size: 1.1rem; line-height: 1.6; animation: fadein .8s ease; }

        .scroll-cue { margin-top: 2.6rem; display: flex; flex-direction: column; align-items: center; gap: .5rem; font-size: .7rem; letter-spacing: .2em; text-transform: uppercase; color: var(--verde); opacity: .85; cursor: pointer; }
        .scroll-cue .line { width: 1px; height: 30px; background: linear-gradient(var(--verde), transparent); animation: pulse-line 2s infinite ease-in-out; }

        .mini-player {
          position: fixed; bottom: 18px; right: 18px; z-index: 300;
          background: rgba(20,20,20,.92); border: 1px solid #333; border-radius: 12px;
          padding: 8px; display: flex; align-items: center; gap: .6rem;
          backdrop-filter: blur(6px);
        }

        .black-area { background: var(--preto); padding-top: 6vh; }
        .lab-logo { text-align: center; font-size: 1.6rem; letter-spacing: .03em; margin-bottom: 3.5rem; font-weight: 700; }
        .lab-logo .l { color: var(--verde); }

        .sinopse { max-width: 720px; margin: 0 auto; padding: 0 6vw 6vh; text-align: center; }
        .tag { font-size: .7rem; letter-spacing: .2em; text-transform: uppercase; color: var(--verde); font-weight: 700; }
        .sinopse h2 { font-size: clamp(1.9rem, 4.5vw, 2.6rem); margin: .7rem 0 1.1rem; }
        .sinopse .quote { color: var(--verde); font-size: 1.2rem; line-height: 1.5; }
        .sinopse .quote-2 { margin-top: .8rem; color: var(--cinza); font-size: .95rem; }

        .faixas { max-width: 980px; margin: 0 auto; padding: 2vh 6vw 7vh; display: flex; flex-direction: column; gap: 5rem; }
        .track-row { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center; }
        .track-row.invert .track-media { order: 2; }
        .track-row.invert .track-text { order: 1; }
        .track-media { aspect-ratio: 1/1; border-radius: 12px; overflow: hidden; box-shadow: 0 25px 60px rgba(0,0,0,.5); }
        .track-tag { display: inline-block; background: var(--verde); color: #0a0a0a; font-size: .85rem; font-weight: 700; letter-spacing: .04em; padding: .25rem .7rem; border-radius: 4px; margin-bottom: .9rem; }
        .track-text h3 { font-size: 1.5rem; font-weight: 700; margin-bottom: .5rem; }
        .track-text p { color: var(--cinza); font-size: .95rem; line-height: 1.6; }
        @media (max-width: 720px) {
          .track-row, .track-row.invert { grid-template-columns: 1fr; }
          .track-row.invert .track-media { order: 1; }
          .track-row.invert .track-text { order: 2; }
        }

        .mosaico-head { text-align: center; padding: 2vh 6vw 0; }
        .mosaico-head h2 { font-size: clamp(1.9rem, 4.5vw, 2.6rem); margin: .7rem 0 .4rem; }
        .mosaico-head p { color: var(--cinza); font-size: .92rem; max-width: 46ch; margin: 0 auto; }
        .mosaico { display: grid; grid-template-columns: repeat(6, 1fr); grid-auto-rows: 140px; gap: .5rem; padding: 3rem 4vw 7vh; max-width: 1200px; margin: 0 auto; }
        .mosaico-item { position: relative; overflow: hidden; border-radius: 6px; transition: transform .3s; }
        .mosaico-item:hover { transform: scale(1.03); }
        .mosaico-item.big { grid-column: span 2; grid-row: span 2; }
        .mosaico-item.wide { grid-column: span 2; }
        .mosaico-item.tall { grid-row: span 2; }
        @media (max-width: 760px) {
          .mosaico { grid-template-columns: repeat(3,1fr); grid-auto-rows: 110px; }
          .mosaico-item.big { grid-column: span 2; grid-row: span 2; }
        }

        .final-screen {
          min-height: 100vh; position: relative; overflow: hidden;
          display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;
          padding: 8vh 6vw;
          background: radial-gradient(circle at 50% 35%, rgba(30,215,96,.14), transparent 60%), linear-gradient(180deg, var(--preto), #06150c);
        }
        .hearts-fall { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
        .heart-particle { position: absolute; top: -40px; color: var(--verde); animation: fall linear infinite; }
        .declaracao { max-width: 42ch; color: #e6e6e6; font-size: 1rem; line-height: 1.75; margin-bottom: 2.2rem; position: relative; z-index: 2; }
        .next-ep { font-size: .72rem; letter-spacing: .2em; text-transform: uppercase; color: var(--cinza); margin-bottom: 1.2rem; position: relative; z-index: 2; }
        .final-screen h2 { font-size: clamp(3.4rem, 13vw, 7.5rem); color: var(--verde); line-height: 1; text-shadow: 0 0 60px rgba(30,215,96,.45); position: relative; z-index: 2; }
        .legenda { margin-top: 1.4rem; max-width: 36ch; color: #cfcfcf; font-size: .98rem; line-height: 1.7; position: relative; z-index: 2; }

        footer { text-align: center; padding: 2.2rem 1rem 3rem; font-size: .7rem; letter-spacing: .12em; text-transform: uppercase; color: #555; }
        footer .h { color: var(--verde); }
      `}</style>

      <section className="capa" style={capa ? { backgroundImage: `url(${capa})` } : undefined}>
        <div className="capa-content">
          <div className="eyebrow">tocando agora</div>
          <div className="eyebrow-2">uma playlist só de</div>
          <h1 className="script">
            {casal.nome1} <span className="amp">&amp;</span> {casal.nome2}
          </h1>
          <div className="desde">{formatarData(casal.data_inicio)}</div>

          {!comecou ? (
            <div className="play-gate">
              <button className="play-btn" aria-label="Tocar nossa música" onClick={onComecar}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="#000">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
              <span className="play-hint">toque pra tocar nossa música</span>
            </div>
          ) : (
            <p className="frase-final script">{casal.frase}</p>
          )}

          <div
            className="scroll-cue"
            onClick={() =>
              document.getElementById("conteudo-principal")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <span>role pra baixo</span>
            <div className="line" />
          </div>
        </div>
      </section>

      <div className="black-area" id="conteudo-principal">
        <div className="lab-logo">
          <span className="l">LOVE</span> <span>&amp;</span> <span className="l">LOVE</span>
        </div>

        <RevealSection className="sinopse">
          <span className="tag">playlist</span>
          <h2 className="script">{casal.nome1} & {casal.nome2}</h2>
          <p className="quote script">&ldquo;{casal.frase}&rdquo;</p>
          {fraseAleatoria && <p className="quote-2">{fraseAleatoria.texto}</p>}
        </RevealSection>

        <section className="faixas">
          {faixas.map((f, i) => (
            <RevealSection key={f.numero} className={`track-row ${i % 2 === 1 ? "invert" : ""}`}>
              {f.img && <div className="track-media"><img src={f.img} alt="" /></div>}
              <div className="track-text">
                <span className="track-tag">FAIXA {f.numero}</span>
                <h3>{f.titulo}</h3>
                <p>{f.texto}</p>
              </div>
            </RevealSection>
          ))}
        </section>

        {fotosMosaico.length > 0 && (
          <>
            <RevealSection className="mosaico-head">
              <span className="tag">galeria</span>
              <h2 className="script">Cada foto, um pedacinho da gente</h2>
              <p>Tudo que vivemos, num só lugar.</p>
            </RevealSection>
            <RevealSection className="mosaico">
              {fotosMosaico.map((src, i) => (
                <div key={i} className={`mosaico-item ${padroes[i] || ""}`}>
                  <img src={src} alt={`momento ${i + 1}`} />
                </div>
              ))}
            </RevealSection>
          </>
        )}
      </div>

      <RevealSection className="final-screen">
        {comecou && (
          <div className="hearts-fall">
            {particulas.map((c, i) => (
              <span
                key={i}
                className="heart-particle"
                style={{
                  left: `${c.left}%`,
                  fontSize: `${c.fontSize}rem`,
                  animationDuration: `${c.duration}s`,
                  animationDelay: `${c.delay}s`,
                }}
              >
                ♡
              </span>
            ))}
          </div>
        )}
        {declaracaoAleatoria && <p className="declaracao">{declaracaoAleatoria.texto}</p>}
        <div className="next-ep">tocando em loop: para sempre</div>
        <h2 className="script">TE AMO</h2>
        <p className="legenda">E essa é só a primeira faixa da nossa playlist.</p>
      </RevealSection>

      <footer><span className="h">♡</span> feito por LoveAndLove</footer>

      {comecou && midia && (
        <div className="mini-player">
          <PlayerMusica midia={midia} ativo={comecou} tamanho="pequeno" />
        </div>
      )}
    </div>
  );
}

function RevealSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [visivel, setVisivel] = useState(false);

  return (
    <div
      ref={(el) => {
        if (!el || visivel) return;
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) setVisivel(true);
            });
          },
          { threshold: 0.12 }
        );
        observer.observe(el);
      }}
      className={className}
      style={{
        opacity: visivel ? 1 : 0,
        transform: visivel ? "translateY(0)" : "translateY(22px)",
        transition: "opacity .8s ease, transform .8s ease",
      }}
    >
      {children}
    </div>
  );
}
