import { Building, Building2, Landmark, TrendingUp, ArrowRight } from "lucide-react";

const useCases = [
    {
    icon: TrendingUp,
    title: "Private Credit Funds",
    description:
      "Issue tokenized debt instruments with built-in compliance. Manage investor registry and distributions on-chain.",
    features: ["Debt instrument issuance", "Cap table management", "Regulatory reporting"],
  },
  {
    icon: Building2,
    title: "Community Loan Securitization",
    description:
      "Tokenize BPR/community bank loan pools into tranches. Access institutional capital while maintaining OJK compliance.",
    features: ["Automated tranching", "Waterfall distributions", "OJK-compliant transfers"],
  },
  {
    icon: Landmark,
    title: "P2P Lending Capital Relief",
    description:
      "Free up balance sheet by tokenizing performing loan portfolios. Automated distribution to investors.",
    features: ["Portfolio tokenization", "Merkle-based payouts", "Investor registry"],
  },
  {
    icon: Building,
    title: "Private Security Crowdfunding (SCF)",
    description:
      "Issue private security tokens to a select accredited investors. Manage cap table and distributions on-chain.",
    features: ["Debt instrument issuance", "Cap table management", "POJK 17/2025 Compliance Engine"],
  },
];

export function UseCasesSection() {
  return (
    <section id="use-cases" className="bg-gradient-to-b from-white via-[#FAFBFC] to-[#F8FAFC] py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Built for Indonesian financial institutions
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            From BPRs to asset managers, TokenForge powers the next generation of compliant digital assets.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {useCases.map((useCase, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50 border border-sky-100 mb-4">
                <useCase.icon className="h-5 w-5 text-sky-700" />
              </div>
              <h3 className="font-[family-name:var(--font-heading)] text-lg font-semibold text-slate-900 mb-2">{useCase.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">{useCase.description}</p>
              <ul className="space-y-2">
                {useCase.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-center gap-2 text-sm text-slate-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-sky-700" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 hover:text-sky-800 transition-colors">
            View all use cases
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
