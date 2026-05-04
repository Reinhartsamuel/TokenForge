/**
 * L2 — FAMP Policy Management Workflows
 *
 * High-level APIs for managing FAMP allowlist/blocklist policies.
 * FAMP is an Anchor program, so we use @coral-xyz/anchor for interaction.
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
  FAMP_PROGRAM_ID,
  SSTS_PROGRAM_ID,
} from '../utils/constants';
import type { WorkflowResult } from '../utils/types';
import { deriveFampPolicyPda } from '../l1/derive';
import { sendSstsTransaction } from '../l1/transactions';

/**
 * FAMP instruction discriminators (Anchor-derived).
 * These are the first 8 bytes of the SHA-256 hash of each instruction name.
 */
const FAMP_DISCRIMINATORS = {
  createPolicy: new Uint8Array([
    171, 214, 171, 177, 172, 37, 126, 189,
  ]),
  addToAllowlist: new Uint8Array([
    239, 163, 94, 241, 244, 175, 118, 189,
  ]),
  removeFromAllowlist: new Uint8Array([
    137, 219, 148, 130, 174, 186, 147, 165,
  ]),
  addToBlocklist: new Uint8Array([
    25, 128, 165, 241, 245, 242, 207, 59,
  ]),
  removeFromBlocklist: new Uint8Array([
    69, 87, 225, 218, 157, 123, 220, 236,
  ]),
  verifyTransfer: new Uint8Array([
    51, 173, 177, 219, 221, 183, 29, 112,
  ]),
} as const;

/**
 * Build a FAMP instruction with discriminator and accounts.
 */
function buildFampInstruction(
  discriminator: Uint8Array,
  accounts: { pubkey: Address; isSigner: boolean; isWritable: boolean }[],
  data: Uint8Array = new Uint8Array()
): { programAddress: Address; accounts: any[]; data: Uint8Array } {
  return {
    programAddress: FAMP_PROGRAM_ID as unknown as Address,
    accounts: accounts.map((a) => ({
      address: a.pubkey,
      role: a.isSigner
        ? a.isWritable
          ? 3 // Writable + Signer
          : 2 // Readonly + Signer
        : a.isWritable
          ? 1 // Writable
          : 0, // Readonly
    })),
    data: new Uint8Array([...discriminator, ...data]),
  };
}

/**
 * Encode a Pubkey as raw bytes for instruction data.
 */
function encodePubkey(address: Address): Uint8Array {
  // Address is a branded string - convert to bytes
  const bytes = new Uint8Array(32);
  // In @solana/kit v2, Address is a base58 string
  // We need to decode it to bytes - use the base58 library
  const base58Chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let num = BigInt(0);
  for (const char of address) {
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

/**
 * Create a new FAMP policy for a given mint.
 *
 * @param rpc - Solana RPC client
 * @param issuer - The issuer's transaction signer
 * @param mint - Token mint address
 * @param allowlistMode - If true, only allowlisted wallets can participate
 */
export async function createFampPolicy(
  rpc: Rpc<SolanaRpcApi>,
  rpcSubscriptions: RpcSubscriptions<SolanaRpcSubscriptionsApi>,
  issuer: TransactionSigner,
  mint: Address,
  allowlistMode = false
): Promise<WorkflowResult<{ allowlistMode: boolean; bump: number }>> {
  const [policyPda, policyBump] = await deriveFampPolicyPda(
    mint,
    FAMP_PROGRAM_ID as unknown as Address
  );

  const discriminator = FAMP_DISCRIMINATORS.createPolicy;
  const allowlistModeByte = allowlistMode ? new Uint8Array([1]) : new Uint8Array([0]);
  const data = new Uint8Array([...discriminator, ...allowlistModeByte]);

  const instruction = {
    programAddress: FAMP_PROGRAM_ID as unknown as Address,
    accounts: [
      {
        address: issuer.address,
        role: 3, // Writable + Signer
      },
      {
        address: mint,
        role: 0, // Readonly
      },
      {
        address: policyPda,
        role: 1, // Writable
      },
      {
        address: '11111111111111111111111111111111' as Address,
        role: 0, // Readonly (system program)
      },
    ],
    data,
  };

  const signature = await sendSstsTransaction(
    rpc,
    rpcSubscriptions,
    issuer,
    [instruction as any],
    'createFampPolicy'
  );

  return {
    signatures: [signature],
    addresses: {
      policy: policyPda,
    },
    data: { allowlistMode, bump: policyBump },
  };
}

/**
 * Add a wallet to the FAMP allowlist.
 *
 * @param rpc - Solana RPC client
 * @param issuer - The issuer's transaction signer
 * @param mint - Token mint address
 * @param wallet - Wallet address to add
 */
export async function addToAllowlist(
  rpc: Rpc<SolanaRpcApi>,
  rpcSubscriptions: RpcSubscriptions<SolanaRpcSubscriptionsApi>,
  issuer: TransactionSigner,
  mint: Address,
  wallet: Address
): Promise<WorkflowResult<{ wallet: Address }>> {
  const [policyPda] = await deriveFampPolicyPda(
    mint,
    FAMP_PROGRAM_ID as unknown as Address
  );

  const walletBytes = encodePubkey(wallet);
  const discriminator = FAMP_DISCRIMINATORS.addToAllowlist;
  const data = new Uint8Array([...discriminator, ...walletBytes]);

  const instruction = {
    programAddress: FAMP_PROGRAM_ID as unknown as Address,
    accounts: [
      { address: issuer.address, role: 2 as const },
      { address: policyPda, role: 1 as const },
    ],
    data,
  };

  const signature = await sendSstsTransaction(
    rpc,
    rpcSubscriptions,
    issuer,
    [instruction as any],
    'addToAllowlist'
  );

  return {
    signatures: [signature],
    addresses: { policy: policyPda },
    data: { wallet },
  };
}

/**
 * Remove a wallet from the FAMP allowlist.
 *
 * Emits a WalletBlocked event — the SDK should listen for this
 * and execute canonical SSTS Freeze via freezeAccount().
 *
 * @param rpc - Solana RPC client
 * @param rpcSubscriptions - Solana RPC subscriptions client
 * @param issuer - The issuer's transaction signer
 * @param mint - Token mint address
 * @param wallet - Wallet address to remove
 */
export async function removeFromAllowlist(
  rpc: Rpc<SolanaRpcApi>,
  rpcSubscriptions: RpcSubscriptions<SolanaRpcSubscriptionsApi>,
  issuer: TransactionSigner,
  mint: Address,
  wallet: Address
): Promise<WorkflowResult<{ wallet: Address; event: string }>> {
  const [policyPda] = await deriveFampPolicyPda(
    mint,
    FAMP_PROGRAM_ID as unknown as Address
  );

  const walletBytes = encodePubkey(wallet);
  const discriminator = FAMP_DISCRIMINATORS.removeFromAllowlist;
  const data = new Uint8Array([...discriminator, ...walletBytes]);

  const instruction = {
    programAddress: FAMP_PROGRAM_ID as unknown as Address,
    accounts: [
      { address: issuer.address, role: 2 as const },
      { address: policyPda, role: 1 as const },
    ],
    data,
  };

  const signature = await sendSstsTransaction(
    rpc,
    rpcSubscriptions,
    issuer,
    [instruction as any],
    'removeFromAllowlist'
  );

  return {
    signatures: [signature],
    addresses: { policy: policyPda },
    data: { wallet, event: 'WalletBlocked' },
  };
}

/**
 * Add a wallet to the FAMP blocklist.
 *
 * Emits a WalletBlocked event.
 */
export async function addToBlocklist(
  rpc: Rpc<SolanaRpcApi>,
  rpcSubscriptions: RpcSubscriptions<SolanaRpcSubscriptionsApi>,
  issuer: TransactionSigner,
  mint: Address,
  wallet: Address
): Promise<WorkflowResult<{ wallet: Address; event: string }>> {
  const [policyPda] = await deriveFampPolicyPda(
    mint,
    FAMP_PROGRAM_ID as unknown as Address
  );

  const walletBytes = encodePubkey(wallet);
  const discriminator = FAMP_DISCRIMINATORS.addToBlocklist;
  const data = new Uint8Array([...discriminator, ...walletBytes]);

  const instruction = {
    programAddress: FAMP_PROGRAM_ID as unknown as Address,
    accounts: [
      { address: issuer.address, role: 2 as const },
      { address: policyPda, role: 1 as const },
    ],
    data,
  };

  const signature = await sendSstsTransaction(
    rpc,
    rpcSubscriptions,
    issuer,
    [instruction as any],
    'addToBlocklist'
  );

  return {
    signatures: [signature],
    addresses: { policy: policyPda },
    data: { wallet, event: 'WalletBlocked' },
  };
}

/**
 * Remove a wallet from the FAMP blocklist.
 *
 * Emits a WalletUnblocked event.
 */
export async function removeFromBlocklist(
  rpc: Rpc<SolanaRpcApi>,
  rpcSubscriptions: RpcSubscriptions<SolanaRpcSubscriptionsApi>,
  issuer: TransactionSigner,
  mint: Address,
  wallet: Address
): Promise<WorkflowResult<{ wallet: Address; event: string }>> {
  const [policyPda] = await deriveFampPolicyPda(
    mint,
    FAMP_PROGRAM_ID as unknown as Address
  );

  const walletBytes = encodePubkey(wallet);
  const discriminator = FAMP_DISCRIMINATORS.removeFromBlocklist;
  const data = new Uint8Array([...discriminator, ...walletBytes]);

  const instruction = {
    programAddress: FAMP_PROGRAM_ID as unknown as Address,
    accounts: [
      { address: issuer.address, role: 2 as const },
      { address: policyPda, role: 1 as const },
    ],
    data,
  };

  const signature = await sendSstsTransaction(
    rpc,
    rpcSubscriptions,
    issuer,
    [instruction as any],
    'removeFromBlocklist'
  );

  return {
    signatures: [signature],
    addresses: { policy: policyPda },
    data: { wallet, event: 'WalletUnblocked' },
  };
}
