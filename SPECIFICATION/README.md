# TokenForge

> Canonical-first issuer tooling for the Solana Security Token Standard (SSTS): SDK, dashboard, and compliance extensions built on top of the foundation SSTS programs.

## Positioning

TokenForge is not a replacement SSTS core program. TokenForge is an orchestration layer that:
- Uses the canonical SSTS on-chain programs as source of truth
- Adds higher-level issuer workflows and operator UX
- Ships optional extension modules (for example, FAMP-style policy controls)

## Problem

SSTS gives the protocol foundation, but issuers still need substantial implementation work:
- Integrate low-level instructions and account plumbing
- Build issuer operations UI and automation
- Manage holder sync, distributions, and compliance operations

## Solution

TokenForge provides:
1. **TypeScript workflow SDK** over canonical clients
2. **Issuer dashboard** for non-Rust teams
3. **Optional compliance extensions** (FAMP-style controls)
4. **Managed backend services** (indexing, distribution orchestration, reporting)

## Compatibility Principles

1. **Canonical-first:** canonical SSTS IDL/program behavior is authoritative
2. **No core semantic fork:** TokenForge does not define a competing SSTS core
3. **Version pinning:** TokenForge versions map to specific canonical releases
4. **Extension isolation:** custom features live as optional add-ons, not protocol rewrites

## Architecture (High Level)

- **Canonical SSTS layer** (external dependency)
  - `solana-security-token-standard/program`
  - `solana-security-token-standard/transfer_hook`
  - `solana-security-token-standard/clients/typescript`
- **TokenForge layer**
  - SDK workflow wrappers
  - Issuer dashboard
  - Backend indexing + distribution services
  - Optional FAMP extension program

## Product Direction

- TokenForge continues as a product and developer platform
- Canonical SSTS remains the protocol core
- TokenForge contributes generic improvements upstream while shipping opinionated issuer tooling downstream

## Status

PIVOTED TO CANONICAL-FIRST — April 2026

Implementation note: TokenForge tracks canonical SSTS releases and avoids shipping a parallel SSTS core implementation.
