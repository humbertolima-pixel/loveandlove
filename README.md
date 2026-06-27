# LoveAndLove

Plataforma de presente digital para casais: a pessoa compra, preenche um
formulário (nomes, data, fotos, frase, perguntas sobre a relação, música), e
o sistema gera automaticamente uma página única — um "site" completo da
história do casal — com QR code para baixar.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind v4
- Supabase (Postgres + Storage de fotos)
- Cakto (checkout + webhook de confirmação)
- Resend (envio do email com o link de criação)
- `qrcode` (geração do QR code)
- YouTube IFrame API (player de música robusto)

## Setup

### 1. Instalar dependências

```bash
npm install
```

### 2. Criar projeto no Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Vá em **SQL Editor** e cole o conteúdo de `supabase-schema.sql` — isso cria
   as tabelas `pedidos`, `casais`, `frases` e `declaracoes`, as políticas de
   RLS e o bucket de Storage pras fotos.
3. Cole também `supabase-seed-frases.sql` e `supabase-seed-declaracoes.sql`
   (cada um numa query separada) — populam 100 frases e 30 declarações de
   amor, sorteadas aleatoriamente na página pública de cada casal.
4. **Se você já tinha o banco criado de uma versão anterior**, rode
   `supabase-migration-v3.sql` — ele troca a coluna `historia` pelos 4 campos
   estruturados novos e cria a tabela `declaracoes`.
5. Em **Project Settings > API**, copie:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role key` → `SUPABASE_SERVICE_KEY` (nunca expor no client)

### 3. Criar conta no Resend

1. Crie uma conta em [resend.com](https://resend.com)
2. Verifique o domínio `loveandlove.com.br` (ou o seu) lá dentro
3. Copie a API key → `RESEND_API_KEY`
4. Ajuste o campo `from` em `src/app/api/webhook/cakto/route.ts` se usar
   outro domínio

### 4. Configurar a Cakto

1. No painel da Cakto, vá em **Webhooks** e aponte para:
   `https://seudominio.com.br/api/webhook/cakto`
2. Defina um secret e copie pra `CAKTO_WEBHOOK_SECRET`
3. Quando fizer o primeiro teste de compra real, confira o payload exato
   que a Cakto envia e ajuste os campos lidos em
   `src/app/api/webhook/cakto/route.ts` se precisar.
4. Troque a URL `https://pay.cakto.com.br/SEU-CHECKOUT-AQUI` em
   `src/app/page.tsx` pelo link real do seu checkout.

### 5. Variáveis de ambiente

```bash
cp .env.example .env.local
```

Preencha com os valores reais.

### 6. Rodar localmente

```bash
npm run dev
```

### 7. Deploy na Vercel

1. Suba este projeto pro GitHub
2. Importe no [vercel.com](https://vercel.com)
3. Cole as mesmas variáveis de ambiente nas configurações do projeto
4. Configure o domínio próprio quando tiver um

## Estrutura

```
src/
  app/
    page.tsx                    → landing page de vendas
    criar/page.tsx               → formulário de criação (valida ?token=)
    c/[slug]/page.tsx            → página pública do casal
    api/
      webhook/cakto/route.ts     → recebe confirmação de pagamento da Cakto
      validar-token/route.ts     → valida se o token existe e não foi usado
      criar-pagina/route.ts      → processa o formulário, gera slug, salva
  components/
    FormularioCriacao.tsx        → formulário client-side + geração do QR
    TelaAbertura.tsx              → vídeo/música em destaque + "role pra baixo"
    ContadorVivo.tsx              → contador ao vivo
    SlideshowFotos.tsx            → slideshow estilo polaroid
    MosaicoFotos.tsx              → grade de fotos extra, configurável
    SecaoPergunta.tsx             → bloco de pergunta+resposta+foto (tema Padrão)
    temas/
      TemaPadrao.tsx              → layout simples, com as 4 seções de pergunta
      TemaNetflix.tsx             → minissérie com "episódios"
      TemaSpotify.tsx             → playlist com "faixas"
  lib/
    supabase-admin.ts            → cliente Supabase (server, service key)
    supabase-browser.ts          → cliente Supabase (client, anon key)
    types.ts                     → tipos compartilhados
supabase-schema.sql              → schema completo pra colar no Supabase
supabase-seed-frases.sql         → 100 frases românticas
supabase-seed-declaracoes.sql    → 30 declarações de amor
supabase-migration-v3.sql        → migration para quem tinha o banco antigo
```

## Funcionalidades da página pública

- **Tela de abertura com vídeo/música em destaque** — se o cliente colocar
  um link do YouTube, o vídeo toca de verdade na tela (usa a YouTube IFrame
  API oficial, que respeita o autoplay porque é chamada em resposta direta
  ao clique do usuário — diferente de só passar `autoplay=1` na URL do
  iframe, que muitos navegadores ignoram). Se for Spotify, mostra o player
  deles com play em destaque. Depois de tocar, aparece "role pra baixo".
- **Contador ao vivo** — dias/horas/minutos/segundos juntos.
- **4 perguntas estruturadas** — "Onde se conheceram", "Como foi o primeiro
  encontro", "O que mais amam um no outro", "Um sonho que têm juntos". Cada
  tema usa essas respostas como conteúdo temático (episódios no Netflix,
  faixas no Spotify, seções com foto no Padrão).
- **Até 15 fotos**, usadas em múltiplos pontos de cada tema.
- **Frase do casal + frase aleatória** — sorteada do banco de 100 frases.
- **Declaração de amor final** — sorteada do banco de 30 declarações
  (parágrafo médio, 3-5 frases), como fechamento emocional da página.
- **2 temas exclusivos completos** (order bump) — Netflix e Spotify, cada
  um com múltiplas seções/"dobras" de scroll e corações animados na tela
  final.
- **Footer "feito com LoveAndLove 💛"**

## QR code com moldura

O QR code é desenhado num canvas em alta resolução (1200x1500px, ~10x12.5cm
a 300dpi, pronto pra impressão), com moldura dourada e o nome do casal.
Lógica em `gerarQrComMoldura()` dentro de `FormularioCriacao.tsx`.

## Fluxo completo

1. Cliente compra na Cakto
2. Cakto dispara webhook → sistema gera token único → salva em `pedidos` →
   envia email com link `/criar?token=XXXX`
3. Cliente abre o link, preenche o formulário, sobe as fotos
4. Sistema gera um slug único, salva em `casais`, marca o pedido como usado
5. Cliente recebe na tela o QR code (com moldura) pra baixar em PNG
6. Quem escanear o QR cai em `/c/[slug]`: vídeo/música em destaque,
   contador, as 4 seções da história, frase aleatória, declaração final —
   e se o casal não comprou o bump "para sempre", a página expira depois
   de 1 ano

## Pendências que ficaram para você decidir/testar

- **Payload exato da Cakto**: ajustar os campos lidos no webhook depois do
  primeiro teste real
- **CNAE do CNPJ**: regularizar atividade compatível com produto digital
- **Domínio**: trocar `loveandlove.com.br` nos textos pelo domínio real
