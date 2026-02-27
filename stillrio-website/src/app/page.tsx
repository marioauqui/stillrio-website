import Link from "next/link";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SocialLinks from "@/components/SocialLinks";
import TopTracks from "@/components/TopTracks";
import VideoEmbed from "@/components/VideoEmbed";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <section className="border-b border-slate-200/80 bg-white px-6 py-12">
        <div className="mx-auto max-w-4xl text-center">
          <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
            New
          </span>
          <h2 className="mt-4 text-2xl font-bold text-slate-800 sm:text-3xl">
            Plan your next road trip adventure
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-600">
            Enter your start and destination, get a driving route with live weather, and discover AI-powered stops along the way—food, sights, nature, and more.
          </p>
          <Link
            href="/adventure"
            className="mt-6 inline-block rounded-xl bg-slate-800 px-6 py-3 font-semibold text-white transition-colors hover:bg-slate-700"
          >
            Start planning →
          </Link>
        </div>
      </section>
      <SocialLinks />
      <VideoEmbed />
      <TopTracks />
    </div>
  );
}
