"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/status-badge";
import { AddressLabel } from "@/components/address-label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

export default function DistributionDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [distribution, setDistribution] = useState<Distribution | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tokens")
      .then((res) => res.json())
      .then((data) => {
        const tokens = data.tokens || [];
        if (tokens.length > 0) {
          const t = tokens[0];
          setDistribution({
            id,
            tokenName: t.name,
            tokenSymbol: t.symbol,
            mintAddress: t.mintAddress,
            merkleRoot: "0x" + "0".repeat(64),
            actionId: 0,
            status: "active",
            totalClaimed: "0",
            totalClaimants: 0,
            createdAt: t.createdAt,
          });
        }
      })
      .catch((err) => console.error("Failed to fetch distribution:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
      </div>
    );
  }

  if (!distribution) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Distribution not found</p>
        <Link href="/dashboard/distributions">
          <Button variant="link">Back to distributions</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/distributions">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              {distribution.tokenName} Distribution
            </h1>
            <p className="text-sm text-slate-400">Action ID: {distribution.actionId}</p>
          </div>
        </div>
        <StatusBadge status={distribution.status} />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-400">Mint Address</CardDescription>
          </CardHeader>
          <CardContent>
            <AddressLabel address={distribution.mintAddress} chars={6} />
          </CardContent>
        </Card>
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-400">Merkle Root</CardDescription>
          </CardHeader>
          <CardContent>
            <AddressLabel address={distribution.merkleRoot} chars={8} />
          </CardContent>
        </Card>
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-400">Total Claimed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold text-white">{distribution.totalClaimed}</div>
          </CardContent>
        </Card>
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-400">Claimants</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold text-white">{distribution.totalClaimants}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="claims" className="w-full">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="claims" className="data-[state=active]:bg-slate-700">Claims</TabsTrigger>
          <TabsTrigger value="details" className="data-[state=active]:bg-slate-700">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="claims" className="mt-4">
          <Card className="border-slate-800 bg-slate-900/50">
            <CardHeader>
              <CardTitle className="text-white">Claim History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-500 text-sm py-4">No claims recorded yet. Create claims through the API.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="mt-4">
          <Card className="border-slate-800 bg-slate-900/50">
            <CardHeader>
              <CardTitle className="text-white">Distribution Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-slate-400">Status</div>
                  <StatusBadge status={distribution.status} />
                </div>
                <div>
                  <div className="text-sm text-slate-400">Created</div>
                  <div className="text-white">{new Date(distribution.createdAt).toLocaleString()}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
