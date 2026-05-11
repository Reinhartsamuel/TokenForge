"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { TransactionResult } from "@/components/ui/transaction-result";

interface PolicyData {
  mint: string;
  issuerAuthority: string;
  allowlistMode: boolean;
  allowlist: string[];
  blocklist: string[];
  allowlistCount: number;
  blocklistCount: number;
}

type Tab = "create" | "allowlist" | "blocklist";

export function FampPolicyForm() {
  const [mintAddress, setMintAddress] = useState("");
  const [allowlistMode, setAllowlistMode] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("create");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [success, setSuccess] = useState(false);
  const [signature, setSignature] = useState("");
  const [policy, setPolicy] = useState<PolicyData | null>(null);

  const fetchPolicy = async (mint: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/famp-policy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getPolicy", mintAddress: mint }),
      });
      const data = await res.json();
      if (data.policyExists) {
        setPolicy(data.policy);
      } else {
        setPolicy(null);
      }
    } catch (error: any) {
      console.error("Fetch policy error:", error);
    } finally {
      setLoading(false);
    }
  };

  const executeAction = async (action: string, extraData?: Record<string, string>) => {
    if (!mintAddress) {
      setResult("Mint address is required");
      setSuccess(false);
      return;
    }

    setLoading(true);
    setResult("");
    setSuccess(false);
    setSignature("");

    try {
      const res = await fetch("/api/famp-policy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, mintAddress, ...extraData }),
      });
      const data = await res.json();

      if (!res.ok) {
        setResult(`Error: ${data.error}`);
        setSuccess(false);
        return;
      }

      setSuccess(true);
      setSignature(data.signature);
      setResult(`${action} successful\nSignature: ${data.signature}`);
      await fetchPolicy(mintAddress);
    } catch (error: any) {
      console.error("FAMP action error:", error);
      setResult(error.message || "Unknown error");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "create", label: "Create Policy" },
    { key: "allowlist", label: "Allowlist" },
    { key: "blocklist", label: "Blocklist" },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="famp-mint">Token Mint Address</Label>
        <div className="flex gap-2">
          <Input
            id="famp-mint"
            value={mintAddress}
            onChange={(e) => setMintAddress(e.target.value)}
            placeholder="Enter mint address..."
          />
          <Button variant="outline" onClick={() => fetchPolicy(mintAddress)} disabled={!mintAddress || loading}>
            Load Policy
          </Button>
        </div>
      </div>

      {policy && (
        <div className="p-3 bg-slate-900 rounded-lg text-sm space-y-1">
          <div>Allowlist Mode: <span className="text-green-400">{policy.allowlistMode ? "ON" : "OFF"}</span></div>
          <div>Allowlist ({policy.allowlistCount}): {policy.allowlist.length > 0 ? policy.allowlist.join(", ") : "empty"}</div>
          <div>Blocklist ({policy.blocklistCount}): {policy.blocklist.length > 0 ? policy.blocklist.join(", ") : "empty"}</div>
        </div>
      )}

      <div className="flex gap-1 bg-slate-800 p-1 rounded-lg">
        {tabs.map((tab) => (
          <Button
            key={tab.key}
            variant={activeTab === tab.key ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab(tab.key)}
            className="flex-1"
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {activeTab === "create" && (
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
            disabled={loading || !mintAddress}
            className="w-full"
          >
            {loading ? "Creating..." : "Create Policy"}
          </Button>
        </div>
      )}

      {activeTab === "allowlist" && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="allowlist-wallet">Wallet Address</Label>
            <Input
              id="allowlist-wallet"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="Enter wallet address..."
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => { executeAction("addToAllowlist", { wallet: walletAddress }); setWalletAddress(""); }}
              disabled={loading || !walletAddress}
              className="flex-1"
            >
              {loading ? "Adding..." : "Add to Allowlist"}
            </Button>
            <Button
              variant="destructive"
              onClick={() => { executeAction("removeFromAllowlist", { wallet: walletAddress }); setWalletAddress(""); }}
              disabled={loading || !walletAddress}
              className="flex-1"
            >
              {loading ? "Removing..." : "Remove"}
            </Button>
          </div>
        </div>
      )}

      {activeTab === "blocklist" && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="blocklist-wallet">Wallet Address</Label>
            <Input
              id="blocklist-wallet"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="Enter wallet address..."
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => { executeAction("addToBlocklist", { wallet: walletAddress }); setWalletAddress(""); }}
              disabled={loading || !walletAddress}
              className="flex-1"
            >
              {loading ? "Adding..." : "Add to Blocklist"}
            </Button>
            <Button
              variant="destructive"
              onClick={() => { executeAction("removeFromBlocklist", { wallet: walletAddress }); setWalletAddress(""); }}
              disabled={loading || !walletAddress}
              className="flex-1"
            >
              {loading ? "Removing..." : "Remove"}
            </Button>
          </div>
        </div>
      )}

      <TransactionResult
        success={success}
        message={result}
        signature={signature}
        cluster="devnet"
      />
    </div>
  );
}
