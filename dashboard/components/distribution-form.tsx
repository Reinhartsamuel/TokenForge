"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TransactionResult } from "@/components/ui/transaction-result";

type Tab = "create" | "claim";

export function DistributionForm() {
  const [activeTab, setActiveTab] = useState<Tab>("create");
  const [mintAddress, setMintAddress] = useState("");
  const [escrowAccount, setEscrowAccount] = useState("");
  const [merkleRoot, setMerkleRoot] = useState("");
  const [actionId, setActionId] = useState("");
  const [amount, setAmount] = useState("");
  const [claimantAddress, setClaimantAddress] = useState("");
  const [leafIndex, setLeafIndex] = useState("");
  const [proofHex1, setProofHex1] = useState("");
  const [proofHex2, setProofHex2] = useState("");
  const [proofHex3, setProofHex3] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [success, setSuccess] = useState(false);
  const [signature, setSignature] = useState("");
  const [addresses, setAddresses] = useState<Record<string, string>>({});

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mintAddress || !merkleRoot) {
      setResult("Mint address and Merkle root are required");
      setSuccess(false);
      return;
    }

    setLoading(true);
    setResult("");
    setSuccess(false);
    setSignature("");
    setAddresses({});

    try {
      const res = await fetch("/api/distribution", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          mintAddress,
          merkleRoot,
          escrowTokenAccount: escrowAccount || undefined,
          actionId: actionId ? parseInt(actionId) : 0,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setResult(`Error: ${data.error}${data.details ? ` (${JSON.stringify(data.details)})` : ""}`);
        setSuccess(false);
        return;
      }

      setSuccess(true);
      setSignature(data.signature);
      setAddresses({
        "Escrow ATA": data.escrowTokenAccount,
        "Mint": data.mint,
        "VerificationConfig": data.verificationConfigPda,
        "Merkle Root": data.merkleRoot,
      });
      setResult(
        `Distribution escrow created!\nAction ID: ${data.actionId}\nSignature: ${data.signature}`
      );
    } catch (error: any) {
      setResult(error.message || "Unknown error");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mintAddress || !claimantAddress || !amount || !merkleRoot) {
      setResult("Mint address, claimant, amount, and Merkle root are required");
      setSuccess(false);
      return;
    }

    setLoading(true);
    setResult("");
    setSuccess(false);
    setSignature("");
    setAddresses({});

    const proofs: string[] = [];
    if (proofHex1.trim()) proofs.push(proofHex1.trim());
    if (proofHex2.trim()) proofs.push(proofHex2.trim());
    if (proofHex3.trim()) proofs.push(proofHex3.trim());

    try {
      const res = await fetch("/api/distribution", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "claim",
          mintAddress,
          claimantAddress,
          amount,
          merkleRoot,
          actionId: actionId ? parseInt(actionId) : 0,
          leafIndex: leafIndex ? parseInt(leafIndex) : 0,
          proofs: proofs.length > 0 ? proofs : undefined,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setResult(`Error: ${data.error}${data.details ? ` (${JSON.stringify(data.details)})` : ""}`);
        setSuccess(false);
        return;
      }

      setSuccess(true);
      setSignature(data.signature);
      setAddresses({
        "Claimant": data.claimant,
        "Claimant ATA": data.claimantTokenAccount,
        "Proof Account": data.proofAccount,
        "Amount (raw)": data.amount,
      });
      setResult(
        `Distribution claimed!\nSignature: ${data.signature}`
      );
    } catch (error: any) {
      setResult(error.message || "Unknown error");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <nav className="flex gap-2">
        <Button
          variant={activeTab === "create" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("create")}
        >
          Create Escrow
        </Button>
        <Button
          variant={activeTab === "claim" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("claim")}
        >
          Claim Distribution
        </Button>
      </nav>

      {activeTab === "create" && (
        <form onSubmit={handleCreate} className="space-y-4">
          <h3 className="text-lg font-medium">Create Distribution Escrow</h3>
          <div>
            <Label htmlFor="distMint">Token Mint Address</Label>
            <Input
              id="distMint"
              value={mintAddress}
              onChange={(e) => setMintAddress(e.target.value)}
              placeholder="Enter mint address..."
            />
          </div>
          <div>
            <Label htmlFor="merkleRoot">Merkle Root (32-byte hex)</Label>
            <Input
              id="merkleRoot"
              value={merkleRoot}
              onChange={(e) => setMerkleRoot(e.target.value)}
              placeholder="0x + 64 hex chars"
            />
          </div>
          <div>
            <Label htmlFor="escrowAta">Escrow Token Account (optional)</Label>
            <Input
              id="escrowAta"
              value={escrowAccount}
              onChange={(e) => setEscrowAccount(e.target.value)}
              placeholder="Auto-derived if empty"
            />
          </div>
          <div>
            <Label htmlFor="distActionId">Action ID (optional)</Label>
            <Input
              id="distActionId"
              value={actionId}
              onChange={(e) => setActionId(e.target.value)}
              placeholder="0"
            />
          </div>
          <p className="text-xs text-slate-400">
            After creating the escrow, mint tokens into the escrow ATA so
            claimants can redeem against the Merkle tree.
          </p>

          <Button type="submit" disabled={loading || !mintAddress || !merkleRoot} className="w-full">
            {loading ? "Creating..." : "Create Distribution Escrow"}
          </Button>

          <TransactionResult
            success={success}
            message={result}
            addresses={addresses}
            signature={signature}
            cluster="devnet"
          />
        </form>
      )}

      {activeTab === "claim" && (
        <form onSubmit={handleClaim} className="space-y-4">
          <h3 className="text-lg font-medium">Claim Distribution</h3>
          <div>
            <Label htmlFor="claimMint">Token Mint Address</Label>
            <Input
              id="claimMint"
              value={mintAddress}
              onChange={(e) => setMintAddress(e.target.value)}
              placeholder="Enter mint address..."
            />
          </div>
          <div>
            <Label htmlFor="claimant">Claimant Wallet Address</Label>
            <Input
              id="claimant"
              value={claimantAddress}
              onChange={(e) => setClaimantAddress(e.target.value)}
              placeholder="Wallet receiving the tokens..."
            />
          </div>
          <div>
            <Label htmlFor="claimAmount">Claim Amount</Label>
            <Input
              id="claimAmount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="1000"
            />
          </div>
          <div>
            <Label htmlFor="claimMerkleRoot">Merkle Root (32-byte hex)</Label>
            <Input
              id="claimMerkleRoot"
              value={merkleRoot}
              onChange={(e) => setMerkleRoot(e.target.value)}
              placeholder="0x + 64 hex chars"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="claimActionId">Action ID</Label>
              <Input
                id="claimActionId"
                value={actionId}
                onChange={(e) => setActionId(e.target.value)}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="leafIndex">Leaf Index</Label>
              <Input
                id="leafIndex"
                value={leafIndex}
                onChange={(e) => setLeafIndex(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
          <div>
            <Label className="text-xs text-slate-400">
              Merkle Proof (up to 3 elements, each 32-byte hex)
            </Label>
            <div className="grid grid-cols-1 gap-2 mt-1">
              <Input
                value={proofHex1}
                onChange={(e) => setProofHex1(e.target.value)}
                placeholder="Proof element 1 (hex)"
              />
              <Input
                value={proofHex2}
                onChange={(e) => setProofHex2(e.target.value)}
                placeholder="Proof element 2 (hex)"
              />
              <Input
                value={proofHex3}
                onChange={(e) => setProofHex3(e.target.value)}
                placeholder="Proof element 3 (hex)"
              />
            </div>
          </div>
          <p className="text-xs text-slate-400">
            Creates a ProofAccount on-chain then executes ClaimDistribution.
            The escrow ATA must be funded and the Merkle root must match.
          </p>

          <Button
            type="submit"
            disabled={loading || !mintAddress || !claimantAddress || !amount || !merkleRoot}
            className="w-full"
          >
            {loading ? "Claiming..." : "Claim Distribution"}
          </Button>

          <TransactionResult
            success={success}
            message={result}
            addresses={addresses}
            signature={signature}
            cluster="devnet"
          />
        </form>
      )}
    </div>
  );
}
