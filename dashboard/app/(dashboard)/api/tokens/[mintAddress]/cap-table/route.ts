import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { investorHoldings, investors, tokens } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ mintAddress: string }> }
) {
  const { mintAddress } = await params;
  try {
    const token = await db
      .select()
      .from(tokens)
      .where(eq(tokens.mintAddress, mintAddress))
      .limit(1);

    if (token.length === 0) {
      return NextResponse.json({ error: "Token not found" }, { status: 404 });
    }

    const holdings = await db
      .select({
        id: investorHoldings.id,
        investorId: investorHoldings.investorId,
        tokenAccountAddress: investorHoldings.tokenAccountAddress,
        balance: investorHoldings.balance,
        ownershipPercentage: investorHoldings.ownershipPercentage,
        lastUpdated: investorHoldings.lastUpdated,
        investorName: investors.name,
        investorEmail: investors.email,
        investorWallet: investors.walletAddress,
        investorKycStatus: investors.kycStatus,
        investorJurisdiction: investors.jurisdiction,
        investorAccreditation: investors.accreditationStatus,
      })
      .from(investorHoldings)
      .innerJoin(investors, eq(investorHoldings.investorId, investors.id))
      .where(eq(investorHoldings.tokenId, token[0].id))
      .orderBy(desc(investorHoldings.balance));

    const totalSupply = holdings.reduce((sum, h) => sum + parseFloat(h.balance || "0"), 0);

    return NextResponse.json({
      holders: holdings,
      totalHolders: holdings.length,
      totalSupply: totalSupply.toString(),
    });
  } catch (error) {
    console.error("Failed to fetch cap table:", error);
    return NextResponse.json({ holders: [], totalHolders: 0, totalSupply: "0" });
  }
}
