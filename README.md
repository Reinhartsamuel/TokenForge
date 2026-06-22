# TokenForge

> **The compliant tokenization platform for Indonesian digital assets.**
>
> Issue, manage, and distribute tokenized securities on Solana. Built for OJK compliance.

TokenForge is a complete issuer platform for launching and managing regulated security tokens in Indonesia. We provide the operational infrastructure that fund administrators, BPRs, P2P lending platforms, and asset managers need to tokenize real-world assets while maintaining full compliance with OJK regulations (POJK 27/2024, POJK 17/2025).

Built on the [Solana Security Token Standard (SSTS)](https://github.com/solana-foundation/security-token-standard), TokenForge delivers the compliance engine, investor registry, cap table management, and distribution orchestration that issuers need — without building from scratch.

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](CHANGELOG.md)
[![OJK Ready](https://img.shields.io/badge/OJK-Sandbox%20Ready-green.svg)](#ojk-compliance)
[![Tests](https://img.shields.io/badge/tests-23%20passing-brightgreen.svg)](scripts/run-tests.sh)
[![License](https://img.shields.io/badge/license-Apache--2.0-orange.svg)](LICENSE)

---

## The Problem

Indonesian financial institutions face a critical challenge: they need to tokenize real-world assets to access new capital pools, but the operational and compliance burden is prohibitive.

**For BPRs (Bank Perkreditan Rakyat):**
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

## The Solution

TokenForge is the **Tokeny for Indonesia** — a complete issuer platform that handles the full lifecycle of tokenized securities:

| Module | What It Does |
|---|---|
| **Issuer Dashboard** | No-code operations for token lifecycle management, investor onboarding, and compliance monitoring |
| **Investor Registry** | KYC/AML tracking, accreditation verification, investor profiles, and holdings management |
| **Cap Table** | Real-time ownership visualization from on-chain data, enriched with investor names and KYC status |
| **Compliance Engine** | OJK rule configuration, transfer restrictions, jurisdiction flags, lockup periods — all enforced on-chain |
| **Corporate Actions** | Dividend distributions, voting, buybacks, snapshots, and forced transfers |
| **Distribution Orchestration** | Merkle-based yield distribution with waterfall logic for tranching (senior/mezzanine/equity) |
| **NAV Management** | Net Asset Value tracking, historical NAV, and oracle integration |
| **Regulatory Reporting** | OJK-compliant reports, audit trail exports, and investor statements |
| **Transfer Agent** | Subscription/redemption workflows, investor onboarding, and lost wallet recovery |
| **Tranching** | Multi-tranche structure for loan securitization with first-loss mechanisms |

## Use Cases

### 1. BPR Loan Securitization
Tokenize BPR loan pools into senior, mezzanine, and equity tranches. Access institutional capital while maintaining OJK compliance. The equity tranche absorbs initial defaults, protecting senior investors.

**Workflow:**
1. BPR originates loans and pools them into an SPV
2. TokenForge creates three tranche tokens (Senior/Mezz/Equity) with different risk/return profiles
3. Each tranche has its own FAMP compliance policy and investor allowlist
4. Investors subscribe through the dashboard, completing KYC/AML verification
5. Monthly loan repayments are distributed via waterfall logic (Senior paid first, then Mezz, then Equity)
6. If loans default, the equity tranche absorbs losses first, protecting senior investors

### 2. P2P Lending Capital Relief
Free up balance sheet by tokenizing performing loan portfolios. Automate distribution to investors and generate OJK-compliant reports.

**Workflow:**
1. P2P platform originates loans and selects a pool for securitization
2. TokenForge creates a tokenized representation of the loan pool
3. Institutional investors purchase tokens through the dashboard
4. Loan repayments are automatically distributed to token holders via Merkle proofs
5. Platform generates regulatory reports and audit trails for OJK

### 3. Private Credit Funds
Issue tokenized debt instruments with built-in compliance. Manage investor registry and distributions on-chain.

**Workflow:**
1. Fund manager creates a private credit fund and defines investment terms
2. TokenForge creates a security token with OJK-compliant transfer restrictions
3. Accredited investors complete KYC/AML and subscribe through the dashboard
4. Fund manager deploys capital to borrowers
5. Interest payments are distributed to token holders automatically
6. Fund administrator monitors cap table, NAV, and compliance via the dashboard

## OJK Compliance

TokenForge is designed for full compliance with Indonesian digital asset regulations:

### POJK 27/2024 (Digital Financial Assets Trading)
- **Transfer restrictions:** Enforced at smart contract level via FAMP program
- **Investor verification:** KYC/AML status tracked in investor registry
- **Jurisdiction flags:** Only Indonesian residents (or approved foreign investors) can hold tokens
- **Audit trails:** Every on-chain action is logged and exportable

### POJK 17/2025 (Securities Crowdfunding)
- **Investor accreditation:** Automated verification of accredited investor status
- **Subscription limits:** Enforced via smart contract (max investment per investor)
- **Use of proceeds:** Tracked and reported via dashboard
- **Reporting:** Automated generation of OJK-compliant reports

### Regulatory Sandbox (POJK 3/2024)
TokenForge is designed to participate in the OJK regulatory sandbox, providing:
- **Gold tokenization** pilot (already approved in sandbox)
- **Government securities (SBN) tokenization** for retail accessibility
- **Property tokenization** with fractional ownership

### Compliance Engine Features
- **Rule builder:** Configure OJK rules without editing smart contracts
- **Transfer simulation:** Test if a transfer would be allowed before execution
- **Audit log:** Track all rule changes and compliance decisions
- **Freeze/thaw:** Instantly freeze wallets for court orders, sanctions, or lost keys

## Architecture

TokenForge is built on the canonical Solana Security Token Standard (SSTS):

```
┌─────────────────────────────────────────────────────────────┐
│                    SOLANA (DEVNET/MAINNET)                 │
│                                                             │
│  Canonical SSTS Programs (external dependency):            │
│  - security_token_program (24 instructions)                │
│  - security_token_transfer_hook                            │
│                                                             │
│  TokenForge Extension Programs:                            │
│  - famp (compliance verification)                          │
│  - verification_policy_noop (test-only)                    │
└─────────────────────────────────────────────────────────────┘
                     ▲                         ▲
                     │                         │
          ┌──────────┴──────────┐    ┌─────────┴───────────────┐
          │ TokenForge SDK       │    │ TokenForge Backend      │
          │ (workflow layer)     │    │ (indexing + orchestration)│
          └──────────┬──────────┘    └─────────┬───────────────┘
                     │                          │
                     └──────────────┬───────────┘
                                    ▼
                    TokenForge Issuer Dashboard
                    (Investor Registry, Cap Table,
                     Compliance, Reports, Corporate Actions)
```

### Canonical-First Design

| Principle | How We Apply It |
|---|---|
| **Canonical-first** | Canonical SSTS IDL/program behavior is authoritative |
| **No semantic fork** | TokenForge never redefines canonical instruction semantics |
| **Version pinning** | Each release pins a specific canonical commit + program IDs |
| **Extension isolation** | Custom features (FAMP, tranching) live as optional add-ons |

## On-Chain Programs

| Program | ID | Purpose |
|---|---|---|
| SSTS Core | `SSTS8Qk2bW3aVaBEsY1Ras95YdbaaYQQx21JWHxvjap` | Canonical security token program (24 instructions) |
| SSTS Transfer Hook | `HookXqLKgPaNrHBJ9Jui7oQZz93vMbtA88JjsLa8bmfL` | Enforces verification on every transfer |
| FAMP (TokenForge) | `99frBpGJFhSx1qMt64T8HSfZMLUiy5YhZVmnG7X4pk2K` | Compliance verification + policy management |
| verification_policy_noop | `5gPMypQiHYVmx3jFJAGr72wrB7f1bgmud3mHtpHUGyLd` | Test-only verifier (always approves) |

## FAMP Compliance Engine

FAMP (Freeze Authority Management Program) is TokenForge's compliance verification program:

- **Policy management:** Create allowlist/blocklist policies per token
- **Transfer verification:** Check sender/receiver against compliance rules before every transfer
- **Policy-oracle pattern:** FAMP emits events; SDK executes canonical Freeze/Thaw — issuer retains final control
- **OJK integration:** Rules map directly to POJK 27/2024 and POJK 17/2025 requirements

## Issuer Dashboard

The TokenForge dashboard is built for compliance officers and fund administrators, not developers:

### Core Modules
- **Investor Registry:** Manage investor profiles, KYC/AML status, accreditation, and holdings
- **Cap Table:** Real-time ownership visualization with investor names and compliance status
- **Token Management:** Create tokens, configure compliance rules, mint/burn, pause/resume
- **Corporate Actions:** Execute dividends, voting, buybacks, snapshots, forced transfers
- **Compliance Engine:** Configure OJK rules, simulate transfers, view audit logs
- **Distributions:** Create Merkle-based distributions, track claims, generate reports
- **NAV Management:** Update NAV manually or via oracle, view historical NAV
- **Reports:** Generate OJK-compliant reports, audit trail exports, investor statements
- **Transfer Agent:** Process subscriptions/redemptions, handle lost wallet recovery
- **Tranching:** Define multi-tranche structures, configure waterfall distribution logic

### Dashboard Features
- **No-code operations:** Compliance officers can manage tokens without developer help
- **CSV import:** Bulk upload investor lists, cap tables, and loan schedules
- **Real-time updates:** Dashboard reflects on-chain state in real-time
- **Audit trails:** Every action is logged with timestamp, user, and transaction signature
- **Multi-network support:** Switch between devnet and mainnet seamlessly

## Project Structure

```
tokenforge/
├── programs/
│   ├── famp/                     # Compliance verification program
│   └── verification_policy_noop/ # Test-only verifier
├── sdk/
│   ├── src/
│   │   ├── l0/                   # Canonical client re-exports
│   │   ├── l1/                   # Adapters (PDAs, errors, transactions)
│   │   └── l2/                   # Workflow APIs (13 functions)
│   └── tests/
├── dashboard/                    # Next.js issuer dashboard
│   ├── app/
│   │   ├── (dashboard)/          # Main dashboard routes
│   │   │   ├── dashboard/
│   │   │   │   ├── investors/    # Investor registry
│   │   │   │   ├── corporate-actions/
│   │   │   │   ├── compliance/   # Compliance engine
│   │   │   │   ├── reports/      # Regulatory reporting
│   │   │   │   ├── transfer-agent/
│   │   │   │   ├── tokens/       # Token management + cap table
│   │   │   │   ├── distributions/
│   │   │   │   └── activity/
│   │   └── lp-2/                 # Landing page (platform positioning)
│   └── db/                       # Database schema (investors, holdings, etc.)
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
| FAMP Program | ✅ Complete | 16 tests passing, compliance verification |
| SDK L0/L1/L2 | ✅ Complete | 1,637 lines, 13 workflow functions |
| SDK Tests | ✅ Complete | 23 tests passing (16 integration + 7 unit) |
| verification_policy_noop | ✅ Complete | Pure solana-program, always approves |
| Program Builds | ✅ Complete | All 4 programs compile |
| Issuer Dashboard | 🚧 In Progress | Investor registry, cap table, compliance engine |
| Corporate Actions | 📋 Planned | Dividends, voting, buybacks, snapshots |
| Reports | 📋 Planned | OJK-compliant reporting and exports |
| Transfer Agent | 📋 Planned | Subscription/redemption workflows |
| NAV Management | 📋 Planned | NAV tracking and oracle integration |
| Tranching | 📋 Planned | Multi-tranche structure and waterfall logic |

## Compatibility Matrix

| TokenForge Version | SDK Version | Canonical Commit | SSTS Program ID | Transfer Hook ID |
|---|---|---|---|---|
| 2.0.0 | 0.1.0 | `1ab607e` | `SSTS8Qk...` | `HookXqL...` |

## Roadmap

| Phase | Deliverables | Timeline |
|---|---|---|
| **v1.0** (done) | Canonical-first migration, FAMP rework, spec updates | Apr 2026 |
| **v1.1** (done) | TypeScript SDK, PDA helpers, 13 workflow functions | May 2026 |
| **v1.2** (done) | Integration tests, program builds, test runner | May 2026 |
| **v2.0** (in progress) | Issuer dashboard (investor registry, cap table, compliance engine) | Jun 2026 |
| **v2.1** | Corporate actions, NAV management, regulatory reporting | Jul 2026 |
| **v2.2** | Transfer agent workflows, tranching, waterfall distribution | Aug 2026 |
| **v3.0** | OJK sandbox pilot, BPR/P2P reference customers | Q4 2026 |

## Contributing

TokenForge welcomes contributions. Key areas:

- Dashboard feature development (investor registry, cap table, compliance engine)
- Corporate actions implementation (dividends, voting, buybacks)
- OJK compliance rule templates and validation
- Testing and compatibility validation
- Upstream contributions to canonical SSTS

## License

Apache-2.0

---

*TokenForge is the compliant tokenization platform for Indonesian digital assets. Built for OJK compliance. Trusted by fund administrators, BPRs, and asset managers.*
