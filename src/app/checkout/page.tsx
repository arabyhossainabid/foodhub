"use client";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { MapPin, ShoppingBag, ArrowLeft, ShieldCheck, CreditCard } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function CheckoutPage() {
  return (
    <ProtectedRoute allowedRoles={["CUSTOMER"]}>
      <CheckoutPageContent />
    </ProtectedRoute>
  );
}

function CheckoutPageContent() {
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (cart.length === 0) {
      router.push("/meals");
    }
  }, [cart, router]);

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error("Please login to place an order");
      router.push("/login");
      return;
    }

    if (!address.trim()) {
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

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-12">
        <Link href="/cart" className="text-[#FF5200] font-bold flex items-center group">
          <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Cart
        </Link>
        <h1 className="text-5xl font-black text-gray-900 mt-4 tracking-tighter">Finalize <span className="text-gradient">Order</span></h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left Side: Forms */}
        <div className="space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="premium-card p-10 space-y-8"
          >
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-orange-50 rounded-2xl flex items-center justify-center text-[#FF5200]">
                <MapPin size={24} />
              </div>
              <h2 className="text-2xl font-black">Delivery Details</h2>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Full Shipping Address</label>
              <textarea
                placeholder="Street name, House #, Apartment, City..."
                className="w-full bg-gray-50 border border-gray-100 rounded-[1.5rem] p-6 text-sm focus:ring-2 focus:ring-[#FF5200]/20 focus:border-[#FF5200] outline-none min-h-[140px] resize-none transition-all"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <p className="text-[10px] text-gray-400 font-medium ml-1">We currently only deliver within the city metropolitan area.</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="premium-card p-10 border-dashed border-2 bg-orange-50/20 border-orange-100"
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-[#FF5200] shadow-sm">
                <CreditCard size={24} />
              </div>
              <h2 className="text-2xl font-black">Payment Method</h2>
            </div>
            <div className="p-6 bg-white rounded-2xl border border-orange-100 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-4 w-4 rounded-full border-4 border-[#FF5200]"></div>
                <span className="font-bold text-gray-900">Cash on Delivery</span>
              </div>
              <span className="text-[10px] font-black text-[#FF5200] uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full">Primary</span>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Summary */}
        <aside>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="sticky top-24 space-y-8"
          >
            <Card className="border-none shadow-2xl shadow-gray-200/50 p-10 rounded-[2.5rem] bg-white">
              <h3 className="text-2xl font-black mb-8">Review Order</h3>

              <div className="space-y-6 max-h-[300px] overflow-y-auto pr-2 mb-8 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-xl overflow-hidden shrink-0">
                        <img src={item.image} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm line-clamp-1">{item.title}</p>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.quantity} units</p>
                      </div>
                    </div>
                    <span className="font-black text-gray-900 text-sm">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-8 border-t border-gray-50 mb-10">
                <div className="flex justify-between text-gray-500 font-bold text-sm uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-gray-500 font-bold text-sm uppercase tracking-widest">
                  <span>Delivery</span>
                  <span className="text-green-500">FREE</span>
                </div>
                <div className="flex justify-between items-end pt-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Grand Total</span>
                    <span className="text-4xl font-black text-[#FF5200]">{formatCurrency(totalPrice)}</span>
                  </div>
                </div>
              </div>

              <Button
                className="w-full h-16 rounded-[1.5rem] text-lg font-black shadow-xl shadow-orange-500/20"
                onClick={handlePlaceOrder}
                isLoading={isLoading}
              >
                Place Secure Order <ShieldCheck className="ml-2" />
              </Button>

              <div className="mt-8 flex items-center justify-center space-x-2 text-gray-400">
                <ShieldCheck size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Satisfaction Guaranteed</span>
              </div>
            </Card>
          </motion.div>
        </aside>
      </div>
    </div>
  );
}
