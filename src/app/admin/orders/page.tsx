"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { LayoutDashboard, Users, Grid, ShoppingBag, Search, Filter, Calendar, MapPin, User, ChevronRight, MoreVertical } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Order } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency, cn } from "@/lib/utils";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { motion } from "framer-motion";

const adminNavItems = [
  { title: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard size={20} /> },
  { title: "User Management", href: "/admin/users", icon: <Users size={20} /> },
  { title: "Categories", href: "/admin/categories", icon: <Grid size={20} /> },
  { title: "All Orders", href: "/admin/orders", icon: <ShoppingBag size={20} /> },
];

const statusConfig = {
  PLACED: { color: "bg-blue-100 text-blue-700", label: "New Order" },
  PREPARING: { color: "bg-orange-100 text-orange-700", label: "In Kitchen" },
  READY: { color: "bg-purple-100 text-purple-700", label: "Ready" },
  DELIVERED: { color: "bg-green-100 text-green-700", label: "Delivered" },
  CANCELLED: { color: "bg-red-100 text-red-700", label: "Cancelled" },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/orders");
      setOrders(res.data.data);
    } catch (error) {
      toast.error("Failed to load platform orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.user?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout items={adminNavItems}>
      <div className="space-y-12" data-aos="fade-up">
        {/* Header section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Global <span className="text-gradient">Orders</span></h1>
            <p className="text-gray-500 font-medium">Monitoring every transaction across the platform.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Input
                placeholder="Search Order ID or User..."
                className="pl-11 rounded-2xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
            <select
              title="Filter by Status"
              className="bg-white border border-gray-100 rounded-2xl px-6 py-2.5 text-sm font-bold text-gray-600 outline-none focus:ring-2 focus:ring-orange-500/20 transition-all cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Status</option>
              <option value="PLACED">Placed</option>
              <option value="PREPARING">Preparing</option>
              <option value="READY">Ready</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders Listing */}
        <div className="space-y-6">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-28 bg-gray-50 animate-pulse rounded-[2rem]"></div>)}
            </div>
          ) : filteredOrders.length > 0 ? (
            filteredOrders.map((order, idx) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
              >
                <Card className="premium-card group hover:scale-[1.01] overflow-hidden border-none shadow-sm">
                  <CardContent className="p-0 flex flex-col lg:flex-row lg:items-center">
                    {/* ID & Status */}
                    <div className="p-8 lg:w-48 bg-gray-50/50 border-b lg:border-b-0 lg:border-r border-gray-100 flex flex-col justify-center space-y-2">
                      <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none">Order ID</span>
                      <span className="font-black text-gray-900 tracking-tight">#{order.id.slice(-6).toUpperCase()}</span>
                      <span className={cn(
                        "text-[9px] w-fit px-2.5 py-1 rounded-full font-black uppercase tracking-widest mt-1 shadow-sm",
                        statusConfig[order.status as keyof typeof statusConfig]?.color
                      )}>
                        {statusConfig[order.status as keyof typeof statusConfig]?.label || order.status}
                      </span>
                    </div>

                    {/* User Info */}
                    <div className="p-8 lg:w-64 border-b lg:border-b-0 lg:border-r border-gray-100 flex items-center space-x-4">
                      <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-[#FF5200] shadow-sm">
                        <User size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Customer</p>
                        <h4 className="font-bold text-gray-900 truncate leading-none">{order.user?.name || "System User"}</h4>
                        <p className="text-xs font-medium text-gray-500 truncate mt-1">{order.user?.email}</p>
                      </div>
                    </div>

                    {/* Logistics */}
                    <div className="p-8 grow flex flex-col justify-center space-y-3">
                      <div className="flex items-center text-sm font-bold text-gray-600">
                        <MapPin size={16} className="text-[#FF5200] mr-3" />
                        <span className="truncate max-w-[200px]">{order.address}</span>
                      </div>
                      <div className="flex items-center text-sm font-bold text-gray-600">
                        <Calendar size={16} className="text-gray-400 mr-3" />
                        <span>{new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                      </div>
                    </div>

                    {/* Financials & Actions */}
                    <div className="p-8 lg:w-64 flex items-center justify-between lg:justify-end gap-12 bg-white">
                      <div className="text-right">
                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Revenue</p>
                        <p className="text-2xl font-black text-[#FF5200] leading-none">{formatCurrency(order.totalAmount)}</p>
                      </div>
                      <Link href={`/orders/${order.id}`}>
                        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl hover:bg-orange-50 group-hover:bg-[#FF5200] group-hover:text-white transition-all">
                          <ChevronRight size={24} />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="py-32 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100 flex flex-col items-center">
              <ShoppingBag size={64} className="text-gray-200 mb-6" />
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">No match found</h3>
              <p className="text-gray-500 font-medium">The system has no records for this query.</p>
              <Button onClick={() => { setSearchTerm(""); setStatusFilter("ALL"); }} variant="link" className="text-[#FF5200] mt-4 font-bold">Clear All Filters</Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
