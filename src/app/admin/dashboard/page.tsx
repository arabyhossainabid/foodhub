"use client";

import { LayoutDashboard, Users, Grid, UserPlus, Package, DollarSign, ShoppingBag, ShieldAlert, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ManagementPage } from "@/components/dashboard/ManagementPage";

const adminNavItems = [
  { title: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard size={20} /> },
  { title: "User Management", href: "/admin/users", icon: <Users size={20} /> },
  { title: "Categories", href: "/admin/categories", icon: <Grid size={20} /> },
  { title: "All Orders", href: "/admin/orders", icon: <ShoppingBag size={20} /> },
  { title: "Moderation", href: "/admin/reviews", icon: <ShieldAlert size={20} /> },
];

export default function AdminDashboard() {
  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}

function AdminDashboardContent() {
  const [stats] = useState<any>({
    totalRevenue: 0,
    totalOrders: 0,
    activeUsersCount: 0,
    providersCount: 0,
  });

  return (
    <ManagementPage
      title="Admin Control"
      description="Global overview and system-wide management."
      items={adminNavItems}
      loading={false}
    >
      <div className="space-y-10">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Total Revenue", value: formatCurrency(stats?.totalRevenue || 0), icon: <DollarSign className="text-green-500" />, color: "border-green-500" },
            { title: "Active Users", value: stats?.activeUsersCount || 0, icon: <UserPlus className="text-orange-500" />, color: "border-orange-500" },
            { title: "Active Providers", value: stats?.providersCount || 0, icon: <TrendingUp className="text-blue-500" />, color: "border-blue-500" },
            { title: "Total Orders", value: stats?.totalOrders || 0, icon: <Package className="text-purple-500" />, color: "border-purple-500" },
          ].map((stat, i) => (
            <Card key={i} className="border border-gray-100 shadow-lg relative overflow-hidden group rounded-md">
              <CardContent className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <div className="h-12 w-12 bg-gray-50 rounded-md flex items-center justify-center transition-transform group-hover:scale-110">
                    {stat.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">System Core</span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-3xl font-black text-gray-900 tracking-tight">{stat.value}</h3>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.title}</p>
                </div>
              </CardContent>
              <div className={`absolute bottom-0 left-0 w-full h-1 bg-gray-50 group-hover:bg-orange-500 transition-all`}></div>
            </Card>
          ))}
        </div>
      </div>
    </ManagementPage>
  );
}
