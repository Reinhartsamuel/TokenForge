// ⚠️  REFERENCE IMPLEMENTATION — DO NOT USE IN PRODUCTION
//
// This program always returns Ok(()), approving every instruction regardless of
// holder identity or compliance status. It exists solely as a testable
// stand-in so that TokenForge developers can exercise the verification path
// without wiring up a real compliance provider.
//
// Compatible with canonical SSTS verification model (both CPI and introspection modes).
// Accepts raw SSTS instruction data (single-byte discriminator + args) as well as
// Anchor-derived verify_transfer calls.

use solana_program::account_info::AccountInfo;
use solana_program::declare_id;
use solana_program::entrypoint;
use solana_program::entrypoint::ProgramResult;
use solana_program::pubkey::Pubkey;

declare_id!("5gPMypQiHYVmx3jFJAGr72wrB7f1bgmud3mHtpHUGyLd");

entrypoint!(process_instruction);

pub fn process_instruction(
    _program_id: &Pubkey,
    _accounts: &[AccountInfo],
    _instruction_data: &[u8],
) -> ProgramResult {
    Ok(())
}
