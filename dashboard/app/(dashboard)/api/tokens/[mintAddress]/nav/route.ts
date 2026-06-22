import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { navRecords, tokens } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

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

    const records = await db
      .select()
      .from(navRecords)
      .where(eq(navRecords.tokenId, token[0].id))
      .orderBy(desc(navRecords.valuationDate));

    return NextResponse.json({ records });
  } catch (error) {
    console.error("Failed to fetch NAV records:", error);
    return NextResponse.json({ records: [] });
  }
}

export async function POST(
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

    const body = await request.json();

    const result = await db
      .insert(navRecords)
      .values({
        tokenId: token[0].id,
        navPerToken: body.navPerToken,
        totalAssets: body.totalAssets || null,
        totalLiabilities: body.totalLiabilities || null,
        outstandingTokens: body.outstandingTokens || null,
        valuationDate: new Date(body.valuationDate || Date.now()),
        source: body.source || "manual",
        verifiedBy: body.verifiedBy || null,
      })
      .returning();

    return NextResponse.json({ record: result[0] });
  } catch (error) {
    console.error("Failed to create NAV record:", error);
    return NextResponse.json({ error: "Failed to create NAV record" }, { status: 500 });
  }
}
