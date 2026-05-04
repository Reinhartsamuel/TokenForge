use anchor_lang::prelude::*;
use anchor_spl::token_interface::{Mint, TokenAccount};

declare_id!("99frBpGJFhSx1qMt64T8HSfZMLUiy5YhZVmnG7X4pk2K");

pub const POLICY_SEED: &[u8] = b"famp_policy";
pub const MAX_LIST_SIZE: usize = 16;

pub const POLICY_ACCOUNT_SIZE: usize = 8 + std::mem::size_of::<PolicyAccount>();

#[program]
pub mod famp {
    use super::*;

    pub fn create_policy(ctx: Context<CreatePolicy>, allowlist_mode: bool) -> Result<()> {
        let policy = &mut ctx.accounts.policy;
        policy.mint = ctx.accounts.mint.key();
        policy.issuer_authority = ctx.accounts.issuer_authority.key();
        policy.allowlist_mode = allowlist_mode;
        policy.allowlist = [Pubkey::default(); MAX_LIST_SIZE];
        policy.blocklist = [Pubkey::default(); MAX_LIST_SIZE];
        policy.allowlist_count = 0;
        policy.blocklist_count = 0;
        policy.bump = ctx.bumps.policy;

        emit!(PolicyCreated {
            mint: policy.mint,
            issuer_authority: policy.issuer_authority,
            allowlist_mode,
        });

        Ok(())
    }

    pub fn add_to_allowlist(ctx: Context<UpdatePolicy>, wallet: Pubkey) -> Result<()> {
        let policy = &mut ctx.accounts.policy;
        require!(
            policy.allowlist_count < MAX_LIST_SIZE as u8,
            FampError::AllowlistFull
        );
        for i in 0..policy.allowlist_count as usize {
            require!(policy.allowlist[i] != wallet, FampError::AlreadyInAllowlist);
        }

        let idx = policy.allowlist_count as usize;
        policy.allowlist[idx] = wallet;
        policy.allowlist_count += 1;

        emit!(AllowlistUpdated {
            mint: policy.mint,
            wallet,
            action: ListAction::Added,
        });

        Ok(())
    }

    pub fn remove_from_allowlist(ctx: Context<UpdatePolicy>, wallet: Pubkey) -> Result<()> {
        let policy = &mut ctx.accounts.policy;
        let mut found = false;
        let count = policy.allowlist_count as usize;
        for i in 0..count {
            if policy.allowlist[i] == wallet {
                if i < count - 1 {
                    policy.allowlist[i] = policy.allowlist[count - 1];
                }
                policy.allowlist[count - 1] = Pubkey::default();
                policy.allowlist_count -= 1;
                found = true;
                break;
            }
        }
        require!(found, FampError::WalletNotFound);

        emit!(AllowlistUpdated {
            mint: policy.mint,
            wallet,
            action: ListAction::Removed,
        });

        emit!(WalletBlocked {
            mint: policy.mint,
            wallet,
        });

        Ok(())
    }

    pub fn add_to_blocklist(ctx: Context<UpdatePolicy>, wallet: Pubkey) -> Result<()> {
        let policy = &mut ctx.accounts.policy;
        require!(
            policy.blocklist_count < MAX_LIST_SIZE as u8,
            FampError::BlocklistFull
        );
        for i in 0..policy.blocklist_count as usize {
            require!(policy.blocklist[i] != wallet, FampError::AlreadyInBlocklist);
        }

        let idx = policy.blocklist_count as usize;
        policy.blocklist[idx] = wallet;
        policy.blocklist_count += 1;

        emit!(BlocklistUpdated {
            mint: policy.mint,
            wallet,
            action: ListAction::Added,
        });

        emit!(WalletBlocked {
            mint: policy.mint,
            wallet,
        });

        Ok(())
    }

    pub fn remove_from_blocklist(ctx: Context<UpdatePolicy>, wallet: Pubkey) -> Result<()> {
        let policy = &mut ctx.accounts.policy;
        let mut found = false;
        let count = policy.blocklist_count as usize;
        for i in 0..count {
            if policy.blocklist[i] == wallet {
                if i < count - 1 {
                    policy.blocklist[i] = policy.blocklist[count - 1];
                }
                policy.blocklist[count - 1] = Pubkey::default();
                policy.blocklist_count -= 1;
                found = true;
                break;
            }
        }
        require!(found, FampError::WalletNotFound);

        emit!(BlocklistUpdated {
            mint: policy.mint,
            wallet,
            action: ListAction::Removed,
        });

        emit!(WalletUnblocked {
            mint: policy.mint,
            wallet,
        });

        Ok(())
    }

    pub fn verify_transfer(ctx: Context<VerifyTransfer>) -> Result<()> {
        let policy = &ctx.accounts.policy;

        let from_owner = ctx.accounts.from_token_account.owner;
        let to_owner = ctx.accounts.to_token_account.owner;

        if policy.is_blocked(&from_owner) {
            return err!(FampError::WalletBlocked);
        }
        if policy.is_blocked(&to_owner) {
            return err!(FampError::WalletBlocked);
        }

        if policy.allowlist_mode {
            if !policy.is_allowed(&from_owner) {
                return err!(FampError::WalletNotAllowlisted);
            }
            if !policy.is_allowed(&to_owner) {
                return err!(FampError::WalletNotAllowlisted);
            }
        }

        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreatePolicy<'info> {
    #[account(mut)]
    pub issuer_authority: Signer<'info>,

    pub mint: InterfaceAccount<'info, Mint>,

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
pub struct VerifyTransfer<'info> {
    pub mint: InterfaceAccount<'info, Mint>,

    #[account(
        seeds = [POLICY_SEED, mint.key().as_ref()],
        bump = policy.bump,
        has_one = mint,
    )]
    pub policy: Account<'info, PolicyAccount>,

    pub from_token_account: InterfaceAccount<'info, TokenAccount>,
    pub to_token_account: InterfaceAccount<'info, TokenAccount>,
}

#[account]
pub struct PolicyAccount {
    pub mint: Pubkey,
    pub issuer_authority: Pubkey,
    pub allowlist_mode: bool,
    pub allowlist: [Pubkey; MAX_LIST_SIZE],
    pub blocklist: [Pubkey; MAX_LIST_SIZE],
    pub allowlist_count: u8,
    pub blocklist_count: u8,
    pub bump: u8,
}

impl PolicyAccount {
    pub fn is_blocked(&self, wallet: &Pubkey) -> bool {
        for i in 0..self.blocklist_count as usize {
            if self.blocklist[i] == *wallet {
                return true;
            }
        }
        false
    }

    pub fn is_allowed(&self, wallet: &Pubkey) -> bool {
        for i in 0..self.allowlist_count as usize {
            if self.allowlist[i] == *wallet {
                return true;
            }
        }
        false
    }
}

#[event]
pub struct PolicyCreated {
    pub mint: Pubkey,
    pub issuer_authority: Pubkey,
    pub allowlist_mode: bool,
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

#[event]
pub struct WalletBlocked {
    pub mint: Pubkey,
    pub wallet: Pubkey,
}

#[event]
pub struct WalletUnblocked {
    pub mint: Pubkey,
    pub wallet: Pubkey,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub enum ListAction {
    Added,
    Removed,
}

#[error_code]
pub enum FampError {
    #[msg("Signer is not the issuer authority for this policy")]
    Unauthorized,
    #[msg("Allowlist is full")]
    AllowlistFull,
    #[msg("Blocklist is full")]
    BlocklistFull,
    #[msg("Wallet already in allowlist")]
    AlreadyInAllowlist,
    #[msg("Wallet already in blocklist")]
    AlreadyInBlocklist,
    #[msg("Wallet not found in list")]
    WalletNotFound,
    #[msg("Wallet is blocked")]
    WalletBlocked,
    #[msg("Wallet is not on the allowlist")]
    WalletNotAllowlisted,
    #[msg("Invalid token account data")]
    InvalidTokenAccount,
}
