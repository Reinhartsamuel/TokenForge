import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { VerificationPolicyNoop } from "../target/types/verification_policy_noop";
import { assert } from "chai";

describe("verification_policy_noop", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace
    .VerificationPolicyNoop as Program<VerificationPolicyNoop>;

  // Dummy accounts — the no-op policy ignores all account data.
  const mint = anchor.web3.Keypair.generate();
  const from = anchor.web3.Keypair.generate();
  const to = anchor.web3.Keypair.generate();
  const authority = anchor.web3.Keypair.generate();

  it("verify_transfer always returns Ok (approves any transfer)", async () => {
    const tx = await program.methods
      .verifyTransfer(
        new anchor.BN(1_000_000), // amount: 1 token (6 decimals)
        6                          // decimals
      )
      .accounts({
        mint: mint.publicKey,
        from: from.publicKey,
        to: to.publicKey,
        authority: authority.publicKey,
      })
      .rpc();

    assert.ok(tx, "transaction should be confirmed");
    console.log("verify_transfer tx:", tx);
  });

  it("verify_transfer approves zero-amount transfers", async () => {
    const tx = await program.methods
      .verifyTransfer(new anchor.BN(0), 6)
      .accounts({
        mint: mint.publicKey,
        from: from.publicKey,
        to: to.publicKey,
        authority: authority.publicKey,
      })
      .rpc();

    assert.ok(tx);
  });

  it("verify_transfer approves maximum u64 amount", async () => {
    const tx = await program.methods
      .verifyTransfer(new anchor.BN("18446744073709551615"), 6)
      .accounts({
        mint: mint.publicKey,
        from: from.publicKey,
        to: to.publicKey,
        authority: authority.publicKey,
      })
      .rpc();

    assert.ok(tx);
  });
});
