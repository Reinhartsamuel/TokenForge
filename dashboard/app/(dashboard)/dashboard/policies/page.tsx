"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/status-badge";
import { AddressLabel } from "@/components/address-label";

interface Policy {
  id: string;
  tokenName: string | null;
  tokenSymbol: string | null;
  mintAddress: string;
  allowlistMode: boolean;
  allowlistCount: number;
  blocklistCount: number;
  updatedAt: string;
}

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/tokens")
      .then((res) => res.json())
      .then((data) => {
        const tokens = data.tokens || [];
        const policyData: Policy[] = tokens.map((t: any) => ({
          id: t.id,
          tokenName: t.name,
          tokenSymbol: t.symbol,
          mintAddress: t.mintAddress,
          allowlistMode: false,
          allowlistCount: 0,
          blocklistCount: 0,
          updatedAt: t.createdAt,
        }));
        setPolicies(policyData);
      })
      .catch((err) => console.error("Failed to fetch policies:", err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = policies.filter(
    (p) =>
      p.tokenName?.toLowerCase().includes(search.toLowerCase()) ||
      p.tokenSymbol?.toLowerCase().includes(search.toLowerCase()) ||
      p.mintAddress.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Policies</h1>
        <p className="text-sm text-slate-600 mt-1">Manage FAMP allowlist and blocklist policies</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-slate-900">All Policies</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search policies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <ShieldCheck className="h-12 w-12 mx-auto text-slate-400 mb-3" />
              <p className="text-slate-600 mb-4">No tokens available for policy management</p>
              <Link href="/dashboard/tokens/create">
                <Button size="sm">Create a token first</Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-slate-600">Token</TableHead>
                  <TableHead className="text-slate-600 hidden md:table-cell">Mint Address</TableHead>
                  <TableHead className="text-slate-600">Mode</TableHead>
                  <TableHead className="text-slate-600">Allowlist</TableHead>
                  <TableHead className="text-slate-600">Blocklist</TableHead>
                  <TableHead className="text-slate-600 hidden sm:table-cell">Updated</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((policy) => (
                  <TableRow key={policy.id} className="hover:bg-slate-50">
                    <TableCell>
                      <div>
                        <div className="font-medium text-slate-900">{policy.tokenName}</div>
                        <div className="text-sm text-slate-500">{policy.tokenSymbol}</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <AddressLabel address={policy.mintAddress} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={policy.allowlistMode ? "allowlist" : "blocklist"} />
                    </TableCell>
                    <TableCell className="text-slate-700">{policy.allowlistCount}</TableCell>
                    <TableCell className="text-slate-700">{policy.blocklistCount}</TableCell>
                    <TableCell className="hidden sm:table-cell text-slate-600 text-sm">
                      {new Date(policy.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Link href={`/dashboard/policies/${policy.mintAddress}`}>
                        <Button variant="ghost" size="sm">Manage</Button>
                      </Link>
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
