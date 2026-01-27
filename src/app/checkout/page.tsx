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
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { FullPageLoader } from "@/components/shared/FullPageLoader";

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
        items: orderItems
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
      {isLoading && <FullPageLoader message="Placing your order..." transparent />}
      <div className="mb-12">
        <Link href="/cart" className="text-[#FF5200] font-bold flex items-center group">
          <ArrowLeft size={18} className="mr-2" /> Back to Cart
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mt-4">Finalize Order</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left Side: Forms */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-md shadow-lg border border-gray-100 space-y-6">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-orange-50 rounded-md flex items-center justify-center text-[#FF5200]">
                <MapPin size={24} />
              </div>
              <h2 className="text-xl font-bold">Delivery Details</h2>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Full Shipping Address</label>
              <textarea
                placeholder="Street name, House #, Apartment, City..."
                className="w-full bg-gray-50 border border-gray-100 rounded-md p-4 text-sm focus:ring-2 focus:ring-[#FF5200]/20 focus:border-[#FF5200] outline-none min-h-[120px] resize-none transition-all"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <p className="text-xs text-gray-500">We currently only deliver within the city metropolitan area.</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-md shadow-lg border border-gray-100 space-y-6">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-orange-50 rounded-md flex items-center justify-center text-[#FF5200]">
                <CreditCard size={24} />
              </div>
              <h2 className="text-xl font-bold">Payment Method</h2>
            </div>
            <div className="p-4 bg-orange-50/50 rounded-md border border-orange-100 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-4 w-4 rounded-full bg-[#FF5200]"></div>
                <span className="font-bold text-gray-900">Cash on Delivery</span>
              </div>
              <span className="text-xs font-bold text-[#FF5200] uppercase tracking-wider">Default</span>
            </div>
          </div>
        </div>

        {/* Right Side: Summary */}
        <aside>
          <div className="sticky top-24">
            <Card className="shadow-xl border-gray-100 p-8 rounded-md bg-white space-y-8">
              <h3 className="text-xl font-bold">Review Order</h3>

              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-lg overflow-hidden shrink-0">
                        <img src={item.image} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{item.title}</p>
                        <p className="text-xs text-gray-500">{item.quantity} units</p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900 text-sm">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-gray-100">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-bold">{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Delivery</span>
                  <span className="text-green-600 font-bold">FREE</span>
                </div>
                <div className="flex justify-between items-end pt-4">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Total Amount</span>
                    <span className="text-3xl font-black text-[#FF5200]">{formatCurrency(totalPrice)}</span>
                  </div>
                </div>
              </div>

              <Button
                className="w-full h-14 rounded-md text-lg font-bold shadow-lg shadow-orange-500/20"
                onClick={handlePlaceOrder}
                isLoading={isLoading}
              >
                Place Secure Order
              </Button>
            </Card>

            <div className="mt-8 flex items-center justify-center space-x-2 text-gray-400">
              <ShieldCheck size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Satisfaction Guaranteed</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
