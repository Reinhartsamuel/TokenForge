"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Plus, Search, Filter, Loader2, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/status-badge";
import { AddressLabel } from "@/components/address-label";

interface Investor {
  id: string;
  walletAddress: string | null;
  name: string | null;
  email: string | null;
  entityType: string | null;
  jurisdiction: string | null;
  kycStatus: string | null;
  accreditationStatus: string | null;
  amlStatus: string | null;
  createdAt: string;
}

export default function InvestorsPage() {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [kycFilter, setKycFilter] = useState("");

  useEffect(() => {
    fetchInvestors();
  }, [search, kycFilter]);

  async function fetchInvestors() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (kycFilter) params.set("kycStatus", kycFilter);
      params.set("limit", "50");

      const res = await fetch(`/api/investors?${params}`);
      if (res.ok) {
        const data = await res.json();
        setInvestors(data.investors || []);
      }
    } catch (err) {
      console.error("Failed to fetch investors:", err);
    } finally {
      setLoading(false);
    }
  }

  const kycStatusCounts = {
    verified: investors.filter(i => i.kycStatus === "verified").length,
    pending: investors.filter(i => i.kycStatus === "pending").length,
    rejected: investors.filter(i => i.kycStatus === "rejected").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Investor Registry</h1>
          <p className="text-sm text-slate-600 mt-1">Manage investor profiles and KYC status</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/investors/import">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Import CSV
            </Button>
          </Link>
          <Link href="/dashboard/investors/new">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Investor
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-600">Total Investors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{investors.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-600">KYC Verified</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{kycStatusCounts.verified}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-600">Pending Review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{kycStatusCounts.pending}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-slate-900">All Investors</CardTitle>
              <CardDescription className="text-slate-600">Complete investor registry</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search investors..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <select
                value={kycFilter}
                onChange={(e) => setKycFilter(e.target.value)}
                className="h-9 px-3 rounded-md border border-slate-200 bg-white text-sm"
              >
                <option value="">All KYC Status</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
            </div>
          ) : investors.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">No investors found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200 hover:bg-transparent">
                  <TableHead className="text-slate-600">Name</TableHead>
                  <TableHead className="text-slate-600">Wallet</TableHead>
                  <TableHead className="text-slate-600">Jurisdiction</TableHead>
                  <TableHead className="text-slate-600">KYC</TableHead>
                  <TableHead className="text-slate-600">AML</TableHead>
                  <TableHead className="text-slate-600">Accreditation</TableHead>
                  <TableHead className="text-slate-600">Added</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {investors.map((investor) => (
                  <TableRow key={investor.id} className="border-slate-200 hover:bg-slate-50">
                    <TableCell>
                      <Link href={`/dashboard/investors/${investor.id}`} className="hover:text-sky-600">
                        <div className="font-medium text-slate-900">{investor.name || "Unnamed"}</div>
                        {investor.email && (
                          <div className="text-sm text-slate-500">{investor.email}</div>
                        )}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {investor.walletAddress ? (
                        <AddressLabel address={investor.walletAddress} />
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-700">{investor.jurisdiction || "—"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          investor.kycStatus === "verified" ? "default" :
                          investor.kycStatus === "rejected" ? "destructive" : "secondary"
                        }
                      >
                        {investor.kycStatus || "pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          investor.amlStatus === "cleared" ? "default" :
                          investor.amlStatus === "flagged" ? "destructive" : "secondary"
                        }
                      >
                        {investor.amlStatus || "pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          investor.accreditationStatus === "accredited" ? "default" : "secondary"
                        }
                      >
                        {investor.accreditationStatus || "pending"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm">
                      {new Date(investor.createdAt).toLocaleDateString()}
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
