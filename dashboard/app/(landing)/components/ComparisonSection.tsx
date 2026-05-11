import { Check, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const competitors = [
  {
    name: "TokenForge",
    ssts: true,
    openSource: true,
    solanaNative: true,
    sdkAndDashboard: true,
    isHighlighted: true,
  },
  {
    name: "Securitize",
    ssts: false,
    openSource: false,
    solanaNative: false,
    sdkAndDashboard: true,
    isHighlighted: false,
  },
  {
    name: "Polymath",
    ssts: false,
    openSource: true,
    solanaNative: false,
    sdkAndDashboard: true,
    isHighlighted: false,
  },
  {
    name: "Manual Build",
    ssts: true,
    openSource: false,
    solanaNative: true,
    sdkAndDashboard: false,
    isHighlighted: false,
  },
  {
    name: "Hackathon Projects",
    ssts: false,
    openSource: true,
    solanaNative: true,
    sdkAndDashboard: false,
    isHighlighted: false,
  },
];

const columns = [
  { key: "ssts", label: "SSTS Compliant" },
  { key: "openSource", label: "Open Source" },
  { key: "solanaNative", label: "Solana Native" },
  { key: "sdkAndDashboard", label: "SDK + Dashboard" },
];

export function ComparisonSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-[#0F0F23] to-[#1A1A3E]/30">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Competitive{" "}
            <span className="text-[#9945FF]">Comparison</span>
          </h2>
          <p className="mt-4 text-lg text-[#8B8BA7] max-w-2xl mx-auto">
            See how TokenForge compares to other solutions in the security token space.
          </p>
        </div>

        <Card className="border-slate-800 bg-[#1A1A3E]/50">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left py-4 px-6 text-sm font-semibold text-[#8B8BA7]">
                      Solution
                    </th>
                    {columns.map((col) => (
                      <th
                        key={col.key}
                        className="text-center py-4 px-6 text-sm font-semibold text-[#8B8BA7]"
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {competitors.map((competitor) => (
                    <tr
                      key={competitor.name}
                      className={`border-b border-slate-800 ${
                        competitor.isHighlighted
                          ? "bg-[#14F195]/5"
                          : ""
                      }`}
                    >
                      <td className="py-4 px-6">
                        <span
                          className={`font-semibold ${
                            competitor.isHighlighted
                              ? "text-[#14F195]"
                              : "text-white"
                          }`}
                        >
                          {competitor.name}
                        </span>
                      </td>
                      {columns.map((col) => (
                        <td key={col.key} className="text-center py-4 px-6">
                          {competitor[col.key as keyof typeof competitor] ? (
                            <Check className="h-5 w-5 text-[#14F195] mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-red-500 mx-auto" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
