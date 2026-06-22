# TokenForge Dashboard — Full Documentation

> **Next.js 16 issuer dashboard** for the Solana Security Token Standard (SSTS).  
> Built with shadcn/ui, Tailwind CSS v4, Drizzle ORM + PostgreSQL, and `@solana/web3.js` v1/v2.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Project Structure](#2-project-structure)
3. [Route Map](#3-route-map)
4. [API Routes](#4-api-routes)
5. [Database Schema](#5-database-schema)
6. [Key Components](#6-key-components)
7. [SDK Integration](#7-sdk-integration)
8. [Environment Variables](#8-environment-variables)
9. [Development Workflow](#9-development-workflow)
10. [Design System](#10-design-system)
11. [Transaction Signing Pattern](#11-transaction-signing-pattern)
12. [Troubleshooting](#12-troubleshooting)

---

## 1. Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                        Next.js 16 App                            │
│                                                                  │
│  ┌─────────────────────┐    ┌────────────────────────────────┐   │
│  │  (landing) Route     │    │  (dashboard) Route Group       │   │
│  │  Marketing site      │    │  Authenticated issuer UI       │   │
│  │  11 sections         │    │  Sidebar + 12 pages            │   │
│  └─────────────────────┘    └──────────┬─────────────────────┘   │
│                                        │                         │
│  ┌─────────────────────────────────────┴──────────────────────┐  │
│  │                    API Layer                                │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │  │
│  │  │ Tokens   │ │ FAMP     │ │ Transfer │ │ Distribution  │  │  │
│  │  │ CRUD     │ │ Policy   │ │ Tokens   │ │ Escrow/Claim  │  │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────────┘  │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │  │
│  │  │ Stats    │ │ TX Log   │ │ Init VC  │ │ R2 Upload    │  │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────────┘  │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                        │                         │
│  ┌─────────────────────────────────────┴──────────────────────┐  │
│  │                    Data Layer                               │  │
│  │  ┌──────────────────────┐  ┌────────────────────────────┐  │  │
│  │  │ PostgreSQL (Railway) │  │ Cloudflare R2 (Metadata)   │  │  │
│  │  │ Drizzle ORM          │  │ S3-compatible storage      │  │  │
│  │  └──────────────────────┘  └────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                        │                         │
│  ┌─────────────────────────────────────┴──────────────────────┐  │
│  │                    Solana Devnet                            │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │  │
│  │  │ SSTS     │ │ Transfer │ │ FAMP     │ │ NOOP         │  │  │
│  │  │ Core     │ │ Hook     │ │ Policy   │ │ Verifier     │  │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────────┘  │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

### Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Server-side signing** | All on-chain operations use `TEST_WALLET_KEYPAIR` env var — no browser wallet required for token ops |
| **Manual instruction building** | API routes build raw `TransactionInstruction` with explicit account flags (bypasses `canonicalIxToWeb3` limitations) |
| **Non-fatal DB writes** | On-chain success is primary; DB persistence is best-effort (wrapped in try/catch) |
| **Dual Solana client libs** | `@solana/web3.js` v1 for transaction construction, `@solana/kit` v2 for PDA derivation and canonical types |
| **Dark theme only** | Forces `className="dark"` on `<html>` — no light mode support |
| **Client-side data fetching** | All dashboard pages use `useEffect` + `fetch()` — no server components or server actions |

---

## 2. Project Structure

```
dashboard/
├── .env.example                  # R2 config template
├── .gitignore
├── README.md
├── components.json               # shadcn/ui config (base-nova style)
├── drizzle.config.ts             # Drizzle ORM → PostgreSQL
├── eslint.config.mjs
├── next.config.ts                # turbopack only
├── package.json
├── postcss.config.mjs            # Tailwind v4
├── tsconfig.json
│
├── app/
│   ├── favicon.ico
│   ├── globals.css               # Tailwind v4 + CSS custom properties (dark theme)
│   ├── layout.tsx                # Root layout (Inter + JetBrains Mono, dark class)
│   │
│   ├── (landing)/                # Route group: marketing site
│   │   ├── layout.tsx            # TooltipProvider + Toaster
│   │   ├── page.tsx              # 11-section landing page
│   │   └── components/           # 11 section components
│   │
│   └── (dashboard)/              # Route group: authenticated dashboard
│       ├── layout.tsx            # WalletContextProvider + SidebarProvider + Toaster
│       ├── dashboard/            # Page routes (12 pages)
│       └── api/                  # API routes (11 endpoints)
│
├── components/
│   ├── address-label.tsx         # Truncated address + copy-to-clipboard
│   ├── app-sidebar.tsx           # Sidebar navigation
│   ├── status-badge.tsx          # Color-coded status badges
│   ├── wallet-context-provider.tsx  # Solana wallet adapter
│   └── ui/                       # 19 shadcn/ui primitives
│
├── hooks/
│   └── use-mobile.ts             # Mobile breakpoint detection (768px)
│
├── lib/
│   ├── address.ts                # shortenAddress, isValidAddress, copyToClipboard
│   ├── db.ts                     # Drizzle ORM client (postgres.js)
│   ├── utils.ts                  # cn() helper (clsx + tailwind-merge)
│   ├── sdk-bridge.ts             # useSdkRpc(), useWalletAddress() hooks
│   └── sdk/                      # TokenForge SDK (3-layer)
│       ├── index.ts              # Re-exports
│       ├── l0/index.ts           # Canonical client re-exports
│       ├── l1/derive.ts          # PDA derivation helpers
│       ├── l1/errors.ts          # Error types
│       ├── l1/transactions.ts    # Transaction building + canonicalIxToWeb3
│       ├── l2/token.ts           # Token lifecycle workflows
│       ├── l2/distribution.ts    # Distribution workflows
│       ├── l2/famp.ts            # FAMP policy workflows
│       └── utils/constants.ts    # Program IDs
│
└── db/
    ├── schema.ts                 # 6 tables + relations
    └── migrations/               # Drizzle Kit migrations
```

---

## 3. Route Map

### Landing Pages (`(landing)`)

| Route | Type | Description |
|-------|------|-------------|
| `/` | Page | Marketing landing page (11 sections: Hero, Problem, Solution, How It Works, Architecture, Stats, Comparison, Roadmap, CTA, Footer) |

### Dashboard Pages (`(dashboard)/dashboard`)

| Route | Type | Description |
|-------|------|-------------|
| `/dashboard` | Page | Overview with 4 KPI cards, recent activity table, quick actions |
| `/dashboard/tokens` | Page | Token list with search/filter, create button |
| `/dashboard/tokens/create` | Page | 3-step wizard: Details → Metadata → Deploy |
| `/dashboard/tokens/[mintAddress]` | Page | Token detail (info cards, transactions tab, policy tab, details tab) |
| `/dashboard/tokens/[mintAddress]/mint` | Page | Mint tokens form (destination + amount) |
| `/dashboard/tokens/[mintAddress]/transfer` | Page | Transfer form with FAMP gating toggle |
| `/dashboard/tokens/[mintAddress]/policy` | Page | FAMP policy management (create, allowlist CRUD, blocklist view) |
| `/dashboard/policies` | Page | Policies list (derived from tokens) |
| `/dashboard/policies/[mintAddress]` | Page | Per-token policy detail |
| `/dashboard/distributions` | Page | Distributions list |
| `/dashboard/distributions/create` | Page | Create escrow + Claim distribution (tabs) |
| `/dashboard/distributions/[id]` | Page | Distribution detail |
| `/dashboard/activity` | Page | Full transaction log with search + type filter |
| `/dashboard/settings` | Page | Network config, RPC endpoint, storage info |

### API Routes (`(dashboard)/api`)

| Route | Methods | Purpose |
|-------|---------|---------|
| `/api/stats` | GET | Aggregate KPI counts (tokens, policies, distributions, transactions) |
| `/api/tokens` | GET, POST | List tokens (searchable) + create DB record |
| `/api/tokens/[mintAddress]` | GET, PATCH | Single token detail + status update |
| `/api/transactions` | GET, POST | List transactions (filterable by token/type) + record |
| `/api/test-create-token` | POST | Deploy SSTS token on-chain + persist to DB |
| `/api/mint-tokens` | POST | Mint tokens via server-side keypair (auto-creates VC if needed) |
| `/api/transfer-tokens` | POST | Transfer with optional FAMP enforcement |
| `/api/famp-policy` | POST | FAMP CRUD: create, add/remove allowlist/blocklist, get policy state |
| `/api/distribution` | POST | Create escrow + Claim distribution (manual instruction building) |
| `/api/init-vc-transfer` | POST | Initialize VerificationConfig for transfer discriminator |
| `/api/r3-upload` | POST | Upload metadata JSON to Cloudflare R2 |

---

## 4. API Routes — Detailed Reference

### `POST /api/test-create-token`

Creates a canonical SSTS security token on Solana devnet.

**Request:**
```json
{ "name": "My Token", "symbol": "MST", "decimals": 6, "uri": "https://..." }
```

**Flow:**
1. Derives MintAuthority PDA, FreezeAuthority PDA, VerificationConfig PDA
2. Builds `InitializeMint` instruction (with metadata pointer, metadata, scaled UI amount extensions)
3. Builds `InitializeVerificationConfig` instruction (discriminator 12, CPI mode, NOOP verifier)
4. Simulates, then sends transaction signed by `TEST_WALLET_KEYPAIR` + generated mint keypair
5. On success, persists token + transaction records to PostgreSQL

**Response:**
```json
{
  "success": true,
  "signature": "5hJbBUQo...",
  "mint": "MintAddress...",
  "mintAuthorityPda": "PdaAddress...",
  "verificationConfigPda": "PdaAddress...",
  "explorerUrl": "https://explorer.solana.com/tx/..."
}
```

### `POST /api/mint-tokens`

Mints tokens to a destination ATA (auto-creates if missing).

**Request:**
```json
{ "mintAddress": "...", "destination": "...", "amount": "1000" }
```

**Flow:**
1. Derives MintAuthority PDA + VerificationConfig PDA (discriminator 6)
2. Checks if VerificationConfig exists; creates it if not (CPI mode, NOOP verifier)
3. Gets or creates destination ATA via `@solana/spl-token`
4. Builds `Mint` instruction with NOOP verifier as remaining account
5. Simulates, sends, persists to DB

### `POST /api/transfer-tokens`

Transfers tokens with optional FAMP policy enforcement.

**Request:**
```json
{
  "mintAddress": "...",
  "source": "...",
  "recipient": "...",
  "amount": "100",
  "enforceFamp": true
}
```

**Flow:**
1. Selects verification program: `FAMP_PROGRAM_ID` when `enforceFamp=true`, else `NOOP_VERIFICATION_PROGRAM_ID`
2. Derives PDAs: MintAuthority, VerificationConfig (disc 12), PermanentDelegate, TransferHook
3. Gets or creates source + destination ATAs
4. Builds Transfer instruction manually with 10 accounts (mint, VC, sysvar, delegate, mint, source ATA, dest ATA, transfer hook, token-2022, verifier)
5. Simulates, sends, returns result

### `POST /api/famp-policy`

Full FAMP policy CRUD. Supports 6 actions.

**Actions:**

| Action | Description | Extra Params |
|--------|-------------|-------------|
| `create` | Create FAMP policy | `allowlistMode` (boolean) |
| `addToAllowlist` | Add wallet to allowlist | `wallet` (base58) |
| `removeFromAllowlist` | Remove from allowlist | `wallet` |
| `addToBlocklist` | Add to blocklist | `wallet` |
| `removeFromBlocklist` | Remove from blocklist | `wallet` |
| `getPolicy` | Read policy state from on-chain | none |

**Instruction discriminators** (Anchor 0.31.x SHA-256 `global:name` prefix):
```
createPolicy:         [27, 81, 33, 27, 196, 103, 246, 53]
addToAllowlist:       [149, 143, 78, 134, 241, 244, 7, 56]
removeFromAllowlist:  [45, 46, 214, 56, 189, 77, 242, 227]
addToBlocklist:       [201, 138, 75, 216, 252, 201, 26, 106]
removeFromBlocklist:  [132, 125, 30, 120, 139, 22, 210, 90]
```

**Policy account layout** (parsed in `getPolicy`):
```
8 bytes  — Anchor discriminator
32 bytes — mint (Pubkey)
32 bytes — issuer_authority (Pubkey)
1 byte   — allowlist_mode (bool)
512 bytes — allowlist ([Pubkey; 16])
512 bytes — blocklist ([Pubkey; 16])
1 byte   — allowlist_count (u8)
1 byte   — blocklist_count (u8)
1 byte   — bump (u8)
```

### `POST /api/distribution`

Two actions: `create` (CreateDistributionEscrow, disc 20) and `claim` (ClaimDistribution, disc 21).

**Create request:**
```json
{
  "action": "create",
  "mintAddress": "...",
  "merkleRoot": "0x...64hexchars...",
  "escrowTokenAccount": "...",
  "actionId": 0
}
```

**Claim request:**
```json
{
  "action": "claim",
  "mintAddress": "...",
  "claimantAddress": "...",
  "amount": "1000",
  "merkleRoot": "0x...",
  "actionId": 0,
  "leafIndex": 0,
  "proofs": ["0x...", "0x..."]
}
```

**Claim flow:**
1. Derives VerificationConfig (disc 21), ProofAccount PDA, PermanentDelegate PDA
2. Derives claimant ATA + escrow ATA (owned by mint PDA)
3. If proofs provided: builds `CreateProofAccount` instruction (disc 18)
4. Builds `ClaimDistribution` instruction (disc 21) with Merkle proof option
5. Simulates, sends, returns result

### `POST /api/init-vc-transfer`

Initializes VerificationConfig for transfer discriminator (12) with NOOP verifier.

**Request:**
```json
{ "mintAddress": "..." }
```

**Flow:**
1. Derives MintAuthority PDA, VerificationConfig PDA (disc 12), TransferHook PDA, ExtraAccountMetas PDA
2. Checks if VC already exists (idempotent)
3. Builds `InitializeVerificationConfig` instruction manually with 10 accounts
4. Simulates, sends, returns result

### `POST /api/r3-upload`

Uploads token metadata JSON to Cloudflare R2.

**Request:**
```json
{
  "metadata": {
    "name": "My Token",
    "symbol": "MST",
    "description": "...",
    "image": "https://...",
    "decimals": 6
  }
}
```

**Response:**
```json
{ "url": "https://.../metadata/mst-1234567890.json", "key": "metadata/mst-1234567890.json" }
```

### `GET /api/stats`

Returns aggregate counts from PostgreSQL:
```json
{ "totalTokens": 5, "activePolicies": 3, "totalDistributions": 2, "totalTransactions": 15 }
```

### `GET /api/tokens`

Lists tokens with optional search. Query params: `search`, `limit` (default 50), `offset`.

### `POST /api/tokens`

Creates a token record in PostgreSQL (for manual DB entries).

### `GET /api/transactions`

Lists transactions with optional filters. Query params: `token` (mint address), `type`, `limit` (default 50). Joins with tokens table for name/symbol.

### `POST /api/transactions`

Records a transaction in PostgreSQL.

---

## 5. Database Schema

### Tables

#### `tokens`
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID PK | Auto-generated |
| `mint_address` | varchar(44) UNIQUE | Solana mint address |
| `name` | varchar(255) | Token name |
| `symbol` | varchar(10) | Token symbol |
| `decimals` | integer (default 6) | Token decimals |
| `uri` | text | Metadata URI |
| `description` | text | Token description |
| `image_url` | text | Token image URL |
| `mint_authority_pda` | varchar(44) | Derived MintAuthority PDA |
| `freeze_authority_pda` | varchar(44) | Derived FreezeAuthority PDA |
| `verification_config_pda` | varchar(44) | VerificationConfig PDA |
| `creator_address` | varchar(44) | Issuer wallet |
| `network` | varchar(10) (default 'devnet') | Solana network |
| `status` | varchar(20) (default 'active') | active/paused/frozen |
| `created_at` | timestamp | Auto |
| `updated_at` | timestamp | Auto |

#### `transactions`
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID PK | Auto-generated |
| `token_id` | UUID FK → tokens | Optional token reference |
| `signature` | varchar(88) | Solana transaction signature |
| `type` | varchar(50) | create/mint/transfer/policy_create/etc. |
| `status` | varchar(20) | confirmed/failed/pending |
| `from_address` | varchar(44) | Source wallet |
| `to_address` | varchar(44) | Destination wallet/ATA |
| `amount` | numeric(30,9) | Token amount |
| `metadata` | JSONB | Arbitrary metadata |
| `explorer_url` | text | Solana explorer link |
| `created_at` | timestamp | Auto |

#### `famp_policies`
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID PK | Auto-generated |
| `token_id` | UUID FK → tokens (UNIQUE) | One policy per token |
| `policy_address` | varchar(44) UNIQUE | FAMP PolicyAccount PDA |
| `allowlist_mode` | boolean (default false) | Allowlist vs blocklist mode |
| `created_at` | timestamp | Auto |
| `updated_at` | timestamp | Auto |

#### `famp_policy_entries`
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID PK | Auto-generated |
| `policy_id` | UUID FK → famp_policies | Parent policy |
| `wallet_address` | varchar(44) | Wallet on list |
| `list_type` | varchar(20) | 'allowlist' or 'blocklist' |
| `created_at` | timestamp | Auto |

#### `distributions`
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID PK | Auto-generated |
| `token_id` | UUID FK → tokens | Token being distributed |
| `escrow_ata` | varchar(44) | Escrow token account |
| `merkle_root` | varchar(66) | Merkle root (0x-prefixed hex) |
| `action_id` | integer (default 0) | Distribution action ID |
| `status` | varchar(20) (default 'active') | active/completed |
| `total_claimed` | numeric(30,9) (default '0') | Total claimed amount |
| `total_claimants` | integer (default 0) | Number of claimants |
| `created_at` | timestamp | Auto |
| `updated_at` | timestamp | Auto |

#### `distribution_claims`
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID PK | Auto-generated |
| `distribution_id` | UUID FK → distributions | Parent distribution |
| `claimant_address` | varchar(44) | Claimant wallet |
| `amount` | numeric(30,9) | Claimed amount |
| `leaf_index` | integer | Merkle tree leaf index |
| `status` | varchar(20) (default 'pending') | pending/claimed/failed |
| `signature` | varchar(88) | Claim transaction signature |
| `claimed_at` | timestamp | When claimed |
| `created_at` | timestamp | Auto |

### Relations

```
tokens ──1:N──> transactions
tokens ──1:1──> famp_policies ──1:N──> famp_policy_entries
tokens ──1:N──> distributions ──1:N──> distribution_claims
```

### Migration Commands

```bash
npm run db:generate   # Generate migration from schema changes
npm run db:migrate    # Apply pending migrations
npm run db:studio     # Open Drizzle Studio (GUI)
```

---

## 6. Key Components

### `app-sidebar.tsx`

Professional SaaS sidebar with shadcn/ui `Sidebar` component. Navigation items:

| Item | Icon | Sub-items |
|------|------|-----------|
| Overview | LayoutDashboard | — |
| Tokens | Coins | All Tokens, Create Token |
| Policies | ShieldCheck | — |
| Distributions | Send | — |
| Activity | Activity | — |
| Settings | Settings | — |

Footer shows network indicator (Devnet) and `WalletMultiButton`.

### `status-badge.tsx`

Color-coded badge using CVA (class-variance-authority). Supports 18 variants:

| Variant | Color |
|---------|-------|
| active | green |
| paused | amber |
| frozen | red |
| pending | amber |
| confirmed | green |
| failed | red |
| completed | blue |
| cancelled | slate |
| allowlist | green |
| blocklist | red |
| devnet | sky |
| mainnet | purple |
| create | blue |
| mint | green |
| transfer | cyan |
| policy_create/allowlist/blocklist | violet |
| distribution_create/claim | orange |

### `address-label.tsx`

Truncated Solana address with:
- `shortenAddress(address, chars)` — shows first/last N chars
- Copy-to-clipboard button with checkmark feedback
- Tooltip showing full address on hover

### `wallet-context-provider.tsx`

Solana wallet adapter provider configured for Devnet. Wraps `ConnectionProvider` and `WalletProvider`.

### `sdk-bridge.ts` (`lib/sdk-bridge.ts`)

Bridges `@solana/wallet-adapter` (web3.js v1) to `@solana/kit` v2:

- `useSdkRpc()` — Creates `@solana/kit` RPC client from wallet adapter's connection endpoint
- `useWalletAddress()` — Converts wallet adapter's `PublicKey` to `@solana/kit` `Address` type

### `ui/` — shadcn/ui Primitives

19 components installed via shadcn CLI (base-nova style):

`badge`, `button`, `card`, `dialog`, `dropdown-menu`, `input`, `label`, `scroll-area`, `select`, `separator`, `sheet`, `sidebar`, `skeleton`, `sonner` (toast), `switch`, `table`, `tabs`, `tooltip`, `transaction-result`

---

## 7. SDK Integration

The dashboard embeds the TokenForge SDK directly at `lib/sdk/` (not as an npm dependency). The SDK follows a 3-layer architecture:

### L0 — Canonical Client (`lib/sdk/l0/`)
Re-exports from the canonical SSTS git submodule at `lib/canonical-ssts/clients/typescript/src/generated/`. Provides:
- Instruction builders: `getInitializeMintInstruction`, `getMintInstruction`, `getInitializeVerificationConfigInstruction`, etc.
- Program IDs: `SSTS_PROGRAM_ID`, `TOKEN_2022_PROGRAM_ID`, `TRANSFER_HOOK_PROGRAM_ID`, etc.

### L1 — Adapters (`lib/sdk/l1/`)
- **`derive.ts`** — PDA derivation helpers:
  - `deriveMintAuthorityPda(mint, creator, programId)`
  - `deriveFreezeAuthorityPda(mint, programId)`
  - `deriveVerificationConfigPda(mint, discriminator, programId)`
  - `deriveFampPolicyPda(mint, programId)`
  - `deriveProofAccountPda(mint, claimant, programId)`
  - `deriveRateAccountPda(mint, programId)`
  - `derivePermanentDelegatePda(mint, programId)`
  - `deriveTransferHookPda(mint, programId)`
  - `deriveExtraAccountMetasPda(mint, programId)`
- **`errors.ts`** — `TokenForgeError`, `enrichError()`, `SstsError`/`FampError` enums
- **`transactions.ts`** — `sendSstsTransaction()`, `buildTransaction()`, `canonicalIxToWeb3()` (converts `@solana/kit` instructions to web3.js v1)

### L2 — Workflows (`lib/sdk/l2/`)
- **`token.ts`** — `createSecurityToken`, `mintTokens`, `transferTokens`, `pauseToken`, `resumeToken`, `freezeAccount`, `thawAccount`
- **`distribution.ts`** — `createDistribution`, `claimDistribution`, `executeSplit`, `executeConvert`
- **`famp.ts`** — `createFampPolicy`, `addToAllowlist`, `removeFromAllowlist`, `addToBlocklist`, `removeFromBlocklist`

### Important Note

The API routes **bypass L2 workflows** and build instructions manually using raw `TransactionInstruction` with explicit account flags. This is because `canonicalIxToWeb3` does not correctly set `isWritable` for `TransactionSigner` accounts (it assigns `role: 3` instead of `role: 5`). Manual instruction building gives fine-grained control over account ordering and permissions.

---

## 8. Environment Variables

### Required

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgres://user:pass@host:5432/tokenforge` |
| `TEST_WALLET_KEYPAIR` | Server-side signing keypair | Base64 string or JSON array `[12,34,56,...]` |

### Cloudflare R2 (Optional — for metadata upload)

| Variable | Description |
|----------|-------------|
| `R2_ACCOUNT_ID` | Cloudflare account ID |
| `R2_ACCESS_KEY_ID` | R2 API access key |
| `R2_SECRET_ACCESS_KEY` | R2 API secret key |
| `R2_BUCKET_NAME` | R2 bucket name |
| `R2_PUBLIC_URL` | Public URL for bucket |

### `.env.example`
```
R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-access-key-id
R2_SECRET_ACCESS_KEY=your-secret-access-key
R2_BUCKET_NAME=tokenforge-metadata
R2_PUBLIC_URL=https://metadata.your-domain.com
```

---

## 9. Development Workflow

### Setup

```bash
# Install dependencies
cd dashboard
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with DATABASE_URL and TEST_WALLET_KEYPAIR

# Run database migrations
npm run db:migrate

# Start dev server
npm run dev
# → http://localhost:3000
```

### Available Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `next dev` | Development server with turbopack |
| `build` | `next build` | Production build |
| `start` | `next start` | Production server |
| `lint` | `eslint` | Lint check |
| `db:generate` | `drizzle-kit generate` | Generate migration from schema |
| `db:migrate` | `drizzle-kit migrate` | Apply migrations |
| `db:studio` | `drizzle-kit studio` | Drizzle ORM GUI |

### Adding a New Page

1. Create route file in `app/(dashboard)/dashboard/<route>/page.tsx`
2. Use `"use client"` directive
3. Fetch data from API routes via `useEffect` + `fetch()`
4. Add navigation item to `components/app-sidebar.tsx`

### Adding a New API Route

1. Create route file in `app/(dashboard)/api/<name>/route.ts`
2. Use `NextRequest`/`NextResponse` from `next/server`
3. Read `TEST_WALLET_KEYPAIR` for server-side signing
4. Build Solana instructions manually with `TransactionInstruction`
5. Simulate before sending: `connection.simulateTransaction(tx)`
6. Persist to DB as non-fatal step

---

## 10. Design System

### Theme (Tailwind v4 + CSS Custom Properties)

```css
/* globals.css — dark theme only */
--color-background: #020617;        /* slate-950 */
--color-foreground: #f8fafc;        /* slate-50 */
--color-primary: #0369a1;           /* sky-700 */
--color-secondary: #0ea5e9;         /* sky-500 */
--color-solana-green: #14F195;
--color-solana-purple: #9945FF;
--color-dark-bg: #0F0F23;
--color-card-surface: #1A1A3E;
```

### Typography

- **Sans:** Inter (via `next/font/google`, CSS variable `--font-geist-sans`)
- **Mono:** JetBrains Mono (via `next/font/google`, CSS variable `--font-geist-mono`)

### Component Styling Pattern

All dashboard pages follow a consistent pattern:
- Cards: `border-slate-800 bg-slate-900/50`
- Inputs: `border-slate-700 bg-slate-800`
- Text: `text-white` for headings, `text-slate-400` for secondary, `text-slate-500` for muted
- Tables: `border-slate-800` rows, `hover:bg-slate-800/50`
- Tabs: `bg-slate-800 border-slate-700`, active state `data-[state=active]:bg-slate-700`

### shadcn/ui Configuration

- Style: `base-nova`
- Base color: `neutral`
- CSS variables: enabled
- Icon library: `lucide-react`

---

## 11. Transaction Signing Pattern

All on-chain operations use a **server-side keypair signer** pattern:

```typescript
// 1. Read keypair from env
const keypairBase64 = process.env.TEST_WALLET_KEYPAIR;
let secretKey: Uint8Array;
if (keypairBase64.startsWith("[")) {
  const numbers = JSON.parse(keypairBase64) as number[];
  secretKey = new Uint8Array(numbers);
} else {
  secretKey = Uint8Array.from(Buffer.from(keypairBase64, "base64"));
}
const payerKeypair = Keypair.fromSecretKey(secretKey);

// 2. Build instruction manually
const ix = new TransactionInstruction({
  programId: new PublicKey(SSTS_PROGRAM_ID),
  keys: [
    { pubkey: mintPubkey, isSigner: false, isWritable: false },
    { pubkey: vcPda, isSigner: false, isWritable: false },
    // ... more accounts
  ],
  data: instructionData,
});

// 3. Build, sign, simulate, send
const tx = new Transaction().add(ix);
tx.feePayer = payerKeypair.publicKey;
const { blockhash } = await connection.getLatestBlockhash();
tx.recentBlockhash = blockhash;
tx.sign(payerKeypair);

const simResult = await connection.simulateTransaction(tx);
if (simResult.value.err) { /* handle */ }

const signature = await connection.sendRawTransaction(tx.serialize(), {
  skipPreflight: false,
  preflightCommitment: "confirmed",
});
```

### Key Rules

1. **Always simulate** before sending — catches account ordering/flag errors
2. **Manual instruction building** — never rely on `canonicalIxToWeb3` for production transactions (it has known `isWritable` bugs)
3. **DB writes are non-fatal** — wrap in try/catch, log errors, never fail the main operation
4. **Idempotent VC creation** — check if VerificationConfig exists before creating

---

## 12. Troubleshooting

### Common Issues

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| Simulation fails with "account not writable" | `isWritable` flag incorrect on an account that needs writing | Check account roles in the instruction keys array |
| "VerificationProgramNotFound" | NOOP verifier not deployed or not in remaining accounts | Deploy `verification_policy_noop` to devnet; append verifier program ID as remaining account |
| "AccountAlreadyInitialized" | VerificationConfig already exists | Check before creating (idempotent pattern) |
| Token create fails with "immutable" error | Mint account not set as writable+signer | Ensure mint keypair is in keys with `isSigner: true, isWritable: true` |
| DB operations silently fail | `DATABASE_URL` not set or connection issue | Check `.env.local`; DB writes are non-fatal so errors are logged only |
| Wallet adapter shows "No wallets found" | No wallet adapters configured in provider | Install Phantom/Backpack browser extension |

### Devnet Program IDs

| Program | ID |
|---------|-----|
| SSTS Core | `SSTS8Qk2bW3aVaBEsY1Ras95YdbaaYQQx21JWHxvjap` |
| SSTS Transfer Hook | `HookXqLKgPaNrHBJ9Jui7oQZz93vMbtA88JjsLa8bmfL` |
| FAMP Policy | `99frBpGJFhSx1qMt64T8HSfZMLUiy5YhZVmnG7X4pk2K` |
| NOOP Verifier | `5gPMypQiHYVmx3jFJAGr72wrB7f1bgmud3mHtpHUGyLd` |
| Token-2022 | `TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb` |

### Debugging Transactions

1. Check simulation logs: `simResult.value.logs` shows program-by-program log output
2. Verify account flags: log `ix.keys.map(k => ({ pubkey, isSigner, isWritable }))`
3. Use Solana Explorer with the transaction signature
4. Check the API route's console output (server-side logs with `[api]` prefix)

---

## Appendix: Landing Page Sections

The marketing landing page at `/` consists of 11 sections:

| Section | Component | Description |
|---------|-----------|-------------|
| Navigation | `Navbar.tsx` | Sticky nav with links to sections |
| Hero | `HeroSection.tsx` | Headline, subtitle, CTA buttons |
| Problem | `ProblemSection.tsx` | The issuer implementation gap |
| Solution | `SolutionSection.tsx` | TokenForge's 4-layer solution |
| How It Works | `HowItWorksSection.tsx` | Step-by-step workflow |
| Architecture | `ArchitectureSection.tsx` | System architecture diagram |
| Stats | `StatsSection.tsx` | Key metrics and traction |
| Comparison | `ComparisonSection.tsx` | TokenForge vs alternatives |
| Roadmap | `RoadmapSection.tsx` | Development roadmap |
| CTA | `CTASection.tsx` | Call-to-action |
| Footer | `FooterSection.tsx` | Links and copyright |