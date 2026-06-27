# LoveAndLove

Plataforma de presente digital para casais: a pessoa compra, escreve a
história do casal em texto livre, sobe até 15 fotos, busca ou cola uma
música, e o sistema gera automaticamente uma página única em scroll
vertical contando essa história, com QR code pra imprimir.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind v4
- Supabase (Postgres + Storage de fotos)
- Cakto (checkout + webhook de confirmação)
- Resend (envio do email com o link de criação)
- Anthropic API (Claude Haiku) — organiza a história e gera a declaração
- YouTube Data API v3 — busca de música real dentro do formulário
- YouTube IFrame API — player de música robusto na página final
- `qrcode` (geração do QR code)

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
3. Cole também `supabase-seed-frases.sql` numa query separada — popula 100
   frases românticas, sorteadas aleatoriamente na página de cada casal.
4. **Se você já tinha o banco criado de uma versão anterior**, rode, na
   ordem: `supabase-migration-v3.sql`, `supabase-migration-v4.sql`,
   `supabase-migration-v5.sql` e `supabase-migration-v6.sql`.
5. Em **Project Settings > API**, copie:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role key` → `SUPABASE_SERVICE_KEY` (nunca expor no client)

### 3. Criar conta na Anthropic (organiza a história + gera a declaração)

1. Crie uma conta em [console.anthropic.com](https://console.anthropic.com)
2. Em **Billing**, adicione um crédito (R$25-50 cobre um volume alto de
   criações — o custo por chamada é de poucos centavos, usando o modelo
   Haiku)
3. Em **API Keys**, crie uma chave nova e copie → `ANTHROPIC_API_KEY`

### 4. Criar chave da YouTube Data API (busca de música)

1. Acesse [console.cloud.google.com](https://console.cloud.google.com)
2. Crie um projeto novo
3. Em **APIs e Serviços → Biblioteca**, busque "YouTube Data API v3" e
   clique em **Ativar**
4. Em **APIs e Serviços → Credenciais → Criar Credenciais → Chave de API**,
   copie a chave → `YOUTUBE_API_KEY`
5. Restrinja a chave só pra essa API (Editar a chave → Restrições)

**Sobre o custo:** é gratuito até 100 buscas por dia (cota do Google Cloud,
sem cartão de crédito). Se a cota diária acabar, o formulário detecta isso
automaticamente e troca pro botão "Buscar no YouTube" (abre uma aba nova
com a pesquisa pronta) — nenhuma busca quebra o fluxo de criação.

### 5. Criar conta no Resend

1. Crie uma conta em [resend.com](https://resend.com)
2. Verifique o domínio do seu site lá dentro
3. Copie a API key → `RESEND_API_KEY`
4. Ajuste o campo `from` em `src/app/api/webhook/cakto/route.ts` se usar
   outro domínio

### 6. Configurar a Cakto

1. No painel da Cakto, vá em **Webhooks** e aponte para:
   `https://seudominio.com/api/webhook/cakto`
2. Defina um secret e copie pra `CAKTO_WEBHOOK_SECRET`
3. Troque a URL do checkout em `src/app/page.tsx` pelo link real do seu
   checkout.

### 7. Variáveis de ambiente

```bash
cp .env.example .env.local
```

Preencha com os valores reais.

### 8. Rodar localmente

```bash
npm run dev
```

### 9. Deploy na Vercel

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
      buscar-musica/route.ts     → busca real no YouTube (com fallback)
  components/
    FormularioCriacao.tsx        → formulário client-side + geração do QR
    BuscaMusica.tsx                → busca de música com resultados reais
    PlayerMusica.tsx              → player de música robusto (YouTube/Spotify)
    ContadorVivo.tsx              → contador ao vivo de dias juntos
    SlideshowFotos.tsx            → slideshow estilo polaroid
    GaleriaCompleta.tsx            → grade com TODAS as fotos enviadas
    SecaoAlbum.tsx                 → bloco de pergunta+resposta+foto
    ExperienciaCasal.tsx          → ponto de entrada, delega para o tema
    temas/
      TemaRomantico.tsx           → página completa em scroll vertical
  lib/
    supabase-admin.ts            → cliente Supabase (server, service key)
    supabase-browser.ts          → cliente Supabase (client, anon key)
    organizar-historia.ts         → chama a Anthropic (seções + declaração)
    types.ts                     → tipos compartilhados
supabase-schema.sql              → schema completo pra colar no Supabase
supabase-seed-frases.sql         → 100 frases românticas
supabase-migration-v3.sql        → migration: historia → 4 campos
supabase-migration-v4.sql        → migration: temas antigos → tema único
supabase-migration-v5.sql        → migration: adiciona historia_bruta
supabase-migration-v6.sql        → migration: adiciona declaracao (IA)
```

## Como a história é organizada com IA

No formulário, o cliente escreve a história do casal num texto livre (até
2000 caracteres). No servidor, esse texto é enviado numa única chamada à
API da Anthropic (`organizar-historia.ts`), que retorna:

- 4 seções curtas (onde se conheceram, primeiro encontro, o que mais
  amam, sonho juntos) — até 120 caracteres cada, extraídas do texto
  original. Se o texto não mencionar algo claramente, o campo volta
  vazio — a IA nunca inventa informação.
- Uma **declaração de amor única**, de no mínimo 500 caracteres, escrita
  especialmente para aquele casal, usando os detalhes reais que eles
  compartilharam (nomes, lugares, situações). Cada casal recebe um texto
  diferente — não é mais sorteado de um banco fixo.

Se a chamada à API falhar por qualquer motivo, a função retorna os campos
vazios — a página não mostra essas seções, sem quebrar o resto da criação.

## A busca de música

O campo de música tem 3 camadas, nessa ordem de prioridade:

1. **Busca real** — o cliente digita o nome da música, e aparece uma lista
   de resultados reais do YouTube (com thumbnail, título e canal) pra
   escolher com um clique. Usa a YouTube Data API v3 (gratuita até 100
   buscas/dia).
2. **Fallback automático** — se a cota diária da API acabar (ou a chave
   não estiver configurada), o formulário detecta isso e troca o botão
   pra "Buscar no YouTube", que abre uma aba nova com a pesquisa pronta;
   o cliente copia o link de lá e cola no campo abaixo.
3. **Campo de link direto** — sempre visível, pra quem já tem o link em
   mãos (Spotify ou YouTube).

## A página pública

A página (`/c/[slug]`) é um scroll vertical:

1. **Capa** — foto de fundo (1ª foto), nome do casal, botão de tocar
2. **Contador** — dias/horas/minutos/segundos juntos, ao vivo
3. **Slideshow** — todas as fotos do casal em loop, estilo polaroid
4. **4 seções da história** — cada uma com uma foto dedicada (fotos 2 a 5),
   alternando o lado da foto
5. **Frase aleatória** — sorteada do banco de 100
6. **Galeria completa** — TODAS as fotos a partir da 6ª aparecem aqui, em
   grid com tamanhos variados (repete o padrão visual se faltar fotos
   suficientes pra completar a grade) — nenhuma foto enviada fica de fora
7. **Declaração de amor** — única, gerada pela IA pra aquele casal
8. **Footer**

A música, quando existe, fica num mini player fixo no canto da tela,
tocando durante todo o scroll.

### Sobre o player de música

Usa a **YouTube IFrame API oficial**, chamando `playVideo()` dentro do
mesmo clique do usuário (respeitado pelos navegadores, diferente de só
`autoplay=1` na URL, que é bloqueado). Dois cuidados técnicos importantes:

- O player nunca é menor que **200x113px** — esse é o tamanho mínimo
  absoluto exigido pelo YouTube; abaixo disso, o player sempre mostra os
  controles nativos sobrepostos (incluindo o link "abrir no YouTube"),
  e qualquer clique nessa área tira a pessoa da página.
- Os controles nativos do YouTube são desabilitados (`controls: 0`), e
  uma camada transparente é colocada por cima do player bloqueando
  qualquer clique — o áudio continua tocando normalmente, só não tem
  nenhuma interação possível que leve a pessoa pra fora da página.

Suporta links do YouTube (watch, youtu.be, mobile, Shorts, com playlist) e
Spotify (com ou sem prefixo de idioma, com ou sem parâmetros extra).

## QR code com moldura

O QR code é desenhado num canvas em alta resolução (1200x1500px, ~10x12.5cm
a 300dpi, pronto pra impressão), com logo "LoveAndLove", nome do casal,
moldura dourada decorada nos cantos (estilo convite), e a frase "Feito com
amor para o amor da minha vida". Lógica em `gerarQrComMoldura()` dentro de
`FormularioCriacao.tsx`.

## Fluxo completo

1. Cliente compra na Cakto
2. Cakto dispara webhook → sistema gera token único → salva em `pedidos` →
   envia email com link `/criar?token=XXXX`
3. Cliente abre o link, escreve a história livre, busca/cola a música,
   sobe até 15 fotos
4. Sistema chama a IA pra organizar a história e gerar a declaração, gera
   um slug único, salva em `casais`, marca o pedido como usado
5. Cliente recebe na tela o QR code (com moldura) pra baixar em PNG
6. Quem escanear o QR cai em `/c/[slug]`: a página completa em scroll
   vertical, com música tocando — e se o casal não comprou o bump "para
   sempre", a página expira depois de 1 ano

## Meta Pixel e Conversions API

O site dispara dois tipos de evento pro Meta (Facebook/Instagram Ads):

- **PageView** e **InitiateCheckout** — disparados no navegador via Pixel
  (`MetaPixel.tsx`), automaticamente em toda página e no clique do botão
  "Criar nossa página agora".
- **Purchase** — disparado direto do servidor via Conversions API
  (`meta-conversions-api.ts`), no momento em que o webhook da Cakto
  confirma um pagamento aprovado. Essa abordagem é mais confiável que
  depender só do pixel no navegador, porque não é afetada por
  bloqueadores de anúncio, cookies desabilitados, ou pelo cliente fechar
  a aba antes do pixel disparar.

Pra configurar: crie um Pixel no Gerenciador de Eventos do Meta
(business.facebook.com/events_manager), copie o ID do pixel pra
`NEXT_PUBLIC_META_PIXEL_ID`, e gere um token de acesso da Conversions API
(dentro do mesmo Pixel, em "API de Conversões" → Ações → gerar token
manualmente) pra `META_CONVERSIONS_API_TOKEN`.

**Atenção:** o valor da venda lido no webhook (`valorPago` em
`src/app/api/webhook/cakto/route.ts`) está com um valor fixo de fallback
(R$34,99) até você confirmar o campo exato em que a Cakto envia o valor
pago no payload real — ajuste isso no primeiro teste de compra real.

## Pendências que ficaram para você decidir/testar

- **Crédito da Anthropic e cota da YouTube API**: monitorar o consumo
  conforme o volume de vendas crescer
- **Payload exato da Cakto**: ajustar os campos lidos no webhook depois do
  primeiro teste real
- **CNAE do CNPJ**: regularizar atividade compatível com produto digital
- **Domínio**: trocar o domínio nos textos pelo domínio real
- **Teste real de autoplay**: validar em diferentes navegadores/dispositivos
  reais, já que políticas de privacidade do navegador do visitante podem
  ainda bloquear autoplay de vídeo mesmo com a implementação correta
