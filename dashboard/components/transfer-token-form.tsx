"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TransactionResult } from "@/components/ui/transaction-result";

export function TransferTokenForm() {
  const [mintAddress, setMintAddress] = useState("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [success, setSuccess] = useState(false);
  const [signature, setSignature] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mintAddress || !recipient || !amount) {
      setResult("All fields are required");
      setSuccess(false);
      return;
    }

    setLoading(true);
    setResult("");
    setSuccess(false);
    setSignature("");

    try {
      const res = await fetch("/api/transfer-tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mintAddress,
          recipient,
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
        `Transferred ${data.amount} tokens\nFrom: ${data.source}\nTo: ${data.destination}\nSignature: ${data.signature}`
      );
    } catch (error: any) {
      console.error("Transfer error:", error);
      setResult(error.message || "Unknown error");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Transfer Tokens</h3>
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
          <Label htmlFor="recipient">Recipient Wallet Address</Label>
          <Input
            id="recipient"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Enter recipient wallet address..."
          />
        </div>
        <div>
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="100"
          />
        </div>
        <p className="text-xs text-slate-400">
          Transfers via backend keypair signer. Source is test wallet, ATAs auto-created if needed.
        </p>
      </div>

      <Button type="submit" disabled={loading || !mintAddress || !recipient || !amount} className="w-full">
        {loading ? "Transferring..." : "Transfer Tokens"}
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
