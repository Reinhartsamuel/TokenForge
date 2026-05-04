import {
  type Address,
  type ProgramDerivedAddress,
} from '@solana/kit';

/** Seed bytes used by FAMP to derive the PolicyAccount PDA */
export const FAMP_POLICY_SEED = new Uint8Array([
  102, 97, 109, 112, 95, 112, 111, 108, 105, 99, 121,
]); // "famp_policy"

/**
 * Shared types used across L1 and L2 layers.
 */

export type SstsAddress<T extends string = string> = Address<T>;

export type SstsPda = ProgramDerivedAddress;

export interface TokenForgeConfig {
  /** SSTS core program address */
  sstsProgramId: SstsAddress;
  /** Transfer hook program address */
  transferHookProgramId: SstsAddress;
  /** FAMP program address (optional) */
  fampProgramId?: SstsAddress;
}

export interface VerificationConfigInput {
  /** SSTS instruction discriminator to configure (0-23) */
  instructionDiscriminator: number;
  /** Verification program addresses to register */
  programs: SstsAddress[];
  /** Whether to use CPI mode (true) or introspection mode (false) */
  cpiMode?: boolean;
}

export interface TokenMetadataInput {
  name: string;
  symbol: string;
  uri: string;
  /** Optional key-value pairs stored in the metadata extension */
  additional?: Record<string, string>;
}

export interface TokenInitInput {
  decimals: number;
  metadata: TokenMetadataInput;
  /** Verification programs to register for transfer verification.
   *  Defaults to the no-op verifier if omitted. */
  verificationPrograms?: SstsAddress[];
  /** Enable CPI mode for verification. Default: false (introspection) */
  verificationCpiMode?: boolean;
}

export interface MintTokensInput {
  amount: bigint;
  /** Destination token account address */
  destination: SstsAddress;
  /** Optional verification program addresses for this mint */
  verificationPrograms?: SstsAddress[];
}

export interface TransferTokensInput {
  amount: bigint;
  from: SstsAddress;
  to: SstsAddress;
  /** Optional: override verification for this transfer */
  verificationPrograms?: SstsAddress[];
}

export interface FreezeAccountInput {
  /** Token account to freeze */
  tokenAccount: SstsAddress;
}

export interface ThawAccountInput {
  /** Token account to thaw */
  tokenAccount: SstsAddress;
}

export interface DistributionInput {
  /** Unique action identifier for the distribution */
  actionId?: number;
  /** Merkle root of the distribution tree (32 bytes) */
  merkleRoot: Uint8Array;
  /** Escrow token account holding the distribution funds */
  escrowTokenAccount: SstsAddress;
}

export interface ClaimDistributionWorkflowInput {
  /** Unique action identifier for the distribution */
  actionId?: number;
  /** Merkle root of the distribution tree (32 bytes) */
  merkleRoot: Uint8Array;
  /** Claimer's token account to receive tokens */
  claimantTokenAccount: SstsAddress;
  /** Amount being claimed (raw token units) */
  amount: bigint;
  /** Index of this claim in the Merkle tree */
  leafIndex?: number;
  /** Merkle proof elements (each is a 32-byte hash) */
  proof?: Uint8Array[];
}

export interface FampPolicyAccount {
  mint: SstsAddress;
  issuerAuthority: SstsAddress;
  allowlistMode: boolean;
  allowlist: SstsAddress[];
  blocklist: SstsAddress[];
  allowlistCount: number;
  blocklistCount: number;
  bump: number;
}

export interface WorkflowResult<T = void> {
  /** Transaction signatures produced by the workflow */
  signatures: string[];
  /** PDA addresses derived during the workflow */
  addresses: Record<string, SstsAddress>;
  /** Workflow-specific return data */
  data?: T;
}
