"use client";

import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Calculator,
  CreditCard,
  ClipboardList,
  Landmark,
  BarChart,
  Leaf,
} from "lucide-react";
import Link from "next/link";

const menuItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/staff", label: "Staff", icon: Users },
    { href: "/attendance", label: "Attendance", icon: CalendarCheck },
    { href: "/salary", label: "Salary", icon: Calculator },
    { href: "/payments", label: "Payments", icon: CreditCard },
    { href: "/activities", label: "Activities", icon: ClipboardList },
    { href: "/expenses", label: "Expenses", icon: Landmark },
    { href: "/reports", label: "Reports", icon: BarChart },
];

export function MainSidebar({ pathname }: { pathname: string }) {
  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="h-8 w-8 p-0" asChild>
             <Link href="/">
               <Leaf className="w-6 h-6 text-primary" />
             </Link>
          </Button>
          <h1 className="text-xl font-headline font-semibold">Malwad Farm</h1>
          <div className="grow" />
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/")}
                tooltip={{ children: item.label }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-2 p-2 text-xs text-sidebar-foreground/70">
            <Leaf className="w-4 h-4" />
            <span>Malwad Farm v1.0</span>
        </div>
      </SidebarFooter>
    </>
  );
}
