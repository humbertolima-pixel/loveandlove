-- ============================================================
-- LoveAndLove — Migration v5
-- Rode isso no SQL Editor do Supabase para adicionar o campo
-- que guarda o texto livre original que o cliente escreveu,
-- antes da IA organizar em seções.
-- ============================================================

alter table casais add column if not exists historia_bruta text not null default '';
