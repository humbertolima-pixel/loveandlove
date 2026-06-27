export default function GaleriaCompleta({ fotos }: { fotos: string[] }) {
  if (fotos.length === 0) return null;

  // Padrão de tamanhos que se repete a cada 6 fotos, criando ritmo
  // visual (algumas grandes, algumas pequenas) sem depender da
  // quantidade exata de fotos enviadas.
  const padroes = ["grande", "", "alta", "larga", "", ""];

  return (
    <div className="fade-up grid grid-cols-3 md:grid-cols-4 gap-2 px-6 auto-rows-[110px] md:auto-rows-[140px]">
      {fotos.map((foto, i) => {
        const padrao = padroes[i % padroes.length];
        const classeSpan =
          padrao === "grande"
            ? "col-span-2 row-span-2"
            : padrao === "alta"
            ? "row-span-2"
            : padrao === "larga"
            ? "col-span-2"
            : "";

        return (
          <div
            key={i}
            className={`rounded-lg overflow-hidden shadow-md ${classeSpan}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={foto}
              alt={`Momento ${i + 1} do casal`}
              className="w-full h-full object-cover"
            />
          </div>
        );
      })}
    </div>
  );
}
