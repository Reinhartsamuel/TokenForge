import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";

export default function Lp1Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TooltipProvider>
      {children}
      <Toaster position="top-right" richColors />
    </TooltipProvider>
  );
}
