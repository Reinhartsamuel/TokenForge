import { NextRequest, NextResponse } from "next/server";
import { Keypair, PublicKey, Connection, Transaction } from "@solana/web3.js";
import { createNoopSigner } from "@solana/kit";
import type { Address } from "@solana/kit";
import {
  deriveMintAuthorityPda,
  deriveFreezeAuthorityPda,
  deriveVerificationConfigPda,
} from "@/lib/sdk/l1/derive";
import {
  getInitializeMintInstruction,
  getInitializeVerificationConfigInstruction,
  NOOP_VERIFICATION_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
  SYSTEM_PROGRAM_ID,
  TRANSFER_HOOK_PROGRAM_ID,
  SSTS_PROGRAM_ID,
} from "@/lib/sdk";
import { canonicalIxToWeb3 } from "@/lib/sdk/l1/transactions";

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

    // Accept either JSON array string or base64
    let secretKey: Uint8Array;
    if (keypairBase64.startsWith("[")) {
      // It's a JSON array of numbers like [12,34,56,...]
      const numbers = JSON.parse(keypairBase64) as number[];
      secretKey = new Uint8Array(numbers);
    } else {
      secretKey = Uint8Array.from(Buffer.from(keypairBase64, "base64"));
    }
    const payerKeypair = Keypair.fromSecretKey(secretKey);

    const body = await req.json();
    const { name, symbol, decimals: decimalsStr } = body;
    const decimals = parseInt(decimalsStr || "6");

    if (!name || !symbol) {
      return NextResponse.json(
        { error: "name and symbol are required" },
        { status: 400 }
      );
    }

    const connection = new Connection(DEVNET_RPC, "confirmed");
    const mintKeypair = Keypair.generate();
    const mintAddress = mintKeypair.publicKey.toBase58() as Address;
    const creatorAddress = payerKeypair.publicKey.toBase58() as Address;

    // Derive PDAs
    const [mintAuthorityPda] = await deriveMintAuthorityPda(
      mintAddress,
      creatorAddress,
      SSTS_PROGRAM_ID
    );
    const [freezeAuthorityPda] = await deriveFreezeAuthorityPda(
      mintAddress,
      SSTS_PROGRAM_ID
    );
    const [transferVerificationConfigPda] = await deriveVerificationConfigPda(
      mintAddress,
      12,
      SSTS_PROGRAM_ID
    );

    // Build canonical instructions with proper @solana/kit signers
    const mintSigner = createNoopSigner(mintAddress);
    const payerSigner = createNoopSigner(creatorAddress);

    console.log("[api] mintSigner type:", typeof mintSigner, "has address:", 'address' in mintSigner);
    console.log("[api] mintAddress:", mintAddress);

    const initMintIx = getInitializeMintInstruction({
      mint: mintSigner,
      authority: mintAuthorityPda,
      payer: payerSigner,
      tokenProgram: TOKEN_2022_PROGRAM_ID,
      systemProgram: SYSTEM_PROGRAM_ID,
      rentSysvar: "SysvarRent111111111111111111111111111111111",
      initializeMintArgs: {
      ixMint: {
        decimals,
        mintAuthority: creatorAddress,
        freezeAuthority: freezeAuthorityPda,
      },
        ixMetadataPointer: {
          authority: creatorAddress,
          metadataAddress: mintAddress,
        },
        ixMetadata: {
          name,
          symbol,
          uri: "",
          additionalMetadata: new Uint8Array(),
        },
        ixScaledUiAmount: null,
      },
    } as any);

    const initVerificationConfigIx =
      getInitializeVerificationConfigInstruction({
        mint: mintAddress,
        verificationConfigOrMintAuthority: mintAuthorityPda,
        instructionsSysvarOrCreator: creatorAddress,
        payer: payerSigner,
        mintAccount: mintAddress,
        configAccount: transferVerificationConfigPda,
        systemProgram: SYSTEM_PROGRAM_ID,
        transferHookPda: TRANSFER_HOOK_PROGRAM_ID,
        transferHookProgram: TRANSFER_HOOK_PROGRAM_ID,
        initializeVerificationConfigArgs: {
          instructionDiscriminator: 12,
          cpiMode: false,
          programAddresses: [NOOP_VERIFICATION_PROGRAM_ID],
        },
      } as any);

    // The canonical builder incorrectly sets TransactionSigner accounts as role=3 (READONLY_SIGNER)
    // instead of role=5 (WRITABLE_SIGNER). Override the roles for accounts that must be writable.
    const web3Ix1 = canonicalIxToWeb3(initMintIx, { 0: 5, 2: 5 });
    const web3Ix2 = canonicalIxToWeb3(initVerificationConfigIx);

    console.log("[api] ix1 (InitializeMint) programId:", web3Ix1.programId.toBase58());
    web3Ix1.keys.forEach((k: any, i: number) => {
      console.log(`  [${i}] ${k.pubkey.toBase58()} signer=${k.isSigner} writable=${k.isWritable}`);
    });
    console.log("[api] ix2 (InitVerificationConfig) programId:", web3Ix2.programId.toBase58());
    web3Ix2.keys.forEach((k: any, i: number) => {
      console.log(`  [${i}] ${k.pubkey.toBase58()} signer=${k.isSigner} writable=${k.isWritable}`);
    });

    // Build transaction with ONLY the first instruction to isolate the "immutable" error
    const tx = new Transaction().add(web3Ix1);
    tx.feePayer = payerKeypair.publicKey;
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;

    // Sign with both keypairs
    tx.sign(payerKeypair, mintKeypair);

    // Simulate first
    console.log("[api] Simulating transaction...");
    const simResult = await connection.simulateTransaction(tx);
    console.log("[api] Simulation result:", JSON.stringify(simResult.value, null, 2));

    if (simResult.value.err) {
      return NextResponse.json(
        {
          error: "Simulation failed",
          details: simResult.value.err,
          logs: simResult.value.logs,
          mint: mintAddress,
          mintAuthorityPda: mintAuthorityPda,
          verificationConfigPda: transferVerificationConfigPda,
          ix1Accounts: web3Ix1.keys.map((k: any) => ({
            pubkey: k.pubkey.toBase58(),
            isSigner: k.isSigner,
            isWritable: k.isWritable,
          })),
          ix2Accounts: web3Ix2.keys.map((k: any) => ({
            pubkey: k.pubkey.toBase58(),
            isSigner: k.isSigner,
            isWritable: k.isWritable,
          })),
        },
        { status: 400 }
      );
    }

    // Send transaction
    console.log("[api] Sending transaction...");
    const signature = await connection.sendRawTransaction(tx.serialize(), {
      skipPreflight: false,
      preflightCommitment: "confirmed",
    });

    console.log("[api] Waiting for confirmation, signature:", signature);
    const confirmation = await connection.confirmTransaction({
      signature: signature as any,
      blockhash,
      lastValidBlockHeight,
    }, "confirmed");

    if (confirmation.value.err) {
      return NextResponse.json(
        {
          error: "Transaction failed",
          details: confirmation.value.err,
          signature,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      signature,
      mint: mintAddress,
      mintAuthorityPda: mintAuthorityPda,
      verificationConfigPda: transferVerificationConfigPda,
      explorerUrl: `https://explorer.solana.com/tx/${signature}?cluster=devnet`,
    });
  } catch (error: any) {
    console.error("[api] Token creation error:", error);
    return NextResponse.json(
      {
        error: error.message || "Unknown error",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
