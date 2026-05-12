"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Coins, ShieldCheck, Send, Activity, ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/status-badge";
import { AddressLabel } from "@/components/address-label";

interface Stats {
  totalTokens: number;
  activePolicies: number;
  totalDistributions: number;
  totalTransactions: number;
}

interface RecentTransaction {
  id: string;
  type: string;
  status: string;
  tokenName: string | null;
  tokenSymbol: string | null;
  fromAddress: string | null;
  signature: string;
  createdAt: string;
}

export default function OverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentTx, setRecentTx] = useState<RecentTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, txRes] = await Promise.all([
          fetch("/api/stats"),
          fetch("/api/transactions?limit=10"),
        ]);
        if (statsRes.ok) setStats(await statsRes.json());
        if (txRes.ok) {
          const data = await txRes.json();
          setRecentTx(data.transactions || []);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const kpiCards = [
    {
      title: "Total Tokens",
      value: stats?.totalTokens ?? 0,
      icon: Coins,
      color: "text-sky-400",
      bgColor: "bg-sky-500/10",
      link: "/tokens",
    },
    {
      title: "Active Policies",
      value: stats?.activePolicies ?? 0,
      icon: ShieldCheck,
      color: "text-violet-400",
      bgColor: "bg-violet-500/10",
      link: "/policies",
    },
    {
      title: "Distributions",
      value: stats?.totalDistributions ?? 0,
      icon: Send,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      link: "/distributions",
    },
    {
      title: "Total Transactions",
      value: stats?.totalTransactions ?? 0,
      icon: Activity,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      link: "/activity",
    },
  ];

  const quickActions = [
    { label: "Create Token", href: "/dashboard/tokens/create", primary: true },
    { label: "Create Policy", href: "/dashboard/policies", primary: false },
    { label: "New Distribution", href: "/dashboard/distributions", primary: false },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard Overview</h1>
          <p className="text-sm text-muted-foreground mt-1">Monitor your security tokens and operations</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((kpi) => (
          <Link key={kpi.title} href={kpi.link}>
            <Card className="hover:border-slate-700 transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
                <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                  <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {loading ? <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /> : kpi.value}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Recent Activity */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-foreground">Recent Activity</CardTitle>
                <CardDescription className="text-muted-foreground">Latest on-chain transactions</CardDescription>
              </div>
              <Link href="/dashboard/activity">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : recentTx.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">No transactions yet</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Type</TableHead>
                    <TableHead className="text-muted-foreground">Token</TableHead>
                    <TableHead className="text-muted-foreground hidden md:table-cell">From</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground hidden sm:table-cell">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTx.map((tx) => (
                    <TableRow key={tx.id} className="border-border hover:bg-muted/50">
                      <TableCell>
                        <StatusBadge status={tx.type} />
                      </TableCell>
                      <TableCell className="text-foreground">
                        {tx.tokenName ? `${tx.tokenName} (${tx.tokenSymbol})` : "—"}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {tx.fromAddress ? <AddressLabel address={tx.fromAddress} /> : "—"}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={tx.status} />
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Quick Actions</CardTitle>
            <CardDescription className="text-muted-foreground">Common operations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action) => (
              <Link key={action.label} href={action.href}>
                <Button
                  variant={action.primary ? "default" : "outline"}
                  className="w-full justify-between"
                >
                  {action.label}
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </Link>
            ))}
            <div className="pt-4 border-t border-border">
              <div className="text-xs text-muted-foreground mb-2">Network</div>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <div className="h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
                Solana Devnet
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
