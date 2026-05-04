/**
 * L1 — PDA Derivation Helpers
 *
 * Derives canonical SSTS and FAMP account addresses from known seeds.
 * All functions use @solana/kit's address derivation utilities.
 */

import {
  getAddressEncoder,
  getProgramDerivedAddress,
  type Address,
  type ProgramDerivedAddress,
} from '@solana/kit';
import {
  SSTS_PROGRAM_ID,
  TRANSFER_HOOK_PROGRAM_ID,
  FAMP_PROGRAM_ID,
} from '../utils/constants';
import { FAMP_POLICY_SEED } from '../utils/types';

const VERIFICATION_CONFIG_SEED = 'verification_config';
const addressEncoder = getAddressEncoder();

function addressBytes(addr: Address): Uint8Array {
  return addressEncoder.encode(addr);
}

/**
 * Derive the VerificationConfig PDA for a given mint + instruction discriminator.
 *
 * Seed: [b"verification_config", mint_bytes, discriminator_byte]
 */
export async function deriveVerificationConfigPda(
  mint: Address,
  instructionDiscriminator: number,
  programAddress: Address = SSTS_PROGRAM_ID
): Promise<ProgramDerivedAddress> {
  return getProgramDerivedAddress({
    programAddress,
    seeds: [
      VERIFICATION_CONFIG_SEED,
      addressBytes(mint),
      new Uint8Array([instructionDiscriminator]),
    ],
  });
}

/**
 * Derive the MintAuthority PDA for a given mint + creator.
 *
 * Seed: [b"mint_authority", mint_bytes, creator_bytes]
 */
export async function deriveMintAuthorityPda(
  mint: Address,
  creator: Address,
  programAddress: Address = SSTS_PROGRAM_ID
): Promise<ProgramDerivedAddress> {
  return getProgramDerivedAddress({
    programAddress,
    seeds: ['mint_authority', addressBytes(mint), addressBytes(creator)],
  });
}

/**
 * Derive the RateAccount PDA for a given mint + action ID.
 *
 * Seed: [b"rate", mint_bytes, action_id_bytes]
 */
export async function deriveRateAccountPda(
  mint: Address,
  actionId: Uint8Array,
  programAddress: Address = SSTS_PROGRAM_ID
): Promise<ProgramDerivedAddress> {
  return getProgramDerivedAddress({
    programAddress,
    seeds: ['rate', addressBytes(mint), actionId],
  });
}

/**
 * Derive the ProofAccount PDA for a given mint + claimant.
 *
 * Seed: [b"proof", mint_bytes, claimant_bytes]
 */
export async function deriveProofAccountPda(
  mint: Address,
  claimant: Address,
  programAddress: Address = SSTS_PROGRAM_ID
): Promise<ProgramDerivedAddress> {
  return getProgramDerivedAddress({
    programAddress,
    seeds: ['proof', addressBytes(mint), addressBytes(claimant)],
  });
}

/**
 * Derive the FAMP PolicyAccount PDA for a given mint.
 *
 * Seed: [b"famp_policy", mint_bytes]
 */
export async function deriveFampPolicyPda(
  mint: Address,
  programAddress: Address = FAMP_PROGRAM_ID
): Promise<ProgramDerivedAddress> {
  return getProgramDerivedAddress({
    programAddress,
    seeds: [FAMP_POLICY_SEED, addressBytes(mint)],
  });
}

/**
 * Derive all PDAs needed for a new token initialization in one call.
 */
export async function deriveAllTokenPdas(
  mint: Address,
  creator: Address,
  programAddress: Address = SSTS_PROGRAM_ID
): Promise<{
  mintAuthority: ProgramDerivedAddress;
  verificationConfigs: Record<number, ProgramDerivedAddress>;
}> {
  const mintAuthority = await deriveMintAuthorityPda(
    mint,
    creator,
    programAddress
  );

  // Derive verification configs for key instructions
  const keyInstructions = [
    2, // InitializeVerificationConfig
    3, // UpdateVerificationConfig
    6, // Mint
    12, // Transfer
    8, // Pause
    9, // Resume
    10, // Freeze
    11, // Thaw
  ];

  const verificationConfigs: Record<number, ProgramDerivedAddress> = {};
  for (const disc of keyInstructions) {
    verificationConfigs[disc] = await deriveVerificationConfigPda(
      mint,
      disc,
      programAddress
    );
  }

  return { mintAuthority, verificationConfigs };
}
