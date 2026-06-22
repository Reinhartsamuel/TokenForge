import { Shield, UserCheck, ArrowRight, CheckCircle2, Lock } from "lucide-react";

const steps = [
  { icon: UserCheck, label: "Investor KYC" },
  { icon: Shield, label: "On-chain Identity" },
  { icon: CheckCircle2, label: "Transfer Check" },
  { icon: Lock, label: "Compliance Gate" },
  { icon: ArrowRight, label: "Settlement" },
];

const regulations = [
  {
    rule: "POJK 27/2024 - Investor Eligibility",
    enforcement: "FAMP allowlist gates all transfers to verified investors only",
  },
  {
    rule: "POJK 27/2024 - Transfer Restrictions",
    enforcement: "Smart contract enforces lock-up periods and accredited investor rules",
  },
  {
    rule: "POJK 27/2024 - Freeze Authority",
    enforcement: "Issuer can freeze/thaw tokens for court orders or sanctions compliance",
  },
  {
    rule: "POJK 27/2024 - Audit Trail",
    enforcement: "Every transfer recorded on-chain with compliance oracle attestation",
  },
];

export function ComplianceEngine() {
  return (
    <section id="compliance" className="relative bg-gradient-to-br from-[#EFF6FF] via-[#F8FAFC] to-[#F0F9FF] py-20 sm:py-24">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(ellipse 50% 50% at 80% 50%, rgba(14, 165, 233, 0.05) 0%, transparent 70%)`,
        }}
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-start">
          <div>
            <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Compliance is not an afterthought. It's the architecture.
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Every transfer is checked against on-chain compliance policies. The FAMP program enforces your rules at the smart contract level, not the application level.
            </p>

            <div className="mt-8 space-y-4">
              {regulations.map((reg, idx) => (
                <div key={idx} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-900">{reg.rule}</p>
                  <p className="mt-1 text-sm text-slate-600">{reg.enforcement}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-8">
            <h3 className="font-[family-name:var(--font-heading)] text-sm font-semibold text-slate-900 uppercase tracking-wider mb-6">
              Transfer Compliance Flow
            </h3>
            <div className="space-y-4">
              {steps.map((step, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-slate-200 shadow-sm">
                    <step.icon className="h-5 w-5 text-sky-700" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{step.label}</p>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="hidden sm:block h-px w-8 bg-slate-300" />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-emerald-900">Policy Oracle Pattern</p>
                  <p className="mt-1 text-sm text-emerald-700">
                    The FAMP program queries an on-chain oracle for compliance decisions, enabling updatable rules without redeploying tokens.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
