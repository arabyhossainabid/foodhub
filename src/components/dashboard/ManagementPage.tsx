"use client";

import { DashboardLayout } from "./DashboardLayout";
import { FullPageLoader } from "@/components/shared/FullPageLoader";
import { cn } from "@/lib/utils";
import React from "react";

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
  containerDataAos?: string;
}

export function ManagementPage({
  title,
  description,
  items,
  children,
  loading = false,
  action,
  className,
  containerDataAos = "fade-up",
}: ManagementPageProps) {
  return (
    <DashboardLayout items={items}>
      <div className={cn("space-y-10", className)} data-aos={containerDataAos}>
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">
              {title.split(" ").map((word, i, arr) => (
                <span key={i}>
                  {i === arr.length - 1 && arr.length > 1 ? (
                    <span className="text-[#FF5200]">{word}</span>
                  ) : (
                    word
                  )}{" "}
                </span>
              ))}
            </h1>
            <p className="text-gray-500 font-medium">{description}</p>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>

        {/* Content Section */}
        <div className="relative min-h-[400px]">
          {children}
        </div>

        {/* Global Loading Overlay */}
        {loading && <FullPageLoader transparent />}
      </div>
    </DashboardLayout>
  );
}
