import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { complianceRules } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();

    const result = await db
      .update(complianceRules)
      .set({
        ruleType: body.ruleType,
        ruleConfig: body.ruleConfig,
        enabled: body.enabled,
        updatedAt: new Date(),
      })
      .where(eq(complianceRules.id, id))
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ error: "Compliance rule not found" }, { status: 404 });
    }

    return NextResponse.json({ rule: result[0] });
  } catch (error) {
    console.error("Failed to update compliance rule:", error);
    return NextResponse.json({ error: "Failed to update compliance rule" }, { status: 500 });
  }
}
