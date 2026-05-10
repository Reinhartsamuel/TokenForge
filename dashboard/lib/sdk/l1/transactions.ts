/**
 * L1 — Transaction Composition
 *
 * Helpers for building, signing, and sending transactions that combine
 * multiple canonical SSTS instructions.
 */

import {
  type Address,
  type TransactionSigner,
  type Rpc,
  type SolanaRpcApi,
  type RpcSubscriptions,
  type SolanaRpcSubscriptionsApi,
  createTransactionMessage,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  appendTransactionMessageInstructions,
  signTransactionMessageWithSigners,
  getTransactionEncoder,
  assertIsBlockhash,
  type IInstruction,
  type CompilableTransactionMessage,
} from '@solana/kit';
import { PublicKey, type TransactionInstruction } from '@solana/web3.js';
import { TokenForgeError } from './errors';

export function buildTransaction(
  feePayer: TransactionSigner,
  instructions: IInstruction[],
  latestBlockhash: { blockhash: string; lastValidBlockHeight: bigint }
): CompilableTransactionMessage {
  assertIsBlockhash(latestBlockhash.blockhash);
  return setTransactionMessageFeePayerSigner(
    feePayer,
    setTransactionMessageLifetimeUsingBlockhash(
      latestBlockhash as { blockhash: import('@solana/kit').Blockhash; lastValidBlockHeight: bigint },
      appendTransactionMessageInstructions(
        instructions,
        createTransactionMessage({ version: 0 })
      )
    )
  );
}

export async function buildAndSerializeTransaction(
  feePayer: TransactionSigner,
  instructions: IInstruction[],
  rpc: Rpc<SolanaRpcApi>
): Promise<Uint8Array> {
  const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

  const transactionMessage = setTransactionMessageFeePayerSigner(
    feePayer,
    setTransactionMessageLifetimeUsingBlockhash(
      latestBlockhash,
      appendTransactionMessageInstructions(
        instructions,
        createTransactionMessage({ version: 0 })
      )
    )
  );

  const signedTx = await signTransactionMessageWithSigners(transactionMessage);
  return Uint8Array.from(getTransactionEncoder().encode(signedTx));
}

export async function sendSstsTransaction(
  rpc: Rpc<SolanaRpcApi>,
  rpcSubscriptions: RpcSubscriptions<SolanaRpcSubscriptionsApi>,
  feePayer: TransactionSigner,
  instructions: IInstruction[],
  workflow?: string
): Promise<string> {
  try {
    const wireTx = await buildAndSerializeTransaction(feePayer, instructions, rpc);
    const base64Tx = Buffer.from(wireTx).toString('base64') as import('@solana/kit').Base64EncodedWireTransaction;
    const signature = await rpc
      .sendTransaction(base64Tx, { encoding: 'base64' })
      .send();
    return signature;
  } catch (raw: unknown) {
    const error = raw instanceof Error ? raw : new Error(String(raw));
    throw new TokenForgeError(
      `Transaction failed in ${workflow ?? 'workflow'}: ${error.message}`,
      undefined,
      workflow,
      error
    );
  }
}

export function batchInstructions(
  feePayer: TransactionSigner,
  instructions: IInstruction[],
  latestBlockhash: { blockhash: string; lastValidBlockHeight: bigint },
  maxInstructionsPerTx = 15
): CompilableTransactionMessage[] {
  const batches: IInstruction[][] = [];
  for (let i = 0; i < instructions.length; i += maxInstructionsPerTx) {
    batches.push(instructions.slice(i, i + maxInstructionsPerTx));
  }
  return batches.map((batch) => buildTransaction(feePayer, batch, latestBlockhash));
}

export function createAssociatedTokenAccountInstruction(
  payer: TransactionSigner,
  mint: Address,
  owner: Address,
  tokenProgram: Address = 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb' as Address<'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'>
): IInstruction {
  return {
    programAddress: tokenProgram,
    accounts: [],
    data: new Uint8Array(),
  } as IInstruction;
}

/**
 * Convert a canonical SSTS instruction (@solana/kit format) to a
 * web3.js TransactionInstruction so it can be used with the wallet adapter.
 *
 * @solana/kit v2 account roles:
 *   0 = readonly
 *   1 = writable
 *   3 = signer
 *   5 = writable + signer
 */
export function canonicalIxToWeb3(ix: any, roleOverrides?: Record<number, number>): TransactionInstruction {
  console.log("[canonicalIxToWeb3] programAddress type:", typeof ix.programAddress, "value:", ix.programAddress);
  const keys: { pubkey: PublicKey; isSigner: boolean; isWritable: boolean }[] = [];
  let firstLogged = false;
  let idx = 0;
  for (const a of ix.accounts || []) {
    const account = a.value ?? a;
    if (!account) { idx++; continue; }

    let pubkey: PublicKey;
    if (typeof account === "string") {
      pubkey = new PublicKey(account);
    } else if ("address" in account) {
      const addrVal = (account as any).address;
      console.log(`[canonicalIxToWeb3] account[${idx}] address type:`, typeof addrVal, "value:", addrVal);
      pubkey = new PublicKey(addrVal);
    } else if ("publicKey" in account) {
      pubkey = new PublicKey((account as any).publicKey);
    } else {
      idx++; continue;
    }

    let role = (a as any).role ?? (account as any).role;
    if (roleOverrides && roleOverrides[keys.length] !== undefined) {
      role = roleOverrides[keys.length];
    }

    let isSigner: boolean;
    let isWritable: boolean;

    if (role !== undefined) {
      isWritable = role === 1 || role === 5;
      isSigner = role === 3 || role === 5;
      if (!firstLogged) {
        console.log(`[canonicalIxToWeb3] role=${role}, derived isSigner=${isSigner}, isWritable=${isWritable} for ${pubkey.toBase58()}`);
        firstLogged = true;
      }
    } else {
      isSigner =
        typeof account === "object" &&
        account !== null &&
        ("signTransaction" in account || "sign" in account || "signer" in account);
      isWritable = a.isWritable ?? true;
    }

    keys.push({ pubkey, isSigner, isWritable });
    idx++;
  }

  return {
    programId: new PublicKey(ix.programAddress),
    keys,
    data: Buffer.from(ix.data instanceof Uint8Array ? ix.data : new Uint8Array(ix.data)),
  };
}
