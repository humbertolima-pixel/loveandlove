# LoveAndLove

Plataforma de presente digital para casais: a pessoa compra, preenche um
formulário (nomes, data, fotos, frase, a história em texto livre, música), e
o sistema gera automaticamente uma página única em scroll vertical contando
a história do casal, com QR code pra imprimir.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind v4
- Supabase (Postgres + Storage de fotos)
- Cakto (checkout + webhook de confirmação)
- Resend (envio do email com o link de criação)
- Anthropic API (Claude Haiku) — organiza a história livre em seções
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
4. **Se você já tinha o banco criado de uma versão anterior**, rode, na
   ordem: `supabase-migration-v3.sql`, `supabase-migration-v4.sql` e
   `supabase-migration-v5.sql` (adiciona o campo que guarda o texto livre
   original do cliente).
5. Em **Project Settings > API**, copie:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role key` → `SUPABASE_SERVICE_KEY` (nunca expor no client)

### 3. Criar conta na Anthropic (para a IA organizar a história)

1. Crie uma conta em [console.anthropic.com](https://console.anthropic.com)
2. Em **Billing**, adicione um crédito (R$25-50 cobre um volume alto de
   criações — o custo por chamada é de poucos centavos, usando o modelo
   Haiku)
3. Em **API Keys**, crie uma chave nova e copie → `ANTHROPIC_API_KEY`
   (a chave só aparece uma vez, guarde com cuidado)

### 4. Criar conta no Resend

1. Crie uma conta em [resend.com](https://resend.com)
2. Verifique o domínio `loveandlove.com.br` (ou o seu) lá dentro
3. Copie a API key → `RESEND_API_KEY`
4. Ajuste o campo `from` em `src/app/api/webhook/cakto/route.ts` se usar
   outro domínio

### 5. Configurar a Cakto

1. No painel da Cakto, vá em **Webhooks** e aponte para:
   `https://seudominio.com.br/api/webhook/cakto`
2. Defina um secret e copie pra `CAKTO_WEBHOOK_SECRET`
3. Quando fizer o primeiro teste de compra real, confira o payload exato
   que a Cakto envia e ajuste os campos lidos em
   `src/app/api/webhook/cakto/route.ts` se precisar.
4. Troque a URL do checkout em `src/app/page.tsx` pelo link real do seu
   checkout.

### 6. Variáveis de ambiente

```bash
cp .env.example .env.local
```

Preencha com os valores reais.

### 7. Rodar localmente

```bash
npm run dev
```

### 8. Deploy na Vercel

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
      criar-pagina/route.ts      → processa o formulário, chama a IA, salva
  components/
    FormularioCriacao.tsx        → formulário client-side + geração do QR
    PlayerMusica.tsx              → player de música robusto (YouTube/Spotify)
    ContadorVivo.tsx              → contador ao vivo de dias juntos
    SlideshowFotos.tsx            → slideshow estilo polaroid
    MosaicoFotos.tsx              → grade de fotos extra
    SecaoAlbum.tsx                 → bloco de pergunta+resposta+foto
    ExperienciaCasal.tsx          → ponto de entrada, delega para o tema
    temas/
      TemaRomantico.tsx           → página completa em scroll vertical
  lib/
    supabase-admin.ts            → cliente Supabase (server, service key)
    supabase-browser.ts          → cliente Supabase (client, anon key)
    organizar-historia.ts         → chama a API da Anthropic
    types.ts                     → tipos compartilhados
supabase-schema.sql              → schema completo pra colar no Supabase
supabase-seed-frases.sql         → 100 frases românticas
supabase-seed-declaracoes.sql    → 30 declarações de amor
supabase-migration-v3.sql        → migration: historia → 4 campos
supabase-migration-v4.sql        → migration: temas antigos → tema único
supabase-migration-v5.sql        → migration: adiciona historia_bruta
```

## Como a história é organizada com IA

No formulário, o cliente escreve a história do casal num texto livre (até
2000 caracteres) — sem precisar preencher campos separados. No servidor,
esse texto é enviado para a API da Anthropic (`organizar-historia.ts`), que
extrai e reescreve, em até 150 caracteres cada, 4 seções:

- Onde se conheceram
- Como foi o primeiro encontro
- O que mais amam um no outro
- Um sonho que têm juntos

Se o texto não mencionar claramente algum desses pontos, a IA retorna
string vazia para aquele campo — ela nunca inventa informação que não
está no texto original. O texto bruto também é guardado (`historia_bruta`)
como backup, caso você queira revisar ou reprocessar depois.

Se a chamada à API falhar por qualquer motivo (chave ausente, API fora do
ar, resposta mal formada), a função retorna os 4 campos vazios — a página
simplesmente não mostra essas seções, sem quebrar o fluxo de criação do
restante da página.

## A página pública

A página (`/c/[slug]`) é um scroll vertical único:

1. **Capa** — foto de fundo, nome do casal, botão de tocar a história
2. **Contador** — dias/horas/minutos/segundos juntos, ao vivo
3. **Slideshow** — fotos do casal em loop, estilo polaroid
4. **4 seções da história** — cada uma com foto ao lado, alternando lados
5. **Frase aleatória** — sorteada do banco de 100
6. **Mosaico de fotos** — as fotos restantes, em grade
7. **Declaração de amor** — sorteada do banco de 30
8. **Footer**

A música, quando existe, começa a tocar no primeiro toque do usuário (na
capa) e fica num mini player fixo no canto da tela durante todo o scroll.

### Sobre o player de música

Usa a **YouTube IFrame API oficial**, chamando `playVideo()` explicitamente
dentro do mesmo clique do usuário — isso é respeitado pelos navegadores,
diferente de só colocar `autoplay=1` na URL de um iframe (que é
silenciosamente bloqueado na maioria dos casos). O player só é criado
depois que o elemento alvo já existe garantidamente no DOM (via callback
ref do React) — criar o `YT.Player` apontando para um elemento que ainda
não foi montado falha em silêncio, sem erro visível.

Suporta links do YouTube (watch, youtu.be, mobile, Shorts, com playlist) e
Spotify (com ou sem prefixo de idioma, com ou sem parâmetros extra). O
formulário valida o link em tempo real e avisa se ele não for reconhecido.

## QR code com moldura

O QR code é desenhado num canvas em alta resolução (1200x1500px, ~10x12.5cm
a 300dpi, pronto pra impressão), com moldura dourada e o nome do casal.
Lógica em `gerarQrComMoldura()` dentro de `FormularioCriacao.tsx`.

## Fluxo completo

1. Cliente compra na Cakto
2. Cakto dispara webhook → sistema gera token único → salva em `pedidos` →
   envia email com link `/criar?token=XXXX`
3. Cliente abre o link, escreve a história livre, sobe até 15 fotos
4. Sistema chama a IA pra organizar a história, gera um slug único, salva
   em `casais`, marca o pedido como usado
5. Cliente recebe na tela o QR code (com moldura) pra baixar em PNG
6. Quem escanear o QR cai em `/c/[slug]`: a página completa em scroll
   vertical — e se o casal não comprou o bump "para sempre", a página
   expira depois de 1 ano

## Pendências que ficaram para você decidir/testar

- **Crédito da Anthropic**: monitorar o consumo no console deles conforme
  o volume de vendas crescer
- **Payload exato da Cakto**: ajustar os campos lidos no webhook depois do
  primeiro teste real
- **CNAE do CNPJ**: regularizar atividade compatível com produto digital
- **Domínio**: trocar `loveandlove.com.br` nos textos pelo domínio real
- **Teste real de autoplay**: validar em diferentes navegadores/dispositivos
  reais, já que políticas de privacidade do navegador do visitante podem
  ainda bloquear autoplay de vídeo mesmo com a implementação correta
