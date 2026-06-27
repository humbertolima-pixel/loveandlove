function extrairSpotifyEmbed(url: string): string | null {
  const match = url.match(/open\.spotify\.com\/(track|album|playlist)\/([a-zA-Z0-9]+)/);
  if (!match) return null;
  return `https://open.spotify.com/embed/${match[1]}/${match[2]}?theme=0`;
}

function extrairYoutubeEmbed(url: string, autoplay: boolean): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/
  );
  if (!match) return null;
  return `https://www.youtube.com/embed/${match[1]}?autoplay=${autoplay ? 1 : 0}&playsinline=1`;
}

export default function PlayerMusica({
  url,
  autoplay = false,
}: {
  url: string;
  autoplay?: boolean;
}) {
  const spotifyEmbed = extrairSpotifyEmbed(url);
  const youtubeEmbed = extrairYoutubeEmbed(url, autoplay);

  if (spotifyEmbed) {
    return (
      <div className="fade-up rounded-xl overflow-hidden mx-auto max-w-sm">
        <iframe
          src={spotifyEmbed}
          width="100%"
          height="152"
          style={{ border: "none" }}
          allow="autoplay; encrypted-media"
          loading="lazy"
        />
        {!autoplay && (
          <p className="text-center text-cream/40 font-body text-xs mt-2">
            toque em play para ouvir
          </p>
        )}
      </div>
    );
  }

  if (youtubeEmbed) {
    return (
      <div className="fade-up rounded-xl overflow-hidden mx-auto max-w-sm aspect-video">
        <iframe
          src={youtubeEmbed}
          width="100%"
          height="100%"
          allow="autoplay; encrypted-media"
          loading="lazy"
        />
      </div>
    );
  }

  return null;
}
