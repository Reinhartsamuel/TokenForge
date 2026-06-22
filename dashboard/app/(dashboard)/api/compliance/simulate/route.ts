import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { complianceRules, investors, fampPolicies, fampPolicyEntries } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tokenId, fromWallet, toWallet, amount } = body;

    if (!tokenId || !fromWallet || !toWallet) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const rules = await db
      .select()
      .from(complianceRules)
      .where(eq(complianceRules.tokenId, tokenId));

    const enabledRules = rules.filter(r => r.enabled);
    const violations: string[] = [];

    for (const rule of enabledRules) {
      const config = rule.ruleConfig as any;

      switch (rule.ruleType) {
        case "jurisdiction": {
          const allowedJurisdictions = config.allowedJurisdictions || [];
          const toInvestor = await db
            .select()
            .from(investors)
            .where(eq(investors.walletAddress, toWallet))
            .limit(1);

          if (toInvestor.length > 0 && toInvestor[0].jurisdiction) {
            if (!allowedJurisdictions.includes(toInvestor[0].jurisdiction)) {
              violations.push(`Recipient jurisdiction ${toInvestor[0].jurisdiction} not allowed`);
            }
          }
          break;
        }
        case "kyc_requirement": {
          const requiredLevel = config.requiredKycLevel || "pending";
          const toInvestor = await db
            .select()
            .from(investors)
            .where(eq(investors.walletAddress, toWallet))
            .limit(1);

          if (toInvestor.length > 0) {
            const kycLevels = ["pending", "verified", "accredited"];
            const currentLevel = toInvestor[0].kycStatus || "pending";
            if (kycLevels.indexOf(currentLevel) < kycLevels.indexOf(requiredLevel)) {
              violations.push(`Recipient KYC level ${currentLevel} below required ${requiredLevel}`);
            }
          } else {
            violations.push("Recipient not found in investor registry");
          }
          break;
        }
        case "lockup": {
          const lockupEnd = config.lockupEnd ? new Date(config.lockupEnd) : null;
          if (lockupEnd && lockupEnd > new Date()) {
            violations.push(`Token is locked until ${lockupEnd.toISOString()}`);
          }
          break;
        }
        case "transfer_restriction": {
          if (config.blockTransfers) {
            violations.push("Transfers are currently blocked");
          }
          break;
        }
      }
    }

    const policy = await db
      .select()
      .from(fampPolicies)
      .where(eq(fampPolicies.tokenId, tokenId))
      .limit(1);

    if (policy.length > 0) {
      const entries = await db
        .select()
        .from(fampPolicyEntries)
        .where(eq(fampPolicyEntries.policyId, policy[0].id));

      const allowlist = entries.filter(e => e.listType === "allowlist").map(e => e.walletAddress);
      const blocklist = entries.filter(e => e.listType === "blocklist").map(e => e.walletAddress);

      if (policy[0].allowlistMode) {
        if (allowlist.length > 0 && !allowlist.includes(toWallet)) {
          violations.push("Recipient not on allowlist");
        }
      } else {
        if (blocklist.includes(toWallet)) {
          violations.push("Recipient is on blocklist");
        }
      }
    }

    return NextResponse.json({
      allowed: violations.length === 0,
      violations,
      rulesChecked: enabledRules.length,
    });
  } catch (error) {
    console.error("Failed to simulate transfer:", error);
    return NextResponse.json({ error: "Failed to simulate transfer" }, { status: 500 });
  }
}
