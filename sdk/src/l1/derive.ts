/**
 * L1 — PDA Derivation Helpers
 *
 * Derives canonical SSTS and FAMP account addresses from known seeds.
 * Address strings are decoded to raw bytes before being used as PDA seeds,
 * since @solana/kit enforces a 32-byte maximum per seed.
 */

import {
  getProgramDerivedAddress,
  type Address,
  type ProgramDerivedAddress,
} from '@solana/kit';
import bs58 from 'bs58';
import bs58 from 'bs58';
import {
  SSTS_PROGRAM_ID,
  TRANSFER_HOOK_PROGRAM_ID,
  FAMP_PROGRAM_ID,
} from '../utils/constants';
import { FAMP_POLICY_SEED } from '../utils/types';

const VERIFICATION_CONFIG_SEED = 'verification_config';

function addressBytes(addr: Address): Uint8Array {
  return bs58.decode(addr);
}

/**
 * Derive the VerificationConfig PDA for a given mint + instruction discriminator.
 *
 * Seed: [b"verification_config", mint_pubkey, discriminator_byte]
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
 * Seed: [b"mint.authority", mint_pubkey, creator_pubkey]
 */
export async function deriveMintAuthorityPda(
  mint: Address,
  creator: Address,
  programAddress: Address = SSTS_PROGRAM_ID
): Promise<ProgramDerivedAddress> {
  return getProgramDerivedAddress({
    programAddress,
    seeds: ['mint.authority', addressBytes(mint), addressBytes(creator)],
  });
}

/**
 * Derive the RateAccount PDA for a given mint + action ID.
 *
 * Seed: [b"rate", mint_pubkey, action_id_bytes]
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
 * Seed: [b"proof", mint_pubkey, claimant_pubkey]
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
 * Derive the FreezeAuthority PDA for a given mint.
 *
 * Seed: [b"mint.freeze_authority", mint_pubkey]
 */
export async function deriveFreezeAuthorityPda(
  mint: Address,
  programAddress: Address = SSTS_PROGRAM_ID
): Promise<ProgramDerivedAddress> {
  return getProgramDerivedAddress({
    programAddress,
    seeds: ['mint.freeze_authority', addressBytes(mint)],
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

  const keyInstructions = [
    2,
    3,
    6,
    12,
    8,
    9,
    10,
    11,
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
