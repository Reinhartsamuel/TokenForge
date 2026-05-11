import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { tokens, fampPolicies, distributions, transactions } from "@/db/schema";
import { count, eq } from "drizzle-orm";

export async function GET() {
  try {
    const [tokenCount, policyCount, distCount, txCount] = await Promise.all([
      db.select({ count: count() }).from(tokens),
      db.select({ count: count() }).from(fampPolicies),
      db.select({ count: count() }).from(distributions),
      db.select({ count: count() }).from(transactions),
    ]);

    return NextResponse.json({
      totalTokens: tokenCount[0]?.count || 0,
      activePolicies: policyCount[0]?.count || 0,
      totalDistributions: distCount[0]?.count || 0,
      totalTransactions: txCount[0]?.count || 0,
    });
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    return NextResponse.json({
      totalTokens: 0,
      activePolicies: 0,
      totalDistributions: 0,
      totalTransactions: 0,
    });
  }
}
