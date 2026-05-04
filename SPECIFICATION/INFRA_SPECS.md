# Infrastructure Specifications: TokenForge (Canonical-First)

## Deployment Model

TokenForge services deploy independently from canonical SSTS programs.

- Canonical SSTS programs are treated as external protocol dependencies
- TokenForge deploys:
  - frontend dashboard
  - backend orchestration/indexing APIs
  - FAMP extension program
  - verification_policy_noop (test/devnet only)

## Environments

| Env | Frontend | Backend | Canonical SSTS Source |
|-----|----------|---------|------------------------|
| local | localhost:5173 | localhost:8787 | `lib/canonical-ssts` submodule (local build) |
| devnet | devnet.tokenforge.io | api-devnet.tokenforge.io | Canonical devnet deployment (pinned IDs) |
| staging | staging.tokenforge.io | api-staging.tokenforge.io | Pinned canonical target |
| prod | tokenforge.io | api.tokenforge.io | Audited canonical mainnet deployment |

## CI/CD

### Core pipeline
1. Lint and test frontend/backend/sdk
2. Build FAMP program (`anchor build`)
3. Build verification_policy_noop (`cargo build-sbf`)
4. Build artifacts
5. Run canonical compatibility suite
6. Deploy frontend/backend
7. Deploy FAMP only if changed

### Canonical compatibility gate (required)
- Fetch pinned canonical IDL from `lib/canonical-ssts/idl/security_token_program.json`
- Validate TokenForge SDK transaction builders against IDL expectations
- Fail release if compatibility assertions fail

### Submodule management
- CI checks out submodules: `git submodule update --init --recursive`
- Canonical commit is pinned in `.gitmodules`
- To update: `cd lib/canonical-ssts && git pull && cd ../.. && git add lib/canonical-ssts`

## Configuration

### Required compatibility variables
- `CANONICAL_SSTS_PROGRAM_ID=SSTS8Qk2bW3aVaBEsY1Ras95YdbaaYQQx21JWHxvjap`
- `CANONICAL_TRANSFER_HOOK_PROGRAM_ID=HookXqLKgPaNrHBJ9Jui7oQZz93vMbtA88JjsLa8bmfL`
- `CANONICAL_SSTS_COMMIT_OR_TAG=1ab607e`
- `CANONICAL_SSTS_IDL_VERSION=0.1.0`

### Optional extension variables
- `FAMP_PROGRAM_ID=99frBpGJFhSx1qMt64T8HSfZMLUiy5YhZVmnG7X4pk2K`
- `FAMP_ENABLED=true`
- `NOOP_VERIFICATION_PROGRAM_ID=5gPMypQiHYVmx3jFJAGr72wrB7f1bgmud3mHtpHUGyLd`

## Observability

Track both product and compatibility health:
- canonical instruction failure rates
- workflow success rate by feature
- IDL drift detection alerts
- RPC/provider degradation alerts
- FAMP policy change events (allowlist/blocklist updates, freeze/thaw triggers)

## Security Posture

- No private keys stored server-side
- Program compatibility checks are immutable in CI logs
- Extension isolation: FAMP failures must not corrupt baseline canonical workflow paths
- FAMP uses policy-oracle pattern: emits events for freeze/thaw, SDK executes canonical instructions (issuer retains final control)

## Rollout Strategy

- Progressive rollout by workflow feature flags
- Emergency fallback mode: disable extension-dependent routes, keep canonical baseline routes active
- Release notes include compatibility matrix and migration notes

## Operational Policy

- TokenForge never redefines canonical instruction semantics
- If canonical changes break a workflow, workflow is temporarily marked unsupported until patched
- Upstream contribution preferred for generic fixes and missing extension points
- FAMP list size (16 wallets per list) is a v1 constraint — monitor usage and expand if needed
