import * as anchor from "@coral-xyz/anchor";
import { Program, BN } from "@coral-xyz/anchor";
import { Ssts } from "../target/types/ssts";
import {
  Keypair,
  PublicKey,
  SystemProgram,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
  Transaction,
} from "@solana/web3.js";
import {
  TOKEN_2022_PROGRAM_ID,
  createInitializeMintInstruction,
  getMinimumBalanceForRentExemptMint,
  MINT_SIZE,
  mintTo,
  getAccount,
  createAssociatedTokenAccountIdempotent,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { assert } from "chai";
import crypto from "crypto";

function expectProgramError(err: any, codeName: string, hexCode: string) {
  const msg = `${err?.message ?? ""} ${err?.toString?.() ?? ""} ${JSON.stringify(
    err?.error ?? {}
  )}`;
  assert.isTrue(
    msg.includes(codeName) || msg.toLowerCase().includes(hexCode.toLowerCase()),
    `expected ${codeName}/${hexCode}, got: ${msg}`
  );
}

const TOKEN_METADATA_SEED = Buffer.from("ssts_metadata");
const DISTRIBUTION_SEED = Buffer.from("ssts_distribution");
const VAULT_SEED = Buffer.from("vault");

const NOOP_PROGRAM_ID = new PublicKey(
  "5gPMypQiHYVmx3jFJAGr72wrB7f1bgmud3mHtpHUGyLd"
);
const FAMP_PROGRAM_ID = new PublicKey(
  "99frBpGJFhSx1qMt64T8HSfZMLUiy5YhZVmnG7X4pk2K"
);

function sha256(data: Buffer): Buffer {
  return crypto.createHash("sha256").update(data).digest();
}

function computeLeaf(
  wallet: PublicKey,
  amount: BN,
  distributionId: BN
): Buffer {
  const amountBuf = Buffer.alloc(8);
  amountBuf.writeBigUInt64LE(BigInt(amount.toString()));
  const distIdBuf = Buffer.alloc(8);
  distIdBuf.writeBigUInt64LE(BigInt(distributionId.toString()));
  return sha256(Buffer.concat([wallet.toBuffer(), amountBuf, distIdBuf]));
}

function hashPair(a: Buffer, b: Buffer): Buffer {
  if (Buffer.compare(a, b) <= 0) {
    return sha256(Buffer.concat([a, b]));
  }
  return sha256(Buffer.concat([b, a]));
}

function buildMerkleTree(leaves: Buffer[]): {
  root: Buffer;
  proofs: Buffer[][];
} {
  if (leaves.length === 0) {
    throw new Error("need at least one leaf");
  }
  let nodes = [...leaves];
  const proofs: Buffer[][] = leaves.map(() => []);

  while (nodes.length > 1) {
    if (nodes.length % 2 !== 0) {
      nodes.push(nodes[nodes.length - 1]);
    }
    const next: Buffer[] = [];
    for (let i = 0; i < nodes.length; i += 2) {
      next.push(hashPair(nodes[i], nodes[i + 1]));
      const half = i / 2;
      if (i < leaves.length * Math.pow(2, Math.ceil(Math.log2(leaves.length)) / nodes.length)) {
      }
    }
    for (let i = 0; i < leaves.length; i++) {
      const idx = i + (nodes.length - leaves.length);
      const siblingIdx = idx % 2 === 0 ? idx + 1 : idx - 1;
      if (siblingIdx < nodes.length) {
        proofs[i].push(nodes[siblingIdx]);
      }
    }
    nodes = next;
  }

  return { root: nodes[0], proofs };
}

function buildSimpleMerkleTree(leaves: Buffer[]): {
  root: Buffer;
  proofs: Buffer[][];
} {
  if (leaves.length === 0) {
    throw new Error("need at least one leaf");
  }

  const proofs: Buffer[][] = leaves.map(() => []);

  let currentLevel = [...leaves];
  let levelStartIdx = 0;

  while (currentLevel.length > 1) {
    if (currentLevel.length % 2 !== 0) {
      currentLevel.push(currentLevel[currentLevel.length - 1]);
    }

    const nextLevel: Buffer[] = [];
    for (let i = 0; i < currentLevel.length; i += 2) {
      nextLevel.push(hashPair(currentLevel[i], currentLevel[i + 1]));
    }

    for (let leafIdx = 0; leafIdx < leaves.length; leafIdx++) {
      const pos = levelStartIdx + leafIdx;
      const siblingPos = pos % 2 === 0 ? pos + 1 : pos - 1;
      if (
        siblingPos < levelStartIdx + currentLevel.length &&
        proofs[leafIdx].length < Math.ceil(Math.log2(leaves.length)) || leaves.length === 1
      ) {
        if (siblingPos < levelStartIdx + currentLevel.length) {
          proofs[leafIdx].push(currentLevel[siblingPos - levelStartIdx]);
        }
      }
    }

    levelStartIdx += currentLevel.length;
    currentLevel = nextLevel;
  }

  return { root: currentLevel[0], proofs };
}

class MerkleTree {
  leaves: Buffer[];
  layers: Buffer[][];

  constructor(leaves: Buffer[]) {
    if (leaves.length === 0) {
      throw new Error("need at least one leaf");
    }
    this.leaves = [...leaves];
    this.layers = [this.leaves];
    this.build();
  }

  private build() {
    let current = this.leaves;
    while (current.length > 1) {
      const next: Buffer[] = [];
      for (let i = 0; i < current.length; i += 2) {
        const left = current[i];
        const right = i + 1 < current.length ? current[i + 1] : current[i];
        next.push(hashPair(left, right));
      }
      this.layers.push(next);
      current = next;
    }
  }

  get root(): Buffer {
    return this.layers[this.layers.length - 1][0];
  }

  getProof(index: number): Buffer[] {
    const proof: Buffer[] = [];
    let idx = index;
    for (let layer = 0; layer < this.layers.length - 1; layer++) {
      const currentLayer = this.layers[layer];
      const siblingIdx = idx % 2 === 0 ? idx + 1 : idx - 1;
      if (siblingIdx < currentLayer.length) {
        proof.push(currentLayer[siblingIdx]);
      }
      idx = Math.floor(idx / 2);
    }
    return proof;
  }
}

async function createMint(
  connection: anchor.web3.Connection,
  payer: anchor.web3.Keypair,
  mintAuthority: PublicKey,
  freezeAuthority: PublicKey | null,
  decimals: number
): Promise<PublicKey> {
  const mintKp = Keypair.generate();
  const lamports = await getMinimumBalanceForRentExemptMint(connection);
  const tx = new anchor.web3.Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: mintKp.publicKey,
      space: MINT_SIZE,
      lamports,
      programId: TOKEN_2022_PROGRAM_ID,
    }),
    createInitializeMintInstruction(
      mintKp.publicKey,
      decimals,
      mintAuthority,
      freezeAuthority,
      TOKEN_2022_PROGRAM_ID
    )
  );
  await connection.sendAndConfirm(tx, [payer, mintKp], {
    commitment: "confirmed",
  });
  return mintKp.publicKey;
}


describe("ssts", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Ssts as Program<Ssts>;
  const issuer = provider.wallet as anchor.Wallet;
  const holder = Keypair.generate();

  let mint: PublicKey;
  let mintKp: Keypair;
  let metadataPda: PublicKey;
  let issuerTokenAccount: PublicKey;
  let holderTokenAccount: PublicKey;

  const DECIMALS = 6;

  before(async () => {
    const fundTx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: issuer.publicKey,
        toPubkey: holder.publicKey,
        lamports: 2 * LAMPORTS_PER_SOL,
      })
    );
    await sendAndConfirmTransaction(provider.connection, fundTx, [issuer.payer]);

    mintKp = Keypair.generate();
    mint = mintKp.publicKey;

    [metadataPda] = PublicKey.findProgramAddressSync(
      [TOKEN_METADATA_SEED, mint.toBuffer()],
      program.programId
    );

    const lamports = await getMinimumBalanceForRentExemptMint(
      provider.connection
    );
    const createMintTx = new anchor.web3.Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: issuer.publicKey,
        newAccountPubkey: mint,
        space: MINT_SIZE,
        lamports,
        programId: TOKEN_2022_PROGRAM_ID,
      }),
      createInitializeMintInstruction(
        mint,
        DECIMALS,
        issuer.publicKey,
        issuer.publicKey,
        TOKEN_2022_PROGRAM_ID
      )
    );
    await provider.sendAndConfirm(createMintTx, [mintKp], {
      commitment: "confirmed",
    });

    issuerTokenAccount = await createAssociatedTokenAccountIdempotent(
      provider.connection,
      issuer.payer,
      mint,
      issuer.publicKey,
      { commitment: "confirmed" },
      TOKEN_2022_PROGRAM_ID
    );

    holderTokenAccount = await createAssociatedTokenAccountIdempotent(
      provider.connection,
      issuer.payer,
      mint,
      holder.publicKey,
      { commitment: "confirmed" },
      TOKEN_2022_PROGRAM_ID
    );
  });

  describe("create_token", () => {
    it("creates SstsMetadata PDA with correct fields", async () => {
      await program.methods
        .createToken("TokenForge RWA", "TFRWA", "https://meta.tokenforge.io/1", DECIMALS)
        .accounts({
          issuer: issuer.publicKey,
          mint,
          metadata: metadataPda,
          verificationPolicyProgram: NOOP_PROGRAM_ID,
          fampProgram: FAMP_PROGRAM_ID,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([mintKp])
        .rpc({ commitment: "confirmed" });

      const metadata = await program.account.sstsMetadata.fetch(metadataPda);
      assert.ok(metadata.mint.equals(mint));
      assert.ok(metadata.issuer.equals(issuer.publicKey));
      const name = Buffer.from(metadata.name).toString("utf8").replace(/\0+$/, "");
      assert.equal(name, "TokenForge RWA");
      const symbol = Buffer.from(metadata.symbol).toString("utf8").replace(/\0+$/, "");
      assert.equal(symbol, "TFRWA");
      assert.equal(metadata.decimals, DECIMALS);
      assert.ok(metadata.verificationPolicyProgram.equals(NOOP_PROGRAM_ID));
      assert.ok(metadata.fampProgram.equals(FAMP_PROGRAM_ID));
      assert.isFalse(metadata.isPaused);
    });

    it("rejects name > 64 bytes", async () => {
      const longName = "x".repeat(65);
      const otherMintKp = Keypair.generate();
      const otherMint = otherMintKp.publicKey;
      const [otherMetaPda] = PublicKey.findProgramAddressSync(
        [TOKEN_METADATA_SEED, otherMint.toBuffer()],
        program.programId
      );

      const lamports = await getMinimumBalanceForRentExemptMint(provider.connection);
      const tx = new anchor.web3.Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: issuer.publicKey,
          newAccountPubkey: otherMint,
          space: MINT_SIZE,
          lamports,
          programId: TOKEN_2022_PROGRAM_ID,
        }),
        createInitializeMintInstruction(
          otherMint,
          DECIMALS,
          issuer.publicKey,
          issuer.publicKey,
          TOKEN_2022_PROGRAM_ID
        )
      );
      await provider.sendAndConfirm(tx, [otherMintKp], { commitment: "confirmed" });

      try {
        await program.methods
          .createToken(longName, "SYMB", "https://example.com", DECIMALS)
          .accounts({
            issuer: issuer.publicKey,
            mint: otherMint,
            metadata: otherMetaPda,
            verificationPolicyProgram: NOOP_PROGRAM_ID,
            fampProgram: FAMP_PROGRAM_ID,
            tokenProgram: TOKEN_2022_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
          })
          .signers([otherMintKp])
          .rpc();
        assert.fail("should have thrown");
      } catch (err: any) {
        expectProgramError(err, "NameTooLong", "0x1770");
      }
    });

    it("rejects symbol > 16 bytes", async () => {
      const longSymbol = "x".repeat(17);
      const otherMintKp = Keypair.generate();
      const otherMint = otherMintKp.publicKey;
      const [otherMetaPda] = PublicKey.findProgramAddressSync(
        [TOKEN_METADATA_SEED, otherMint.toBuffer()],
        program.programId
      );

      const lamports = await getMinimumBalanceForRentExemptMint(provider.connection);
      const tx = new anchor.web3.Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: issuer.publicKey,
          newAccountPubkey: otherMint,
          space: MINT_SIZE,
          lamports,
          programId: TOKEN_2022_PROGRAM_ID,
        }),
        createInitializeMintInstruction(
          otherMint,
          DECIMALS,
          issuer.publicKey,
          issuer.publicKey,
          TOKEN_2022_PROGRAM_ID
        )
      );
      await provider.sendAndConfirm(tx, [otherMintKp], { commitment: "confirmed" });

      try {
        await program.methods
          .createToken("Valid", longSymbol, "https://example.com", DECIMALS)
          .accounts({
            issuer: issuer.publicKey,
            mint: otherMint,
            metadata: otherMetaPda,
            verificationPolicyProgram: NOOP_PROGRAM_ID,
            fampProgram: FAMP_PROGRAM_ID,
            tokenProgram: TOKEN_2022_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
          })
          .signers([otherMintKp])
          .rpc();
        assert.fail("should have thrown");
      } catch (err: any) {
        expectProgramError(err, "SymbolTooLong", "0x1771");
      }
    });

    it("rejects uri > 256 bytes", async () => {
      const longUri = "https://" + "x".repeat(250) + ".com";
      const otherMintKp = Keypair.generate();
      const otherMint = otherMintKp.publicKey;
      const [otherMetaPda] = PublicKey.findProgramAddressSync(
        [TOKEN_METADATA_SEED, otherMint.toBuffer()],
        program.programId
      );

      const lamports = await getMinimumBalanceForRentExemptMint(provider.connection);
      const tx = new anchor.web3.Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: issuer.publicKey,
          newAccountPubkey: otherMint,
          space: MINT_SIZE,
          lamports,
          programId: TOKEN_2022_PROGRAM_ID,
        }),
        createInitializeMintInstruction(
          otherMint,
          DECIMALS,
          issuer.publicKey,
          issuer.publicKey,
          TOKEN_2022_PROGRAM_ID
        )
      );
      await provider.sendAndConfirm(tx, [otherMintKp], { commitment: "confirmed" });

      try {
        await program.methods
          .createToken("Valid", "SYMB", longUri, DECIMALS)
          .accounts({
            issuer: issuer.publicKey,
            mint: otherMint,
            metadata: otherMetaPda,
            verificationPolicyProgram: NOOP_PROGRAM_ID,
            fampProgram: FAMP_PROGRAM_ID,
            tokenProgram: TOKEN_2022_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
          })
          .signers([otherMintKp])
          .rpc();
        assert.fail("should have thrown");
      } catch (err: any) {
        expectProgramError(err, "UriTooLong", "0x1772");
      }
    });

    it("rejects decimals > 18", async () => {
      const otherMintKp = Keypair.generate();
      const otherMint = otherMintKp.publicKey;
      const [otherMetaPda] = PublicKey.findProgramAddressSync(
        [TOKEN_METADATA_SEED, otherMint.toBuffer()],
        program.programId
      );

      const lamports = await getMinimumBalanceForRentExemptMint(provider.connection);
      const tx = new anchor.web3.Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: issuer.publicKey,
          newAccountPubkey: otherMint,
          space: MINT_SIZE,
          lamports,
          programId: TOKEN_2022_PROGRAM_ID,
        }),
        createInitializeMintInstruction(
          otherMint,
          19,
          issuer.publicKey,
          issuer.publicKey,
          TOKEN_2022_PROGRAM_ID
        )
      );
      await provider.sendAndConfirm(tx, [otherMintKp], { commitment: "confirmed" });

      try {
        await program.methods
          .createToken("Valid", "SYMB", "https://example.com", 19)
          .accounts({
            issuer: issuer.publicKey,
            mint: otherMint,
            metadata: otherMetaPda,
            verificationPolicyProgram: NOOP_PROGRAM_ID,
            fampProgram: FAMP_PROGRAM_ID,
            tokenProgram: TOKEN_2022_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
          })
          .signers([otherMintKp])
          .rpc();
        assert.fail("should have thrown");
      } catch (err: any) {
        expectProgramError(err, "InvalidDecimals", "0x1773");
      }
    });
  });

  describe("mint_to", () => {
    it("mints tokens after verification CPI succeeds", async () => {
      await program.methods
        .mintTo(new BN(10_000_000))
        .accounts({
          issuer: issuer.publicKey,
          mint,
          metadata: metadataPda,
          destination: issuerTokenAccount,
          verificationPolicyProgram: NOOP_PROGRAM_ID,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .rpc({ commitment: "confirmed" });

      const account = await getAccount(
        provider.connection,
        issuerTokenAccount,
        "confirmed",
        TOKEN_2022_PROGRAM_ID
      );
      assert.equal(Number(account.amount), 10_000_000);
    });

    it("mints to holder account", async () => {
      await program.methods
        .mintTo(new BN(5_000_000))
        .accounts({
          issuer: issuer.publicKey,
          mint,
          metadata: metadataPda,
          destination: holderTokenAccount,
          verificationPolicyProgram: NOOP_PROGRAM_ID,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .rpc({ commitment: "confirmed" });

      const account = await getAccount(
        provider.connection,
        holderTokenAccount,
        "confirmed",
        TOKEN_2022_PROGRAM_ID
      );
      assert.equal(Number(account.amount), 5_000_000);
    });
  });

  describe("freeze / thaw", () => {
    it("freezes a token account", async () => {
      await program.methods
        .freeze()
        .accounts({
          issuer: issuer.publicKey,
          mint,
          tokenAccount: holderTokenAccount,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .rpc({ commitment: "confirmed" });

      const account = await getAccount(
        provider.connection,
        holderTokenAccount,
        "confirmed",
        TOKEN_2022_PROGRAM_ID
      );
      assert.isTrue(account.isFrozen);
    });

    it("thaws a frozen token account", async () => {
      await program.methods
        .thaw()
        .accounts({
          issuer: issuer.publicKey,
          mint,
          tokenAccount: holderTokenAccount,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .rpc({ commitment: "confirmed" });

      const account = await getAccount(
        provider.connection,
        holderTokenAccount,
        "confirmed",
        TOKEN_2022_PROGRAM_ID
      );
      assert.isFalse(account.isFrozen);
    });
  });

  describe("pause / unpause", () => {
    it("pauses the token", async () => {
      await program.methods
        .pause()
        .accounts({
          issuer: issuer.publicKey,
          metadata: metadataPda,
          mint,
        })
        .rpc({ commitment: "confirmed" });

      const metadata = await program.account.sstsMetadata.fetch(metadataPda);
      assert.isTrue(metadata.isPaused);
    });

    it("rejects double pause", async () => {
      try {
        await program.methods
          .pause()
          .accounts({
            issuer: issuer.publicKey,
            metadata: metadataPda,
            mint,
          })
          .rpc();
        assert.fail("should have thrown");
      } catch (err: any) {
        expectProgramError(err, "AlreadyPaused", "0x1776");
      }
    });

    it("unpauses the token", async () => {
      await program.methods
        .unpause()
        .accounts({
          issuer: issuer.publicKey,
          metadata: metadataPda,
          mint,
        })
        .rpc({ commitment: "confirmed" });

      const metadata = await program.account.sstsMetadata.fetch(metadataPda);
      assert.isFalse(metadata.isPaused);
    });

    it("rejects unpause when not paused", async () => {
      try {
        await program.methods
          .unpause()
          .accounts({
            issuer: issuer.publicKey,
            metadata: metadataPda,
            mint,
          })
          .rpc();
        assert.fail("should have thrown");
      } catch (err: any) {
        expectProgramError(err, "NotPaused", "0x1777");
      }
    });
  });

  describe("issue_distribution", () => {
    const distributionId = new BN(1);
    let distributionPda: PublicKey;
    let vaultPda: PublicKey;

    before(() => {
      [distributionPda] = PublicKey.findProgramAddressSync(
        [
          DISTRIBUTION_SEED,
          mint.toBuffer(),
          distributionId.toBuffer("le", 8),
        ],
        program.programId
      );
      [vaultPda] = PublicKey.findProgramAddressSync(
        [
          DISTRIBUTION_SEED,
          mint.toBuffer(),
          distributionId.toBuffer("le", 8),
          VAULT_SEED,
        ],
        program.programId
      );
    });

    it("issues a distribution with Merkle root and transfers tokens to vault", async () => {
      const merkleRoot = Array.from(Buffer.alloc(32, 42));
      const totalAmount = new BN(5_000_000);
      const claimWindow = new BN(86400);

      await program.methods
        .issueDistribution(distributionId, merkleRoot, totalAmount, claimWindow)
        .accounts({
          issuer: issuer.publicKey,
          mint,
          metadata: metadataPda,
          distribution: distributionPda,
          vault: vaultPda,
          issuerTokenAccount,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .rpc({ commitment: "confirmed" });

      const dist = await program.account.distributionAccount.fetch(distributionPda);
      assert.equal(dist.distributionId.toNumber(), 1);
      assert.ok(dist.mint.equals(mint));
      assert.deepEqual(Array.from(dist.merkleRoot), merkleRoot);
      assert.equal(dist.totalAmount.toNumber(), 5_000_000);
      assert.equal(dist.claimedAmount.toNumber(), 0);
      assert.isTrue(dist.isActive);

      const vaultAccount = await getAccount(
        provider.connection,
        vaultPda,
        "confirmed",
        TOKEN_2022_PROGRAM_ID
      );
      assert.equal(Number(vaultAccount.amount), 5_000_000);
    });

    it("rejects zero distribution amount", async () => {
      const distId2 = new BN(2);
      const [distPda2] = PublicKey.findProgramAddressSync(
        [
          DISTRIBUTION_SEED,
          mint.toBuffer(),
          distId2.toBuffer("le", 8),
        ],
        program.programId
      );
      const [vaultPda2] = PublicKey.findProgramAddressSync(
        [
          DISTRIBUTION_SEED,
          mint.toBuffer(),
          distId2.toBuffer("le", 8),
          VAULT_SEED,
        ],
        program.programId
      );

      try {
        await program.methods
          .issueDistribution(distId2, Array.from(Buffer.alloc(32, 0)), new BN(0), new BN(86400))
          .accounts({
            issuer: issuer.publicKey,
            mint,
            metadata: metadataPda,
            distribution: distPda2,
            vault: vaultPda2,
            issuerTokenAccount,
            tokenProgram: TOKEN_2022_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
          })
          .rpc();
        assert.fail("should have thrown");
      } catch (err: any) {
        expectProgramError(err, "ZeroDistribution", "0x1774");
      }
    });

    it("rejects zero claim window", async () => {
      const distId3 = new BN(3);
      const [distPda3] = PublicKey.findProgramAddressSync(
        [
          DISTRIBUTION_SEED,
          mint.toBuffer(),
          distId3.toBuffer("le", 8),
        ],
        program.programId
      );
      const [vaultPda3] = PublicKey.findProgramAddressSync(
        [
          DISTRIBUTION_SEED,
          mint.toBuffer(),
          distId3.toBuffer("le", 8),
          VAULT_SEED,
        ],
        program.programId
      );

      try {
        await program.methods
          .issueDistribution(distId3, Array.from(Buffer.alloc(32, 0)), new BN(1_000), new BN(0))
          .accounts({
            issuer: issuer.publicKey,
            mint,
            metadata: metadataPda,
            distribution: distPda3,
            vault: vaultPda3,
            issuerTokenAccount,
            tokenProgram: TOKEN_2022_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
          })
          .rpc();
        assert.fail("should have thrown");
      } catch (err: any) {
        expectProgramError(err, "ZeroClaimWindow", "0x1775");
      }
    });
  });

  describe("claim_distribution", () => {
    const distributionId = new BN(10);
    const claimAmount = new BN(2_000_000);
    let distributionPda: PublicKey;
    let vaultPda: PublicKey;
    let claimantTokenAccount: PublicKey;
    let merkleRoot: number[];
    let proof: number[][];

    before(async () => {
      [distributionPda] = PublicKey.findProgramAddressSync(
        [
          DISTRIBUTION_SEED,
          mint.toBuffer(),
          distributionId.toBuffer("le", 8),
        ],
        program.programId
      );
      [vaultPda] = PublicKey.findProgramAddressSync(
        [
          DISTRIBUTION_SEED,
          mint.toBuffer(),
          distributionId.toBuffer("le", 8),
          VAULT_SEED,
        ],
        program.programId
      );

      const leaf = computeLeaf(holder.publicKey, claimAmount, distributionId);
      const tree = new MerkleTree([leaf]);
      merkleRoot = Array.from(tree.root);
      proof = tree.getProof(0).map((b) => Array.from(b));

      claimantTokenAccount = await createAssociatedTokenAccountIdempotent(
        provider.connection,
        issuer.payer,
        mint,
        holder.publicKey,
        { commitment: "confirmed" },
        TOKEN_2022_PROGRAM_ID
      );

      await program.methods
        .issueDistribution(
          distributionId,
          merkleRoot,
          claimAmount,
          new BN(86400)
        )
        .accounts({
          issuer: issuer.publicKey,
          mint,
          metadata: metadataPda,
          distribution: distributionPda,
          vault: vaultPda,
          issuerTokenAccount,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .rpc({ commitment: "confirmed" });
    });

    it("claims with a valid Merkle proof", async () => {
      const beforeBal = await getAccount(
        provider.connection,
        claimantTokenAccount,
        "confirmed",
        TOKEN_2022_PROGRAM_ID
      );

      await program.methods
        .claimDistribution(claimAmount, proof)
        .accounts({
          claimant: holder.publicKey,
          mint,
          distribution: distributionPda,
          vault: vaultPda,
          claimantTokenAccount,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .signers([holder])
        .rpc({ commitment: "confirmed" });

      const afterBal = await getAccount(
        provider.connection,
        claimantTokenAccount,
        "confirmed",
        TOKEN_2022_PROGRAM_ID
      );
      assert.equal(
        Number(afterBal.amount) - Number(beforeBal.amount),
        2_000_000
      );

      const dist = await program.account.distributionAccount.fetch(distributionPda);
      assert.equal(dist.claimedAmount.toNumber(), 2_000_000);
    });

    it("rejects an invalid Merkle proof", async () => {
      const badProof = [Array.from(Buffer.alloc(32, 0xff))];

      const distId11 = new BN(11);
      const leaf = computeLeaf(holder.publicKey, new BN(500_000), distId11);
      const tree = new MerkleTree([leaf]);
      const root = Array.from(tree.root);

      const [distPda11] = PublicKey.findProgramAddressSync(
        [
          DISTRIBUTION_SEED,
          mint.toBuffer(),
          distId11.toBuffer("le", 8),
        ],
        program.programId
      );
      const [vaultPda11] = PublicKey.findProgramAddressSync(
        [
          DISTRIBUTION_SEED,
          mint.toBuffer(),
          distId11.toBuffer("le", 8),
          VAULT_SEED,
        ],
        program.programId
      );

      await program.methods
        .issueDistribution(distId11, root, new BN(500_000), new BN(86400))
        .accounts({
          issuer: issuer.publicKey,
          mint,
          metadata: metadataPda,
          distribution: distPda11,
          vault: vaultPda11,
          issuerTokenAccount,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .rpc({ commitment: "confirmed" });

      try {
        await program.methods
          .claimDistribution(new BN(500_000), badProof)
          .accounts({
            claimant: holder.publicKey,
            mint,
            distribution: distPda11,
            vault: vaultPda11,
            claimantTokenAccount,
            tokenProgram: TOKEN_2022_PROGRAM_ID,
          })
          .signers([holder])
          .rpc();
        assert.fail("should have thrown");
      } catch (err: any) {
        expectProgramError(err, "InvalidProof", "0x177a");
      }
    });
  });

  describe("execute_corporate_action", () => {
    it("executes a split action", async () => {
      await program.methods
        .executeCorporateAction({ split: {} }, new BN(3), new BN(1))
        .accounts({
          issuer: issuer.publicKey,
          metadata: metadataPda,
          mint,
        })
        .rpc({ commitment: "confirmed" });
    });

    it("executes a merge action", async () => {
      await program.methods
        .executeCorporateAction({ merge: {} }, new BN(1), new BN(3))
        .accounts({
          issuer: issuer.publicKey,
          metadata: metadataPda,
          mint,
        })
        .rpc({ commitment: "confirmed" });
    });

    it("rejects invalid split ratio (numerator <= denominator)", async () => {
      try {
        await program.methods
          .executeCorporateAction({ split: {} }, new BN(1), new BN(2))
          .accounts({
            issuer: issuer.publicKey,
            metadata: metadataPda,
            mint,
          })
          .rpc();
        assert.fail("should have thrown");
      } catch (err: any) {
        expectProgramError(err, "InvalidSplitRatio", "0x177d");
      }
    });

    it("rejects invalid merge ratio (numerator >= denominator)", async () => {
      try {
        await program.methods
          .executeCorporateAction({ merge: {} }, new BN(3), new BN(1))
          .accounts({
            issuer: issuer.publicKey,
            metadata: metadataPda,
            mint,
          })
          .rpc();
        assert.fail("should have thrown");
      } catch (err: any) {
        expectProgramError(err, "InvalidMergeRatio", "0x177e");
      }
    });

    it("rejects zero denominator", async () => {
      try {
        await program.methods
          .executeCorporateAction({ split: {} }, new BN(1), new BN(0))
          .accounts({
            issuer: issuer.publicKey,
            metadata: metadataPda,
            mint,
          })
          .rpc();
        assert.fail("should have thrown");
      } catch (err: any) {
        expectProgramError(err, "InvalidRatio", "0x177c");
      }
    });
  });
});
