import Link from "next/link";

export function UrgencyCTASection() {
  return (
    <section id="cta" className="py-24 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-6">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-sm font-semibold text-amber-400">Q3 2026 Deadline</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            OJK finalizes tokenization regulation Q3 2026
          </h2>
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
            Issuers in sandbox today will have licensed infrastructure when the market opens. Those who wait will be playing catch-up.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link href="/dashboard">
              <button className="h-12 px-8 inline-flex items-center justify-center rounded-lg bg-sky-700 text-base font-semibold text-white hover:bg-sky-600 transition-colors">
                Enter the Sandbox
              </button>
            </Link>
            <button className="h-12 px-8 inline-flex items-center justify-center rounded-lg border border-slate-600 text-base font-medium text-slate-300 hover:bg-slate-800 transition-colors">
              Download Regulatory Guide
            </button>
          </div>

          <p className="text-sm text-slate-400">
            TokenForge is OJK Sandbox Ready. We handle the compliance infrastructure. You focus on your asset.
          </p>
        </div>
      </div>
    </section>
  );
}
