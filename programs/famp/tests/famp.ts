import * as anchor from "@coral-xyz/anchor";
import { Program, BN } from "@coral-xyz/anchor";
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
  getAccount,
  createAssociatedTokenAccountIdempotent,
  setAuthority,
  AuthorityType,
} from "@solana/spl-token";
import { assert } from "chai";

const POLICY_SEED = Buffer.from("famp_policy");

describe("famp", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Famp as Program<Famp>;
  const issuer = provider.wallet as anchor.Wallet;
  const holder = Keypair.generate();
  const unauthorizedUser = Keypair.generate();

  let mint: PublicKey;
  let policyPda: PublicKey;
  let policyBump: number;
  let holderTokenAccount: PublicKey;

  // Dummy Merkle roots for testing — in production these are computed off-chain.
  const ROOT_WITH_HOLDER = Buffer.alloc(32, 1);
  const ROOT_AFTER_REMOVE = Buffer.alloc(32, 2);
  const BLOCKLIST_ROOT = Buffer.alloc(32, 3);
  const BLOCKLIST_ROOT_AFTER_REMOVE = Buffer.alloc(32, 4);

  before(async () => {
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(holder.publicKey, 2 * LAMPORTS_PER_SOL)
    );
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(unauthorizedUser.publicKey, LAMPORTS_PER_SOL)
    );

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

    holderTokenAccount = await createAssociatedTokenAccountIdempotent(
      provider.connection,
      issuer.payer,
      mint,
      holder.publicKey,
      {},
      TOKEN_2022_PROGRAM_ID,
    );

    await mintTo(
      provider.connection,
      issuer.payer,
      mint,
      holderTokenAccount,
      issuer.payer,
      1_000_000,
      [],
      {},
      TOKEN_2022_PROGRAM_ID,
    );

    await setAuthority(
      provider.connection,
      issuer.payer,
      mint,
      issuer.publicKey,
      AuthorityType.FreezeAccount,
      policyPda,
      [],
      { commitment: "confirmed" },
      TOKEN_2022_PROGRAM_ID,
    );
  });

  it("create_policy initialises PolicyAccount", async () => {
    await program.methods
      .createPolicy()
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
    assert.deepEqual(Array.from(policy.allowlistMerkleRoot), Array(32).fill(0));
    assert.deepEqual(Array.from(policy.blocklistMerkleRoot), Array(32).fill(0));
    assert.equal(policy.totalAllowed.toNumber(), 0);
    assert.equal(policy.totalBlocked.toNumber(), 0);
  });

  it("create_policy rejects if policy already exists", async () => {
    try {
      await program.methods
        .createPolicy()
        .accounts({
          issuerAuthority: issuer.publicKey,
          mint,
          policy: policyPda,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      assert.fail("should have thrown");
    } catch (err: any) {
      assert.ok(true, "duplicate create_policy should fail");
    }
  });

  it("add_to_allowlist updates Merkle root and increments counter", async () => {
    await program.methods
      .addToAllowlist(holder.publicKey, Array.from(ROOT_WITH_HOLDER))
      .accounts({
        issuerAuthority: issuer.publicKey,
        policy: policyPda,
      })
      .rpc();

    const policy = await program.account.policyAccount.fetch(policyPda);
    assert.deepEqual(
      Array.from(policy.allowlistMerkleRoot),
      Array.from(ROOT_WITH_HOLDER)
    );
    assert.equal(policy.totalAllowed.toNumber(), 1);
  });

  it("add_to_allowlist rejects unauthorized caller", async () => {
    try {
      await program.methods
        .addToAllowlist(holder.publicKey, Array.from(ROOT_WITH_HOLDER))
        .accounts({
          issuerAuthority: unauthorizedUser.publicKey,
          policy: policyPda,
        })
        .signers([unauthorizedUser])
        .rpc();
      assert.fail("should have thrown");
    } catch (err: any) {
      assert.ok(true, "unauthorized caller should be rejected");
    }
  });

  it("add_to_blocklist freezes the holder token account", async () => {
    await program.methods
      .addToBlocklist(Array.from(BLOCKLIST_ROOT))
      .accounts({
        issuerAuthority: issuer.publicKey,
        mint,
        policy: policyPda,
        tokenAccount: holderTokenAccount,
        wallet: holder.publicKey,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .rpc({ commitment: "confirmed", skipPreflight: true });

    const account = await getAccount(
      provider.connection,
      holderTokenAccount,
      "confirmed",
      TOKEN_2022_PROGRAM_ID,
    );
    assert.isTrue(account.isFrozen, "token account should be frozen");

    const policy = await program.account.policyAccount.fetch(policyPda);
    assert.equal(policy.totalBlocked.toNumber(), 1);
  });

  it("remove_from_blocklist updates root and decrements counter", async () => {
    await program.methods
      .removeFromBlocklist(Array.from(BLOCKLIST_ROOT_AFTER_REMOVE))
      .accounts({
        issuerAuthority: issuer.publicKey,
        mint,
        policy: policyPda,
        wallet: holder.publicKey,
      })
      .rpc({ commitment: "confirmed", skipPreflight: true });

    const policy = await program.account.policyAccount.fetch(policyPda);
    assert.deepEqual(
      Array.from(policy.blocklistMerkleRoot),
      Array.from(BLOCKLIST_ROOT_AFTER_REMOVE)
    );
    assert.equal(policy.totalBlocked.toNumber(), 0);
  });

  it("thaw_account unfreezes the holder token account", async () => {
    const sig = await program.methods
      .thawTokenAccount()
      .accounts({
        issuerAuthority: issuer.publicKey,
        mint,
        policy: policyPda,
        tokenAccount: holderTokenAccount,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .rpc({ commitment: "confirmed", skipPreflight: true });

    const txInfo = await provider.connection.getTransaction(sig, { commitment: "confirmed", maxSupportedTransactionVersion: 0 });
    if (txInfo?.meta?.err) {
      console.log("thaw logs:", txInfo.meta.logMessages?.join("\n"));
      throw new Error(`thaw tx failed: ${JSON.stringify(txInfo.meta.err)}`);
    }

    const account = await getAccount(
      provider.connection,
      holderTokenAccount,
      "confirmed",
      TOKEN_2022_PROGRAM_ID,
    );
    assert.isFalse(account.isFrozen, "token account should be thawed");
  });

  it("remove_from_allowlist updates root, decrements counter, and freezes account", async () => {
    const sig = await program.methods
      .removeFromAllowlist(Array.from(ROOT_AFTER_REMOVE))
      .accounts({
        issuerAuthority: issuer.publicKey,
        mint,
        policy: policyPda,
        tokenAccount: holderTokenAccount,
        wallet: holder.publicKey,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .rpc({ commitment: "confirmed" });

    const txInfo = await provider.connection.getTransaction(sig, { commitment: "confirmed", maxSupportedTransactionVersion: 0 });
    if (txInfo?.meta?.err) {
      console.log("remove logs:", txInfo.meta.logMessages?.join("\n"));
      throw new Error(`remove_from_allowlist tx failed: ${JSON.stringify(txInfo.meta.err)}`);
    }

    const policy = await program.account.policyAccount.fetch(policyPda);
    assert.deepEqual(
      Array.from(policy.allowlistMerkleRoot),
      Array.from(ROOT_AFTER_REMOVE)
    );
    assert.equal(policy.totalAllowed.toNumber(), 0);

    const account = await getAccount(
      provider.connection,
      holderTokenAccount,
      "confirmed",
      TOKEN_2022_PROGRAM_ID,
    );
    assert.isTrue(account.isFrozen, "removed holder's account should be frozen");
  });
});
