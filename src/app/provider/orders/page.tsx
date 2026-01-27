"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { LayoutDashboard, Utensils, ShoppingCart, Clock, CheckCircle2, XCircle, Truck, Package, Filter, User, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Order } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, cn } from "@/lib/utils";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";

const providerNavItems = [
  { title: "Dashboard", href: "/provider/dashboard", icon: <LayoutDashboard size={20} /> },
  { title: "Manage Menu", href: "/provider/menu", icon: <Utensils size={20} /> },
  { title: "Order List", href: "/provider/orders", icon: <ShoppingCart size={20} /> },
];

const statusConfig = {
  PLACED: { icon: <Clock size={16} />, color: "bg-blue-100 text-blue-700", label: "New Order" },
  PREPARING: { icon: <Package size={16} />, color: "bg-orange-100 text-orange-700", label: "Preparing" },
  READY: { icon: <CheckCircle2 size={16} />, color: "bg-purple-100 text-purple-700", label: "Ready" },
  DELIVERED: { icon: <Truck size={16} />, color: "bg-green-100 text-green-700", label: "Delivered" },
  CANCELLED: { icon: <XCircle size={16} />, color: "bg-red-100 text-red-700", label: "Cancelled" },
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
      toast.error("Failed to load orders");
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
      toast.success(`Order updated to ${status}`);
      fetchOrders();
    } catch (error: any) {
      toast.error("Failed to update status");
    }
  };

  const filteredOrders = filter === "ALL" ? orders : orders.filter(o => o.status === filter);

  return (
    <DashboardLayout items={providerNavItems}>
      <div className="space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-extra-bold text-gray-900 tracking-tight">Manage Orders</h1>
            <p className="text-gray-500 font-medium">Process and track your incoming food orders.</p>
          </div>

          <div className="flex items-center space-x-2 bg-white p-1 rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
            {["ALL", "PLACED", "PREPARING", "READY", "DELIVERED"].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={cn(
                  "px-4 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all",
                  filter === s ? "bg-[#FF5200] text-white" : "text-gray-400 hover:text-gray-900"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-3xl"></div>)}
            </div>
          ) : filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <Card key={order.id} className="border-none shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group" data-aos="fade-up">
                <div className="flex flex-col lg:flex-row">
                  <div className="p-8 border-r border-gray-50 lg:w-1/3 bg-gray-50/30">
                    <div className="flex justify-between items-start mb-6">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Order ID: #{order.id.slice(-6)}</span>
                      <div className={cn(
                        "flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold",
                        statusConfig[order.status as keyof typeof statusConfig]?.color
                      )}>
                        {statusConfig[order.status as keyof typeof statusConfig]?.icon}
                        <span>{statusConfig[order.status as keyof typeof statusConfig]?.label}</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#FF5200]">
                          <User size={18} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Customer</p>
                          <p className="text-sm font-bold text-gray-900">{order.user?.name || "Guest"}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#FF5200] shrink-0">
                          <MapPin size={18} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Delivery Address</p>
                          <p className="text-sm font-bold text-gray-900 line-clamp-2">{order.address}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 grow">
                    <h4 className="text-sm font-black uppercase text-gray-400 tracking-widest mb-6 border-b border-gray-50 pb-4">Ordered Items</h4>
                    <div className="space-y-4 mb-8">
                      {order.orderItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-center bg-gray-50/50 p-3 rounded-2xl border border-gray-100/50">
                          <div className="flex items-center space-x-4">
                            <span className="h-8 w-8 bg-white rounded-lg flex items-center justify-center font-black text-xs text-[#FF5200] shadow-sm">{item.quantity}x</span>
                            <span className="font-bold text-gray-700">{item.meal.title}</span>
                          </div>
                          <span className="font-black text-gray-900">{formatCurrency(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-gray-50 gap-6">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Total Earnings</span>
                        <span className="text-2xl font-black text-gray-900">{formatCurrency(order.totalAmount)}</span>
                      </div>

                      <div className="flex items-center space-x-3">
                        {order.status === 'PLACED' && (
                          <Button onClick={() => updateStatus(order.id, 'PREPARING')} className="rounded-xl shadow-lg shadow-orange-500/20">Accept & Prepare</Button>
                        )}
                        {order.status === 'PREPARING' && (
                          <Button onClick={() => updateStatus(order.id, 'READY')} className="rounded-xl bg-purple-600 hover:bg-purple-700">Set as Ready</Button>
                        )}
                        {order.status === 'READY' && (
                          <Button onClick={() => updateStatus(order.id, 'DELIVERED')} className="rounded-xl bg-green-600 hover:bg-green-700 font-bold">Mark Delivered</Button>
                        )}
                        {['PLACED', 'PREPARING'].includes(order.status) && (
                          <Button variant="ghost" onClick={() => updateStatus(order.id, 'CANCELLED')} className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl">Cancel</Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center space-y-4 bg-white rounded-3xl border-2 border-dashed border-gray-100">
              <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                <ShoppingCart size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">No orders found</h3>
              <p className="text-gray-500">New orders will show up here as they arrive.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
