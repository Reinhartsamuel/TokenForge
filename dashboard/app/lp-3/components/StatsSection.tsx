const stats = [
  {
    value: "$88B",
    label: "by 2030 (Project Wira)",
  },
  {
    value: "21M+",
    label: "ready to move from crypto to real assets",
  },
  {
    value: "IDR 650T",
    label: "in 2024 — and growing",
  },
  {
    value: "4",
    label: "sandbox projects already passed — yours could be next",
  },
];

export function StatsSection() {
  return (
    <section className="bg-gradient-to-br from-[#F0F9FF] via-[#F8FAFC] to-[#EFF6FF] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <p className="text-sm font-semibold text-sky-700 uppercase tracking-wider mb-2">
            The numbers tell the story — but only if you act now.
          </p>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            The Indonesian digital asset market is ready
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            With strong regulatory support and growing institutional adoption, the time to tokenize is now.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <p className="font-[family-name:var(--font-heading)] text-4xl font-bold text-sky-700 sm:text-5xl">{stat.value}</p>
              <p className="mt-2 text-sm text-slate-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
