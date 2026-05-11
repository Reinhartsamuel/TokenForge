import { NextRequest, NextResponse } from "next/server";
import { Keypair, PublicKey, Connection, Transaction, TransactionInstruction, SystemProgram } from "@solana/web3.js";
import {
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import type { Address } from "@solana/kit";
import {
  deriveVerificationConfigPda,
  deriveProofAccountPda,
  derivePermanentDelegatePda,
} from "@/lib/sdk/l1/derive";
import {
  TOKEN_2022_PROGRAM_ID,
  SYSTEM_PROGRAM_ID,
  INSTRUCTIONS_SYSVAR_ID,
  SSTS_PROGRAM_ID,
  TRANSFER_HOOK_PROGRAM_ID,
} from "@/lib/sdk";

const DEVNET_RPC = "https://api.devnet.solana.com";
const TOKEN_2022_PK = new PublicKey(TOKEN_2022_PROGRAM_ID);
const SSTS_PK = new PublicKey(SSTS_PROGRAM_ID);
const ASSOCIATED_TOKEN_PROGRAM_ID = "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";

async function getDb() {
  if (!process.env.DATABASE_URL) return null;
  try {
    const { db } = await import("@/lib/db");
    const { distributions, distributionClaims, transactions, tokens } = await import("@/db/schema");
    return { db, distributions, distributionClaims, transactions, tokens };
  } catch {
    return null;
  }
}

function hexToUint8Array(hex: string): Uint8Array {
  if (hex.startsWith("0x")) hex = hex.slice(2);
  if (hex.length !== 64) throw new Error(`Expected 64 hex chars (32 bytes), got ${hex.length}`);
  return Uint8Array.from(Buffer.from(hex, "hex"));
}

function getKeypair(): Keypair {
  const keypairBase64 = process.env.TEST_WALLET_KEYPAIR;
  if (!keypairBase64) throw new Error("TEST_WALLET_KEYPAIR not set in .env");
  let secretKey: Uint8Array;
  if (keypairBase64.startsWith("[")) {
    const numbers = JSON.parse(keypairBase64) as number[];
    secretKey = new Uint8Array(numbers);
  } else {
    secretKey = Uint8Array.from(Buffer.from(keypairBase64, "base64"));
  }
  return Keypair.fromSecretKey(secretKey);
}

async function simulateAndSend(connection: Connection, tx: Transaction) {
  const simResult = await connection.simulateTransaction(tx);
  if (simResult.value.err) {
    return {
      error: "Simulation failed",
      details: simResult.value.err,
      logs: simResult.value.logs,
    };
  }
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  const signature = await connection.sendRawTransaction(tx.serialize(), {
    skipPreflight: false,
    preflightCommitment: "confirmed",
  });
  await connection.confirmTransaction(
    { signature, blockhash, lastValidBlockHeight },
    "confirmed"
  );
  return { success: true, signature, blockhash, lastValidBlockHeight };
}

export async function POST(req: NextRequest) {
  try {
    const payer = getKeypair();
    const payerAddress = payer.publicKey.toBase58() as Address;
    const connection = new Connection(DEVNET_RPC, "confirmed");
    const body = await req.json();
    const { action } = body;

    if (!action) {
      return NextResponse.json({ error: "action is required" }, { status: 400 });
    }

    switch (action) {
      // ── Create Distribution Escrow ──────────────────────────────
      case "create": {
        const { mintAddress, merkleRoot: merkleRootHex, escrowTokenAccount, actionId } = body;
        if (!mintAddress || !merkleRootHex) {
          return NextResponse.json(
            { error: "mintAddress and merkleRoot are required" },
            { status: 400 }
          );
        }

        const mintPubkey = new PublicKey(mintAddress);
        const mintAddr = mintAddress as Address;
        const merkleRoot = hexToUint8Array(merkleRootHex);

        const [verificationConfigPda] = await deriveVerificationConfigPda(mintAddr, 20, SSTS_PROGRAM_ID);

        // Use existing escrow ATA or derive one owned by the mint PDA (distributionEscrowAuthority = mint)
        let distributionTokenAccount: PublicKey;
        if (escrowTokenAccount) {
          distributionTokenAccount = new PublicKey(escrowTokenAccount);
        } else {
          // Derive ATA for mint with the mint PDA as the owner (distributionEscrowAuthority)
          // The canonical SSTS uses the mint itself as the escrow authority
          distributionTokenAccount = getAssociatedTokenAddressSync(
            mintPubkey,
            mintPubkey, // owner = mint (acts as distribution escrow authority)
            false,
            TOKEN_2022_PK
          );
        }

        // data: discriminator(1) + actionId(8) + merkleRoot(32) = 41 bytes
        const actionIdVal = BigInt(actionId ?? 0);
        const data = Buffer.alloc(41);
        data.writeUInt8(20, 0); // discriminator
        data.writeBigUInt64LE(actionIdVal, 1);
        Buffer.from(merkleRoot).copy(data, 9);

        const ix = new TransactionInstruction({
          programId: SSTS_PK,
          keys: [
            { pubkey: mintPubkey, isSigner: false, isWritable: false },
            { pubkey: new PublicKey(verificationConfigPda), isSigner: false, isWritable: false },
            { pubkey: new PublicKey(INSTRUCTIONS_SYSVAR_ID), isSigner: false, isWritable: false },
            { pubkey: mintPubkey, isSigner: false, isWritable: false }, // distributionEscrowAuthority = mint
            { pubkey: payer.publicKey, isSigner: true, isWritable: true },
            { pubkey: distributionTokenAccount, isSigner: false, isWritable: true },
            { pubkey: mintPubkey, isSigner: false, isWritable: false }, // distributionMint
            { pubkey: TOKEN_2022_PK, isSigner: false, isWritable: false },
            { pubkey: new PublicKey(ASSOCIATED_TOKEN_PROGRAM_ID), isSigner: false, isWritable: false },
            { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
          ],
          data,
        });

        const tx = new Transaction();
        const distAtaExists = await connection.getAccountInfo(distributionTokenAccount);
        if (!distAtaExists && !escrowTokenAccount) {
          tx.add(
            createAssociatedTokenAccountInstruction(
              payer.publicKey,
              distributionTokenAccount,
              mintPubkey, // owner = mint PDA
              mintPubkey,
              TOKEN_2022_PK
            )
          );
        }
        tx.add(ix);
        tx.feePayer = payer.publicKey;
        tx.sign(payer);

        const result = await simulateAndSend(connection, tx);
        if ("error" in result) {
          return NextResponse.json(result, { status: 400 });
        }

        const dbClient = await getDb();
        if (dbClient) {
          try {
            const { db, distributions, transactions, tokens } = dbClient;
            const { eq } = await import("drizzle-orm");
            const [tokenRecord] = await db.select().from(tokens).where(
              eq(tokens.mintAddress, mintAddress)
            ).limit(1);

            await db.insert(distributions).values({
              tokenId: tokenRecord?.id || null,
              escrowAta: distributionTokenAccount.toBase58(),
              merkleRoot: merkleRootHex,
              actionId: parseInt(actionIdVal.toString()),
              status: "active",
            });

            await db.insert(transactions).values({
              tokenId: tokenRecord?.id || null,
              signature: result.signature,
              type: "distribution_create",
              status: "confirmed",
              fromAddress: payerAddress,
              metadata: {
                escrowTokenAccount: distributionTokenAccount.toBase58(),
                verificationConfigPda,
                merkleRoot: merkleRootHex,
                actionId: actionIdVal.toString(),
              },
              explorerUrl: `https://explorer.solana.com/tx/${result.signature}?cluster=devnet`,
            });
          } catch (dbError) {
            console.error("[api/distribution] DB write error (non-fatal):", dbError);
          }
        }

        return NextResponse.json({
          success: true,
          signature: result.signature,
          action: "create",
          mint: mintAddress,
          escrowTokenAccount: distributionTokenAccount.toBase58(),
          verificationConfigPda,
          merkleRoot: merkleRootHex,
          actionId: actionIdVal.toString(),
          explorerUrl: `https://explorer.solana.com/tx/${result.signature}?cluster=devnet`,
        });
      }

      // ── Claim Distribution ─────────────────────────────────────
      case "claim": {
        const {
          mintAddress, claimantAddress, amount, merkleRoot: merkleRootHex,
          actionId, leafIndex, proofs,
        } = body;
        if (!mintAddress || !claimantAddress || !amount || !merkleRootHex) {
          return NextResponse.json(
            { error: "mintAddress, claimantAddress, amount, and merkleRoot are required" },
            { status: 400 }
          );
        }

        const mintPubkey = new PublicKey(mintAddress);
        const mintAddr = mintAddress as Address;
        const claimantPubkey = new PublicKey(claimantAddress);
        const claimantAddr = claimantAddress as Address;
        const merkleRoot = hexToUint8Array(merkleRootHex);
        const actionIdVal = BigInt(actionId ?? 0);
        const decimals = parseInt(body.decimals || "6");
        const amountRaw = BigInt(Math.floor(parseFloat(String(amount)) * 10 ** decimals));

        const [verificationConfigPda] = await deriveVerificationConfigPda(mintAddr, 21, SSTS_PROGRAM_ID);
        const [proofPda] = await deriveProofAccountPda(mintAddr, claimantAddr, SSTS_PROGRAM_ID);
        const [permanentDelegatePda] = await derivePermanentDelegatePda(mintAddr, SSTS_PROGRAM_ID);

        // Derive claimant ATA
        const claimantAta = getAssociatedTokenAddressSync(
          mintPubkey, claimantPubkey, false, TOKEN_2022_PK
        );

        // Derive escrow ATA (owned by mint PDA)
        const escrowTokenAccount = getAssociatedTokenAddressSync(
          mintPubkey, mintPubkey, false, TOKEN_2022_PK
        );

        const instructions: TransactionInstruction[] = [];

        // 1. Create proof account if proofs are provided
        const proofItems: Uint8Array[] = [];
        if (proofs && Array.isArray(proofs) && proofs.length > 0) {
          for (const p of proofs) {
            proofItems.push(hexToUint8Array(p));
          }
        }

        if (proofItems.length > 0) {
          // CreateProofAccount: discriminator 18
          // data: discriminator(1) + actionId(8) + vec_length(4) + vec_elements(N*32)
          const cpaData = Buffer.alloc(1 + 8 + 4 + proofItems.length * 32);
          cpaData.writeUInt8(18, 0);
          cpaData.writeBigUInt64LE(actionIdVal, 1);
          cpaData.writeUInt32LE(proofItems.length, 9);
          let cpaOffset = 13;
          for (const p of proofItems) {
            Buffer.from(p).copy(cpaData, cpaOffset);
            cpaOffset += 32;
          }

          const createProofIx = new TransactionInstruction({
            programId: SSTS_PK,
            keys: [
              { pubkey: mintPubkey, isSigner: false, isWritable: false },
              { pubkey: new PublicKey(verificationConfigPda), isSigner: false, isWritable: false },
              { pubkey: new PublicKey(INSTRUCTIONS_SYSVAR_ID), isSigner: false, isWritable: false },
              { pubkey: payer.publicKey, isSigner: true, isWritable: true },
              { pubkey: mintPubkey, isSigner: false, isWritable: false },
              { pubkey: new PublicKey(proofPda), isSigner: false, isWritable: true },
              { pubkey: claimantAta, isSigner: false, isWritable: false },
              { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
            ],
            data: cpaData,
          });
          instructions.push(createProofIx);
        }

        // 2. ClaimDistribution: discriminator 21
        // data: discriminator(1) + actionId(8) + amount(8) + merkleRoot(32) + leafIndex(4) + merkleProof option
        const hasProof = proofItems.length > 0;
        const claimDataSize = 1 + 8 + 8 + 32 + 4 + (hasProof ? (1 + 4 + proofItems.length * 32) : 1);
        const claimData = Buffer.alloc(claimDataSize);
        claimData.writeUInt8(21, 0);
        claimData.writeBigUInt64LE(actionIdVal, 1);
        claimData.writeBigUInt64LE(amountRaw, 9);
        Buffer.from(merkleRoot).copy(claimData, 17);
        claimData.writeUInt32LE(leafIndex ?? 0, 49);

        if (hasProof) {
          claimData.writeUInt8(1, 53); // Some
          claimData.writeUInt32LE(proofItems.length, 54);
          let cdOffset = 58;
          for (const p of proofItems) {
            Buffer.from(p).copy(claimData, cdOffset);
            cdOffset += 32;
          }
        } else {
          claimData.writeUInt8(0, 53); // None
        }

        const claimIx = new TransactionInstruction({
          programId: SSTS_PK,
          keys: [
            { pubkey: mintPubkey, isSigner: false, isWritable: false },
            { pubkey: new PublicKey(verificationConfigPda), isSigner: false, isWritable: false },
            { pubkey: new PublicKey(INSTRUCTIONS_SYSVAR_ID), isSigner: false, isWritable: false },
            { pubkey: new PublicKey(permanentDelegatePda), isSigner: false, isWritable: false },
            { pubkey: payer.publicKey, isSigner: true, isWritable: true },
            { pubkey: mintPubkey, isSigner: false, isWritable: false },
            { pubkey: claimantAta, isSigner: false, isWritable: true },
            { pubkey: escrowTokenAccount, isSigner: false, isWritable: true },
            { pubkey: new PublicKey(proofPda), isSigner: false, isWritable: true }, // receiptAccount
            { pubkey: new PublicKey(proofPda), isSigner: false, isWritable: false }, // proofAccount
            { pubkey: new PublicKey(TRANSFER_HOOK_PROGRAM_ID), isSigner: false, isWritable: false },
            { pubkey: TOKEN_2022_PK, isSigner: false, isWritable: false },
            { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
          ],
          data: claimData,
        });
        instructions.push(claimIx);

        const tx = new Transaction();
        tx.add(...instructions);
        tx.feePayer = payer.publicKey;
        tx.sign(payer);

        const result = await simulateAndSend(connection, tx);
        if ("error" in result) {
          return NextResponse.json(
            { ...result, debugInfo: { proofPda, verificationConfigPda, claimantAta: claimantAta.toBase58() } },
            { status: 400 }
          );
        }

        return NextResponse.json({
          success: true,
          signature: result.signature,
          action: "claim",
          mint: mintAddress,
          claimant: claimantAddress,
          claimantTokenAccount: claimantAta.toBase58(),
          proofAccount: proofPda,
          amount: amountRaw.toString(),
          explorerUrl: `https://explorer.solana.com/tx/${result.signature}?cluster=devnet`,
        });
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (error: any) {
    console.error("[api/distribution] Error:", error);
    return NextResponse.json(
      { error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}
