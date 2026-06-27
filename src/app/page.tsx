export default function Home() {
  return (
    <main className="min-h-screen bg-wine">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 pt-24 pb-20 gap-8">
        <p className="fade-up font-body text-xs uppercase tracking-[0.25em] text-rose/80">
          LoveAndLove
        </p>
        <h1 className="fade-up font-display text-4xl md:text-6xl text-cream leading-tight max-w-2xl italic">
          A história de vocês, cabe num QR code.
        </h1>
        <p
          className="fade-up font-body text-cream/70 max-w-md text-base md:text-lg"
          style={{ animationDelay: "0.1s" }}
        >
          Fotos, uma música e um contador que nunca para de contar há quanto
          tempo vocês estão juntos. Tudo numa página só de vocês dois.
        </p>
        <a
          href="#planos"
          className="fade-up bg-gold text-wine-black font-body font-semibold px-8 py-3.5 rounded-full hover:opacity-90 transition"
          style={{ animationDelay: "0.2s" }}
        >
          Criar nossa página
        </a>
      </section>

      {/* Exemplo visual — mini preview do contador */}
      <section className="flex flex-col items-center gap-6 px-6 pb-24">
        <div className="bg-wine-black/40 border border-gold/20 rounded-2xl px-10 py-10 pulse-soft">
          <p className="font-body text-[0.65rem] uppercase tracking-[0.2em] text-rose/70 text-center mb-3">
            Juntos há
          </p>
          <div className="flex items-end justify-center gap-3">
            {["02", "184", "07", "42"].map((valor, i) => (
              <span
                key={i}
                className="font-display text-3xl md:text-4xl text-cream tabular-nums"
              >
                {valor}
                {i < 3 && <span className="text-gold/40 mx-1">:</span>}
              </span>
            ))}
          </div>
        </div>
        <p className="font-body text-cream/50 text-sm text-center">
          anos · dias · horas · minutos — contando agora mesmo
        </p>
      </section>

      {/* Como funciona */}
      <section className="px-6 py-20 bg-wine-black/30">
        <h2 className="font-display text-2xl md:text-3xl text-cream text-center mb-12 italic">
          Como funciona
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <Passo
            titulo="Conte a história"
            texto="Nomes, a data em que tudo começou, uma frase, fotos e uma música."
          />
          <Passo
            titulo="A página nasce"
            texto="Em segundos, vocês têm uma página só de vocês, com contador ao vivo."
          />
          <Passo
            titulo="Leve pra onde quiser"
            texto="Baixe o QR code e cole onde fizer sentido — num quadro, num cartão, numa mensagem."
          />
        </div>
      </section>

      {/* Planos */}
      <section id="planos" className="px-6 py-24">
        <h2 className="font-display text-2xl md:text-3xl text-cream text-center mb-3 italic">
          Escolha o plano
        </h2>
        <p className="font-body text-cream/60 text-center mb-12">
          Pagamento único. Sem mensalidade.
        </p>
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Plano
            nome="Essencial"
            preco="R$ 24,90"
            itens={[
              "Página personalizada",
              "Contador ao vivo",
              "Até 6 fotos",
              "Música embutida",
              "QR code para download",
              "Válida por 1 ano",
            ]}
          />
          <Plano
            destaque
            nome="Para sempre"
            preco="R$ 34,80"
            itens={[
              "Tudo do plano Essencial",
              "Página nunca expira",
              "Tema exclusivo (Netflix ou Polaroid vintage)",
            ]}
          />
        </div>
      </section>

      <footer className="text-center pb-10 font-body text-xs text-cream/40">
        LoveAndLove © {new Date().getFullYear()}
      </footer>
    </main>
  );
}

function Passo({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <div className="text-center fade-up">
      <p className="font-display text-xl text-gold mb-2">{titulo}</p>
      <p className="font-body text-cream/70 text-sm leading-relaxed">{texto}</p>
    </div>
  );
}

function Plano({
  nome,
  preco,
  itens,
  destaque = false,
}: {
  nome: string;
  preco: string;
  itens: string[];
  destaque?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-8 flex flex-col gap-5 ${
        destaque
          ? "bg-gold/10 border-2 border-gold"
          : "bg-cream/5 border border-cream/15"
      }`}
    >
      <div>
        <p className="font-display text-xl text-cream italic">{nome}</p>
        <p className="font-display text-3xl text-gold mt-1">{preco}</p>
      </div>
      <ul className="font-body text-cream/75 text-sm space-y-2 flex-1">
        {itens.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="text-gold">✓</span> {item}
          </li>
        ))}
      </ul>
      <a
        href="https://pay.cakto.com.br/3ezuy3k_945139"
        className={`text-center font-body font-semibold py-3 rounded-full transition ${
          destaque
            ? "bg-gold text-wine-black hover:opacity-90"
            : "bg-cream/10 text-cream hover:bg-cream/20"
        }`}
      >
        Escolher este plano
      </a>
    </div>
  );
}
