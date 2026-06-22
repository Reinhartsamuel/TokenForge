import { Shield, CheckCircle2, Code2, Award } from "lucide-react";

export function TrustBarSection() {
  return (
    <section className="bg-gradient-to-b from-[#FAFBFC] to-[#F5F7FA] py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-slate-200">
              <Shield className="h-5 w-5 text-sky-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">SSTS Compliant</p>
              <p className="text-xs text-slate-500">Solana Security Token Standard</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-slate-200">
              <Award className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">OJK Sandbox Ready</p>
              <p className="text-xs text-slate-500">Regulatory compliance built-in</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-slate-200">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">23 Tests Passing</p>
              <p className="text-xs text-slate-500">Integration test coverage</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-slate-200">
              <Code2 className="h-5 w-5 text-slate-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">4 Programs Verified</p>
              <p className="text-xs text-slate-500">On-chain smart contracts</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
