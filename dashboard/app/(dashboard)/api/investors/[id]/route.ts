import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { investors, investorHoldings, tokens } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const investor = await db
      .select()
      .from(investors)
      .where(eq(investors.id, id))
      .limit(1);

    if (investor.length === 0) {
      return NextResponse.json({ error: "Investor not found" }, { status: 404 });
    }

    const holdings = await db
      .select({
        id: investorHoldings.id,
        balance: investorHoldings.balance,
        ownershipPercentage: investorHoldings.ownershipPercentage,
        tokenAccountAddress: investorHoldings.tokenAccountAddress,
        tokenName: tokens.name,
        tokenSymbol: tokens.symbol,
        tokenMintAddress: tokens.mintAddress,
      })
      .from(investorHoldings)
      .innerJoin(tokens, eq(investorHoldings.tokenId, tokens.id))
      .where(eq(investorHoldings.investorId, id));

    return NextResponse.json({
      investor: investor[0],
      holdings,
    });
  } catch (error) {
    console.error("Failed to fetch investor:", error);
    return NextResponse.json({ error: "Failed to fetch investor" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();

    const result = await db
      .update(investors)
      .set({
        walletAddress: body.walletAddress,
        name: body.name,
        email: body.email,
        entityType: body.entityType,
        jurisdiction: body.jurisdiction,
        kycStatus: body.kycStatus,
        accreditationStatus: body.accreditationStatus,
        accreditationExpiry: body.accreditationExpiry,
        amlStatus: body.amlStatus,
        pepStatus: body.pepStatus,
        sanctionsStatus: body.sanctionsStatus,
        notes: body.notes,
        updatedAt: new Date(),
      })
      .where(eq(investors.id, id))
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ error: "Investor not found" }, { status: 404 });
    }

    return NextResponse.json({ investor: result[0] });
  } catch (error) {
    console.error("Failed to update investor:", error);
    return NextResponse.json({ error: "Failed to update investor" }, { status: 500 });
  }
}
