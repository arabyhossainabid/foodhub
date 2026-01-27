"use client";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, CreditCard } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Please login to place an order");
      router.push("/login");
      return;
    }

    if (!address) {
      toast.error("Please provide a delivery address");
      return;
    }

    setIsLoading(true);
    try {
      const orderItems = cart.map(item => ({
        mealId: item.id,
        quantity: item.quantity,
        price: item.price
      }));

      await api.post("/orders", {
        address,
        orderItems
      });

      toast.success("Order placed successfully!");
      clearCart();
      router.push("/orders/success");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Checkout failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center space-y-6">
        <div className="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
          <ShoppingBag size={48} />
        </div>
        <h1 className="text-4xl font-black text-gray-900">Your Cart is Empty</h1>
        <p className="text-gray-500 max-w-md">Looks like you haven't added anything to your cart yet. Explore our menu and find something delicious!</p>
        <Link href="/meals">
          <Button size="lg" className="rounded-2xl">Browse Meals</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10">
        <Link href="/meals" className="text-[#FF5200] font-bold flex items-center hover:translate-x-[-4px] transition-transform">
          <ArrowLeft size={18} className="mr-2" /> Continue Browsing
        </Link>
        <h1 className="text-5xl font-black text-gray-900 mt-4">My Shopping Cart</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => (
            <Card key={item.id} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-4 flex items-center space-x-6">
                <img
                  src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1760&auto=format&fit=crop"}
                  className="h-24 w-24 rounded-2xl object-cover shrink-0"
                  alt={item.title}
                />
                <div className="grow space-y-1">
                  <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{item.title}</h3>
                  <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">
                    {item.provider?.user.name || "Provider"}
                  </p>
                  <p className="text-[#FF5200] font-black">{formatCurrency(item.price)}</p>
                </div>

                <div className="flex items-center space-x-3 bg-gray-50 p-1 rounded-xl border border-gray-100">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-white hover:text-[#FF5200] transition-all"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="font-bold w-4 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-white hover:text-[#FF5200] transition-all"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className="text-right pl-4">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="h-10 w-10 text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary */}
        <aside className="space-y-6">
          <Card className="border-none shadow-2xl shadow-gray-200/50 bg-[#1C1C1C] text-white p-8 rounded-3xl sticky top-24">
            <h3 className="text-2xl font-bold mb-8 flex items-center">
              <CreditCard size={24} className="mr-3 text-[#FF5200]" />
              Order Summary
            </h3>

            <div className="space-y-4 mb-10">
              <div className="flex justify-between text-gray-400 font-medium">
                <span>Items ({cart.length})</span>
                <span className="text-white">{formatCurrency(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-gray-400 font-medium">
                <span>Delivery Fee</span>
                <span className="text-green-400 font-bold font-mono">FREE</span>
              </div>
              <div className="pt-4 border-t border-gray-800 flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">Total Amount</span>
                  <span className="text-3xl font-black text-[#FF5200]">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <Link href="/checkout">
                <Button
                  className="w-full h-14 rounded-2xl text-lg flex items-center justify-center font-black"
                >
                  Proceed to Checkout <Plus size={20} className="ml-2 rotate-45" />
                </Button>
              </Link>

              <p className="text-[10px] text-center text-gray-500 font-bold uppercase tracking-widest">
                Almost there! Next step: Review & Pay
              </p>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
