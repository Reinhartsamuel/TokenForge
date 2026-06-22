import { Check, X, Minus } from "lucide-react";

const features = [
  {
    feature: "Cap table management",
    manual: "Spreadsheets",
    sdk: "Build your own",
    tokenforge: "Built-in",
  },
  {
    feature: "Compliance enforcement",
    manual: "Manual checks",
    sdk: "DIY",
    tokenforge: "Smart contract",
  },
  {
    feature: "Distribution orchestration",
    manual: "Wire transfers",
    sdk: "Build your own",
    tokenforge: "Merkle-based",
  },
  {
    feature: "Regulatory reporting",
    manual: "PDF exports",
    sdk: "None",
    tokenforge: "Automated",
  },
  {
    feature: "Investor KYC tracking",
    manual: "Manual files",
    sdk: "Build your own",
    tokenforge: "Built-in",
  },
  {
    feature: "Transfer restrictions",
    manual: "Legal agreements",
    sdk: "DIY",
    tokenforge: "On-chain",
  },
  {
    feature: "Time to launch",
    manual: "3-6 months",
    sdk: "2-3 months",
    tokenforge: "2-4 weeks",
  },
];

export function ComparisonSection() {
  return (
    <section className="bg-gradient-to-br from-[#F8FAFC] via-[#F5F7FA] to-[#FAFBFC] py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Why TokenForge over manual processes or generic SDKs?
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            A complete platform purpose-built for Indonesian security token compliance.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Feature</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-500">
                    Manual (Excel + Lawyers)
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-500">
                    Generic SDK
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-sky-700">
                    TokenForge
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {features.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{row.feature}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{row.manual}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{row.sdk}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-sky-700">
                        <Check className="h-4 w-4" />
                        {row.tokenforge}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
