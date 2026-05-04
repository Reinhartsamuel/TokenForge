# PRD: TokenForge (Canonical-First)
Version: 1.2 | Status: DRAFT | Author: TokenForge Team | Date: April 2026

## Overview

TokenForge is an issuer tooling platform built on top of the canonical Solana Security Token Standard (SSTS). It does not implement a separate SSTS core. Instead, TokenForge composes canonical SSTS programs and clients into a higher-level developer and operations experience.

The canonical SSTS programs are consumed via git submodule at `lib/canonical-ssts`, pinned to commit `1ab607e`.

## Goals & Success Metrics

| Goal | Metric | Target | Timeframe |
|------|--------|--------|-----------|
| Protocol compatibility | Critical flow parity with canonical SSTS | 100% for supported flows | Month 1 |
| SDK adoption | Weekly npm downloads | 1,000+ | Month 2 |
| Issuer adoption | Tokens launched through TokenForge workflows | 10 | Month 3 |
| Ecosystem trust | Upstream contributions merged | 3+ PRs | Month 3 |
| Revenue | Managed service MRR | $5,000 | Month 4 |

## Product Scope

### Feature 1: Canonical SSTS Integration Layer (P0)

**User story:** As a developer, I need TokenForge APIs to execute canonical SSTS instructions without manual account plumbing.

**Acceptance criteria:**
- [x] TokenForge uses canonical SSTS TypeScript client (from `lib/canonical-ssts/clients/typescript`) as the low-level execution layer
- [x] Supported workflows map to canonical instructions and required accounts explicitly
- [x] Program IDs and IDL versions are pinned per TokenForge release
- [x] All 4 programs build successfully: FAMP, verification_policy_noop, canonical SSTS, canonical transfer hook
- [ ] Compatibility test suite validates transaction construction against canonical IDL

### Feature 2: FAMP Extension Program (P0)

**User story:** As a compliance team, I want allowlist/blocklist policy controls that integrate with canonical SSTS flows while preserving canonical compatibility.

**Acceptance criteria:**
- [x] FAMP is a verification program registered via canonical `InitializeVerificationConfig`
- [x] FAMP implements `verify_transfer` that checks sender/receiver against allowlist/blocklist arrays
- [x] FAMP emits `WalletBlocked`/`WalletUnblocked` events for SDK to trigger canonical SSTS `Freeze`/`Thaw`
- [x] 23 integration tests pass covering: policy creation, verify_transfer gating, blocklist/allowlist management, MAX_LIST_SIZE enforcement, policy-oracle pattern
- [ ] Enabling/disabling FAMP does not break baseline canonical flows (requires canonical SSTS test harness)
- [x] FAMP uses fixed-size arrays (16 wallets per list) — no Merkle proofs needed for verification

### Feature 3: TokenForge TypeScript Workflow SDK (P0)

**User story:** As an integration engineer, I want high-level methods that compose canonical calls.

**Acceptance criteria:**
- [x] SDK wraps canonical client with workflow APIs (create, configure, mint, distribute, pause, resume)
- [x] SDK exposes typed errors and deterministic account derivation helpers
- [x] SDK provides a compatibility matrix: TokenForge SDK version → canonical SSTS release
- [x] SDK includes FAMP policy management wrappers (`createPolicy`, `addToAllowlist`, `removeFromAllowlist`, etc.)
- [ ] SDK implements policy-oracle pattern: listens to FAMP events and constructs canonical `Freeze`/`Thaw` instructions

### Feature 4: Issuer Dashboard (P0)

**User story:** As an issuer/compliance operator, I want no-code operations for canonical SSTS token lifecycle tasks.

**Acceptance criteria:**
- [ ] Wallet connect and network support
- [ ] Token creation/configuration flow built on canonical instructions
- [ ] Holder operations and distribution workflows wired through SDK
- [ ] Clear status and failure diagnostics per on-chain transaction
- [ ] FAMP policy management UI (allowlist/blocklist editor)

### Feature 5: Distribution Orchestration Service (P1)

**User story:** As a fund operator, I want snapshot + Merkle distribution workflows with auditable records.

**Acceptance criteria:**
- [ ] Snapshot generation from indexed holder data
- [ ] Merkle proof generation and claim helper endpoints
- [ ] Reconciliation reports from on-chain outcomes
- [ ] Uses canonical `CreateDistributionEscrow` / `ClaimDistribution` instructions

## Non-Goals

- Building a parallel, competing SSTS core program
- Diverging instruction semantics from canonical SSTS

## Non-Functional Requirements

- **Compatibility:** Canonical API compatibility is a release gate
- **Security:** No server-side private key custody
- **Reliability:** RPC failover and idempotent workflow jobs
- **Observability:** Per-operation telemetry with transaction-level tracing

## Open Questions

1. Which workflows are guaranteed in v1 vs marked experimental?
2. Should FAMP support mint verification (discriminator 6) in addition to transfer verification (discriminator 12)?
3. What is the maximum viable list size for FAMP before switching to a different data structure (e.g., Bloom filter, on-chain PDA entries)?

## Release Strategy

- **v1:** Canonical integration + workflow SDK + basic dashboard + FAMP verification program
- **v1.x:** Distribution automation + expanded policy tooling
- **v2:** Managed enterprise controls, reporting, and integrations
