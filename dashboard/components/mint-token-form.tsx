"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TransactionResult } from "@/components/ui/transaction-result";

export function MintTokenForm() {
  const [mintAddress, setMintAddress] = useState("");
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [success, setSuccess] = useState(false);
  const [signature, setSignature] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mintAddress || !amount) {
      setResult("Mint address and amount are required");
      return;
    }

    setLoading(true);
    setResult("");
    setSuccess(false);
    setSignature("");

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
        setResult(`Error: ${data.error}${data.details ? ` (${JSON.stringify(data.details)})` : ""}`);
        setSuccess(false);
        return;
      }

      setSuccess(true);
      setSignature(data.signature);
      setResult(
        `Minted ${data.amount} tokens to ${data.destination}\n` +
        `Signature: ${data.signature}`
      );
    } catch (error: any) {
      console.error("Mint error:", error);
      setResult(error.message || "Unknown error");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Mint Tokens</h3>
        <div>
          <Label htmlFor="mint">Token Mint Address</Label>
          <Input
            id="mint"
            value={mintAddress}
            onChange={(e) => setMintAddress(e.target.value)}
            placeholder="Enter mint address..."
          />
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
        <p className="text-xs text-slate-400">
          Tokens minted via backend keypair signer. ATA auto-created if missing.
        </p>
      </div>

      <Button type="submit" disabled={loading || !mintAddress || !amount} className="w-full">
        {loading ? "Minting..." : "Mint Tokens"}
      </Button>

      <TransactionResult
        success={success}
        message={result}
        signature={signature}
        cluster="devnet"
      />
    </form>
  );
}
