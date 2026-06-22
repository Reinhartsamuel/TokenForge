"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Send, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function TransferTokenPage() {
  const params = useParams();
  const router = useRouter();
  const mintAddress = params.mintAddress as string;

  const [source, setSource] = useState("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [enforceFamp, setEnforceFamp] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient || !amount) {
      toast.error("Recipient and amount are required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/transfer-tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mintAddress,
          source: source || undefined,
          recipient,
          amount,
          enforceFamp,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(`Transfer failed: ${data.error}${data.details ? ` (${JSON.stringify(data.details)})` : ""}`);
        return;
      }

      // Record transaction in DB
      try {
        await fetch("/api/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            signature: data.signature,
            type: "transfer",
            status: "confirmed",
            fromAddress: data.source,
            toAddress: data.destination,
            amount: amount,
            explorerUrl: data.explorerUrl,
          }),
        });
      } catch {}

      toast.success(`Transferred ${amount} tokens to ${recipient}`);
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Transfer Tokens</h1>
          <p className="text-sm text-slate-600 mt-1">Transfer security tokens between wallets</p>
        </div>
      </div>

      <form onSubmit={handleTransfer}>
        <Card>
          <CardHeader>
            <CardTitle className="text-slate-900">Transfer Configuration</CardTitle>
            <CardDescription className="text-slate-600">
              Transfers are subject to SSTS verification and optional FAMP policy enforcement.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="mintAddr">Token Mint Address</Label>
              <Input id="mintAddr" value={mintAddress} disabled />
            </div>
            <div>
              <Label htmlFor="source">Source Wallet (optional)</Label>
              <Input
                id="source"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="Defaults to test wallet"
              />
            </div>
            <div>
              <Label htmlFor="recipient">Recipient Wallet</Label>
              <Input
                id="recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Recipient wallet address..."
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
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-violet-600" />
                <div>
                  <div className="text-sm font-medium text-slate-900">Enforce FAMP Policy</div>
                  <div className="text-xs text-slate-600">Transfer will be gated by allowlist/blocklist</div>
                </div>
              </div>
              <Switch checked={enforceFamp} onCheckedChange={setEnforceFamp} />
            </div>
            {enforceFamp && (
              <p className="text-xs text-amber-600">
                When enabled, transfers will be rejected if sender or receiver is not compliant with the FAMP policy.
                Ensure a FAMP policy has been created for this token first.
              </p>
            )}
            <Button type="submit" disabled={loading || !recipient || !amount} className="w-full">
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
              {loading ? "Transferring..." : "Transfer Tokens"}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
