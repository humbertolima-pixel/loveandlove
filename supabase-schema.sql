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
  historia text not null default '',
  fotos jsonb not null default '[]'::jsonb,
  musica_url text,
  tema text not null default 'padrao',
  expira boolean not null default true,
  criado_em timestamptz not null default now()
);

create index if not exists idx_casais_slug on casais (slug);

-- Tabela: frases (banco de frases românticas, sorteadas aleatoriamente
-- na página pública para complementar a frase escrita pelo cliente)
create table if not exists frases (
  id uuid primary key default gen_random_uuid(),
  texto text not null
);

-- Leitura pública liberada (qualquer um pode ler para sortear na página)
alter table frases enable row level security;
create policy "Leitura pública de frases"
  on frases for select
  using (true);

-- ============================================================
-- Row Level Security
-- A leitura pública da página do casal precisa ser permitida
-- (qualquer pessoa que escaneia o QR code lê via chave anônima).
-- Escrita só acontece via service key (API routes), nunca do client.
-- ============================================================

alter table casais enable row level security;
alter table pedidos enable row level security;

-- Qualquer pessoa pode LER um casal pelo slug (página pública)
create policy "Leitura pública de casais"
  on casais for select
  using (true);

-- Ninguém lê/escreve pedidos pelo client (só a API com service key)
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
