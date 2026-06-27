import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { Casal } from "@/lib/types";
import ContadorVivo from "@/components/ContadorVivo";
import SlideshowFotos from "@/components/SlideshowFotos";
import PlayerMusica from "@/components/PlayerMusica";

const UM_ANO_MS = 365 * 24 * 60 * 60 * 1000;

function estaExpirado(criadoEm: string): boolean {
  const criado = new Date(criadoEm).getTime();
  return Date.now() - criado > UM_ANO_MS;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function buscarCasal(slug: string): Promise<Casal | null> {
  const { data, error } = await supabaseAdmin
    .from("casais")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return data as Casal;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const casal = await buscarCasal(slug);

  if (!casal) return { title: "Página não encontrada — LoveAndLove" };

  return {
    title: `${casal.nome1} & ${casal.nome2} — LoveAndLove`,
    description: casal.frase,
  };
}

export default async function PaginaCasal({ params }: PageProps) {
  const { slug } = await params;
  const casal = await buscarCasal(slug);

  if (!casal) notFound();

  const expirou = casal.expira && estaExpirado(casal.criado_em);

  if (expirou) {
    return <PaginaExpirada />;
  }

  const temaClasse =
    casal.tema === "netflix"
      ? "tema-netflix"
      : casal.tema === "polaroid-vintage"
      ? "tema-polaroid-vintage"
      : "";

  return (
    <main
      className={`min-h-screen bg-wine flex flex-col items-center justify-center gap-12 px-6 py-20 ${temaClasse}`}
    >
      <ContadorVivo dataInicio={casal.data_inicio} />

      <div className="fade-up text-center">
        <h1 className="font-display text-3xl md:text-5xl text-cream italic">
          {casal.nome1} <span className="text-gold">&</span> {casal.nome2}
        </h1>
      </div>

      {casal.fotos.length > 0 && <SlideshowFotos fotos={casal.fotos} />}

      <p className="font-display text-xl md:text-2xl text-cream/90 text-center max-w-md italic leading-relaxed fade-up">
        &ldquo;{casal.frase}&rdquo;
      </p>

      {casal.musica_url && <PlayerMusica url={casal.musica_url} />}

      <footer className="font-body text-xs text-cream/40 mt-8">
        feito com{" "}
        <Link href="/" className="underline">
          LoveAndLove
        </Link>
      </footer>
    </main>
  );
}

function PaginaExpirada() {
  return (
    <main className="min-h-screen bg-wine flex flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="font-display text-3xl text-cream fade-up">
        Esta página expirou
      </p>
      <p className="font-body text-cream/70 max-w-sm fade-up">
        Mas a história não precisa terminar aqui. Crie uma nova página, dessa
        vez para sempre.
      </p>
      <Link
        href="/"
        className="fade-up bg-gold text-wine-black font-body font-semibold px-6 py-3 rounded-full hover:opacity-90 transition"
      >
        Criar nova página
      </Link>
    </main>
  );
}
