import { WalletContextProvider } from "@/components/wallet-context-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <WalletContextProvider>
      <TooltipProvider>
        <SidebarProvider>
          <AppSidebar />
          <main className="flex-1 overflow-y-auto p-6 bg-background">{children}</main>
          <Toaster position="top-right" richColors />
        </SidebarProvider>
      </TooltipProvider>
    </WalletContextProvider>
  );
}
