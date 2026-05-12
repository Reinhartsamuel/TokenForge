"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Coins, ShieldCheck, Send, Activity, ExternalLink } from "lucide-react";import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/status-badge";
import { AddressLabel } from "@/components/address-label";
import { Badge } from "@/components/ui/badge";

interface Token {
  id: string;
  mintAddress: string;
  name: string;
  symbol: string;
  decimals: number;
  uri: string | null;
  description: string | null;
  imageUrl: string | null;
  mintAuthorityPda: string | null;
  freezeAuthorityPda: string | null;
  verificationConfigPda: string | null;
  creatorAddress: string;
  network: string;
  status: string;
  createdAt: string;
}

interface Transaction {
  id: string;
  type: string;
  status: string;
  fromAddress: string | null;
  toAddress: string | null;
  amount: string | null;
  signature: string;
  explorerUrl: string | null;
  createdAt: string;
}

interface Policy {
  id: string;
  allowlistMode: boolean;
  allowlistCount: number;
  blocklistCount: number;
  entries: Array<{ walletAddress: string; listType: string }>;
}

export default function TokenDetailPage() {
  const params = useParams();
  const router = useRouter();
  const mintAddress = params.mintAddress as string;

  const [token, setToken] = useState<Token | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [tokenRes, txRes] = await Promise.all([
          fetch(`/api/tokens/${mintAddress}`),
          fetch(`/api/transactions?token=${mintAddress}&limit=20`),
        ]);

        if (tokenRes.ok) setToken(await tokenRes.json());
        if (txRes.ok) {
          const data = await txRes.json();
          setTransactions(data.transactions || []);
        }
      } catch (err) {
        console.error("Failed to fetch token data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [mintAddress]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
      </div>
    );
  }

  if (!token) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Token not found</p>
        <Link href="/dashboard/tokens">
          <Button variant="link">Back to tokens</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/tokens">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">{token.name}</h1>
            <p className="text-sm text-slate-400">{token.symbol} • {token.network}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={token.status} />
          <Link href={`https://explorer.solana.com/address/${token.mintAddress}?cluster=devnet`} target="_blank">
            <Button variant="outline" size="sm">Explorer</Button>
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Link href={`/dashboard/tokens/${mintAddress}/mint`}>
          <Button size="sm">
            <Coins className="h-4 w-4 mr-2" />
            Mint
          </Button>
        </Link>
        <Link href={`/dashboard/tokens/${mintAddress}/transfer`}>
          <Button size="sm" variant="outline">
            <Send className="h-4 w-4 mr-2" />
            Transfer
          </Button>
        </Link>
        <Link href={`/dashboard/tokens/${mintAddress}/policy`}>
          <Button size="sm" variant="outline">
            <ShieldCheck className="h-4 w-4 mr-2" />
            Policy
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-400">Mint Address</CardDescription>
          </CardHeader>
          <CardContent>
            <AddressLabel address={token.mintAddress} chars={6} />
          </CardContent>
        </Card>
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-400">Decimals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold text-white">{token.decimals}</div>
          </CardContent>
        </Card>
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-400">Creator</CardDescription>
          </CardHeader>
          <CardContent>
            <AddressLabel address={token.creatorAddress} />
          </CardContent>
        </Card>
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-400">Created</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold text-white">{new Date(token.createdAt).toLocaleDateString()}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="transactions" className="data-[state=active]:bg-slate-700">Transactions</TabsTrigger>
          <TabsTrigger value="policy" className="data-[state=active]:bg-slate-700">Policy</TabsTrigger>
          <TabsTrigger value="details" className="data-[state=active]:bg-slate-700">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="mt-4">
          <Card className="border-slate-800 bg-slate-900/50">
            <CardHeader>
              <CardTitle className="text-white">Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <p className="text-slate-500 text-sm py-4">No transactions recorded yet</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-800 hover:bg-transparent">
                      <TableHead className="text-slate-400">Type</TableHead>
                      <TableHead className="text-slate-400">From</TableHead>
                      <TableHead className="text-slate-400">To</TableHead>
                      <TableHead className="text-slate-400">Amount</TableHead>
                      <TableHead className="text-slate-400">Status</TableHead>
                      <TableHead className="text-slate-400">Date</TableHead>
                      <TableHead className="text-slate-400">View Tx</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((tx) => (
                      <TableRow key={tx.id} className="border-slate-800 hover:bg-slate-800/50">
                        <TableCell><StatusBadge status={tx.type} /></TableCell>
                        <TableCell>{tx.fromAddress ? <AddressLabel address={tx.fromAddress} /> : "—"}</TableCell>
                        <TableCell>{tx.toAddress ? <AddressLabel address={tx.toAddress} /> : "—"}</TableCell>
                        <TableCell className="text-slate-300">{tx.amount || "—"}</TableCell>
                        <TableCell><StatusBadge status={tx.status} /></TableCell>
                        <TableCell className="text-slate-500 text-sm">{new Date(tx.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Link href={tx.explorerUrl} target="_blank" className="text-blue-500 hover:underline">
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policy" className="mt-4">
          <Card className="border-slate-800 bg-slate-900/50">
            <CardHeader>
              <CardTitle className="text-white">FAMP Policy</CardTitle>
              <CardDescription className="text-slate-400">Allowlist and blocklist configuration</CardDescription>
            </CardHeader>
            <CardContent>
              {policy ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Badge variant={policy.allowlistMode ? "default" : "secondary"}>
                      {policy.allowlistMode ? "Allowlist Mode" : "Blocklist Mode"}
                    </Badge>
                    <span className="text-sm text-slate-400">
                      Allowlist: {policy.allowlistCount} | Blocklist: {policy.blocklistCount}
                    </span>
                  </div>
                  {policy.entries.length > 0 && (
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-800 hover:bg-transparent">
                          <TableHead className="text-slate-400">Wallet</TableHead>
                          <TableHead className="text-slate-400">List</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {policy.entries.map((entry, i) => (
                          <TableRow key={i} className="border-slate-800 hover:bg-slate-800/50">
                            <TableCell><AddressLabel address={entry.walletAddress} /></TableCell>
                            <TableCell><StatusBadge status={entry.listType} /></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                  <Link href={`/policies/${mintAddress}`}>
                    <Button variant="outline">Manage Policy</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-slate-500 text-sm">No policy has been created for this token yet.</p>
                  <Link href={`/dashboard/policies/${mintAddress}`}>
                    <Button>Create Policy</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="mt-4">
          <Card className="border-slate-800 bg-slate-900/50">
            <CardHeader>
              <CardTitle className="text-white">Token Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {token.description && (
                  <div>
                    <div className="text-sm text-slate-400">Description</div>
                    <div className="text-white">{token.description}</div>
                  </div>
                )}
                {token.uri && (
                  <div>
                    <div className="text-sm text-slate-400">Metadata URI</div>
                    <div className="text-sky-400 break-all text-sm">{token.uri}</div>
                  </div>
                )}
                {token.mintAuthorityPda && (
                  <div>
                    <div className="text-sm text-slate-400">Mint Authority PDA</div>
                    <AddressLabel address={token.mintAuthorityPda} />
                  </div>
                )}
                {token.freezeAuthorityPda && (
                  <div>
                    <div className="text-sm text-slate-400">Freeze Authority PDA</div>
                    <AddressLabel address={token.freezeAuthorityPda} />
                  </div>
                )}
                {token.verificationConfigPda && (
                  <div>
                    <div className="text-sm text-slate-400">Verification Config PDA</div>
                    <AddressLabel address={token.verificationConfigPda} />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
