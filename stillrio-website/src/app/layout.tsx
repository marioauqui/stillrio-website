import type { Metadata } from "next";
import TickerBanner from "@/components/TickerBanner";
import "./globals.css";

export const metadata: Metadata = {
  title: "StillRio | Creator HQ & Adventure Planner",
  description:
    "StillRio — Your creator hub. Explore content, connect on YouTube, TikTok & Instagram, and plan real adventures with our interactive route planner.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <TickerBanner />
        {children}
      </body>
    </html>
  );
}
