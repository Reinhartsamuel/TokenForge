"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { shortenAddress, copyToClipboard } from "@/lib/address";

interface AddressLabelProps {
  address: string;
  chars?: number;
  className?: string;
}

export function AddressLabel({ address, chars = 4, className = "" }: AddressLabelProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await copyToClipboard(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <span className={`inline-flex items-center gap-1.5 font-mono text-sm ${className}`}>
      <span>{shortenAddress(address, chars)}</span>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <span
              className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleCopy();
              }}
            >
              {copied ? (
                <Check className="h-3 w-3 text-green-600" />
              ) : (
                <Copy className="h-3 w-3 text-slate-500" />
              )}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-mono text-xs">{address}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </span>
  );
}
