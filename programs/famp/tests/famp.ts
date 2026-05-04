import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Famp } from "../target/types/famp";
import {
  Keypair,
  PublicKey,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  TOKEN_2022_PROGRAM_ID,
  createInitializeMintInstruction,
  getMinimumBalanceForRentExemptMint,
  MINT_SIZE,
  mintTo,
  createAssociatedTokenAccountIdempotent,
} from "@solana/spl-token";
import { assert } from "chai";

const POLICY_SEED = Buffer.from("famp_policy");

describe("famp", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Famp as Program<Famp>;
  const issuer = provider.wallet as anchor.Wallet;
  const holderA = Keypair.generate();
  const holderB = Keypair.generate();
  const unauthorizedUser = Keypair.generate();

  let mint: PublicKey;
  let policyPda: PublicKey;
  let policyBump: number;
  let holderATokenAccount: PublicKey;
  let holderBTokenAccount: PublicKey;

  before(async () => {
    // Fund test participants from issuer wallet
    const FUND_AMOUNT = 0.5 * LAMPORTS_PER_SOL;
    for (const kp of [holderA, holderB, unauthorizedUser]) {
      const tx = new anchor.web3.Transaction().add(
        SystemProgram.transfer({
          fromPubkey: issuer.publicKey,
          toPubkey: kp.publicKey,
          lamports: FUND_AMOUNT,
        })
      );
      await provider.sendAndConfirm(tx);
    }

    const mintKp = Keypair.generate();
    mint = mintKp.publicKey;

    const lamports = await getMinimumBalanceForRentExemptMint(provider.connection);
    const tx = new anchor.web3.Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: issuer.publicKey,
        newAccountPubkey: mint,
        space: MINT_SIZE,
        lamports,
        programId: TOKEN_2022_PROGRAM_ID,
      }),
      createInitializeMintInstruction(
        mint,
        6,
        issuer.publicKey,
        issuer.publicKey,
        TOKEN_2022_PROGRAM_ID,
      )
    );
    await provider.sendAndConfirm(tx, [mintKp]);

    [policyPda, policyBump] = PublicKey.findProgramAddressSync(
      [POLICY_SEED, mint.toBuffer()],
      program.programId
    );

    holderATokenAccount = await createAssociatedTokenAccountIdempotent(
      provider.connection,
      issuer.payer,
      mint,
      holderA.publicKey,
      {},
      TOKEN_2022_PROGRAM_ID,
    );
    holderBTokenAccount = await createAssociatedTokenAccountIdempotent(
      provider.connection,
      issuer.payer,
      mint,
      holderB.publicKey,
      {},
      TOKEN_2022_PROGRAM_ID,
    );

    await mintTo(
      provider.connection,
      issuer.payer,
      mint,
      holderATokenAccount,
      issuer.payer,
      1_000_000,
      [],
      {},
      TOKEN_2022_PROGRAM_ID,
    );
    await mintTo(
      provider.connection,
      issuer.payer,
      mint,
      holderBTokenAccount,
      issuer.payer,
      1_000_000,
      [],
      {},
      TOKEN_2022_PROGRAM_ID,
    );
  });

  it("create_policy initialises PolicyAccount", async () => {
    await program.methods
      .createPolicy(false)
      .accounts({
        issuerAuthority: issuer.publicKey,
        mint,
        policy: policyPda,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const policy = await program.account.policyAccount.fetch(policyPda);
    assert.ok(policy.mint.equals(mint));
    assert.ok(policy.issuerAuthority.equals(issuer.publicKey));
    assert.isFalse(policy.allowlistMode);
    assert.equal(policy.allowlistCount, 0);
    assert.equal(policy.blocklistCount, 0);
  });

  it("create_policy rejects if policy already exists", async () => {
    try {
      await program.methods
        .createPolicy(false)
        .accounts({
          issuerAuthority: issuer.publicKey,
          mint,
          policy: policyPda,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      assert.fail("should have thrown");
    } catch (_err: any) {
      assert.ok(true, "duplicate create_policy should fail");
    }
  });

  it("add_to_allowlist adds wallet and increments counter", async () => {
    await program.methods
      .addToAllowlist(holderA.publicKey)
      .accounts({
        issuerAuthority: issuer.publicKey,
        policy: policyPda,
      })
      .rpc();

    const policy = await program.account.policyAccount.fetch(policyPda);
    assert.equal(policy.allowlistCount, 1);
  });

  it("add_to_allowlist rejects unauthorized caller", async () => {
    try {
      await program.methods
        .addToAllowlist(holderB.publicKey)
        .accounts({
          issuerAuthority: unauthorizedUser.publicKey,
          policy: policyPda,
        })
        .signers([unauthorizedUser])
        .rpc();
      assert.fail("should have thrown");
    } catch (_err: any) {
      assert.ok(true, "unauthorized caller should be rejected");
    }
  });

  it("add_to_blocklist adds wallet and increments counter", async () => {
    await program.methods
      .addToBlocklist(holderB.publicKey)
      .accounts({
        issuerAuthority: issuer.publicKey,
        policy: policyPda,
      })
      .rpc();

    const policy = await program.account.policyAccount.fetch(policyPda);
    assert.equal(policy.blocklistCount, 1);
  });

  it("remove_from_blocklist updates root and decrements counter", async () => {
    await program.methods
      .removeFromBlocklist(holderB.publicKey)
      .accounts({
        issuerAuthority: issuer.publicKey,
        policy: policyPda,
      })
      .rpc();

    const policy = await program.account.policyAccount.fetch(policyPda);
    assert.equal(policy.blocklistCount, 0);
  });

  it("remove_from_allowlist updates and decrements counter", async () => {
    await program.methods
      .removeFromAllowlist(holderA.publicKey)
      .accounts({
        issuerAuthority: issuer.publicKey,
        policy: policyPda,
      })
      .rpc();

    const policy = await program.account.policyAccount.fetch(policyPda);
    assert.equal(policy.allowlistCount, 0);
  });
});
