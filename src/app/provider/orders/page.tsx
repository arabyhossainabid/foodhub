"use client";

import { LayoutDashboard, Utensils, ShoppingCart, Clock, ShoppingBag, Star } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Order } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, cn } from "@/lib/utils";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { ManagementPage } from "@/components/dashboard/ManagementPage";

const providerNavItems = [
  { title: "Dashboard", href: "/provider/dashboard", icon: <LayoutDashboard size={20} /> },
  { title: "Manage Menu", href: "/provider/menu", icon: <Utensils size={20} /> },
  { title: "Order List", href: "/provider/orders", icon: <ShoppingCart size={20} /> },
  { title: "Customer Reviews", href: "/provider/reviews", icon: <Star size={20} /> },
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
    <ManagementPage
      title="Orders"
      description="Manage and track your customer orders."
      items={providerNavItems}
      loading={loading}
      action={
        <div className="flex items-center space-x-1 bg-gray-50 p-1 rounded-md border border-gray-100">
          {["ALL", "PLACED", "PREPARING", "READY", "DELIVERED"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                "px-4 py-2 text-[10px] font-bold uppercase tracking-tight rounded-lg transition-all",
                filter === s
                  ? "bg-white text-[#FF5200] shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-6">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <Card key={order.id} className="border border-gray-100 shadow-sm overflow-hidden">
              <CardContent className="p-6 flex flex-col lg:flex-row items-center gap-8">
                <div className="flex items-center space-x-4 min-w-0 w-full lg:w-1/4">
                  <div className="h-16 w-16 bg-orange-50 rounded-md flex items-center justify-center text-[#FF5200] shrink-0">
                    <ShoppingBag size={28} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-gray-400">Order ID</p>
                    <h3 className="text-lg font-bold text-gray-900 uppercase">#{order.id.slice(-8)}</h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:flex grow gap-6 w-full">
                  <div className="space-y-1 lg:w-40">
                    <p className="text-[10px] font-bold uppercase text-gray-400">Customer</p>
                    <p className="text-sm font-bold text-gray-700 truncate">{order.user?.name || "Guest"}</p>
                  </div>

                  <div className="space-y-1 lg:w-48">
                    <p className="text-[10px] font-bold uppercase text-gray-400">Destination</p>
                    <p className="text-sm font-medium text-gray-600 line-clamp-1">{order.address}</p>
                  </div>

                  <div className="space-y-1 lg:w-32">
                    <p className="text-[10px] font-bold uppercase text-gray-400">Total</p>
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(order.totalAmount)}</p>
                  </div>

                  <div className="space-y-1 lg:w-40">
                    <p className="text-[10px] font-bold uppercase text-gray-400">Status</p>
                    <span className={cn(
                      "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase",
                      statusStyles[order.status as keyof typeof statusStyles]
                    )}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Items Toggle (Always visible but compact) */}
                <div className="lg:w-40 space-y-2 bg-gray-50 p-3 rounded-md border border-gray-100">
                  <p className="text-[9px] font-bold uppercase text-gray-400">Items</p>
                  <div className="space-y-1 max-h-20 overflow-y-auto">
                    {order.orderItems?.map((item, id) => (
                      <div key={id} className="flex justify-between items-center text-[10px]">
                        <span className="font-medium text-gray-600 truncate mr-2">{item.meal?.title}</span>
                        <span className="font-bold text-[#FF5200]">x{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2 w-full lg:w-auto pt-6 lg:pt-0 border-t lg:border-t-0 border-gray-50">
                  {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                    <>
                      {order.status === 'PLACED' && (
                        <Button
                          size="sm"
                          className="rounded-lg font-bold px-4 bg-[#FF5200] hover:bg-[#E64A00]"
                          onClick={() => updateStatus(order.id, 'PREPARING')}
                        >
                          Accept
                        </Button>
                      )}
                      {order.status === 'PREPARING' && (
                        <Button
                          size="sm"
                          className="rounded-lg font-bold px-4 bg-purple-600 hover:bg-purple-700"
                          onClick={() => updateStatus(order.id, 'READY')}
                        >
                          Ready
                        </Button>
                      )}
                      {order.status === 'READY' && (
                        <Button
                          size="sm"
                          className="rounded-lg font-bold px-4 bg-green-600 hover:bg-green-700"
                          onClick={() => updateStatus(order.id, 'DELIVERED')}
                        >
                          Deliver
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="rounded-lg font-bold px-4 text-red-500 hover:bg-red-50"
                        onClick={() => updateStatus(order.id, 'CANCELLED')}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                  {(order.status === 'DELIVERED' || order.status === 'CANCELLED') && (
                    <span className="text-[10px] font-bold uppercase text-gray-400 px-4">Completed</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="py-24 text-center bg-gray-50 rounded-md border-2 border-dashed border-gray-200">
            <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center text-gray-300 mx-auto mb-4 shadow-sm">
              <Clock size={32} />
            </div>
            <div className="space-y-1 mb-6">
              <h3 className="text-xl font-bold text-gray-900">No orders found</h3>
              <p className="text-gray-500 text-sm max-w-xs mx-auto">Customer orders will appear here when they are placed.</p>
            </div>
            <Button variant="outline" className="rounded-md h-10 px-6 font-bold" onClick={fetchOrders}>
              Refresh List
            </Button>
          </div>
        )}
      </div>
    </ManagementPage>
  );
}
