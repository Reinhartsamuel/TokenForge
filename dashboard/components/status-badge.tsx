import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const statusVariants = cva("capitalize", {
  variants: {
    variant: {
      active: "bg-green-500/10 text-green-400 border-green-500/20",
      paused: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      frozen: "bg-red-500/10 text-red-400 border-red-500/20",
      pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      confirmed: "bg-green-500/10 text-green-400 border-green-500/20",
      failed: "bg-red-500/10 text-red-400 border-red-500/20",
      completed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      cancelled: "bg-slate-500/10 text-slate-400 border-slate-500/20",
      allowlist: "bg-green-500/10 text-green-400 border-green-500/20",
      blocklist: "bg-red-500/10 text-red-400 border-red-500/20",
      devnet: "bg-sky-500/10 text-sky-400 border-sky-500/20",
      mainnet: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      create: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      mint: "bg-green-500/10 text-green-400 border-green-500/20",
      transfer: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
      policy_create: "bg-violet-500/10 text-violet-400 border-violet-500/20",
      policy_allowlist: "bg-violet-500/10 text-violet-400 border-violet-500/20",
      policy_blocklist: "bg-violet-500/10 text-violet-400 border-violet-500/20",
      distribution_create: "bg-orange-500/10 text-orange-400 border-orange-500/20",
      distribution_claim: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    },
  },
  defaultVariants: {
    variant: "active",
  },
});

interface StatusBadgeProps extends VariantProps<typeof statusVariants> {
  status: string;
  className?: string;
}

export function StatusBadge({ status, variant, className }: StatusBadgeProps) {
  const resolvedVariant = variant || (status as any);
  return (
    <Badge className={cn(statusVariants({ variant: resolvedVariant }), className)}>
      {status}
    </Badge>
  );
}
