import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { tranches, tokens } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

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

    const trancheList = await db
      .select({
        id: tranches.id,
        spvTokenId: tranches.spvTokenId,
        trancheTokenId: tranches.trancheTokenId,
        trancheType: tranches.trancheType,
        priority: tranches.priority,
        targetAllocation: tranches.targetAllocation,
        couponRate: tranches.couponRate,
        minSubscription: tranches.minSubscription,
        maxSubscription: tranches.maxSubscription,
        createdAt: tranches.createdAt,
        trancheTokenName: tokens.name,
        trancheTokenSymbol: tokens.symbol,
      })
      .from(tranches)
      .leftJoin(tokens, eq(tranches.trancheTokenId, tokens.id))
      .where(eq(tranches.spvTokenId, token[0].id))
      .orderBy(asc(tranches.priority));

    return NextResponse.json({ tranches: trancheList });
  } catch (error) {
    console.error("Failed to fetch tranches:", error);
    return NextResponse.json({ tranches: [] });
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
      .insert(tranches)
      .values({
        spvTokenId: token[0].id,
        trancheTokenId: body.trancheTokenId || null,
        trancheType: body.trancheType,
        priority: body.priority,
        targetAllocation: body.targetAllocation || null,
        couponRate: body.couponRate || null,
        minSubscription: body.minSubscription || null,
        maxSubscription: body.maxSubscription || null,
      })
      .returning();

    return NextResponse.json({ tranche: result[0] });
  } catch (error) {
    console.error("Failed to create tranche:", error);
    return NextResponse.json({ error: "Failed to create tranche" }, { status: 500 });
  }
}
