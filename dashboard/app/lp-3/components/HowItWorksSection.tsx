import { Settings, Upload, Rocket, BarChart3 } from "lucide-react";

const steps = [
  {
    icon: Settings,
    step: "01",
    title: "Structure",
    description: "Define your asset pool, tranches, and compliance rules. Configure FAMP policies for each tranche.",
  },
  {
    icon: Upload,
    step: "02",
    title: "Configure",
    description: "Upload investor list, set KYC requirements, and configure transfer restrictions.",
  },
  {
    icon: Rocket,
    step: "03",
    title: "Issue",
    description: "Deploy tokens on Solana with OJK-compliant transfer restrictions built into the smart contract.",
  },
  {
    icon: BarChart3,
    step: "04",
    title: "Manage",
    description: "Distribute yield, manage cap table, and generate regulatory reports from the dashboard.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="bg-gradient-to-b from-[#FAFBFC] to-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            From structure to issuance in 4 steps
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Launch your first compliant token offering in weeks, not months.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, idx) => (
            <div key={idx} className="relative">
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50 border border-sky-100">
                    <step.icon className="h-5 w-5 text-sky-700" />
                  </div>
                  <span className="text-2xl font-bold text-slate-200">{step.step}</span>
                </div>
                <h3 className="font-[family-name:var(--font-heading)] text-lg font-semibold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>
              </div>
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 h-px w-8 bg-slate-200" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
