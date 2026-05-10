import { NextRequest, NextResponse } from "next/server";
import { Keypair, PublicKey, Connection, Transaction } from "@solana/web3.js";
import { createNoopSigner } from "@solana/kit";
import type { Address } from "@solana/kit";
import {
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import {
  deriveMintAuthorityPda,
  deriveVerificationConfigPda,
} from "@/lib/sdk/l1/derive";
import {
  getMintInstruction,
  getInitializeVerificationConfigInstruction,
  TOKEN_2022_PROGRAM_ID,
  SYSTEM_PROGRAM_ID,
  INSTRUCTIONS_SYSVAR_ID,
  SSTS_PROGRAM_ID,
  NOOP_VERIFICATION_PROGRAM_ID,
  TRANSFER_HOOK_PROGRAM_ID,
} from "@/lib/sdk";
import { canonicalIxToWeb3 } from "@/lib/sdk/l1/transactions";

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
    const { mintAddress: mintStr, destination: destStr, amount: amountStr } = body;

    if (!mintStr || !amountStr) {
      return NextResponse.json(
        { error: "mintAddress and amount are required" },
        { status: 400 }
      );
    }

    const connection = new Connection(DEVNET_RPC, "confirmed");
    const mintAddress = mintStr as Address;
    const mintPubkey = new PublicKey(mintAddress);

    // Destination defaults to payer wallet if not provided
    const destAddress = (destStr || payerKeypair.publicKey.toBase58()) as Address;
    const destPubkey = new PublicKey(destAddress);

    // Derive PDAs
    const [mintAuthorityPda] = await deriveMintAuthorityPda(
      mintAddress,
      creatorAddress,
      SSTS_PROGRAM_ID
    );
    const [verificationConfigPda] = await deriveVerificationConfigPda(
      mintAddress,
      6, // Mint discriminator
      SSTS_PROGRAM_ID
    );

    // Get or create destination ATA
    const destAta = getAssociatedTokenAddressSync(
      mintPubkey,
      destPubkey,
      false,
      TOKEN_2022_PK
    );
    const destAtaExists = await connection.getAccountInfo(destAta);

    // Parse amount (assume 6 decimals if not specified)
    const decimals = parseInt(body.decimals || "6");
    const amountRaw = BigInt(Math.floor(parseFloat(amountStr) * 10 ** decimals));

    // Build canonical instructions
    const payerSigner = createNoopSigner(creatorAddress);

    // Check if VerificationConfig for discriminator 6 exists
    const vcExists = await connection.getAccountInfo(new PublicKey(verificationConfigPda));

    let web3InitVcIx = null;
    if (!vcExists) {
      const initVcIx = getInitializeVerificationConfigInstruction({
        mint: mintAddress,
        verificationConfigOrMintAuthority: mintAuthorityPda,
        instructionsSysvarOrCreator: creatorAddress,
        payer: payerSigner,
        mintAccount: mintAddress,
        configAccount: verificationConfigPda,
        systemProgram: SYSTEM_PROGRAM_ID,
        transferHookPda: TRANSFER_HOOK_PROGRAM_ID,
        transferHookProgram: TRANSFER_HOOK_PROGRAM_ID,
        initializeVerificationConfigArgs: {
          instructionDiscriminator: 6,
          cpiMode: true,
          programAddresses: [NOOP_VERIFICATION_PROGRAM_ID],
        },
      } as any);
      web3InitVcIx = canonicalIxToWeb3(initVcIx);
    }

    const mintIx = getMintInstruction({
      mint: mintAddress,
      verificationConfig: verificationConfigPda,
      instructionsSysvar: INSTRUCTIONS_SYSVAR_ID,
      mintAuthority: mintAuthorityPda,
      mintAccount: mintAddress,
      destination: destAta.toBase58(),
      tokenProgram: TOKEN_2022_PROGRAM_ID,
      amount: amountRaw,
    } as any);

    const web3MintIx = canonicalIxToWeb3(mintIx);

    // Build transaction
    const tx = new Transaction();
    if (!destAtaExists) {
      tx.add(
        createAssociatedTokenAccountInstruction(
          payerKeypair.publicKey,
          destAta,
          destPubkey,
          mintPubkey,
          TOKEN_2022_PK
        )
      );
    }
    if (web3InitVcIx) {
      tx.add(web3InitVcIx);
    }
    tx.add(web3MintIx);
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
      destination: destAta.toBase58(),
      amount: amountStr,
      mintAuthorityPda: mintAuthorityPda,
      verificationConfigPda: verificationConfigPda,
      explorerUrl: `https://explorer.solana.com/tx/${signature}?cluster=devnet`,
    });
  } catch (error: any) {
    console.error("[api/mint-tokens] Error:", error);
    return NextResponse.json(
      {
        error: error.message || "Unknown error",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
