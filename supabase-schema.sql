-- ============================================================
-- LoveAndLove — Schema do Supabase
-- Cole isso no SQL Editor do seu projeto Supabase e rode uma vez.
-- ============================================================

-- Tabela: pedidos (criada pelo webhook da Cakto)
create table if not exists pedidos (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  nome_comprador text not null,
  token text not null unique,
  plano text not null,
  bumps jsonb not null default '{}'::jsonb,
  usado boolean not null default false,
  criado_em timestamptz not null default now()
);

create index if not exists idx_pedidos_token on pedidos (token);

-- Tabela: casais (criada quando o cliente preenche o formulário)
create table if not exists casais (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  nome1 text not null,
  nome2 text not null,
  data_inicio date not null,
  frase text not null,
  historia_bruta text not null default '',
  onde_se_conheceram text not null default '',
  primeiro_encontro text not null default '',
  o_que_mais_amam text not null default '',
  sonho_juntos text not null default '',
  fotos jsonb not null default '[]'::jsonb,
  musica_url text,
  tema text not null default 'romantico',
  expira boolean not null default true,
  criado_em timestamptz not null default now()
);

create index if not exists idx_casais_slug on casais (slug);

-- Tabela: frases (banco de frases românticas, sorteadas aleatoriamente
-- na página pública para complementar o conteúdo do casal)
create table if not exists frases (
  id uuid primary key default gen_random_uuid(),
  texto text not null
);

alter table frases enable row level security;
create policy "Leitura pública de frases"
  on frases for select
  using (true);

-- Tabela: declaracoes (30 declarações de amor, médias, sorteadas
-- para fechar a página com um momento emocional forte)
create table if not exists declaracoes (
  id uuid primary key default gen_random_uuid(),
  texto text not null
);

alter table declaracoes enable row level security;
create policy "Leitura pública de declarações"
  on declaracoes for select
  using (true);

-- ============================================================
-- Row Level Security — casais e pedidos
-- ============================================================

alter table casais enable row level security;
alter table pedidos enable row level security;

create policy "Leitura pública de casais"
  on casais for select
  using (true);

create policy "Bloqueia acesso público a pedidos"
  on pedidos for all
  using (false);

-- ============================================================
-- Storage: bucket para as fotos dos casais
-- ============================================================
insert into storage.buckets (id, name, public)
values ('fotos-casais', 'fotos-casais', true)
on conflict (id) do nothing;

create policy "Leitura pública das fotos"
  on storage.objects for select
  using (bucket_id = 'fotos-casais');

create policy "Upload de fotos via service key"
  on storage.objects for insert
  with check (bucket_id = 'fotos-casais');
