export default function VideoEmbed() {
  // Replace with your actual YouTube video ID
  const videoId = "dQw4w9WgXcQ"; // Placeholder - swap for your StillRio video

  return (
    <section className="bg-slate-50 px-6 py-20 dark:bg-slate-950">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center text-3xl font-bold text-slate-800 dark:text-slate-100">
          Latest from StillRio
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-slate-600 dark:text-slate-400">
          Check out the newest adventures and content.
        </p>
        <div className="mt-12 aspect-video overflow-hidden rounded-3xl bg-slate-200/80 dark:bg-slate-800/80">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="StillRio Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
