-- ============================================================
-- LoveAndLove — Migration v4
-- Rode isso no SQL Editor do Supabase se você já tinha o banco
-- criado com os temas antigos (netflix, spotify, padrao).
-- ============================================================

-- Atualiza qualquer registro existente para o único tema atual
update casais set tema = 'romantico' where tema in ('padrao', 'netflix', 'spotify');

-- Atualiza o valor default da coluna para futuras inserções
alter table casais alter column tema set default 'romantico';
