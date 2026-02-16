export default function Hero() {
  return (
    <section className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-stone-900 via-stone-800 to-stone-900 px-6 py-24 text-center">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.03\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-60" />
      <h1 className="relative z-10 text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl">
        StillRio
      </h1>
      <p className="relative z-10 mt-6 max-w-2xl text-lg text-stone-300 sm:text-xl">
        Creator • Explorer • Adventurer. Plan your next journey and discover what&apos;s out there.
      </p>
      <div className="relative z-10 mt-10 flex flex-wrap justify-center gap-4">
        <a
          href="#social"
          className="rounded-full bg-white px-6 py-3 font-medium text-stone-900 transition hover:bg-stone-100"
        >
          Connect
        </a>
        <a
          href="#planner"
          className="rounded-full border border-white/30 px-6 py-3 font-medium text-white transition hover:bg-white/10"
        >
          Plan Adventure
        </a>
      </div>
    </section>
  );
}
