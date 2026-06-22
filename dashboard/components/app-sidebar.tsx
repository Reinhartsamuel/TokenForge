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
  Users,
  FileText,
  Scale,
  BarChart3,
  ArrowLeftRight,
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
    title: "Investors",
    url: "/dashboard/investors",
    icon: Users,
  },
  {
    title: "Corporate Actions",
    url: "/dashboard/corporate-actions",
    icon: FileText,
  },
  {
    title: "Compliance",
    url: "/dashboard/compliance",
    icon: Scale,
  },
  {
    title: "Reports",
    url: "/dashboard/reports",
    icon: BarChart3,
  },
  {
    title: "Transfer Agent",
    url: "/dashboard/transfer-agent",
    icon: ArrowLeftRight,
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
    <Sidebar className="border-r border-slate-200 !bg-white">
      <SidebarHeader className="border-b border-slate-200 px-4 py-3">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="text-slate-500 hover:text-slate-900" />
          <Link href="/dashboard" className="flex items-center gap-2">
            <img src="/anviltokenforge2.webp" alt="TokenForge" className="h-8 w-8" />
            <span className="text-lg font-semibold tracking-tight text-slate-900">TokenForge</span>
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
                      className="flex items-center gap-2 cursor-pointer !text-slate-700 hover:!bg-slate-100 data-[active=true]:!bg-sky-50 data-[active=true]:!text-sky-700"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                      {item.items && (
                        <ChevronRight className="ml-auto h-3 w-3 text-slate-400" />
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
                                className="cursor-pointer !text-slate-600 hover:!bg-slate-100 data-[active=true]:!text-sky-700"
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

      <SidebarFooter className="border-t border-slate-200 p-4">
        <div className="flex flex-col gap-3">
          <div className="text-xs text-slate-500">Network</div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-sky-500" />
            <span className="text-sm text-slate-700">Devnet</span>
          </div>
          <div className="mt-1">
            <WalletMultiButton />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
