"use client";

import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  ClipboardPenLine,
  Landmark,
  Tractor,
  DollarSign,
  Leaf,
  FileDown,
} from "lucide-react";
import Link from "next/link";

const menuItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/staff", label: "Staff", icon: Users },
  { href: "/attendance", label: "Attendance", icon: CalendarCheck },
  { href: "/activities", label: "Activities", icon: Tractor },
  { href: "/expenses", label: "Expenses", icon: DollarSign },
  { href: "/salary", label: "Salary", icon: ClipboardPenLine },
  { href: "/payments", label: "Payments", icon: Landmark },
  { href: "/reports", label: "Reports", icon: FileDown },
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
          <h1 className="text-xl font-headline font-semibold">Verdant</h1>
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
    </>
  );
}
