"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { LayoutDashboard, Utensils, ShoppingCart, Star, Clock, ArrowUpRight, ArrowDownRight, Package } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const providerNavItems = [
  { title: "Dashboard", href: "/provider/dashboard", icon: <LayoutDashboard size={20} /> },
  { title: "Manage Menu", href: "/provider/menu", icon: <Utensils size={20} /> },
  { title: "Order List", href: "/provider/orders", icon: <ShoppingCart size={20} /> },
];

export default function ProviderDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalMeals: 0,
    totalOrders: 0,
    avgRating: 0,
    earnings: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [mealsRes, ordersRes] = await Promise.all([
          api.get("/provider/meals"), // You might need a specific stats endpoint or calculate from these
          api.get("/provider/orders")
        ]);

        const meals = mealsRes.data.data;
        const orders = ordersRes.data.data;

        setStats({
          totalMeals: meals.length,
          totalOrders: orders.length,
          avgRating: meals.reduce((acc: number, m: any) => acc + (m.averageRating || 0), 0) / (meals.length || 1),
          earnings: orders.reduce((acc: number, o: any) => o.status === 'DELIVERED' ? acc + o.totalAmount : acc, 0)
        });
      } catch (error) {
        console.error("Failed to fetch provider stats");
      }
    };
    fetchStats();
  }, []);

  return (
    <DashboardLayout items={providerNavItems}>
      <div className="space-y-10" data-aos="fade-up">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-4xl font-extra-bold text-gray-900 tracking-tight">Provider Hub</h1>
            <p className="text-gray-500 font-medium">Monitoring your shop&apos;s performance and orders.</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-2xl border border-gray-100 flex items-center space-x-3 shadow-sm">
            <div className="h-8 w-8 bg-green-500/10 rounded-full flex items-center justify-center text-green-600">
              <Clock size={16} />
            </div>
            <span className="text-sm font-bold text-gray-700 uppercase tracking-tighter">Kitchen: <span className="text-green-600">Open</span></span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Total Earnings", value: formatCurrency(stats.earnings), icon: <ArrowUpRight className="text-green-500" />, sub: "Lifetime Earnings" },
            { title: "Active Meals", value: stats.totalMeals, icon: <Utensils className="text-[#FF5200]" />, sub: "Items in menu" },
            { title: "New Orders", value: stats.totalOrders, icon: <Package className="text-blue-500" />, sub: "Pending processing" },
            { title: "Store Rating", value: stats.avgRating.toFixed(1), icon: <Star className="text-orange-500" fill="currentColor" />, sub: "Based on reviews" },
          ].map((stat, i) => (
            <Card key={i} className="border-none shadow-xl shadow-gray-200/40 overflow-hidden relative">
              <CardContent className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="h-12 w-12 bg-gray-50 rounded-2xl flex items-center justify-center">
                    {stat.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Stat {i + 1}</span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-3xl font-black text-gray-900 tracking-tight">{stat.value}</h3>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.title}</p>
                </div>
              </CardContent>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-50 group-hover:bg-[#FF5200] transition-all"></div>
            </Card>
          ))}
        </div>

        {/* Recent Activities Section - Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-none shadow-xl shadow-gray-200/40">
            <CardHeader className="border-b border-gray-50 flex flex-row items-center justify-between pb-6">
              <CardTitle className="text-xl font-bold">Recent Orders</CardTitle>
              <button className="text-xs font-bold text-[#FF5200] hover:underline">View All</button>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                  <ShoppingCart size={32} />
                </div>
                <p className="text-gray-500 font-medium">New orders will appear here.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl shadow-gray-200/40">
            <CardHeader className="border-b border-gray-50 flex flex-row items-center justify-between pb-6">
              <CardTitle className="text-xl font-bold">Menu Highlights</CardTitle>
              <button className="text-xs font-bold text-[#FF5200] hover:underline">Manage Items</button>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 transition-colors">
                  <Utensils size={32} />
                </div>
                <p className="text-gray-500 font-medium">Top performing meals will show up here.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
