"use client";

import { useState } from "react";
import type { Casal, Declaracao, Frase } from "@/lib/types";
import PlayerMusica, { detectarMidia } from "@/components/PlayerMusica";

interface StoryDef {
  tipo:
    | "capa"
    | "contador"
    | "musica"
    | "pergunta"
    | "foto"
    | "declaracao"
    | "final";
  conteudo?: unknown;
}

function calcularDias(dataInicio: string): number {
  const inicio = new Date(dataInicio).getTime();
  const agora = Date.now();
  return Math.max(0, Math.floor((agora - inicio) / (1000 * 60 * 60 * 24)));
}

function CoracoesSutis({ quantidade = 6 }: { quantidade?: number }) {
  const [corações] = useState(() =>
    Array.from({ length: quantidade }, () => ({
      left: 5 + Math.random() * 90,
      duration: 8 + Math.random() * 6,
      delay: Math.random() * 6,
      size: 0.7 + Math.random() * 0.6,
    }))
  );

  return (
    <>
      {corações.map((c, i) => (
        <span
          key={i}
          className="coracao-sutil"
          style={{
            left: `${c.left}%`,
            fontSize: `${c.size}rem`,
            animationDuration: `${c.duration}s`,
            animationDelay: `${c.delay}s`,
          }}
        >
          ♡
        </span>
      ))}
    </>
  );
}

export default function TemaRomantico({
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
  const midia = detectarMidia(casal.musica_url);
  const dias = calcularDias(casal.data_inicio);

  // Monta a sequência de stories
  const perguntas = [
    { titulo: "onde nos conhecemos", resposta: casal.onde_se_conheceram, foto: fotos[1] },
    { titulo: "nosso primeiro encontro", resposta: casal.primeiro_encontro, foto: fotos[2] },
    { titulo: "o que eu mais amo em você", resposta: casal.o_que_mais_amam, foto: fotos[3] },
    { titulo: "o que sonhamos juntos", resposta: casal.sonho_juntos, foto: fotos[4] },
  ].filter((p) => p.resposta);

  const fotosGaleria = fotos.slice(5, 15);
  const fraseTexto = fraseAleatoria?.texto ?? casal.frase;

  const stories: StoryDef[] = [
    { tipo: "capa" },
    { tipo: "contador", conteudo: dias },
    ...(midia ? [{ tipo: "musica" as const }] : []),
    ...perguntas.map((p) => ({ tipo: "pergunta" as const, conteudo: p })),
    ...fotosGaleria.map((f, i) => ({
      tipo: "foto" as const,
      conteudo: { foto: f, legenda: i % 2 === 0 ? fraseTexto : casal.frase },
    })),
    ...(declaracaoAleatoria ? [{ tipo: "declaracao" as const }] : []),
    { tipo: "final" },
  ];

  const [indice, setIndice] = useState(0);
  const total = stories.length;

  function avancar() {
    setIndice((i) => Math.min(i + 1, total - 1));
  }

  function voltar() {
    setIndice((i) => Math.max(i - 1, 0));
  }

  function handleClickArea(e: React.MouseEvent<HTMLDivElement>) {
    const x = e.clientX;
    const largura = window.innerWidth;
    if (x < largura * 0.35) {
      voltar();
    } else {
      avancar();
    }
  }

  const storyAtual = stories[indice];

  return (
    <div className="stories-root">
      <style jsx>{`
        .stories-root {
          --rosa-claro: #fff0f3;
          --rosa: #f7c6d0;
          --rosa-escuro: #e08ba0;
          --vinho-texto: #5a2a3a;
          --branco: #fffaf9;
          background: #1a0e12;
          font-family: -apple-system, sans-serif;
          height: 100vh;
          width: 100%;
          position: relative;
          overflow: hidden;
          display: flex;
          justify-content: center;
        }
        .palco {
          position: relative;
          width: 100%;
          max-width: 480px;
          height: 100%;
          background: var(--rosa-claro);
          overflow: hidden;
        }
        .barras {
          position: absolute; top: 0; left: 0; right: 0; z-index: 50;
          display: flex; gap: 4px; padding: 10px 10px 0;
        }
        .barra-bg { flex: 1; height: 3px; background: rgba(255,255,255,.35); border-radius: 2px; overflow: hidden; }
        .barra-fill { height: 100%; background: #fff; border-radius: 2px; transition: width .2s; }

        .area-clique { position: absolute; inset: 0; z-index: 40; display: flex; cursor: pointer; }

        .conteudo-story {
          position: absolute; inset: 0; z-index: 10;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          text-align: center; padding: 8vh 8vw;
        }
        .serif { font-family: Georgia, serif; }
        .italic { font-style: italic; }

        @keyframes fadeIn { from { opacity: 0; transform: scale(.97); } to { opacity: 1; transform: scale(1); } }
        .anim-in { animation: fadeIn .4s ease-out; }

        .bg-foto { position: absolute; inset: 0; background-size: cover; background-position: center; }
        .bg-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(90,42,58,.25), rgba(60,20,30,.65)); }

        .eyebrow { font-size: .7rem; letter-spacing: .22em; text-transform: uppercase; color: rgba(255,255,255,.75); margin-bottom: .6rem; position: relative; z-index: 2; }
        .titulo-grande { font-size: clamp(2rem, 9vw, 3.2rem); color: #fff; line-height: 1.1; position: relative; z-index: 2; text-shadow: 0 6px 24px rgba(0,0,0,.4); }

        .contador-numero { font-size: clamp(4rem, 18vw, 6rem); color: #fff; line-height: 1; }
        .contador-label { font-size: 1rem; color: rgba(255,255,255,.85); margin-top: .5rem; }

        .play-btn {
          width: 76px; height: 76px; border-radius: 50%; background: var(--rosa-escuro);
          display: flex; align-items: center; justify-content: center; border: none; cursor: pointer;
          box-shadow: 0 8px 30px rgba(224,139,160,.5); margin-top: 1.6rem; position: relative; z-index: 20;
        }

        .pergunta-titulo { font-size: .72rem; text-transform: uppercase; letter-spacing: .18em; color: var(--rosa-escuro); margin-bottom: 1rem; }
        .pergunta-resposta { font-size: clamp(1.3rem, 5vw, 1.8rem); color: var(--vinho-texto); line-height: 1.5; }
        .foto-bg-blur { position: absolute; inset: 0; background-size: cover; background-position: center; filter: blur(20px) brightness(.6); }

        .foto-frame {
          width: 78%; aspect-ratio: 4/5; border-radius: 6px; overflow: hidden;
          box-shadow: 0 20px 50px rgba(0,0,0,.3); position: relative; z-index: 2;
        }
        .foto-legenda { margin-top: 1.4rem; color: #fff; font-style: italic; font-size: 1.05rem; position: relative; z-index: 2; text-shadow: 0 2px 10px rgba(0,0,0,.4); }

        .declaracao-texto { font-size: 1.1rem; line-height: 1.8; color: var(--vinho-texto); }
        .te-amo { font-size: clamp(3.2rem, 16vw, 5.5rem); color: #fff; text-shadow: 0 0 40px rgba(255,255,255,.4); }

        @keyframes petala-cai {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: .9; }
          100% { transform: translateY(110vh) rotate(50deg); opacity: 0; }
        }
        .petala { position: absolute; top: -30px; animation: petala-cai linear infinite; pointer-events: none; z-index: 5; }

        @keyframes coracao-sobe {
          0% { transform: translateY(0) scale(0.8); opacity: 0; }
          12% { opacity: .55; }
          100% { transform: translateY(-100vh) scale(1.1); opacity: 0; }
        }
        .coracao-sutil {
          position: absolute; bottom: 0; color: var(--rosa-escuro);
          animation: coracao-sobe linear infinite; pointer-events: none; z-index: 3;
        }

        .nome-rodape { position: absolute; bottom: 24px; left: 0; right: 0; text-align: center; font-size: .68rem; letter-spacing: .12em; text-transform: uppercase; color: rgba(255,255,255,.6); z-index: 15; }
      `}</style>

      <div className="palco">
        <div className="barras">
          {stories.map((_, i) => (
            <div key={i} className="barra-bg">
              <div
                className="barra-fill"
                style={{ width: i < indice ? "100%" : i === indice ? "100%" : "0%" }}
              />
            </div>
          ))}
        </div>

        <StoryConteudo
          story={storyAtual}
          casal={casal}
          dias={dias}
          declaracaoAleatoria={declaracaoAleatoria}
          comecou={comecou}
          onComecar={() => {
            onComecar();
            avancar();
          }}
        />

        <div className="area-clique" onClick={handleClickArea} />

        {indice < total - 1 && (
          <div className="nome-rodape">{casal.nome1} &amp; {casal.nome2}</div>
        )}
      </div>

      {midia && (
        <div
          style={{
            position: "fixed",
            bottom: 14,
            right: 14,
            zIndex: 200,
            borderRadius: 10,
            overflow: "hidden",
            boxShadow: "0 6px 20px rgba(0,0,0,.3)",
          }}
        >
          <PlayerMusica midia={midia} ativo={comecou} tamanho="pequeno" />
        </div>
      )}
    </div>
  );
}

function StoryConteudo({
  story,
  casal,
  dias,
  declaracaoAleatoria,
  comecou,
  onComecar,
}: {
  story: StoryDef;
  casal: Casal;
  dias: number;
  declaracaoAleatoria: Declaracao | null;
  comecou: boolean;
  onComecar: () => void;
}) {
  const fotoCapa = casal.fotos[0];

  if (story.tipo === "capa") {
    return (
      <div className="conteudo-story anim-in">
        {fotoCapa && (
          <>
            <div className="bg-foto" style={{ backgroundImage: `url(${fotoCapa})` }} />
            <div className="bg-overlay" />
          </>
        )}
        {comecou && <CoracoesSutis quantidade={5} />}
        <div className="eyebrow">uma história de amor entre</div>
        <h1 className="titulo-grande serif italic">{casal.nome1} &amp; {casal.nome2}</h1>
        {!comecou && (
          <button
            className="play-btn"
            aria-label="Começar"
            onClick={(e) => {
              e.stopPropagation();
              onComecar();
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        )}
      </div>
    );
  }

  if (story.tipo === "contador") {
    return (
      <div className="conteudo-story anim-in">
        <CoracoesSutis quantidade={5} />
        <div className="eyebrow" style={{ color: "rgba(224,139,160,.9)" }}>juntos há</div>
        <div className="contador-numero serif italic" style={{ color: "#5a2a3a" }}>{dias}</div>
        <div className="contador-label" style={{ color: "#5a2a3a" }}>
          {dias === 1 ? "dia" : "dias"}
        </div>
      </div>
    );
  }

  if (story.tipo === "musica") {
    return (
      <div className="conteudo-story anim-in">
        <CoracoesSutis quantidade={6} />
        <div className="eyebrow" style={{ color: "rgba(224,139,160,.9)" }}>tocando agora</div>
        <p className="pergunta-resposta serif italic" style={{ color: "#5a2a3a" }}>
          {casal.frase}
        </p>
      </div>
    );
  }

  if (story.tipo === "pergunta") {
    const { titulo, resposta, foto } = story.conteudo as {
      titulo: string;
      resposta: string;
      foto?: string;
    };
    return (
      <div className="conteudo-story anim-in">
        {foto && <div className="foto-bg-blur" style={{ backgroundImage: `url(${foto})` }} />}
        <p className="pergunta-titulo" style={{ position: "relative", zIndex: 2 }}>{titulo}</p>
        <p className="pergunta-resposta serif italic" style={{ position: "relative", zIndex: 2, color: "#fff", textShadow: "0 4px 18px rgba(0,0,0,.5)" }}>
          {resposta}
        </p>
      </div>
    );
  }

  if (story.tipo === "foto") {
    const { foto, legenda } = story.conteudo as { foto: string; legenda: string };
    return (
      <div className="conteudo-story anim-in">
        <div className="foto-bg-blur" style={{ backgroundImage: `url(${foto})` }} />
        <div className="foto-frame">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={foto} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <p className="foto-legenda serif">&ldquo;{legenda}&rdquo;</p>
      </div>
    );
  }

  if (story.tipo === "declaracao") {
    return (
      <div className="conteudo-story anim-in" style={{ background: "var(--branco)" }}>
        <CoracoesSutis quantidade={4} />
        <p style={{ fontSize: "1.6rem", marginBottom: ".8rem", position: "relative", zIndex: 2 }}>💕</p>
        <div className="eyebrow" style={{ color: "rgba(224,139,160,.9)" }}>uma declaração pra vocês</div>
        <p className="declaracao-texto serif italic" style={{ position: "relative", zIndex: 2 }}>
          {declaracaoAleatoria?.texto}
        </p>
      </div>
    );
  }

  // final
  return <FinalStory casal={casal} comecou={comecou} />;
}

function FinalStory({ casal, comecou }: { casal: Casal; comecou: boolean }) {
  const [petalas] = useState(() =>
    Array.from({ length: 22 }, () => ({
      left: Math.random() * 100,
      duration: 6 + Math.random() * 5,
      delay: Math.random() * 4,
      size: 0.9 + Math.random() * 0.7,
    }))
  );

  return (
    <div
      className="conteudo-story anim-in"
      style={{ background: "linear-gradient(180deg, #f7c6d0, #e08ba0)" }}
    >
      {comecou &&
        petalas.map((p, i) => (
          <span
            key={i}
            className="petala"
            style={{
              left: `${p.left}%`,
              fontSize: `${p.size}rem`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          >
            🌸
          </span>
        ))}
      <p style={{ fontSize: "1.8rem", position: "relative", zIndex: 2 }}>♡ ♡ ♡</p>
      <p className="te-amo serif italic" style={{ marginTop: ".4rem" }}>TE AMO</p>
      <p style={{ color: "#fff", marginTop: "1rem", fontSize: ".9rem", position: "relative", zIndex: 2 }}>
        {casal.nome1} &amp; {casal.nome2}, para sempre.
      </p>
    </div>
  );
}
