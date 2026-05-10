# TokenForge

> **TokenForge is the first issuer platform that makes regulated security tokens work on Solana using the Halborn/Hoodies/Securitize SSTS standard.**
>
> Canonical-first issuer tooling for the Solana Security Token Standard (SSTS)

TokenForge is a developer and operator platform for launching and managing security tokens on Solana. We build on top of the [canonical Solana Security Token Standard](https://github.com/solana-foundation/security-token-standard) — not alongside it — to deliver SDK, dashboard, and compliance extensions that make institutional-grade token issuance accessible to any team.

[![Version](https://img.shields.io/badge/version-1.2.0-blue.svg)](CHANGELOG.md)
[![SDK](https://img.shields.io/badge/sdk-0.1.0-green.svg)](sdk/README.md)
[![Tests](https://img.shields.io/badge/tests-23%20passing-brightgreen.svg)](scripts/run-tests.sh)
[![License](https://img.shields.io/badge/license-Apache--2.0-orange.svg)](LICENSE)

---

## The Problem

The canonical SSTS provides a robust on-chain foundation for security tokens — 24 instructions covering minting, verification, distributions, splits, conversions, freeze/thaw, and more. But issuers still face a significant implementation gap:

- **Low-level complexity:** Raw SSTS instructions require deep Solana knowledge and manual account plumbing
- **No operator tooling:** Compliance teams need UI, not instruction builders
- **Integration burden:** Every issuer re-derives PDAs, constructs multi-instruction transactions, and builds error handling from scratch
- **Compliance friction:** Allowlist/blocklist controls and policy management are left as an exercise for the issuer

## The Solution

TokenForge closes the gap between canonical SSTS capability and issuer operational readiness:

| Layer | What It Does |
|---|---|
| **SDK** (`sdk/`) | TypeScript workflow SDK — 3 layers (L0 canonical → L1 adapters → L2 workflow APIs) |
| **Dashboard** (`dashboard/`) | Next.js issuer dashboard for no-code token lifecycle management |
| **FAMP** (`programs/famp/`) | Allowlist/blocklist verification program with policy-oracle pattern |
| **Backend** *(planned)* | Indexing, distribution orchestration, reporting |

## Quick Start

### SDK

```bash
npm install @tokenforge/sdk
```

```typescript
import { createSecurityToken } from '@tokenforge/sdk';
import { createSolanaRpc, generateKeyPairSigner } from '@solana/kit';

const rpc = createSolanaRpc('https://api.devnet.solana.com');
const issuer = await generateKeyPairSigner();
const mint = await generateKeyPairSigner();

const result = await createSecurityToken(rpc, issuer, mint, {
  decimals: 6,
  metadata: {
    name: 'My Security Token',
    symbol: 'MST',
    uri: 'https://my-token.io/metadata.json',
  },
});
```

### Dashboard

```bash
cd dashboard
npm install
npm run dev
# → http://localhost:3000
```

### Programs

```bash
# Build all programs (FAMP, noop verifier, canonical SSTS, transfer hook)
scripts/run-tests.sh
```

## Architecture

TokenForge is an **orchestration layer**, not a competing standard:

```
┌─────────────────────────────────────────────────────────────┐
│                    SOLANA (DEVNET/MAINNET)                 │
│                                                             │
│  Canonical SSTS Programs (external dependency):            │
│  - security_token_program                                  │
│  - security_token_transfer_hook                            │
│                                                             │
│  TokenForge Extension Programs:                              │
│  - famp (allowlist/blocklist verification)                 │
│  - verification_policy_noop (test-only)                     │
└─────────────────────────────────────────────────────────────┘
                    ▲                         ▲
                    │                         │
         ┌──────────┴──────────┐    ┌─────────┴───────────────┐
         │ TokenForge SDK       │    │ TokenForge Backend      │
         │ (workflow layer)     │    │ (indexing + orchestration)
         └──────────┬──────────┘    └─────────┬───────────────┘
                    │                          │
                    └──────────────┬───────────┘
                                   ▼
                        TokenForge Dashboard
```

### Canonical-First Design

| Principle | How We Apply It |
|---|---|
| **Canonical-first** | Canonical SSTS IDL/program behavior is authoritative |
| **No semantic fork** | TokenForge never redefines canonical instruction semantics |
| **Version pinning** | Each release pins a specific canonical commit + program IDs |
| **Extension isolation** | Custom features live as optional add-ons, not rewrites |

## On-Chain Programs

| Program | ID | Purpose |
|---|---|---|
| SSTS Core | `SSTS8Qk2bW3aVaBEsY1Ras95YdbaaYQQx21JWHxvjap` | Canonical security token program (24 instructions) |
| SSTS Transfer Hook | `HookXqLKgPaNrHBJ9Jui7oQZz93vMbtA88JjsLa8bmfL` | Enforces verification on every transfer |
| FAMP (TokenForge) | `99frBpGJFhSx1qMt64T8HSfZMLUiy5YhZVmnG7X4pk2K` | Allowlist/blocklist verification + policy management |
| verification_policy_noop | `5gPMypQiHYVmx3jFJAGr72wrB7f1bgmud3mHtpHUGyLd` | Test-only verifier (always approves) |

## FAMP Compliance Extension

FAMP (Freeze Authority Management Program) is TokenForge's optional verification program for allowlist/blocklist policy controls:

- **Policy management:** `create_policy`, `add_to_allowlist`, `remove_from_allowlist`, `add_to_blocklist`, `remove_from_blocklist`
- **Verification:** `verify_transfer` checks sender/receiver against fixed-size arrays (up to 16 wallets per list)
- **Policy-oracle pattern:** FAMP emits `WalletBlocked`/`WalletUnblocked` events; SDK executes canonical `Freeze`/`Thaw` instructions — the issuer retains final control
- **Registration:** FAMP is registered with canonical SSTS via `InitializeVerificationConfig` for transfer verification (discriminator 12)

## SDK Workflow APIs

The TokenForge SDK provides 13 L2 workflow functions across three categories:

### Token Lifecycle

| Function | Description |
|---|---|
| `createSecurityToken` | Initialize mint with all SSTS extensions + verification config |
| `configureVerification` | Register/update verification programs per instruction |
| `mintTokens` | Mint tokens (gated by verification) |
| `transferTokens` | Transfer tokens (gated by verification) |
| `pauseToken` / `resumeToken` | Pause/resume all token operations |
| `freezeAccount` / `thawAccount` | Freeze/thaw individual token accounts |

### Distributions & Corporate Actions

| Function | Description |
|---|---|
| `createDistribution` | Create Merkle-based distribution escrow |
| `claimDistribution` | Claim tokens from distribution with Merkle proof |
| `executeSplit` | Execute token split corporate action |
| `executeConvert` | Execute token conversion between mints |

### FAMP Policy Management

| Function | Description |
|---|---|
| `createFampPolicy` | Create allowlist/blocklist policy |
| `addToAllowlist` / `removeFromAllowlist` | Manage allowlist |
| `addToBlocklist` / `removeFromBlocklist` | Manage blocklist |

## Project Structure

```
tokenforge/
├── programs/
│   ├── famp/                     # Allowlist/blocklist verification program
│   └── verification_policy_noop/ # Test-only verifier
├── sdk/
│   ├── src/
│   │   ├── l0/                   # Canonical client re-exports
│   │   ├── l1/                   # Adapters (PDAs, errors, transactions)
│   │   └── l2/                   # Workflow APIs (13 functions)
│   └── tests/
├── dashboard/                    # Next.js issuer dashboard
├── lib/
│   └── canonical-ssts/           # Git submodule — canonical SSTS
├── scripts/
│   └── run-tests.sh              # Test runner
├── SPECIFICATION/                # Internal development docs
│   ├── README.md
│   ├── PRD.md
│   ├── SPECS.md
│   └── INFRA_SPECS.md
└── CHANGELOG.md
```

## Status

| Component | Status | Details |
|---|---|---|
| Canonical SSTS Integration | ✅ Complete | Git submodule, version-pinned |
| FAMP Program | ✅ Complete | 16 tests passing, fixed-size arrays |
| SDK L0/L1/L2 | ✅ Complete | 1,637 lines, 13 workflow functions |
| SDK Tests | ✅ Complete | 23 tests passing (16 integration + 7 unit) |
| verification_policy_noop | ✅ Complete | Pure solana-program, always approves |
| Program Builds | ✅ Complete | All 4 programs compile |
| Issuer Dashboard | 🚧 In Progress | Next.js with shadcn/ui |
| Distribution Orchestration | 📋 Planned | Backend service for snapshots + claims |
| Backend Indexing | 📋 Planned | Token holder indexing + reporting |

## Compatibility Matrix

| TokenForge Version | SDK Version | Canonical Commit | SSTS Program ID | Transfer Hook ID |
|---|---|---|---|---|
| 1.2.0 | 0.1.0 | `1ab607e` | `SSTS8Qk...` | `HookXqL...` |

## Roadmap

| Phase | Deliverables | Timeline |
|---|---|---|
| **v1.0** (done) | Canonical-first migration, FAMP rework, spec updates | Apr 2026 |
| **v1.1** (done) | TypeScript SDK, PDA helpers, 13 workflow functions | May 2026 |
| **v1.2** (done) | Integration tests, program builds, test runner | May 2026 |
| **v1.3** | Complete dashboard, policy-oracle event handling | May-Jun 2026 |
| **v1.x** | Distribution automation, expanded policy tooling | Jun-Jul 2026 |
| **v2.0** | Managed enterprise controls, reporting, integrations | Q3 2026 |

## Contributing

TokenForge welcomes contributions. Key areas:

- Dashboard feature development and UX improvements
- SDK workflow additions and refinements
- FAMP enhancements (larger list sizes, additional verification modes)
- Testing and compatibility validation
- Upstream contributions to canonical SSTS

## License

Apache-2.0

---

*TokenForge is built for the Solana Frontier Hackathon (April–May 2026). We believe security tokens deserve first-class developer tooling that respects the canonical standard.*
