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
} from "@solana/spl-token";
import { deriveVerificationConfigPda } from "@/lib/sdk/l1/derive";
import { getTransferInstruction } from "@/lib/sdk";
import { canonicalIxToWeb3 } from "@/lib/sdk/l1/transactions";
import { TransactionResult } from "@/components/ui/transaction-result";
import { TOKEN_2022_PROGRAM_ID, SSTS_PROGRAM_ID, TRANSFER_HOOK_PROGRAM_ID } from "@/lib/sdk";
import type { Address } from "@solana/kit";

const TOKEN_2022_PK = new PublicKey(TOKEN_2022_PROGRAM_ID);

export function TransferTokenForm() {
  const { connected, publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();

  const [mintAddress, setMintAddress] = useState("");
  const [recipient, setRecipient] = useState("");
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
    if (!mintAddress || !recipient || !amount) {
      setResult("All fields are required");
      return;
    }

    setLoading(true);
    setResult("");
    setSuccess(false);

    try {
      const mintPubkey = new PublicKey(mintAddress);
      const mintAddressStr = mintPubkey.toBase58();
      const recipientPubkey = new PublicKey(recipient);

      const [verificationConfigPda] = await deriveVerificationConfigPda(
        mintAddressStr as Address,
        12,
        SSTS_PROGRAM_ID
      );

      const sourceAta = getAssociatedTokenAddressSync(
        mintPubkey,
        publicKey,
        false,
        TOKEN_2022_PK
      );

      const destAta = getAssociatedTokenAddressSync(
        mintPubkey,
        recipientPubkey,
        false,
        TOKEN_2022_PK
      );

      const sourceAtaExists = await connection.getAccountInfo(sourceAta);
      const destAtaExists = await connection.getAccountInfo(destAta);

      const amountRaw = BigInt(Math.floor(parseFloat(amount) * 10 ** 6));

      const transferIx = getTransferInstruction({
        mint: mintAddressStr,
        verificationConfig: verificationConfigPda,
        instructionsSysvar: "Sysvar1nstructions1111111111111111111111111",
        permanentDelegateAuthority: publicKey.toBase58(),
        mintAccount: mintAddressStr,
        fromTokenAccount: sourceAta.toBase58(),
        toTokenAccount: destAta.toBase58(),
        transferHookProgram: TRANSFER_HOOK_PROGRAM_ID,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        amount: amountRaw,
      } as any);

      const web3TransferIx = canonicalIxToWeb3(transferIx);

      const tx = new Transaction();
      if (!sourceAtaExists) {
        tx.add(
          createAssociatedTokenAccountInstruction(
            publicKey,
            sourceAta,
            publicKey,
            mintPubkey,
            TOKEN_2022_PK
          )
        );
      }
      if (!destAtaExists) {
        tx.add(
          createAssociatedTokenAccountInstruction(
            publicKey,
            destAta,
            recipientPubkey,
            mintPubkey,
            TOKEN_2022_PK
          )
        );
      }
      tx.add(web3TransferIx);
      tx.feePayer = publicKey;
      const { blockhash, lastValidBlockHeight} = await connection.getLatestBlockhash();
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
        `Transferred ${amount} tokens to ${recipient}\n` +
        `From: ${sourceAta.toBase58()}\n` +
        `To: ${destAta.toBase58()}`
      );
    } catch (error: any) {
      console.error("Transfer error:", error);
      setResult(error.message || "Unknown error");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Transfer Tokens</h3>
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
          <Label htmlFor="recipient">Recipient Address</Label>
          <Input
            id="recipient"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Enter recipient wallet address..."
          />
        </div>
        <div>
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="100"
          />
        </div>
        <p className="text-xs text-slate-400">
          Source and destination ATAs are auto-created if they don't exist.
        </p>
      </div>

      <Button type="submit" disabled={loading || !mintAddress || !recipient || !amount} className="w-full">
        {loading ? "Transferring..." : "Transfer Tokens"}
      </Button>

      <TransactionResult
        success={success}
        message={result}
        cluster="devnet"
      />
    </form>
  );
}
