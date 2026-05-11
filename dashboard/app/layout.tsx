import type { Metadata } from "next";
import "./globals.css";
import { Inter, JetBrains_Mono } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: {
    default: "TokenForge — The Metaplex of RWA Tokens",
    template: "%s | TokenForge",
  },
  description:
    "The first open-source SDK and issuer dashboard for the Solana Security Token Standard (SSTS). Deploy compliant security tokens in hours, not months.",
  keywords: [
    "Solana",
    "security tokens",
    "RWA",
    "tokenization",
    "SSTS",
    "compliance",
    "blockchain",
    "SDK",
    "dashboard",
  ],
  authors: [{ name: "TokenForge Team" }],
  openGraph: {
    title: "TokenForge — The Metaplex of RWA Tokens",
    description:
      "Open-source SDK and issuer dashboard for Solana Security Token Standard",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "TokenForge — The Metaplex of RWA Tokens",
    description:
      "Open-source SDK and issuer dashboard for Solana Security Token Standard",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
        <body
          className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background text-foreground`}
        >
        {children}
      </body>
    </html>
  );
}
