import Link from "next/link";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SocialLinks from "@/components/SocialLinks";
import TopTracks from "@/components/TopTracks";
import VideoEmbed from "@/components/VideoEmbed";

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header />
      <Hero />
      <section className="px-6 py-14" style={{ background: "var(--color-bg)" }}>
        <div className="mx-auto max-w-[1040px]">
          <div className="mx-auto max-w-lg rounded-2xl border border-slate-200/70 bg-white p-8 text-center shadow-elev-2 transition-premium hover:-translate-y-px sm:p-10">
            <span className="inline-block rounded-full bg-slate-900 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
              Beta
            </span>
            <h2 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">
              The Road Tool
            </h2>
            <p className="mx-auto mt-3 text-base text-slate-500" style={{ maxWidth: "44ch" }}>
              Mapping drives, checking weather, finding real stops.
              <br />
              Public transit coming soon.
            </p>
            <Link
              href="/adventure"
              className="mt-7 inline-flex h-11 items-center rounded-[14px] bg-slate-900 px-7 text-sm font-semibold text-white shadow-elev-3 transition-premium hover:-translate-y-px active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
            >
              Start planning →
            </Link>
          </div>
        </div>
      </section>
      <SocialLinks />
      <VideoEmbed />
      <TopTracks />
    </div>
  );
}
