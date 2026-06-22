"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Plus, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/status-badge";

interface CorporateAction {
  id: string;
  tokenId: string;
  type: string;
  title: string;
  description: string | null;
  status: string | null;
  executionDate: string | null;
  snapshotDate: string | null;
  totalAmount: string | null;
  tokenName: string;
  tokenSymbol: string;
  tokenMintAddress: string;
  createdAt: string;
}

export default function CorporateActionsPage() {
  const [actions, setActions] = useState<CorporateAction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActions();
  }, []);

  async function fetchActions() {
    setLoading(true);
    try {
      const res = await fetch("/api/corporate-actions?limit=50");
      if (res.ok) {
        const data = await res.json();
        setActions(data.actions || []);
      }
    } catch (err) {
      console.error("Failed to fetch corporate actions:", err);
    } finally {
      setLoading(false);
    }
  }

  const actionTypeLabels: Record<string, string> = {
    dividend: "Dividend",
    vote: "Vote",
    buyback: "Buyback",
    snapshot: "Snapshot",
    forced_transfer: "Forced Transfer",
  };

  const statusCounts = {
    pending: actions.filter(a => a.status === "pending").length,
    active: actions.filter(a => a.status === "active").length,
    completed: actions.filter(a => a.status === "completed").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Corporate Actions</h1>
          <p className="text-sm text-slate-600 mt-1">Manage dividends, votes, and other corporate actions</p>
        </div>
        <Link href="/dashboard/corporate-actions/new">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Action
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-600">Total Actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{actions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-600">Pending</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-600">Completed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{statusCounts.completed}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-slate-900">All Actions</CardTitle>
              <CardDescription className="text-slate-600">Corporate action history</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
            </div>
          ) : actions.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">No corporate actions found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-slate-600">Type</TableHead>
                  <TableHead className="text-slate-600">Title</TableHead>
                  <TableHead className="text-slate-600">Token</TableHead>
                  <TableHead className="text-slate-600">Status</TableHead>
                  <TableHead className="text-slate-600">Execution Date</TableHead>
                  <TableHead className="text-slate-600">Amount</TableHead>
                  <TableHead className="text-slate-600">Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {actions.map((action) => (
                  <TableRow key={action.id} className="hover:bg-slate-50">
                    <TableCell>
                      <Badge variant="outline">{actionTypeLabels[action.type] || action.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Link href={`/dashboard/corporate-actions/${action.id}`} className="hover:text-sky-600 text-slate-900 font-medium">
                        {action.title}
                      </Link>
                    </TableCell>
                    <TableCell className="text-slate-900">
                      <Link href={`/dashboard/tokens/${action.tokenMintAddress}`} className="hover:text-sky-600">
                        {action.tokenName} ({action.tokenSymbol})
                      </Link>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={action.status || "pending"} />
                    </TableCell>
                    <TableCell className="text-slate-600 text-sm">
                      {action.executionDate ? new Date(action.executionDate).toLocaleDateString() : "—"}
                    </TableCell>
                    <TableCell className="text-slate-900">
                      {action.totalAmount || "—"}
                    </TableCell>
                    <TableCell className="text-slate-600 text-sm">
                      {new Date(action.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
