"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface Token {
  id: string;
  mintAddress: string;
  name: string;
  symbol: string;
}

interface SimulationResult {
  allowed: boolean;
  violations: string[];
  rulesChecked: number;
}

export default function TransferSimulatorPage() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [formData, setFormData] = useState({
    tokenId: "",
    fromWallet: "",
    toWallet: "",
    amount: "",
  });

  useEffect(() => {
    async function fetchTokens() {
      try {
        const res = await fetch("/api/tokens");
        if (res.ok) {
          const data = await res.json();
          setTokens(data.tokens || []);
          if (data.tokens?.length > 0) {
            setFormData(prev => ({ ...prev, tokenId: data.tokens[0].id }));
          }
        }
      } catch (err) {
        console.error("Failed to fetch tokens:", err);
      }
    }
    fetchTokens();
  }, []);

  async function handleSimulate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/compliance/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data);
      } else {
        setResult({ allowed: false, violations: ["Failed to simulate transfer"], rulesChecked: 0 });
      }
    } catch (err) {
      setResult({ allowed: false, violations: ["Failed to simulate transfer"], rulesChecked: 0 });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/compliance">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Transfer Simulator</h1>
          <p className="text-sm text-muted-foreground mt-1">Test if a transfer would be allowed</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Simulate Transfer</CardTitle>
          <CardDescription className="text-muted-foreground">Enter transfer details to check compliance</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSimulate} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="tokenId">Token</Label>
                <select
                  id="tokenId"
                  value={formData.tokenId}
                  onChange={(e) => setFormData({ ...formData, tokenId: e.target.value })}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                  required
                >
                  <option value="">Select a token</option>
                  {tokens.map((token) => (
                    <option key={token.id} value={token.id}>
                      {token.name} ({token.symbol})
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.000000001"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="fromWallet">From Wallet Address</Label>
                <Input
                  id="fromWallet"
                  value={formData.fromWallet}
                  onChange={(e) => setFormData({ ...formData, fromWallet: e.target.value })}
                  placeholder="Sender wallet address"
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="toWallet">To Wallet Address</Label>
                <Input
                  id="toWallet"
                  value={formData.toWallet}
                  onChange={(e) => setFormData({ ...formData, toWallet: e.target.value })}
                  placeholder="Recipient wallet address"
                  required
                />
              </div>
            </div>

            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Simulate Transfer
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Simulation Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              {result.allowed ? (
                <>
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <span className="text-lg font-semibold text-green-500">Transfer Allowed</span>
                </>
              ) : (
                <>
                  <XCircle className="h-6 w-6 text-red-500" />
                  <span className="text-lg font-semibold text-red-500">Transfer Blocked</span>
                </>
              )}
            </div>

            <div className="text-sm text-muted-foreground">
              Rules checked: {result.rulesChecked}
            </div>

            {result.violations.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-foreground">Violations:</div>
                <ul className="space-y-2">
                  {result.violations.map((violation, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Badge variant="destructive" className="mt-0.5">!</Badge>
                      <span className="text-sm text-foreground">{violation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
