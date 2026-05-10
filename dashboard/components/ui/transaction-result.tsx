"use client";

import { ExternalLink, AlertCircle, CheckCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TransactionResultProps {
  success: boolean;
  signature?: string;
  message: string;
  addresses?: Record<string, string>;
  cluster?: "devnet" | "mainnet-beta";
  onRetry?: () => void;
}

export function TransactionResult({
  success,
  signature,
  message,
  addresses = {},
  cluster = "devnet",
  onRetry,
}: TransactionResultProps) {
  if (!message) return null;

  const explorerUrl = signature
    ? `https://explorer.solana.com/tx/${signature}?cluster=${cluster}`
    : null;

  if (success) {
    return (
      <div className="p-4 bg-green-950/50 border border-green-800 rounded-lg space-y-3">
        <div className="flex items-center gap-2 text-green-400">
          <CheckCircle className="w-4 h-4" />
          <span className="font-medium">Success</span>
        </div>
        <p className="text-sm text-green-300 whitespace-pre-wrap">{message}</p>
        {Object.keys(addresses).length > 0 && (
          <div className="space-y-1">
            {Object.entries(addresses).map(([label, addr]) => (
              <div key={label} className="flex justify-between text-xs">
                <span className="text-slate-400">{label}:</span>
                <span className="text-slate-200 font-mono break-all">{addr}</span>
              </div>
            ))}
          </div>
        )}
        {explorerUrl && (
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-green-400 hover:text-green-300 underline"
          >
            View on Explorer <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 bg-red-950/50 border border-red-800 rounded-lg space-y-3">
      <div className="flex items-center gap-2 text-red-400">
        <AlertCircle className="w-4 h-4" />
        <span className="font-medium">Error</span>
      </div>
      <p className="text-sm text-red-300 whitespace-pre-wrap">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="gap-1">
          <RefreshCw className="w-3 h-3" /> Retry
        </Button>
      )}
    </div>
  );
}
