"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { AddressLabel } from "@/components/address-label";
import { toast } from "sonner";
import { isValidAddress } from "@/lib/address";

interface PolicyData {
  mintAddress: string;
  allowlistMode: boolean;
  allowlist: string[];
  blocklist: string[];
}

export default function PolicyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const mintAddress = params.mintAddress as string;

  const [policy, setPolicy] = useState<PolicyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [walletAddress, setWalletAddress] = useState("");
  const [allowlistMode, setAllowlistMode] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchPolicy();
  }, [mintAddress]);

  const fetchPolicy = async () => {
    try {
      const res = await fetch("/api/famp-policy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getPolicy", mintAddress }),
      });
      const data = await res.json();
      if (data.policy) {
        setPolicy(data.policy);
        setAllowlistMode(data.policy.allowlistMode || false);
      }
    } catch (err) {
      console.error("Failed to fetch policy:", err);
    } finally {
      setLoading(false);
    }
  };

  const executeAction = async (action: string, extraData?: Record<string, string>) => {
    if (!mintAddress) {
      toast.error("Mint address is required");
      return;
    }

    setActionLoading(action);
    try {
      const res = await fetch("/api/famp-policy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, mintAddress, ...extraData }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Action failed");
        return;
      }

      toast.success(`${action} successful`);
      await fetchPolicy();
    } catch (error: any) {
      toast.error(error.message || "Unknown error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleAddToAllowlist = () => {
    if (!isValidAddress(walletAddress)) {
      toast.error("Invalid wallet address");
      return;
    }
    executeAction("addToAllowlist", { wallet: walletAddress });
    setWalletAddress("");
  };

  const handleAddToBlocklist = () => {
    if (!isValidAddress(walletAddress)) {
      toast.error("Invalid wallet address");
      return;
    }
    executeAction("addToBlocklist", { wallet: walletAddress });
    setWalletAddress("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/policies">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Policy Management</h1>
          <p className="text-sm text-slate-400">
            <AddressLabel address={mintAddress} />
          </p>
        </div>
      </div>

      <Card className="border-slate-800 bg-slate-900/50">
        <CardHeader>
          <CardTitle className="text-white">Policy Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!policy ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Switch
                  id="allowlist-mode"
                  checked={allowlistMode}
                  onCheckedChange={setAllowlistMode}
                />
                <Label htmlFor="allowlist-mode">Allowlist Only Mode</Label>
              </div>
              <Button
                onClick={() => executeAction("create", { allowlistMode: String(allowlistMode) })}
                disabled={actionLoading !== null}
              >
                {actionLoading === "create" ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Create Policy
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="text-sm text-slate-400">
                Mode: <span className="text-white">{policy.allowlistMode ? "Allowlist" : "Blocklist"}</span>
              </div>
              <div className="text-sm text-slate-400">
                Allowlist: <span className="text-white">{policy.allowlist?.length || 0}</span>
              </div>
              <div className="text-sm text-slate-400">
                Blocklist: <span className="text-white">{policy.blocklist?.length || 0}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {policy && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Allowlist */}
          <Card className="border-slate-800 bg-slate-900/50">
            <CardHeader>
              <CardTitle className="text-white text-lg">Allowlist</CardTitle>
              <CardDescription className="text-slate-400">Approved wallets</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="Enter wallet address..."
                  className="border-slate-700 bg-slate-800"
                />
                <Button onClick={handleAddToAllowlist} disabled={actionLoading !== null || !walletAddress}>
                  {actionLoading === "addToAllowlist" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                </Button>
              </div>
              {policy.allowlist && policy.allowlist.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {policy.allowlist.map((addr) => (
                    <div key={addr} className="flex items-center justify-between p-2 bg-slate-800 rounded">
                      <AddressLabel address={addr} />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => executeAction("removeFromAllowlist", { wallet: addr })}
                        disabled={actionLoading !== null}
                      >
                        <Trash2 className="h-3 w-3 text-red-400" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-sm text-center py-4">Empty</p>
              )}
            </CardContent>
          </Card>

          {/* Blocklist */}
          <Card className="border-slate-800 bg-slate-900/50">
            <CardHeader>
              <CardTitle className="text-white text-lg">Blocklist</CardTitle>
              <CardDescription className="text-slate-400">Blocked wallets</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="Enter wallet address..."
                  className="border-slate-700 bg-slate-800"
                />
                <Button variant="destructive" onClick={handleAddToBlocklist} disabled={actionLoading !== null || !walletAddress}>
                  {actionLoading === "addToBlocklist" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                </Button>
              </div>
              {policy.blocklist && policy.blocklist.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {policy.blocklist.map((addr) => (
                    <div key={addr} className="flex items-center justify-between p-2 bg-slate-800 rounded">
                      <AddressLabel address={addr} />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => executeAction("removeFromBlocklist", { wallet: addr })}
                        disabled={actionLoading !== null}
                      >
                        <Trash2 className="h-3 w-3 text-red-400" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-sm text-center py-4">Empty</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
