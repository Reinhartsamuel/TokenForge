import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { complianceRules, tokens } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tokenId = searchParams.get("tokenId") || "";
    const ruleType = searchParams.get("ruleType") || "";
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    let query = db
      .select({
        id: complianceRules.id,
        tokenId: complianceRules.tokenId,
        ruleType: complianceRules.ruleType,
        ruleConfig: complianceRules.ruleConfig,
        enabled: complianceRules.enabled,
        createdAt: complianceRules.createdAt,
        updatedAt: complianceRules.updatedAt,
        tokenName: tokens.name,
        tokenSymbol: tokens.symbol,
        tokenMintAddress: tokens.mintAddress,
      })
      .from(complianceRules)
      .innerJoin(tokens, eq(complianceRules.tokenId, tokens.id));

    if (tokenId) {
      query = query.where(eq(complianceRules.tokenId, tokenId)) as typeof query;
    } else if (ruleType) {
      query = query.where(eq(complianceRules.ruleType, ruleType)) as typeof query;
    }

    const result = await query
      .orderBy(desc(complianceRules.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({ rules: result });
  } catch (error) {
    console.error("Failed to fetch compliance rules:", error);
    return NextResponse.json({ rules: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = await db
      .insert(complianceRules)
      .values({
        tokenId: body.tokenId,
        ruleType: body.ruleType,
        ruleConfig: body.ruleConfig,
        enabled: body.enabled !== undefined ? body.enabled : true,
      })
      .returning();

    return NextResponse.json({ rule: result[0] });
  } catch (error) {
    console.error("Failed to create compliance rule:", error);
    return NextResponse.json({ error: "Failed to create compliance rule" }, { status: 500 });
  }
}
