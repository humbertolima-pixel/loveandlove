import type { Marco } from "@/lib/types";

function formatarData(data: string): string {
  const [ano, mes, dia] = data.split("-");
  const meses = [
    "jan", "fev", "mar", "abr", "mai", "jun",
    "jul", "ago", "set", "out", "nov", "dez",
  ];
  return `${dia} ${meses[Number(mes) - 1]} ${ano}`;
}

export default function Cronologia({ marcos }: { marcos: Marco[] }) {
  if (marcos.length === 0) return null;

  const ordenados = [...marcos].sort((a, b) => a.data.localeCompare(b.data));

  return (
    <div className="fade-up w-full max-w-md">
      <p className="font-body text-xs uppercase tracking-[0.2em] text-rose/70 text-center mb-6">
        Nossa história
      </p>
      <div className="relative pl-6 border-l border-gold/30 space-y-6">
        {ordenados.map((marco, i) => (
          <div key={i} className="relative">
            <span className="absolute -left-[1.65rem] top-1.5 w-2.5 h-2.5 rounded-full bg-gold" />
            <p className="font-body text-xs text-gold/80 uppercase tracking-wide">
              {formatarData(marco.data)}
            </p>
            <p className="font-display text-lg text-cream italic">
              {marco.titulo}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
