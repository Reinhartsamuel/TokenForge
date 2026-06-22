"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface NavRecord {
  id: string;
  navPerToken: string;
  totalAssets: string | null;
  totalLiabilities: string | null;
  outstandingTokens: string | null;
  valuationDate: string;
  source: string | null;
  verifiedBy: string | null;
  createdAt: string;
}

export default function NavManagementPage() {
  const params = useParams();
  const router = useRouter();
  const mintAddress = params.mintAddress as string;

  const [records, setRecords] = useState<NavRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    navPerToken: "",
    totalAssets: "",
    totalLiabilities: "",
    outstandingTokens: "",
    valuationDate: new Date().toISOString().split("T")[0],
    source: "manual",
    verifiedBy: "",
  });

  useEffect(() => {
    fetchNavRecords();
  }, [mintAddress]);

  async function fetchNavRecords() {
    setLoading(true);
    try {
      const res = await fetch(`/api/tokens/${mintAddress}/nav`);
      if (res.ok) {
        const data = await res.json();
        setRecords(data.records || []);
      }
    } catch (err) {
      console.error("Failed to fetch NAV records:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch(`/api/tokens/${mintAddress}/nav`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("NAV record created successfully");
        setShowForm(false);
        fetchNavRecords();
        setFormData({
          navPerToken: "",
          totalAssets: "",
          totalLiabilities: "",
          outstandingTokens: "",
          valuationDate: new Date().toISOString().split("T")[0],
          source: "manual",
          verifiedBy: "",
        });
      } else {
        toast.error("Failed to create NAV record");
      }
    } catch (err) {
      toast.error("Failed to create NAV record");
    }
  }

  const latestRecord = records[0];
  const chartData = records
    .slice(0, 30)
    .reverse()
    .map((r) => ({
      date: new Date(r.valuationDate).toLocaleDateString(),
      nav: parseFloat(r.navPerToken),
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
            <h1 className="text-2xl font-bold tracking-tight text-foreground">NAV Management</h1>
            <p className="text-sm text-muted-foreground mt-1">Track and update net asset value</p>
          </div>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Update NAV"}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Update NAV</CardTitle>
            <CardDescription className="text-muted-foreground">Enter current net asset value</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="navPerToken">NAV Per Token</Label>
                  <Input
                    id="navPerToken"
                    type="number"
                    step="0.000000001"
                    value={formData.navPerToken}
                    onChange={(e) => setFormData({ ...formData, navPerToken: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valuationDate">Valuation Date</Label>
                  <Input
                    id="valuationDate"
                    type="date"
                    value={formData.valuationDate}
                    onChange={(e) => setFormData({ ...formData, valuationDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalAssets">Total Assets</Label>
                  <Input
                    id="totalAssets"
                    type="number"
                    step="0.000000001"
                    value={formData.totalAssets}
                    onChange={(e) => setFormData({ ...formData, totalAssets: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalLiabilities">Total Liabilities</Label>
                  <Input
                    id="totalLiabilities"
                    type="number"
                    step="0.000000001"
                    value={formData.totalLiabilities}
                    onChange={(e) => setFormData({ ...formData, totalLiabilities: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="outstandingTokens">Outstanding Tokens</Label>
                  <Input
                    id="outstandingTokens"
                    type="number"
                    step="0.000000001"
                    value={formData.outstandingTokens}
                    onChange={(e) => setFormData({ ...formData, outstandingTokens: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="source">Source</Label>
                  <select
                    id="source"
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                  >
                    <option value="manual">Manual</option>
                    <option value="oracle">Oracle</option>
                    <option value="administrator">Administrator</option>
                  </select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="verifiedBy">Verified By</Label>
                  <Input
                    id="verifiedBy"
                    value={formData.verifiedBy}
                    onChange={(e) => setFormData({ ...formData, verifiedBy: e.target.value })}
                    placeholder="Administrator name"
                  />
                </div>
              </div>
              <Button type="submit">Submit NAV Update</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-muted-foreground">Current NAV Per Token</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {latestRecord ? parseFloat(latestRecord.navPerToken).toFixed(6) : "—"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-muted-foreground">Total Assets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {latestRecord?.totalAssets ? parseFloat(latestRecord.totalAssets).toFixed(2) : "—"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-muted-foreground">Last Updated</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {latestRecord ? new Date(latestRecord.valuationDate).toLocaleDateString() : "—"}
            </div>
          </CardContent>
        </Card>
      </div>

      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">NAV History</CardTitle>
            <CardDescription className="text-muted-foreground">Net asset value over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: "12px" }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "6px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="nav"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  dot={{ fill: "#38bdf8", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">NAV Records</CardTitle>
          <CardDescription className="text-muted-foreground">Historical NAV updates</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : records.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">No NAV records found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Date</TableHead>
                  <TableHead className="text-muted-foreground">NAV Per Token</TableHead>
                  <TableHead className="text-muted-foreground">Total Assets</TableHead>
                  <TableHead className="text-muted-foreground">Total Liabilities</TableHead>
                  <TableHead className="text-muted-foreground">Outstanding</TableHead>
                  <TableHead className="text-muted-foreground">Source</TableHead>
                  <TableHead className="text-muted-foreground">Verified By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id} className="border-border hover:bg-muted/50">
                    <TableCell className="text-foreground">
                      {new Date(record.valuationDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-foreground font-medium">
                      {parseFloat(record.navPerToken).toFixed(6)}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {record.totalAssets ? parseFloat(record.totalAssets).toFixed(2) : "—"}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {record.totalLiabilities ? parseFloat(record.totalLiabilities).toFixed(2) : "—"}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {record.outstandingTokens ? parseFloat(record.outstandingTokens).toFixed(2) : "—"}
                    </TableCell>
                    <TableCell className="text-foreground">{record.source || "—"}</TableCell>
                    <TableCell className="text-foreground">{record.verifiedBy || "—"}</TableCell>
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
