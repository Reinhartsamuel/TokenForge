"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function CreateDistributionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [mintAddress, setMintAddress] = useState("");
  const [merkleRoot, setMerkleRoot] = useState("");
  const [escrowAccount, setEscrowAccount] = useState("");
  const [actionId, setActionId] = useState("0");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mintAddress || !merkleRoot) {
      toast.error("Mint address and Merkle root are required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/distribution", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          mintAddress,
          merkleRoot,
          escrowTokenAccount: escrowAccount || undefined,
          actionId: parseInt(actionId),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to create distribution");
        return;
      }

      toast.success("Distribution escrow created!");
      router.push("/dashboard/distributions");
    } catch (error: any) {
      toast.error(error.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/distributions">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Create Distribution</h1>
          <p className="text-sm text-slate-400 mt-1">Set up a new token distribution with Merkle root</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-white">Distribution Configuration</CardTitle>
            <CardDescription className="text-slate-400">
              Enter the details for your distribution escrow
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="mintAddress">Token Mint Address</Label>
              <Input
                id="mintAddress"
                value={mintAddress}
                onChange={(e) => setMintAddress(e.target.value)}
                placeholder="Enter mint address..."
                className="border-slate-700 bg-slate-800"
              />
            </div>
            <div>
              <Label htmlFor="merkleRoot">Merkle Root (32-byte hex)</Label>
              <Input
                id="merkleRoot"
                value={merkleRoot}
                onChange={(e) => setMerkleRoot(e.target.value)}
                placeholder="0x + 64 hex chars"
                className="border-slate-700 bg-slate-800"
              />
            </div>
            <div>
              <Label htmlFor="escrowAta">Escrow Token Account (optional)</Label>
              <Input
                id="escrowAta"
                value={escrowAccount}
                onChange={(e) => setEscrowAccount(e.target.value)}
                placeholder="Auto-derived if empty"
                className="border-slate-700 bg-slate-800"
              />
            </div>
            <div>
              <Label htmlFor="actionId">Action ID</Label>
              <Input
                id="actionId"
                type="number"
                value={actionId}
                onChange={(e) => setActionId(e.target.value)}
                placeholder="0"
                className="w-32 border-slate-700 bg-slate-800"
              />
            </div>

            <p className="text-xs text-slate-500">
              After creating the escrow, mint tokens into the escrow ATA so
              claimants can redeem against the Merkle tree.
            </p>

            <Button type="submit" disabled={loading || !mintAddress || !merkleRoot} className="w-full">
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              {loading ? "Creating..." : "Create Distribution Escrow"}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
