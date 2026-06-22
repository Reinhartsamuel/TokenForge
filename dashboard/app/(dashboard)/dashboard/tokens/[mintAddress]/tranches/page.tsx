"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface Tranche {
  id: string;
  spvTokenId: string;
  trancheTokenId: string | null;
  trancheType: string;
  priority: number;
  targetAllocation: string | null;
  couponRate: string | null;
  minSubscription: string | null;
  maxSubscription: string | null;
  createdAt: string;
  trancheTokenName: string | null;
  trancheTokenSymbol: string | null;
}

export default function TranchingPage() {
  const params = useParams();
  const router = useRouter();
  const mintAddress = params.mintAddress as string;

  const [tranches, setTranches] = useState<Tranche[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    trancheType: "senior",
    priority: 1,
    targetAllocation: "",
    couponRate: "",
    minSubscription: "",
    maxSubscription: "",
  });

  useEffect(() => {
    fetchTranches();
  }, [mintAddress]);

  async function fetchTranches() {
    setLoading(true);
    try {
      const res = await fetch(`/api/tokens/${mintAddress}/tranches`);
      if (res.ok) {
        const data = await res.json();
        setTranches(data.tranches || []);
      }
    } catch (err) {
      console.error("Failed to fetch tranches:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch(`/api/tokens/${mintAddress}/tranches`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Tranche created successfully");
        setShowForm(false);
        fetchTranches();
        setFormData({
          trancheType: "senior",
          priority: tranches.length + 1,
          targetAllocation: "",
          couponRate: "",
          minSubscription: "",
          maxSubscription: "",
        });
      } else {
        toast.error("Failed to create tranche");
      }
    } catch (err) {
      toast.error("Failed to create tranche");
    }
  }

  const trancheTypeColors: Record<string, string> = {
    senior: "#38bdf8",
    mezzanine: "#a78bfa",
    equity: "#f472b6",
  };

  const chartData = tranches
    .filter(t => t.targetAllocation)
    .map(t => ({
      name: t.trancheType,
      value: parseFloat(t.targetAllocation || "0") * 100,
      color: trancheTypeColors[t.trancheType] || "#64748b",
    }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/tokens/${mintAddress}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Tranche Structure</h1>
            <p className="text-sm text-muted-foreground mt-1">Define and manage token tranches</p>
          </div>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Add Tranche"}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Add Tranche</CardTitle>
            <CardDescription className="text-muted-foreground">Create a new tranche</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="trancheType">Tranche Type</Label>
                  <select
                    id="trancheType"
                    value={formData.trancheType}
                    onChange={(e) => setFormData({ ...formData, trancheType: e.target.value })}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                    required
                  >
                    <option value="senior">Senior</option>
                    <option value="mezzanine">Mezzanine</option>
                    <option value="equity">Equity</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority (1 = highest)</Label>
                  <Input
                    id="priority"
                    type="number"
                    min="1"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetAllocation">Target Allocation (%)</Label>
                  <Input
                    id="targetAllocation"
                    type="number"
                    step="0.01"
                    value={formData.targetAllocation}
                    onChange={(e) => setFormData({ ...formData, targetAllocation: (parseFloat(e.target.value) / 100).toString() })}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="couponRate">Coupon Rate (%)</Label>
                  <Input
                    id="couponRate"
                    type="number"
                    step="0.01"
                    value={formData.couponRate}
                    onChange={(e) => setFormData({ ...formData, couponRate: (parseFloat(e.target.value) / 100).toString() })}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minSubscription">Min Subscription</Label>
                  <Input
                    id="minSubscription"
                    type="number"
                    step="0.000000001"
                    value={formData.minSubscription}
                    onChange={(e) => setFormData({ ...formData, minSubscription: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxSubscription">Max Subscription</Label>
                  <Input
                    id="maxSubscription"
                    type="number"
                    step="0.000000001"
                    value={formData.maxSubscription}
                    onChange={(e) => setFormData({ ...formData, maxSubscription: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <Button type="submit">Create Tranche</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Allocation Distribution</CardTitle>
            <CardDescription className="text-muted-foreground">Tranche allocation breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "6px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Tranches</CardTitle>
          <CardDescription className="text-muted-foreground">Defined tranches for this token</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : tranches.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground text-sm">No tranches defined</p>
              <p className="text-muted-foreground text-xs mt-1">Add tranches to create a multi-tranche structure</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Type</TableHead>
                  <TableHead className="text-muted-foreground">Priority</TableHead>
                  <TableHead className="text-muted-foreground">Allocation</TableHead>
                  <TableHead className="text-muted-foreground">Coupon Rate</TableHead>
                  <TableHead className="text-muted-foreground">Min Subscription</TableHead>
                  <TableHead className="text-muted-foreground">Max Subscription</TableHead>
                  <TableHead className="text-muted-foreground">Token</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tranches.map((tranche) => (
                  <TableRow key={tranche.id} className="border-border hover:bg-muted/50">
                    <TableCell>
                      <Badge
                        style={{
                          backgroundColor: trancheTypeColors[tranche.trancheType] || "#64748b",
                        }}
                      >
                        {tranche.trancheType}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-foreground">{tranche.priority}</TableCell>
                    <TableCell className="text-foreground">
                      {tranche.targetAllocation
                        ? `${(parseFloat(tranche.targetAllocation) * 100).toFixed(2)}%`
                        : "—"}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {tranche.couponRate
                        ? `${(parseFloat(tranche.couponRate) * 100).toFixed(2)}%`
                        : "—"}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {tranche.minSubscription || "—"}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {tranche.maxSubscription || "—"}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {tranche.trancheTokenName
                        ? `${tranche.trancheTokenName} (${tranche.trancheTokenSymbol})`
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
