import type { Metadata } from "next";
import "./globals.css";
import { WalletContextProvider } from "@/components/wallet-context-provider";

export const metadata: Metadata = {
  title: "TokenForge Dashboard",
  description: "Issuer management for Security Tokens",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-50 antialiased">
        <WalletContextProvider>{children}</WalletContextProvider>
      </body>
    </html>
  );
}
