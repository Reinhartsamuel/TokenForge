# TokenForge — Solana Frontier Hackathon Submission

> **TokenForge is the first issuer platform that makes regulated security tokens work on Solana using the Halborn/Hoodies/Securitize SSTS standard.**
>
> **Category:** Developer Tooling / RWA Infrastructure
> **Build period:** April – May 2026
> **Status:** Active development (v1.2.0)

## Elevator Pitch

TokenForge is the missing issuer tooling layer for the Solana Security Token Standard (SSTS). We build a TypeScript SDK, an issuer dashboard, and compliance extensions on top of the canonical SSTS programs — so any team can launch and manage security tokens without building the integration layer from scratch.

We don't compete with the standard. We make it usable.

## The Problem We're Solving

The canonical SSTS launched with **24 instructions** covering the full security token lifecycle. But issuers face a massive gap between protocol capability and operational readiness:

- Raw instructions require deep Solana knowledge (PDAs, account plumbing, transaction composition)
- No reusable SDK exists — every team builds their own wrapper
- Compliance controls (allowlists, blocklists, freeze/thaw) require custom program development
- Compliance teams need dashboards, not instruction builders

**We measured the gap:** Creating a security token with raw SSTS instructions requires ~50 lines of account derivation, PDA calculation, and instruction composition. With TokenForge SDK: **5 lines.**

## What We Built

### 1. TypeScript Workflow SDK (`sdk/`)

A 3-layer SDK that transforms canonical SSTS from protocol primitives to issuer workflows:

```
L0 — Canonical Client  →  Re-exports from git submodule, always in sync
L1 — TokenForge Adapters →  PDA derivation, error enrichment, transaction composition
L2 — Workflow APIs  →  13 functions: createSecurityToken, mintTokens, transferTokens, etc.
```

**Key stats:** 1,637 lines across 13 files, npm package structure, Apache-2.0 licensed.

**13 workflow functions shipped:**

| Category | Functions |
|---|---|
| Token lifecycle | `createSecurityToken`, `configureVerification`, `mintTokens`, `transferTokens`, `pauseToken`, `resumeToken`, `freezeAccount`, `thawAccount` |
| Distributions | `createDistribution`, `claimDistribution`, `executeSplit`, `executeConvert` |
| FAMP compliance | `createFampPolicy`, `addToAllowlist`, `removeFromAllowlist`, `addToBlocklist`, `removeFromBlocklist` |

### 2. FAMP Compliance Program (`programs/famp/`)

An allowlist/blocklist verification program registered with canonical SSTS:

- **Policy management:** Create policies, manage allowlists and blocklists (up to 16 wallets each)
- **Transfer verification:** `verify_transfer` checks sender/receiver against policy arrays
- **Policy-oracle pattern:** FAMP emits `WalletBlocked`/`WalletUnblocked` events → SDK executes canonical `Freeze`/`Thaw` (issuer retains final control)
- **16 integration tests passing** covering the full compliance flow

### 3. Issuer Dashboard (`dashboard/`)

A Next.js-based no-code UI for token operations:

- Token creation wizard
- Holder management
- FAMP policy editor
- Transaction status and diagnostics

**Status:** In progress — core UI components built, workflow integration underway.

### 4. Integration Test Suite

- **23 tests passing** (16 integration + 7 unit)
- Full FAMP compliance flow: policy creation → allowlist/blocklist → verify_transfer gating → event emission
- Test runner script for per-program or full-suite execution
- Runs in ~23 seconds on local validator

## Technical Highlights

### Canonical-First Architecture

TokenForge is explicitly **not** a competing SSTS implementation:

- Canonical SSTS programs consumed via **git submodule**, pinned to commit `1ab607e`
- We never redefine canonical instruction semantics
- Every release maps to a specific canonical commit + program IDs
- Custom features (FAMP) live as optional extensions, not protocol rewrites

### Policy-Oracle Pattern

FAMP pioneered a novel approach to freeze/thaw:

1. FAMP decides who should be blocked (on-chain policy evaluation)
2. FAMP emits an event (`WalletBlocked` or `WalletUnblocked`)
3. SDK listens to the event and constructs a canonical `Freeze`/`Thaw` instruction
4. Issuer signs and executes — **final control stays with the issuer, not the program**

This pattern keeps FAMP as a pure verification program while enabling compliance actions through canonical SSTS.

### Version Pinning Discipline

| TokenForge | SDK | Canonical Commit | SSTS Program ID | Transfer Hook ID |
|---|---|---|---|---|
| 1.2.0 | 0.1.0 | `1ab607e` | `SSTS8Qk2bW3aVaBEsY1Ras95YdbaaYQQx21JWHxvjap` | `HookXqLKgPaNrHBJ9Jui7oQZz93vMbtA88JjsLa8bmfL` |

Every release ships a compatibility matrix. No ambiguity.

## Demo

### SDK Quick Start

```typescript
import { createSecurityToken } from '@tokenforge/sdk';
import { createSolanaRpc, generateKeyPairSigner } from '@solana/kit';

const rpc = createSolanaRpc('https://api.devnet.solana.com');
const issuer = await generateKeyPairSigner();
const mint = await generateKeyPairSigner();

const result = await createSecurityToken(rpc, issuer, mint, {
  decimals: 6,
  metadata: { name: 'My Security Token', symbol: 'MST', uri: 'https://...' },
});
// → Token created in 1 call, 1 transaction
```

### FAMP Compliance Flow

```typescript
// Create allowlist-only policy
await createFampPolicy(rpc, issuer, mint.address, { allowlistMode: true });

// Add approved wallets
await addToAllowlist(rpc, issuer, mint.address, walletA);
await addToAllowlist(rpc, issuer, mint.address, walletB);

// Remove a wallet → triggers WalletBlocked event → SDK freezes
const result = await removeFromAllowlist(rpc, issuer, mint.address, walletA);
if (result.data?.event === 'WalletBlocked') {
  await freezeAccount(rpc, issuer, mint.address, { tokenAccount: walletA_TA });
}
```

## On-Chain Programs

| Program | ID | Purpose |
|---|---|---|
| SSTS Core (canonical) | `SSTS8Qk2bW3aVaBEsY1Ras95YdbaaYQQx21JWHxvjap` | 24 instructions for security tokens |
| SSTS Transfer Hook (canonical) | `HookXqLKgPaNrHBJ9Jui7oQZz93vMbtA88JjsLa8bmfL` | Enforces verification on every transfer |
| FAMP (TokenForge) | `99frBpGJFhSx1qMt64T8HSfZMLUiy5YhZVmnG7X4pk2K` | Allowlist/blocklist verification |
| verification_policy_noop | `5gPMypQiHYVmx3jFJAGr72wrB7f1bgmud3mHtpHUGyLd` | Test-only verifier (always approves) |

## What's Next (Post-Hackathon)

| Milestone | Timeline |
|---|---|
| Complete dashboard v1.0 (full workflow integration) | May–Jun 2026 |
| Policy-oracle event handling in SDK (auto freeze/thaw) | May 2026 |
| Backend services (indexing, distribution orchestration) | Jun–Jul 2026 |
| Security audit of FAMP program | Jul 2026 |
| Public npm release + developer documentation | Jun 2026 |
| Pilot with 2-3 RWA issuers on devnet | Jul 2026 |

## Why This Matters for Solana

1. **Accelerates SSTS adoption:** Reduces integration time from months to days
2. **Attracts RWA issuers:** Professional tooling is a prerequisite for institutional adoption
3. **Strengthens the standard:** Canonical-first approach reinforces SSTS as the authoritative standard
4. **Open-source:** Apache-2.0 licensed, available for any team to use or contribute to
5. **Ecosystem multiplier:** Every TokenForge user becomes a canonical SSTS user

## Repository

```
tokenforge/
├── programs/famp/                     # Compliance verification program
├── programs/verification_policy_noop/ # Test-only verifier
├── sdk/                               # TypeScript SDK (L0/L1/L2)
├── dashboard/                         # Next.js issuer dashboard
├── lib/canonical-ssts/                # Git submodule — canonical SSTS
├── scripts/run-tests.sh               # Test runner
├── SPECIFICATION/                     # Full spec suite (PRD, technical, infra)
└── CHANGELOG.md                       # Version history
```

## Team

[Team description and links]

## Links

- [Live Demo](#) — Dashboard running on devnet
- [SDK Documentation](sdk/README.md)
- [Technical Specifications](SPECIFICATION/README.md)
- [Changelog](CHANGELOG.md)
- [Pitch Deck](pitch-deck/TokenForge_Pitch_Deck.pptx)
- [GitHub](https://github.com/[your-org]/tokenforge)
