"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { ShoppingBag, User, LogOut, Menu, UtensilsCrossed } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Browse Meals", href: "/meals" },
    { name: "Providers", href: "/providers" },
  ];

  if (user?.role === "PROVIDER") {
    navLinks.push({ name: "My Dashboard", href: "/provider/dashboard" });
    navLinks.push({ name: "My Menu", href: "/provider/menu" });
  } else if (user?.role === "ADMIN") {
    navLinks.push({ name: "Admin Panel", href: "/admin/dashboard" });
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-10 w-10 bg-[#FF5200] rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
            <UtensilsCrossed size={24} />
          </div>
          <span className="text-2xl font-extra-bold tracking-tight text-[#1C1C1C]">
            Food<span className="text-[#FF5200]">Hub</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-gray-600 hover:text-[#FF5200] transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingBag size={20} />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-[#FF5200] text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white font-bold">
                      {totalItems}
                    </span>
                  )}
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="ghost" size="icon">
                  <User size={20} />
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={logout} className="rounded-xl border-gray-200 text-gray-600 hover:border-red-500 hover:text-red-500">
                <LogOut size={16} className="mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="font-bold">Login</Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="rounded-xl">Register</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-gray-600"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "md:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 transition-all duration-300 overflow-hidden",
        isMenuOpen ? "max-h-[500px] opacity-100 py-6" : "max-h-0 opacity-0"
      )}>
        <div className="container mx-auto px-4 flex flex-col space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="text-lg font-medium text-gray-800"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 flex flex-col space-y-3">
            {user ? (
              <>
                <Link href="/cart" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-start h-12">
                    <ShoppingBag className="mr-3" size={20} />
                    Cart ({totalItems})
                  </Button>
                </Link>
                <Button variant="destructive" className="w-full justify-start h-12" onClick={() => { logout(); setIsMenuOpen(false); }}>
                  <LogOut className="mr-3" size={20} />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Login</Button>
                </Link>
                <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full">Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav >
  );
}
