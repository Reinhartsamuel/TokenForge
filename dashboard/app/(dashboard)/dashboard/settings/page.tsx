"use client";

import { useState } from "react";
import { Settings, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function SettingsPage() {
  const [network, setNetwork] = useState("devnet");
  const [rpcEndpoint, setRpcEndpoint] = useState("https://api.devnet.solana.com");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      toast.success("Settings saved (stored in localStorage)");
      localStorage.setItem("tokenforge-network", network);
      localStorage.setItem("tokenforge-rpc", rpcEndpoint);
    } catch (error: any) {
      toast.error(`Failed to save: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Settings</h1>
        <p className="text-sm text-slate-400 mt-1">Configure your TokenForge dashboard</p>
      </div>

      <Card className="border-slate-800 bg-slate-900/50">
        <CardHeader>
          <CardTitle className="text-white">Network Configuration</CardTitle>
          <CardDescription className="text-slate-400">Select the Solana network and RPC endpoint</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="network">Network</Label>
            <Select value={network} onValueChange={setNetwork}>
              <SelectTrigger id="network" className="border-slate-700 bg-slate-800">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="devnet">Devnet</SelectItem>
                <SelectItem value="mainnet" disabled>Mainnet (coming soon)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="rpc">RPC Endpoint</Label>
            <Input
              id="rpc"
              value={rpcEndpoint}
              onChange={(e) => setRpcEndpoint(e.target.value)}
              placeholder="https://api.devnet.solana.com"
              className="border-slate-700 bg-slate-800"
            />
          </div>

          <Separator className="bg-slate-800" />

          <div>
            <h3 className="text-sm font-medium text-white mb-2">Wallet Connection</h3>
            <div className="flex items-center gap-2 text-sm">
              <div className="h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
              <span className="text-slate-300">Connected to {network}</span>
            </div>
          </div>

          <Separator className="bg-slate-800" />

          <div>
            <h3 className="text-sm font-medium text-white mb-2">Storage</h3>
            <div className="text-sm text-slate-400">
              <p>Metadata storage: Cloudflare R2</p>
              <p className="mt-1">Token data: PostgreSQL (Railway)</p>
            </div>
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
