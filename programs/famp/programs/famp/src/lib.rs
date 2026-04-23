use anchor_lang::prelude::*;
use anchor_spl::token_2022::{
    freeze_account, thaw_account as spl_thaw_account, FreezeAccount, ThawAccount, Token2022,
};
use anchor_spl::token_interface::{Mint, TokenAccount};

declare_id!("99frBpGJFhSx1qMt64T8HSfZMLUiy5YhZVmnG7X4pk2K");

// ─── Constants ───────────────────────────────────────────────────────────────

/// Seed prefix for the PolicyAccount PDA.
pub const POLICY_SEED: &[u8] = b"famp_policy";

/// Space for the PolicyAccount on-chain.
/// discriminator(8) + size_of::<PolicyAccount>()
pub const POLICY_ACCOUNT_SIZE: usize = 8 + std::mem::size_of::<PolicyAccount>();

// ─── Program ─────────────────────────────────────────────────────────────────

#[program]
pub mod famp {
    use super::*;

    /// Initialise a FAMP policy for a given SSTS token mint.
    ///
    /// - Creates a `PolicyAccount` PDA seeded by `[POLICY_SEED, mint]`.
    /// - The issuer must separately delegate freeze authority on the mint to
    ///   the FAMP program's PDA before calling this instruction (or use the
    ///   SSTS `create_token` instruction which does it automatically).
    /// - Both Merkle roots are initialised to `[0u8; 32]` (empty list).
    pub fn create_policy(ctx: Context<CreatePolicy>) -> Result<()> {
        let policy = &mut ctx.accounts.policy;
        policy.mint = ctx.accounts.mint.key();
        policy.issuer_authority = ctx.accounts.issuer_authority.key();
        policy.allowlist_merkle_root = [0u8; 32];
        policy.blocklist_merkle_root = [0u8; 32];
        policy.total_allowed = 0;
        policy.total_blocked = 0;
        policy.bump = ctx.bumps.policy;

        emit!(PolicyCreated {
            mint: policy.mint,
            issuer_authority: policy.issuer_authority,
        });

        Ok(())
    }

    /// Add a wallet to the allowlist by updating the stored Merkle root.
    ///
    /// The caller (SDK) must compute the new Merkle root off-chain after
    /// inserting `wallet` into the allowlist tree, then pass it here.
    /// The on-chain program stores only the root — proof computation is off-chain.
    ///
    /// Restricted to `issuer_authority`.
    pub fn add_to_allowlist(
        ctx: Context<UpdatePolicy>,
        wallet: Pubkey,
        new_allowlist_root: [u8; 32],
    ) -> Result<()> {
        let policy = &mut ctx.accounts.policy;
        policy.allowlist_merkle_root = new_allowlist_root;
        policy.total_allowed = policy.total_allowed.saturating_add(1);

        emit!(AllowlistUpdated {
            mint: policy.mint,
            wallet,
            action: ListAction::Added,
        });

        Ok(())
    }

    /// Remove a wallet from the allowlist and immediately freeze their token account.
    ///
    /// `new_allowlist_root` is the updated Merkle root after removal (computed off-chain).
    ///
    /// Restricted to `issuer_authority`.
    pub fn remove_from_allowlist(
        ctx: Context<RemoveFromAllowlist>,
        new_allowlist_root: [u8; 32],
    ) -> Result<()> {
        let mint_key;
        let bump;
        let wallet;
        {
            let policy = &mut ctx.accounts.policy;
            policy.allowlist_merkle_root = new_allowlist_root;
            policy.total_allowed = policy.total_allowed.saturating_sub(1);
            mint_key = policy.mint;
            bump = policy.bump;
            wallet = ctx.accounts.wallet.key();
        }

        let seeds = &[POLICY_SEED, mint_key.as_ref(), &[bump]];
        let signer_seeds = &[&seeds[..]];

        freeze_account(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                FreezeAccount {
                    account: ctx.accounts.token_account.to_account_info(),
                    mint: ctx.accounts.mint.to_account_info(),
                    authority: ctx.accounts.policy.to_account_info(),
                },
                signer_seeds,
            ),
        )?;

        emit!(AllowlistUpdated {
            mint: mint_key,
            wallet,
            action: ListAction::Removed,
        });

        Ok(())
    }

    /// Add a wallet to the blocklist and immediately freeze their token account.
    ///
    /// `new_blocklist_root` is the updated Merkle root after insertion (computed off-chain).
    ///
    /// Restricted to `issuer_authority`.
    pub fn add_to_blocklist(
        ctx: Context<AddToBlocklist>,
        new_blocklist_root: [u8; 32],
    ) -> Result<()> {
        let mint_key;
        let bump;
        let wallet;
        {
            let policy = &mut ctx.accounts.policy;
            policy.blocklist_merkle_root = new_blocklist_root;
            policy.total_blocked = policy.total_blocked.saturating_add(1);
            mint_key = policy.mint;
            bump = policy.bump;
            wallet = ctx.accounts.wallet.key();
        }

        let seeds = &[POLICY_SEED, mint_key.as_ref(), &[bump]];
        let signer_seeds = &[&seeds[..]];

        freeze_account(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                FreezeAccount {
                    account: ctx.accounts.token_account.to_account_info(),
                    mint: ctx.accounts.mint.to_account_info(),
                    authority: ctx.accounts.policy.to_account_info(),
                },
                signer_seeds,
            ),
        )?;

        emit!(BlocklistUpdated {
            mint: mint_key,
            wallet,
            action: ListAction::Added,
        });

        Ok(())
    }

    /// Remove a wallet from the blocklist.
    ///
    /// `new_blocklist_root` is the updated Merkle root after removal (computed off-chain).
    /// Does not automatically thaw — call `thaw_token_account` separately if needed.
    ///
    /// Restricted to `issuer_authority`.
    pub fn remove_from_blocklist(
        ctx: Context<RemoveFromBlocklist>,
        new_blocklist_root: [u8; 32],
    ) -> Result<()> {
        let mint_key;
        let wallet;
        {
            let policy = &mut ctx.accounts.policy;
            policy.blocklist_merkle_root = new_blocklist_root;
            policy.total_blocked = policy.total_blocked.saturating_sub(1);
            mint_key = policy.mint;
            wallet = ctx.accounts.wallet.key();
        }

        emit!(BlocklistUpdated {
            mint: mint_key,
            wallet,
            action: ListAction::Removed,
        });

        Ok(())
    }

    /// Unfreeze a token account for a wallet that has been re-admitted.
    ///
    /// Used when a previously blocked/removed wallet is cleared by the issuer.
    /// Restricted to `issuer_authority`.
    pub fn thaw_token_account(ctx: Context<ThawTokenAccount>) -> Result<()> {
        let mint_key = ctx.accounts.policy.mint;
        let bump = ctx.accounts.policy.bump;
        let seeds = &[POLICY_SEED, mint_key.as_ref(), &[bump]];
        let signer_seeds = &[&seeds[..]];

        spl_thaw_account(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                ThawAccount {
                    account: ctx.accounts.token_account.to_account_info(),
                    mint: ctx.accounts.mint.to_account_info(),
                    authority: ctx.accounts.policy.to_account_info(),
                },
                signer_seeds,
            ),
        )?;

        Ok(())
    }
}

// ─── Accounts ────────────────────────────────────────────────────────────────

#[derive(Accounts)]
pub struct CreatePolicy<'info> {
    #[account(mut)]
    pub issuer_authority: Signer<'info>,

    /// The SSTS Token-2022 mint this policy governs.
    pub mint: InterfaceAccount<'info, Mint>,

    /// PolicyAccount PDA — seeded by [POLICY_SEED, mint].
    #[account(
        init,
        payer = issuer_authority,
        space = POLICY_ACCOUNT_SIZE,
        seeds = [POLICY_SEED, mint.key().as_ref()],
        bump,
    )]
    pub policy: Account<'info, PolicyAccount>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdatePolicy<'info> {
    pub issuer_authority: Signer<'info>,

    #[account(
        mut,
        seeds = [POLICY_SEED, policy.mint.as_ref()],
        bump = policy.bump,
        has_one = issuer_authority,
    )]
    pub policy: Account<'info, PolicyAccount>,
}

#[derive(Accounts)]
pub struct RemoveFromAllowlist<'info> {
    pub issuer_authority: Signer<'info>,

    pub mint: InterfaceAccount<'info, Mint>,

    #[account(
        mut,
        seeds = [POLICY_SEED, mint.key().as_ref()],
        bump = policy.bump,
        has_one = issuer_authority,
        has_one = mint,
    )]
    pub policy: Account<'info, PolicyAccount>,

    /// The holder's token account to freeze.
    #[account(
        mut,
        token::mint = mint,
        token::authority = wallet,
    )]
    pub token_account: InterfaceAccount<'info, TokenAccount>,

    /// The wallet whose token account is being modified.
    pub wallet: SystemAccount<'info>,

    pub token_program: Program<'info, Token2022>,
}

#[derive(Accounts)]
pub struct AddToBlocklist<'info> {
    pub issuer_authority: Signer<'info>,

    pub mint: InterfaceAccount<'info, Mint>,

    #[account(
        mut,
        seeds = [POLICY_SEED, mint.key().as_ref()],
        bump = policy.bump,
        has_one = issuer_authority,
        has_one = mint,
    )]
    pub policy: Account<'info, PolicyAccount>,

    /// The holder's token account to freeze.
    #[account(
        mut,
        token::mint = mint,
        token::authority = wallet,
    )]
    pub token_account: InterfaceAccount<'info, TokenAccount>,

    /// The wallet whose token account is being modified.
    pub wallet: SystemAccount<'info>,

    pub token_program: Program<'info, Token2022>,
}

#[derive(Accounts)]
pub struct RemoveFromBlocklist<'info> {
    pub issuer_authority: Signer<'info>,

    pub mint: InterfaceAccount<'info, Mint>,

    #[account(
        mut,
        seeds = [POLICY_SEED, mint.key().as_ref()],
        bump = policy.bump,
        has_one = issuer_authority,
        has_one = mint,
    )]
    pub policy: Account<'info, PolicyAccount>,

    /// The wallet being removed from the blocklist.
    pub wallet: SystemAccount<'info>,
}

#[derive(Accounts)]
pub struct ThawTokenAccount<'info> {
    pub issuer_authority: Signer<'info>,

    pub mint: InterfaceAccount<'info, Mint>,

    #[account(
        seeds = [POLICY_SEED, mint.key().as_ref()],
        bump = policy.bump,
        has_one = issuer_authority,
        has_one = mint,
    )]
    pub policy: Account<'info, PolicyAccount>,

    /// The holder's token account to thaw.
    #[account(
        mut,
        token::mint = mint,
    )]
    pub token_account: InterfaceAccount<'info, TokenAccount>,

    pub token_program: Program<'info, Token2022>,
}

// ─── State ───────────────────────────────────────────────────────────────────

#[account]
pub struct PolicyAccount {
    /// The SSTS mint this policy governs.
    pub mint: Pubkey,
    /// Wallet that can update this policy (the token issuer).
    pub issuer_authority: Pubkey,
    /// Merkle root of the allowlist. [0u8;32] = empty (all blocked by default).
    pub allowlist_merkle_root: [u8; 32],
    /// Merkle root of the explicit blocklist.
    pub blocklist_merkle_root: [u8; 32],
    /// Running count of allowed wallets (informational).
    pub total_allowed: u64,
    /// Running count of blocked wallets (informational).
    pub total_blocked: u64,
    /// PDA bump for CPI signing.
    pub bump: u8,
}

// ─── Events ──────────────────────────────────────────────────────────────────

#[event]
pub struct PolicyCreated {
    pub mint: Pubkey,
    pub issuer_authority: Pubkey,
}

#[event]
pub struct AllowlistUpdated {
    pub mint: Pubkey,
    pub wallet: Pubkey,
    pub action: ListAction,
}

#[event]
pub struct BlocklistUpdated {
    pub mint: Pubkey,
    pub wallet: Pubkey,
    pub action: ListAction,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub enum ListAction {
    Added,
    Removed,
}

// ─── Errors ──────────────────────────────────────────────────────────────────

#[error_code]
pub enum FampError {
    #[msg("Signer is not the issuer authority for this policy")]
    Unauthorized,
    #[msg("Token account does not belong to the expected mint")]
    MintMismatch,
}
