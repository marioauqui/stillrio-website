export default function VideoEmbed() {
  const videoId = "Hfm94aHAbYQ"; // Latest from StillRio

  return (
    <section className="border-t border-white/5 px-6 py-16" style={{ background: "#0f172a" }}>
      <div className="mx-auto max-w-[1040px]">
        <h2 className="text-center text-3xl font-bold text-white">
          Latest from StillRio
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-slate-400">
          Check out the recent journeys and content.
        </p>
        <div className="mt-8 overflow-hidden rounded-2xl border border-white/8 shadow-elev-2">
          <div className="aspect-video">
            <iframe
              className="h-full w-full"
              src={`https://www.youtube.com/embed/${videoId}`}
              title="StillRio Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
        <div className="mt-6 flex justify-center">
          <a
            href="https://youtube.com/@StillRio"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center rounded-[14px] border border-white/25 bg-white/8 px-7 text-sm font-semibold text-white transition-premium hover:-translate-y-px hover:border-white/40 hover:bg-white/14 active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f172a]"
          >
            Watch new videos →
          </a>
        </div>
      </div>
    </section>
  );
}
