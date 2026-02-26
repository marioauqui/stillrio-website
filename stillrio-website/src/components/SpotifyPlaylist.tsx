export default function SpotifyPlaylist() {
  const playlistId = "3GNpZ30M4jqGuhxdvutrqA";

  return (
    <section id="spotify" className="border-t border-slate-200/80 bg-white px-6 py-14">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center text-2xl font-bold text-slate-800 sm:text-3xl">
          My top tracks
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-slate-600">
          A playlist of favorites — listen along.
        </p>
        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100 shadow-md" style={{ minHeight: 360 }}>
          <iframe
            title="Spotify Embed: My top tracks playlist"
            src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`}
            width="100%"
            height="380"
            style={{ minHeight: 352, border: 0 }}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        </div>
        <p className="mt-3 text-center text-xs text-slate-400">
          Playlist must be public on Spotify to embed.{" "}
          <a
            href={`https://open.spotify.com/playlist/${playlistId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-600 underline hover:text-slate-800"
          >
            Open in Spotify
          </a>
        </p>
      </div>
    </section>
  );
}
