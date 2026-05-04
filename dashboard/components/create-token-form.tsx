"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWallet } from "@solana/wallet-adapter-react";
import { useSdkRpc, useSdkSigner } from "@/lib/sdk-bridge";
import { createSecurityToken } from "@/lib/sdk/l2/token";
import { generateKeyPairSigner, type TransactionSigner } from "@solana/kit";

export function CreateTokenForm() {
  const { connected } = useWallet();
  const { rpc, rpcSubscriptions } = useSdkRpc();
  const signer = useSdkSigner();

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [decimals, setDecimals] = useState("6");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uri, setUri] = useState("");
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState("");

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

    if (!connected || !signer) {
      setResult("Please connect your wallet first");
      return;
    }

    setLoading(true);
    setResult("Creating security token...");

    try {
      const mint = await generateKeyPairSigner();

      const workflowResult = await createSecurityToken(
        rpc,
        rpcSubscriptions,
        signer,
        mint,
        {
          decimals: parseInt(decimals),
          metadata: {
            name,
            symbol,
            uri: uri || "",
          },
        }
      );

      setResult(
        `✅ Token created!\nMint: ${workflowResult.addresses.mint}\nTX: ${workflowResult.signatures[0]}`
      );
    } catch (error: any) {
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
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Security Token"
            />
          </div>
          <div>
            <Label htmlFor="symbol">Symbol</Label>
            <Input
              id="symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="MST"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="decimals">Decimals</Label>
          <Input
            id="decimals"
            type="number"
            value={decimals}
            onChange={(e) => setDecimals(e.target.value)}
            className="w-32"
          />
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
          <Button
            type="button"
            variant="outline"
            onClick={handleUploadMetadata}
            disabled={uploading || !name || !symbol}
          >
            {uploading ? "Uploading..." : "Upload to R3"}
          </Button>
          {uri && (
            <span className="text-sm text-green-400 break-all">URI: {uri}</span>
          )}
        </div>
      </div>

      <Button type="submit" disabled={loading || !name || !symbol} className="w-full">
        {loading ? "Creating Token..." : "Create Security Token"}
      </Button>

      {result && (
        <pre className="text-sm whitespace-pre-wrap text-green-400">{result}</pre>
      )}
    </form>
  );
}
