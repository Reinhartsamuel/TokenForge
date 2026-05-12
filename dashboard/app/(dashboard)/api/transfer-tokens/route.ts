import { NextRequest, NextResponse } from "next/server";
import { Keypair, PublicKey, Connection, Transaction, TransactionInstruction, SystemProgram } from "@solana/web3.js";
import type { Address } from "@solana/kit";
import {
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import {
  deriveMintAuthorityPda,
  deriveVerificationConfigPda,
  derivePermanentDelegatePda,
  deriveTransferHookPda,
} from "@/lib/sdk/l1/derive";
import {
  TOKEN_2022_PROGRAM_ID,
  SYSTEM_PROGRAM_ID,
  INSTRUCTIONS_SYSVAR_ID,
  SSTS_PROGRAM_ID,
  NOOP_VERIFICATION_PROGRAM_ID,
  FAMP_PROGRAM_ID,
  TRANSFER_HOOK_PROGRAM_ID,
} from "@/lib/sdk";

const DEVNET_RPC = "https://api.devnet.solana.com";
const TOKEN_2022_PK = new PublicKey(TOKEN_2022_PROGRAM_ID);

export async function POST(req: NextRequest) {
  try {
    const keypairBase64 = process.env.TEST_WALLET_KEYPAIR;
    if (!keypairBase64) {
      return NextResponse.json(
        { error: "TEST_WALLET_KEYPAIR not set in .env" },
        { status: 500 }
      );
    }

    let secretKey: Uint8Array;
    if (keypairBase64.startsWith("[")) {
      const numbers = JSON.parse(keypairBase64) as number[];
      secretKey = new Uint8Array(numbers);
    } else {
      secretKey = Uint8Array.from(Buffer.from(keypairBase64, "base64"));
    }
    const payerKeypair = Keypair.fromSecretKey(secretKey);
    const creatorAddress = payerKeypair.publicKey.toBase58() as Address;

    const body = await req.json();
    const { mintAddress: mintStr, source: sourceStr, recipient: recipientStr, amount: amountStr, enforceFamp } = body;

    if (!mintStr || !amountStr || !recipientStr) {
      return NextResponse.json(
        { error: "mintAddress, amount, and recipient are required" },
        { status: 400 }
      );
    }

    const connection = new Connection(DEVNET_RPC, "confirmed");
    const mintAddress = mintStr as Address;
    const mintPubkey = new PublicKey(mintAddress);

    // Select verification program: FAMP when enforceFamp=true, NOOP otherwise
    const verifierProgramId = enforceFamp ? FAMP_PROGRAM_ID : NOOP_VERIFICATION_PROGRAM_ID;

    // Source defaults to payer wallet if not provided
    const sourceAddress = (sourceStr || payerKeypair.publicKey.toBase58()) as Address;
    const sourcePubkey = new PublicKey(sourceAddress);
    const recipientPubkey = new PublicKey(recipientStr);

    // Derive PDAs
    const [mintAuthorityPda] = await deriveMintAuthorityPda(
      mintAddress,
      creatorAddress,
      SSTS_PROGRAM_ID
    );
    const [verificationConfigPda] = await deriveVerificationConfigPda(
      mintAddress,
      12, // Transfer discriminator
      SSTS_PROGRAM_ID
    );
    const [permanentDelegatePda] = await derivePermanentDelegatePda(
      mintAddress,
      SSTS_PROGRAM_ID
    );
    const [transferHookPda] = await deriveTransferHookPda(
      mintAddress,
      SSTS_PROGRAM_ID
    );

    // Get or create source ATA
    const sourceAta = getAssociatedTokenAddressSync(
      mintPubkey,
      sourcePubkey,
      false,
      TOKEN_2022_PK
    );
    const sourceAtaExists = await connection.getAccountInfo(sourceAta);

    // Get or create destination ATA
    const destAta = getAssociatedTokenAddressSync(
      mintPubkey,
      recipientPubkey,
      false,
      TOKEN_2022_PK
    );
    const destAtaExists = await connection.getAccountInfo(destAta);

    // Parse amount (assume 6 decimals if not specified)
    const decimals = parseInt(body.decimals || "6");
    const amountRaw = BigInt(Math.floor(parseFloat(amountStr) * 10 ** decimals));

    // Always include InitializeVerificationConfig for disc 12
    // The SSTS program will skip if already exists (AccountAlreadyInitialized)
    // Build Transfer instruction manually with web3.js
    const discriminator = Buffer.from([12]);
    const amountBytes = Buffer.alloc(8);
    amountBytes.writeBigUInt64LE(BigInt(amountRaw));
    const instructionData = Buffer.concat([discriminator, amountBytes]);

    const web3TransferIx = new TransactionInstruction({
      programId: new PublicKey(SSTS_PROGRAM_ID),
      keys: [
        { pubkey: new PublicKey(mintAddress), isSigner: false, isWritable: false },
        { pubkey: new PublicKey(verificationConfigPda), isSigner: false, isWritable: false },
        { pubkey: new PublicKey("Sysvar1nstructions1111111111111111111111111"), isSigner: false, isWritable: false },
        { pubkey: new PublicKey(permanentDelegatePda), isSigner: false, isWritable: false },
        { pubkey: new PublicKey(mintAddress), isSigner: false, isWritable: false },
        { pubkey: sourceAta, isSigner: false, isWritable: true },
        { pubkey: destAta, isSigner: false, isWritable: true },
        { pubkey: new PublicKey(TRANSFER_HOOK_PROGRAM_ID), isSigner: false, isWritable: false },
        { pubkey: new PublicKey(TOKEN_2022_PROGRAM_ID), isSigner: false, isWritable: false },
        { pubkey: new PublicKey(verifierProgramId), isSigner: false, isWritable: false },
      ],
      data: instructionData,
    });

    // Build transaction
    const tx = new Transaction();
    if (!sourceAtaExists) {
      tx.add(
        createAssociatedTokenAccountInstruction(
          payerKeypair.publicKey,
          sourceAta,
          sourcePubkey,
          mintPubkey,
          TOKEN_2022_PK
        )
      );
    }
    if (!destAtaExists) {
      tx.add(
        createAssociatedTokenAccountInstruction(
          payerKeypair.publicKey,
          destAta,
          recipientPubkey,
          mintPubkey,
          TOKEN_2022_PK
        )
      );
    }
    tx.add(web3TransferIx);
    tx.feePayer = payerKeypair.publicKey;
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;

    // Sign and send
    tx.sign(payerKeypair);

    const simResult = await connection.simulateTransaction(tx);
    if (simResult.value.err) {
      return NextResponse.json(
        {
          error: "Simulation failed",
          details: simResult.value.err,
          logs: simResult.value.logs,
          debugInfo: {
            mintAuthorityPda,
            permanentDelegatePda,
            verificationConfigPda,
          },
          debugKeys: web3TransferIx.keys.map((k: any, i: number) => ({
            index: i,
            pubkey: k.pubkey.toBase58(),
            isSigner: k.isSigner,
            isWritable: k.isWritable,
          })),
        },
        { status: 400 }
      );
    }

    const signature = await connection.sendRawTransaction(tx.serialize(), {
      skipPreflight: false,
      preflightCommitment: "confirmed",
    });

    await connection.confirmTransaction({
      signature: signature as any,
      blockhash,
      lastValidBlockHeight,
    }, "confirmed");

    return NextResponse.json({
      success: true,
      signature,
      mint: mintAddress,
      source: sourceAta.toBase58(),
      destination: destAta.toBase58(),
      amount: amountStr,
      explorerUrl: `https://explorer.solana.com/tx/${signature}?cluster=devnet`,
    });
  } catch (error: any) {
    console.error("[api/transfer-tokens] Error:", error);
    return NextResponse.json(
      {
        error: error.message || "Unknown error",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
