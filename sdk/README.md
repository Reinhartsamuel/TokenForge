# @tokenforge/sdk

> Workflow SDK for the Solana Security Token Standard (SSTS)

TokenForge SDK wraps the canonical SSTS client with ergonomic, issuer-focused APIs.

## Architecture

```
L0 — Canonical Client (generated from SSTS IDL)
  ↳ Instruction builders, account types, error codes
L1 — TokenForge Adapters
  ↳ PDA derivation, error enrichment, transaction composition
L2 — Workflow APIs
  ↳ Token lifecycle, distribution, FAMP policy management
```

## Installation

```bash
npm install @tokenforge/sdk
```

## Quick Start

### Create a security token

```typescript
import { createSecurityToken, createKeypairFromBytes } from '@tokenforge/sdk';
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

console.log('Token created:', result.addresses.mint);
console.log('TX:', result.signatures[0]);
```

### Configure FAMP allowlist

```typescript
import {
  createFampPolicy,
  addToAllowlist,
  freezeAccount,
} from '@tokenforge/sdk';

// Create policy
await createFampPolicy(rpc, issuer, mint.address, {
  allowlistMode: true, // Only allowlisted wallets can hold tokens
});

// Add wallet to allowlist
await addToAllowlist(rpc, issuer, mint.address, holderWallet);

// Remove from allowlist → auto-emits WalletBlocked event
// SDK or dashboard should listen and call freezeAccount()
const result = await removeFromAllowlist(rpc, issuer, mint.address, holderWallet);
if (result.data?.event === 'WalletBlocked') {
  await freezeAccount(rpc, issuer, mint.address, {
    tokenAccount: holderTokenAccount,
  });
}
```

### Mint & Transfer

```typescript
import { mintTokens, transferTokens } from '@tokenforge/sdk';

await mintTokens(rpc, issuer, mint.address, {
  amount: 1_000_000n, // raw units (6 decimals = 1.0 tokens)
  destination: holderTokenAccount,
});

await transferTokens(rpc, holder, mint.address, {
  amount: 500_000n,
  from: holderTokenAccount,
  to: recipientTokenAccount,
});
```

### Distributions

```typescript
import { createDistribution, claimDistribution } from '@tokenforge/sdk';

// Issuer creates distribution
await createDistribution(rpc, issuer, mint.address, {
  merkleRoot: new Uint8Array(32), // 32-byte Merkle root
  totalAmount: 10_000_000n,
  escrowTokenAccount: escrowTA,
});

// Holder claims
await claimDistribution(rpc, claimant, mint.address, {
  claimantTokenAccount: claimantTA,
  amount: 1_000_000n,
  proof: [proofElement1, proofElement2], // Merkle proof elements
});
```

## Compatibility

| SDK Version | Canonical SSTS Commit | Program ID |
|---|---|---|
| 0.1.0 | `1ab607e` | `SSTS8Qk2bW3aVaBEsY1Ras95YdbaaYQQx21JWHxvjap` |

## API Reference

### L2 Workflows

| Function | Description |
|---|---|
| `createSecurityToken` | Initialize mint with all SSTS extensions + verification config |
| `configureVerification` | Register/update verification programs per instruction |
| `mintTokens` | Mint tokens (gated by verification) |
| `transferTokens` | Transfer tokens (gated by verification) |
| `pauseToken` / `resumeToken` | Pause/resume all token operations |
| `freezeAccount` / `thawAccount` | Freeze/thaw individual token accounts |
| `createDistribution` | Create Merkle-based distribution escrow |
| `claimDistribution` | Claim tokens from distribution with Merkle proof |
| `executeSplit` | Execute token split corporate action |
| `executeConvert` | Execute token conversion corporate action |
| `createFampPolicy` | Create FAMP allowlist/blocklist policy |
| `addToAllowlist` / `removeFromAllowlist` | Manage allowlist |
| `addToBlocklist` / `removeFromBlocklist` | Manage blocklist |

### L1 Utilities

| Function | Description |
|---|---|
| `deriveVerificationConfigPda` | Derive VerificationConfig PDA for mint + instruction |
| `deriveMintAuthorityPda` | Derive MintAuthority PDA |
| `deriveFampPolicyPda` | Derive FAMP PolicyAccount PDA |
| `deriveProofAccountPda` | Derive ProofAccount PDA for distribution claims |
| `deriveRateAccountPda` | Derive RateAccount PDA for splits/conversions |
| `sendSstsTransaction` | Send transaction with error enrichment |
| `buildTransaction` | Build versioned transaction from instructions |
| `enrichError` | Parse raw error into TokenForgeError with SSTS context |

## License

Apache-2.0
