import { ArrowDown, Shield, TrendingUp, AlertTriangle } from "lucide-react";

const tranches = [
  {
    name: "Senior Tranche",
    risk: "Low",
    return: "6-8% APY",
    color: "bg-emerald-50 border-emerald-200",
    textColor: "text-emerald-700",
    iconColor: "text-emerald-600",
    description: "First priority on cash flows. Lowest risk, stable returns.",
    width: "w-full",
  },
  {
    name: "Mezzanine Tranche",
    risk: "Medium",
    return: "10-14% APY",
    color: "bg-amber-50 border-amber-200",
    textColor: "text-amber-700",
    iconColor: "text-amber-600",
    description: "Subordinated to senior. Higher yield for moderate risk.",
    width: "w-4/5",
  },
  {
    name: "Equity Tranche",
    risk: "High",
    return: "18-25% APY",
    color: "bg-red-50 border-red-200",
    textColor: "text-red-700",
    iconColor: "text-red-600",
    description: "First-loss position. Absorbs defaults. Highest potential returns.",
    width: "w-3/5",
  },
];

export function TranchingWorkflow() {
  return (
    <section className="bg-gradient-to-br from-[#F0F7FA] via-[#F8FAFC] to-[#F0F4F8] py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Structure loan pools into senior, mezzanine, and equity tranches
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Tokenize BPR loan portfolios with waterfall distribution logic. Each tranche has its own FAMP policy and investor allowlist.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-start">
          <div>
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="font-[family-name:var(--font-heading)] text-sm font-semibold text-slate-900 uppercase tracking-wider mb-6">
                Tranche Structure
              </h3>
              <div className="space-y-4">
                {tranches.map((tranche, idx) => (
                  <div key={idx}>
                    <div className={`rounded-lg border p-4 ${tranche.color}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {idx === 0 ? (
                            <Shield className={`h-4 w-4 ${tranche.iconColor}`} />
                          ) : idx === 1 ? (
                            <TrendingUp className={`h-4 w-4 ${tranche.iconColor}`} />
                          ) : (
                            <AlertTriangle className={`h-4 w-4 ${tranche.iconColor}`} />
                          )}
                          <span className={`text-sm font-semibold ${tranche.textColor}`}>
                            {tranche.name}
                          </span>
                        </div>
                        <span className={`text-xs font-medium ${tranche.textColor}`}>
                          {tranche.risk} Risk
                        </span>
                      </div>
                      <p className={`text-xs ${tranche.textColor} mb-2`}>
                        {tranche.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-mono font-semibold ${tranche.textColor}`}>
                          {tranche.return}
                        </span>
                        <span className={`text-xs ${tranche.textColor}`}>
                          {idx === 0 ? "Paid first" : idx === 1 ? "Paid second" : "First-loss"}
                        </span>
                      </div>
                    </div>
                    {idx < tranches.length - 1 && (
                      <div className="flex justify-center py-2">
                        <ArrowDown className="h-4 w-4 text-slate-400" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="font-[family-name:var(--font-heading)] text-sm font-semibold text-slate-900 uppercase tracking-wider mb-6">
                Waterfall Distribution Logic
              </h3>
              <div className="space-y-4">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-900">1. Cash Flow Received</p>
                  <p className="mt-1 text-sm text-slate-600">
                    Loan repayments from BPR portfolio flow into the SPV
                  </p>
                </div>
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-sm font-medium text-emerald-900">2. Senior Tranche Paid</p>
                  <p className="mt-1 text-sm text-emerald-700">
                    Senior investors receive their 6-8% coupon first
                  </p>
                </div>
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <p className="text-sm font-medium text-amber-900">3. Mezzanine Tranche Paid</p>
                  <p className="mt-1 text-sm text-amber-700">
                    Remaining cash flows to mezzanine investors (10-14%)
                  </p>
                </div>
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                  <p className="text-sm font-medium text-red-900">4. Equity Tranche Receives Residual</p>
                  <p className="mt-1 text-sm text-red-700">
                    Equity holders receive remaining cash flows (18-25%) or absorb losses
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-lg border border-sky-200 bg-sky-50 p-4">
                <p className="text-sm font-medium text-sky-900">Automated by Smart Contract</p>
                <p className="mt-1 text-sm text-sky-700">
                  Distribution orchestration is handled by the TokenForge distribution program with Merkle-based payouts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
