import { ArrowRight, MessageSquare } from "lucide-react";

export function CTASection() {
  return (
    <section className="bg-gradient-to-br from-[#EFF6FF] via-[#F0F9FF] to-[#F8FAFC] py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12 text-center">
          <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Ready to tokenize?
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Join the OJK regulatory sandbox and launch your first compliant token offering.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button className="inline-flex h-11 px-6 items-center justify-center rounded-lg bg-sky-700 text-sm font-semibold text-white hover:bg-sky-800 transition-colors">
              Request Demo
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
            <button className="inline-flex h-11 px-6 items-center justify-center rounded-lg border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
              Contact Sales
              <MessageSquare className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
