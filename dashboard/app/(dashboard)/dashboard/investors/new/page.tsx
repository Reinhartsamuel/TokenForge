"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function NewInvestorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    walletAddress: "",
    entityType: "individual",
    jurisdiction: "",
    kycStatus: "pending",
    accreditationStatus: "pending",
    amlStatus: "pending",
    pepStatus: false,
    notes: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/investors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success("Investor created successfully");
        router.push(`/dashboard/investors/${data.investor.id}`);
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to create investor");
      }
    } catch (err) {
      toast.error("Failed to create investor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/investors">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Add New Investor</h1>
          <p className="text-sm text-muted-foreground mt-1">Create a new investor profile</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Investor Information</CardTitle>
          <CardDescription className="text-muted-foreground">Enter the investor's details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="walletAddress">Wallet Address</Label>
                <Input
                  id="walletAddress"
                  value={formData.walletAddress}
                  onChange={(e) => setFormData({ ...formData, walletAddress: e.target.value })}
                  placeholder="Solana wallet address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="entityType">Entity Type</Label>
                <select
                  id="entityType"
                  value={formData.entityType}
                  onChange={(e) => setFormData({ ...formData, entityType: e.target.value })}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                >
                  <option value="individual">Individual</option>
                  <option value="corporation">Corporation</option>
                  <option value="fund">Fund</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="jurisdiction">Jurisdiction</Label>
                <Input
                  id="jurisdiction"
                  value={formData.jurisdiction}
                  onChange={(e) => setFormData({ ...formData, jurisdiction: e.target.value })}
                  placeholder="ID, SG, US, etc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kycStatus">KYC Status</Label>
                <select
                  id="kycStatus"
                  value={formData.kycStatus}
                  onChange={(e) => setFormData({ ...formData, kycStatus: e.target.value })}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="verified">Verified</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="accreditationStatus">Accreditation Status</Label>
                <select
                  id="accreditationStatus"
                  value={formData.accreditationStatus}
                  onChange={(e) => setFormData({ ...formData, accreditationStatus: e.target.value })}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="accredited">Accredited</option>
                  <option value="non_accredited">Non-Accredited</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amlStatus">AML Status</Label>
                <select
                  id="amlStatus"
                  value={formData.amlStatus}
                  onChange={(e) => setFormData({ ...formData, amlStatus: e.target.value })}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="cleared">Cleared</option>
                  <option value="flagged">Flagged</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes about the investor..."
                rows={3}
              />
            </div>

            <div className="flex items-center gap-2">
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Create Investor
              </Button>
              <Link href="/dashboard/investors">
                <Button variant="outline" type="button">Cancel</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
