"use client";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { ShoppingBag, User, LogOut, Menu, X, UtensilsCrossed, Truck, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Browse Meals", href: "/meals" },
    { name: "Our Kitchens", href: "/providers" },
  ];

  if (user?.role === "PROVIDER") {
    navLinks.push({ name: "My Dashboard", href: "/provider/dashboard" });
    navLinks.push({ name: "My Menu", href: "/provider/menu" });
  } else if (user?.role === "ADMIN") {
    navLinks.push({ name: "Admin Panel", href: "/admin/dashboard" });
  } else if (user?.role === "CUSTOMER") {
    navLinks.push({ name: "My Orders", href: "/orders" });
  }

  return (
    <nav className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300 border-b",
      isScrolled ? "bg-white/95 backdrop-blur-md shadow-md h-16 border-gray-100/50" : "bg-white h-20 border-gray-100"
    )}>
      <div className="container mx-auto px-2 md:px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="md:h-10 md:w-10 h-8 w-8 bg-orange-500 rounded-md flex items-center justify-center text-white">
            <UtensilsCrossed size={22} strokeWidth={2.5} />
          </div>
          <span className="md:text-2xl text-lg font-black text-gray-900 tracking-tight">
            Food<span className="text-orange-500">Hub</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-1">
          {user?.role === "PROVIDER" ? (
            <Link href="/provider/dashboard">
              <Button variant="ghost" className="font-bold text-gray-600 hover:text-orange-500 rounded-md px-6">
                Provider Dashboard
              </Button>
            </Link>
          ) : user?.role === "ADMIN" ? (
            <Link href="/admin/dashboard">
              <Button variant="ghost" className="font-bold text-gray-600 hover:text-orange-500 rounded-md px-6">
                Admin Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/meals">
                <Button variant="ghost" className="font-bold text-gray-600 hover:text-orange-500 rounded-md px-6">
                  Explore Meals
                </Button>
              </Link>
              <Link href="/providers">
                <Button variant="ghost" className="font-bold text-gray-600 hover:text-orange-500 rounded-md px-6">
                  Restaurants
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2">
          {user ? (
            <>
              {/* Only Customers see the Cart */}
              {user.role === "CUSTOMER" && (
                <>
                  <Link href="/orders">
                    <Button variant="ghost" size="icon" className="hover:bg-orange-50 rounded-md" title="Track Orders">
                      <Truck size={20} className="text-gray-600" />
                    </Button>
                  </Link>
                  <Link href="/cart">
                    <Button variant="ghost" size="icon" className="relative hover:bg-orange-50 rounded-md">
                      <ShoppingBag size={20} className="text-gray-600" />
                      {totalItems > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 bg-orange-500 text-white text-xs flex items-center justify-center rounded-full border-2 border-white font-bold animate-in zoom-in">
                          {totalItems}
                        </span>
                      )}
                    </Button>
                  </Link>
                </>
              )}

              <div className="h-8 w-px bg-gray-100 mx-2" />

              <div className="flex items-center space-x-1">
                <Link href="/profile">
                  <Button variant="ghost" size="icon" className="hover:bg-orange-50 rounded-md" title="Profile">
                    <User size={20} className="text-gray-600" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="rounded-md border-gray-200 text-gray-600 hover:border-red-500 hover:text-red-500 hover:bg-red-50 font-bold transition-all"
                >
                  <LogOut size={18} className="mr-2" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-3">
              <Link href="/login">
                <Button variant="ghost" className="font-bold rounded-md px-6">Login</Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="rounded-md shadow-lg shadow-orange-500/30">Register</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden p-2 text-gray-600 hover:text-orange-500 transition-colors bg-gray-50 rounded-md"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-2xl transition-all duration-300 ease-in-out origin-top",
        isMenuOpen ? "scale-y-100 opacity-100 pointer-events-auto" : "scale-y-0 opacity-0 pointer-events-none"
      )}>
        <div className="container mx-auto px-4 py-8 flex flex-col space-y-6">
          <div className="flex flex-col space-y-2">
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-2">Navigation</p>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="group flex items-center justify-between p-4 rounded-md hover:bg-orange-50 transition-all"
              >
                <span className="text-lg font-bold text-gray-800 group-hover:text-orange-500">{link.name}</span>
                <ChevronRight size={18} className="text-gray-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
          <div className="pt-4 flex flex-col space-y-3">
            {user ? (
              <>
                <Link href="/orders" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-start h-12">
                    <Truck className="mr-3" size={20} />
                    Track My Orders
                  </Button>
                </Link>
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
    </nav>
  );
}
