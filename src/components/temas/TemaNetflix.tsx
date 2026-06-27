"use client";

import type { Casal, Declaracao, Frase } from "@/lib/types";
import TelaAbertura from "@/components/TelaAbertura";

export default function TemaNetflix({
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
  const fotoHero = fotos[0];

  const episodios = [
    { numero: 1, titulo: "Onde tudo começou", texto: casal.onde_se_conheceram, img: fotos[1] ?? fotoHero },
    { numero: 2, titulo: "O primeiro encontro", texto: casal.primeiro_encontro, img: fotos[2] ?? fotoHero },
    { numero: 3, titulo: "O que a gente mais ama", texto: casal.o_que_mais_amam, img: fotos[3] ?? fotoHero },
    { numero: 4, titulo: "O nosso sonho", texto: casal.sonho_juntos, img: fotos[4] ?? fotoHero },
  ].filter((ep) => ep.texto);

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
        .coracao { position: absolute; font-size: 1.4rem; animation: coracao-flutua 3.5s ease-in infinite; pointer-events: none; }

        header {
          display: flex; align-items: center; justify-content: center;
          padding: 1.1rem 4vw;
        }
        .logo { font-size: 1.4rem; font-weight: 700; color: var(--vermelho); }
        .logo span { color: var(--branco); }

        .intro {
          max-width: 760px; margin: 0 auto; padding: 4rem 4vw 2rem; text-align: center;
        }
        .eyebrow { font-size: .72rem; letter-spacing: .2em; text-transform: uppercase; color: var(--vermelho); font-weight: 700; }
        .intro h2 { font-size: clamp(1.8rem, 5vw, 3rem); margin: .8rem 0 1.2rem; font-family: Georgia, serif; }
        .intro p { color: #dcdcdc; line-height: 1.75; font-size: 1.05rem; }
        .intro .sub-frase { margin-top: 1.2rem; color: var(--vermelho); font-style: italic; font-size: .95rem; }

        .row-section { padding: 3.2rem 0 1rem; }
        .row-head { padding: 0 4vw; margin-bottom: 1rem; display: flex; align-items: baseline; gap: .8rem; }
        .row-head h2 { font-size: 1.4rem; font-weight: 700; }
        .row-sub { font-size: .78rem; color: var(--cinza-texto); }

        .ep-full {
          display: flex; flex-wrap: wrap; gap: 2rem; align-items: center; max-width: 980px; margin: 0 auto;
          padding: 3.5rem 4vw;
        }
        .ep-full.invertido { flex-direction: row-reverse; }
        .ep-img { flex: 1 1 320px; aspect-ratio: 16/10; border-radius: 8px; overflow: hidden; }
        .ep-info { flex: 1 1 320px; }
        .ep-num-tag { display: inline-block; background: var(--vermelho); padding: .3rem .8rem; border-radius: 3px; font-size: .72rem; font-weight: 700; margin-bottom: .8rem; }
        .ep-info h3 { font-size: 1.5rem; font-weight: 700; margin-bottom: .8rem; }
        .ep-info p { color: var(--cinza-texto); line-height: 1.65; font-size: 1rem; }

        .row-scroll { display: flex; gap: .9rem; overflow-x: auto; padding: 0 4vw 1.2rem; scrollbar-width: none; }
        .row-scroll::-webkit-scrollbar { display: none; }
        .photo-card { flex: 0 0 200px; aspect-ratio: 2/3; border-radius: 6px; overflow: hidden; position: relative; transition: transform .3s; }
        .photo-card:hover { transform: scale(1.04); }

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
        .final-screen .eyebrow-2 { font-size: .76rem; letter-spacing: .2em; text-transform: uppercase; color: var(--cinza-texto); margin-bottom: 1.2rem; }
        .final-screen .declaracao { max-width: 42ch; color: #e6e6e6; font-size: 1.02rem; line-height: 1.75; margin-bottom: 2.5rem; }
        .final-screen h2 { font-size: clamp(2.8rem, 14vw, 7rem); color: var(--vermelho); text-shadow: 0 0 70px rgba(229,9,20,.5); }
        .final-screen .sub { margin-top: 1.4rem; max-width: 36ch; color: #e6e6e6; font-size: 1rem; line-height: 1.7; }

        footer { text-align: center; padding: 2.2rem 1rem 3rem; font-size: .68rem; letter-spacing: .12em; text-transform: uppercase; color: #555; }
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
          <span className="eyebrow">sinopse</span>
          <h2 className="nf-display">{casal.nome1} & {casal.nome2}</h2>
          <p>{casal.frase}</p>
          {fraseAleatoria && <p className="sub-frase">&ldquo;{fraseAleatoria.texto}&rdquo;</p>}
        </section>

        {episodios.map((ep, i) => (
          <section key={ep.numero} className={`ep-full ${i % 2 === 1 ? "invertido" : ""}`}>
            {ep.img && (
              <div className="ep-img"><img src={ep.img} alt="" /></div>
            )}
            <div className="ep-info">
              <span className="ep-num-tag">EP {ep.numero}</span>
              <h3>{ep.titulo}</h3>
              <p>{ep.texto}</p>
            </div>
          </section>
        ))}

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

        <section className="final-screen">
          {comecou && <CoracoesFlutuantes />}
          {declaracaoAleatoria && (
            <p className="declaracao">{declaracaoAleatoria.texto}</p>
          )}
          <span className="eyebrow-2">próximo episódio em: para sempre</span>
          <h2 className="nf-display">TE AMO</h2>
          <p className="sub">E essa é só a primeira temporada da nossa história.</p>
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
          💛
        </span>
      ))}
    </>
  );
}
