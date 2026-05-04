# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-04-30

### Canonical-First Migration

#### Breaking Changes

- **Custom SSTS program removed:** `programs/ssts/` has been deleted. TokenForge no longer ships a custom security token program. All token operations now use the canonical `solana-security-token-standard` programs.
  - Old program ID: `4ZdXBUJPX4rkr8g1d1i1g5tYLjR18GKSHSeF5ZkRWMQG` (no longer valid)
  - Canonical program ID: `SSTS8Qk2bW3aVaBEsY1Ras95YdbaaYQQx21JWHxvjap`
  - Canonical transfer hook ID: `HookXqLKgPaNrHBJ9Jui7oQZz93vMbtA88JjsLa8bmfL`
- **Custom Merkle distribution replaced:** TokenForge's custom `issue_distribution`/`claim_distribution` with on-chain Merkle proof verification is superseded by canonical `CreateDistributionEscrow`, `ClaimDistribution`, `CreateProofAccount`, and `UpdateProofAccount` instructions.
- **Custom corporate actions replaced:** TokenForge's `execute_corporate_action` (split/merge) is superseded by canonical `Split`/`Convert` instructions with `Rate` accounts.
- **Custom verification CPI removed:** TokenForge's manual CPI-based `verify_transfer` is replaced by canonical `VerificationConfig` system supporting both introspection and CPI modes.
- **FAMP program reworked:** FAMP is no longer a standalone freeze/thaw program. It is now a canonical-compatible verification program with a different data model and API surface.

#### Removed

- Custom Merkle distribution logic and `DistributionAccount` PDA
- Custom corporate action (split/merge) logic
- Custom verification CPI helper (`invoke_verify_transfer`)
- FAMP's `thaw_token_account` instruction (use canonical `Thaw` instead)
- FAMP's direct freeze/thaw CPI into Token-2022 (replaced by policy-oracle pattern)
- FAMP's Merkle root-based allowlist/blocklist (replaced by fixed-size arrays)
- `programs/ssts/` — the entire custom SSTS Anchor workspace

#### Added

- **Canonical SSTS dependency** via git submodule at `lib/canonical-ssts`, pinned to commit `1ab607e`
- **Canonical TypeScript client** (L0 SDK layer) from `lib/canonical-ssts/clients/typescript`
- **Canonical compatibility gate** in CI/CD pipeline
- **Version pinning configuration:**
  - `CANONICAL_SSTS_PROGRAM_ID`
  - `CANONICAL_TRANSFER_HOOK_PROGRAM_ID`
  - `CANONICAL_SSTS_COMMIT_OR_TAG`
  - `CANONICAL_SSTS_IDL_VERSION`

#### Changed

- **FAMP program** (`programs/famp/`): Completely reworked as a canonical-compatible verification program.
  - Data model: Fixed-size arrays (up to 16 wallets per list) in `PolicyAccount` instead of Merkle roots
  - Verification: New `verify_transfer` instruction checks sender/receiver owners against allowlist/blocklist arrays
  - Freeze/thaw: Replaced by policy-oracle pattern — FAMP emits `WalletBlocked`/`WalletUnblocked` events; SDK executes canonical `Freeze`/`Thaw`
  - Policy management: `add_to_allowlist`, `remove_from_allowlist`, `add_to_blocklist`, `remove_from_blocklist` now operate on fixed-size arrays (no Merkle root computation required)
  - New `create_policy` argument: `allowlist_mode: bool` (true = only allowlisted wallets can participate)
  - New errors: `AllowlistFull`, `BlocklistFull`, `AlreadyInAllowlist`, `AlreadyInBlocklist`, `WalletNotFound`, `WalletBlocked`, `WalletNotAllowlisted`
  - Removed dependencies: no longer CPIs into Token-2022 for freeze/thaw
- **verification_policy_noop** (`programs/verification_policy_noop/`): Converted from Anchor to pure solana-program for maximum compatibility with canonical SSTS CPI and introspection modes. Always returns `Ok(())`.
- **All specifications** updated to reference canonical SSTS as external dependency:
  - `SPECIFICATION/README.md` — architecture, canonical instruction table, program IDs
  - `SPECIFICATION/PRD.md` — updated acceptance criteria, removed open question about canonical baseline
  - `SPECIFICATION/SPECS.md` — updated workflow mapping, SDK design, account types
  - `SPECIFICATION/INFRA_SPECS.md` — updated environment table, config variables, CI/CD pipeline

#### Architecture

- TokenForge is now purely an orchestration layer on top of canonical SSTS
- FAMP is a verification program + policy extension, not a competing standard
- SDK follows 3-layer design: L0 (canonical), L1 (adapters), L2 (workflows)
- FAMP uses policy-oracle pattern: emits events, SDK executes canonical instructions

## [1.1.0] - 2026-05-01

### TokenForge TypeScript Workflow SDK

#### Added

- **SDK package** (`sdk/`) — 1,637 lines across 13 files implementing the L1/L2 workflow layer:
  - **L0** (`sdk/src/l0/`): Re-exports canonical SSTS client from git submodule + pins program IDs
  - **L1** (`sdk/src/l1/`): PDA derivation helpers, error enrichment, transaction composition
    - `derive.ts`: Derive VerificationConfig, MintAuthority, FAMP PolicyAccount, ProofAccount, RateAccount PDAs
    - `errors.ts`: `TokenForgeError`, `enrichError()`, `SstsError`/`FampError` enums
    - `transactions.ts`: `sendSstsTransaction()`, `buildTransaction()`, `batchInstructions()`
  - **L2** (`sdk/src/l2/`): 13 workflow functions
    - Token lifecycle: `createSecurityToken()`, `configureVerification()`, `mintTokens()`, `transferTokens()`, `pauseToken()`, `resumeToken()`, `freezeAccount()`, `thawAccount()`
    - Distributions: `createDistribution()`, `claimDistribution()`, `executeSplit()`, `executeConvert()`
    - FAMP: `createFampPolicy()`, `addToAllowlist()`, `removeFromAllowlist()`, `addToBlocklist()`, `removeFromBlocklist()`
  - **Utilities** (`sdk/src/utils/`): Constants, shared types, FAMP seed bytes
- **SDK documentation** (`sdk/README.md`) with quick start examples for all workflow categories
- **PRD updated** with acceptance criteria checkboxes for Features 1-3

#### SDK Design

- Uses `@solana/kit` v2 (same as canonical client) for type consistency
- All workflows return `WorkflowResult` with signatures, derived addresses, and workflow-specific data
- FAMP workflows emit event metadata (`WalletBlocked`/`WalletUnblocked`) for downstream SDK/dashboard handling
- Compatibility matrix: SDK 0.1.0 → canonical commit `1ab607e`

## [1.2.0] - 2026-05-03

### Day 1-2: Integration Tests & Program Builds

#### Added

- **Integration test suite** (`programs/famp/tests/famp_integration.ts`) — 16 tests covering the full FAMP compliance flow:
  - Policy creation and initialization
  - `verify_transfer` gating: passes when clean, rejects blocked sender/receiver
  - Blocklist management: add/remove with state verification
  - Allowlist management: multi-wallet, duplicate rejection, unauthorized rejection
  - `MAX_LIST_SIZE` (16) enforcement: fills to capacity, rejects overflow
  - Policy-oracle pattern: blocklist → WalletBlocked event, unblock → WalletUnblocked event
  - Allowlist mode policy creation
- **Test runner script** (`scripts/run-tests.sh`) — run all or per-program tests
- **Build artifacts** for all 4 programs:
  - `programs/famp/target/deploy/famp.so` (258KB)
  - `programs/verification_policy_noop/target/deploy/verification_policy_noop.so` (21KB)
  - `lib/canonical-ssts/target/deploy/security_token_program.so` (229KB)
  - `lib/canonical-ssts/target/deploy/security_token_transfer_hook.so` (70KB)

#### Test Results

- **23 tests passing** (16 integration + 7 unit)
- **0 tests failing**
- Full test suite runs in ~23 seconds on local validator

#### PRD Updates

- Feature 1: Added "All 4 programs build successfully" acceptance criterion ✅
- Feature 2: Added "23 integration tests pass" acceptance criterion ✅
