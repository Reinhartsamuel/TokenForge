# Infrastructure Specifications: TokenForge (Canonical-First)

## Deployment Model

TokenForge services deploy independently from canonical SSTS programs.

- Canonical SSTS programs are treated as external protocol dependencies
- TokenForge deploys:
  - frontend dashboard
  - backend orchestration/indexing APIs
  - optional FAMP extension program

## Environments

| Env | Frontend | Backend | Canonical SSTS Source |
|-----|----------|---------|------------------------|
| local | localhost:5173 | localhost:8787 | local validator fixture or pinned dev artifact |
| devnet | devnet.tokenforge.io | api-devnet.tokenforge.io | pinned devnet canonical deployment |
| staging | staging.tokenforge.io | api-staging.tokenforge.io | pinned canonical target |
| prod | tokenforge.io | api.tokenforge.io | audited canonical mainnet deployment |

## CI/CD

### Core pipeline
1. Lint and test frontend/backend/sdk
2. Build artifacts
3. Run canonical compatibility suite
4. Deploy frontend/backend
5. Deploy FAMP only if changed

### Canonical compatibility gate (required)
- Fetch pinned canonical IDL
- Validate TokenForge SDK transaction builders against IDL expectations
- Fail release if compatibility assertions fail

## Configuration

### Required compatibility variables
- `CANONICAL_SSTS_PROGRAM_ID`
- `CANONICAL_TRANSFER_HOOK_PROGRAM_ID`
- `CANONICAL_SSTS_IDL_VERSION`
- `CANONICAL_SSTS_COMMIT_OR_TAG`

### Optional extension variables
- `FAMP_PROGRAM_ID`
- `FAMP_ENABLED`

## Observability

Track both product and compatibility health:
- canonical instruction failure rates
- workflow success rate by feature
- IDL drift detection alerts
- RPC/provider degradation alerts

## Security Posture

- No private keys stored server-side
- Program compatibility checks are immutable in CI logs
- Extension isolation: FAMP failures must not corrupt baseline canonical workflow paths

## Rollout Strategy

- Progressive rollout by workflow feature flags
- Emergency fallback mode: disable extension-dependent routes, keep canonical baseline routes active
- Release notes include compatibility matrix and migration notes

## Operational Policy

- TokenForge never redefines canonical instruction semantics
- If canonical changes break a workflow, workflow is temporarily marked unsupported until patched
- Upstream contribution preferred for generic fixes and missing extension points
