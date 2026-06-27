export default function SecaoPergunta({
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
        <div className="w-full md:w-2/5 aspect-[4/5] rounded-xl overflow-hidden shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={foto} alt="" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="flex-1 text-center md:text-left">
        <p className="font-body text-xs uppercase tracking-[0.2em] text-rose/70 mb-2">
          {titulo}
        </p>
        <p className="font-display text-xl md:text-2xl text-cream italic leading-relaxed">
          {texto}
        </p>
      </div>
    </div>
  );
}
