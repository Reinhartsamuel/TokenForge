# PRD: TokenForge (Canonical-First)
Version: 1.1 | Status: DRAFT | Author: TokenForge Team | Date: April 2026

## Overview

TokenForge is an issuer tooling platform built on top of the canonical Solana Security Token Standard (SSTS). It does not implement a separate SSTS core. Instead, TokenForge composes canonical SSTS programs and clients into a higher-level developer and operations experience.

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
- [ ] TokenForge uses canonical SSTS TypeScript client as the low-level execution layer
- [ ] Supported workflows map to canonical instructions and required accounts explicitly
- [ ] Program IDs and IDL versions are pinned per TokenForge release
- [ ] Compatibility test suite validates transaction construction against canonical IDL

### Feature 2: FAMP Extension Program (Optional) (P0)

**User story:** As a compliance team, I want optional policy controls that integrate with SSTS flows while preserving canonical compatibility.

**Acceptance criteria:**
- [ ] FAMP is documented as an extension, not part of SSTS core
- [ ] FAMP integration points with canonical verification/transfer controls are explicit
- [ ] Enabling/disabling FAMP does not break baseline canonical flows

### Feature 3: TokenForge TypeScript Workflow SDK (P0)

**User story:** As an integration engineer, I want high-level methods that compose canonical calls.

**Acceptance criteria:**
- [ ] SDK wraps canonical client with workflow APIs (create, configure, mint, distribute, pause, resume)
- [ ] SDK exposes typed errors and deterministic account derivation helpers
- [ ] SDK provides a compatibility matrix: TokenForge SDK version -> canonical SSTS release

### Feature 4: Issuer Dashboard (P0)

**User story:** As an issuer/compliance operator, I want no-code operations for canonical SSTS token lifecycle tasks.

**Acceptance criteria:**
- [ ] Wallet connect and network support
- [ ] Token creation/configuration flow built on canonical instructions
- [ ] Holder operations and distribution workflows wired through SDK
- [ ] Clear status and failure diagnostics per on-chain transaction

### Feature 5: Distribution Orchestration Service (P1)

**User story:** As a fund operator, I want snapshot + Merkle distribution workflows with auditable records.

**Acceptance criteria:**
- [ ] Snapshot generation from indexed holder data
- [ ] Merkle proof generation and claim helper endpoints
- [ ] Reconciliation reports from on-chain outcomes

## Non-Goals

- Building a parallel, competing SSTS core program
- Diverging instruction semantics from canonical SSTS

## Non-Functional Requirements

- **Compatibility:** Canonical API compatibility is a release gate
- **Security:** No server-side private key custody
- **Reliability:** RPC failover and idempotent workflow jobs
- **Observability:** Per-operation telemetry with transaction-level tracing

## Open Questions

1. Which canonical release line is the initial support baseline?
2. Which FAMP integration shape should be standardized upstream?
3. Which workflows are guaranteed in v1 vs marked experimental?

## Release Strategy

- **v1:** Canonical integration + workflow SDK + basic dashboard
- **v1.x:** Distribution automation + expanded policy tooling
- **v2:** Managed enterprise controls, reporting, and integrations
