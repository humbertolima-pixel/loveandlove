"use client";

import { useEffect, useState } from "react";

function calcularTempo(dataInicio: string) {
  const inicio = new Date(dataInicio).getTime();
  const agora = Date.now();
  const diffMs = Math.max(0, agora - inicio);

  const dias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  const minutos = Math.floor((diffMs / (1000 * 60)) % 60);
  const segundos = Math.floor((diffMs / 1000) % 60);

  return { dias, horas, minutos, segundos };
}

export default function ContadorVivo({ dataInicio }: { dataInicio: string }) {
  const [tempo, setTempo] = useState(() => calcularTempo(dataInicio));

  useEffect(() => {
    const intervalo = setInterval(() => {
      setTempo(calcularTempo(dataInicio));
    }, 1000);
    return () => clearInterval(intervalo);
  }, [dataInicio]);

  return (
    <div className="text-center fade-up">
      <p className="font-body text-xs md:text-sm uppercase tracking-[0.2em] text-rose/80 mb-3">
        Juntos há
      </p>
      <div className="flex items-end justify-center gap-3 md:gap-5 pulse-soft">
        <Unidade valor={tempo.dias} label={tempo.dias === 1 ? "dia" : "dias"} />
        <Separador />
        <Unidade valor={tempo.horas} label="h" />
        <Separador />
        <Unidade valor={tempo.minutos} label="min" />
        <Separador />
        <Unidade valor={tempo.segundos} label="s" />
      </div>
    </div>
  );
}

function Unidade({ valor, label }: { valor: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-display text-4xl md:text-6xl text-cream tabular-nums">
        {String(valor).padStart(2, "0")}
      </span>
      <span className="font-body text-[0.65rem] md:text-xs text-cream/60 uppercase tracking-wide mt-1">
        {label}
      </span>
    </div>
  );
}

function Separador() {
  return (
    <span className="font-display text-3xl md:text-5xl text-gold/50 pb-4 md:pb-5">
      :
    </span>
  );
}
