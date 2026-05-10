"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import {
  TOKEN_2022_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  createMintToInstruction,
} from "@solana/spl-token";

export function MintTokensForm() {
  const { connected, publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();

  const [loading, setLoading] = useState(false);
  const [mintAddress, setMintAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [result, setResult] = useState("");

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
    setResult("Minting tokens...");

    try {
      const mintPubkey = new PublicKey(mintAddress);
      const recipientPubkey = recipient
        ? new PublicKey(recipient)
        : publicKey;

      // Get or create ATA for recipient
      const recipientAta = await getAssociatedTokenAddress(
        mintPubkey,
        recipientPubkey,
        false,
        TOKEN_2022_PROGRAM_ID
      );

      // Build transaction
      const tx = new Transaction();

      // Check if ATA exists
      const ataInfo = await connection.getAccountInfo(recipientAta);
      if (!ataInfo) {
        tx.add(
          createAssociatedTokenAccountInstruction(
            publicKey,
            recipientAta,
            recipientPubkey,
            mintPubkey,
            TOKEN_2022_PROGRAM_ID
          )
        );
      }

      // Mint instruction
      const uiAmount = parseFloat(amount);
      // TODO: get decimals from mint account — for now assume 6
      const rawAmount = BigInt(Math.floor(uiAmount * 1_000_000));

      tx.add(
        createMintToInstruction(
          mintPubkey,
          recipientAta,
          publicKey, // mint authority = wallet
          rawAmount,
          [],
          TOKEN_2022_PROGRAM_ID
        )
      );

      // Get blockhash and sign
      const { blockhash } = await connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;
      tx.feePayer = publicKey;

      const signedTx = await signTransaction(tx);
      const signature = await connection.sendRawTransaction(
        signedTx.serialize()
      );
      await connection.confirmTransaction(signature, "confirmed");

      setResult(
        `✅ Minted ${amount} tokens to ${recipientPubkey.toBase58()}\nTX: ${signature}`
      );
    } catch (error: any) {
      console.error("Mint error:", error);
      setResult(`❌ Error: ${error.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Mint Tokens</h3>
        <div>
          <Label htmlFor="mintAddress">Token Mint Address</Label>
          <Input
            id="mintAddress"
            value={mintAddress}
            onChange={(e) => setMintAddress(e.target.value)}
            placeholder="Enter mint address..."
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
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
          <div>
            <Label htmlFor="recipient">
              Recipient (defaults to your wallet)
            </Label>
            <Input
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Optional..."
            />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading || !mintAddress || !amount}
        className="w-full"
      >
        {loading ? "Minting..." : "Mint Tokens"}
      </Button>

      {result && (
        <pre className="text-sm whitespace-pre-wrap text-green-400">{result}</pre>
      )}
    </form>
  );
}
