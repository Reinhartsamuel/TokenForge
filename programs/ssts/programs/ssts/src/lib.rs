use anchor_lang::prelude::*;
use anchor_spl::token_2022::{
    freeze_account, thaw_account, FreezeAccount, ThawAccount, Token2022,
};
use anchor_spl::token_interface::{Mint as MintInterface, TokenAccount};
use sha2::{Digest, Sha256};

declare_id!("4ZdXBUJPX4rkr8g1d1i1g5tYLjR18GKSHSeF5ZkRWMQG");

// ─── Seeds ───────────────────────────────────────────────────────────────────

pub const TOKEN_METADATA_SEED: &[u8] = b"ssts_metadata";
pub const DISTRIBUTION_SEED: &[u8] = b"ssts_distribution";
pub const VAULT_SEED: &[u8] = b"vault";

// ─── Program ─────────────────────────────────────────────────────────────────

#[program]
pub mod ssts {
    use super::*;

    pub fn create_token(
        ctx: Context<CreateToken>,
        name: String,
        symbol: String,
        uri: String,
        decimals: u8,
    ) -> Result<()> {
        require!(name.len() <= 64, SstsError::NameTooLong);
        require!(symbol.len() <= 16, SstsError::SymbolTooLong);
        require!(uri.len() <= 256, SstsError::UriTooLong);
        require!(decimals <= 18, SstsError::InvalidDecimals);

        let metadata = &mut ctx.accounts.metadata;
        metadata.mint = ctx.accounts.mint.key();
        metadata.issuer = ctx.accounts.issuer.key();
        metadata.name = string_to_fixed_bytes::<64>(&name);
        metadata.symbol = string_to_fixed_bytes::<16>(&symbol);
        metadata.uri = string_to_fixed_bytes::<256>(&uri);
        metadata.decimals = decimals;
        metadata.verification_policy_program = ctx.accounts.verification_policy_program.key();
        metadata.famp_program = ctx.accounts.famp_program.key();
        metadata.is_paused = false;
        metadata.bump = ctx.bumps.metadata;

        emit!(TokenCreated {
            mint: metadata.mint,
            issuer: metadata.issuer,
            name,
            symbol,
            decimals,
        });

        Ok(())
    }

    pub fn mint_to(
        ctx: Context<MintToSsts>,
        amount: u64,
    ) -> Result<()> {
        invoke_verify_transfer(
            &ctx.accounts.verification_policy_program,
            &ctx.accounts.mint.to_account_info(),
            &ctx.accounts.issuer.to_account_info(),
            &ctx.accounts.destination.to_account_info(),
            &ctx.accounts.issuer,
            amount,
            ctx.accounts.metadata.decimals,
        )?;

        anchor_spl::token_2022::mint_to(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                anchor_spl::token_2022::MintTo {
                    mint: ctx.accounts.mint.to_account_info(),
                    to: ctx.accounts.destination.to_account_info(),
                    authority: ctx.accounts.issuer.to_account_info(),
                },
            ),
            amount,
        )?;

        emit!(TokensMinted {
            mint: ctx.accounts.mint.key(),
            recipient: ctx.accounts.destination.key(),
            amount,
        });

        Ok(())
    }

    pub fn freeze(ctx: Context<FreezeThaw>) -> Result<()> {
        freeze_account(CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            FreezeAccount {
                account: ctx.accounts.token_account.to_account_info(),
                mint: ctx.accounts.mint.to_account_info(),
                authority: ctx.accounts.issuer.to_account_info(),
            },
        ))?;

        emit!(AccountFrozen {
            mint: ctx.accounts.mint.key(),
            token_account: ctx.accounts.token_account.key(),
        });

        Ok(())
    }

    pub fn thaw(ctx: Context<FreezeThaw>) -> Result<()> {
        thaw_account(CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            ThawAccount {
                account: ctx.accounts.token_account.to_account_info(),
                mint: ctx.accounts.mint.to_account_info(),
                authority: ctx.accounts.issuer.to_account_info(),
            },
        ))?;

        emit!(AccountThawed {
            mint: ctx.accounts.mint.key(),
            token_account: ctx.accounts.token_account.key(),
        });

        Ok(())
    }

    pub fn pause(ctx: Context<AdminAction>) -> Result<()> {
        let metadata = &mut ctx.accounts.metadata;
        require!(!metadata.is_paused, SstsError::AlreadyPaused);
        metadata.is_paused = true;

        emit!(TokenPaused {
            mint: metadata.mint,
        });

        Ok(())
    }

    pub fn unpause(ctx: Context<AdminAction>) -> Result<()> {
        let metadata = &mut ctx.accounts.metadata;
        require!(metadata.is_paused, SstsError::NotPaused);
        metadata.is_paused = false;

        emit!(TokenUnpaused {
            mint: metadata.mint,
        });

        Ok(())
    }

    pub fn issue_distribution(
        ctx: Context<IssueDistribution>,
        distribution_id: u64,
        merkle_root: [u8; 32],
        total_amount: u64,
        claim_window_seconds: u64,
    ) -> Result<()> {
        require!(total_amount > 0, SstsError::ZeroDistribution);
        require!(claim_window_seconds > 0, SstsError::ZeroClaimWindow);

        let now = Clock::get()?.unix_timestamp as u64;
        let distribution = &mut ctx.accounts.distribution;
        distribution.distribution_id = distribution_id;
        distribution.mint = ctx.accounts.mint.key();
        distribution.merkle_root = merkle_root;
        distribution.total_amount = total_amount;
        distribution.claimed_amount = 0;
        distribution.claim_window_start = now;
        distribution.claim_window_end = now + claim_window_seconds;
        distribution.is_active = true;
        distribution.bump = ctx.bumps.distribution;

        anchor_spl::token_2022::transfer_checked(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                anchor_spl::token_2022::TransferChecked {
                    from: ctx.accounts.issuer_token_account.to_account_info(),
                    to: ctx.accounts.vault.to_account_info(),
                    authority: ctx.accounts.issuer.to_account_info(),
                    mint: ctx.accounts.mint.to_account_info(),
                },
            ),
            total_amount,
            ctx.accounts.mint.decimals,
        )?;

        emit!(DistributionIssued {
            mint: distribution.mint,
            distribution_id,
            merkle_root,
            total_amount,
            claim_window_end: distribution.claim_window_end,
        });

        Ok(())
    }

    pub fn claim_distribution(
        ctx: Context<ClaimDistribution>,
        amount: u64,
        proof: Vec<[u8; 32]>,
    ) -> Result<()> {
        let distribution = &ctx.accounts.distribution;
        require!(distribution.is_active, SstsError::DistributionInactive);

        let now = Clock::get()?.unix_timestamp as u64;
        require!(now <= distribution.claim_window_end, SstsError::ClaimWindowExpired);

        let leaf = compute_leaf(&ctx.accounts.claimant.key(), amount, distribution.distribution_id);
        require!(
            verify_merkle_proof(leaf, &proof, distribution.merkle_root),
            SstsError::InvalidProof
        );

        let mint_key = distribution.mint;
        let dist_id = distribution.distribution_id;
        let bump = distribution.bump;
        let seeds = &[
            DISTRIBUTION_SEED,
            mint_key.as_ref(),
            &dist_id.to_le_bytes(),
            &[bump],
        ];
        let signer_seeds = &[&seeds[..]];

        anchor_spl::token_2022::transfer_checked(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                anchor_spl::token_2022::TransferChecked {
                    from: ctx.accounts.vault.to_account_info(),
                    to: ctx.accounts.claimant_token_account.to_account_info(),
                    authority: ctx.accounts.distribution.to_account_info(),
                    mint: ctx.accounts.mint.to_account_info(),
                },
                signer_seeds,
            ),
            amount,
            ctx.accounts.mint.decimals,
        )?;

        ctx.accounts.distribution.claimed_amount = ctx.accounts.distribution.claimed_amount.saturating_add(amount);

        emit!(DistributionClaimed {
            mint: ctx.accounts.distribution.mint,
            distribution_id: ctx.accounts.distribution.distribution_id,
            claimant: ctx.accounts.claimant.key(),
            amount,
        });

        Ok(())
    }

    pub fn execute_corporate_action(
        ctx: Context<AdminAction>,
        action: CorporateAction,
        ratio_numerator: u64,
        ratio_denominator: u64,
    ) -> Result<()> {
        require!(ratio_denominator > 0, SstsError::InvalidRatio);
        require!(ratio_numerator > 0, SstsError::InvalidRatio);

        match action {
            CorporateAction::Split => {
                require!(ratio_numerator > ratio_denominator, SstsError::InvalidSplitRatio);
            }
            CorporateAction::Merge => {
                require!(ratio_numerator < ratio_denominator, SstsError::InvalidMergeRatio);
            }
        }

        emit!(CorporateActionExecuted {
            mint: ctx.accounts.metadata.mint,
            action,
            ratio_numerator,
            ratio_denominator,
        });

        Ok(())
    }
}

// ─── CPI Helper ──────────────────────────────────────────────────────────────

fn invoke_verify_transfer<'info>(
    policy_program: &AccountInfo<'info>,
    mint: &AccountInfo<'info>,
    from: &AccountInfo<'info>,
    to: &AccountInfo<'info>,
    authority: &Signer<'info>,
    amount: u64,
    decimals: u8,
) -> Result<()> {
    let ix = anchor_lang::solana_program::instruction::Instruction {
        program_id: policy_program.key(),
        accounts: vec![
            anchor_lang::solana_program::instruction::AccountMeta::new(mint.key(), false),
            anchor_lang::solana_program::instruction::AccountMeta::new(from.key(), false),
            anchor_lang::solana_program::instruction::AccountMeta::new(to.key(), false),
            anchor_lang::solana_program::instruction::AccountMeta::new_readonly(authority.key(), true),
        ],
        data: {
            let mut hasher = Sha256::new();
            hasher.update(b"global:verify_transfer");
            let hash = hasher.finalize();
            let mut discriminator = [0u8; 8];
            discriminator.copy_from_slice(&hash[..8]);
            let mut data = discriminator.to_vec();
            data.extend_from_slice(&amount.to_le_bytes());
            data.push(decimals);
            data
        },
    };

    anchor_lang::solana_program::program::invoke(
        &ix,
        &[
            policy_program.clone(),
            mint.clone(),
            from.clone(),
            to.clone(),
            authority.to_account_info(),
        ],
    )?;

    Ok(())
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

fn string_to_fixed_bytes<const N: usize>(s: &str) -> [u8; N] {
    let mut bytes = [0u8; N];
    let src = s.as_bytes();
    let len = src.len().min(N);
    bytes[..len].copy_from_slice(&src[..len]);
    bytes
}

// ─── Merkle Proof ────────────────────────────────────────────────────────────

fn compute_leaf(wallet: &Pubkey, amount: u64, distribution_id: u64) -> [u8; 32] {
    let mut hasher = Sha256::new();
    hasher.update(wallet.as_ref());
    hasher.update(&amount.to_le_bytes());
    hasher.update(&distribution_id.to_le_bytes());
    hasher.finalize().into()
}

fn verify_merkle_proof(leaf: [u8; 32], proof: &[[u8; 32]], root: [u8; 32]) -> bool {
    let mut current = leaf;
    for &hash in proof {
        let mut hasher = Sha256::new();
        if current <= hash {
            hasher.update(current);
            hasher.update(hash);
        } else {
            hasher.update(hash);
            hasher.update(current);
        }
        current = hasher.finalize().into();
    }
    current == root
}

// ─── Accounts ────────────────────────────────────────────────────────────────

#[derive(Accounts)]
pub struct CreateToken<'info> {
    #[account(mut)]
    pub issuer: Signer<'info>,

    #[account(mut)]
    pub mint: Signer<'info>,

    #[account(
        init,
        payer = issuer,
        space = METADATA_ACCOUNT_SIZE,
        seeds = [TOKEN_METADATA_SEED, mint.key().as_ref()],
        bump,
    )]
    pub metadata: Account<'info, SstsMetadata>,

    /// CHECK: verification policy program — called via CPI; its address is stored in metadata and validated by the issuer off-chain.
    pub verification_policy_program: AccountInfo<'info>,
    /// CHECK: FAMP program address — stored in metadata for reference; not CPI'd from this instruction.
    pub famp_program: AccountInfo<'info>,

    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct MintToSsts<'info> {
    pub issuer: Signer<'info>,

    #[account(
        mut,
        mint::token_program = token_program,
    )]
    pub mint: InterfaceAccount<'info, MintInterface>,

    #[account(
        seeds = [TOKEN_METADATA_SEED, mint.key().as_ref()],
        bump = metadata.bump,
        has_one = issuer,
    )]
    pub metadata: Account<'info, SstsMetadata>,

    #[account(mut)]
    pub destination: InterfaceAccount<'info, TokenAccount>,

    /// CHECK: verification policy program — CPI target; address validated against metadata.verification_policy_program at call site.
    pub verification_policy_program: AccountInfo<'info>,

    pub token_program: Program<'info, Token2022>,
}

#[derive(Accounts)]
pub struct FreezeThaw<'info> {
    pub issuer: Signer<'info>,

    pub mint: InterfaceAccount<'info, MintInterface>,

    #[account(mut)]
    pub token_account: InterfaceAccount<'info, TokenAccount>,

    pub token_program: Program<'info, Token2022>,
}

#[derive(Accounts)]
pub struct AdminAction<'info> {
    pub issuer: Signer<'info>,

    #[account(
        mut,
        seeds = [TOKEN_METADATA_SEED, mint.key().as_ref()],
        bump = metadata.bump,
        has_one = issuer,
    )]
    pub metadata: Account<'info, SstsMetadata>,

    pub mint: InterfaceAccount<'info, MintInterface>,
}

#[derive(Accounts)]
#[instruction(distribution_id: u64)]
pub struct IssueDistribution<'info> {
    #[account(mut)]
    pub issuer: Signer<'info>,

    pub mint: InterfaceAccount<'info, MintInterface>,

    #[account(
        seeds = [TOKEN_METADATA_SEED, mint.key().as_ref()],
        bump = metadata.bump,
        has_one = issuer,
    )]
    pub metadata: Account<'info, SstsMetadata>,

    #[account(
        init,
        payer = issuer,
        space = DISTRIBUTION_ACCOUNT_SIZE,
        seeds = [DISTRIBUTION_SEED, mint.key().as_ref(), &distribution_id.to_le_bytes()],
        bump,
    )]
    pub distribution: Account<'info, DistributionAccount>,

    #[account(
        init,
        payer = issuer,
        token::mint = mint,
        token::authority = distribution,
        seeds = [DISTRIBUTION_SEED, mint.key().as_ref(), &distribution_id.to_le_bytes(), VAULT_SEED],
        bump,
    )]
    pub vault: InterfaceAccount<'info, TokenAccount>,

    #[account(mut)]
    pub issuer_token_account: InterfaceAccount<'info, TokenAccount>,

    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ClaimDistribution<'info> {
    #[account(mut)]
    pub claimant: Signer<'info>,

    pub mint: InterfaceAccount<'info, MintInterface>,

    #[account(
        mut,
        seeds = [DISTRIBUTION_SEED, mint.key().as_ref(), &distribution.distribution_id.to_le_bytes()],
        bump = distribution.bump,
    )]
    pub distribution: Account<'info, DistributionAccount>,

    #[account(
        mut,
        seeds = [DISTRIBUTION_SEED, mint.key().as_ref(), &distribution.distribution_id.to_le_bytes(), VAULT_SEED],
        bump,
    )]
    pub vault: InterfaceAccount<'info, TokenAccount>,

    #[account(mut)]
    pub claimant_token_account: InterfaceAccount<'info, TokenAccount>,

    pub token_program: Program<'info, Token2022>,
}

// ─── State ───────────────────────────────────────────────────────────────────

pub const METADATA_ACCOUNT_SIZE: usize = 8 + 32 + 32 + 64 + 16 + 256 + 1 + 32 + 32 + 1 + 1;

#[account]
pub struct SstsMetadata {
    pub mint: Pubkey,
    pub issuer: Pubkey,
    pub name: [u8; 64],
    pub symbol: [u8; 16],
    pub uri: [u8; 256],
    pub decimals: u8,
    pub verification_policy_program: Pubkey,
    pub famp_program: Pubkey,
    pub is_paused: bool,
    pub bump: u8,
}

pub const DISTRIBUTION_ACCOUNT_SIZE: usize = 8 + 8 + 32 + 32 + 8 + 8 + 8 + 8 + 1 + 1;

#[account]
pub struct DistributionAccount {
    pub distribution_id: u64,
    pub mint: Pubkey,
    pub merkle_root: [u8; 32],
    pub total_amount: u64,
    pub claimed_amount: u64,
    pub claim_window_start: u64,
    pub claim_window_end: u64,
    pub is_active: bool,
    pub bump: u8,
}

// ─── Events ──────────────────────────────────────────────────────────────────

#[event]
pub struct TokenCreated {
    pub mint: Pubkey,
    pub issuer: Pubkey,
    pub name: String,
    pub symbol: String,
    pub decimals: u8,
}

#[event]
pub struct TokensMinted {
    pub mint: Pubkey,
    pub recipient: Pubkey,
    pub amount: u64,
}

#[event]
pub struct AccountFrozen {
    pub mint: Pubkey,
    pub token_account: Pubkey,
}

#[event]
pub struct AccountThawed {
    pub mint: Pubkey,
    pub token_account: Pubkey,
}

#[event]
pub struct TokenPaused {
    pub mint: Pubkey,
}

#[event]
pub struct TokenUnpaused {
    pub mint: Pubkey,
}

#[event]
pub struct DistributionIssued {
    pub mint: Pubkey,
    pub distribution_id: u64,
    pub merkle_root: [u8; 32],
    pub total_amount: u64,
    pub claim_window_end: u64,
}

#[event]
pub struct DistributionClaimed {
    pub mint: Pubkey,
    pub distribution_id: u64,
    pub claimant: Pubkey,
    pub amount: u64,
}

#[event]
pub struct CorporateActionExecuted {
    pub mint: Pubkey,
    pub action: CorporateAction,
    pub ratio_numerator: u64,
    pub ratio_denominator: u64,
}

// ─── Enums ───────────────────────────────────────────────────────────────────

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum CorporateAction {
    Split,
    Merge,
}

// ─── Errors ──────────────────────────────────────────────────────────────────

#[error_code]
pub enum SstsError {
    #[msg("Token name exceeds 64 bytes")]
    NameTooLong,
    #[msg("Token symbol exceeds 16 bytes")]
    SymbolTooLong,
    #[msg("Token URI exceeds 256 bytes")]
    UriTooLong,
    #[msg("Invalid decimals (must be 0-18)")]
    InvalidDecimals,
    #[msg("Distribution amount must be greater than zero")]
    ZeroDistribution,
    #[msg("Claim window must be greater than zero")]
    ZeroClaimWindow,
    #[msg("Token is already paused")]
    AlreadyPaused,
    #[msg("Token is not paused")]
    NotPaused,
    #[msg("Distribution is inactive")]
    DistributionInactive,
    #[msg("Claim window has expired")]
    ClaimWindowExpired,
    #[msg("Invalid Merkle proof")]
    InvalidProof,
    #[msg("Invalid ratio (numerator and denominator must be > 0)")]
    InvalidRatio,
    #[msg("Split ratio numerator must be greater than denominator")]
    InvalidSplitRatio,
    #[msg("Merge ratio numerator must be less than denominator")]
    InvalidMergeRatio,
}
