-- ============================================================
-- LoveAndLove — Migration v6
-- Rode isso no SQL Editor do Supabase para adicionar o campo de
-- declaração de amor única, gerada pela IA a partir da história
-- real do casal (em vez de sorteada de um banco fixo).
-- ============================================================

alter table casais add column if not exists declaracao text not null default '';

-- A tabela "declaracoes" (banco fixo de 30 frases) não é mais usada
-- pela página, mas não precisa ser removida — não causa nenhum
-- problema mantê-la no banco, caso queira usá-la de outra forma no
-- futuro.
