import Header from "@/components/Header";
import RoutePlanner from "@/components/RoutePlanner";

export default function AdventurePage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      <Header />
      <RoutePlanner />
    </div>
  );
}
