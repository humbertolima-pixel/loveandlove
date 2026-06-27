export default function MosaicoFotos({ fotos }: { fotos: string[] }) {
  if (fotos.length < 2) return null;

  // Usa até 4 fotos diferentes da primeira (que já aparece no slideshow)
  const fotosParaMosaico = fotos.slice(1, 5);
  if (fotosParaMosaico.length === 0) return null;

  return (
    <div className="fade-up flex gap-3 justify-center flex-wrap max-w-sm">
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
