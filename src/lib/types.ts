export type Tema = "romantico";

export interface Bumps {
  tema_exclusivo?: boolean;
  para_sempre?: boolean;
}

export interface Frase {
  id: string;
  texto: string;
}

export interface Declaracao {
  id: string;
  texto: string;
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
  onde_se_conheceram: string;
  primeiro_encontro: string;
  o_que_mais_amam: string;
  sonho_juntos: string;
  fotos: string[]; // URLs do Supabase Storage
  musica_url: string | null;
  tema: Tema;
  expira: boolean;
  criado_em: string;
}
