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
      <aside className="w-80 bg-white border-r border-gray-100 hidden lg:flex flex-col sticky top-20 h-[calc(100vh-80px)] shadow-sm">
        <div className="p-10 grow space-y-10">
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
                      "flex items-center justify-between px-5 py-4 rounded-[1.5rem] transition-all duration-500 group",
                      isActive
                        ? "bg-[#FF5200] text-white shadow-xl shadow-orange-500/30"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <div className="flex items-center space-x-4">
                      <span className={cn("transition-transform duration-500 group-hover:scale-110", isActive ? "text-white" : "text-gray-400")}>
                        {item.icon}
                      </span>
                      <span className="font-black text-sm tracking-tight">{item.title}</span>
                    </div>
                    {isActive && <ChevronRight size={18} className="animate-in slide-in-from-left-2" />}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-4">System</p>
            <nav className="space-y-2">
              <Link href="/profile" className="flex items-center space-x-4 px-5 py-4 rounded-[1.5rem] text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all font-black text-sm group">
                <Settings size={20} className="text-gray-400 group-hover:rotate-45 transition-transform duration-500" />
                <span>Account Profile</span>
              </Link>
              <button
                onClick={logout}
                className="w-full flex items-center space-x-4 px-5 py-4 rounded-[1.5rem] text-red-500 hover:bg-red-50 transition-all font-black text-sm group"
              >
                <LogOut size={20} className="group-hover:-translate-x-1 transition-transform duration-500" />
                <span>Terminate Session</span>
              </button>
            </nav>
          </div>
        </div>

        {/* User Profile Mini */}
        <div className="p-8 border-t border-gray-100 mx-6 mb-6 bg-gray-50 rounded-[2.5rem] flex items-center space-x-4 shadow-sm hover:premium-shadow transition-all duration-500 cursor-pointer group">
          <div className="h-12 w-12 bg-[#FF5200] rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-orange-500/20 group-hover:rotate-12 transition-transform">
            {user?.name.charAt(0)}
          </div>
          <div className="flex flex-col min-w-0">
            <p className="text-sm font-black text-gray-900 truncate">{user?.name}</p>
            <p className="text-[10px] font-black text-[#FF5200] uppercase tracking-widest">{user?.role}</p>
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
