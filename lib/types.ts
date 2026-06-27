export type Tema = "padrao" | "netflix" | "polaroid-vintage";

export interface Bumps {
  tema_exclusivo?: boolean;
  para_sempre?: boolean;
}

export interface Pedido {
  id: string;
  email: string;
  nome_comprador: string;
  token: string;
  plano: string;
  bumps: Bumps;
  usado: boolean;
  criado_em: string;
}

export interface Casal {
  id: string;
  slug: string;
  nome1: string;
  nome2: string;
  data_inicio: string; // ISO date
  frase: string;
  fotos: string[]; // URLs do Supabase Storage
  musica_url: string | null;
  tema: Tema;
  expira: boolean;
  criado_em: string;
}
