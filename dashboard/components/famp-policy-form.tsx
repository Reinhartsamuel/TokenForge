"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

const FAMP_PROGRAM_ID = "99frBpGJFhSx1qMt64T8HSfZMLUiy5YhZVmnG7X4pk2K";
const POLICY_SEED = "famp_policy";

export function FampPolicyForm() {
  const { connected, signTransaction } = useWallet();
  const { connection } = useConnection();
  const publicKey = useWallet().publicKey;

  const [loading, setLoading] = useState(false);
  const [mintAddress, setMintAddress] = useState("");
  const [allowlistMode, setAllowlistMode] = useState(false);
  const [result, setResult] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!connected || !publicKey) {
      setResult("Please connect your wallet first");
      return;
    }

    setLoading(true);
    setResult("Creating FAMP policy...");

    try {
      const mintPubkey = new PublicKey(mintAddress);

      // Derive policy PDA
      const [policyPda] = PublicKey.findProgramAddressSync(
        [Buffer.from(POLICY_SEED), mintPubkey.toBuffer()],
        new PublicKey(FAMP_PROGRAM_ID)
      );

      // Build FAMP instruction manually (Anchor program)
      // Discriminator from IDL: create_policy = [27, 81, 33, 27, 196, 103, 246, 53]
      const discriminator = Buffer.from([27, 81, 33, 27, 196, 103, 246, 53]);

      const instructionData = Buffer.concat([
        discriminator,
        Buffer.from([allowlistMode ? 1 : 0]), // allowlist_mode: bool
      ]);

      const createPolicyIx = {
        programId: new PublicKey(FAMP_PROGRAM_ID),
        keys: [
          { pubkey: publicKey, isSigner: true, isWritable: true },
          { pubkey: mintPubkey, isSigner: false, isWritable: false },
          { pubkey: policyPda, isSigner: false, isWritable: true },
          { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        ],
        data: instructionData,
      };

      const tx = new Transaction().add(createPolicyIx);
      tx.feePayer = publicKey;

      // Get recent blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;

      if (!signTransaction) {
        throw new Error("Wallet does not support signing");
      }

      const signedTx = await signTransaction(tx);
      const signature = await connection.sendRawTransaction(signedTx.serialize());

      setResult(
        `✅ FAMP policy created!\nPolicy PDA: ${policyPda.toBase58()}\nTX: ${signature}`
      );
    } catch (error: any) {
      setResult(`❌ Error: ${error.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="mint">Token Mint Address</Label>
        <Input
          id="mint"
          value={mintAddress}
          onChange={(e) => setMintAddress(e.target.value)}
          placeholder="Enter mint address..."
        />
      </div>
      <div className="flex items-center gap-2">
        <Switch
          id="allowlist"
          checked={allowlistMode}
          onCheckedChange={setAllowlistMode}
        />
        <Label htmlFor="allowlist">Allowlist Only Mode</Label>
      </div>
      <Button type="submit" disabled={loading || !mintAddress}>
        {loading ? "Creating..." : "Create Policy"}
      </Button>
      {result && (
        <pre className="text-sm text-green-400 whitespace-pre-wrap">{result}</pre>
      )}
    </form>
  );
}
