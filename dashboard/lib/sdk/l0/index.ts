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

export { SECURITY_TOKEN_PROGRAM_PROGRAM_ADDRESS } from '../../canonical-ssts/clients/typescript/src/generated/programs';

export { getInitializeMintInstruction } from '../../canonical-ssts/clients/typescript/src/generated/instructions/initializeMint';
export { getInitializeVerificationConfigInstruction } from '../../canonical-ssts/clients/typescript/src/generated/instructions/initializeVerificationConfig';
export { getMintInstruction } from '../../canonical-ssts/clients/typescript/src/generated/instructions/mint';
export { getTransferInstruction } from '../../canonical-ssts/clients/typescript/src/generated/instructions/transfer';
export { getPauseInstruction } from '../../canonical-ssts/clients/typescript/src/generated/instructions/pause';
export { getResumeInstruction } from '../../canonical-ssts/clients/typescript/src/generated/instructions/resume';
export { getFreezeInstruction } from '../../canonical-ssts/clients/typescript/src/generated/instructions/freeze';
export { getThawInstruction } from '../../canonical-ssts/clients/typescript/src/generated/instructions/thaw';
export { getCreateDistributionEscrowInstruction } from '../../canonical-ssts/clients/typescript/src/generated/instructions/createDistributionEscrow';
export { getClaimDistributionInstruction } from '../../canonical-ssts/clients/typescript/src/generated/instructions/claimDistribution';
export { getCreateProofAccountInstruction } from '../../canonical-ssts/clients/typescript/src/generated/instructions/createProofAccount';
export { getSplitInstruction } from '../../canonical-ssts/clients/typescript/src/generated/instructions/split';
export { getConvertInstruction } from '../../canonical-ssts/clients/typescript/src/generated/instructions/convert';
