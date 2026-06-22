"use client";

import Link from "next/link";
import { ArrowLeftRight, Users, FileText, AlertTriangle, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TransferAgentPage() {
  const workflows = [
    {
      id: "subscriptions",
      title: "Subscriptions",
      description: "Process investor subscription requests",
      icon: Users,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      href: "/dashboard/transfer-agent/subscriptions",
      count: 0,
    },
    {
      id: "redemptions",
      title: "Redemptions",
      description: "Handle redemption requests",
      icon: FileText,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      href: "/dashboard/transfer-agent/redemptions",
      count: 0,
    },
    {
      id: "recovery",
      title: "Lost Wallet Recovery",
      description: "Recover tokens from lost wallets",
      icon: AlertTriangle,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      href: "/dashboard/transfer-agent/recovery",
      count: 0,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Transfer Agent</h1>
          <p className="text-sm text-slate-600 mt-1">Manage subscriptions, redemptions, and wallet recovery</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-600">Pending Requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-600">Processed Today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-600">Recovery Cases</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">0</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {workflows.map((workflow) => (
          <Link key={workflow.id} href={workflow.href}>
            <Card className="hover:border-slate-300 transition-colors cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${workflow.bgColor}`}>
                    <workflow.icon className={`h-5 w-5 ${workflow.color}`} />
                  </div>
                  <div>
                    <CardTitle className="text-slate-900 text-base">{workflow.title}</CardTitle>
                    <CardDescription className="text-slate-600 text-sm">{workflow.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">{workflow.count} pending</span>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-slate-900">Recent Activity</CardTitle>
          <CardDescription className="text-slate-600">Recent transfer agent operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-slate-500 text-sm">
            No recent activity
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
