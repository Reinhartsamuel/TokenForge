import type { Metadata } from "next";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "TokenForge — Compliant Tokenization Platform for Indonesian Digital Assets",
    template: "%s | TokenForge",
  },
  description:
    "Issue, manage, and distribute tokenized securities on Solana. Built for OJK compliance. Trusted by fund administrators, BPRs, and asset managers.",
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
    title: "TokenForge — Compliant Tokenization Platform",
    description:
      "Issue, manage, and distribute tokenized securities on Solana. Built for OJK compliance.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "TokenForge — Compliant Tokenization Platform",
    description:
      "Issue, manage, and distribute tokenized securities on Solana. Built for OJK compliance.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Lp2Layout({
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
