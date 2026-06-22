import type { Metadata } from "next";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "TokenForge — Tokenize Now Before OJK Regulation Finalizes",
    template: "%s | TokenForge",
  },
  description:
    "OJK finalizes tokenization regulation Q3 2026. First movers in sandbox get licensed infrastructure first. TokenForge gives you the compliance stack to be first.",
  keywords: [
    "tokenization",
    "security tokens",
    "OJK compliance",
    "Indonesian digital assets",
    "BPR",
    "P2P lending",
    "asset management",
    "Solana",
    "regulatory sandbox",
  ],
  authors: [{ name: "TokenForge Team" }],
  openGraph: {
    title: "TokenForge — Tokenize Now Before OJK Regulation Finalizes",
    description:
      "OJK finalizes tokenization regulation Q3 2026. First movers in sandbox get licensed infrastructure first.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "TokenForge — Tokenize Now Before OJK Regulation Finalizes",
    description:
      "OJK finalizes tokenization regulation Q3 2026. First movers in sandbox get licensed infrastructure first.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${montserrat.variable} font-sans antialiased`}>
      {children}
    </div>
  );
}
