"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Utensils, ShoppingCart, Settings, LogOut, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

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
    <div className="flex min-h-[calc(100vh-80px)] bg-gray-50/30">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-gray-100 hidden lg:flex flex-col sticky top-20 h-[calc(100vh-80px)]">
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
                    className={cn(
                      "flex items-center justify-between px-4 py-3 rounded-md transition-all group",
                      isActive
                        ? "bg-[#FF5200] text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-50 hover:text-[#FF5200]"
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
              <Link href="/profile" className="flex items-center space-x-3 px-4 py-3 rounded-md text-gray-600 hover:bg-gray-50 hover:text-[#FF5200] transition-all font-bold text-sm group">
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
          <div className="h-10 w-10 bg-[#FF5200] rounded-md flex items-center justify-center text-white font-bold text-lg shadow-md">
            {user?.name?.charAt(0)}
          </div>
          <div className="flex flex-col min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
            <p className="text-[10px] font-bold text-[#FF5200] uppercase tracking-widest">{user?.role}</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="grow p-8 lg:p-16 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
