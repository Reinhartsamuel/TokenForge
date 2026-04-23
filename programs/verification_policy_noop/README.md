# verification_policy_noop

> **⚠️ REFERENCE / TESTING IMPLEMENTATION ONLY — NEVER USE IN PRODUCTION**
>
> This program approves every transfer unconditionally. Deploying it as a
> verification policy on a real SSTS token would bypass all KYC/AML checks
> and make the token non-compliant. Use it on devnet only.

## What This Is

A minimal Anchor program that implements the **TokenForge verification policy
interface** — the CPI target that the SSTS program calls before every mint
and transfer to check whether the sender/receiver is permitted to hold the
token.

This implementation is a **no-op**: it accepts the call and immediately
returns `Ok(())`, approving every transfer regardless of who the parties are.
Its purpose is:

1. **SSTS program development** — let developers build and test the SSTS
   program's CPI path without wiring up a real KYC oracle.
2. **SDK integration tests** — end-to-end tests in `@tokenforge/sdk` can
   deploy this program on a local validator and confirm that the full mint
   → transfer → hook → verify pipeline works.
3. **Interface documentation** — the source code is the canonical reference
   for the instruction name, argument layout, account layout, and Anchor
   discriminator that all real verification policy programs must implement.

## The Interface

Any production verification policy program must implement a single
instruction named **`verify_transfer`** with this exact signature:

```rust
pub fn verify_transfer(
    ctx: Context<VerifyTransfer>,
    amount: u64,
    decimals: u8,
) -> Result<()>

#[derive(Accounts)]
pub struct VerifyTransfer<'info> {
    pub mint: UncheckedAccount<'info>,      // SSTS token mint
    pub from: UncheckedAccount<'info>,      // source token account / issuer
    pub to: UncheckedAccount<'info>,        // destination token account
    pub authority: UncheckedAccount<'info>, // transaction signer
}
```

The instruction name determines the 8-byte Anchor discriminator that the
SSTS program uses when building the CPI instruction. If your program uses a
different name, the CPI will fail with a discriminator mismatch.

You may add additional accounts (e.g., a `PolicyAccount` PDA) as long as the
first four accounts match the order above — the SSTS program passes them
positionally.

## Program ID (Devnet)

```
5gPMypQiHYVmx3jFJAGr72wrB7f1bgmud3mHtpHUGyLd
```

## Building

```bash
# From this directory:
export PATH="$HOME/.local/share/solana/install/active_release/bin:$HOME/.cargo/bin:$HOME/.avm/bin:$PATH"
anchor build
```

Requires:
- Anchor CLI 0.31.1 (`avm use 0.31.1`)
- Solana CLI ≥ 3.1.x (platform-tools v1.52, Rust 1.89 — needed for the
  `anchor-lang` 0.31.1 transitive dep tree)

## Testing

Tests run against a local validator spun up automatically by Anchor:

```bash
yarn install          # first time only
anchor test
```

Expected output:

```
  verification_policy_noop
    ✔ verify_transfer always returns Ok (approves any transfer)
    ✔ verify_transfer approves zero-amount transfers
    ✔ verify_transfer approves maximum u64 amount

  3 passing
```

## Deploying to Devnet

```bash
# 1. Make sure your deployer wallet has devnet SOL (~1.3 SOL needed):
solana airdrop 2 --url devnet

# 2. Set cluster to devnet in Anchor.toml (change Localnet → devnet),
#    then deploy:
anchor deploy --provider.cluster devnet

# 3. Verify the on-chain program ID matches:
solana program show 5gPMypQiHYVmx3jFJAGr72wrB7f1bgmud3mHtpHUGyLd --url devnet
```

## What to Build Instead (Production)

A production verification policy program should:

1. Maintain a `PolicyAccount` PDA (seeded by the SSTS mint address) that
   stores a Merkle root of all approved holder wallets.
2. In `verify_transfer`, derive the expected `PolicyAccount` PDA from
   `ctx.accounts.mint.key()`, load it, and verify that both `from` and `to`
   appear in the allowlist (using a Merkle proof passed as remaining accounts
   or instruction data).
3. Return `Err(VerificationError::NotAllowed)` if either party fails the
   check — the SSTS transfer hook will propagate this as a transaction error.

See the TokenForge SSTS program source for the exact CPI invocation pattern.
