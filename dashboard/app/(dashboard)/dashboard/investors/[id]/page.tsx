"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  accreditationExpiry: string | null;
  amlStatus: string | null;
  pepStatus: boolean;
  sanctionsStatus: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Holding {
  id: string;
  balance: string | null;
  ownershipPercentage: string | null;
  tokenAccountAddress: string | null;
  tokenName: string;
  tokenSymbol: string;
  tokenMintAddress: string;
}

export default function InvestorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const investorId = params.id as string;

  const [investor, setInvestor] = useState<Investor | null>(null);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/investors/${investorId}`);
        if (res.ok) {
          const data = await res.json();
          setInvestor(data.investor);
          setHoldings(data.holdings || []);
        }
      } catch (err) {
        console.error("Failed to fetch investor:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [investorId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!investor) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Investor not found</p>
        <Link href="/dashboard/investors">
          <Button variant="link">Back to investors</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/investors">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{investor.name || "Unnamed Investor"}</h1>
            <p className="text-sm text-muted-foreground mt-1">{investor.entityType || "individual"}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-muted-foreground">KYC Status</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge
              variant={
                investor.kycStatus === "verified" ? "default" :
                investor.kycStatus === "rejected" ? "destructive" : "secondary"
              }
              className="text-sm"
            >
              {investor.kycStatus || "pending"}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-muted-foreground">AML Status</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge
              variant={
                investor.amlStatus === "cleared" ? "default" :
                investor.amlStatus === "flagged" ? "destructive" : "secondary"
              }
              className="text-sm"
            >
              {investor.amlStatus || "pending"}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-muted-foreground">Accreditation</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge
              variant={investor.accreditationStatus === "accredited" ? "default" : "secondary"}
              className="text-sm"
            >
              {investor.accreditationStatus || "pending"}
            </Badge>
            {investor.accreditationExpiry && (
              <div className="text-xs text-muted-foreground mt-1">
                Expires: {new Date(investor.accreditationExpiry).toLocaleDateString()}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-sm text-muted-foreground">Email</div>
              <div className="text-foreground">{investor.email || "—"}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Jurisdiction</div>
              <div className="text-foreground">{investor.jurisdiction || "—"}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">PEP Status</div>
              <div className="text-foreground">{investor.pepStatus ? "Yes" : "No"}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Sanctions Status</div>
              <Badge variant={investor.sanctionsStatus === "cleared" ? "default" : "secondary"}>
                {investor.sanctionsStatus || "pending"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Wallet Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {investor.walletAddress ? (
              <>
                <div>
                  <div className="text-sm text-muted-foreground">Wallet Address</div>
                  <div className="flex items-center gap-2">
                    <AddressLabel address={investor.walletAddress} />
                    <Link
                      href={`https://explorer.solana.com/address/${investor.walletAddress}?cluster=devnet`}
                      target="_blank"
                    >
                      <ExternalLink className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-muted-foreground text-sm">No wallet address linked</div>
            )}
            <div>
              <div className="text-sm text-muted-foreground">Added</div>
              <div className="text-foreground">{new Date(investor.createdAt).toLocaleDateString()}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Last Updated</div>
              <div className="text-foreground">{new Date(investor.updatedAt).toLocaleDateString()}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {investor.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground whitespace-pre-wrap">{investor.notes}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Token Holdings</CardTitle>
          <CardDescription className="text-muted-foreground">Tokens held by this investor</CardDescription>
        </CardHeader>
        <CardContent>
          {holdings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">No holdings found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Token</TableHead>
                  <TableHead className="text-muted-foreground">Balance</TableHead>
                  <TableHead className="text-muted-foreground">Ownership %</TableHead>
                  <TableHead className="text-muted-foreground">Token Account</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {holdings.map((holding) => (
                  <TableRow key={holding.id} className="border-border hover:bg-muted/50">
                    <TableCell>
                      <Link
                        href={`/dashboard/tokens/${holding.tokenMintAddress}`}
                        className="hover:text-primary text-foreground font-medium"
                      >
                        {holding.tokenName} ({holding.tokenSymbol})
                      </Link>
                    </TableCell>
                    <TableCell className="text-foreground">{holding.balance || "0"}</TableCell>
                    <TableCell className="text-foreground">
                      {holding.ownershipPercentage
                        ? `${(parseFloat(holding.ownershipPercentage) * 100).toFixed(2)}%`
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {holding.tokenAccountAddress ? (
                        <AddressLabel address={holding.tokenAccountAddress} />
                      ) : (
                        <span className="text-muted-foreground">—</span>
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
