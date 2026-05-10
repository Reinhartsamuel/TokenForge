"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { CreateTokenForm } from "@/components/create-token-form";
import { MintTokenForm } from "@/components/mint-token-form";
import { TransferTokenForm } from "@/components/transfer-token-form";
import { FampPolicyForm } from "@/components/famp-policy-form";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"create" | "mint" | "transfer" | "policy">("create");

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tighter">TokenForge Dashboard</h1>
        <WalletMultiButton />
      </header>

      <nav className="flex gap-2 mb-8">
        <Button
          variant={activeTab === "create" ? "default" : "ghost"}
          onClick={() => setActiveTab("create")}
        >
          Create Token
        </Button>
        <Button
          variant={activeTab === "mint" ? "default" : "ghost"}
          onClick={() => setActiveTab("mint")}
        >
          Mint Tokens
        </Button>
        <Button
          variant={activeTab === "transfer" ? "default" : "ghost"}
          onClick={() => setActiveTab("transfer")}
        >
          Transfer
        </Button>
        <Button
          variant={activeTab === "policy" ? "default" : "ghost"}
          onClick={() => setActiveTab("policy")}
        >
          FAMP Policy
        </Button>
      </nav>

      <main className="p-6 bg-slate-900 rounded-lg border border-slate-800">
        {activeTab === "create" && <CreateTokenForm />}
        {activeTab === "mint" && <MintTokenForm />}
        {activeTab === "transfer" && <TransferTokenForm />}
        {activeTab === "policy" && <FampPolicyForm />}
      </main>
    </div>
  );
}
