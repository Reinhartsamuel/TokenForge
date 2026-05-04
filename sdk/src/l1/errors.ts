/**
 * L1 — Error Enrichment
 *
 * Maps canonical SSTS program errors to human-readable messages
 * and adds SDK-level context.
 */

/** Canonical SSTS error codes from the IDL */
export enum SstsError {
  VerificationProgramNotFound = 'VerificationProgramNotFound',
  VerificationProgramCallFailed = 'VerificationProgramCallFailed',
  AccountIntersectionMismatch = 'AccountIntersectionMismatch',
  InvalidVerificationConfigPda = 'InvalidVerificationConfigPda',
  InternalMetadataRequiresData = 'InternalMetadataRequiresData',
  ExternalMetadataForbidsData = 'ExternalMetadataForbidsData',
  CannotModifyExternalMetadataAccount = 'CannotModifyExternalMetadataAccount',
  DuplicateActionReceipt = 'DuplicateActionReceipt',
  InvalidRateConfiguration = 'InvalidRateConfiguration',
  InvalidMintAuthority = 'InvalidMintAuthority',
}

/** SDK-level error that wraps a raw transaction error with context */
export class TokenForgeError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly workflow?: string,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = 'TokenForgeError';
  }
}

/**
 * Parse a raw Solana transaction error and enrich it with SSTS context.
 *
 * If the error logs contain a canonical SSTS error name, that name is used
 * as the code. Otherwise, a generic TokenForgeError is returned.
 */
export function enrichError(
  raw: Error,
  workflow?: string,
  logs?: string[]
): TokenForgeError {
  const logText = logs?.join('\n') ?? '';

  for (const errorName of Object.values(SstsError)) {
    if (logText.includes(errorName) || raw.message.includes(errorName)) {
      return new TokenForgeError(
        `SSTS error in ${workflow ?? 'workflow'}: ${errorName}`,
        errorName,
        workflow,
        raw
      );
    }
  }

  return new TokenForgeError(
    raw.message,
    undefined,
    workflow,
    raw
  );
}

/**
 * Assert that a condition holds, throwing a TokenForgeError if not.
 */
export function assert(
  condition: boolean,
  message: string,
  workflow?: string
): asserts condition {
  if (!condition) {
    throw new TokenForgeError(message, undefined, workflow);
  }
}

/**
 * Error codes specific to FAMP operations.
 */
export enum FampError {
  Unauthorized = 'Unauthorized',
  AllowlistFull = 'AllowlistFull',
  BlocklistFull = 'BlocklistFull',
  AlreadyInAllowlist = 'AlreadyInAllowlist',
  AlreadyInBlocklist = 'AlreadyInBlocklist',
  WalletNotFound = 'WalletNotFound',
  WalletBlocked = 'WalletBlocked',
  WalletNotAllowlisted = 'WalletNotAllowlisted',
  InvalidTokenAccount = 'InvalidTokenAccount',
}
