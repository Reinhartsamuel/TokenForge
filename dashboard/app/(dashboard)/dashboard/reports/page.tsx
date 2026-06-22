"use client";

import { useState } from "react";
import Link from "next/link";
import { BarChart3, Download, FileText, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ReportsPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const reportTypes = [
    {
      id: "regulatory",
      title: "Regulatory Report",
      description: "OJK-compliant regulatory reporting",
      icon: FileText,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      id: "investor",
      title: "Investor Statement",
      description: "Individual investor holdings and transactions",
      icon: FileText,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      id: "distribution",
      title: "Distribution Report",
      description: "Dividend and distribution history",
      icon: FileText,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
    },
    {
      id: "audit",
      title: "Audit Trail",
      description: "Complete transaction audit log",
      icon: FileText,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      id: "nav",
      title: "NAV History",
      description: "Net asset value historical report",
      icon: BarChart3,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
    },
    {
      id: "cap-table",
      title: "Cap Table Export",
      description: "Complete ownership structure",
      icon: FileText,
      color: "text-pink-400",
      bgColor: "bg-pink-500/10",
    },
  ];

  async function handleGenerateReport(reportId: string) {
    setLoading(reportId);
    try {
      toast.info("Generating report...");
      setTimeout(() => {
        toast.success("Report generated successfully");
        setLoading(null);
      }, 2000);
    } catch (err) {
      toast.error("Failed to generate report");
      setLoading(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Reports</h1>
          <p className="text-sm text-slate-600 mt-1">Generate regulatory and operational reports</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reportTypes.map((report) => (
          <Card key={report.id} className="hover:border-slate-300 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${report.bgColor}`}>
                  <report.icon className={`h-5 w-5 ${report.color}`} />
                </div>
                <div>
                  <CardTitle className="text-slate-900 text-base">{report.title}</CardTitle>
                  <CardDescription className="text-slate-600 text-sm">{report.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleGenerateReport(report.id)}
                disabled={loading === report.id}
              >
                {loading === report.id ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Generate Report
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-slate-900">Recent Reports</CardTitle>
          <CardDescription className="text-slate-600">Previously generated reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-slate-500 text-sm">
            No reports generated yet
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
