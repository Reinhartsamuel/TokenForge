import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { corporateActions } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const action = await db
      .select()
      .from(corporateActions)
      .where(eq(corporateActions.id, id))
      .limit(1);

    if (action.length === 0) {
      return NextResponse.json({ error: "Corporate action not found" }, { status: 404 });
    }

    return NextResponse.json({ action: action[0] });
  } catch (error) {
    console.error("Failed to fetch corporate action:", error);
    return NextResponse.json({ error: "Failed to fetch corporate action" }, { status: 500 });
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
      .update(corporateActions)
      .set({
        title: body.title,
        description: body.description,
        status: body.status,
        executionDate: body.executionDate,
        snapshotDate: body.snapshotDate,
        totalAmount: body.totalAmount,
        metadata: body.metadata,
        updatedAt: new Date(),
      })
      .where(eq(corporateActions.id, id))
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ error: "Corporate action not found" }, { status: 404 });
    }

    return NextResponse.json({ action: result[0] });
  } catch (error) {
    console.error("Failed to update corporate action:", error);
    return NextResponse.json({ error: "Failed to update corporate action" }, { status: 500 });
  }
}
