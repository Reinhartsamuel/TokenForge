"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Send, Plus, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddressLabel } from "@/components/address-label";
import { toast } from "sonner";

interface Token {
  id: string;
  mintAddress: string;
  name: string;
  symbol: string;
}

export default function CreateDistributionPage() {
  const router = useRouter();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [selectedToken, setSelectedToken] = useState("");
  const [selectedTokenName, setSelectedTokenName] = useState("");
  const [merkleRoot, setMerkleRoot] = useState("");
  const [escrowAccount, setEscrowAccount] = useState("");
  const [actionId, setActionId] = useState("0");
  const [loading, setLoading] = useState(false);
  const [tokensLoading, setTokensLoading] = useState(true);

  // Claim form state
  const [claimTokenAddress, setClaimTokenAddress] = useState("");
  const [claimantAddress, setClaimantAddress] = useState("");
  const [claimAmount, setClaimAmount] = useState("");
  const [claimMerkleRoot, setClaimMerkleRoot] = useState("");
  const [claimActionId, setClaimActionId] = useState("0");
  const [leafIndex, setLeafIndex] = useState("0");
  const [proofHex1, setProofHex1] = useState("");
  const [proofHex2, setProofHex2] = useState("");
  const [claimLoading, setClaimLoading] = useState(false);

  useEffect(() => {
    fetch("/api/tokens")
      .then((res) => res.json())
      .then((data) => setTokens(data.tokens || []))
      .catch(() => {})
      .finally(() => setTokensLoading(false));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const mintAddr = selectedToken || claimTokenAddress;
    if (!mintAddr || !merkleRoot) {
      toast.error("Token and Merkle root are required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/distribution", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          mintAddress: mintAddr,
          merkleRoot,
          escrowTokenAccount: escrowAccount || undefined,
          actionId: parseInt(actionId) || 0,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(`Failed: ${data.error}`);
        return;
      }

      // Record transaction in DB
      try {
        await fetch("/api/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            signature: data.signature,
            type: "create_distribution",
            status: "confirmed",
            explorerUrl: data.explorerUrl,
          }),
        });
      } catch {}

      toast.success(`Distribution escrow created at ${data.escrowTokenAccount}`);
      router.push("/dashboard/distributions");
    } catch (error: any) {
      toast.error(error.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    const mintAddr = claimTokenAddress || selectedToken;
    if (!mintAddr || !claimantAddress || !claimAmount || !claimMerkleRoot) {
      toast.error("All fields are required for claiming");
      return;
    }

    setClaimLoading(true);
    const proofs: string[] = [];
    if (proofHex1.trim()) proofs.push(proofHex1.trim());
    if (proofHex2.trim()) proofs.push(proofHex2.trim());

    try {
      const res = await fetch("/api/distribution", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "claim",
          mintAddress: mintAddr,
          claimantAddress,
          amount: claimAmount,
          merkleRoot: claimMerkleRoot,
          actionId: parseInt(claimActionId) || 0,
          leafIndex: parseInt(leafIndex) || 0,
          proofs: proofs.length > 0 ? proofs : undefined,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(`Claim failed: ${data.error}`);
        return;
      }

      toast.success(`Distribution claimed! ${claimAmount} tokens to ${claimantAddress}`);
    } catch (error: any) {
      toast.error(error.message || "Unknown error");
    } finally {
      setClaimLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/distributions">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Create Distribution</h1>
          <p className="text-sm text-slate-400 mt-1">Set up Merkle-based token distributions and claims</p>
        </div>
      </div>

      <Tabs defaultValue="create" className="w-full">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="create" className="data-[state=active]:bg-slate-700">Create Escrow</TabsTrigger>
          <TabsTrigger value="claim" className="data-[state=active]:bg-slate-700">Claim Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="mt-4">
          <form onSubmit={handleCreate}>
            <Card className="border-slate-800 bg-slate-900/50">
              <CardHeader>
                <CardTitle className="text-white">Distribution Escrow</CardTitle>
                <CardDescription className="text-slate-400">
                  Create a Merkle-based distribution escrow. Mint tokens into the escrow ATA before creating.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="token">Token</Label>
                  {tokensLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-slate-600 mt-2" />
                  ) : (
                    <select
                      id="token"
                      value={selectedToken}
                      onChange={(e) => {
                        setSelectedToken(e.target.value);
                        const t = tokens.find((t) => t.mintAddress === e.target.value);
                        setSelectedTokenName(t ? `${t.name} (${t.symbol})` : "");
                      }}
                      className="w-full mt-1 rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    >
                      <option value="">Select a token...</option>
                      {tokens.map((t) => (
                        <option key={t.mintAddress} value={t.mintAddress}>
                          {t.name} ({t.symbol})
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <div>
                  <Label htmlFor="merkleRoot">Merkle Root (32-byte hex)</Label>
                  <Input
                    id="merkleRoot"
                    value={merkleRoot}
                    onChange={(e) => setMerkleRoot(e.target.value)}
                    placeholder="0x + 64 hex chars"
                  />
                </div>
                <div>
                  <Label htmlFor="escrowAta">Escrow Token Account (optional)</Label>
                  <Input
                    id="escrowAta"
                    value={escrowAccount}
                    onChange={(e) => setEscrowAccount(e.target.value)}
                    placeholder="Auto-derived if empty"
                  />
                </div>
                <div>
                  <Label htmlFor="distActionId">Action ID</Label>
                  <Input
                    id="distActionId"
                    type="number"
                    value={actionId}
                    onChange={(e) => setActionId(e.target.value)}
                    className="w-32"
                  />
                </div>
                <p className="text-xs text-slate-500">
                  After creating the escrow, mint tokens into the escrow ATA so claimants can redeem against the Merkle tree.
                </p>
                <Button type="submit" disabled={loading || (!selectedToken && !claimTokenAddress) || !merkleRoot} className="w-full">
                  {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                  {loading ? "Creating..." : "Create Distribution Escrow"}
                </Button>
              </CardContent>
            </Card>
          </form>
        </TabsContent>

        <TabsContent value="claim" className="mt-4">
          <form onSubmit={handleClaim}>
            <Card className="border-slate-800 bg-slate-900/50">
              <CardHeader>
                <CardTitle className="text-white">Claim Tokens</CardTitle>
                <CardDescription className="text-slate-400">
                  Claim tokens from a distribution using your Merkle proof.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="claimToken">Token Mint Address</Label>
                  <Input
                    id="claimToken"
                    value={claimTokenAddress || selectedToken}
                    onChange={(e) => setClaimTokenAddress(e.target.value)}
                    placeholder="Mint address"
                  />
                </div>
                <div>
                  <Label htmlFor="claimant">Claimant Wallet</Label>
                  <Input
                    id="claimant"
                    value={claimantAddress}
                    onChange={(e) => setClaimantAddress(e.target.value)}
                    placeholder="Wallet receiving tokens..."
                  />
                </div>
                <div>
                  <Label htmlFor="claimAmount">Claim Amount</Label>
                  <Input
                    id="claimAmount"
                    type="number"
                    value={claimAmount}
                    onChange={(e) => setClaimAmount(e.target.value)}
                    placeholder="1000"
                  />
                </div>
                <div>
                  <Label htmlFor="claimRoot">Merkle Root (32-byte hex)</Label>
                  <Input
                    id="claimRoot"
                    value={claimMerkleRoot}
                    onChange={(e) => setClaimMerkleRoot(e.target.value)}
                    placeholder="0x + 64 hex chars"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="claimAid">Action ID</Label>
                    <Input id="claimAid" type="number" value={claimActionId} onChange={(e) => setClaimActionId(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="li">Leaf Index</Label>
                    <Input id="li" type="number" value={leafIndex} onChange={(e) => setLeafIndex(e.target.value)} />
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-slate-400">Merkle Proof (up to 2 elements, 32-byte hex each)</Label>
                  <div className="grid grid-cols-1 gap-2 mt-1">
                    <Input value={proofHex1} onChange={(e) => setProofHex1(e.target.value)} placeholder="Proof element 1 (hex)" />
                    <Input value={proofHex2} onChange={(e) => setProofHex2(e.target.value)} placeholder="Proof element 2 (hex)" />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={claimLoading || !claimantAddress || !claimAmount || !claimMerkleRoot}
                  className="w-full"
                >
                  {claimLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                  {claimLoading ? "Claiming..." : "Claim Distribution"}
                </Button>
              </CardContent>
            </Card>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
