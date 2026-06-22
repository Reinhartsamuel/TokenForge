import { Database, Server, Monitor } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const layers = [
  {
    icon: Database,
    title: "On-Chain Layer",
    description: "Canonical SSTS + FAMP programs deployed on Solana",
    items: ["security_token_program", "security_token_transfer_hook", "famp (allowlist/blocklist)", "verification_policy_noop"],
    accentColor: "#14F195",
  },
  {
    icon: Server,
    title: "Off-Chain Layer",
    description: "Hono API + Merkle proof generation + holder registry",
    items: ["Indexing service", "Distribution orchestration", "Merkle proof generation", "Holder registry"],
    accentColor: "#9945FF",
  },
  {
    icon: Monitor,
    title: "Frontend Layer",
    description: "Vite + React + TypeScript dashboard",
    items: ["Next.js issuer dashboard", "Wallet adapter integration", "shadcn/ui components", "Real-time status"],
    accentColor: "#14F195",
  },
];

export function ArchitectureSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-[#0F0F23] to-[#1A1A3E]/30">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Architecture{" "}
            <span className="text-[#9945FF]">Overview</span>
          </h2>
          <p className="mt-4 text-lg text-[#8B8BA7] max-w-2xl mx-auto">
            TokenForge is an orchestration layer, not a competing standard.
          </p>
        </div>

        <div className="space-y-6">
          {layers.map((layer, index) => (
            <Card
              key={layer.title}
              className="border-slate-800 bg-[#1A1A3E]/50 hover:border-[#14F195]/30 transition-colors"
            >
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className="flex-shrink-0">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${layer.accentColor}15` }}
                    >
                      <layer.icon className="h-6 w-6" style={{ color: layer.accentColor }} />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white mb-1">{layer.title}</h3>
                    <p className="text-sm text-[#8B8BA7] mb-4">{layer.description}</p>
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                      {layer.items.map((item) => (
                        <div
                          key={item}
                          className="flex items-center gap-2 text-sm text-[#8B8BA7] font-mono"
                        >
                          <div
                            className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: layer.accentColor }}
                          />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-[#8B8BA7]">
            <div className="h-2 w-2 rounded-full bg-[#14F195] animate-pulse" />
            Canonical-first design: We strengthen SSTS adoption, not fragment it
          </div>
        </div>
      </div>
    </section>
  );
}
