"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Utensils, ShoppingCart, Settings, LogOut, ChevronRight, Menu as MenuIcon, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import React, { useState } from "react";

interface SidebarProps {
  items: {
    title: string;
    href: string;
    icon: React.ReactNode;
  }[];
}

export function DashboardLayout({ children, items }: { children: React.ReactNode; items: SidebarProps["items"] }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] bg-gray-50/30 relative">
      {/* Mobile Sidebar Header */}
      <div className="lg:hidden bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-20 z-40">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-orange-500 rounded-md flex items-center justify-center text-white font-bold text-sm">
            {user?.name?.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">{user?.role} Panel</p>
          </div>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-gray-600 hover:text-orange-500 transition-colors"
        >
          {isSidebarOpen ? <X size={24} /> : <MenuIcon size={24} />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "w-80 bg-white border-r border-gray-100 flex flex-col fixed lg:sticky top-20 h-[calc(100vh-80px)] z-50 transition-transform duration-300",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-8 grow space-y-8">
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-4">Management</p>
            <nav className="space-y-2">
              {items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={cn(
                      "flex items-center justify-between px-4 py-3 rounded-md transition-all group",
                      isActive
                        ? "bg-orange-500 text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-50 hover:text-orange-500"
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <span className={cn(isActive ? "text-white" : "text-gray-400")}>
                        {item.icon}
                      </span>
                      <span className="font-bold text-sm tracking-tight">{item.title}</span>
                    </div>
                    {isActive && <ChevronRight size={16} />}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-4">System</p>
            <nav className="space-y-2">
              <Link href="/profile" className="flex items-center space-x-3 px-4 py-3 rounded-md text-gray-600 hover:bg-gray-50 hover:text-orange-500 transition-all font-bold text-sm group">
                <Settings size={20} className="text-gray-400" />
                <span>Account Profile</span>
              </Link>
              <button
                onClick={logout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-md text-red-500 hover:bg-red-50 transition-all font-bold text-sm group"
              >
                <LogOut size={20} />
                <span>Sign Out</span>
              </button>
            </nav>
          </div>
        </div>

        {/* User Profile Mini */}
        <div className="p-6 border-t border-gray-100 mx-4 mb-4 bg-gray-50 rounded-md flex items-center space-x-3 transition-colors cursor-pointer group">
          <div className="h-10 w-10 bg-orange-500 rounded-md flex items-center justify-center text-white font-bold text-lg shadow-md">
            {user?.name?.charAt(0)}
          </div>
          <div className="flex flex-col min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
            <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">{user?.role}</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="grow p-8 lg:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
