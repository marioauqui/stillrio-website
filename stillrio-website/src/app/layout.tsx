import type { Metadata } from "next";
import { Inter } from "next/font/google";
import TickerBanner from "@/components/TickerBanner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="en" suppressHydrationWarning className="overflow-x-hidden">
      <body className={`${inter.className} antialiased overflow-x-hidden`}>
        <TickerBanner />
        {children}
      </body>
    </html>
  );
}
