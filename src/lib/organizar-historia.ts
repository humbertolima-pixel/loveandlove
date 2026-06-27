interface HistoriaOrganizada {
  onde_se_conheceram: string;
  primeiro_encontro: string;
  o_que_mais_amam: string;
  sonho_juntos: string;
  declaracao: string;
}

const PROMPT_SISTEMA = `Você é um escritor especializado em textos românticos para casais, organizando e enriquecendo histórias de amor a partir de um texto livre escrito pelo cliente.

Leia o texto com atenção e produza:

1. onde_se_conheceram: onde/como o casal se conheceu, reescrito em até 120 caracteres, em primeira pessoa do casal, tom caloroso.
2. primeiro_encontro: como foi o primeiro encontro de fato (não confundir com onde se conheceram), até 120 caracteres.
3. o_que_mais_amam: o que eles mais amam um no outro, até 120 caracteres.
4. sonho_juntos: um sonho ou plano que têm juntos, até 120 caracteres.
5. declaracao: uma declaração de amor ÚNICA e PESSOAL, escrita especialmente para ESSE casal, com NO MÍNIMO 500 caracteres e no máximo 700. Use detalhes específicos que o casal mencionou no texto (nomes, lugares, situações, sentimentos) para tornar o texto único e impossível de confundir com o de outro casal. Tom emocional, sincero, em prosa corrida (não use bullet points), como uma carta de amor bem escrita. Evite clichês genéricos — ancore o texto nos detalhes reais que o casal compartilhou.

Regras importantes:
- Para os campos 1 a 4: se o texto não mencionar claramente essa informação, retorne string vazia "" — NUNCA invente informação que não está no texto.
- Para o campo 5 (declaracao): sempre gere um texto completo e único, mesmo que a história original seja curta — nesse caso, baseie-se no que houver disponível (nomes, sentimento geral) sem inventar fatos específicos que não foram ditos.
- Responda SOMENTE com um objeto JSON válido, sem nenhum texto antes ou depois, no formato exato:
{"onde_se_conheceram": "...", "primeiro_encontro": "...", "o_que_mais_amam": "...", "sonho_juntos": "...", "declaracao": "..."}`;

/**
 * Organiza a história livre escrita pelo cliente em 4 seções
 * estruturadas, e gera uma declaração de amor única (mínimo 500
 * caracteres) baseada nos detalhes reais que o casal compartilhou —
 * tudo numa única chamada à API da Anthropic (modelo Haiku).
 *
 * Em caso de qualquer falha (API fora, chave ausente, resposta mal
 * formada), retorna os campos vazios — a página simplesmente não
 * mostra essas seções, sem quebrar o fluxo de criação.
 */
export async function organizarHistoriaComIA(
  historiaBruta: string
): Promise<HistoriaOrganizada> {
  const vazio: HistoriaOrganizada = {
    onde_se_conheceram: "",
    primeiro_encontro: "",
    o_que_mais_amam: "",
    sonho_juntos: "",
    declaracao: "",
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
        max_tokens: 1000,
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
      declaracao: String(parsed.declaracao ?? "").slice(0, 800),
    };
  } catch (err) {
    console.error("Erro ao organizar história com IA:", err);
    return vazio;
  }
}
