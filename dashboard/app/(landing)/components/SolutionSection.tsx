"use client";

import { useState, useEffect, useRef } from "react";
import { Package, LayoutDashboard, ShieldCheck, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Package,
    title: "TypeScript SDK",
    description:
      "3-layer architecture (L0 canonical → L1 adapters → L2 workflows). 13 workflow functions covering full token lifecycle.",
    command: "npm install @tokenforge/sdk",
  },
  {
    icon: LayoutDashboard,
    title: "Issuer Dashboard",
    description:
      "No-code UI for compliance teams. Token creation, policy management, distributions, and reporting — all through a clean interface.",
    command: "cd dashboard && npm run dev",
  },
  {
    icon: ShieldCheck,
    title: "FAMP Compliance",
    description:
      "Allowlist/blocklist verification program with policy-oracle pattern. Issuer retains control, we provide the rails.",
    command: "scripts/run-tests.sh",
  },
];

export function SolutionSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-[#0F0F23] to-[#1A1A3E]/30">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            From Months to{" "}
            <span className="bg-gradient-to-r from-[#14F195] to-[#9945FF] bg-clip-text text-transparent">
              One Day
            </span>
          </h2>
          <p className="mt-4 text-lg text-[#8B8BA7] max-w-2xl mx-auto">
            TokenForge closes the gap between canonical SSTS capability and issuer operational readiness.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              className="border-slate-800 bg-[#1A1A3E]/50 hover:border-[#14F195]/30 transition-colors"
            >
              <CardContent className="pt-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[#14F195]/10">
                  <feature.icon className="h-6 w-6 text-[#14F195]" />
                </div>
                <div className="mb-2 text-xs font-mono text-[#14F195]">{feature.command}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-sm text-[#8B8BA7] leading-relaxed mb-4">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          <Card className="border-slate-800 bg-[#1A1A3E]/50">
            <CardContent className="pt-6">
              <div className="text-sm font-mono text-[#8B8BA7] mb-4">Before TokenForge</div>
              <pre className="text-xs text-[#8B8BA7] bg-[#0F0F23] p-4 rounded-lg overflow-x-auto">
{`// Manual SSTS token creation
const [mint, metadata, extensions] = await Promise.all([
  createMint(rpc, payer, decimals),
  createMetadataAccount(...),
  createTransferHookConfig(...),
  createFreezeAuthorityConfig(...),
  createVerificationConfig(...),
  // 24+ instructions to derive
]);

const tx = await buildTransaction({
  instructions: [
    ...mintInstructions,
    ...metadataInstructions,
    ...extensionInstructions,
    // 50+ lines of account plumbing
  ],
});`}
              </pre>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-[#1A1A3E]/50">
            <CardContent className="pt-6">
              <div className="text-sm font-mono text-[#14F195] mb-4">With TokenForge SDK</div>
              <pre className="text-xs text-white bg-[#0F0F23] p-4 rounded-lg overflow-x-auto">
{`import { createSecurityToken } from '@tokenforge/sdk';

const result = await createSecurityToken(rpc, issuer, mint, {
  decimals: 6,
  metadata: {
    name: 'My Security Token',
    symbol: 'MST',
    uri: 'https://my-token.io/metadata.json',
  },
});
// All 24 instructions handled automatically`}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
