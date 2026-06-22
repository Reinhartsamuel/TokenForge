"use client";

import { Terminal, ArrowRight, BookOpen, CheckCircle2, ShieldCheck, Coins, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F0F23] via-[#0F0F23] to-[#1A1A3E]" />
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-[#14F195]/20 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-[#9945FF]/20 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="text-left">
            <Badge variant="outline" className="border-[#14F195]/30 text-[#14F195] bg-[#14F195]/5 mb-6">
              <ShieldCheck className="mr-2 h-3 w-3" />
              Apache-2.0 Open Source
            </Badge>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              The Metaplex of{" "}
              <span className="bg-gradient-to-r from-[#14F195] to-[#9945FF] bg-clip-text text-transparent">
                RWA Tokens
              </span>
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-[#8B8BA7] max-w-xl">
              The first open-source SDK and issuer dashboard for the Solana Security Token Standard (SSTS). 
              Deploy compliant security tokens in hours, not months.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-[#14F195] text-[#0F0F23] hover:bg-[#14F195]/90 font-semibold"
                onClick={() => window.open("https://github.com/reinhartsamuel/tokenforge", "_blank")}
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-slate-700 text-white hover:bg-slate-800"
                onClick={() => window.open("https://github.com/reinhartsamuel/tokenforge/tree/main/sdk", "_blank")}
              >
                Read Docs
                <BookOpen className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-[#8B8BA7]">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#14F195]" />
                23 Tests Passing
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Coins className="h-4 w-4 text-[#9945FF]" />
                4 Programs Built
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Terminal className="h-4 w-4 text-[#14F195]" />
                13 Workflow Functions
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-[#1A1A3E]/50 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-4 mb-4">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <span className="ml-2 text-xs text-[#8B8BA7] font-mono">terminal</span>
            </div>
            <div className="font-mono text-sm">
              <div className="text-[#8B8BA7]">$ npm install @tokenforge/sdk</div>
              <div className="mt-2 text-[#14F195]">
                added 47 packages in 2.3s
              </div>
              <div className="mt-4 text-[#8B8BA7]">$</div>
              <div className="text-white">
                <span className="text-[#9945FF]">import</span>{" "}
                <span className="text-[#14F195]">{`{ createSecurityToken }`}</span>{" "}
                <span className="text-[#9945FF]">from</span>{" "}
                <span className="text-[#14F195]">'@tokenforge/sdk'</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
