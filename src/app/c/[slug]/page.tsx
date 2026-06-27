import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { Casal, Frase } from "@/lib/types";
import ExperienciaCasal from "@/components/ExperienciaCasal";

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

async function buscarFraseAleatoria(): Promise<Frase | null> {
  // Conta quantas frases existem e sorteia um índice aleatório.
  // Evita depender de funções específicas do Postgres para portabilidade.
  const { count } = await supabaseAdmin
    .from("frases")
    .select("*", { count: "exact", head: true });

  if (!count || count === 0) return null;

  const indiceAleatorio = Math.floor(Math.random() * count);

  const { data, error } = await supabaseAdmin
    .from("frases")
    .select("*")
    .range(indiceAleatorio, indiceAleatorio)
    .limit(1)
    .single();

  if (error || !data) return null;
  return data as Frase;
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

  const fraseAleatoria = await buscarFraseAleatoria();

  return <ExperienciaCasal casal={casal} fraseAleatoria={fraseAleatoria} />;
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
