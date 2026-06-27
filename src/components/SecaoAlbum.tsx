export default function SecaoAlbum({
  titulo,
  texto,
  foto,
  inverter = false,
}: {
  titulo: string;
  texto: string;
  foto?: string;
  inverter?: boolean;
}) {
  if (!texto) return null;

  return (
    <div
      className={`fade-up flex flex-col md:flex-row items-center gap-6 md:gap-10 max-w-3xl mx-auto px-6 ${
        inverter ? "md:flex-row-reverse" : ""
      }`}
    >
      {foto && (
        <div
          className="w-full md:w-2/5 aspect-[4/5] rounded-sm overflow-hidden shrink-0 shadow-xl shrink-0"
          style={{
            transform: inverter ? "rotate(1.2deg)" : "rotate(-1.2deg)",
            border: "8px solid white",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={foto} alt="" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="flex-1 text-center md:text-left">
        <p className="font-body text-[0.7rem] uppercase tracking-[0.18em] text-rose-600/60 mb-2">
          {titulo}
        </p>
        <p className="font-display text-xl md:text-2xl text-wine-text italic leading-relaxed">
          {texto}
        </p>
      </div>
    </div>
  );
}
