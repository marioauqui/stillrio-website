import Header from "@/components/Header";
import Hero from "@/components/Hero";
import RoutePlanner from "@/components/RoutePlanner";
import SocialLinks from "@/components/SocialLinks";
import VideoEmbed from "@/components/VideoEmbed";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <SocialLinks />
      <VideoEmbed />
      <RoutePlanner />
    </div>
  );
}
