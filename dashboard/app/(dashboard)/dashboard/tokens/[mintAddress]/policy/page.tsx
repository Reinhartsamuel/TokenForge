"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, ShieldCheck, UserPlus, UserMinus, Ban, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AddressLabel } from "@/components/address-label";
import { StatusBadge } from "@/components/status-badge";
import { toast } from "sonner";

interface PolicyState {
  mint: string;
  issuerAuthority: string;
  allowlistMode: boolean;
  allowlist: string[];
  blocklist: string[];
  allowlistCount: number;
  blocklistCount: number;
}

export default function PolicyPage() {
  const params = useParams();
  const router = useRouter();
  const mintAddress = params.mintAddress as string;

  const [policy, setPolicy] = useState<PolicyState | null>(null);
  const [policyExists, setPolicyExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [allowlistMode, setAllowlistMode] = useState(true);
  const [walletAddress, setWalletAddress] = useState("");

  const fetchPolicy = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/famp-policy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getPolicy", mintAddress }),
      });
      const data = await res.json();
      setPolicyExists(data.policyExists);
      if (data.policyExists) {
        setPolicy(data.policy);
        setAllowlistMode(data.policy.allowlistMode);
      }
    } catch (err) {
      console.error("Failed to fetch policy:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicy();
  }, [mintAddress]);

  const executeAction = async (action: string, extraData?: Record<string, any>) => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/famp-policy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, mintAddress, ...extraData }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(`Failed: ${data.error}`);
        return;
      }

      toast.success(`${action} completed`);

      // Record transaction in DB
      try {
        await fetch("/api/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            signature: data.signature,
            type: action,
            status: "confirmed",
            explorerUrl: data.explorerUrl,
          }),
        });
      } catch {}

      await fetchPolicy();
    } catch (error: any) {
      toast.error(error.message || "Unknown error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreatePolicy = () => {
    executeAction("create", { allowlistMode });
  };

  const handleAddToAllowlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAddress) return;
    executeAction("addToAllowlist", { wallet: walletAddress });
    setWalletAddress("");
  };

  const handleRemoveFromAllowlist = (wallet: string) => {
    executeAction("removeFromAllowlist", { wallet });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
      </div>
    );
  }

  if (!policyExists) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/tokens/${mintAddress}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">FAMP Policy</h1>
            <p className="text-sm text-slate-400 mt-1">Create a compliance policy for this token</p>
          </div>
        </div>

        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-white">Create Policy</CardTitle>
            <CardDescription className="text-slate-400">
              Create an allowlist or blocklist policy for transfer gating.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>Token</Label>
              <Input value={mintAddress} disabled className="bg-slate-800 mt-1" />
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
              <div>
                <div className="text-sm font-medium text-white">Allowlist Mode</div>
                <div className="text-xs text-slate-400">
                  {allowlistMode ? "Only allowlisted wallets can hold tokens" : "All wallets allowed except blocklisted"}
                </div>
              </div>
              <Switch checked={allowlistMode} onCheckedChange={setAllowlistMode} />
            </div>
            <Button
              onClick={handleCreatePolicy}
              disabled={actionLoading}
              className="w-full"
            >
              {actionLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <ShieldCheck className="h-4 w-4 mr-2" />}
              {actionLoading ? "Creating..." : "Create Policy"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/tokens/${mintAddress}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">FAMP Policy</h1>
          <p className="text-sm text-slate-400 mt-1">
            {policy?.allowlistMode ? "Allowlist Mode" : "Blocklist Mode"} · {policy?.allowlistCount} allowlisted · {policy?.blocklistCount} blocklisted
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={fetchPolicy} disabled={loading} className="ml-auto">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Allowlist Section */}
      <Card className="border-slate-800 bg-slate-900/50">
        <CardHeader>
          <CardTitle className="text-white">Allowlist</CardTitle>
          <CardDescription className="text-slate-400">
            {policy?.allowlistMode
              ? "Only these wallets are permitted to hold tokens"
              : "Wallets explicitly allowed (currently in blocklist mode)"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleAddToAllowlist} className="flex gap-3">
            <Input
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="Wallet address to allow..."
              className="flex-1"
            />
            <Button type="submit" disabled={actionLoading || !walletAddress}>
              {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
              Add
            </Button>
          </form>
          {policy && policy.allowlist.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-transparent">
                  <TableHead className="text-slate-400">Wallet</TableHead>
                  <TableHead className="text-slate-400 w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {policy.allowlist.map((wallet, i) => (
                  <TableRow key={i} className="border-slate-800 hover:bg-slate-800/50">
                    <TableCell><AddressLabel address={wallet} /></TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFromAllowlist(wallet)}
                        disabled={actionLoading}
                      >
                        <UserMinus className="h-4 w-4 text-red-400" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-slate-500">No wallets in allowlist</p>
          )}
        </CardContent>
      </Card>

      {/* Policy Info Card */}
      <Card className="border-slate-800 bg-slate-900/50">
        <CardHeader>
          <CardTitle className="text-white">Policy Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Mode</span>
            <Badge variant={policy?.allowlistMode ? "default" : "secondary"}>
              {policy?.allowlistMode ? "Allowlist" : "Blocklist"}
            </Badge>
          </div>
          {policy?.blocklist && policy.blocklist.length > 0 && (
            <div>
              <div className="text-sm text-slate-400 mb-2">Blocklist</div>
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-800 hover:bg-transparent">
                    <TableHead className="text-slate-400">Wallet</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {policy.blocklist.map((wallet, i) => (
                    <TableRow key={i} className="border-slate-800 hover:bg-slate-800/50">
                      <TableCell><AddressLabel address={wallet} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
