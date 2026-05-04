/**
 * Canonical SSTS program addresses and SDK metadata.
 * Addresses are typed as Address<...> when consumed by @solana/kit.
 */

import type { Address } from '@solana/kit';

export const SSTS_PROGRAM_ID = 'SSTS8Qk2bW3aVaBEsY1Ras95YdbaaYQQx21JWHxvjap' as Address<'SSTS8Qk2bW3aVaBEsY1Ras95YdbaaYQQx21JWHxvjap'>;
export const TRANSFER_HOOK_PROGRAM_ID =
  'HookXqLKgPaNrHBJ9Jui7oQZz93vMbtA88JjsLa8bmfL' as Address<'HookXqLKgPaNrHBJ9Jui7oQZz93vMbtA88JjsLa8bmfL'>;
export const FAMP_PROGRAM_ID = '99frBpGJFhSx1qMt64T8HSfZMLUiy5YhZVmnG7X4pk2K' as Address<'99frBpGJFhSx1qMt64T8HSfZMLUiy5YhZVmnG7X4pk2K'>;
export const NOOP_VERIFICATION_PROGRAM_ID =
  '5gPMypQiHYVmx3jFJAGr72wrB7f1bgmud3mHtpHUGyLd' as Address<'5gPMypQiHYVmx3jFJAGr72wrB7f1bgmud3mHtpHUGyLd'>;

export const TOKEN_2022_PROGRAM_ID =
  'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb' as Address<'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'>;
export const SYSTEM_PROGRAM_ID = '11111111111111111111111111111111' as Address<'11111111111111111111111111111111'>;
export const RENT_SYSVAR_ID = 'SysvarRent111111111111111111111111111111111' as Address<'SysvarRent111111111111111111111111111111111'>;
export const INSTRUCTIONS_SYSVAR_ID =
  'Sysvar1nstructions1111111111111111111111111' as Address<'Sysvar1nstructions1111111111111111111111111'>;

export const CANONICAL_COMMIT = '1ab607e';
export const CANONICAL_IDL_VERSION = '0.1.0';

/** Discriminator values for canonical SSTS instructions */
export enum SstsInstruction {
  InitializeMint = 0,
  UpdateMetadata = 1,
  InitializeVerificationConfig = 2,
  UpdateVerificationConfig = 3,
  TrimVerificationConfig = 4,
  Verify = 5,
  Mint = 6,
  Burn = 7,
  Pause = 8,
  Resume = 9,
  Freeze = 10,
  Thaw = 11,
  Transfer = 12,
  CreateRateAccount = 13,
  UpdateRateAccount = 14,
  CloseRateAccount = 15,
  Split = 16,
  Convert = 17,
  CreateProofAccount = 18,
  UpdateProofAccount = 19,
  CreateDistributionEscrow = 20,
  ClaimDistribution = 21,
  CloseActionReceiptAccount = 22,
  CloseClaimReceiptAccount = 23,
}
