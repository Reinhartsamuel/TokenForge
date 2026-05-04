/**
 * L0 — Canonical SSTS client re-export
 *
 * Re-exports specific items from the canonical generated client from the git submodule
 * and pins program IDs / versions for this SDK release.
 */

export {
  SSTS_PROGRAM_ID,
  TRANSFER_HOOK_PROGRAM_ID,
  FAMP_PROGRAM_ID,
  NOOP_VERIFICATION_PROGRAM_ID,
  CANONICAL_COMMIT,
  CANONICAL_IDL_VERSION,
} from '../utils/constants';

export { SECURITY_TOKEN_PROGRAM_PROGRAM_ADDRESS } from '../../../lib/canonical-ssts/clients/typescript/src/generated/programs';

export { getInitializeMintInstruction } from '../../../lib/canonical-ssts/clients/typescript/src/generated/instructions/initializeMint';
export { getInitializeVerificationConfigInstruction } from '../../../lib/canonical-ssts/clients/typescript/src/generated/instructions/initializeVerificationConfig';
export { getMintInstruction } from '../../../lib/canonical-ssts/clients/typescript/src/generated/instructions/mint';
export { getTransferInstruction } from '../../../lib/canonical-ssts/clients/typescript/src/generated/instructions/transfer';
export { getPauseInstruction } from '../../../lib/canonical-ssts/clients/typescript/src/generated/instructions/pause';
export { getResumeInstruction } from '../../../lib/canonical-ssts/clients/typescript/src/generated/instructions/resume';
export { getFreezeInstruction } from '../../../lib/canonical-ssts/clients/typescript/src/generated/instructions/freeze';
export { getThawInstruction } from '../../../lib/canonical-ssts/clients/typescript/src/generated/instructions/thaw';
export { getCreateDistributionEscrowInstruction } from '../../../lib/canonical-ssts/clients/typescript/src/generated/instructions/createDistributionEscrow';
export { getClaimDistributionInstruction } from '../../../lib/canonical-ssts/clients/typescript/src/generated/instructions/claimDistribution';
export { getCreateProofAccountInstruction } from '../../../lib/canonical-ssts/clients/typescript/src/generated/instructions/createProofAccount';
export { getSplitInstruction } from '../../../lib/canonical-ssts/clients/typescript/src/generated/instructions/split';
export { getConvertInstruction } from '../../../lib/canonical-ssts/clients/typescript/src/generated/instructions/convert';
