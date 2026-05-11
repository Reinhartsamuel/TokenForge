import { CheckCircle2, Loader2, Circle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const roadmap = [
  {
    version: "v1.0",
    title: "Canonical Migration",
    status: "completed",
    date: "Apr 2026",
    description: "Canonical-first migration, FAMP rework, spec updates",
  },
  {
    version: "v1.1",
    title: "TypeScript SDK",
    status: "completed",
    date: "May 2026",
    description: "3-layer SDK architecture, 13 workflow functions",
  },
  {
    version: "v1.2",
    title: "Integration Tests",
    status: "completed",
    date: "May 2026",
    description: "23 tests passing, program builds, test runner",
  },
  {
    version: "v1.3",
    title: "Dashboard Completion",
    status: "in-progress",
    date: "May-Jun 2026",
    description: "Complete issuer UI, policy-oracle event handling",
  },
  {
    version: "v2.0",
    title: "Enterprise Controls",
    status: "planned",
    date: "Q3 2026",
    description: "Managed enterprise controls, reporting, integrations",
  },
];

const statusConfig = {
  completed: {
    icon: CheckCircle2,
    color: "#14F195",
    label: "Complete",
  },
  "in-progress": {
    icon: Loader2,
    color: "#9945FF",
    label: "In Progress",
  },
  planned: {
    icon: Circle,
    color: "#8B8BA7",
    label: "Planned",
  },
};

export function RoadmapSection() {
  return (
    <section className="py-24 bg-[#0F0F23]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Product{" "}
            <span className="text-[#9945FF]">Roadmap</span>
          </h2>
          <p className="mt-4 text-lg text-[#8B8BA7] max-w-2xl mx-auto">
            Our journey from canonical migration to enterprise-ready security token platform.
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-800 md:-translate-x-0.5" />

          <div className="space-y-8">
            {roadmap.map((item, index) => {
              const config = statusConfig[item.status as keyof typeof statusConfig];
              const Icon = config.icon;
              const isLeft = index % 2 === 0;

              return (
                <div
                  key={item.version}
                  className={`relative flex flex-col md:flex-row ${
                    isLeft ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 z-10">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-full border-2"
                      style={{ borderColor: config.color, backgroundColor: "#0F0F23" }}
                    >
                      <Icon
                        className="h-4 w-4"
                        style={{ color: config.color }}
                        {...(item.status === "in-progress" ? { className: "h-4 w-4 animate-spin" } : {})}
                      />
                    </div>
                  </div>

                  <div className={`flex-1 ${isLeft ? "md:pr-12 md:text-right" : "md:pl-12"} pl-12 md:pl-0`}>
                    <Card className="border-slate-800 bg-[#1A1A3E]/50 hover:border-[#14F195]/30 transition-colors inline-block">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className="text-sm font-bold"
                            style={{ color: config.color }}
                          >
                            {item.version}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-[#8B8BA7]">
                            {config.label}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
                        <p className="text-sm text-[#8B8BA7]">{item.description}</p>
                        <div className="mt-2 text-xs text-[#8B8BA7]">{item.date}</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="flex-1 hidden md:block" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
