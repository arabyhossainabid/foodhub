"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { LayoutDashboard, Users, Grid, Settings, TrendingUp, UserPlus, Package, DollarSign } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

const adminNavItems = [
  { title: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard size={20} /> },
  { title: "User Management", href: "/admin/users", icon: <Users size={20} /> },
  { title: "Categories", href: "/admin/categories", icon: <Grid size={20} /> },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/stats");
        setStats(res.data.data);
      } catch (error) {
        console.error("Failed to fetch admin stats");
      }
    };
    fetchStats();
  }, []);

  return (
    <DashboardLayout items={adminNavItems}>
      <div className="space-y-10" data-aos="fade-up">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-4xl font-extra-bold text-gray-900 tracking-tight">Admin Control</h1>
            <p className="text-gray-500 font-medium">Global overview and system-wide management.</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Total Revenue", value: formatCurrency(stats?.totalRevenue || 0), icon: <DollarSign className="text-green-500" />, color: "border-green-500" },
            { title: "Active Users", value: stats?.userCount || 0, icon: <UserPlus className="text-[#FF5200]" />, color: "border-orange-500" },
            { title: "Active Providers", value: stats?.providerCount || 0, icon: <TrendingUp className="text-blue-500" />, color: "border-blue-500" },
            { title: "Total Orders", value: stats?.totalOrders || 0, icon: <Package className="text-purple-500" />, color: "border-purple-500" },
          ].map((stat, i) => (
            <Card key={i} className={`border-none shadow-xl shadow-gray-200/40 relative overflow-hidden group`}>
              <CardContent className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <div className="h-12 w-12 bg-gray-50 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110">
                    {stat.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">System Core</span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-3xl font-black text-gray-900 tracking-tight">{stat.value}</h3>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.title}</p>
                </div>
              </CardContent>
              <div className={`absolute bottom-0 left-0 w-full h-1 bg-gray-50 group-hover:bg-[#FF5200] transition-all`}></div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 border-none shadow-xl shadow-gray-200/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold">System Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                  <span className="font-bold text-gray-700">API Server</span>
                </div>
                <span className="text-xs font-black text-green-600 uppercase bg-green-50 px-3 py-1 rounded-full tracking-widest">Healthy</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                  <span className="font-bold text-gray-700">Database</span>
                </div>
                <span className="text-xs font-black text-green-600 uppercase bg-green-50 px-3 py-1 rounded-full tracking-widest">Connected</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                  <span className="font-bold text-gray-700">Authenication Service</span>
                </div>
                <span className="text-xs font-black text-green-600 uppercase bg-green-50 px-3 py-1 rounded-full tracking-widest">Online</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl shadow-gray-200/40 bg-[#1C1C1C] text-white">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center">
                <Settings size={20} className="mr-2 text-[#FF5200]" />
                Admin Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              <button className="w-full text-left p-4 rounded-xl bg-gray-800 hover:bg-[#FF5200] transition-colors font-bold text-sm">
                Generate Monthly Report
              </button>
              <button className="w-full text-left p-4 rounded-xl bg-gray-800 hover:bg-[#FF5200] transition-colors font-bold text-sm">
                System-wide Maintenance
              </button>
              <button className="w-full text-left p-4 rounded-xl bg-gray-800 hover:bg-[#FF5200] transition-colors font-bold text-sm text-white">
                Send Global Notification
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
