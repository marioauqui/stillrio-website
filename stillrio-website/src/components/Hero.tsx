import Link from "next/link";
import ClawMarks from "./ClawMarks";
import LogoCube from "./LogoCube";

export default function Hero() {
  return (
    <section className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden rounded-b-3xl bg-gradient-to-b from-slate-800 via-slate-700 to-slate-800 px-6 py-24 text-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05)_0%,transparent_50%)]" />
      <div className="relative z-10 mb-6">
        <LogoCube />
      </div>
      <h1 className="relative z-10 text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl">
        StillRio
      </h1>
      <p className="relative z-10 mt-6 max-w-2xl text-lg text-slate-200 sm:text-xl">
        Creator • Explorer • Adventurer. Plan your next journey and discover what&apos;s out there.
      </p>
      <div className="relative z-10 mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-6">
        <ClawMarks variant="light" size={32} className="hidden sm:block -scale-x-100" />
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/#social"
            className="rounded-xl bg-white px-6 py-3 font-semibold tracking-wide text-slate-800 transition-all duration-200 hover:bg-slate-50 hover:shadow-md active:scale-[0.98]"
          >
            Connect
          </Link>
          <Link
            href="/adventure"
            className="rounded-xl border border-white/60 bg-white/5 px-6 py-3 font-semibold tracking-wide text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/15 hover:border-white/80 active:scale-[0.98]"
          >
            Plan Adventure
          </Link>
        </div>
        <ClawMarks variant="light" size={32} className="hidden sm:block" />
      </div>
    </section>
  );
}
