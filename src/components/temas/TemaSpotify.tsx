"use client";

import type { Casal, Declaracao, Frase } from "@/lib/types";
import TelaAbertura from "@/components/TelaAbertura";

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

  const faixas = [
    { numero: 1, titulo: "Onde tudo começou", texto: casal.onde_se_conheceram, img: fotos[1] ?? capa, duracao: "3:14" },
    { numero: 2, titulo: "O primeiro encontro", texto: casal.primeiro_encontro, img: fotos[2] ?? capa, duracao: "4:02" },
    { numero: 3, titulo: "O que a gente mais ama", texto: casal.o_que_mais_amam, img: fotos[3] ?? capa, duracao: "3:47" },
    { numero: 4, titulo: "O nosso sonho", texto: casal.sonho_juntos, img: fotos[4] ?? capa, duracao: "∞" },
  ].filter((f) => f.texto);

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

        header { display: flex; align-items: center; justify-content: center; padding: 1.1rem 4vw; }
        .logo { font-weight: 800; font-size: 1.2rem; }
        .logo span { color: var(--verde); }

        .intro { max-width: 760px; margin: 0 auto; padding: 4rem 4vw 2rem; text-align: center; }
        .eyebrow { font-size: .8rem; font-weight: 700; text-transform: uppercase; color: var(--verde); }
        .intro h2 { font-size: clamp(1.8rem, 5vw, 3rem); margin: .8rem 0 1.2rem; font-family: Georgia, serif; }
        .intro p { color: #dcdcdc; line-height: 1.75; font-size: 1.05rem; }
        .intro .sub-frase { margin-top: 1.2rem; color: var(--verde); font-style: italic; font-size: .95rem; }

        section.fundo { padding: 3.2rem 4vw; }
        .section-head { margin-bottom: 1.3rem; display: flex; align-items: baseline; gap: .7rem; }
        .section-head h2 { font-size: 1.4rem; font-weight: 800; }
        .sub { font-size: .76rem; color: var(--cinza); }

        .track-full {
          display: flex; flex-wrap: wrap; gap: 2rem; align-items: center; max-width: 980px; margin: 0 auto;
          padding: 3.5rem 4vw;
        }
        .track-full.invertido { flex-direction: row-reverse; }
        .track-img { flex: 1 1 300px; aspect-ratio: 1/1; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,.5); }
        .track-info { flex: 1 1 320px; }
        .track-num-tag { display: inline-flex; align-items: center; gap: .5rem; color: var(--verde); font-size: .8rem; font-weight: 700; margin-bottom: .8rem; }
        .track-info h3 { font-size: 1.5rem; font-weight: 700; margin-bottom: .8rem; }
        .track-info p { color: var(--cinza); line-height: 1.65; font-size: 1rem; }

        .grid-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 1rem; max-width: 1100px; margin: 0 auto; }
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
        .final-cover { width: 180px; height: 180px; border-radius: 8px; overflow: hidden; box-shadow: 0 25px 60px rgba(0,0,0,.6); margin-bottom: 1.8rem; }
        .final-screen .declaracao { max-width: 42ch; color: #e2e2e2; font-size: 1.02rem; line-height: 1.75; margin-bottom: 2.2rem; }
        .final-screen .eyebrow-2 { font-size: .78rem; letter-spacing: .15em; text-transform: uppercase; color: var(--cinza); margin-bottom: .6rem; }
        .final-screen h2 { font-size: clamp(2.6rem, 14vw, 6.5rem); color: var(--verde); line-height: 1; text-shadow: 0 0 60px rgba(30,215,96,.4); }
        .final-screen .sub { margin-top: 1.2rem; max-width: 34ch; color: #e2e2e2; line-height: 1.7; }

        footer { text-align: center; padding: 2rem 1rem 3rem; font-size: .68rem; letter-spacing: .12em; text-transform: uppercase; color: #555; }
      `}</style>

      <TelaAbertura
        nome1={casal.nome1}
        nome2={casal.nome2}
        musicaUrl={casal.musica_url}
        onComecar={onComecar}
      />

      <div id="conteudo-principal">
        <header>
          <div className="logo">LOVE <span>&</span> LOVE</div>
        </header>

        <section className="intro">
          <span className="eyebrow">playlist</span>
          <h2 className="sp-display">{casal.nome1} & {casal.nome2}</h2>
          <p>{casal.frase}</p>
          {fraseAleatoria && <p className="sub-frase">&ldquo;{fraseAleatoria.texto}&rdquo;</p>}
        </section>

        {faixas.map((f, i) => (
          <section key={f.numero} className={`track-full ${i % 2 === 1 ? "invertido" : ""}`}>
            {f.img && <div className="track-img"><img src={f.img} alt="" /></div>}
            <div className="track-info">
              <div className="track-num-tag">FAIXA {f.numero} · {f.duracao}</div>
              <h3>{f.titulo}</h3>
              <p>{f.texto}</p>
            </div>
          </section>
        ))}

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
          <div className="section-head" style={{ justifyContent: "center" }}>
            <h2>Artistas principais</h2>
            <span className="sub">quem canta essa história</span>
          </div>
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

        <section className="final-screen">
          {comecou && <CoracoesFlutuantes />}
          {capa && <div className="final-cover"><img src={capa} alt="" /></div>}
          {declaracaoAleatoria && (
            <p className="declaracao">{declaracaoAleatoria.texto}</p>
          )}
          <span className="eyebrow-2">tocando agora</span>
          <h2 className="sp-display">TE AMO</h2>
          <p className="sub">{casal.frase}</p>
        </section>

        <footer>Love &amp; Love — feito com carinho, só pra você 💛</footer>
      </div>
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
