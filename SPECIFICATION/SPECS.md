# Technical Specifications: TokenForge (Canonical-First)

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    SOLANA (DEVNET/MAINNET)                 │
│                                                             │
│  Canonical SSTS Programs (external dependency):            │
│  - security_token_program (SSTS8Qk2bW3aVaBEsY1Ras95Y...)   │
│  - security_token_transfer_hook (HookXqLKgPaNrHBJ9Jui7...)  │
│                                                             │
│  TokenForge Extension Programs:                              │
│  - famp (allowlist/blocklist verification + policy mgmt)    │
│  - verification_policy_noop (test-only, always approves)    │
└─────────────────────────────────────────────────────────────┘
                   ▲                         ▲
                   │ tx/instruction calls    │ indexing reads
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

## Canonical Dependency Contract

TokenForge depends on canonical artifacts from `lib/canonical-ssts` (git submodule):
- `program/` (core instruction semantics — 24 instructions)
- `transfer_hook/` (transfer verification mechanism)
- `clients/typescript/` (generated low-level client)
- `idl/security_token_program.json` (interface reference)

Pinned commit: `1ab607e`
Pinned program IDs:
- `SSTS8Qk2bW3aVaBEsY1Ras95YdbaaYQQx21JWHxvjap` (security_token_program)
- `HookXqLKgPaNrHBJ9Jui7oQZz93vMbtA88JjsLa8bmfL` (transfer_hook_program)

## Compatibility Rules

1. TokenForge does not define alternate semantics for canonical instructions.
2. Workflow APIs must map to canonical instruction paths.
3. TokenForge release must pin canonical commit/tag + program IDs.
4. Any unsupported canonical feature must be clearly marked unsupported, not redefined.

## Workflow Mapping

| TokenForge Workflow | Canonical Instructions | Notes |
|---|---|---|
| initialize token | `InitializeMint` | Creates Token-2022 mint with Pausable, TransferHook, PermanentDelegate extensions |
| configure verification | `InitializeVerificationConfig` / `UpdateVerificationConfig` | Register FAMP or other verifiers per instruction discriminator |
| mint tokens | `Verify` + `Mint` (or CPI mode) | Verification programs must approve |
| transfer tokens | `Transfer` | Gated by registered verification programs via introspection or CPI |
| pause/resume | `Pause` / `Resume` | Requires verification program approval |
| freeze/thaw account | `Freeze` / `Thaw` | Requires verification program approval |
| token split | `CreateRateAccount` → `Split` | Rate account defines split ratio + rounding |
| token conversion | `CreateRateAccount` → `Convert` | Rate account defines conversion ratio between mints |
| create distribution | `CreateDistributionEscrow` | Merkle root + escrow token account |
| claim distribution | `CreateProofAccount` + `ClaimDistribution` | Merkle proof verification on-chain |
| manage FAMP policy | `create_policy`, `add_to_allowlist`, `remove_from_allowlist`, `add_to_blocklist`, `remove_from_blocklist` | FAMP program instructions (not canonical) |
| execute freeze (FAMP-triggered) | `Freeze` (canonical) | SDK constructs after listening to FAMP `WalletBlocked` event |
| execute thaw (FAMP-triggered) | `Thaw` (canonical) | SDK constructs after listening to FAMP `WalletUnblocked` event |

## SDK Design

### Layers
- **L0 (canonical generated client):** direct instruction builders and account types from `lib/canonical-ssts/clients/typescript`
- **L1 (TokenForge adapters):** account derivation, guardrails, ergonomic wrappers
  - PDA derivation helpers (VerificationConfig, Rate, Proof, Receipt, FAMP PolicyAccount)
  - Transaction composition utilities (e.g., "mint with verification" = Verify + Mint)
  - FAMP policy management wrappers
  - Error context enrichment
- **L2 (workflow APIs):** issuer task-centric methods with retries, diagnostics, and telemetry

### Error Model
- Canonical program errors are preserved and surfaced
- TokenForge adds contextual workflow errors without masking canonical error codes

### Canonical Account Types (from IDL)
- `MintAuthority` — stores original creator for authorization fallback
- `VerificationConfig` — per-instruction verification program configuration
- `Rate` — conversion and split rate configuration
- `Proof` — Merkle proof data for distribution claims
- `Receipt` — prevents duplicate participation in corporate actions

### FAMP Account Types
- `PolicyAccount` — PDA seeded by `[b"famp_policy", mint]`
  - Fields: `mint`, `issuer_authority`, `allowlist_mode`, `allowlist[16]`, `blocklist[16]`, `allowlist_count`, `blocklist_count`, `bump`

## Testing Strategy

- **Compatibility tests:** verify instruction data/accounts against canonical IDL
- **Integration tests:** execute end-to-end workflows on devnet with canonical programs
- **Regression tests:** pin known-good canonical versions and re-run suite before release
- **FAMP tests:** verify allowlist/blocklist logic, freeze/thaw event emission

## Versioning & Release Matrix

Each TokenForge release publishes:
- supported canonical commit/tag
- required program IDs
- supported workflow set
- known limitations
