"use client";

import { ArrowRight, BookOpen, ShieldCheck } from "lucide-react";

const partners = [
  { name: "Halborn", image: "/halborn.png" },
  { name: "Securitize", image: "/securitize.jpg" },
  { name: "Solana", image: "/solana.webp" },
  { name: "Superteam Indonesia", image: "/superteam indonesia.jpeg" },
  { name: "Otoritas Jasa Keuangan", image: "/ojk.jpeg" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-screen flex flex-col">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(/jakarta.webp)`,
        }}
      />
      <div className="absolute inset-0 bg-black/70" />

      {/* Main hero content - centered vertically */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex-1 flex items-center">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center w-full py-32">
          <div className="text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium text-white mb-6">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              OJK Regulatory Sandbox Ready
            </div>

            <h1 className="font-[family-name:var(--font-heading)] text-4xl font-bold tracking-normal text-white sm:text-5xl lg:text-6xl">
              The compliant tokenization platform for Indonesian digital assets
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-white/90 max-w-xl">
              Issue, manage, and distribute tokenized securities on Solana. Built for OJK compliance. Trusted by fund administrators, BPRs, and asset managers.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button className="inline-flex h-11 px-6 items-center justify-center rounded-lg bg-sky-600 text-sm font-semibold text-white hover:bg-sky-700 transition-colors">
                Request Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
              <a href="/docs">
                <button className="inline-flex h-11 px-6 items-center justify-center rounded-lg border border-white/30 bg-white/10 text-sm font-semibold text-white hover:bg-white/20 transition-colors">
                  View Documentation
                  <BookOpen className="ml-2 h-4 w-4" />
                </button>
              </a>
            </div>
          </div>

          <div className="rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm p-6 shadow-sm">
            <div className="flex items-center gap-2 border-b border-white/20 pb-4 mb-4">
              <div className="h-3 w-3 rounded-full bg-white/60" />
              <div className="h-3 w-3 rounded-full bg-white/60" />
              <div className="h-3 w-3 rounded-full bg-white/60" />
              <span className="ml-2 text-xs text-white/70 font-mono">Issuer Dashboard</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white">Cap Table</span>
                <span className="text-xs text-white/60 font-mono">12 investors</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-lg bg-white/10 border border-white/20 px-3 py-2">
                  <span className="text-sm text-white">PT Mandiri Investama</span>
                  <span className="text-sm font-mono text-white">2,500,000</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-white/10 border border-white/20 px-3 py-2">
                  <span className="text-sm text-white">BPR Nusantara</span>
                  <span className="text-sm font-mono text-white">1,800,000</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-white/10 border border-white/20 px-3 py-2">
                  <span className="text-sm text-white">Asia Credit Fund</span>
                  <span className="text-sm font-mono text-white">1,200,000</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-white/20">
                <span className="text-xs text-white/60">Compliance Status</span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  All Verified
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Partners banner - anchored to bottom of viewport */}
      <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-white/10 bg-white ">
        <div className="overflow-hidden py-2">
          <div className="flex animate-scroll items-center gap-12 whitespace-nowrap">
            {[...partners, ...partners, ...partners, ...partners].map((partner, index) => (
              <div key={`${partner.name}-${index}`} className="flex-shrink-0">
                <img
                  src={partner.image}
                  alt={partner.name}
                  className="h-10 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 25s linear infinite;
          width: max-content;
        }
      `}</style>
    </section>
  );
}
