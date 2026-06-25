import { TrendingUp, Users, BarChart3 } from "lucide-react";

const marketData = [
  {
    icon: TrendingUp,
    stat: "$88B",
    label: "Tokenization Market by 2030",
    description: "Project Wira estimates Indonesia's tokenization market will reach $88B by 2030. This is the window — and it's opening now.",
  },
  {
    icon: Users,
    stat: "21M+",
    label: "Crypto Investors Ready",
    description: "21M+ Indonesian crypto investors are already on-chain. They're ready to move from speculative tokens to real asset-backed securities.",
  },
  {
    icon: BarChart3,
    stat: "IDR 650T",
    label: "2024 Transaction Volume",
    description: "IDR 650T in crypto transaction volume in 2024 alone — and growing. These investors are looking for real-world yield.",
  },
];

const regulationData = [
  {
    title: "Q3 2026 Finalization",
    description: "OJK targets finalization of POJK Penawaran DFA (primary market regulation) in Q3 2026. The regulatory rails are being built right now.",
  },
  {
    title: "POJK 7/2024",
    description: "Opens BPR access to capital markets for the first time. BPRs can now issue tokenized securities to retail investors.",
  },
  {
    title: "PMK 50/2025",
    description: "Removes PPN (VAT) on tokenized assets. The tax burden that killed early tokenization projects is gone.",
  },
  {
    title: "Sandbox Phase 2",
    description: "2026-2027 is the Akselerasi phase. Issuers who enter sandbox today will have licensed infrastructure when the market opens.",
  },
];

const firstMoverData = [
  {
    title: "4 Sandbox Graduates",
    description: "GORO, D3 Labs, and others have already passed OJK Sandbox. The door is open — but not for long.",
  },
  {
    title: "Phase 2 = Akselerasi",
    description: "OJK's 3-phase roadmap puts us at the start of the acceleration phase. Every month of delay is a month your competitor gets closer to market.",
  },
  {
    title: "First-Mover Premium",
    description: "The first licensed issuers will capture disproportionate market share. Late entrants will fight for scraps.",
  },
];

export function TheGoldSection() {
  return (
    <section className="py-24 bg-slate-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Indonesia&lsquo;s $88B tokenization window is open 
          </h2>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto">
            The market, the regulation, and the timing all align right now. Here&lsquo;s why smart issuers are moving today.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 mb-16">
          {marketData.map((item, index) => (
            <div key={index} className="bg-slate-800/50 border border-amber-500/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <item.icon className="h-6 w-6 text-amber-400" />
                <span className="text-2xl font-bold text-amber-400">{item.stat}</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{item.label}</h3>
              <p className="text-sm text-slate-300">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-8 md:grid-cols-2 mb-16">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">The Regulation</h3>
            <ul className="space-y-4">
              {regulationData.map((item, index) => (
                <li key={index}>
                  <h4 className="text-sm font-semibold text-amber-400 mb-1">{item.title}</h4>
                  <p className="text-sm text-slate-300">{item.description}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">The First-Mover Advantage</h3>
            <ul className="space-y-4">
              {firstMoverData.map((item, index) => (
                <li key={index}>
                  <h4 className="text-sm font-semibold text-amber-400 mb-1">{item.title}</h4>
                  <p className="text-sm text-slate-300">{item.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-center">
          <p className="text-lg text-slate-300">
            The regulatory rails are being built <span className="text-amber-400 font-semibold">RIGHT NOW</span>. Issuers who enter sandbox today will have licensed infrastructure when the market opens.
          </p>
        </div>
      </div>
    </section>
  );
}
