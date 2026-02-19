import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden rounded-b-3xl bg-gradient-to-b from-slate-800 via-slate-700 to-slate-800 px-6 py-24 text-center dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05)_0%,transparent_50%)]" />
      <Image
        src="/logo.png"
        alt="StillRio"
        width={120}
        height={120}
        className="logo-outline-dark relative z-10 mb-6 bg-transparent object-contain mix-blend-multiply drop-shadow-[0_0_24px_rgba(255,255,255,0.4)] dark:mix-blend-normal"
      />
      <h1 className="relative z-10 text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl">
        StillRio
      </h1>
      <p className="relative z-10 mt-6 max-w-2xl text-lg text-slate-200 sm:text-xl dark:text-slate-300">
        Creator • Explorer • Adventurer. Plan your next journey and discover what&apos;s out there.
      </p>
      <div className="relative z-10 mt-10 flex flex-wrap justify-center gap-4">
        <a
          href="#social"
          className="rounded-full bg-white px-6 py-3 font-medium text-slate-800 transition hover:bg-slate-100"
        >
          Connect
        </a>
        <a
          href="#planner"
          className="rounded-full border border-white/40 px-6 py-3 font-medium text-white transition hover:bg-white/10"
        >
          Plan Adventure
        </a>
      </div>
    </section>
  );
}
