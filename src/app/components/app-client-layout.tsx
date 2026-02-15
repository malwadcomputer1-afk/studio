"use client";
import { usePathname } from 'next/navigation';
import { Sidebar, SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { MainSidebar } from '@/app/components/main-sidebar';
import React from 'react';

export function AppClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  return (
    <SidebarProvider>
      <Sidebar>
        <MainSidebar pathname={pathname} />
      </Sidebar>
      <SidebarInset>
        <main className="p-4 sm:p-6 lg:p-8 h-full bg-background">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
