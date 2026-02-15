'use client';
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function PageHeader({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
      <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
        <div className="md:hidden">
          <SidebarTrigger />
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold tracking-tight font-headline whitespace-nowrap">{title}</h1>
          {description && <p className="text-muted-foreground mt-1">{description}</p>}
        </div>
        <div className="w-7 h-7 md:hidden" />
      </div>
      <div className="flex-shrink-0 self-end md:self-auto">{children}</div>
    </div>
  );
}
