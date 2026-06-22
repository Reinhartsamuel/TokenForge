# TokenForge — Technical Specification

> The compliant tokenization platform for Indonesian digital assets. Built on the Solana Security Token Standard (SSTS).

## Positioning

TokenForge is the **Tokeny for Indonesia** — a complete issuer platform for launching and managing regulated security tokens in Indonesia. We provide the operational infrastructure that fund administrators, BPRs, P2P lending platforms, and asset managers need to tokenize real-world assets while maintaining full compliance with OJK regulations.

TokenForge is not a replacement SSTS core program. TokenForge is an orchestration layer that:
- Uses the canonical SSTS on-chain programs as source of truth
- Adds higher-level issuer workflows and operator UX
- Ships optional extension modules (FAMP compliance engine, tranching, corporate actions)
- Provides end-to-end compliance automation for Indonesian digital assets (POJK 27/2024, POJK 17/2025)

## Problem

SSTS gives the protocol foundation, but Indonesian issuers still need substantial implementation work:
- Integrate low-level instructions and account plumbing
- Build issuer operations UI and automation
- Manage holder sync, distributions, and compliance operations
- Comply with OJK regulations (transfer restrictions, investor verification, audit trails)
- Handle complex operational workflows (tranching, waterfall distributions, corporate actions)

## Solution

TokenForge provides:
1. **Issuer dashboard** for compliance officers and fund administrators (investor registry, cap table, compliance engine, corporate actions, reports)
2. **TypeScript workflow SDK** over canonical clients (for custom integrations)
3. **FAMP compliance engine** (OJK rule configuration, transfer restrictions, freeze/thaw)
4. **Managed backend services** (indexing, distribution orchestration, reporting, NAV management)
5. **Tranching module** (multi-tranche structure, waterfall distribution, first-loss mechanisms)

## Compatibility Principles

1. **Canonical-first:** canonical SSTS IDL/program behavior is authoritative
2. **No core semantic fork:** TokenForge does not define a competing SSTS core
3. **Version pinning:** TokenForge versions map to specific canonical releases
4. **Extension isolation:** custom features live as optional add-ons, not protocol rewrites
5. **OJK-first:** all compliance features map directly to Indonesian regulations

## Architecture (High Level)

- **Canonical SSTS layer** (external dependency — git submodule at `lib/canonical-ssts`)
  - `lib/canonical-ssts/program/` (core instruction semantics)
  - `lib/canonical-ssts/transfer_hook/` (transfer verification mechanism)
  - `lib/canonical-ssts/clients/typescript/` (generated low-level client)
  - `lib/canonical-ssts/idl/security_token_program.json` (interface reference)
- **TokenForge layer**
  - Issuer dashboard (investor registry, cap table, compliance engine, corporate actions, reports, transfer agent, NAV, tranching)
  - SDK workflow wrappers (L1 adapters + L2 workflows over canonical L0)
  - Backend indexing + distribution services
  - FAMP extension program (compliance verification registered via `InitializeVerificationConfig`)
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
| FAMP (TokenForge) | `99frBpGJFhSx1qMt64T8HSfZMLUiy5YhZVmnG7X4pk2K` | Compliance verification program + policy management |
| verification_policy_noop (TokenForge) | `5gPMypQiHYVmx3jFJAGr72wrB7f1bgmud3mHtpHUGyLd` | Always-approve verifier for testing only |

## FAMP Compliance Engine

FAMP (Freeze Authority Management Program) is TokenForge's compliance verification program. It provides:

- **Policy management:** `create_policy`, `add_to_allowlist`, `remove_from_allowlist`, `add_to_blocklist`, `remove_from_blocklist`
- **Verification:** `verify_transfer` — checks both sender and receiver against allowlist/blocklist arrays stored in `PolicyAccount`
- **Events:** `WalletBlocked`, `WalletUnblocked` — signal the SDK to execute canonical SSTS `Freeze`/`Thaw`
- **Data model:** Fixed-size arrays (up to 32 wallets per list) stored in `PolicyAccount` PDA — no Merkle proofs needed for on-chain verification

FAMP is registered with canonical SSTS via `InitializeVerificationConfig` for transfer verification (discriminator 12). It uses the **policy-oracle pattern**: FAMP decides who should be blocked via events, and the SDK executes the actual freeze/thaw through canonical SSTS.

### OJK Compliance Mapping

| OJK Regulation | TokenForge Feature | Implementation |
|---|---|---|
| POJK 27/2024 (DFA Trading) | Transfer restrictions | FAMP allowlist/blocklist enforced on-chain |
| POJK 27/2024 (KYC/AML) | Investor registry | KYC/AML status tracked per investor |
| POJK 17/2025 (Crowdfunding) | Accreditation verification | Automated accredited investor checks |
| POJK 17/2025 (Subscription limits) | Smart contract enforcement | Max investment per investor enforced on-chain |
| POJK 3/2024 (Sandbox) | Regulatory reporting | Automated OJK-compliant report generation |

## Issuer Dashboard Modules

### Investor Registry
- Investor profiles (name, email, wallet address, jurisdiction, entity type)
- KYC/AML status tracking (pending, verified, rejected)
- Accreditation status tracking (accredited, non-accredited, pending)
- Holdings management (token balances, ownership %)
- CSV import for bulk onboarding

### Cap Table
- Real-time ownership from on-chain token accounts
- Investor names mapped to wallet addresses
- Ownership percentage calculation
- Historical snapshots
- Export to CSV/PDF

### Compliance Engine
- OJK rule builder (jurisdiction, lockup, KYC requirements)
- Transfer simulation (test if transfer would be allowed)
- Audit log of rule changes
- Automatic FAMP policy generation from rules

### Corporate Actions
- Dividend distributions (snapshot → calculate → distribute → reconcile)
- Voting workflows (snapshot → ballot → vote → tally)
- Buybacks (request → approval → execution → burn)
- Forced transfers (court orders, lost wallet recovery)

### Distribution Orchestration
- Merkle-based yield distribution
- Waterfall logic for tranching (senior → mezzanine → equity)
- Claim tracking and reconciliation
- Automated report generation

### NAV Management
- Manual NAV updates
- Oracle integration (Chainlink)
- Historical NAV tracking
- NAV freshness indicator

### Regulatory Reporting
- OJK-compliant reports (POJK 27/2024, POJK 17/2025)
- Audit trail exports
- Investor statements
- Distribution reports

### Transfer Agent
- Subscription/redemption workflows
- Lost wallet recovery
- Bulk operations
- Integration with investor registry

### Tranching
- Multi-tranche structure (senior, mezzanine, equity)
- Waterfall distribution logic
- First-loss mechanism
- Per-tranche FAMP policies

## Product Direction

- TokenForge is pivoting from a developer-focused SDK to a complete issuer platform
- Canonical SSTS remains the protocol core
- TokenForge contributes generic improvements upstream while shipping opinionated issuer tooling downstream
- Focus on Indonesian market (OJK compliance) before expanding to other jurisdictions
- Target customers: BPRs, P2P lending platforms, fund administrators, asset managers

## Status

PIVOTED TO ISSUER PLATFORM — June 2026

Implementation note: TokenForge tracks canonical SSTS releases and avoids shipping a parallel SSTS core implementation. The platform is being built to support OJK-compliant tokenization for Indonesian financial institutions.
