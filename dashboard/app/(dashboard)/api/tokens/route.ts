import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { tokens } from "@/db/schema";
import { desc, like, or } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    let result;
    
    if (search) {
      result = await db
        .select()
        .from(tokens)
        .where(
          or(
            like(tokens.name, `%${search}%`),
            like(tokens.symbol, `%${search}%`),
            like(tokens.mintAddress, `%${search}%`)
          )
        )
        .orderBy(desc(tokens.createdAt))
        .limit(limit)
        .offset(offset);
    } else {
      result = await db
        .select()
        .from(tokens)
        .orderBy(desc(tokens.createdAt))
        .limit(limit)
        .offset(offset);
    }

    return NextResponse.json({ tokens: result });
  } catch (error) {
    console.error("Failed to fetch tokens:", error);
    return NextResponse.json({ tokens: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = await db
      .insert(tokens)
      .values({
        mintAddress: body.mintAddress,
        name: body.name,
        symbol: body.symbol,
        decimals: body.decimals || 6,
        uri: body.uri || null,
        description: body.description || null,
        imageUrl: body.imageUrl || null,
        mintAuthorityPda: body.mintAuthorityPda || null,
        freezeAuthorityPda: body.freezeAuthorityPda || null,
        verificationConfigPda: body.verificationConfigPda || null,
        creatorAddress: body.creatorAddress,
        network: body.network || "devnet",
        status: "active",
      })
      .returning();

    return NextResponse.json({ token: result[0] });
  } catch (error: any) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Token with this mint address already exists" }, { status: 409 });
    }
    console.error("Failed to create token record:", error);
    return NextResponse.json({ error: "Failed to create token record" }, { status: 500 });
  }
}
