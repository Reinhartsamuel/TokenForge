"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { Keypair, PublicKey, Transaction } from "@solana/web3.js";
import { createNoopSigner, type Address, type TransactionSigner } from "@solana/kit";
import {
  deriveMintAuthorityPda,
  deriveFreezeAuthorityPda,
  deriveVerificationConfigPda,
} from "@/lib/sdk/l1/derive";
import {
  getInitializeMintInstruction,
  getInitializeVerificationConfigInstruction,
  NOOP_VERIFICATION_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
  SYSTEM_PROGRAM_ID,
  TRANSFER_HOOK_PROGRAM_ID,
} from "@/lib/sdk";
import { canonicalIxToWeb3 } from "@/lib/sdk/l1/transactions";

export function CreateTokenForm() {
  const { connected, publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [decimals, setDecimals] = useState("6");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uri, setUri] = useState("");
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState("");
  const [mode, setMode] = useState<"wallet" | "keypair">("wallet");

  const handleTestWithKeypair = async () => {
    if (!name || !symbol) {
      setResult("Name and Symbol are required");
      return;
    }

    setLoading(true);
    setResult("Creating token via keypair (server-side)...");

    try {
      const res = await fetch("/api/test-create-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, symbol, decimals }),
      });
      const data = await res.json();

      if (data.error) {
        if (data.logs) {
          console.error("Simulation logs:", data.logs);
          setResult(`❌ ${data.error}\nLogs:\n${(data.logs as string[]).join("\n")}`);
        } else {
          setResult(`❌ ${data.error}`);
        }
        return;
      }

      setResult(
        `✅ Token created!\n` +
        `Mint: ${data.mint}\n` +
        `Mint Authority PDA: ${data.mintAuthorityPda}\n` +
        `Verification Config: ${data.verificationConfigPda}\n` +
        `TX: ${data.explorerUrl}`
      );
    } catch (error: any) {
      console.error("Keypair test error:", error);
      setResult(`❌ Error: ${error.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadMetadata = async () => {
    if (!name || !symbol) {
      setResult("Name and Symbol are required before uploading metadata");
      return;
    }

    setUploading(true);
    setResult("Uploading metadata to R3...");

    const metadata = {
      name,
      symbol,
      description: description || `${name} security token`,
      image: imageUrl || "",
      decimals: parseInt(decimals),
    };

    try {
      const res = await fetch("/api/r3-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ metadata }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setUri(data.url);
      setResult(`✅ Metadata uploaded to R3: ${data.url}`);
    } catch (error: any) {
      setResult(`❌ Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!connected || !publicKey) {
      setResult("Please connect your wallet first");
      return;
    }
    if (!signTransaction) {
      setResult("Wallet does not support signing");
      return;
    }

    setLoading(true);
    setResult("Creating security token via canonical SSTS...");

    try {
      const mintKeypair = Keypair.generate();

      const mintAddress = mintKeypair.publicKey.toBase58() as Address;
      const creatorAddress = publicKey.toBase58() as Address;
      const sstsProgram = "SSTS8Qk2bW3aVaBEsY1Ras95YdbaaYQQx21JWHxvjap" as Address;

      // Derive PDAs
      const [mintAuthorityPda] = await deriveMintAuthorityPda(
        mintAddress,
        creatorAddress,
        sstsProgram
      );
      const [freezeAuthorityPda] = await deriveFreezeAuthorityPda(
        mintAddress,
        sstsProgram
      );
      const [transferVerificationConfigPda] = await deriveVerificationConfigPda(
        mintAddress,
        12,
        sstsProgram
      );

      // Build canonical SSTS instructions with proper @solana/kit types
      const mintSigner = createNoopSigner(mintAddress);
      const payerSigner = createNoopSigner(creatorAddress);

      const initMintIx = getInitializeMintInstruction({
        mint: mintSigner,
        authority: mintAuthorityPda,
        payer: payerSigner,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        systemProgram: SYSTEM_PROGRAM_ID,
        rentSysvar: "SysvarRent111111111111111111111111111111111",
        initializeMintArgs: {
          ixMint: {
            decimals: parseInt(decimals),
            mintAuthority: creatorAddress,
            freezeAuthority: freezeAuthorityPda,
          },
          ixMetadataPointer: {
            authority: creatorAddress,
            metadataAddress: mintAddress,
          },
          ixMetadata: {
            name,
            symbol,
            uri: uri || "",
            additionalMetadata: new Uint8Array(),
          },
          ixScaledUiAmount: null,
        },
      } as any);

      const initVerificationConfigIx = getInitializeVerificationConfigInstruction({
        mint: mintAddress,
        verificationConfigOrMintAuthority: mintAuthorityPda,
        instructionsSysvarOrCreator: creatorAddress,
        payer: payerSigner,
        mintAccount: mintAddress,
        configAccount: transferVerificationConfigPda,
        systemProgram: SYSTEM_PROGRAM_ID,
        transferHookPda: TRANSFER_HOOK_PROGRAM_ID,
        transferHookProgram: TRANSFER_HOOK_PROGRAM_ID,
        initializeVerificationConfigArgs: {
          instructionDiscriminator: 12,
          cpiMode: false,
          programAddresses: [NOOP_VERIFICATION_PROGRAM_ID],
        },
      } as any);

      const ix1 = canonicalIxToWeb3(initMintIx, { 0: 5, 2: 5 });
      console.log("ix1 programId:", typeof ix1.programId, ix1.programId.toBase58());
      ix1.keys.forEach((k: any, i: number) => {
        console.log(`  ix1 key[${i}] pubkey type:`, typeof k.pubkey, k.pubkey.toBase58());
      });

      const ix2 = canonicalIxToWeb3(initVerificationConfigIx);
      console.log("ix2 programId:", typeof ix2.programId, ix2.programId.toBase58());

      console.log("Creating transaction...");
      const tx = new Transaction().add(ix1, ix2);
      console.log("Transaction created, instructions:", tx.instructions.length);

      tx.feePayer = publicKey;

      console.log("Getting latest blockhash...");
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      console.log("Blockhash:", blockhash);
      tx.recentBlockhash = blockhash;

      console.log("Signing with wallet...");
      const signedTx = await signTransaction(tx);
      console.log("Wallet signed");

      signedTx.partialSign(mintKeypair);
      console.log("Mint keypair signed");

      console.log("Simulating...");
      const simResult = await connection.simulateTransaction(signedTx);
      console.log("Simulation result:", simResult.value.err || "OK");
      if (simResult.value.err) {
        console.error("Simulation failed:", simResult.value);
        setResult(`❌ Simulation failed: ${JSON.stringify(simResult.value.err, null, 2)}`);
        setLoading(false);
        return;
      }

      console.log("Sending transaction...");
      const signature = await connection.sendRawTransaction(
        (signedTx as Transaction).serialize(),
        { skipPreflight: false, preflightCommitment: "confirmed" }
      );
      console.log("Signature:", signature);

      console.log("Confirming...");
      const latestBlockhash = await connection.getLatestBlockhash();
      await connection.confirmTransaction(signature as any, "confirmed");
      console.log("Confirmed");

      setResult(
        `✅ Token created via canonical SSTS!\n` +
        `Mint: ${mintKeypair.publicKey.toBase58()}\n` +
        `Mint Authority PDA: ${mintAuthorityPda}\n` +
        `Verification Config: ${transferVerificationConfigPda}\n` +
        `TX: https://explorer.solana.com/tx/${signature}?cluster=devnet`
      );
    } catch (error: any) {
      console.error("Token creation error:", error);
      setResult(`❌ Error: ${error.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Token Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Token Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="My Security Token" />
          </div>
          <div>
            <Label htmlFor="symbol">Symbol</Label>
            <Input id="symbol" value={symbol} onChange={(e) => setSymbol(e.target.value)} placeholder="MST" />
          </div>
        </div>
        <div>
          <Label htmlFor="decimals">Decimals</Label>
          <Input id="decimals" type="number" value={decimals} onChange={(e) => setDecimals(e.target.value)} className="w-32" />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Metadata (R3 Storage)</h3>
        <div>
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A regulated security token..."
            className="w-full min-h-[80px] rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
        </div>
        <div>
          <Label htmlFor="imageUrl">Image URL (optional)</Label>
          <Input
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/logo.png"
          />
        </div>
        <div className="flex items-center gap-4">
          <Button type="button" variant="outline" onClick={handleUploadMetadata} disabled={uploading || !name || !symbol}>
            {uploading ? "Uploading..." : "Upload to R3"}
          </Button>
          {uri && <span className="text-sm text-green-400 break-all">URI: {uri}</span>}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <Button type="button" variant={mode === "wallet" ? "default" : "outline"} size="sm" onClick={() => setMode("wallet")}>
          Wallet (MetaMask)
        </Button>
        <Button type="button" variant={mode === "keypair" ? "default" : "outline"} size="sm" onClick={() => setMode("keypair")}>
          Keypair (Server)
        </Button>
      </div>

      {mode === "keypair" ? (
        <>
          <Button type="button" onClick={handleTestWithKeypair} disabled={loading || !name || !symbol} className="w-full bg-amber-600 hover:bg-amber-700">
            {loading ? "Creating Token..." : "Test Create Token (Keypair)"}
          </Button>
          <p className="text-xs text-slate-500 text-center">Bypasses wallet adapter. Signs server-side with TEST_WALLET_KEYPAIR.</p>
        </>
      ) : (
        <Button type="submit" disabled={loading || !name || !symbol} className="w-full">
          {loading ? "Creating Token..." : "Create Security Token"}
        </Button>
      )}

      {result && <pre className="text-sm whitespace-pre-wrap text-green-400">{result}</pre>}
    </form>
  );
}
