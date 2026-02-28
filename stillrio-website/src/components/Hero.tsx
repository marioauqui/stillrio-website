import Link from "next/link";
import LogoCube from "./LogoCube";

export default function Hero() {
  return (
    <section className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-6 text-center">

      {/* Background base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% -10%, rgba(51,65,85,0.9) 0%, #0f172a 65%)",
        }}
        aria-hidden
      />

      {/* Ambient halo — slow breathing pulse */}
      <div
        className="animate-halo pointer-events-none absolute left-1/2 top-1/3 h-80 w-80 rounded-full blur-3xl"
        style={{ background: "rgba(148,163,184,0.06)" }}
        aria-hidden
      />

      {/* Secondary halo offset for depth */}
      <div
        className="pointer-events-none absolute left-[55%] top-[40%] h-48 w-48 rounded-full blur-2xl"
        style={{
          background: "rgba(203,213,225,0.03)",
          animation: "halo-pulse 36s ease-in-out 4s infinite",
        }}
        aria-hidden
      />

      {/* Content — staggered entrance */}
      <div className="relative z-10 mx-auto w-full max-w-[1040px] py-20 sm:py-24">

        {/* Logo */}
        <div className="mb-8 flex justify-center animate-fade-in-up anim-d0">
          <LogoCube />
        </div>

        {/* Title */}
        <h1
          className="font-bold tracking-tight text-white animate-fade-in-up anim-d1"
          style={{ fontSize: "clamp(42px, 7vw, 64px)", lineHeight: 1.05 }}
        >
          StillRio
        </h1>

        {/* Tagline */}
        <p className="mt-5 text-[12px] font-semibold uppercase tracking-[0.2em] text-slate-400 animate-fade-in-up anim-d2">
          Creator&nbsp;•&nbsp;Explorer&nbsp;•&nbsp;Adventurer
        </p>

        {/* Subtitle */}
        <p
          className="mx-auto mt-5 text-lg text-slate-300 animate-fade-in-up anim-d3"
          style={{ maxWidth: "52ch", lineHeight: 1.6 }}
        >
          Plan your next road trip adventure and discover what&apos;s out there.
        </p>
        <p className="mt-2 text-sm text-slate-500 animate-fade-in-up anim-d3">
          New: AI-powered road trip planner with suggested stops along your route.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 animate-fade-in-up anim-d4">
          {/* Primary */}
          <Link
            href="/#social"
            className="inline-flex h-12 items-center rounded-[14px] bg-white px-7 text-sm font-semibold text-slate-900 shadow-elev-3 transition-premium hover:-translate-y-px active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            Explore
          </Link>
          {/* Secondary */}
          <Link
            href="/adventure"
            className="inline-flex h-12 items-center rounded-[14px] border border-white/25 bg-white/8 px-7 text-sm font-semibold text-white backdrop-blur-sm transition-premium hover:-translate-y-px hover:border-white/45 hover:bg-white/14 active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            Route Builder
          </Link>
          {/* Secondary */}
          <Link
            href="/#top-tracks"
            className="inline-flex h-12 items-center rounded-[14px] border border-white/25 bg-white/8 px-7 text-sm font-semibold text-white backdrop-blur-sm transition-premium hover:-translate-y-px hover:border-white/45 hover:bg-white/14 active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            Soundtrack
          </Link>
        </div>

        {/* Hashtag line */}
        <p className="mt-8 text-sm text-slate-500 animate-fade-in-up anim-d5">
          Share your journey with{" "}
          <span className="font-medium text-slate-400">#stillrio</span>{" "}
          <span className="font-medium text-slate-400">#berio</span>
        </p>
      </div>
    </section>
  );
}
