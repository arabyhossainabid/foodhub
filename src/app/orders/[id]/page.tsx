"use client";

import { useEffect, useState, use } from "react";
import api from "@/lib/axios";
import { Order } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, cn } from "@/lib/utils";
import {
  ShoppingBag,
  Clock,
  Package,
  CheckCircle2,
  Truck,
  XCircle,
  MapPin,
  ArrowLeft,
  Star,
  FileText,
  Calendar
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

const statusConfig = {
  PLACED: { icon: <Clock size={24} />, color: "text-blue-600", bg: "bg-blue-50", label: "Order Placed", desc: "Your order has been received and is waiting for provider acceptance." },
  PREPARING: { icon: <Package size={24} />, color: "text-orange-600", bg: "bg-orange-50", label: "Preparing", desc: "The chef is crafting your meal with care." },
  READY: { icon: <CheckCircle2 size={24} />, color: "text-purple-600", bg: "bg-purple-50", label: "Ready", desc: "Your meal is ready and waiting for pickup or delivery." },
  DELIVERED: { icon: <Truck size={24} />, color: "text-green-600", bg: "bg-green-50", label: "Delivered", desc: "Bon appétit! Your meal has reached its destination." },
  CANCELLED: { icon: <XCircle size={24} />, color: "text-red-600", bg: "bg-red-50", label: "Cancelled", desc: "This order has been cancelled." },
};

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data.data);
      } catch (error) {
        toast.error("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF5200]"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-32 text-center space-y-6">
        <h1 className="text-4xl font-black text-gray-900">Order not found</h1>
        <Link href="/orders">
          <Button variant="outline">Back to My Orders</Button>
        </Link>
      </div>
    );
  }

  const currentStatus = statusConfig[order.status as keyof typeof statusConfig];

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="mb-12">
        <Link href="/orders" className="text-[#FF5200] font-bold flex items-center group">
          <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" /> My Orders
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between mt-4 gap-4">
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter">Order <span className="text-gradient">#{order.id.slice(-6).toUpperCase()}</span></h1>
          <div className={cn("px-6 py-2 rounded-2xl font-black text-sm uppercase tracking-widest shadow-sm", currentStatus.bg, currentStatus.color)}>
            {currentStatus.label}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Side: Status & Items */}
        <div className="lg:col-span-2 space-y-8">
          {/* Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="premium-card p-10 flex items-start space-x-6 relative overflow-hidden"
          >
            <div className={cn("h-16 w-16 rounded-[1.5rem] flex items-center justify-center shrink-0 shadow-lg", currentStatus.bg, currentStatus.color)}>
              {currentStatus.icon}
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black">{currentStatus.label}</h3>
              <p className="text-gray-500 font-medium leading-relaxed">{currentStatus.desc}</p>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF5200]/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
          </motion.div>

          {/* Items Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="premium-card p-10 space-y-8"
          >
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                <ShoppingBag size={20} />
              </div>
              <h3 className="text-xl font-black">Ordered Items</h3>
            </div>

            <div className="space-y-6">
              {order.orderItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors group">
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 rounded-2xl overflow-hidden shadow-sm">
                      <img src={item.meal.image} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{item.meal.title}</h4>
                      <p className="text-xs font-black text-[#FF5200] uppercase tracking-widest">{item.quantity} x {formatCurrency(item.price)}</p>
                    </div>
                  </div>
                  <span className="font-black text-gray-900">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between gap-6">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Delivery Address</p>
                <div className="flex items-start text-sm font-bold text-gray-700">
                  <MapPin size={16} className="mr-2 text-[#FF5200] shrink-0 mt-0.5" />
                  {order.address}
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Total Amount</p>
                <p className="text-4xl font-black text-[#FF5200]">{formatCurrency(order.totalAmount)}</p>
                <p className="text-xs font-bold text-green-500 uppercase tracking-widest mt-1">Paid via Cash</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Timeline/Meta */}
        <aside className="space-y-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="premium-card p-10 space-y-8 sticky top-24"
          >
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <FileText size={20} className="text-[#FF5200]" />
                <h4 className="text-lg font-black">Order Summary</h4>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Date Placed</span>
                  <div className="flex items-center font-bold text-gray-700">
                    <Calendar size={14} className="mr-2" />
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Items</span>
                  <span className="font-bold text-gray-700">{order.orderItems.length} Products</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Payment</span>
                  <span className="font-bold text-gray-700">COD</span>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-50 space-y-4">
              <Button variant="outline" className="w-full rounded-2xl h-12 font-bold border-gray-100 hover:bg-orange-50 hover:text-[#FF5200] hover:border-orange-100">
                Download Invoice
              </Button>
              <Link href="/meals">
                <Button className="w-full rounded-2xl h-14 font-black mt-2">
                  Order Something Else
                </Button>
              </Link>
            </div>

            <div className="pt-6 flex flex-col items-center justify-center text-center">
              <div className="h-1 w-12 bg-gray-100 rounded-full mb-4"></div>
              <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Expected Delivery: 45 Mins</p>
            </div>
          </motion.div>
        </aside>
      </div>
    </div>
  );
}
