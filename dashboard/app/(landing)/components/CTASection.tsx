"use client";

import { Code2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-b from-[#0F0F23] to-[#1A1A3E]/30 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-[#14F195]/20 blur-[120px]" />
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-[#9945FF]/20 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="rounded-xl border border-slate-800 bg-[#1A1A3E]/50 p-8 md:p-12 backdrop-blur-sm">
          <div className="text-sm font-mono text-[#14F195] mb-4">Terminal</div>
          <div className="text-3xl md:text-4xl font-bold font-mono text-white mb-6">
            npm install @tokenforge/sdk
          </div>
          <p className="text-lg text-[#8B8BA7] max-w-xl mx-auto mb-8">
            Start building compliant security tokens today. Open-source, canonical-first, and ready to deploy.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-[#14F195] text-[#0F0F23] hover:bg-[#14F195]/90 font-semibold"
              onClick={() => window.open("https://github.com/reinhartsamuel/tokenforge", "_blank")}
            >
              View on GitHub
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-slate-700 text-white hover:bg-slate-800"
              onClick={() => window.open("https://github.com/reinhartsamuel/tokenforge/tree/main/sdk", "_blank")}
            >
              <Code2 className="mr-2 h-4 w-4" />
              Explore SDK
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
