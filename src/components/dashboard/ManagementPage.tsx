'use client';

import { FullPageLoader } from '@/components/shared/FullPageLoader';
import { cn } from '@/lib/utils';
import React from 'react';
import { DashboardLayout } from './DashboardLayout';

interface ManagementPageProps {
  title: string;
  description: string;
  items: {
    title: string;
    href: string;
    icon: React.ReactNode;
  }[];
  children: React.ReactNode;
  loading?: boolean;
  action?: React.ReactNode;
  className?: string;
}

export function ManagementPage({
  title,
  description,
  items,
  children,
  loading = false,
  action,
  className,
}: ManagementPageProps) {
  return (
    <DashboardLayout items={items}>
      <div className={cn('space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700', className)}>
        {/* Responsive Header Section */}
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-end gap-8 pb-8 border-b border-gray-100'>
          <div className='space-y-2'>
            <div className="flex items-center gap-3 mb-2">
               <div className="h-1.5 w-8 bg-orange-500 rounded-full"></div>
               <span className="text-[10px] font-black uppercase text-gray-400 tracking-[0.4em]">Dashboard Console</span>
            </div>
            <h1 className='text-3xl md:text-4xl font-black text-gray-950 tracking-tight leading-none'>
               {title}
            </h1>
            <p className='text-sm font-medium text-gray-500 max-w-lg'>{description}</p>
          </div>
          {action && <div className='shrink-0'>{action}</div>}
        </div>

        {/* Dynamic Content Buffer */}
        <div className='relative min-h-[500px]'>
           {children}
           {loading && (
             <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 rounded-3xl flex items-center justify-center">
                <FullPageLoader transparent mode='local' />
             </div>
           )}
        </div>
      </div>
    </DashboardLayout>
  );
}
