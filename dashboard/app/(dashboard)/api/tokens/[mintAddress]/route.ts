import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { tokens } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ mintAddress: string }> }
) {
  try {
    const { mintAddress } = await params;

    const result = await db
      .select()
      .from(tokens)
      .where(eq(tokens.mintAddress, mintAddress))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json({ error: "Token not found" }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Failed to fetch token:", error);
    return NextResponse.json({ error: "Failed to fetch token" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ mintAddress: string }> }
) {
  try {
    const { mintAddress } = await params;
    const body = await request.json();

    const result = await db
      .update(tokens)
      .set({
        status: body.status,
        updatedAt: new Date(),
      })
      .where(eq(tokens.mintAddress, mintAddress))
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ error: "Token not found" }, { status: 404 });
    }

    return NextResponse.json({ token: result[0] });
  } catch (error) {
    console.error("Failed to update token:", error);
    return NextResponse.json({ error: "Failed to update token" }, { status: 500 });
  }
}
