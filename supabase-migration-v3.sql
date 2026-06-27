-- ============================================================
-- LoveAndLove — Migration v3
-- Rode isso no SQL Editor do Supabase se você já tinha o banco
-- criado com a coluna "historia".
-- ============================================================

-- Troca historia (texto livre) por 4 campos estruturados
alter table casais add column if not exists onde_se_conheceram text not null default '';
alter table casais add column if not exists primeiro_encontro text not null default '';
alter table casais add column if not exists o_que_mais_amam text not null default '';
alter table casais add column if not exists sonho_juntos text not null default '';
alter table casais drop column if exists historia;

-- Cria a tabela de declarações de amor (rode o seed depois)
create table if not exists declaracoes (
  id uuid primary key default gen_random_uuid(),
  texto text not null
);
alter table declaracoes enable row level security;
create policy "Leitura pública de declarações"
  on declaracoes for select
  using (true);
