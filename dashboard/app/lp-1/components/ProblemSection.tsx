import { Code, Shield, FileText, Clock, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const painPoints = [
  {
    icon: Code,
    title: "Zero tooling exists",
    description: "3 months after SCTS spec publication, no canonical SDK or dashboard exists for issuers.",
  },
  {
    icon: Shield,
    title: "Manual implementation",
    description: "Hand-roll Anchor CPI calls, KYC/AML checks, Merkle trees, and compliance controls from scratch.",
  },
  {
    icon: FileText,
    title: "No canonical SDK",
    description: "Every issuer re-derives PDAs, constructs multi-instruction transactions, and builds error handling.",
  },
  {
    icon: Clock,
    title: "2-3 month engineering project",
    description: "Before launch, teams must build the entire issuer tooling stack themselves.",
  },
];

export function ProblemSection() {
  return (
    <section className="py-24 bg-[#0F0F23]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Issuing a Compliant Security Token on Solana{" "}
            <span className="text-[#14F195]">Takes 2–3 Months</span>
          </h2>
          <p className="mt-4 text-lg text-[#8B8BA7] max-w-2xl mx-auto">
            The canonical SSTS provides robust on-chain capabilities, but the implementation gap
            leaves issuers building from scratch.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {painPoints.map((point) => (
            <Card
              key={point.title}
              className="border-slate-800 bg-[#1A1A3E]/50 hover:border-[#14F195]/30 transition-colors"
            >
              <CardContent className="pt-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[#14F195]/10">
                  <point.icon className="h-6 w-6 text-[#14F195]" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{point.title}</h3>
                <p className="text-sm text-[#8B8BA7] leading-relaxed">{point.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Card className="border-slate-800 bg-gradient-to-r from-[#14F195]/5 to-[#9945FF]/5">
            <CardContent className="flex items-center gap-4 py-6 px-8">
              <DollarSign className="h-8 w-8 text-[#14F195]" />
              <div>
                <div className="text-2xl font-bold text-white">$50K+</div>
                <div className="text-sm text-[#8B8BA7]">in manual implementation costs per token</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
