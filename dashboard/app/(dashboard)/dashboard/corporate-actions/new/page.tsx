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

export default function NewCorporateActionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [formData, setFormData] = useState({
    tokenId: "",
    type: "dividend",
    title: "",
    description: "",
    status: "pending",
    executionDate: "",
    snapshotDate: "",
    totalAmount: "",
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/corporate-actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          totalAmount: formData.totalAmount || null,
          executionDate: formData.executionDate || null,
          snapshotDate: formData.snapshotDate || null,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success("Corporate action created successfully");
        router.push(`/dashboard/corporate-actions/${data.action.id}`);
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to create corporate action");
      }
    } catch (err) {
      toast.error("Failed to create corporate action");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/corporate-actions">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Create Corporate Action</h1>
          <p className="text-sm text-muted-foreground mt-1">Create a new corporate action</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Action Details</CardTitle>
          <CardDescription className="text-muted-foreground">Configure the corporate action</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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
                <Label htmlFor="type">Action Type</Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                  required
                >
                  <option value="dividend">Dividend</option>
                  <option value="vote">Vote</option>
                  <option value="buyback">Buyback</option>
                  <option value="snapshot">Snapshot</option>
                  <option value="forced_transfer">Forced Transfer</option>
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Q4 2024 Dividend Distribution"
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description of the corporate action..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="executionDate">Execution Date</Label>
                <Input
                  id="executionDate"
                  type="date"
                  value={formData.executionDate}
                  onChange={(e) => setFormData({ ...formData, executionDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="snapshotDate">Snapshot Date</Label>
                <Input
                  id="snapshotDate"
                  type="date"
                  value={formData.snapshotDate}
                  onChange={(e) => setFormData({ ...formData, snapshotDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalAmount">Total Amount</Label>
                <Input
                  id="totalAmount"
                  type="number"
                  step="0.000000001"
                  value={formData.totalAmount}
                  onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Create Action
              </Button>
              <Link href="/dashboard/corporate-actions">
                <Button variant="outline" type="button">Cancel</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
