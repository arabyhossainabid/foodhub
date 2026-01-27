"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Utensils, ShoppingCart, Settings, LogOut, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

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

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-gray-50/50">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-100 hidden lg:flex flex-col sticky top-20 h-[calc(100vh-80px)]">
        <div className="p-8 grow space-y-8">
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Main Menu</p>
            <nav className="space-y-1">
              {items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group",
                      isActive
                        ? "bg-[#FF5200] text-white shadow-lg shadow-orange-500/20"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <span className={cn("transition-transform duration-300 group-hover:scale-110", isActive ? "text-white" : "text-gray-400")}>
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

          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Account</p>
            <nav className="space-y-1">
              <Link href="/profile" className="flex items-center space-x-3 px-4 py-3.5 rounded-2xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all font-bold text-sm">
                <Settings size={20} className="text-gray-400" />
                <span>Settings</span>
              </Link>
              <button
                onClick={logout}
                className="w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-bold text-sm"
              >
                <LogOut size={20} />
                <span>Sign Out</span>
              </button>
            </nav>
          </div>
        </div>

        {/* User Profile Mini */}
        <div className="p-6 border-t border-gray-100 mx-4 mb-4 bg-gray-50 rounded-3xl flex items-center space-x-4">
          <div className="h-10 w-10 bg-[#FF5200] rounded-full flex items-center justify-center text-white font-bold">
            {user?.name.charAt(0)}
          </div>
          <div className="flex flex-col min-w-0">
            <p className="text-sm font-black text-gray-900 truncate">{user?.name}</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{user?.role}</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="grow p-6 lg:p-12 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
