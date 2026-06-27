-- ============================================================
-- LoveAndLove — Migration: marcos (jsonb) -> historia (text)
-- Rode isso no SQL Editor do Supabase SE você já tinha o banco
-- criado com a coluna "marcos" de uma versão anterior.
-- ============================================================

alter table casais add column if not exists historia text not null default '';
alter table casais drop column if exists marcos;
