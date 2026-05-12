"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function MintTokenPage() {
  const params = useParams();
  const router = useRouter();
  const mintAddress = params.mintAddress as string;

  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) {
      toast.error("Amount is required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/mint-tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mintAddress,
          destination: destination || undefined,
          amount,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(`Mint failed: ${data.error}`);
        return;
      }

      // Record transaction in DB
      try {
        await fetch("/api/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            signature: data.signature,
            type: "mint",
            status: "confirmed",
            toAddress: data.destination,
            amount: amount,
            explorerUrl: data.explorerUrl,
          }),
        });
      } catch {}

      toast.success(`Minted ${amount} tokens to ${data.destination}`);
      router.push(`/dashboard/tokens/${mintAddress}`);
    } catch (error: any) {
      toast.error(error.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/tokens/${mintAddress}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Mint Tokens</h1>
          <p className="text-sm text-slate-400 mt-1">Mint security tokens to a destination wallet</p>
        </div>
      </div>

      <form onSubmit={handleMint}>
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-white">Mint Configuration</CardTitle>
            <CardDescription className="text-slate-400">
              Tokens minted via backend keypair signer. ATA auto-created if missing.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="mintAddr">Token Mint Address</Label>
              <Input id="mintAddr" value={mintAddress} disabled className="bg-slate-800" />
            </div>
            <div>
              <Label htmlFor="destination">Destination (optional)</Label>
              <Input
                id="destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Defaults to test wallet"
              />
            </div>
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="1000"
              />
            </div>
            <Button type="submit" disabled={loading || !amount} className="w-full">
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Coins className="h-4 w-4 mr-2" />}
              {loading ? "Minting..." : "Mint Tokens"}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
