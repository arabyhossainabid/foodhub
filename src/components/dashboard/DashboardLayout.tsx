"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Utensils, ShoppingCart, Settings, LogOut, ChevronRight, Menu as MenuIcon, X, User as UserIcon } from "lucide-react";
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
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50/50 relative pt-20">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
         <button
           onClick={() => setIsSidebarOpen(!isSidebarOpen)}
           className="h-14 w-14 bg-orange-500 text-white rounded-2xl shadow-2xl flex items-center justify-center active:scale-95 transition-all"
         >
           {isSidebarOpen ? <X size={24} /> : <MenuIcon size={24} />}
         </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-950/40 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Component */}
      <aside className={cn(
        "w-80 bg-white border-r border-gray-100 flex flex-col fixed lg:sticky transition-transform duration-500 ease-in-out",
        "h-[calc(100vh-80px)] top-20",
        "z-40 lg:z-10",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-8 grow space-y-10 overflow-y-auto">
          {/* User Profile Mini Block */}
          <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-4 border border-transparent hover:border-gray-100 transition-all cursor-default">
             <div className="h-12 w-12 bg-gray-900 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-xl">
                {user?.name?.charAt(0)}
             </div>
             <div>
                <p className="text-sm font-black text-gray-900 truncate max-w-[120px]">{user?.name}</p>
                <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">{user?.role} NODE</p>
             </div>
          </div>

          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 ml-4 mb-2">Primary Access</p>
            <nav className="space-y-1">
              {items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={cn(
                      "flex items-center justify-between px-5 py-3.5 rounded-xl transition-all group font-bold text-sm",
                      isActive
                        ? "bg-orange-500 text-white shadow-xl shadow-orange-500/10"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <span className={cn("transition-colors", isActive ? "text-white" : "text-gray-400 group-hover:text-orange-500")}>
                        {item.icon}
                      </span>
                      <span>{item.title}</span>
                    </div>
                    {isActive && <div className="h-1.5 w-1.5 bg-white rounded-full"></div>}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 ml-4 mb-2">Systems & Identity</p>
            <nav className="space-y-1">
              <Link href="/profile" className="flex items-center space-x-3 px-5 py-3.5 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-950 transition-all font-bold text-sm group">
                <UserIcon size={20} className="text-gray-400 group-hover:text-orange-500" />
                <span>Personal Profile</span>
              </Link>
              <button
                onClick={logout}
                className="w-full flex items-center space-x-3 px-5 py-3.5 rounded-xl text-red-500 hover:bg-red-50 transition-all font-bold text-sm group"
              >
                <LogOut size={20} />
                <span>Terminate Session</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Support Section */}
        <div className="p-6 border-t border-gray-50">
           <Link href="/faq" className="block p-4 bg-orange-50 rounded-2xl border border-orange-100/50 group hover:bg-orange-500 transition-all">
              <p className="text-xs font-black text-orange-600 group-hover:text-white mb-1">Need Assistance?</p>
              <p className="text-[10px] font-bold text-orange-400 group-hover:text-white/80 uppercase tracking-widest">Open Support Ticket</p>
           </Link>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="grow p-6 lg:p-12 overflow-y-auto bg-white/40">
        <div className="max-w-6xl mx-auto">
           {children}
        </div>
      </main>
    </div>
  );
}
