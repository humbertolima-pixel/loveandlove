function extrairSpotifyEmbed(url: string): string | null {
  const match = url.match(/open\.spotify\.com\/(track|album|playlist)\/([a-zA-Z0-9]+)/);
  if (!match) return null;
  return `https://open.spotify.com/embed/${match[1]}/${match[2]}?theme=0`;
}

function extrairYoutubeEmbed(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/
  );
  if (!match) return null;
  return `https://www.youtube.com/embed/${match[1]}?autoplay=0`;
}

export default function PlayerMusica({ url }: { url: string }) {
  const spotifyEmbed = extrairSpotifyEmbed(url);
  const youtubeEmbed = extrairYoutubeEmbed(url);

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
