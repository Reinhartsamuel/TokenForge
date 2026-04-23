# Technical Specifications: TokenForge (Canonical-First)

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    SOLANA (DEVNET/MAINNET)                 │
│                                                             │
│  Canonical SSTS Programs (external dependency):            │
│  - security_token_program                                  │
│  - security_token_transfer_hook                            │
│                                                             │
│  Optional TokenForge Extension Program:                    │
│  - famp (policy controls)                                  │
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

TokenForge depends on canonical artifacts from `solana-security-token-standard`:
- `program/` (core instruction semantics)
- `transfer_hook/` (transfer verification mechanism)
- `clients/typescript/` (generated low-level client)
- `idl/security_token_program.json` (interface reference)

## Compatibility Rules

1. TokenForge does not define alternate semantics for canonical instructions.
2. Workflow APIs must map to canonical instruction paths.
3. TokenForge release must pin canonical commit/tag + program IDs.
4. Any unsupported canonical feature must be clearly marked unsupported, not redefined.

## Workflow Mapping (Representative)

| TokenForge Workflow | Canonical Primitive |
|---------------------|---------------------|
| initialize token | `InitializeMint` |
| configure verification | `InitializeVerificationConfig` / `UpdateVerificationConfig` |
| mint operations | `Mint` |
| transfer compliance | transfer hook + verification config |
| pause/resume | `Pause` / `Resume` |
| freeze/thaw | `Freeze` / `Thaw` |
| corporate actions | `Split` / `Convert` |
| distributions | `CreateDistributionEscrow` / `ClaimDistribution` |

## SDK Design

### Layers
- **L0 (canonical generated client):** direct instruction builders and account types
- **L1 (TokenForge adapters):** account derivation, guardrails, ergonomic wrappers
- **L2 (workflow APIs):** issuer task-centric methods with retries, diagnostics, and telemetry

### Error Model
- Canonical program errors are preserved and surfaced
- TokenForge adds contextual workflow errors without masking canonical error codes

## FAMP Extension Design

- FAMP remains an optional TokenForge program, not canonical SSTS core
- FAMP integration is performed through compatible verification/authorization pathways
- If FAMP is disabled, canonical SSTS workflows remain fully functional

## Backend Contracts (Minimal)

- `GET /api/registry/tokens`
- `GET /api/registry/tokens/:mint`
- `POST /api/distribution/prepare`
- `POST /api/distribution/publish`
- `GET /api/distribution/:id/proof/:wallet`

All write flows must correspond to canonical on-chain outcomes.

## Testing Strategy

- **Compatibility tests:** verify instruction data/accounts against canonical IDL
- **Integration tests:** execute end-to-end workflows on devnet with canonical programs
- **Regression tests:** pin known-good canonical versions and re-run suite before release

## Versioning & Release Matrix

Each TokenForge release publishes:
- supported canonical commit/tag
- required program IDs
- supported workflow set
- known limitations
