import { NextRequest, NextResponse } from "next/server";
import {
  Keypair,
  PublicKey,
  Connection,
  Transaction,
  TransactionInstruction,
  SystemProgram,
} from "@solana/web3.js";
import { deriveFampPolicyPda } from "@/lib/sdk/l1/derive";
import { FAMP_PROGRAM_ID } from "@/lib/sdk/utils/constants";

const DEVNET_RPC = "https://api.devnet.solana.com";
const FAMP_PROGRAM_PK = new PublicKey(FAMP_PROGRAM_ID);

// FAMP instruction discriminators (Anchor 0.31.x uses SHA-256("global:name")[:8])
const DISCRIMINATORS = {
  createPolicy: [27, 81, 33, 27, 196, 103, 246, 53],
  addToAllowlist: [149, 143, 78, 134, 241, 244, 7, 56],
  removeFromAllowlist: [45, 46, 214, 56, 189, 77, 242, 227],
  addToBlocklist: [201, 138, 75, 216, 252, 201, 26, 106],
  removeFromBlocklist: [132, 125, 30, 120, 139, 22, 210, 90],
};

function encodePubkeyBase58ToBytes(base58Str: string): Uint8Array {
  const base58Chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  const bytes = new Uint8Array(32);
  let num = BigInt(0);
  for (const char of base58Str) {
    num = num * BigInt(58) + BigInt(base58Chars.indexOf(char));
  }
  let i = 31;
  while (num > 0n && i >= 0) {
    bytes[i] = Number(num % 256n);
    num /= 256n;
    i--;
  }
  return bytes;
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

async function buildAndSend(
  connection: Connection,
  instructions: TransactionInstruction[]
) {
  const payer = getKeypair();
  const tx = new Transaction();
  tx.add(...instructions);
  tx.feePayer = payer.publicKey;
  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  tx.sign(payer);

  const simResult = await connection.simulateTransaction(tx);
  if (simResult.value.err) {
    throw new Error(
      `Simulation failed: ${JSON.stringify(simResult.value.err)}\nLogs: ${JSON.stringify(simResult.value.logs?.slice(-10))}`
    );
  }

  const signature = await connection.sendRawTransaction(tx.serialize(), {
    skipPreflight: false,
    preflightCommitment: "confirmed",
  });

  await connection.confirmTransaction(
    { signature, blockhash, lastValidBlockHeight },
    "confirmed"
  );

  return signature;
}

export async function POST(req: NextRequest) {
  try {
    const connection = new Connection(DEVNET_RPC, "confirmed");
    const body = await req.json();
    const { action, mintAddress, wallet, allowlistMode } = body;

    if (!action || !mintAddress) {
      return NextResponse.json(
        { error: "action and mintAddress are required" },
        { status: 400 }
      );
    }

    const mintPubkey = new PublicKey(mintAddress);
    const payer = getKeypair();
    const [policyPda] = await deriveFampPolicyPda(
      mintAddress,
      FAMP_PROGRAM_ID
    );
    const policyPubkey = new PublicKey(policyPda);

    let signature: string;

    switch (action) {
      case "create": {
        const data = new Uint8Array([
          ...DISCRIMINATORS.createPolicy,
          allowlistMode ? 1 : 0,
        ]);
        const ix = new TransactionInstruction({
          programId: FAMP_PROGRAM_PK,
          keys: [
            { pubkey: payer.publicKey, isSigner: true, isWritable: true },
            { pubkey: mintPubkey, isSigner: false, isWritable: false },
            { pubkey: policyPubkey, isSigner: false, isWritable: true },
            { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
          ],
          data: Buffer.from(data),
        });
        signature = await buildAndSend(connection, [ix]);
        break;
      }

      case "addToAllowlist":
      case "removeFromAllowlist":
      case "addToBlocklist":
      case "removeFromBlocklist": {
        if (!wallet) {
          return NextResponse.json(
            { error: "wallet is required for list operations" },
            { status: 400 }
          );
        }
        const walletPubkey = new PublicKey(wallet);
        const walletBytes = encodePubkeyBase58ToBytes(wallet);
        const discMap: Record<string, number[]> = {
          addToAllowlist: DISCRIMINATORS.addToAllowlist,
          removeFromAllowlist: DISCRIMINATORS.removeFromAllowlist,
          addToBlocklist: DISCRIMINATORS.addToBlocklist,
          removeFromBlocklist: DISCRIMINATORS.removeFromBlocklist,
        };
        const discriminator = discMap[action];
        if (!discriminator) {
          return NextResponse.json(
            { error: `Unknown action: ${action}` },
            { status: 400 }
          );
        }
        const data = new Uint8Array([...discriminator, ...walletBytes]);
        const ix = new TransactionInstruction({
          programId: FAMP_PROGRAM_PK,
          keys: [
            { pubkey: payer.publicKey, isSigner: true, isWritable: false },
            { pubkey: policyPubkey, isSigner: false, isWritable: true },
          ],
          data: Buffer.from(data),
        });
        signature = await buildAndSend(connection, [ix]);
        break;
      }

      case "getPolicy": {
        const accountInfo = await connection.getAccountInfo(policyPubkey);
        if (!accountInfo) {
          return NextResponse.json({
            success: true,
            policyExists: false,
            policyPda: policyPda,
          });
        }
        // Parse policy account data
        // Layout: 8 bytes anchor discriminator + PolicyAccount data
        // PolicyAccount:
        //   mint: Pubkey (32 bytes)
        //   issuer_authority: Pubkey (32 bytes)
        //   allowlist_mode: bool (1 byte)
        //   allowlist: [Pubkey; 16] (512 bytes)
        //   blocklist: [Pubkey; 16] (512 bytes)
        //   allowlist_count: u8 (1 byte)
        //   blocklist_count: u8 (1 byte)
        //   bump: u8 (1 byte)
        const data = accountInfo.data;
        const offset = 8; // skip anchor discriminator
        const mint = new PublicKey(data.slice(offset, offset + 32)).toBase58();
        const issuerAuthority = new PublicKey(
          data.slice(offset + 32, offset + 64)
        ).toBase58();
        const allowlistMode = data[offset + 64] === 1;
        const allowlistCount = data[offset + 64 + 1 + 512 + 512]; // after allowlist_mode + allowlist + blocklist
        const blocklistCount = data[offset + 64 + 1 + 512 + 512 + 1];
        const allowlist: string[] = [];
        const blocklist: string[] = [];

        for (let i = 0; i < allowlistCount; i++) {
          const start = offset + 65 + i * 32;
          allowlist.push(
            new PublicKey(data.slice(start, start + 32)).toBase58()
          );
        }
        const blocklistStart = offset + 65 + 512;
        for (let i = 0; i < blocklistCount; i++) {
          const start = blocklistStart + i * 32;
          blocklist.push(
            new PublicKey(data.slice(start, start + 32)).toBase58()
          );
        }

        return NextResponse.json({
          success: true,
          policyExists: true,
          policyPda: policyPda,
          policy: {
            mint,
            issuerAuthority,
            allowlistMode,
            allowlist,
            blocklist,
            allowlistCount,
            blocklistCount,
          },
        });
      }

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      signature,
      action,
      mint: mintAddress,
      policyPda,
      explorerUrl: `https://explorer.solana.com/tx/${signature}?cluster=devnet`,
    });
  } catch (error: any) {
    console.error("[api/famp-policy] Error:", error);
    return NextResponse.json(
      { error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}
