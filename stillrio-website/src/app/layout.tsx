import type { Metadata } from "next";
import { Inter } from "next/font/google";
import TickerBanner from "@/components/TickerBanner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://stillrio.com"),

  title: "StillRio — Creator & Explorer",
  description: "Plan the drive. Find what's along the way.",

  alternates: {
    canonical: "https://stillrio.com",
  },

  openGraph: {
    title: "StillRio — Creator & Explorer",
    description: "Plan the drive. Find what's along the way.",
    url: "https://stillrio.com",
    siteName: "StillRio",
    type: "website",
    images: [
      {
        url: "https://stillrio.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "StillRio — Creator & Explorer",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "StillRio — Creator & Explorer",
    description: "Plan the drive. Find what's along the way.",
    images: ["https://stillrio.com/og-image.png"],
  },
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
