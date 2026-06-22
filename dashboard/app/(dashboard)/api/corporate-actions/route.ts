import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { corporateActions, tokens } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tokenId = searchParams.get("tokenId") || "";
    const type = searchParams.get("type") || "";
    const status = searchParams.get("status") || "";
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    let query = db
      .select({
        id: corporateActions.id,
        tokenId: corporateActions.tokenId,
        type: corporateActions.type,
        title: corporateActions.title,
        description: corporateActions.description,
        status: corporateActions.status,
        executionDate: corporateActions.executionDate,
        snapshotDate: corporateActions.snapshotDate,
        totalAmount: corporateActions.totalAmount,
        metadata: corporateActions.metadata,
        createdAt: corporateActions.createdAt,
        updatedAt: corporateActions.updatedAt,
        tokenName: tokens.name,
        tokenSymbol: tokens.symbol,
        tokenMintAddress: tokens.mintAddress,
      })
      .from(corporateActions)
      .innerJoin(tokens, eq(corporateActions.tokenId, tokens.id));

    const conditions = [];
    if (tokenId) conditions.push(eq(corporateActions.tokenId, tokenId));
    if (type) conditions.push(eq(corporateActions.type, type));
    if (status) conditions.push(eq(corporateActions.status, status));

    if (conditions.length > 0) {
      query = query.where(conditions[0]) as typeof query;
    }

    const result = await query
      .orderBy(desc(corporateActions.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({ actions: result });
  } catch (error) {
    console.error("Failed to fetch corporate actions:", error);
    return NextResponse.json({ actions: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = await db
      .insert(corporateActions)
      .values({
        tokenId: body.tokenId,
        type: body.type,
        title: body.title,
        description: body.description || null,
        status: body.status || "pending",
        executionDate: body.executionDate || null,
        snapshotDate: body.snapshotDate || null,
        totalAmount: body.totalAmount || null,
        metadata: body.metadata || null,
      })
      .returning();

    return NextResponse.json({ action: result[0] });
  } catch (error) {
    console.error("Failed to create corporate action:", error);
    return NextResponse.json({ error: "Failed to create corporate action" }, { status: 500 });
  }
}
