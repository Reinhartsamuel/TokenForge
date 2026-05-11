import { NextRequest, NextResponse } from "next/server";
import { Keypair, PublicKey, Connection, Transaction, TransactionInstruction, SystemProgram } from "@solana/web3.js";
import type { Address } from "@solana/kit";
import bs58 from "bs58";
import {
  deriveMintAuthorityPda,
  deriveVerificationConfigPda,
  deriveTransferHookPda,
  deriveExtraAccountMetasPda,
} from "@/lib/sdk/l1/derive";
import {
  TOKEN_2022_PROGRAM_ID,
  SSTS_PROGRAM_ID,
  NOOP_VERIFICATION_PROGRAM_ID,
  TRANSFER_HOOK_PROGRAM_ID,
} from "@/lib/sdk";

const DEVNET_RPC = "https://api.devnet.solana.com";

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
    const { mintAddress: mintStr } = body;
    if (!mintStr) {
      return NextResponse.json(
        { error: "mintAddress is required" },
        { status: 400 }
      );
    }

    const connection = new Connection(DEVNET_RPC, "confirmed");
    const mintAddress = mintStr as Address;
    const mintPubkey = new PublicKey(mintAddress);

    const [mintAuthorityPda] = await deriveMintAuthorityPda(
      mintAddress,
      creatorAddress,
      SSTS_PROGRAM_ID
    );
    const [verificationConfigPda] = await deriveVerificationConfigPda(
      mintAddress,
      12,
      SSTS_PROGRAM_ID
    );
    const [transferHookPda] = await deriveTransferHookPda(
      mintAddress,
      SSTS_PROGRAM_ID
    );
    const [extraAccountMetasPda] = await deriveExtraAccountMetasPda(
      mintAddress,
      TRANSFER_HOOK_PROGRAM_ID
    );

    // Check if VC already exists
    const existing = await connection.getAccountInfo(new PublicKey(verificationConfigPda));
    if (existing && existing.data.length > 0) {
      return NextResponse.json({
        success: true,
        message: "VC for disc 12 already exists",
        verificationConfigPda,
      });
    }

    // Build InitVC instruction manually with correct account flags
    const programCount = Buffer.alloc(4);
    programCount.writeUInt32LE(1, 0);
    const initVcData = Buffer.concat([
      Buffer.from([2]), // InitializeVerificationConfig discriminator
      Buffer.from([12]), // instruction_discriminator: Transfer
      Buffer.from([1]),  // cpi_mode: true
      programCount,
      Buffer.from(bs58.decode(NOOP_VERIFICATION_PROGRAM_ID)),
    ]);

    const web3InitVcIx = new TransactionInstruction({
      programId: new PublicKey(SSTS_PROGRAM_ID),
      keys: [
        { pubkey: new PublicKey(mintAddress), isSigner: false, isWritable: false },
        { pubkey: new PublicKey(mintAuthorityPda), isSigner: false, isWritable: false },
        { pubkey: payerKeypair.publicKey, isSigner: true, isWritable: true },
        { pubkey: payerKeypair.publicKey, isSigner: true, isWritable: true },
        { pubkey: new PublicKey(mintAddress), isSigner: false, isWritable: false },
        { pubkey: new PublicKey(verificationConfigPda), isSigner: false, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        { pubkey: new PublicKey(extraAccountMetasPda), isSigner: false, isWritable: true },
        { pubkey: new PublicKey(transferHookPda), isSigner: false, isWritable: false },
        { pubkey: new PublicKey(TRANSFER_HOOK_PROGRAM_ID), isSigner: false, isWritable: false },
      ],
      data: initVcData,
    });

    const debugAccountInfo = web3InitVcIx.keys.map((k, i) => ({
      index: i,
      pubkey: k.pubkey.toBase58(),
      isSigner: k.isSigner,
      isWritable: k.isWritable,
    }));

    const tx = new Transaction();
    tx.add(web3InitVcIx);
    tx.feePayer = payerKeypair.publicKey;
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.sign(payerKeypair);

    const simResult = await connection.simulateTransaction(tx);
    if (simResult.value.err) {
      return NextResponse.json(
        { error: "Simulation failed", details: simResult.value.err, logs: simResult.value.logs, debugAccounts: debugAccountInfo },
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
      verificationConfigPda,
      explorerUrl: `https://explorer.solana.com/tx/${signature}?cluster=devnet`,
    });
  } catch (error: any) {
    console.error("[api/init-vc-transfer] Error:", error);
    return NextResponse.json(
      { error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}
