"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Send, Plus, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/status-badge";
import { AddressLabel } from "@/components/address-label";

interface Distribution {
  id: string;
  tokenName: string | null;
  tokenSymbol: string | null;
  mintAddress: string;
  merkleRoot: string;
  actionId: number;
  status: string;
  totalClaimed: string;
  totalClaimants: number;
  createdAt: string;
}

export default function DistributionsPage() {
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/tokens")
      .then((res) => res.json())
      .then((data) => {
        const tokens = data.tokens || [];
        const distData: Distribution[] = tokens.map((t: any) => ({
          id: t.id,
          tokenName: t.name,
          tokenSymbol: t.symbol,
          mintAddress: t.mintAddress,
          merkleRoot: "0x" + "0".repeat(64),
          actionId: 0,
          status: "active",
          totalClaimed: "0",
          totalClaimants: 0,
          createdAt: t.createdAt,
        }));
        setDistributions(distData);
      })
      .catch((err) => console.error("Failed to fetch distributions:", err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = distributions.filter(
    (d) =>
      d.tokenName?.toLowerCase().includes(search.toLowerCase()) ||
      d.tokenSymbol?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Distributions</h1>
          <p className="text-sm text-slate-600 mt-1">Manage token distributions and claims</p>
        </div>
        <Link href="/dashboard/distributions/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Distribution
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-slate-900">All Distributions</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search distributions..."
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
              <Send className="h-12 w-12 mx-auto text-slate-400 mb-3" />
              <p className="text-slate-600 mb-4">No distributions yet</p>
              <Link href="/dashboard/distributions/create">
                <Button size="sm">Create your first distribution</Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-slate-600">Token</TableHead>
                  <TableHead className="text-slate-600 hidden md:table-cell">Merkle Root</TableHead>
                  <TableHead className="text-slate-600">Action ID</TableHead>
                  <TableHead className="text-slate-600">Status</TableHead>
                  <TableHead className="text-slate-600 hidden sm:table-cell">Claimants</TableHead>
                  <TableHead className="text-slate-600 hidden sm:table-cell">Created</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((dist) => (
                  <TableRow key={dist.id} className="hover:bg-slate-50">
                    <TableCell>
                      <div>
                        <div className="font-medium text-slate-900">{dist.tokenName}</div>
                        <div className="text-sm text-slate-500">{dist.tokenSymbol}</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <AddressLabel address={dist.merkleRoot} chars={8} />
                    </TableCell>
                    <TableCell className="text-slate-700">{dist.actionId}</TableCell>
                    <TableCell>
                      <StatusBadge status={dist.status} />
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-slate-600">{dist.totalClaimants}</TableCell>
                    <TableCell className="hidden sm:table-cell text-slate-600 text-sm">
                      {new Date(dist.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Link href={`/dashboard/distributions/${dist.id}`}>
                        <Button variant="ghost" size="sm">View</Button>
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
