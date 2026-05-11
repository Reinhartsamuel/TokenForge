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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className={`inline-flex items-center gap-1.5 font-mono text-sm ${className}`}>
          <span>{shortenAddress(address, chars)}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 hover:bg-slate-700"
            onClick={(e) => {
              e.stopPropagation();
              handleCopy();
            }}
          >
            {copied ? (
              <Check className="h-3 w-3 text-green-400" />
            ) : (
              <Copy className="h-3 w-3 text-slate-400" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-mono text-xs">{address}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
