export default function MosaicoFotos({
  fotos,
  inicio = 1,
  quantidade = 4,
}: {
  fotos: string[];
  inicio?: number;
  quantidade?: number;
}) {
  const fotosParaMosaico = fotos.slice(inicio, inicio + quantidade);
  if (fotosParaMosaico.length === 0) return null;

  return (
    <div className="fade-up flex gap-3 justify-center flex-wrap max-w-2xl">
      {fotosParaMosaico.map((foto, i) => (
        <div
          key={i}
          className="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border-2 border-cream/20 rotate-0"
          style={{ transform: `rotate(${(i % 2 === 0 ? -1 : 1) * 3}deg)` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={foto}
            alt="Momento do casal"
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}
