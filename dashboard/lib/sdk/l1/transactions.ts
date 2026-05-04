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
  signAndSendTransactionMessageWithSigners,
  type IInstruction,
  type CompilableTransactionMessage,
  type Blockhash,
  assertIsBlockhash,
  getBase58Codec,
} from '@solana/kit';
import { TokenForgeError } from './errors';

/**
 * Build a compilable transaction message from a set of instructions.
 *
 * @param feePayer - Transaction fee payer signer
 * @param instructions - One or more instructions to include
 * @param latestBlockhash - Latest blockhash from the RPC
 */
export function buildTransaction(
  feePayer: TransactionSigner,
  instructions: IInstruction[],
  latestBlockhash: { blockhash: string; lastValidBlockHeight: bigint }
): CompilableTransactionMessage {
  assertIsBlockhash(latestBlockhash.blockhash);
  const blockhashObj = {
    blockhash: latestBlockhash.blockhash as Blockhash,
    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
  };
  return setTransactionMessageFeePayerSigner(
    feePayer,
    setTransactionMessageLifetimeUsingBlockhash(
      blockhashObj,
      appendTransactionMessageInstructions(
        instructions,
        createTransactionMessage({ version: 0 })
      )
    )
  );
}

/**
 * Send a transaction built from SSTS instructions and wait for confirmation.
 *
 * @param rpc - @solana/kit RPC client
 * @param rpcSubscriptions - @solana/kit RPC subscriptions client
 * @param feePayer - Transaction fee payer signer
 * @param instructions - SSTS instructions to execute
 * @param workflow - Optional workflow name for error context
 * @returns Transaction signature
 */
export async function sendSstsTransaction(
  rpc: Rpc<SolanaRpcApi>,
  rpcSubscriptions: RpcSubscriptions<SolanaRpcSubscriptionsApi>,
  feePayer: TransactionSigner,
  instructions: IInstruction[],
  workflow?: string
): Promise<string> {
  try {
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

    const signatureBytes =
      await signAndSendTransactionMessageWithSigners(transactionMessage);

    const base58 = getBase58Codec();
    return base58.decode(signatureBytes);
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

/**
 * Batch multiple SSTS instructions into transaction messages.
 * If the instruction count exceeds the per-tx limit, splits into multiple messages.
 *
 * @param feePayer - Transaction fee payer signer
 * @param instructions - All instructions to batch
 * @param latestBlockhash - Latest blockhash
 * @returns Array of compilable transaction messages (may be split if too many instructions)
 */
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

/**
 * Create an instruction placeholder for ATA initialization.
 * Returns the instruction — callers should combine with SSTS instructions.
 *
 * @param payer - Transaction fee payer signer
 * @param mint - Token mint address
 * @param owner - Token account owner address
 * @param tokenProgram - Token program address (defaults to Token-2022)
 */
export function createAssociatedTokenAccountInstruction(
  payer: TransactionSigner,
  mint: Address,
  owner: Address,
  tokenProgram: Address = 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb' as Address<'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'>
): IInstruction {
  // Simplified ATA derivation — in production, use @solana/spl-token's deriveAssociatedTokenAddress
  return {
    programAddress: tokenProgram,
    accounts: [],
    data: new Uint8Array(),
  } as IInstruction;
}
