/**
 * L2 — Token Lifecycle Workflows
 *
 * High-level issuer operations that compose canonical SSTS instructions
 * into simple, task-oriented APIs.
 */

import {
  type Address,
  type TransactionSigner,
  type Rpc,
  type SolanaRpcApi,
  type RpcSubscriptions,
  type SolanaRpcSubscriptionsApi,
} from '@solana/kit';
import {
  SSTS_PROGRAM_ID,
  TRANSFER_HOOK_PROGRAM_ID,
  NOOP_VERIFICATION_PROGRAM_ID,
  INSTRUCTIONS_SYSVAR_ID,
  SYSTEM_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
} from '../utils/constants';
import type {
  TokenInitInput,
  MintTokensInput,
  TransferTokensInput,
  FreezeAccountInput,
  ThawAccountInput,
  WorkflowResult,
} from '../utils/types';
import {
  deriveMintAuthorityPda,
  deriveVerificationConfigPda,
} from '../l1/derive';
import { sendSstsTransaction } from '../l1/transactions';
import {
  getInitializeMintInstruction,
  getInitializeVerificationConfigInstruction,
  getMintInstruction,
  getTransferInstruction,
  getPauseInstruction,
  getResumeInstruction,
  getFreezeInstruction,
  getThawInstruction,
  SECURITY_TOKEN_PROGRAM_PROGRAM_ADDRESS,
} from '../l0';

const TRANSFER_VERIFICATION_DISCRIMINATOR = 12;

/**
 * Create a new security token with all required extensions and verification.
 *
 * This workflow:
 * 1. Derives the mint authority PDA
 * 2. Builds InitializeMint instruction (creates Token-2022 mint with SSTS extensions)
 * 3. Builds InitializeVerificationConfig for transfer verification
 * 4. Sends everything in a single transaction
 *
 * @param rpc - Solana RPC client
 * @param rpcSubscriptions - Solana RPC subscriptions client
 * @param creator - The issuer's transaction signer
 * @param mint - The mint keypair (TransactionSigner)
 * @param input - Token initialization parameters
 */
export async function createSecurityToken(
  rpc: Rpc<SolanaRpcApi>,
  rpcSubscriptions: RpcSubscriptions<SolanaRpcSubscriptionsApi>,
  creator: TransactionSigner,
  mint: TransactionSigner,
  input: TokenInitInput
): Promise<WorkflowResult> {
  const [mintAuthorityPda] = await deriveMintAuthorityPda(
    mint.address,
    creator.address,
    SECURITY_TOKEN_PROGRAM_PROGRAM_ADDRESS
  );

  const verificationPrograms =
    input.verificationPrograms ?? [
      NOOP_VERIFICATION_PROGRAM_ID as unknown as Address,
    ];

  const [transferVerificationConfigPda] =
    await deriveVerificationConfigPda(
      mint.address,
      TRANSFER_VERIFICATION_DISCRIMINATOR,
      SECURITY_TOKEN_PROGRAM_PROGRAM_ADDRESS
    );

  const initializeMintInstruction = getInitializeMintInstruction({
    mint,
    authority: mintAuthorityPda,
    payer: creator,
    tokenProgram: TOKEN_2022_PROGRAM_ID,
    systemProgram: SYSTEM_PROGRAM_ID,
    rentSysvar: 'SysvarRent111111111111111111111111111111111' as Address,
    initializeMintArgs: {
      ixMint: {
        decimals: input.decimals,
        mintAuthority: creator.address,
        freezeAuthority: mintAuthorityPda,
      },
      ixMetadataPointer: {
        authority: creator.address,
        metadataAddress: mint.address,
      },
      ixMetadata: {
        name: input.metadata.name,
        symbol: input.metadata.symbol,
        uri: input.metadata.uri,
        additionalMetadata: input.metadata.additional
          ? new TextEncoder().encode(JSON.stringify(input.metadata.additional))
          : new Uint8Array(),
      },
      ixScaledUiAmount: null,
    },
  });

  const initializeVerificationConfigInstruction =
    getInitializeVerificationConfigInstruction({
      mint: mint.address,
      verificationConfigOrMintAuthority: mintAuthorityPda,
      instructionsSysvarOrCreator: creator.address,
      payer: creator,
      mintAccount: mint.address,
      configAccount: transferVerificationConfigPda,
      systemProgram: SYSTEM_PROGRAM_ID,
      transferHookPda: TRANSFER_HOOK_PROGRAM_ID as unknown as Address,
      transferHookProgram: TRANSFER_HOOK_PROGRAM_ID as unknown as Address,
      initializeVerificationConfigArgs: {
        instructionDiscriminator: TRANSFER_VERIFICATION_DISCRIMINATOR,
        cpiMode: input.verificationCpiMode ?? false,
        programAddresses: verificationPrograms,
      },
    });

  const signature = await sendSstsTransaction(
    rpc,
    rpcSubscriptions,
    creator,
    [initializeMintInstruction, initializeVerificationConfigInstruction],
    'createSecurityToken'
  );

  return {
    signatures: [signature],
    addresses: {
      mint: mint.address,
      mintAuthority: mintAuthorityPda,
      transferVerificationConfig: transferVerificationConfigPda,
    },
  };
}

/**
 * Configure verification programs for a specific SSTS instruction.
 *
 * @param rpc - Solana RPC client
 * @param rpcSubscriptions - Solana RPC subscriptions client
 * @param payer - Transaction fee payer
 * @param mint - Token mint address
 * @param instructionDiscriminator - Which SSTS instruction to configure (0-23)
 * @param programs - Verification program addresses to register
 * @param cpiMode - Whether to use CPI mode (default: false = introspection)
 */
export async function configureVerification(
  rpc: Rpc<SolanaRpcApi>,
  rpcSubscriptions: RpcSubscriptions<SolanaRpcSubscriptionsApi>,
  payer: TransactionSigner,
  mint: Address,
  instructionDiscriminator: number,
  programs: Address[],
  cpiMode = false
): Promise<WorkflowResult> {
  const [configPda] = await deriveVerificationConfigPda(
    mint,
    instructionDiscriminator,
    SECURITY_TOKEN_PROGRAM_PROGRAM_ADDRESS
  );

  const instruction = getInitializeVerificationConfigInstruction({
    mint,
    verificationConfigOrMintAuthority: configPda,
    instructionsSysvarOrCreator: payer.address,
    payer,
    mintAccount: mint,
    configAccount: configPda,
    systemProgram: SYSTEM_PROGRAM_ID,
    transferHookPda: TRANSFER_HOOK_PROGRAM_ID as unknown as Address,
    transferHookProgram: TRANSFER_HOOK_PROGRAM_ID as unknown as Address,
    initializeVerificationConfigArgs: {
      instructionDiscriminator,
      cpiMode,
      programAddresses: programs,
    },
  });

  const signature = await sendSstsTransaction(
    rpc,
    rpcSubscriptions,
    payer,
    [instruction],
    'configureVerification'
  );

  return {
    signatures: [signature],
    addresses: {
      verificationConfig: configPda,
    },
  };
}

/**
 * Mint tokens to a destination token account.
 *
 * @param rpc - Solana RPC client
 * @param rpcSubscriptions - Solana RPC subscriptions client
 * @param authority - Mint authority signer
 * @param mint - Token mint address
 * @param input - Mint parameters
 */
export async function mintTokens(
  rpc: Rpc<SolanaRpcApi>,
  rpcSubscriptions: RpcSubscriptions<SolanaRpcSubscriptionsApi>,
  authority: TransactionSigner,
  mint: Address,
  input: MintTokensInput
): Promise<WorkflowResult> {
  const [mintAuthorityPda] = await deriveMintAuthorityPda(
    mint,
    authority.address,
    SECURITY_TOKEN_PROGRAM_PROGRAM_ADDRESS
  );

  const [verificationConfigPda] = await deriveVerificationConfigPda(
    mint,
    6, // Mint discriminator
    SECURITY_TOKEN_PROGRAM_PROGRAM_ADDRESS
  );

  const instruction = getMintInstruction({
    mint,
    verificationConfig: verificationConfigPda,
    instructionsSysvar: INSTRUCTIONS_SYSVAR_ID,
    mintAuthority: mintAuthorityPda,
    mintAccount: mint,
    destination: input.destination,
    tokenProgram: TOKEN_2022_PROGRAM_ID,
    amount: input.amount,
  });

  const signature = await sendSstsTransaction(
    rpc,
    rpcSubscriptions,
    authority,
    [instruction],
    'mintTokens'
  );

  return {
    signatures: [signature],
    addresses: {
      mintAuthority: mintAuthorityPda,
      verificationConfig: verificationConfigPda,
    },
  };
}

/**
 * Transfer tokens between token accounts (gated by verification).
 *
 * @param rpc - Solana RPC client
 * @param rpcSubscriptions - Solana RPC subscriptions client
 * @param authority - Transfer authority signer
 * @param mint - Token mint address
 * @param input - Transfer parameters
 */
export async function transferTokens(
  rpc: Rpc<SolanaRpcApi>,
  rpcSubscriptions: RpcSubscriptions<SolanaRpcSubscriptionsApi>,
  authority: TransactionSigner,
  mint: Address,
  input: TransferTokensInput
): Promise<WorkflowResult> {
  const [verificationConfigPda] = await deriveVerificationConfigPda(
    mint,
    12, // Transfer discriminator
    SECURITY_TOKEN_PROGRAM_PROGRAM_ADDRESS
  );

  const instruction = getTransferInstruction({
    mint,
    verificationConfig: verificationConfigPda,
    instructionsSysvar: INSTRUCTIONS_SYSVAR_ID,
    permanentDelegateAuthority: authority.address,
    mintAccount: mint,
    fromTokenAccount: input.from,
    toTokenAccount: input.to,
    transferHookProgram: TRANSFER_HOOK_PROGRAM_ID as unknown as Address,
    tokenProgram: TOKEN_2022_PROGRAM_ID,
    amount: input.amount,
  });

  const signature = await sendSstsTransaction(
    rpc,
    rpcSubscriptions,
    authority,
    [instruction],
    'transferTokens'
  );

  return {
    signatures: [signature],
    addresses: {
      verificationConfig: verificationConfigPda,
    },
  };
}

/**
 * Pause all token operations for a mint.
 */
export async function pauseToken(
  rpc: Rpc<SolanaRpcApi>,
  rpcSubscriptions: RpcSubscriptions<SolanaRpcSubscriptionsApi>,
  authority: TransactionSigner,
  mint: Address
): Promise<WorkflowResult> {
  const [verificationConfigPda] = await deriveVerificationConfigPda(
    mint,
    8, // Pause discriminator
    SECURITY_TOKEN_PROGRAM_PROGRAM_ADDRESS
  );

  const [mintAuthorityPda] = await deriveMintAuthorityPda(
    mint,
    authority.address,
    SECURITY_TOKEN_PROGRAM_PROGRAM_ADDRESS
  );

  const instruction = getPauseInstruction({
    mint,
    verificationConfig: verificationConfigPda,
    instructionsSysvar: INSTRUCTIONS_SYSVAR_ID,
    pauseAuthority: mintAuthorityPda,
    mintAccount: mint,
    tokenProgram: TOKEN_2022_PROGRAM_ID,
  });

  const signature = await sendSstsTransaction(
    rpc,
    rpcSubscriptions,
    authority,
    [instruction],
    'pauseToken'
  );

  return {
    signatures: [signature],
    addresses: {
      mintAuthority: mintAuthorityPda,
      verificationConfig: verificationConfigPda,
    },
  };
}

/**
 * Resume token operations for a paused mint.
 */
export async function resumeToken(
  rpc: Rpc<SolanaRpcApi>,
  rpcSubscriptions: RpcSubscriptions<SolanaRpcSubscriptionsApi>,
  authority: TransactionSigner,
  mint: Address
): Promise<WorkflowResult> {
  const [verificationConfigPda] = await deriveVerificationConfigPda(
    mint,
    9, // Resume discriminator
    SECURITY_TOKEN_PROGRAM_PROGRAM_ADDRESS
  );

  const [mintAuthorityPda] = await deriveMintAuthorityPda(
    mint,
    authority.address,
    SECURITY_TOKEN_PROGRAM_PROGRAM_ADDRESS
  );

  const instruction = getResumeInstruction({
    mint,
    verificationConfig: verificationConfigPda,
    instructionsSysvar: INSTRUCTIONS_SYSVAR_ID,
    pauseAuthority: mintAuthorityPda,
    mintAccount: mint,
    tokenProgram: TOKEN_2022_PROGRAM_ID,
  });

  const signature = await sendSstsTransaction(
    rpc,
    rpcSubscriptions,
    authority,
    [instruction],
    'resumeToken'
  );

  return {
    signatures: [signature],
    addresses: {
      mintAuthority: mintAuthorityPda,
      verificationConfig: verificationConfigPda,
    },
  };
}

/**
 * Freeze a specific token account.
 */
export async function freezeAccount(
  rpc: Rpc<SolanaRpcApi>,
  rpcSubscriptions: RpcSubscriptions<SolanaRpcSubscriptionsApi>,
  authority: TransactionSigner,
  mint: Address,
  input: FreezeAccountInput
): Promise<WorkflowResult> {
  const [verificationConfigPda] = await deriveVerificationConfigPda(
    mint,
    10, // Freeze discriminator
    SECURITY_TOKEN_PROGRAM_PROGRAM_ADDRESS
  );

  const [mintAuthorityPda] = await deriveMintAuthorityPda(
    mint,
    authority.address,
    SECURITY_TOKEN_PROGRAM_PROGRAM_ADDRESS
  );

  const instruction = getFreezeInstruction({
    mint,
    verificationConfig: verificationConfigPda,
    instructionsSysvar: INSTRUCTIONS_SYSVAR_ID,
    freezeAuthority: mintAuthorityPda,
    mintAccount: mint,
    tokenAccount: input.tokenAccount,
    tokenProgram: TOKEN_2022_PROGRAM_ID,
  });

  const signature = await sendSstsTransaction(
    rpc,
    rpcSubscriptions,
    authority,
    [instruction],
    'freezeAccount'
  );

  return {
    signatures: [signature],
    addresses: {
      mintAuthority: mintAuthorityPda,
      verificationConfig: verificationConfigPda,
    },
  };
}

/**
 * Thaw a frozen token account.
 */
export async function thawAccount(
  rpc: Rpc<SolanaRpcApi>,
  rpcSubscriptions: RpcSubscriptions<SolanaRpcSubscriptionsApi>,
  authority: TransactionSigner,
  mint: Address,
  input: ThawAccountInput
): Promise<WorkflowResult> {
  const [verificationConfigPda] = await deriveVerificationConfigPda(
    mint,
    11, // Thaw discriminator
    SECURITY_TOKEN_PROGRAM_PROGRAM_ADDRESS
  );

  const [mintAuthorityPda] = await deriveMintAuthorityPda(
    mint,
    authority.address,
    SECURITY_TOKEN_PROGRAM_PROGRAM_ADDRESS
  );

  const instruction = getThawInstruction({
    mint,
    verificationConfig: verificationConfigPda,
    instructionsSysvar: INSTRUCTIONS_SYSVAR_ID,
    freezeAuthority: mintAuthorityPda,
    mintAccount: mint,
    tokenAccount: input.tokenAccount,
    tokenProgram: TOKEN_2022_PROGRAM_ID,
  });

  const signature = await sendSstsTransaction(
    rpc,
    rpcSubscriptions,
    authority,
    [instruction],
    'thawAccount'
  );

  return {
    signatures: [signature],
    addresses: {
      mintAuthority: mintAuthorityPda,
      verificationConfig: verificationConfigPda,
    },
  };
}
