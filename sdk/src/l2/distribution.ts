/**
 * L2 — Distribution & Corporate Action Workflows
 *
 * High-level APIs for Merkle-based distributions and token splits/conversions.
 */

import {
  type Address,
  type TransactionSigner,
  type Rpc,
  type SolanaRpcApi,
  type RpcSubscriptions,
  type SolanaRpcSubscriptionsApi,
  type OptionOrNullable,
} from '@solana/kit';
import {
  SYSTEM_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
  INSTRUCTIONS_SYSVAR_ID,
  TRANSFER_HOOK_PROGRAM_ID,
} from '../utils/constants';
import type {
  DistributionInput,
  ClaimDistributionWorkflowInput,
  WorkflowResult,
} from '../utils/types';
import {
  deriveVerificationConfigPda,
  deriveProofAccountPda,
} from '../l1/derive';
import { sendSstsTransaction } from '../l1/transactions';
import {
  getCreateDistributionEscrowInstruction,
  getClaimDistributionInstruction,
  getCreateProofAccountInstruction,
  getSplitInstruction,
  getConvertInstruction,
  SECURITY_TOKEN_PROGRAM_PROGRAM_ADDRESS,
} from '../l0';

const ASSOCIATED_TOKEN_PROGRAM_ID =
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL' as Address;

/**
 * Create a distribution escrow with a Merkle root.
 *
 * Sets up an escrow account that holders can claim from using Merkle proofs.
 */
export async function createDistribution(
  rpc: Rpc<SolanaRpcApi>,
  rpcSubscriptions: RpcSubscriptions<SolanaRpcSubscriptionsApi>,
  payer: TransactionSigner,
  mint: Address,
  input: DistributionInput
): Promise<WorkflowResult<{ actionId: number }>> {
  const [verificationConfigPda] = await deriveVerificationConfigPda(
    mint,
    20,
    SECURITY_TOKEN_PROGRAM_PROGRAM_ADDRESS
  );

  const distributionEscrowAuthority = mint;

  const instruction = getCreateDistributionEscrowInstruction({
    mint,
    verificationConfigOrMintAuthority: verificationConfigPda,
    instructionsSysvarOrCreator: payer.address,
    distributionEscrowAuthority,
    payer,
    distributionTokenAccount: input.escrowTokenAccount,
    distributionMint: mint,
    tokenProgram: TOKEN_2022_PROGRAM_ID,
    associatedTokenAccountProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    systemProgram: SYSTEM_PROGRAM_ID,
    createDistributionEscrowArgs: {
      actionId: BigInt(input.actionId ?? 0),
      merkleRoot: input.merkleRoot,
    },
  });

  const signature = await sendSstsTransaction(
    rpc,
    rpcSubscriptions,
    payer,
    [instruction],
    'createDistribution'
  );

  return {
    signatures: [signature],
    addresses: {
      escrowTokenAccount: input.escrowTokenAccount,
      verificationConfig: verificationConfigPda,
    },
    data: { actionId: input.actionId ?? 0 },
  };
}

/**
 * Claim tokens from a distribution using a Merkle proof.
 */
export async function claimDistribution(
  rpc: Rpc<SolanaRpcApi>,
  rpcSubscriptions: RpcSubscriptions<SolanaRpcSubscriptionsApi>,
  claimant: TransactionSigner,
  mint: Address,
  input: ClaimDistributionWorkflowInput
): Promise<WorkflowResult> {
  const [proofPda] = await deriveProofAccountPda(
    mint,
    claimant.address,
    SECURITY_TOKEN_PROGRAM_PROGRAM_ADDRESS
  );

  const [verificationConfigPda] = await deriveVerificationConfigPda(
    mint,
    21,
    SECURITY_TOKEN_PROGRAM_PROGRAM_ADDRESS
  );

  const instructions: any[] = [];

  // Create proof account if proof is provided
  if (input.proof && input.proof.length > 0) {
    const createProofInstruction = getCreateProofAccountInstruction({
      mint,
      verificationConfig: verificationConfigPda,
      instructionsSysvar: INSTRUCTIONS_SYSVAR_ID,
      payer: claimant,
      mintAccount: mint,
      proofAccount: proofPda,
      tokenAccount: input.claimantTokenAccount,
      systemProgram: SYSTEM_PROGRAM_ID,
      createProofArgs: {
        actionId: BigInt(input.actionId ?? 0),
        data: input.proof.map((p) => p),
      },
    });
    instructions.push(createProofInstruction);
  }

  const merkleProof: OptionOrNullable<Array<Uint8Array>> =
    input.proof && input.proof.length > 0 ? input.proof : null;

  const claimInstruction = getClaimDistributionInstruction({
    mint,
    verificationConfig: verificationConfigPda,
    instructionsSysvar: INSTRUCTIONS_SYSVAR_ID,
    permanentDelegateAuthority: claimant.address,
    payer: claimant,
    mintAccount: mint,
    eligibleTokenAccount: input.claimantTokenAccount,
    receiptAccount: proofPda,
    proofAccount: proofPda,
    transferHookProgram: TRANSFER_HOOK_PROGRAM_ID,
    tokenProgram: TOKEN_2022_PROGRAM_ID,
    systemProgram: SYSTEM_PROGRAM_ID,
    claimDistributionArgs: {
      actionId: BigInt(input.actionId ?? 0),
      amount: BigInt(input.amount),
      merkleRoot: input.merkleRoot,
      leafIndex: input.leafIndex ?? 0,
      merkleProof,
    },
  });

  instructions.push(claimInstruction);

  const signature = await sendSstsTransaction(
    rpc,
    rpcSubscriptions,
    claimant,
    instructions,
    'claimDistribution'
  );

  return {
    signatures: [signature],
    addresses: {
      proofAccount: proofPda,
      verificationConfig: verificationConfigPda,
    },
  };
}

/**
 * Execute a token split corporate action.
 */
export async function executeSplit(
  rpc: Rpc<SolanaRpcApi>,
  rpcSubscriptions: RpcSubscriptions<SolanaRpcSubscriptionsApi>,
  payer: TransactionSigner,
  mint: Address,
  rateAccount: Address,
  actionId: bigint,
  tokenAccount: Address
): Promise<WorkflowResult> {
  const [verificationConfigPda] = await deriveVerificationConfigPda(
    mint,
    16,
    SECURITY_TOKEN_PROGRAM_PROGRAM_ADDRESS
  );

  const instruction = getSplitInstruction({
    mint,
    verificationConfig: verificationConfigPda,
    instructionsSysvar: INSTRUCTIONS_SYSVAR_ID,
    mintAuthority: mint,
    permanentDelegate: payer.address,
    payer,
    mintAccount: mint,
    tokenAccount,
    rateAccount,
    receiptAccount: rateAccount,
    tokenProgram: TOKEN_2022_PROGRAM_ID,
    systemProgram: SYSTEM_PROGRAM_ID,
    splitArgs: {
      actionId,
    },
  });

  const signature = await sendSstsTransaction(
    rpc,
    rpcSubscriptions,
    payer,
    [instruction],
    'executeSplit'
  );

  return {
    signatures: [signature],
    addresses: { rateAccount, verificationConfig: verificationConfigPda },
  };
}

/**
 * Execute a token conversion corporate action.
 */
export async function executeConvert(
  rpc: Rpc<SolanaRpcApi>,
  rpcSubscriptions: RpcSubscriptions<SolanaRpcSubscriptionsApi>,
  payer: TransactionSigner,
  sourceMint: Address,
  targetMint: Address,
  rateAccount: Address,
  actionId: bigint,
  amountToConvert: bigint,
  tokenAccountFrom: Address,
  tokenAccountTo: Address
): Promise<WorkflowResult> {
  const [verificationConfigPda] = await deriveVerificationConfigPda(
    sourceMint,
    17,
    SECURITY_TOKEN_PROGRAM_PROGRAM_ADDRESS
  );

  const instruction = getConvertInstruction({
    mint: sourceMint,
    verificationConfig: verificationConfigPda,
    instructionsSysvar: INSTRUCTIONS_SYSVAR_ID,
    mintAuthority: sourceMint,
    permanentDelegate: payer.address,
    payer,
    mintFrom: sourceMint,
    mintTo: targetMint,
    tokenAccountFrom,
    tokenAccountTo,
    rateAccount,
    receiptAccount: rateAccount,
    tokenProgram: TOKEN_2022_PROGRAM_ID,
    systemProgram: SYSTEM_PROGRAM_ID,
    convertArgs: {
      actionId,
      amountToConvert,
    },
  });

  const signature = await sendSstsTransaction(
    rpc,
    rpcSubscriptions,
    payer,
    [instruction],
    'executeConvert'
  );

  return {
    signatures: [signature],
    addresses: {
      rateAccount,
      sourceMint,
      targetMint,
      verificationConfig: verificationConfigPda,
    },
  };
}
