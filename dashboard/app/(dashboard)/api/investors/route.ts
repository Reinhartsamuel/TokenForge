import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { investors, investorHoldings, tokens } from "@/db/schema";
import { desc, like, or, eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const kycStatus = searchParams.get("kycStatus") || "";
    const jurisdiction = searchParams.get("jurisdiction") || "";
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    let query = db.select().from(investors);

    if (search || kycStatus || jurisdiction) {
      const conditions = [];
      if (search) {
        conditions.push(or(
          like(investors.name, `%${search}%`),
          like(investors.email, `%${search}%`),
          like(investors.walletAddress, `%${search}%`)
        ));
      }
      if (kycStatus) {
        conditions.push(eq(investors.kycStatus, kycStatus));
      }
      if (jurisdiction) {
        conditions.push(eq(investors.jurisdiction, jurisdiction));
      }
      query = query.where(or(...conditions)) as typeof query;
    }

    const result = await query
      .orderBy(desc(investors.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({ investors: result });
  } catch (error) {
    console.error("Failed to fetch investors:", error);
    return NextResponse.json({ investors: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = await db
      .insert(investors)
      .values({
        walletAddress: body.walletAddress || null,
        name: body.name || null,
        email: body.email || null,
        entityType: body.entityType || "individual",
        jurisdiction: body.jurisdiction || null,
        kycStatus: body.kycStatus || "pending",
        accreditationStatus: body.accreditationStatus || "pending",
        accreditationExpiry: body.accreditationExpiry || null,
        amlStatus: body.amlStatus || "pending",
        pepStatus: body.pepStatus || false,
        sanctionsStatus: body.sanctionsStatus || "pending",
        notes: body.notes || null,
      })
      .returning();

    return NextResponse.json({ investor: result[0] });
  } catch (error: any) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Investor with this wallet address already exists" }, { status: 409 });
    }
    console.error("Failed to create investor:", error);
    return NextResponse.json({ error: "Failed to create investor" }, { status: 500 });
  }
}
