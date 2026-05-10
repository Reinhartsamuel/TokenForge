# TokenForge — Solana Foundation Grant Proposal

> **TokenForge is the first issuer platform that makes regulated security tokens work on Solana using the Halborn/Hoodies/Securitize SSTS standard.**

## Project Overview

**TokenForge** is an open-source issuer tooling platform built on top of the canonical Solana Security Token Standard (SSTS). We provide TypeScript SDK, issuer dashboard, and compliance extensions that make it possible for any team to launch and manage security tokens on Solana without building the integration layer from scratch.

**Grant request:** [Amount] SOL / USD

**Category:** Developer tooling / RWA infrastructure

## Problem Statement

The Solana Security Token Standard (SSTS) provides a comprehensive on-chain foundation with 24 instructions covering the full security token lifecycle — minting, verification, distributions, splits, conversions, freeze/thaw, and more.

However, a significant gap exists between SSTS protocol capability and issuer operational readiness:

1. **Integration complexity is prohibitive:** Raw SSTS instructions require deep knowledge of Solana account models, PDA derivation, and transaction composition. Most RWA issuers are not Solana-native teams.

2. **No reusable tooling layer:** Every issuer currently builds their own SDK wrapper, derives their own PDAs, and handles their own error cases — duplicating effort across the ecosystem.

3. **Compliance controls are underserved:** Allowlist/blocklist management, policy enforcement, and freeze/thaw operations require custom program development that most issuers cannot justify.

4. **Operator experience is missing:** Compliance teams need dashboards and workflows, not instruction builders and account seeds.

This gap slows SSTS adoption, fragments implementation quality, and creates unnecessary risk for issuers who attempt to build everything themselves.

## Solution

TokenForge addresses each gap with purpose-built, open-source tooling:

| Gap | TokenForge Solution | Open Source |
|---|---|---|
| Integration complexity | TypeScript SDK with 3-layer architecture (L0 canonical → L1 adapters → L2 workflows) | ✅ Apache-2.0 |
| Duplicated effort | Reusable workflow functions: `createSecurityToken()`, `mintTokens()`, `transferTokens()`, `createDistribution()`, etc. | ✅ Apache-2.0 |
| Compliance controls | FAMP program — allowlist/blocklist verification with policy-oracle pattern | ✅ Apache-2.0 |
| Operator experience | Next.js issuer dashboard for no-code token lifecycle management | ✅ Apache-2.0 |

## Canonical-First Design Principle

TokenForge is explicitly **not** a competing SSTS implementation. Our design principles:

1. **Canonical-first:** Canonical SSTS IDL/program behavior is authoritative
2. **No semantic fork:** We never redefine canonical instruction semantics
3. **Version pinning:** Each release maps to a specific canonical commit (`1ab607e`)
4. **Extension isolation:** Custom features (FAMP) live as optional add-ons, not protocol rewrites

This ensures TokenForge strengthens the canonical standard rather than fragmenting it.

## Technical Architecture

```
Canonical SSTS Programs (external dependency, git submodule)
  ├── security_token_program (24 instructions)
  └── security_token_transfer_hook (transfer verification)

TokenForge Layer
  ├── SDK (TypeScript, 3 layers)
  │   ├── L0: Canonical client re-exports
  │   ├── L1: PDA derivation, error enrichment, transaction composition
  │   └── L2: 13 workflow functions
  ├── FAMP Program (Rust/Solana)
  │   ├── Allowlist/blocklist policy management
  │   ├── verify_transfer instruction
  │   └── Policy-oracle pattern (events → SDK execution)
  ├── Issuer Dashboard (Next.js)
  └── Backend Services (planned)
      ├── Token holder indexing
      ├── Distribution orchestration
      └── Reporting and analytics
```

## Current Progress

| Component | Status | Details |
|---|---|---|
| Canonical SSTS integration | ✅ Complete | Git submodule at `lib/canonical-ssts`, pinned to `1ab607e` |
| FAMP program | ✅ Complete | Allowlist/blocklist with fixed-size arrays (16 per list), 16 tests |
| SDK L0/L1/L2 | ✅ Complete | 1,637 lines, 13 workflow functions, npm package |
| Test suite | ✅ Complete | 23 tests passing (16 integration + 7 unit) |
| Program builds | ✅ Complete | All 4 programs compile (FAMP, noop, SSTS core, transfer hook) |
| Issuer dashboard | 🚧 In progress | Next.js with shadcn/ui components |
| Specifications | ✅ Complete | PRD, technical specs, infrastructure specs |

## Deliverables (Grant-Funded)

### Phase 1: Dashboard Completion (4 weeks)

- [ ] Complete token creation wizard (canonical SSTS `InitializeMint` flow)
- [ ] Build holder management UI (mint, transfer, freeze/thaw)
- [ ] Implement FAMP policy editor (allowlist/blocklist management)
- [ ] Add transaction status and error diagnostics
- [ ] Wallet connection and network switching (devnet/mainnet)

### Phase 2: Backend Services (6 weeks)

- [ ] Token holder indexing service (reads canonical SSTS accounts)
- [ ] Distribution orchestration service (snapshot → Merkle → claim tracking)
- [ ] Reconciliation reporting (on-chain outcomes → issuer reports)
- [ ] API layer for dashboard and SDK consumption

### Phase 3: Production Readiness (4 weeks)

- [ ] Security audit of FAMP program
- [ ] SDK stability improvements (error handling, retries, telemetry)
- [ ] Devnet dogfooding with 2-3 pilot issuers
- [ ] Documentation and onboarding materials
- [ ] Upstream contributions to canonical SSTS

### Phase 4: Ecosystem Enablement (ongoing)

- [ ] Public npm release of @tokenforge/sdk
- [ ] Example projects and integration guides
- [ ] Community support and developer education
- [ ] Continued canonical SSTS contributions

## Budget Breakdown

| Category | Amount | Justification |
|---|---|---|
| Engineering (dashboard + backend) | [X] SOL | 2 engineers × 14 weeks |
| Security audit (FAMP) | [X] SOL | Third-party audit of on-chain program |
| Infrastructure (hosting, RPC) | [X] SOL | Devnet/mainnet infrastructure costs |
| Developer education | [X] SOL | Documentation, examples, workshops |
| **Total** | **[X] SOL** | |

## Why This Benefits Solana

1. **Accelerates SSTS adoption:** Reduces time-to-launch for security token issuers from months to days
2. **Strengthens the standard:** Canonical-first approach reinforces SSTS as the authoritative standard
3. **Attracts RWA issuers:** Professional-grade tooling is a prerequisite for institutional adoption
4. **Open-source contribution:** All code is Apache-2.0 licensed and available for any team to use or contribute to
5. **Ecosystem multiplier:** Every TokenForge user becomes a canonical SSTS user, increasing network effects

## Alignment with Solana Foundation Priorities

| SF Priority | TokenForge Alignment |
|---|---|
| Developer tooling | TypeScript SDK reduces SSTS integration friction |
| RWA / institutional adoption | Compliance controls and operator dashboard for non-crypto-native issuers |
| Open-source ecosystem | Apache-2.0 licensed, upstream contributions to canonical SSTS |
| Network security | Canonical-first design avoids fragmentation and competing standards |
| Developer experience | 13 workflow functions replace hundreds of lines of manual integration code |

## Team

[Team description — background, relevant experience, Solana ecosystem involvement]

## Links

- [GitHub Repository](https://github.com/[your-org]/tokenforge)
- [SDK Documentation](sdk/README.md)
- [Technical Specifications](SPECIFICATION/README.md)
- [PRD](SPECIFICATION/PRD.md)
- [Changelog](CHANGELOG.md)
- [Pitch Deck](pitch-deck/TokenForge_Pitch_Deck.pptx)
