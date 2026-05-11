"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function CreateTokenPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [decimals, setDecimals] = useState("6");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uri, setUri] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleUploadMetadata = async () => {
    if (!name || !symbol) {
      toast.error("Name and Symbol are required");
      return;
    }

    setUploading(true);
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
      toast.success("Metadata uploaded to R3");
    } catch (error: any) {
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/test-create-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, symbol, decimals: parseInt(decimals), uri }),
      });
      const data = await res.json();

      if (data.error) {
        toast.error(data.error);
        return;
      }

      toast.success("Token created successfully!");
      router.push(`/dashboard/tokens/${data.mint}`);
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/tokens">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Create Token</h1>
          <p className="text-sm text-slate-400 mt-1">Configure and deploy a new security token</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
              s === step ? "bg-sky-600 text-white" : s < step ? "bg-green-600 text-white" : "bg-slate-800 text-slate-500"
            }`}>
              {s < step ? "✓" : s}
            </div>
            <span className={`ml-2 text-sm ${s === step ? "text-white" : "text-slate-500"}`}>
              {s === 1 ? "Details" : s === 2 ? "Metadata" : "Deploy"}
            </span>
            {s < 3 && <div className="w-12 h-px bg-slate-800 mx-3" />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-white">
              {step === 1 ? "Token Details" : step === 2 ? "Metadata" : "Deploy Token"}
            </CardTitle>
            <CardDescription className="text-slate-400">
              {step === 1 && "Configure the basic properties of your security token"}
              {step === 2 && "Upload metadata to R2 storage (optional)"}
              {step === 3 && "Review and deploy to Solana devnet"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && (
              <>
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
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="A regulated security token..."
                    className="w-full min-h-[100px] rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <Label htmlFor="imageUrl">Image URL (optional)</Label>
                  <Input id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/logo.png" />
                </div>
                <div className="flex items-center gap-4">
                  <Button type="button" variant="outline" onClick={handleUploadMetadata} disabled={uploading || !name || !symbol}>
                    {uploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                    {uploading ? "Uploading..." : "Upload to R3"}
                  </Button>
                  {uri && <span className="text-sm text-green-400 break-all">URI: {uri}</span>}
                </div>
              </>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="p-4 bg-slate-800 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Name</span>
                    <span className="text-white">{name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Symbol</span>
                    <span className="text-white">{symbol}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Decimals</span>
                    <span className="text-white">{decimals}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Metadata</span>
                    <span className="text-white">{uri ? "Uploaded" : "None"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Network</span>
                    <span className="text-sky-400">Devnet</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  This will create a new security token on Solana devnet using the canonical SSTS program.
                  The transaction will be signed server-side with the test wallet.
                </p>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => step > 1 && setStep(step - 1)}
                disabled={step === 1}
              >
                Previous
              </Button>
              {step < 3 ? (
                <Button type="button" onClick={() => setStep(step + 1)} disabled={!name || !symbol}>
                  Next
                </Button>
              ) : (
                <Button type="submit" disabled={loading || !name || !symbol}>
                  {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  {loading ? "Deploying..." : "Deploy Token"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
