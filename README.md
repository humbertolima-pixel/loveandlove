# LoveAndLove

Plataforma de presente digital para casais: a pessoa compra, preenche um
formulário (nomes, data, fotos, frase, música), e o sistema gera uma página
única com contador ao vivo + QR code pra baixar.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind v4
- Supabase (Postgres + Storage de fotos)
- Cakto (checkout + webhook de confirmação)
- Resend (envio do email com o link de criação)
- `qrcode` (geração do QR code no navegador)

## Setup

### 1. Instalar dependências

```bash
npm install
```

### 2. Criar projeto no Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Vá em **SQL Editor** e cole o conteúdo de `supabase-schema.sql` — isso cria
   as tabelas `pedidos`, `casais` e `frases`, as políticas de RLS e o bucket
   de Storage pras fotos.
3. Cole também o conteúdo de `supabase-seed-frases.sql` numa segunda query —
   isso popula a tabela `frases` com 100 frases românticas, sorteadas
   aleatoriamente na página pública de cada casal.
4. **Se você já tinha o banco criado de uma versão anterior** (com a coluna
   `marcos`), rode também `supabase-migration-historia.sql` — ele troca a
   coluna `marcos` (jsonb) pela coluna `historia` (texto livre).
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
3. **Importante:** o webhook em `src/app/api/webhook/cakto/route.ts` lê o
   payload assumindo uma estrutura aproximada (`status`, `customer.email`,
   `customer.name`, `items`). Quando você fizer o primeiro teste de compra
   real na Cakto, confira o payload exato que ela envia (tem um log de testes
   no painel deles) e ajuste os campos lidos no código — esse é o ponto mais
   provável de precisar de ajuste fino.
4. Configure o link de checkout do plano "Para sempre" como um order bump,
   e troque a URL `https://pay.cakto.com.br/SEU-CHECKOUT-AQUI` em
   `src/app/page.tsx` pelo link real do seu checkout.

### 5. Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha com os valores reais:

```bash
cp .env.example .env.local
```

### 6. Rodar localmente

```bash
npm run dev
```

### 7. Deploy na Vercel

1. Suba este projeto pro GitHub
2. Importe no [vercel.com](https://vercel.com)
3. Cole as mesmas variáveis de ambiente do `.env.local` nas configurações
   do projeto na Vercel
4. Configure o domínio `loveandlove.com.br` (ou o que você registrar)

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
    ContadorVivo.tsx              → contador ao vivo (assinatura visual)
    SlideshowFotos.tsx            → slideshow estilo polaroid
    PlayerMusica.tsx               → embed Spotify/YouTube
  lib/
    supabase-admin.ts            → cliente Supabase (server, service key)
    supabase-browser.ts          → cliente Supabase (client, anon key)
    types.ts                     → tipos compartilhados
supabase-schema.sql              → schema completo pra colar no Supabase
```

## Funcionalidades da página pública

- **Tela de convite** — antes de qualquer coisa, mostra o nome do casal e um
  botão "Tocar a nossa história". Isso existe porque navegadores bloqueiam
  autoplay de música com som; o clique do usuário "destrava" a música e
  revela o resto da página com uma transição suave.
- **Contador ao vivo** — dias/horas/minutos/segundos juntos, atualizado a
  cada segundo.
- **Fotos em múltiplos pontos** — até 15 fotos, usadas em vários lugares
  conforme o tema: fundo desfocado, slideshow, mosaico, episódios/faixas/
  destaques (nos temas Netflix/Spotify/Instagram).
- **História livre** — o cliente escreve a história do casal com as
  próprias palavras, num texto livre (até 2000 caracteres). Cada tema
  divide esse texto em parágrafos e usa cada um como um "episódio"
  (Netflix), "faixa" (Spotify) ou "destaque" (Instagram).
- **Frase do casal + frase aleatória** — a frase que o cliente escreveu
  aparece junto com uma frase sorteada do banco de 100 frases românticas
  (tabela `frases`).
- **Música com autoplay robusto** — usa a YouTube IFrame API oficial
  (chama `playVideo()` depois que o usuário já interagiu na tela de
  convite, o que os navegadores respeitam) em vez de depender só do
  parâmetro `autoplay=1` na URL do iframe, que muitos navegadores ignoram
  silenciosamente. Para Spotify, usa o embed nativo deles com autoplay.
- **Busca assistida de música** — o cliente digita o nome da música/artista
  e clica em "Buscar no YouTube", que abre uma aba já com a pesquisa
  pronta; ele copia o link de lá e cola de volta no campo.
- **3 temas exclusivos completos** (order bump) — cada um é um layout
  inteiro, com múltiplas seções/"dobras" de scroll e animações (corações
  flutuantes na tela final):
  - **Netflix** — minissérie com episódios (um por parágrafo da história),
    sinopse, galeria de momentos, elenco
  - **Spotify** — playlist com faixas (um por parágrafo da história),
    capa, galeria "em alta", artistas
  - **Instagram** — perfil com destaques (um por parágrafo da história),
    feed, post fixado

  Cada tema é um componente próprio em `src/components/temas/`, recebendo
  os dados reais do casal. O roteamento entre eles fica em
  `ExperienciaCasal.tsx`.
- **Footer "feito com LoveAndLove 💛"** (presente em todos os temas)


## QR code com moldura

Na tela de sucesso do formulário, o QR code não é mais gerado "pelado" — ele
é desenhado num canvas em alta resolução (1200x1500px, equivalente a
~10x12.5cm a 300dpi, pronto pra impressão), com moldura dourada e o nome do
casal acima do código. Isso fica em `gerarQrComMoldura()` dentro de
`FormularioCriacao.tsx`.

## Fluxo completo

1. Cliente compra na Cakto
2. Cakto dispara webhook → sistema gera token único → salva em `pedidos` →
   envia email com link `/criar?token=XXXX`
3. Cliente abre o link, preenche o formulário, sobe as fotos
4. Sistema gera um slug único, salva em `casais`, marca o pedido como usado
5. Cliente recebe na tela o QR code (gerado no navegador) pra baixar em PNG
6. Quem escanear o QR cai em `/c/[slug]`: contador ao vivo, fotos, frase,
   música — e se o casal não comprou o bump "para sempre", a página expira
   automaticamente depois de 1 ano

## Pendências que ficaram para você decidir/testar

- **Payload exato da Cakto**: ajustar os campos lidos no webhook depois do
  primeiro teste real (item 4 do setup acima)
- **CNAE do CNPJ**: regularizar atividade compatível com produto digital,
  conforme conversamos antes
- **Domínio**: trocar `loveandlove.com.br` nos textos pelo domínio real que
  você registrar, se for diferente
