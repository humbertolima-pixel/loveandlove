import { NextRequest, NextResponse } from "next/server";

export interface ResultadoBuscaMusica {
  videoId: string;
  titulo: string;
  canal: string;
  thumbnail: string;
}

/**
 * Busca vídeos no YouTube usando a Data API v3 oficial.
 *
 * Custo de cota: cada busca consome 100 das 10.000 unidades diárias
 * gratuitas do projeto no Google Cloud — ou seja, ~100 buscas por dia
 * sem custo nenhum em dinheiro. Se a cota diária acabar, a API
 * responde com erro 403 (quotaExceeded), e nesse caso devolvemos
 * `quotaExcedida: true` para o cliente cair no fallback (botão que
 * abre o YouTube em nova aba).
 */
export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q");

  if (!query || !query.trim()) {
    return NextResponse.json({ error: "Busca vazia" }, { status: 400 });
  }

  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    // Sem chave configurada — cai no fallback sem gerar erro feio.
    return NextResponse.json({ quotaExcedida: true, resultados: [] });
  }

  try {
    const url = new URL("https://www.googleapis.com/youtube/v3/search");
    url.searchParams.set("part", "snippet");
    url.searchParams.set("type", "video");
    url.searchParams.set("maxResults", "6");
    url.searchParams.set("q", query.trim());
    url.searchParams.set("key", apiKey);
    url.searchParams.set("safeSearch", "moderate");

    const response = await fetch(url.toString());
    const data = await response.json();

    if (!response.ok) {
      const motivo = data?.error?.errors?.[0]?.reason;
      if (motivo === "quotaExceeded" || response.status === 403) {
        return NextResponse.json({ quotaExcedida: true, resultados: [] });
      }
      console.error("Erro na busca do YouTube:", data);
      return NextResponse.json(
        { error: "Erro ao buscar", resultados: [] },
        { status: 500 }
      );
    }

    const resultados: ResultadoBuscaMusica[] = (data.items ?? [])
      .filter((item: { id?: { videoId?: string } }) => item.id?.videoId)
      .map(
        (item: {
          id: { videoId: string };
          snippet: {
            title: string;
            channelTitle: string;
            thumbnails: { default: { url: string } };
          };
        }) => ({
          videoId: item.id.videoId,
          titulo: item.snippet.title,
          canal: item.snippet.channelTitle,
          thumbnail: item.snippet.thumbnails.default.url,
        })
      );

    return NextResponse.json({ quotaExcedida: false, resultados });
  } catch (err) {
    console.error("Erro ao buscar música no YouTube:", err);
    return NextResponse.json(
      { error: "Erro interno", resultados: [] },
      { status: 500 }
    );
  }
}
