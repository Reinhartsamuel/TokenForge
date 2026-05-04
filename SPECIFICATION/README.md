# TokenForge

> Canonical-first issuer tooling for the Solana Security Token Standard (SSTS): SDK, dashboard, and compliance extensions built on top of the foundation SSTS programs.

## Positioning

TokenForge is not a replacement SSTS core program. TokenForge is an orchestration layer that:
- Uses the canonical SSTS on-chain programs as source of truth
- Adds higher-level issuer workflows and operator UX
- Ships optional extension modules (for example, FAMP-style policy controls)

## Problem

SSTS gives the protocol foundation, but issuers still need substantial implementation work:
- Integrate low-level instructions and account plumbing
- Build issuer operations UI and automation
- Manage holder sync, distributions, and compliance operations

## Solution

TokenForge provides:
1. **TypeScript workflow SDK** over canonical clients
2. **Issuer dashboard** for non-Rust teams
3. **Optional compliance extensions** (FAMP policy controls)
4. **Managed backend services** (indexing, distribution orchestration, reporting)

## Compatibility Principles

1. **Canonical-first:** canonical SSTS IDL/program behavior is authoritative
2. **No core semantic fork:** TokenForge does not define a competing SSTS core
3. **Version pinning:** TokenForge versions map to specific canonical releases
4. **Extension isolation:** custom features live as optional add-ons, not protocol rewrites

## Architecture (High Level)

- **Canonical SSTS layer** (external dependency — git submodule at `lib/canonical-ssts`)
  - `lib/canonical-ssts/program/` (core instruction semantics)
  - `lib/canonical-ssts/transfer_hook/` (transfer verification mechanism)
  - `lib/canonical-ssts/clients/typescript/` (generated low-level client)
  - `lib/canonical-ssts/idl/security_token_program.json` (interface reference)
- **TokenForge layer**
  - SDK workflow wrappers (L1 adapters + L2 workflows over canonical L0)
  - Issuer dashboard
  - Backend indexing + distribution services
  - FAMP extension program (verification program registered via `InitializeVerificationConfig`)
  - `verification_policy_noop` (test-only verifier)

## Canonical SSTS Instructions (24)

| # | Instruction | Profile | Description |
|---|---|---|---|
| 0 | `InitializeMint` | None | Create Token-2022 mint with SSTS extensions |
| 1 | `UpdateMetadata` | VerProgOrMintAuth | Update token metadata |
| 2 | `InitializeVerificationConfig` | VerProgOrMintAuth | Register verification programs per instruction |
| 3 | `UpdateVerificationConfig` | VerProgOrMintAuth | Update verification program registration |
| 4 | `TrimVerificationConfig` | VerProgOrMintAuth | Recover rent from oversized config |
| 5 | `Verify` | None | Standalone verification check |
| 6 | `Mint` | VerProgOnly | Mint tokens (gated by verification) |
| 7 | `Burn` | VerProgOnly | Burn tokens (gated by verification) |
| 8 | `Pause` | VerProgOnly | Pause all token operations |
| 9 | `Resume` | VerProgOnly | Resume token operations |
| 10 | `Freeze` | VerProgOnly | Freeze a specific token account |
| 11 | `Thaw` | VerProgOnly | Thaw a frozen token account |
| 12 | `Transfer` | VerProgOnly | Transfer tokens (gated by verification) |
| 13 | `CreateRateAccount` | VerProgOrMintAuth | Create rate for splits/conversions |
| 14 | `UpdateRateAccount` | VerProgOrMintAuth | Update rate configuration |
| 15 | `CloseRateAccount` | VerProgOrMintAuth | Close rate account, recover rent |
| 16 | `Split` | VerProgOnly | Execute token split |
| 17 | `Convert` | VerProgOnly | Execute token conversion between mints |
| 18 | `CreateProofAccount` | VerProgOnly | Create Merkle proof for distributions |
| 19 | `UpdateProofAccount` | VerProgOnly | Update proof data |
| 20 | `CreateDistributionEscrow` | VerProgOrMintAuth | Set up distribution with Merkle root |
| 21 | `ClaimDistribution` | VerProgOnly | Claim tokens from distribution |
| 22 | `CloseActionReceiptAccount` | VerProgOrMintAuth | Close split/convert receipt |
| 23 | `CloseClaimReceiptAccount` | VerProgOrMintAuth | Close distribution claim receipt |

## On-Chain Programs

| Program | ID | Purpose |
|---|---|---|
| SSTS Core | `SSTS8Qk2bW3aVaBEsY1Ras95YdbaaYQQx21JWHxvjap` | Canonical security token program (24 instructions) |
| SSTS Transfer Hook | `HookXqLKgPaNrHBJ9Jui7oQZz93vMbtA88JjsLa8bmfL` | Enforces verification on every token transfer |
| FAMP (TokenForge) | `99frBpGJFhSx1qMt64T8HSfZMLUiy5YhZVmnG7X4pk2K` | Allowlist/blocklist verification program + policy management |
| verification_policy_noop (TokenForge) | `5gPMypQiHYVmx3jFJAGr72wrB7f1bgmud3mHtpHUGyLd` | Always-approve verifier for testing only |

## FAMP Program

FAMP (Freeze Authority Management Program) is TokenForge's optional verification program. It provides:

- **Policy management:** `create_policy`, `add_to_allowlist`, `remove_from_allowlist`, `add_to_blocklist`, `remove_from_blocklist`
- **Verification:** `verify_transfer` — checks both sender and receiver against allowlist/blocklist arrays stored in `PolicyAccount`
- **Events:** `WalletBlocked`, `WalletUnblocked` — signal the SDK to execute canonical SSTS `Freeze`/`Thaw`
- **Data model:** Fixed-size arrays (up to 32 wallets per list) stored in `PolicyAccount` PDA — no Merkle proofs needed for on-chain verification

FAMP is registered with canonical SSTS via `InitializeVerificationConfig` for transfer verification (discriminator 12). It uses the **policy-oracle pattern**: FAMP decides who should be blocked via events, and the SDK executes the actual freeze/thaw through canonical SSTS.

## Product Direction

- TokenForge continues as a product and developer platform
- Canonical SSTS remains the protocol core
- TokenForge contributes generic improvements upstream while shipping opinionated issuer tooling downstream

## Status

PIVOTED TO CANONICAL-FIRST — April 2026

Implementation note: TokenForge tracks canonical SSTS releases and avoids shipping a parallel SSTS core implementation.
