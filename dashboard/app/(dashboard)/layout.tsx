import { WalletContextProvider } from "@/components/wallet-context-provider";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
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
          <SidebarInset className="bg-white">
            <main className="flex-1 overflow-y-auto p-6">{children}</main>
          </SidebarInset>
          <Toaster position="top-right" richColors />
        </SidebarProvider>
      </TooltipProvider>
    </WalletContextProvider>
  );
}
