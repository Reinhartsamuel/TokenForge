import { S3 } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

const s3 = new S3({
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  region: "auto",
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

export async function POST(request: NextRequest) {
  const bucket = process.env.R2_BUCKET_NAME;
  if (!bucket) {
    return NextResponse.json({ error: "R2_BUCKET_NAME not configured" }, { status: 500 });
  }

  const body = await request.json();
  const { metadata } = body;

  if (!metadata?.name || !metadata?.symbol) {
    return NextResponse.json({ error: "name and symbol are required" }, { status: 400 });
  }

  const key = `metadata/${metadata.symbol.toLowerCase()}-${Date.now()}.json`;

  try {
    await s3.putObject({
      Bucket: bucket,
      Key: key,
      Body: JSON.stringify(metadata),
      ContentType: "application/json",
    });

    const publicUrl = `${process.env.R2_PUBLIC_URL || `https://${process.env.R2_BUCKET_NAME}.pub.${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`}/${key}`;

    return NextResponse.json({ url: publicUrl, key });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
  }
}
