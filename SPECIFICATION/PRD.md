# PRD: TokenForge — The Compliant Tokenization Platform for Indonesian Digital Assets
Version: 2.0 | Status: DRAFT | Author: TokenForge Team | Date: June 2026

## Overview

TokenForge is the **Tokeny for Indonesia** — a complete issuer platform for launching and managing regulated security tokens in Indonesia. We provide the operational infrastructure that fund administrators, BPRs (Bank Perkreditan Rakyat), P2P lending platforms, and asset managers need to tokenize real-world assets while maintaining full compliance with OJK regulations (POJK 27/2024, POJK 17/2025).

Built on the canonical [Solana Security Token Standard (SSTS)](https://github.com/solana-foundation/security-token-standard), TokenForge delivers the compliance engine, investor registry, cap table management, and distribution orchestration that issuers need — without building from scratch.

The canonical SSTS programs are consumed via git submodule at `lib/canonical-ssts`, pinned to commit `1ab607e`.

## Problem Statement

Indonesian financial institutions face a critical challenge: they need to tokenize real-world assets to access new capital pools, but the operational and compliance burden is prohibitive.

**For BPRs:**
- Limited access to wholesale funding due to capital adequacy constraints
- No efficient way to securitize loan pools and attract institutional investors
- Manual compliance processes that don't scale

**For P2P Lending Platforms:**
- Balance sheet constraints limit lending capacity
- No automated way to distribute loan repayments to investors
- Regulatory reporting is manual and error-prone

**For Fund Administrators:**
- Cap table management relies on spreadsheets and manual reconciliation
- KYC/AML tracking is fragmented across multiple systems
- Distribution orchestration (dividends, interest payments) requires wire transfers and manual processing

**For All Issuers:**
- OJK regulations require strict transfer restrictions, investor verification, and audit trails
- No existing platform provides end-to-end compliance automation for Indonesian digital assets
- Building custom infrastructure takes 6-12 months and requires deep Solana expertise

## Goals & Success Metrics

| Goal | Metric | Target | Timeframe |
|------|--------|--------|-----------|
| **Issuer adoption** | Tokens launched through TokenForge | 10 | Month 3 |
| **OJK compliance** | Tokens with OJK-compliant transfer restrictions | 100% of launched tokens | Month 3 |
| **Investor onboarding** | Investors onboarded via dashboard | 500+ | Month 6 |
| **Distribution automation** | Distributions executed via Merkle orchestration | 50+ | Month 6 |
| **Revenue** | Managed service MRR | $10,000 | Month 6 |
| **Regulatory sandbox** | OJK sandbox approval | 1 pilot | Month 4 |

## Product Scope

### Feature 1: Investor Registry (P0)

**User story:** As a compliance officer, I want to manage investor profiles, KYC/AML status, and accreditation so that I can ensure only eligible investors hold tokens.

**Acceptance criteria:**
- [ ] Investor list page with sortable columns (name, KYC status, accreditation, holdings)
- [ ] Add investor form (manual entry with name, email, wallet address, jurisdiction, entity type)
- [ ] Investor detail page with full profile, holdings, transaction history
- [ ] KYC status tracking (pending, verified, rejected) with audit log
- [ ] Accreditation status tracking (accredited, non-accredited, pending) with expiry date
- [ ] AML/sanctions status tracking (pending, cleared, flagged)
- [ ] CSV import for bulk investor onboarding
- [ ] Filter by jurisdiction, KYC status, accreditation status
- [ ] Export investor list to CSV/PDF

### Feature 2: Cap Table (P0)

**User story:** As a fund administrator, I want to view real-time ownership of my token so that I can track who owns what and generate regulatory reports.

**Acceptance criteria:**
- [ ] Cap table page showing all token holders with investor names, wallet addresses, balances, ownership %
- [ ] Real-time ownership data from on-chain token accounts (indexed)
- [ ] Ownership pie chart (top 10 holders)
- [ ] Summary cards: total holders, total supply, largest holder
- [ ] Historical cap table snapshots (time slider)
- [ ] Export cap table to CSV/PDF
- [ ] Integration with investor registry (map wallet addresses to investor profiles)

### Feature 3: Compliance Engine (P0)

**User story:** As a compliance officer, I want to configure OJK-specific compliance rules so that I can enforce transfer restrictions without editing smart contracts.

**Acceptance criteria:**
- [ ] Compliance rule builder (jurisdiction, lockup period, KYC requirements, transfer restrictions)
- [ ] Rule templates for common OJK requirements (POJK 27/2024, POJK 17/2025)
- [ ] Transfer simulation (test if a transfer would be allowed before execution)
- [ ] Audit log of rule changes (timestamp, user, rule before/after)
- [ ] Automatic generation of FAMP policy entries from compliance rules
- [ ] Manual override for FAMP policy entries (add/remove wallets directly)
- [ ] OJK regulation mapping (show which rules map to which POJK articles)

### Feature 4: Corporate Actions (P1)

**User story:** As a fund administrator, I want to execute corporate actions (dividends, voting, buybacks) so that I can manage token lifecycle events efficiently.

**Acceptance criteria:**
- [ ] Corporate action list page with status tracking (pending, active, completed, cancelled)
- [ ] Create corporate action form (type, title, description, execution date, total amount)
- [ ] Corporate action detail page with execution status and participant list
- [ ] Dividend distribution workflow (snapshot → calculate → distribute → reconcile)
- [ ] Voting workflow (snapshot → ballot → vote collection → result tally)
- [ ] Buyback workflow (request → approval → execution → burn)
- [ ] Snapshot management (take ownership snapshot at block N for dividends/voting)
- [ ] Forced transfer workflow (for court orders, lost wallet recovery)

### Feature 5: Distribution Orchestration (P1)

**User story:** As a fund operator, I want to automate yield distribution via Merkle proofs so that I can distribute dividends/interest to thousands of investors efficiently.

**Acceptance criteria:**
- [ ] Distribution list page with status tracking (pending, active, completed)
- [ ] Create distribution form (token, total amount, snapshot date, claim period)
- [ ] Snapshot generation from indexed holder data
- [ ] Merkle proof generation and claim helper endpoints
- [ ] Distribution detail page with claim status per investor
- [ ] Reconciliation reports from on-chain outcomes
- [ ] Uses canonical `CreateDistributionEscrow` / `ClaimDistribution` instructions
- [ ] Waterfall distribution logic for tranching (senior paid first, then mezzanine, then equity)

### Feature 6: NAV Management (P1)

**User story:** As a fund administrator, I want to track and update Net Asset Value (NAV) so that I can provide accurate pricing for subscriptions and redemptions.

**Acceptance criteria:**
- [ ] NAV history page with line chart (NAV per token over time)
- [ ] Manual NAV update form (NAV per token, total assets, total liabilities, outstanding tokens)
- [ ] NAV verification status (pending, verified by administrator, oracle-verified)
- [ ] Oracle integration (Chainlink or similar) for automated NAV updates
- [ ] NAV calculation formula: (total assets - total liabilities) / outstanding tokens
- [ ] Historical NAV export to CSV
- [ ] NAV freshness indicator (time since last update)

### Feature 7: Regulatory Reporting (P1)

**User story:** As a compliance officer, I want to generate OJK-compliant reports so that I can meet regulatory requirements without manual data collection.

**Acceptance criteria:**
- [ ] Report list page with report type, date range, status
- [ ] Generate report form (type, date range, format: PDF/CSV/JSON)
- [ ] Report types: regulatory (OJK), audit trail, investor statements, distribution reports, NAV history
- [ ] Report preview before download
- [ ] Report download history
- [ ] Automated report generation (scheduled reports)
- [ ] OJK report templates (POJK 27/2024, POJK 17/2025 compliant)

### Feature 8: Transfer Agent (P2)

**User story:** As a transfer agent, I want to process subscriptions and redemptions so that I can manage investor onboarding and offboarding efficiently.

**Acceptance criteria:**
- [ ] Subscription request queue (pending, approved, executed)
- [ ] Redemption request queue (pending, approved, executed)
- [ ] Approval workflow (compliance officer reviews and approves/rejects)
- [ ] Lost wallet recovery wizard (freeze old wallet, mint replacement to new wallet)
- [ ] Bulk operations (mass subscription, mass redemption)
- [ ] Integration with investor registry (update KYC/AML status during onboarding)
- [ ] Audit log of all subscription/redemption actions

### Feature 9: Tranching (P2)

**User story:** As a fund manager, I want to structure loan pools into senior, mezzanine, and equity tranches so that I can attract different types of investors with different risk appetites.

**Acceptance criteria:**
- [ ] Tranche structure builder (add/remove tranches, set priority, allocation %)
- [ ] Tranche detail page (type, priority, target allocation, coupon rate, subscription limits)
- [ ] Allocation pie chart (senior/mezzanine/equity)
- [ ] Waterfall distribution simulator (test how distributions flow through tranches)
- [ ] First-loss mechanism visualization (show how equity tranche absorbs defaults)
- [ ] Each tranche has its own FAMP policy and investor allowlist
- [ ] Integration with distribution orchestration (waterfall logic)

### Feature 10: Canonical SSTS Integration Layer (P0)

**User story:** As a developer, I need TokenForge APIs to execute canonical SSTS instructions without manual account plumbing.

**Acceptance criteria:**
- [x] TokenForge uses canonical SSTS TypeScript client (from `lib/canonical-ssts/clients/typescript`) as the low-level execution layer
- [x] Supported workflows map to canonical instructions and required accounts explicitly
- [x] Program IDs and IDL versions are pinned per TokenForge release
- [x] All 4 programs build successfully: FAMP, verification_policy_noop, canonical SSTS, canonical transfer hook
- [ ] Compatibility test suite validates transaction construction against canonical IDL

### Feature 11: FAMP Compliance Program (P0)

**User story:** As a compliance team, I want allowlist/blocklist policy controls that integrate with canonical SSTS flows while preserving canonical compatibility.

**Acceptance criteria:**
- [x] FAMP is a verification program registered via canonical `InitializeVerificationConfig`
- [x] FAMP implements `verify_transfer` that checks sender/receiver against allowlist/blocklist arrays
- [x] FAMP emits `WalletBlocked`/`WalletUnblocked` events for SDK to trigger canonical SSTS `Freeze`/`Thaw`
- [x] 23 integration tests pass covering: policy creation, verify_transfer gating, blocklist/allowlist management, MAX_LIST_SIZE enforcement, policy-oracle pattern
- [ ] Enabling/disabling FAMP does not break baseline canonical flows (requires canonical SSTS test harness)
- [x] FAMP uses fixed-size arrays (16 wallets per list) — no Merkle proofs needed for verification

### Feature 12: TokenForge TypeScript Workflow SDK (P0)

**User story:** As an integration engineer, I want high-level methods that compose canonical calls.

**Acceptance criteria:**
- [x] SDK wraps canonical client with workflow APIs (create, configure, mint, distribute, pause, resume)
- [x] SDK exposes typed errors and deterministic account derivation helpers
- [x] SDK provides a compatibility matrix: TokenForge SDK version → canonical SSTS release
- [x] SDK includes FAMP policy management wrappers (`createPolicy`, `addToAllowlist`, `removeFromAllowlist`, etc.)
- [ ] SDK implements policy-oracle pattern: listens to FAMP events and constructs canonical `Freeze`/`Thaw` instructions

## Non-Goals

- Building a parallel, competing SSTS core program
- Diverging instruction semantics from canonical SSTS
- Acting as a custodian (we provide tooling, not custody)
- Acting as a broker-dealer (we provide compliance infrastructure, not trading)
- Providing legal or regulatory advice (we provide technology, not legal counsel)
- Supporting non-Indonesian jurisdictions in v2.0 (focus on OJK compliance first)

## Non-Functional Requirements

- **Compatibility:** Canonical API compatibility is a release gate
- **Security:** No server-side private key custody; all transactions signed by issuer
- **Reliability:** RPC failover and idempotent workflow jobs
- **Observability:** Per-operation telemetry with transaction-level tracing
- **Compliance:** All actions logged with audit trail (timestamp, user, transaction signature)
- **Scalability:** Support 10,000+ investors per token, 1,000+ tokens per instance
- **Performance:** Dashboard loads in <2 seconds, on-chain data indexed in <5 seconds

## Open Questions

1. Should we support multi-signature approval for corporate actions (e.g., 2-of-3 compliance officers must approve)?
2. How do we handle cross-border investors (non-Indonesian residents holding Indonesian tokens)?
3. Should we integrate with existing KYC providers (e.g., Sumsub, Onfido) or build our own?
4. What is the maximum viable list size for FAMP before switching to a different data structure (e.g., Bloom filter, on-chain PDA entries)?
5. Should we support ERC-3643 (T-REX) in addition to SSTS for EU compatibility?
6. How do we handle NAV disputes (investor challenges NAV calculation)?
7. Should we provide a white-label version for fund administrators to rebrand?

## Release Strategy

- **v2.0** (Jun 2026): Issuer dashboard (investor registry, cap table, compliance engine)
- **v2.1** (Jul 2026): Corporate actions, NAV management, regulatory reporting
- **v2.2** (Aug 2026): Transfer agent workflows, tranching, waterfall distribution
- **v3.0** (Q4 2026): OJK sandbox pilot, BPR/P2P reference customers, managed service launch

## Target Customers

### Primary
- **BPRs (Bank Perkreditan Rakyat):** Tokenize loan pools to access institutional capital
- **P2P Lending Platforms:** Securitize performing loans to free up balance sheet
- **Fund Administrators:** Manage cap tables, distributions, and compliance for tokenized funds

### Secondary
- **Asset Managers:** Issue tokenized private credit funds
- **Real Estate Developers:** Tokenize property for fractional ownership
- **Corporate Treasuries:** Tokenize receivables for working capital

## Competitive Landscape

| Competitor | Region | Focus | TokenForge Advantage |
|---|---|---|---|
| **Tokeny** | EU | ERC-3643 issuer platform | We're focused on Indonesia/OJK, not EU/MiCA |
| **Securitize** | US | SEC-compliant tokenization | We're focused on Indonesia/OJK, not US/SEC |
| **Polymath/Polymesh** | Global | Security token standard | We provide operational tooling, not just protocol |
| **ADDX** | Singapore | MAS-licensed exchange | We're focused on Indonesia/OJK, not Singapore/MAS |

## Success Criteria

- [ ] Compliance officer can onboard an investor without developer help
- [ ] Fund administrator can view cap table and ownership percentages
- [ ] Issuer can configure OJK compliance rules without editing smart contracts
- [ ] Transfer agent can process subscriptions and redemptions
- [ ] Regulatory reports can be generated and exported
- [ ] NAV can be tracked and updated
- [ ] Tranche structure can be defined and visualized
- [ ] 10+ tokens launched through TokenForge workflows
- [ ] 500+ investors onboarded via dashboard
- [ ] OJK sandbox approval for at least 1 pilot
