"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Coins, Plus, Search, Loader2, ExternalLink } from "lucide-react";
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

interface Token {
  id: string;
  mintAddress: string;
  name: string;
  symbol: string;
  decimals: number;
  network: string;
  status: string;
  createdAt: string;
}

export default function TokensPage() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/tokens")
      .then((res) => res.json())
      .then((data) => setTokens(data.tokens || []))
      .catch((err) => console.error("Failed to fetch tokens:", err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = tokens.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.symbol.toLowerCase().includes(search.toLowerCase()) ||
      t.mintAddress.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Tokens</h1>
          <p className="text-sm text-slate-400 mt-1">Manage your security tokens</p>
        </div>
        <Link href="/dashboard/tokens/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Token
          </Button>
        </Link>
      </div>

      <Card className="border-slate-800 bg-slate-900/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">All Tokens</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Search tokens..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 border-slate-700 bg-slate-800"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-slate-600" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <Coins className="h-12 w-12 mx-auto text-slate-700 mb-3" />
              <p className="text-slate-500 mb-4">No tokens found</p>
              <Link href="/dashboard/tokens/create">
                <Button size="sm">Create your first token</Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-transparent">
                  <TableHead className="text-slate-400">Token</TableHead>
                  <TableHead className="text-slate-400 hidden md:table-cell">Mint Address</TableHead>
                  <TableHead className="text-slate-400">Decimals</TableHead>
                  <TableHead className="text-slate-400">Network</TableHead>
                  <TableHead className="text-slate-400">Status</TableHead>
                  <TableHead className="text-slate-400 hidden sm:table-cell">Created</TableHead>
                  <TableHead className="text-slate-400 w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((token) => (
                  <TableRow key={token.id} className="border-slate-800 hover:bg-slate-800/50">
                    <TableCell>
                      <div>
                        <div className="font-medium text-white">{token.name}</div>
                        <div className="text-sm text-slate-500">{token.symbol}</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <AddressLabel address={token.mintAddress} />
                    </TableCell>
                    <TableCell className="text-slate-300">{token.decimals}</TableCell>
                    <TableCell>
                      <StatusBadge status={token.network} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={token.status} />
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-slate-500 text-sm">
                      {new Date(token.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <span className="sr-only">Actions</span>
                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
                            </svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                          <DropdownMenuItem>
                            <Link href={`/tokens/${token.mintAddress}`} className="w-full">View Details</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Link href={`https://explorer.solana.com/address/${token.mintAddress}?cluster=devnet`} target="_blank" className="w-full">
                              Explorer <ExternalLink className="h-3 w-3 ml-1" />
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
