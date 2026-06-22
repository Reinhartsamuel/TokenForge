import { 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  ArrowRightLeft, 
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock
} from "lucide-react";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Overview", active: false },
  { icon: Users, label: "Investors", active: true },
  { icon: ShieldCheck, label: "Compliance", active: false },
  { icon: ArrowRightLeft, label: "Distributions", active: false },
  { icon: FileText, label: "Reports", active: false },
];

const investors = [
  { name: "PT Mandiri Investama", holdings: "2,500,000", kyc: "verified", status: "active" },
  { name: "BPR Nusantara", holdings: "1,800,000", kyc: "verified", status: "active" },
  { name: "Asia Credit Fund", holdings: "1,200,000", kyc: "verified", status: "active" },
  { name: "PT Graha Konstruksi", holdings: "950,000", kyc: "pending", status: "active" },
  { name: "Nusa Tenggara Capital", holdings: "750,000", kyc: "verified", status: "active" },
];

const alerts = [
  { type: "success", message: "All investors KYC verified" },
  { type: "warning", message: "1 transfer pending compliance review" },
  { type: "info", message: "Q2 distribution scheduled for Jun 30" },
];

export function IssuerDashboard() {
  return (
    <section className="relative bg-gradient-to-br from-[#F8FAFC] via-[#F0F4F8] to-[#FAFBFC] py-20 sm:py-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(15, 23, 42) 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Built for compliance officers, not developers
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            An operational dashboard designed for fund administrators and compliance teams.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="flex">
            <div className="hidden md:flex w-56 flex-col border-r border-slate-200 bg-slate-50 p-4">
              <div className="mb-6 px-2">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Token Management</p>
              </div>
              <nav className="space-y-1">
                {sidebarItems.map((item) => (
                  <div
                    key={item.label}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                      item.active
                        ? "bg-sky-50 text-sky-700 font-medium border border-sky-100"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </div>
                ))}
              </nav>
            </div>

            <div className="flex-1 p-6">
              <div className="mb-6">
                <h3 className="font-[family-name:var(--font-heading)] text-lg font-semibold text-slate-900">Investor Registry</h3>
                <p className="text-sm text-slate-500">Manage your token holders and compliance status</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="pb-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Investor</th>
                      <th className="pb-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Holdings</th>
                      <th className="pb-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">KYC Status</th>
                      <th className="pb-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {investors.map((investor) => (
                      <tr key={investor.name}>
                        <td className="py-3 text-sm text-slate-900">{investor.name}</td>
                        <td className="py-3 text-sm font-mono text-slate-700">{investor.holdings}</td>
                        <td className="py-3">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                            investor.kyc === "verified" ? "text-emerald-700" : "text-amber-700"
                          }`}>
                            {investor.kyc === "verified" ? (
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            ) : (
                              <Clock className="h-3.5 w-3.5" />
                            )}
                            {investor.kyc === "verified" ? "Verified" : "Pending"}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                            <span className="h-2 w-2 rounded-full bg-emerald-600" />
                            {investor.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="hidden lg:block w-72 border-l border-slate-200 bg-slate-50 p-4">
              <div className="mb-4">
                <h4 className="font-[family-name:var(--font-heading)] text-sm font-semibold text-slate-900">Compliance Alerts</h4>
              </div>
              <div className="space-y-3">
                {alerts.map((alert, idx) => (
                  <div
                    key={idx}
                    className={`rounded-lg border p-3 ${
                      alert.type === "success"
                        ? "border-emerald-200 bg-emerald-50"
                        : alert.type === "warning"
                        ? "border-amber-200 bg-amber-50"
                        : "border-sky-200 bg-sky-50"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {alert.type === "success" ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5" />
                      ) : alert.type === "warning" ? (
                        <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-sky-600 mt-0.5" />
                      )}
                      <p className={`text-xs ${
                        alert.type === "success"
                          ? "text-emerald-800"
                          : alert.type === "warning"
                          ? "text-amber-800"
                          : "text-sky-800"
                      }`}>
                        {alert.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
