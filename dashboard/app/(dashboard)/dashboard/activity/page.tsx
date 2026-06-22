"use client";

import { useEffect, useState } from "react";
import { Activity, Search, Loader2, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/status-badge";
import { AddressLabel } from "@/components/address-label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Transaction {
  id: string;
  type: string;
  status: string;
  tokenName: string | null;
  tokenSymbol: string | null;
  fromAddress: string | null;
  toAddress: string | null;
  amount: string | null;
  signature: string;
  explorerUrl: string | null;
  createdAt: string;
}

export default function ActivityPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    fetch("/api/transactions?limit=100")
      .then((res) => res.json())
      .then((data) => setTransactions(data.transactions || []))
      .catch((err) => console.error("Failed to fetch transactions:", err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = transactions.filter((tx) => {
    const matchesSearch =
      tx.signature.toLowerCase().includes(search.toLowerCase()) ||
      tx.tokenName?.toLowerCase().includes(search.toLowerCase()) ||
      tx.fromAddress?.toLowerCase().includes(search.toLowerCase()) ||
      tx.toAddress?.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || tx.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const txTypes = [
    "all", "create", "mint", "transfer", "policy_create",
    "policy_allowlist", "policy_blocklist", "distribution_create", "distribution_claim"
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Activity</h1>
        <p className="text-sm text-slate-600 mt-1">Full transaction log across all tokens</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="text-slate-900">Transaction Log</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search transactions..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {txTypes.map((type) => (
                    <DropdownMenuItem
                      key={type}
                      onClick={() => setTypeFilter(type)}
                      className={typeFilter === type ? "bg-slate-100" : ""}
                    >
                      {type === "all" ? "All Types" : type}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="h-12 w-12 mx-auto text-slate-400 mb-3" />
              <p className="text-slate-600">No transactions found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-slate-600">Timestamp</TableHead>
                  <TableHead className="text-slate-600">Type</TableHead>
                  <TableHead className="text-slate-600">Token</TableHead>
                  <TableHead className="text-slate-600 hidden lg:table-cell">From</TableHead>
                  <TableHead className="text-slate-600 hidden lg:table-cell">To</TableHead>
                  <TableHead className="text-slate-600 hidden md:table-cell">Amount</TableHead>
                  <TableHead className="text-slate-600">Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((tx) => (
                  <TableRow key={tx.id} className="hover:bg-slate-50">
                    <TableCell className="text-slate-600 text-sm">
                      {new Date(tx.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={tx.type} />
                    </TableCell>
                    <TableCell className="text-slate-700">
                      {tx.tokenName ? `${tx.tokenName} (${tx.tokenSymbol})` : "—"}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {tx.fromAddress ? <AddressLabel address={tx.fromAddress} /> : "—"}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {tx.toAddress ? <AddressLabel address={tx.toAddress} /> : "—"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-slate-700">{tx.amount || "—"}</TableCell>
                    <TableCell>
                      <StatusBadge status={tx.status} />
                    </TableCell>
                    <TableCell>
                      {tx.explorerUrl && (
                        <a href={tx.explorerUrl} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="sm">View</Button>
                        </a>
                      )}
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
