import { CheckCircle2, Clock, ArrowRight } from "lucide-react";

const timelineEvents = [
  {
    date: "Aug 2025",
    title: "Gold Tokenisasi lulus OJK Sandbox",
    status: "completed",
  },
  {
    date: "Nov 2025",
    title: "GORO lulus OJK Sandbox (100K+ users, 350% AUM growth)",
    status: "completed",
  },
  {
    date: "2025",
    title: "D3 Labs / BTN tokenize properti pertama dengan REIT tokens",
    status: "completed",
  },
  {
    date: "Q3 2026",
    title: "OJK target finalisasi POJK Penawaran DFA (primary market regulation)",
    status: "current",
  },
  {
    date: "2026-2027",
    title: "Fase Akselerasi: market opens for licensed issuers",
    status: "future",
  },
];

export function SocialProofSection() {
  return (
    <section className="py-24 bg-slate-900">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            The first wave of Indonesian tokenizers is already here
          </h2>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto">
            While you're reading this, your competitors are already in the sandbox.
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-px bg-slate-700" />

          <div className="space-y-8">
            {timelineEvents.map((event, index) => (
              <div key={index} className="relative flex items-start gap-6">
                <div className="flex-shrink-0">
                  {event.status === "completed" && (
                    <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                  )}
                  {event.status === "current" && (
                    <div className="relative">
                      <Clock className="h-6 w-6 text-amber-400" />
                      <div className="absolute inset-0 h-6 w-6 rounded-full bg-amber-400/20 animate-pulse" />
                    </div>
                  )}
                  {event.status === "future" && (
                    <div className="h-6 w-6 rounded-full border-2 border-dashed border-slate-600" />
                  )}
                </div>

                <div className="flex-1 pb-8 border-b border-slate-800 last:border-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`text-sm font-mono ${
                      event.status === "completed" ? "text-emerald-400" :
                      event.status === "current" ? "text-amber-400" :
                      "text-slate-500"
                    }`}>
                      {event.date}
                    </span>
                  </div>
                  <p className={`text-base ${
                    event.status === "completed" ? "text-slate-300" :
                    event.status === "current" ? "text-white font-semibold" :
                    "text-slate-500"
                  }`}>
                    {event.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg text-slate-300 mb-6">
            The sandbox door is open. The question is: will you be inside or outside when the market opens?
          </p>
          <a href="#cta" className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors font-semibold">
            See how to get started <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
