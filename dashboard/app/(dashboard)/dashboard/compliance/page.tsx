"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Scale, Plus, Loader2, Shield, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/status-badge";

interface ComplianceRule {
  id: string;
  tokenId: string;
  ruleType: string;
  ruleConfig: any;
  enabled: boolean | null;
  tokenName: string;
  tokenSymbol: string;
  tokenMintAddress: string;
  createdAt: string;
}

export default function CompliancePage() {
  const [rules, setRules] = useState<ComplianceRule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRules();
  }, []);

  async function fetchRules() {
    setLoading(true);
    try {
      const res = await fetch("/api/compliance/rules?limit=50");
      if (res.ok) {
        const data = await res.json();
        setRules(data.rules || []);
      }
    } catch (err) {
      console.error("Failed to fetch compliance rules:", err);
    } finally {
      setLoading(false);
    }
  }

  const ruleTypeLabels: Record<string, string> = {
    jurisdiction: "Jurisdiction Restriction",
    lockup: "Lockup Period",
    transfer_restriction: "Transfer Restriction",
    kyc_requirement: "KYC Requirement",
  };

  const enabledCount = rules.filter(r => r.enabled).length;
  const disabledCount = rules.filter(r => !r.enabled).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Compliance Engine</h1>
          <p className="text-sm text-slate-600 mt-1">Configure OJK-compliant transfer restrictions</p>
        </div>
        <Link href="/dashboard/compliance/new">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Rule
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-600">Total Rules</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{rules.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-600">Active Rules</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{enabledCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-600">Disabled Rules</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-500">{disabledCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-slate-900">Compliance Rules</CardTitle>
              <CardDescription className="text-slate-600">Transfer restriction rules</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
            </div>
          ) : rules.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 mx-auto text-slate-500 mb-4" />
              <p className="text-slate-600 text-sm">No compliance rules configured</p>
              <p className="text-slate-500 text-xs mt-1">Add rules to restrict transfers based on jurisdiction, KYC, lockup periods, etc.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-slate-600">Rule Type</TableHead>
                  <TableHead className="text-slate-600">Token</TableHead>
                  <TableHead className="text-slate-600">Status</TableHead>
                  <TableHead className="text-slate-600">Configuration</TableHead>
                  <TableHead className="text-slate-600">Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.map((rule) => (
                  <TableRow key={rule.id} className="hover:bg-slate-50">
                    <TableCell>
                      <Badge variant="outline">{ruleTypeLabels[rule.ruleType] || rule.ruleType}</Badge>
                    </TableCell>
                    <TableCell className="text-slate-900">
                      <Link href={`/dashboard/tokens/${rule.tokenMintAddress}`} className="hover:text-sky-600">
                        {rule.tokenName} ({rule.tokenSymbol})
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant={rule.enabled ? "default" : "secondary"}>
                        {rule.enabled ? "Active" : "Disabled"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-600 text-sm max-w-xs truncate">
                      {JSON.stringify(rule.ruleConfig).slice(0, 50)}...
                    </TableCell>
                    <TableCell className="text-slate-600 text-sm">
                      {new Date(rule.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-slate-900">Transfer Simulation</CardTitle>
          <CardDescription className="text-slate-600">Test if a transfer would be allowed</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/dashboard/compliance/simulate">
            <Button variant="outline">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Open Transfer Simulator
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
