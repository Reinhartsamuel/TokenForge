import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { transactions, tokens } from "@/db/schema";
import { desc, eq, like, or } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tokenAddress = searchParams.get("token") || "";
    const type = searchParams.get("type") || "";
    const limit = parseInt(searchParams.get("limit") || "50");

    let result;

    const baseQuery = db
      .select({
        id: transactions.id,
        type: transactions.type,
        status: transactions.status,
        fromAddress: transactions.fromAddress,
        toAddress: transactions.toAddress,
        amount: transactions.amount,
        signature: transactions.signature,
        explorerUrl: transactions.explorerUrl,
        createdAt: transactions.createdAt,
        tokenName: tokens.name,
        tokenSymbol: tokens.symbol,
      })
      .from(transactions)
      .leftJoin(tokens, eq(transactions.tokenId, tokens.id))
      .orderBy(desc(transactions.createdAt));

    if (tokenAddress) {
      result = await baseQuery
        .where(eq(tokens.mintAddress, tokenAddress))
        .limit(limit);
    } else {
      result = await baseQuery.limit(limit);
    }

    return NextResponse.json({ transactions: result });
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    return NextResponse.json({ transactions: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = await db
      .insert(transactions)
      .values({
        tokenId: body.tokenId || null,
        signature: body.signature,
        type: body.type,
        status: body.status,
        fromAddress: body.fromAddress || null,
        toAddress: body.toAddress || null,
        amount: body.amount || null,
        metadata: body.metadata || null,
        explorerUrl: body.explorerUrl || null,
      })
      .returning();

    return NextResponse.json({ transaction: result[0] });
  } catch (error) {
    console.error("Failed to create transaction record:", error);
    return NextResponse.json({ error: "Failed to create transaction record" }, { status: 500 });
  }
}
