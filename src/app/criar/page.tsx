import { Suspense } from "react";
import FormularioCriacao from "@/components/FormularioCriacao";

export const metadata = {
  title: "Criar nossa página — LoveAndLove",
};

interface PageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function CriarPage({ searchParams }: PageProps) {
  const { token } = await searchParams;

  return (
    <main className="min-h-screen bg-wine px-6 py-16">
      <div className="text-center mb-10 fade-up">
        <h1 className="font-display text-3xl md:text-4xl text-cream mb-2">
          Falta só uma etapa
        </h1>
        <p className="text-cream/70 font-body">
          Conta pra gente a história de vocês.
        </p>
      </div>

      <Suspense fallback={<p className="text-center text-cream/70">Carregando...</p>}>
        <FormularioCriacao token={token ?? ""} />
      </Suspense>
    </main>
  );
}
