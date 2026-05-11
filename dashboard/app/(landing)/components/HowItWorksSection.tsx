import { Wallet, Settings2, Send, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Wallet,
    title: "Connect + Configure",
    description:
      "Connect your Solana wallet, configure KYC program settings, and deploy your security token with compliance extensions.",
    accentColor: "#14F195",
  },
  {
    number: "02",
    icon: Settings2,
    title: "Mint + Manage",
    description:
      "Use the dashboard for all operations: minting, freeze/thaw, policy management, and verification controls.",
    accentColor: "#9945FF",
  },
  {
    number: "03",
    icon: Send,
    title: "Distribute + Report",
    description:
      "Execute Merkle-based distributions, maintain holder registry, and generate compliance reports automatically.",
    accentColor: "#14F195",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-[#0F0F23]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            How It{" "}
            <span className="text-[#14F195]">Works</span>
          </h2>
          <p className="mt-4 text-lg text-[#8B8BA7] max-w-2xl mx-auto">
            Three steps from zero to compliant security token deployment.
          </p>
        </div>

        <div className="relative grid gap-12 md:grid-cols-3">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-[#14F195] via-[#9945FF] to-[#14F195] hidden md:block -translate-y-1/2 opacity-20" />

          {steps.map((step) => (
            <div key={step.number} className="relative text-center">
              <div className="relative z-10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2"
                style={{ borderColor: step.accentColor }}
              >
                <step.icon className="h-7 w-7" style={{ color: step.accentColor }} />
                <div
                  className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-[#0F0F23]"
                  style={{ backgroundColor: step.accentColor }}
                >
                  {step.number}
                </div>
              </div>

              <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
              <p className="text-sm text-[#8B8BA7] leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
