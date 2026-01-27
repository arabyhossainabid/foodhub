"use client";

import { LayoutDashboard, Utensils, ShoppingCart, Star, Clock, ArrowUpRight, ArrowDownRight, Package } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ManagementPage } from "@/components/dashboard/ManagementPage";

const providerNavItems = [
  { title: "Dashboard", href: "/provider/dashboard", icon: <LayoutDashboard size={20} /> },
  { title: "Manage Menu", href: "/provider/menu", icon: <Utensils size={20} /> },
  { title: "Order List", href: "/provider/orders", icon: <ShoppingCart size={20} /> },
  { title: "Customer Reviews", href: "/provider/reviews", icon: <Star size={20} /> },
];

export default function ProviderDashboard() {
  return (
    <ProtectedRoute allowedRoles={["PROVIDER"]}>
      <ProviderDashboardContent />
    </ProtectedRoute>
  );
}

function ProviderDashboardContent() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalMeals: 0,
    totalOrders: 0,
    averageRating: 0,
    earnings: 0,
    totalReviews: 0,
    fiveStars: 0,
    fourStars: 0,
    threeStars: 0,
    twoStars: 0,
    oneStars: 0,
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const [mealsRes, ordersRes] = await Promise.all([
          api.get("/provider/meals"),
          api.get("/provider/orders")
        ]);

        const meals = mealsRes.data.data;
        const orders = ordersRes.data.data;

        const reviewPromises = meals.map((meal: any) =>
          api.get(`/reviews/meal/${meal.id}`).catch(() => ({ data: { data: [] } }))
        );
        const reviewsResponses = await Promise.all(reviewPromises);
        const allReviews = reviewsResponses.flatMap((res) => res.data.data);

        const totalReviews = allReviews.length;
        const averageRating = totalReviews > 0
          ? allReviews.reduce((acc: number, r: any) => acc + r.rating, 0) / totalReviews
          : 0;

        setStats({
          totalMeals: meals.length,
          totalOrders: orders.length,
          averageRating,
          earnings: orders.reduce((acc: number, o: any) => o.status === 'DELIVERED' ? acc + Number(o.totalAmount) : acc, 0),
          totalReviews,
          fiveStars: allReviews.filter((r: any) => r.rating === 5).length,
          fourStars: allReviews.filter((r: any) => r.rating === 4).length,
          threeStars: allReviews.filter((r: any) => r.rating === 3).length,
          twoStars: allReviews.filter((r: any) => r.rating === 2).length,
          oneStars: allReviews.filter((r: any) => r.rating === 1).length,
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <ManagementPage
      title="Provider Dashboard"
      description="Monitor your shop's performance and orders."
      items={providerNavItems}
      loading={isLoading}
      action={
        <div className="bg-white px-3 py-1.5 rounded-md border border-gray-100 flex items-center space-x-2 shadow-sm">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-bold text-gray-700 uppercase tracking-tight">Kitchen Open</span>
        </div>
      }
    >
      <div className="space-y-10">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "Total Earnings", value: formatCurrency(stats.earnings), icon: <ArrowUpRight size={20} className="text-green-500" />, sub: "Lifetime" },
            { title: "Active Meals", value: stats.totalMeals, icon: <Utensils size={20} className="text-orange-500" />, sub: "In menu" },
            { title: "Orders", value: stats.totalOrders, icon: <Package size={20} className="text-blue-500" />, sub: "Total count" },
            { title: "Average Rating", value: stats.averageRating.toFixed(1), icon: <Star size={20} className="text-yellow-500" fill="currentColor" />, sub: `Based on ${stats.totalReviews} reviews` },
          ].map((stat, i) => (
            <Card key={i} className="border border-gray-100 shadow-sm rounded-md">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="h-10 w-10 bg-gray-50 rounded-md flex items-center justify-center">
                    {stat.icon}
                  </div>
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ManagementPage>
  );
}
