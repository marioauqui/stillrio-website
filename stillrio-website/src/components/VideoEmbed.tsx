export default function VideoEmbed() {
  const videoId = "Hfm94aHAbYQ"; // Latest from StillRio

  return (
    <section className="bg-slate-800 px-6 pt-8 pb-16">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center text-3xl font-bold text-white">
          Latest from StillRio
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-slate-300">
          Check out the newest adventures and content.
        </p>
        <div className="mt-8 aspect-video overflow-hidden rounded-3xl bg-slate-700/60">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="StillRio Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="mt-6 flex justify-center">
          <a
            href="https://youtube.com/@StillRio"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-white/40 bg-white/10 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/20 hover:border-white/60"
          >
            Watch new videos →
          </a>
        </div>
      </div>
    </section>
  );
}
