import { createHash } from "crypto";

function hashSha256(valor: string): string {
  return createHash("sha256").update(valor.trim().toLowerCase()).digest("hex");
}

interface DadosCompra {
  email?: string | null;
  valor: number;
  moeda?: string;
  idTransacao: string;
  urlOrigem?: string;
}

/**
 * Envia o evento de Purchase direto pro Meta via Conversions API,
 * a partir do servidor — não depende do navegador do cliente, então
 * não é afetado por bloqueadores de anúncio, cookies desabilitados,
 * ou de o cliente ter fechado a aba antes do pixel disparar.
 *
 * Disparado pelo webhook da Cakto no momento em que o pagamento é
 * confirmado (veja `src/app/api/webhook/cakto/route.ts`).
 *
 * Em caso de falha (chave ausente, API fora do ar), a função apenas
 * loga o erro e retorna — nunca deve interromper o fluxo principal
 * de liberar o acesso do cliente que pagou.
 */
export async function enviarCompraParaMeta(dados: DadosCompra): Promise<void> {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const accessToken = process.env.META_CONVERSIONS_API_TOKEN;

  if (!pixelId || !accessToken) {
    console.log(
      "Meta Conversions API não configurada (faltam variáveis de ambiente) — pulando envio do evento de Purchase."
    );
    return;
  }

  try {
    const payload = {
      data: [
        {
          event_name: "Purchase",
          event_time: Math.floor(Date.now() / 1000),
          action_source: "website",
          event_source_url: dados.urlOrigem ?? process.env.NEXT_PUBLIC_SITE_URL,
          user_data: {
            em: dados.email ? [hashSha256(dados.email)] : undefined,
          },
          custom_data: {
            currency: dados.moeda ?? "BRL",
            value: dados.valor,
          },
          event_id: dados.idTransacao,
        },
      ],
    };

    const url = `https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${accessToken}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const erro = await response.text();
      console.error("Erro ao enviar evento de Purchase pro Meta:", erro);
    }
  } catch (err) {
    console.error("Erro ao enviar evento pro Meta Conversions API:", err);
  }
}
