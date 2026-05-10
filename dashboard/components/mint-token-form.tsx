"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import {
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction,
  TOKEN_PROGRAM_ID as SPL_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  deriveMintAuthorityPda,
  deriveVerificationConfigPda,
} from "@/lib/sdk/l1/derive";
import { getMintInstruction } from "@/lib/sdk";
import { canonicalIxToWeb3 } from "@/lib/sdk/l1/transactions";
import { TransactionResult } from "@/components/ui/transaction-result";
import { TOKEN_2022_PROGRAM_ID, SSTS_PROGRAM_ID } from "@/lib/sdk";
import type { Address } from "@solana/kit";

const TOKEN_2022_PK = new PublicKey(TOKEN_2022_PROGRAM_ID);

export function MintTokenForm() {
  const { connected, publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();

  const [mintAddress, setMintAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connected || !publicKey || !signTransaction) {
      setResult("Please connect your wallet first");
      return;
    }
    if (!mintAddress || !amount) {
      setResult("Mint address and amount are required");
      return;
    }

    setLoading(true);
    setResult("");
    setSuccess(false);

    try {
      const mintPubkey = new PublicKey(mintAddress);
      const mintAddressStr = mintPubkey.toBase58();

      const [mintAuthorityPda] = await deriveMintAuthorityPda(
        mintAddressStr as Address,
        publicKey.toBase58() as Address,
        SSTS_PROGRAM_ID
      );

      const [verificationConfigPda] = await deriveVerificationConfigPda(
        mintAddressStr as Address,
        6,
        SSTS_PROGRAM_ID
      );

      const destinationAta = getAssociatedTokenAddressSync(
        mintPubkey,
        publicKey,
        false,
        TOKEN_2022_PK
      );

      const destinationAtaExists = await connection.getAccountInfo(destinationAta);

      const amountRaw = BigInt(Math.floor(parseFloat(amount) * 10 ** 6));

      const mintIx = getMintInstruction({
        mint: mintAddressStr,
        verificationConfig: verificationConfigPda,
        instructionsSysvar: "Sysvar1nstructions1111111111111111111111111",
        mintAuthority: mintAuthorityPda,
        mintAccount: mintAddressStr,
        destination: destinationAta.toBase58(),
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        amount: amountRaw,
      } as any);

      const web3MintIx = canonicalIxToWeb3(mintIx);

      const tx = new Transaction();
      if (!destinationAtaExists) {
        tx.add(
          createAssociatedTokenAccountInstruction(
            publicKey,
            destinationAta,
            publicKey,
            mintPubkey,
            TOKEN_2022_PK
          )
        );
      }
      tx.add(web3MintIx);
      tx.feePayer = publicKey;
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;

      const signedTx = await signTransaction(tx);
      const signature = await connection.sendRawTransaction(signedTx.serialize());
      await connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight,
      }, "confirmed");

      setSuccess(true);
      setResult(
        `Minted ${amount} tokens to ${destinationAta.toBase58()}\n` +
        `Mint Authority PDA: ${mintAuthorityPda}\n` +
        `Verification Config: ${verificationConfigPda}`
      );
    } catch (error: any) {
      console.error("Mint error:", error);
      setResult(error.message || "Unknown error");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Mint Tokens</h3>
        <div>
          <Label htmlFor="mint">Token Mint Address</Label>
          <Input
            id="mint"
            value={mintAddress}
            onChange={(e) => setMintAddress(e.target.value)}
            placeholder="Enter mint address..."
          />
        </div>
        <div>
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="1000"
          />
        </div>
        <p className="text-xs text-slate-400">
          Tokens will be minted to your connected wallet (ATA auto-created if needed).
        </p>
      </div>

      <Button type="submit" disabled={loading || !mintAddress || !amount} className="w-full">
        {loading ? "Minting..." : "Mint Tokens"}
      </Button>

      <TransactionResult
        success={success}
        message={result}
        cluster="devnet"
      />
    </form>
  );
}
