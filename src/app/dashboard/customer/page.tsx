"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { orderService } from "@/services/orderService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Star, Clock, Zap, User, ArrowRight, Settings, CreditCard, Heart, MapPin, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FullPageLoader } from "@/components/shared/FullPageLoader";
import { formatCurrency } from "@/lib/utils";

export default function CustomerDashboard() {
  return (
    <ProtectedRoute allowedRoles={["CUSTOMER"]}>
      <CustomerDashboardContent />
    </ProtectedRoute>
  );
}

function CustomerDashboardContent() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await orderService.getMyStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch customer stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <FullPageLoader transparent />;

  return (
    <div className="min-h-screen bg-white pt-28 pb-20 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
           <div className="space-y-1">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Bonjour, {user?.name.split(' ')[0]}!</h1>
              <p className="text-sm font-medium text-gray-400">Here is what happening with your appetite today.</p>
           </div>
           <div className="flex gap-4">
              <Link href="/meals">
                <Button className="h-12 px-8 rounded-xl bg-orange-500 hover:bg-orange-600 font-bold text-white shadow-xl shadow-orange-500/20">
                   Browse Menu <Search size={18} className="ml-2" />
                </Button>
              </Link>
           </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { label: 'Total Spending', value: formatCurrency(stats?.totalSpent || 0), icon: <CreditCard size={24} />, color: 'bg-green-50 text-green-600' },
              { label: 'Rewards Points', value: (stats?.rewardPoints || 0).toLocaleString(), icon: <Zap size={24} />, color: 'bg-orange-50 text-orange-600' },
              { label: 'Wishlist Items', value: '0', icon: <Heart size={24} />, color: 'bg-red-50 text-red-600' },
              { label: 'Active Orders', value: stats?.lastOrders?.filter((o: any) => o.status !== 'DELIVERED' && o.status !== 'CANCELLED').length || 0, icon: <ShoppingBag size={24} />, color: 'bg-blue-50 text-blue-600' }
            ].map((stat, i) => (
              <Card key={i} className="border-none shadow-sm bg-white p-6 rounded-3xl hover:shadow-xl hover:-translate-y-1 transition-all">
                 <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${stat.color}`}>
                       {stat.icon}
                    </div>
                    <div>
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                       <p className="text-xl font-black text-gray-950">{stat.value}</p>
                    </div>
                 </div>
              </Card>
            ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Recent Activity / Chart */}
           <Card className="lg:col-span-2 border-none shadow-sm rounded-[32px] overflow-hidden bg-white">
              <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                 <h2 className="text-xl font-black text-gray-900">Spending Trends</h2>
                 <p className="text-xs font-bold text-gray-400">Total Volume Analysis</p>
              </div>
              <div className="p-8">
                 <div className="h-64 flex items-end justify-between gap-4">
                    {(stats?.spendingTrend || Array.from({ length: 7 }).map((_, i) => ({ day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i], amount: 0 }))).map((item: any, i: number) => {
                       const maxAmount = Math.max(...(stats?.spendingTrend?.map((t: any) => t.amount) || [100]));
                       const height = maxAmount > 0 ? (item.amount / maxAmount) * 100 : 0;
                       return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                           <div className="w-full bg-gray-50 rounded-lg relative overflow-hidden h-full">
                              <div 
                                className="absolute bottom-0 left-0 w-full bg-orange-500 rounded-lg transition-all duration-1000 group-hover:bg-orange-600" 
                                style={{ height: `${Math.max(height, 5)}%` }}
                              >
                                 {item.amount > 0 && (
                                   <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-[8px] px-2 py-1 rounded-md pointer-events-none mb-2 font-bold whitespace-nowrap">
                                      {formatCurrency(item.amount)}
                                   </div>
                                 )}
                              </div>
                           </div>
                           <span className="text-[10px] font-bold text-gray-400 uppercase">{item.day}</span>
                        </div>
                       );
                    })}
                 </div>
              </div>
           </Card>

           {/* Quick Actions / Profile Mini */}
           <Card className="border-none shadow-sm rounded-[32px] overflow-hidden bg-gray-950 text-white p-8 space-y-8 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500 rounded-full blur-[80px] opacity-20"></div>
              <div className="flex items-center gap-6 relative z-10">
                 <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center text-gray-950 text-2xl font-black">
                    {user?.name.charAt(0)}
                 </div>
                 <div>
                    <p className="text-lg font-bold">{user?.name}</p>
                    <p className="text-xs text-orange-500 font-bold uppercase tracking-widest">Premium Member</p>
                 </div>
              </div>
              
              <div className="space-y-4 pt-4">
                 <Link href="/profile" className="block p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all group">
                    <div className="flex items-center justify-between text-sm font-bold">
                       <span className="flex items-center gap-3"><Settings size={18} /> Account Identity</span>
                       <ChevronRight size={16} className="text-gray-600 group-hover:text-orange-500" />
                    </div>
                 </Link>
                 <Link href="/orders" className="block p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all group">
                    <div className="flex items-center justify-between text-sm font-bold">
                       <span className="flex items-center gap-3"><ShoppingBag size={18} /> Track Shipment</span>
                       <ChevronRight size={16} className="text-gray-600 group-hover:text-orange-500" />
                    </div>
                 </Link>
                 <Link href="/address" className="block p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all group">
                    <div className="flex items-center justify-between text-sm font-bold">
                       <span className="flex items-center gap-3"><MapPin size={18} /> My Addresses</span>
                       <ChevronRight size={16} className="text-gray-600 group-hover:text-orange-500" />
                    </div>
                 </Link>
              </div>
           </Card>

           {/* Recent Orders Table */}
           <Card className="lg:col-span-3 border-none shadow-sm rounded-[32px] overflow-hidden bg-white mt-8">
              <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                 <h2 className="text-xl font-black text-gray-900">Recent Cravings</h2>
                 <Link href="/orders" className="text-xs font-bold text-orange-500 hover:underline">View All History</Link>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full border-collapse">
                    <thead>
                       <tr className="bg-gray-50/50">
                          <th className="px-8 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order ID</th>
                          <th className="px-8 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Meal Summary</th>
                          <th className="px-8 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                          <th className="px-8 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                          <th className="px-8 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Action</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                       {(stats?.lastOrders || []).map((order: any) => (
                          <tr key={order.id} className="hover:bg-gray-50/30 transition-colors">
                             <td className="px-8 py-6 font-mono text-xs text-gray-400 uppercase">#{order.id.slice(-8)}</td>
                             <td className="px-8 py-6">
                                <p className="text-sm font-bold text-gray-900">{order.orderItems[0]?.meal.title || 'Multi Item Order'}</p>
                                <p className="text-[10px] text-gray-400 font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                             </td>
                             <td className="px-8 py-6">
                                <span className="px-3 py-1 bg-orange-50 text-orange-600 text-[10px] font-bold rounded-lg uppercase tracking-widest">{order.status}</span>
                             </td>
                             <td className="px-8 py-6 font-bold text-gray-900">{formatCurrency(order.totalAmount)}</td>
                             <td className="px-8 py-6 text-right">
                                <Link href={`/orders/${order.id}`}>
                                   <Button variant="ghost" className="h-9 px-4 rounded-xl text-xs font-bold hover:bg-orange-50 hover:text-orange-600">Details</Button>
                                </Link>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}

function ChevronRight({ size, className }: { size: number, className: string }) {
   return <ArrowRight size={size} className={className} />
}
