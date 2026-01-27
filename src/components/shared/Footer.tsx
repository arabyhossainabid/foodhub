import Link from "next/link";
import { UtensilsCrossed, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#1C1C1C] text-white pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-10 w-10 bg-[#FF5200] rounded-md flex items-center justify-center text-white">
                <UtensilsCrossed size={22} strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-bold tracking-tight">
                Food<span className="text-[#FF5200]">Hub</span>
              </span>
            </Link>
            <p className="text-gray-400 leading-relaxed">
              Order your favorite meals from the best local restaurants and food providers. Fast delivery and fresh food guaranteed.
            </p>
            <div className="flex items-center space-x-4">
              <Link href="#" className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#FF5200] transition-colors">
                <Facebook size={18} />
              </Link>
              <Link href="#" className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#FF5200] transition-colors">
                <Twitter size={18} />
              </Link>
              <Link href="#" className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#FF5200] transition-colors">
                <Instagram size={18} />
              </Link>
              <Link href="#" className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#FF5200] transition-colors">
                <Youtube size={18} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link href="/meals" className="text-gray-400 hover:text-white transition-colors">Browse Meals</Link></li>
              <li><Link href="/login" className="text-gray-400 hover:text-white transition-colors">Sign In</Link></li>
              <li><Link href="/register" className="text-gray-400 hover:text-white transition-colors">Join as Provider</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-bold mb-6">Popular Categories</h4>
            <ul className="space-y-4">
              <li><Link href="/meals?categoryId=burger" className="text-gray-400 hover:text-white transition-colors">Burgers</Link></li>
              <li><Link href="/meals?categoryId=pizza" className="text-gray-400 hover:text-white transition-colors">Pizza</Link></li>
              <li><Link href="/meals?categoryId=sushi" className="text-gray-400 hover:text-white transition-colors">Sushi</Link></li>
              <li><Link href="/meals?categoryId=dessert" className="text-gray-400 hover:text-white transition-colors">Desserts</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-bold mb-6">Subscription</h4>
            <p className="text-gray-400 mb-6 font-medium">Subscribe for weekly recipes and exclusive discounts.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-800 border-none rounded-md px-4 py-3 text-sm focus:ring-1 focus:ring-[#FF5200] outline-none"
              />
              <button className="bg-[#FF5200] text-white py-3 rounded-md font-bold hover:bg-[#E64A00] transition-all px-8">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-gray-500 text-sm">
          <p>© 2026 FoodHub. All rights reserved.</p>
          <div className="flex space-x-8">
            <Link href="#" className="hover:text-white">Privacy Policy</Link>
            <Link href="#" className="hover:text-white">Terms of Service</Link>
            <Link href="#" className="hover:text-white">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
