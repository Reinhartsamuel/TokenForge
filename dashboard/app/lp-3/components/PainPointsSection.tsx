import { Scale, FileX, Lock, Clock } from "lucide-react";

const painPoints = [
  {
    icon: Scale,
    title: "Legal Complexity",
    description: "Navigating POJK 27/2024, POJK 3/2024 sandbox requirements, PMK 50/2025 tax rules, and the upcoming POJK Penawaran DFA requires a team of specialists. Most issuers spend $15K-$80K+ on securities counsel alone.",
  },
  {
    icon: FileX,
    title: "Manual Compliance",
    description: "Today: spreadsheets for cap tables, manual KYC tracking, paper-based transfer restrictions. Every transfer requires lawyer review. Every distribution requires wire transfers. Every report requires manual compilation.",
  },
  {
    icon: Lock,
    title: "No Secondary Market Access",
    description: "Even if you tokenize, without OJK-compliant infrastructure there's no regulated venue for your investors to trade. Your tokens are illiquid by design, not by market.",
  },
  {
    icon: Clock,
    title: "Time-to-Market",
    description: "Traditional tokenization: 3-6 months. Generic SDK: 2-3 months of custom development. By the time you launch, the regulatory window may have shifted.",
  },
];

export function PainPointsSection() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Tokenization shouldn't take 6 months and $300K in legal fees
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            You don't have a technology problem. You have a compliance infrastructure problem.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {painPoints.map((pain, index) => (
            <div key={index} className="bg-white border border-red-200/60 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <pain.icon className="h-8 w-8 text-red-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{pain.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{pain.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg font-semibold text-slate-900">
            You don't have a technology problem. <span className="text-red-600">You have a compliance infrastructure problem.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
