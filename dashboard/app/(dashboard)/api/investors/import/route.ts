import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { investors } from "@/db/schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { investors: investorData } = body;

    if (!Array.isArray(investorData)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    const results = [];
    const errors = [];

    for (const data of investorData) {
      try {
        const result = await db
          .insert(investors)
          .values({
            walletAddress: data.walletAddress || null,
            name: data.name || null,
            email: data.email || null,
            entityType: data.entityType || "individual",
            jurisdiction: data.jurisdiction || null,
            kycStatus: data.kycStatus || "pending",
            accreditationStatus: data.accreditationStatus || "pending",
            accreditationExpiry: data.accreditationExpiry || null,
            amlStatus: data.amlStatus || "pending",
            pepStatus: data.pepStatus || false,
            sanctionsStatus: data.sanctionsStatus || "pending",
            notes: data.notes || null,
          })
          .returning();
        results.push(result[0]);
      } catch (error: any) {
        if (error.code === "23505") {
          errors.push(`Wallet ${data.walletAddress} already exists`);
        } else {
          errors.push(`Failed to import ${data.name || data.walletAddress}`);
        }
      }
    }

    return NextResponse.json({
      imported: results.length,
      errors: errors.length,
      errorDetails: errors,
      investors: results,
    });
  } catch (error) {
    console.error("Failed to import investors:", error);
    return NextResponse.json({ error: "Failed to import investors" }, { status: 500 });
  }
}
