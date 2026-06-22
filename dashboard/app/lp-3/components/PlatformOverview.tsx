import { 
  Coins, 
  Users, 
  ShieldCheck, 
  ArrowRightLeft, 
  Vote, 
  FileText 
} from "lucide-react";

const capabilities = [
  {
    icon: Coins,
    title: "Token Issuance",
    description: "Create compliant security tokens with pre-configured OJK rules and transfer restrictions.",
  },
  {
    icon: Users,
    title: "Investor Registry",
    description: "KYC/AML tracking, accreditation verification, and cap table management in one place.",
  },
  {
    icon: ShieldCheck,
    title: "Compliance Engine",
    description: "Allowlist/blocklist policies, transfer restrictions, and freeze/thaw capabilities.",
  },
  {
    icon: ArrowRightLeft,
    title: "Distribution Orchestration",
    description: "Merkle-based dividends, waterfall logic for tranching, and automated payouts.",
  },
  {
    icon: Vote,
    title: "Corporate Actions",
    description: "Voting, buybacks, snapshots, and forced transfers for operational flexibility.",
  },
  {
    icon: FileText,
    title: "Regulatory Reporting",
    description: "Audit trails, OJK-compliant reports, and on-chain evidence for regulators.",
  },
];

export function PlatformOverview() {
  return (
    <section id="platform" className="bg-gradient-to-br from-white via-[#FAFBFC] to-[#F8FAFC] py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Everything you need to tokenize. Nothing you don't.
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            A complete platform for issuing and managing tokenized securities, built for Indonesian regulatory compliance.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((capability) => (
            <div
              key={capability.title}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50 border border-sky-100">
                <capability.icon className="h-5 w-5 text-sky-700" />
              </div>
              <h3 className="font-[family-name:var(--font-heading)] mt-4 text-lg font-semibold text-slate-900">
                {capability.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                {capability.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
