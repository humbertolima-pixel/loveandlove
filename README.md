# LoveAndLove

Plataforma de presente digital para casais: a pessoa compra, preenche um
formulário (nomes, data, fotos, frase, respostas sobre a relação, música), e
o sistema gera automaticamente uma página única no formato de **Stories**
(como Instagram/TikTok) contando a história do casal, com QR code pra
imprimir.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind v4
- Supabase (Postgres + Storage de fotos)
- Cakto (checkout + webhook de confirmação)
- Resend (envio do email com o link de criação)
- `qrcode` (geração do QR code)
- YouTube IFrame API (player de música robusto, tocando durante toda a navegação)

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
4. **Se você já tinha o banco criado de uma versão anterior**, rode, na
   ordem: `supabase-migration-v3.sql` (troca `historia` pelos 4 campos
   estruturados) e `supabase-migration-v4.sql` (atualiza registros antigos
   para o tema único atual).
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
4. Troque a URL do checkout em `src/app/page.tsx` pelo link real do seu
   checkout.

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
    c/[slug]/page.tsx            → página pública do casal (Stories)
    api/
      webhook/cakto/route.ts     → recebe confirmação de pagamento da Cakto
      validar-token/route.ts     → valida se o token existe e não foi usado
      criar-pagina/route.ts      → processa o formulário, gera slug, salva
  components/
    FormularioCriacao.tsx        → formulário client-side + geração do QR
    PlayerMusica.tsx              → player de música robusto (YouTube/Spotify)
    ExperienciaCasal.tsx          → ponto de entrada, delega para o tema
    temas/
      TemaRomantico.tsx           → experiência completa em formato Stories
  lib/
    supabase-admin.ts            → cliente Supabase (server, service key)
    supabase-browser.ts          → cliente Supabase (client, anon key)
    types.ts                     → tipos compartilhados
supabase-schema.sql              → schema completo pra colar no Supabase
supabase-seed-frases.sql         → 100 frases românticas
supabase-seed-declaracoes.sql    → 30 declarações de amor
supabase-migration-v3.sql        → migration: historia → 4 campos
supabase-migration-v4.sql        → migration: temas antigos → tema único
```

## A experiência em formato Stories

A página pública (`/c/[slug]`) funciona como um carrossel de Stories,
navegado por toque (direita avança, esquerda volta), com barrinhas de
progresso no topo:

1. **Capa** — foto de fundo, nome do casal, botão de tocar a história
2. **Contador** — "juntos há X dias"
3. **Música** — story dedicado à trilha (só aparece se o casal tiver música)
4. **As 4 respostas do casal** — onde se conheceram, primeiro encontro, o
   que mais amam, sonho juntos — cada uma com uma foto de fundo desfocada
5. **Galeria** — um story por foto restante, com legendas poéticas
   (intercalando a frase do casal com uma frase aleatória do banco)
6. **Declaração de amor** — sorteada do banco de 30, parágrafo médio
7. **Final** — "TE AMO" com pétalas caindo

A música, quando existe, começa a tocar no primeiro toque do usuário (na
capa) e **persiste durante toda a navegação** entre os stories — ela não
reinicia nem para ao trocar de story, porque o player vive fora da troca de
conteúdo visual, só sendo montado uma única vez.

### Sobre o player de música

Usa a **YouTube IFrame API oficial**, chamando `playVideo()` explicitamente
dentro do mesmo clique do usuário — isso é respeitado pelos navegadores,
diferente de só colocar `autoplay=1` na URL de um iframe (que é
silenciosamente bloqueado na maioria dos casos). Um cuidado técnico
importante: o player só é criado depois que o elemento alvo já existe
garantidamente no DOM (via callback ref do React), nunca antes — criar o
`YT.Player` apontando para um elemento que ainda não foi montado falha em
silêncio, sem erro visível, o que parecia "não fazer nada" nas versões
anteriores.

Suporta links do YouTube (watch, youtu.be, mobile, Shorts, com playlist) e
Spotify (com ou sem prefixo de idioma, com ou sem parâmetros extra).

## QR code com moldura

O QR code é desenhado num canvas em alta resolução (1200x1500px, ~10x12.5cm
a 300dpi, pronto pra impressão), com moldura dourada e o nome do casal.
Lógica em `gerarQrComMoldura()` dentro de `FormularioCriacao.tsx`.

## Fluxo completo

1. Cliente compra na Cakto
2. Cakto dispara webhook → sistema gera token único → salva em `pedidos` →
   envia email com link `/criar?token=XXXX`
3. Cliente abre o link, preenche o formulário, sobe até 15 fotos
4. Sistema gera um slug único, salva em `casais`, marca o pedido como usado
5. Cliente recebe na tela o QR code (com moldura) pra baixar em PNG
6. Quem escanear o QR cai em `/c/[slug]`: a experiência completa em Stories
   — e se o casal não comprou o bump "para sempre", a página expira depois
   de 1 ano

## Pendências que ficaram para você decidir/testar

- **Payload exato da Cakto**: ajustar os campos lidos no webhook depois do
  primeiro teste real
- **CNAE do CNPJ**: regularizar atividade compatível com produto digital
- **Domínio**: trocar `loveandlove.com.br` nos textos pelo domínio real
- **Teste real de autoplay**: validar em diferentes navegadores/dispositivos
  reais, já que políticas de privacidade do navegador do visitante (Brave,
  Safari com configurações agressivas) podem ainda bloquear autoplay de
  vídeo mesmo com a implementação tecnicamente correta
