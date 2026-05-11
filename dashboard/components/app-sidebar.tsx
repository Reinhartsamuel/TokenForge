"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Coins,
  ShieldCheck,
  Send,
  Activity,
  Settings,
  Plus,
  ChevronRight,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const navItems = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Tokens",
    url: "/dashboard/tokens",
    icon: Coins,
    items: [
      { title: "All Tokens", url: "/dashboard/tokens" },
      { title: "Create Token", url: "/dashboard/tokens/create" },
    ],
  },
  {
    title: "Policies",
    url: "/dashboard/policies",
    icon: ShieldCheck,
  },
  {
    title: "Distributions",
    url: "/dashboard/distributions",
    icon: Send,
  },
  {
    title: "Activity",
    url: "/dashboard/activity",
    icon: Activity,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r border-slate-800 bg-slate-950">
      <SidebarHeader className="border-b border-slate-800 px-4 py-3">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="text-slate-400 hover:text-white" />
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-600">
              <span className="text-sm font-bold text-white">TF</span>
            </div>
            <span className="text-lg font-semibold tracking-tight text-white">TokenForge</span>
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = item.items
                  ? pathname === item.url || pathname?.startsWith(item.url + "/")
                  : pathname === item.url;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.title}
                      onClick={() => window.location.href = item.url}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                      {item.items && (
                        <ChevronRight className="ml-auto h-3 w-3 text-slate-500" />
                      )}
                    </SidebarMenuButton>
                    {item.items && (
                      <SidebarMenuSub>
                        {item.items.map((subItem) => {
                          const isSubActive = pathname === subItem.url;
                          return (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                isActive={isSubActive}
                                onClick={() => window.location.href = subItem.url}
                                className="cursor-pointer"
                              >
                                {subItem.title}
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-800 p-4">
        <div className="flex flex-col gap-3">
          <div className="text-xs text-slate-500">Network</div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-sky-400" />
            <span className="text-sm text-slate-300">Devnet</span>
          </div>
          <div className="mt-1">
            <WalletMultiButton />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
