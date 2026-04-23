use anchor_lang::prelude::*;

// ⚠️  REFERENCE IMPLEMENTATION — DO NOT USE IN PRODUCTION
// This program always returns Ok(()), approving every transfer regardless of
// holder identity or compliance status. It exists solely as a testable
// stand-in so that SSTS program developers can exercise the CPI path
// without wiring up a real KYC provider.
//
// The SSTS program CPIs into the verification policy program with the
// `verify_transfer` instruction. Any production verification policy program
// must implement the same discriminator and account layout below, then
// replace the no-op body with real compliance logic.

declare_id!("5gPMypQiHYVmx3jFJAGr72wrB7f1bgmud3mHtpHUGyLd");

/// Discriminator seed used by the SSTS program when building the CPI instruction.
/// Production verification policy programs MUST use the same instruction name
/// so Anchor derives the same 8-byte discriminator.
pub const VERIFY_TRANSFER_DISCRIMINATOR: &str = "verify_transfer";

#[program]
pub mod verification_policy_noop {
    use super::*;

    /// Called by the SSTS program (via CPI) before every mint or transfer.
    ///
    /// Arguments:
    ///   `amount`     — number of raw token units being transferred
    ///   `decimals`   — token decimals (for human-readable amount derivation)
    ///
    /// Accounts (must match what SSTS passes in the CPI):
    ///   `mint`       — the SSTS token mint
    ///   `from`       — source token account (or issuer_authority for mint_to)
    ///   `to`         — destination token account
    ///   `authority`  — transaction signer / owner of `from`
    ///
    /// Returns Ok(()) unconditionally — this is the no-op policy.
    /// A real policy would query an on-chain allowlist, a Merkle proof,
    /// or an oracle before deciding to approve or reject.
    pub fn verify_transfer(
        _ctx: Context<VerifyTransfer>,
        _amount: u64,
        _decimals: u8,
    ) -> Result<()> {
        Ok(())
    }
}

/// Account context for `verify_transfer`.
///
/// Production implementations should add whatever constraint accounts they need
/// (e.g., a PolicyAccount PDA checked against an allowlist Merkle root).
/// This no-op version accepts but does not validate any of these accounts,
/// so the layout here is the minimal interface the SSTS program expects.
#[derive(Accounts)]
pub struct VerifyTransfer<'info> {
    /// The SSTS token mint being transferred.
    /// CHECK: the SSTS program has already validated this; the policy program
    /// may inspect mint.key() to look up its own policy PDA.
    pub mint: UncheckedAccount<'info>,

    /// Source token account (or the issuer_authority pubkey for mint_to).
    /// CHECK: identity check is the policy program's responsibility.
    pub from: UncheckedAccount<'info>,

    /// Destination token account.
    /// CHECK: identity check is the policy program's responsibility.
    pub to: UncheckedAccount<'info>,

    /// The wallet signing the transfer / mint.
    /// CHECK: identity check is the policy program's responsibility.
    pub authority: UncheckedAccount<'info>,
}
