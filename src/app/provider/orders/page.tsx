"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import {
  LayoutDashboard,
  Utensils,
  ShoppingCart,
  Clock,
  CheckCircle2,
  Truck,
  Package,
  ArrowRight,
  User,
  MapPin,
  XCircle,
  ShoppingBag
} from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Order } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, cn } from "@/lib/utils";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const providerNavItems = [
  { title: "Dashboard", href: "/provider/dashboard", icon: <LayoutDashboard size={20} /> },
  { title: "Manage Menu", href: "/provider/menu", icon: <Utensils size={20} /> },
  { title: "Order List", href: "/provider/orders", icon: <ShoppingCart size={20} /> },
];

const statusStyles = {
  PLACED: "bg-blue-100 text-blue-700",
  PREPARING: "bg-orange-100 text-orange-700",
  READY: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function ProviderOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get("/provider/orders");
      setOrders(res.data.data);
    } catch (error) {
      toast.error("Failed to load your orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId: string, status: string) => {
    try {
      await api.patch(`/provider/orders/${orderId}`, { status });
      toast.success(`Order is now ${status}`);
      fetchOrders();
    } catch (error: any) {
      toast.error("Failed to update status");
    }
  };

  const filteredOrders = filter === "ALL" ? orders : orders.filter(o => o.status === filter);

  return (
    <DashboardLayout items={providerNavItems}>
      <div className="space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-gray-900 tracking-tighter">Live <span className="text-gradient">Orders</span></h1>
            <p className="text-gray-500 font-medium text-lg">Manage your kitchen workflow and track every delivery in real-time.</p>
          </div>

          <div className="flex items-center space-x-2 bg-white/50 backdrop-blur-sm p-1.5 rounded-[1.5rem] border border-gray-100 shadow-sm overflow-x-auto">
            {["ALL", "PLACED", "PREPARING", "READY", "DELIVERED"].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={cn(
                  "px-5 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300",
                  filter === s
                    ? "bg-[#FF5200] text-white shadow-lg shadow-orange-500/20"
                    : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-[2.5rem]"></div>
            ))
          ) : filteredOrders.length > 0 ? (
            <AnimatePresence>
              {filteredOrders.map((order, idx) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card className="premium-card group overflow-hidden border-none shadow-sm">
                    <CardContent className="p-8 flex flex-col lg:flex-row items-center gap-12">
                      {/* Icon & ID */}
                      <div className="flex items-center space-x-6 min-w-0 w-full lg:w-1/4">
                        <div className="h-20 w-20 bg-orange-50 rounded-3xl flex items-center justify-center text-[#FF5200] shrink-0 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                          <ShoppingBag size={32} />
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Order ID</p>
                          <h3 className="text-xl font-black text-gray-900 tracking-tight leading-none group-hover:text-[#FF5200] transition-colors uppercase">#{order.id.slice(-8)}</h3>
                          <p className="text-xs font-bold text-gray-400 lowercase italic">received just now</p>
                        </div>
                      </div>

                      {/* Customer & Address */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:flex grow gap-8 w-full">
                        <div className="space-y-2 lg:w-48">
                          <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Customer</p>
                          <div className="flex items-start space-x-2">
                            <User size={16} className="text-[#FF5200] mt-0.5 shrink-0" />
                            <p className="text-sm font-bold text-gray-700 leading-tight">{order.user?.name || "Guest"}</p>
                          </div>
                        </div>

                        <div className="space-y-2 lg:w-48">
                          <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Destination</p>
                          <div className="flex items-start space-x-2">
                            <MapPin size={16} className="text-[#FF5200] mt-0.5 shrink-0" />
                            <p className="text-sm font-bold text-gray-700 leading-tight line-clamp-2">{order.address}</p>
                          </div>
                        </div>

                        <div className="space-y-2 lg:w-40">
                          <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Financials</p>
                          <p className="text-2xl font-black text-gray-900 tracking-tighter">{formatCurrency(order.totalAmount)}</p>
                          <p className="text-[9px] font-black text-[#FF5200] uppercase tracking-widest bg-orange-50 px-2 py-0.5 rounded-full inline-block">Credit Card</p>
                        </div>

                        <div className="space-y-2 lg:w-40">
                          <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Current Status</p>
                          <div className={cn(
                            "inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm",
                            statusStyles[order.status as keyof typeof statusStyles]
                          )}>
                            <div className="h-1.5 w-1.5 rounded-full bg-current mr-2 animate-pulse"></div>
                            {order.status}
                          </div>
                        </div>
                      </div>

                      {/* Items Toggle (Always visible but compact) */}
                      <div className="lg:w-48 space-y-2 bg-gray-50/50 p-4 rounded-2xl">
                        <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest mb-2">Order Content</p>
                        <div className="space-y-2 max-h-24 overflow-y-auto pr-2 custom-scrollbar">
                          {order.orderItems?.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-xs">
                              <span className="font-bold text-gray-700 truncate mr-2">{item.meal?.title}</span>
                              <span className="font-black text-[#FF5200]">x{item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="shrink-0 flex items-center space-x-3 w-full lg:w-auto pt-8 lg:pt-0 border-t lg:border-t-0 border-gray-50 overflow-x-auto pb-2 lg:pb-0">
                        {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                          <>
                            {order.status === 'PLACED' && (
                              <Button
                                size="lg"
                                className="rounded-xl font-black px-8 bg-[#FF5200] hover:bg-[#E64A00] h-14 shadow-xl shadow-orange-500/20 whitespace-nowrap"
                                onClick={() => updateStatus(order.id, 'PREPARING')}
                              >
                                Accept & Cook
                              </Button>
                            )}
                            {order.status === 'PREPARING' && (
                              <Button
                                size="lg"
                                className="rounded-xl font-black px-8 bg-purple-600 hover:bg-purple-700 h-14 shadow-xl shadow-purple-500/20 whitespace-nowrap"
                                onClick={() => updateStatus(order.id, 'READY')}
                              >
                                Ready to Send
                              </Button>
                            )}
                            {order.status === 'READY' && (
                              <Button
                                size="lg"
                                className="rounded-xl font-black px-8 bg-green-600 hover:bg-green-700 h-14 shadow-xl shadow-green-500/20 whitespace-nowrap"
                                onClick={() => updateStatus(order.id, 'DELIVERED')}
                              >
                                Handed to Hero
                              </Button>
                            )}
                            <Button
                              size="lg"
                              variant="ghost"
                              className="rounded-xl font-black px-8 text-red-500 hover:bg-red-50 h-14 whitespace-nowrap"
                              onClick={() => updateStatus(order.id, 'CANCELLED')}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {(order.status === 'DELIVERED' || order.status === 'CANCELLED') && (
                          <div className="h-14 flex items-center px-8 bg-gray-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Archived Flow
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <div className="py-48 text-center bg-white rounded-[4rem] border-2 border-gray-50 border-dashed space-y-8 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 space-y-8">
                <div className="h-24 w-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center text-gray-200 mx-auto group-hover:scale-110 transition-transform duration-500">
                  <Clock size={48} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-black text-gray-900 tracking-tight leading-none">Silent Kitchen</h3>
                  <p className="text-gray-400 font-medium max-w-sm mx-auto">New orders from your hungry customers will materialize here as soon as they are placed.</p>
                </div>
                <Button variant="outline" className="rounded-xl h-12 font-black border-gray-100" onClick={fetchOrders}>
                  Check Frequency <ArrowRight className="ml-2" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
