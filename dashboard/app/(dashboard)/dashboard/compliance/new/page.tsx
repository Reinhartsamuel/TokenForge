"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Token {
  id: string;
  mintAddress: string;
  name: string;
  symbol: string;
}

export default function NewComplianceRulePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [ruleType, setRuleType] = useState("jurisdiction");
  const [ruleConfig, setRuleConfig] = useState<any>({});

  useEffect(() => {
    async function fetchTokens() {
      try {
        const res = await fetch("/api/tokens");
        if (res.ok) {
          const data = await res.json();
          setTokens(data.tokens || []);
        }
      } catch (err) {
        console.error("Failed to fetch tokens:", err);
      }
    }
    fetchTokens();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/compliance/rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tokenId: formData.get("tokenId"),
          ruleType: formData.get("ruleType"),
          ruleConfig: ruleConfig,
          enabled: formData.get("enabled") === "true",
        }),
      });

      if (res.ok) {
        toast.success("Compliance rule created successfully");
        router.push("/dashboard/compliance");
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to create rule");
      }
    } catch (err) {
      toast.error("Failed to create rule");
    } finally {
      setLoading(false);
    }
  }

  function renderRuleConfig() {
    switch (ruleType) {
      case "jurisdiction":
        return (
          <div className="space-y-2">
            <Label>Allowed Jurisdictions (comma-separated)</Label>
            <Input
              placeholder="ID, SG, US"
              onChange={(e) => setRuleConfig({ allowedJurisdictions: e.target.value.split(",").map(s => s.trim()) })}
            />
          </div>
        );
      case "kyc_requirement":
        return (
          <div className="space-y-2">
            <Label>Required KYC Level</Label>
            <select
              onChange={(e) => setRuleConfig({ requiredKycLevel: e.target.value })}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
            >
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="accredited">Accredited</option>
            </select>
          </div>
        );
      case "lockup":
        return (
          <div className="space-y-2">
            <Label>Lockup End Date</Label>
            <Input
              type="date"
              onChange={(e) => setRuleConfig({ lockupEnd: e.target.value })}
            />
          </div>
        );
      case "transfer_restriction":
        return (
          <div className="space-y-2">
            <Label>Block All Transfers</Label>
            <select
              onChange={(e) => setRuleConfig({ blockTransfers: e.target.value === "true" })}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>
        );
      default:
        return null;
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
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Add Compliance Rule</h1>
          <p className="text-sm text-muted-foreground mt-1">Create a new transfer restriction rule</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Rule Configuration</CardTitle>
          <CardDescription className="text-muted-foreground">Configure the compliance rule</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="tokenId">Token</Label>
                <select
                  name="tokenId"
                  required
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
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
                <Label htmlFor="ruleType">Rule Type</Label>
                <select
                  name="ruleType"
                  value={ruleType}
                  onChange={(e) => {
                    setRuleType(e.target.value);
                    setRuleConfig({});
                  }}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                  required
                >
                  <option value="jurisdiction">Jurisdiction Restriction</option>
                  <option value="kyc_requirement">KYC Requirement</option>
                  <option value="lockup">Lockup Period</option>
                  <option value="transfer_restriction">Transfer Restriction</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="enabled">Enabled</Label>
                <select
                  name="enabled"
                  defaultValue="true"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
            </div>

            {renderRuleConfig()}

            <div className="flex items-center gap-2">
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Create Rule
              </Button>
              <Link href="/dashboard/compliance">
                <Button variant="outline" type="button">Cancel</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
