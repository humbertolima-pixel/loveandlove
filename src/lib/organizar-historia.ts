interface HistoriaOrganizada {
  onde_se_conheceram: string;
  primeiro_encontro: string;
  o_que_mais_amam: string;
  sonho_juntos: string;
}

const PROMPT_SISTEMA = `Você organiza histórias de casais em 4 seções curtas, a partir de um texto livre escrito pelo cliente.

Leia o texto e extraia, reescrevendo em até 120 caracteres cada, em primeira pessoa do casal, num tom caloroso e romântico:
1. onde_se_conheceram: onde/como o casal se conheceu
2. primeiro_encontro: como foi o primeiro encontro de fato (não confundir com onde se conheceram)
3. o_que_mais_amam: o que eles mais amam um no outro
4. sonho_juntos: um sonho ou plano que têm juntos

Regras importantes:
- Se o texto não mencionar claramente uma dessas informações, retorne string vazia "" para esse campo — NUNCA invente informação que não está no texto.
- Reescreva com as próprias palavras do casal sempre que possível, só organizando e enxugando.
- Responda SOMENTE com um objeto JSON válido, sem nenhum texto antes ou depois, no formato exato:
{"onde_se_conheceram": "...", "primeiro_encontro": "...", "o_que_mais_amam": "...", "sonho_juntos": "..."}`;

/**
 * Organiza a história livre escrita pelo cliente em 4 seções
 * estruturadas, usando a API da Anthropic (modelo Haiku, mais
 * barato e rápido, suficiente para essa tarefa de extração).
 *
 * Em caso de qualquer falha (API fora, chave ausente, resposta
 * mal formada), retorna os 4 campos vazios — a página simplesmente
 * não mostra essas seções, sem quebrar o fluxo de criação.
 */
export async function organizarHistoriaComIA(
  historiaBruta: string
): Promise<HistoriaOrganizada> {
  const vazio: HistoriaOrganizada = {
    onde_se_conheceram: "",
    primeiro_encontro: "",
    o_que_mais_amam: "",
    sonho_juntos: "",
  };

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || !historiaBruta.trim()) {
    return vazio;
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 500,
        system: PROMPT_SISTEMA,
        messages: [{ role: "user", content: historiaBruta.slice(0, 2000) }],
      }),
    });

    if (!response.ok) {
      console.error("Erro na API da Anthropic:", await response.text());
      return vazio;
    }

    const data = await response.json();
    const texto: string = data?.content?.[0]?.text ?? "";

    const limpo = texto.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(limpo);

    return {
      onde_se_conheceram: String(parsed.onde_se_conheceram ?? "").slice(0, 150),
      primeiro_encontro: String(parsed.primeiro_encontro ?? "").slice(0, 150),
      o_que_mais_amam: String(parsed.o_que_mais_amam ?? "").slice(0, 150),
      sonho_juntos: String(parsed.sonho_juntos ?? "").slice(0, 150),
    };
  } catch (err) {
    console.error("Erro ao organizar história com IA:", err);
    return vazio;
  }
}
