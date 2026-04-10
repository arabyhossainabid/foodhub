'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ManagementPage } from '@/components/dashboard/ManagementPage';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { providerService } from '@/services/providerService';
import {
  ArrowUpRight,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Star,
  Utensils,
  Plus,
  TrendingUp,
  Clock,
  ChevronRight
} from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const providerNavItems = [
  { title: 'Dashboard', href: '/provider/dashboard', icon: <LayoutDashboard size={20} /> },
  { title: 'Manage Menu', href: '/provider/menu', icon: <Utensils size={20} /> },
  { title: 'Order List', href: '/provider/orders', icon: <ShoppingCart size={20} /> },
  { title: 'Customer Reviews', href: '/provider/reviews', icon: <Star size={20} /> },
];

export default function ProviderDashboard() {
  return (
    <ProtectedRoute allowedRoles={['PROVIDER']}>
      <ProviderDashboardContent />
    </ProtectedRoute>
  );
}

function ProviderDashboardContent() {
  const [stats, setStats] = useState({
    totalMeals: 0,
    totalOrders: 0,
    averageRating: 0,
    earnings: 0,
    totalReviews: 0,
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const data = await providerService.getStats();
        setStats(data);
      } catch (error) {
        console.error('Dashboard statistics loading failed:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <ManagementPage
      title='Kitchen Control'
      description="Monitor your shop's performance and coordinate orders."
      items={providerNavItems}
      loading={isLoading}
      action={
        <Link href="/provider/menu">
           <Button className="rounded-xl bg-orange-500 hover:bg-orange-600 font-bold text-xs h-10 px-5 shadow-lg shadow-orange-500/20">
              <Plus size={16} className="mr-2" /> New Meal
           </Button>
        </Link>
      }
    >
      <div className='space-y-12 pb-12'>
        {/* Stats Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {[
            {
              title: 'Revenue Generated',
              value: formatCurrency(stats.earnings),
              icon: <TrendingUp size={24} />,
              color: 'bg-green-50 text-green-600',
              trend: '+8.4%'
            },
            {
              title: 'Active Meals',
              value: stats.totalMeals,
              icon: <Utensils size={24} />,
              color: 'bg-orange-50 text-orange-600',
              trend: 'All live'
            },
            {
              title: 'Fulfilled Volume',
              value: stats.totalOrders,
              icon: <Package size={24} />,
              color: 'bg-blue-50 text-blue-600',
              trend: 'Total'
            },
            {
              title: 'Avg Kitchen Score',
              value: stats.averageRating.toFixed(1),
              icon: <Star size={24} fill="currentColor" />,
              color: 'bg-yellow-50 text-yellow-600',
              trend: `${stats.totalReviews} Feedbacks`
            },
          ].map((stat, i) => (
            <Card key={i} className='border-none shadow-xl shadow-gray-200/50 p-8 rounded-3xl group hover:-translate-y-1 transition-all'>
               <div className='flex justify-between items-start mb-6'>
                  <div className={`h-14 w-14 ${stat.color} rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-6`}>
                     {stat.icon}
                  </div>
                  <span className='px-3 py-1 bg-gray-50 text-[10px] font-black text-gray-400 rounded-lg'>{stat.trend}</span>
               </div>
               <div className='space-y-1'>
                  <h3 className='text-3xl font-black text-gray-900 tracking-tight'>{stat.value}</h3>
                  <p className='text-xs font-black text-gray-400 uppercase tracking-widest'>{stat.title}</p>
               </div>
            </Card>
          ))}
        </div>

        {/* Chart Area Example */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <Card className="lg:col-span-2 border-none shadow-xl shadow-gray-200/50 p-8 rounded-[40px] bg-white">
              <div className="flex justify-between items-center mb-10">
                 <div>
                    <h4 className="text-xl font-black text-gray-900">Performance Flow</h4>
                    <p className="text-sm font-bold text-gray-400">Order volume over the past 6 days</p>
                 </div>
                 <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-xl border border-gray-100">
                    <button className="px-3 py-1.5 rounded-lg bg-white shadow-sm text-[10px] font-black uppercase">Orders</button>
                    <button className="px-3 py-1.5 rounded-lg text-gray-400 text-[10px] font-black uppercase">Earnings</button>
                 </div>
              </div>
              <div className="h-64 flex items-end justify-between gap-4 px-4">
                 {(stats as any)?.earningsTrend?.map((item: any, i: number) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                       <div className="w-full bg-gray-50 rounded-full relative overflow-hidden h-full">
                          <div className="absolute bottom-0 left-0 w-full bg-orange-500 rounded-full transition-all duration-1000 group-hover:bg-orange-600" style={{ height: `${(item.amount / 1500) * 100}%` }}></div>
                       </div>
                       <span className="text-[10px] font-black text-gray-300 uppercase">{item.day}</span>
                    </div>
                 ))}
              </div>
           </Card>

           <Card className="bg-gray-950 rounded-[40px] p-8 text-white flex flex-col justify-between overflow-hidden relative shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500 rounded-full blur-[100px] opacity-20"></div>
              <div className="space-y-6 relative z-10">
                 <div className="h-12 w-12 bg-orange-500 rounded-xl flex items-center justify-center"><Clock size={24} /></div>
                 <h4 className="text-2xl font-black tracking-tight">Active Operation <br /><span className="text-orange-500">Protocol.</span></h4>
                 <p className="text-sm text-gray-400 font-medium">Your kitchen is currently accepting new orders. Stay sharp!</p>
              </div>
              
              <div className="space-y-4 pt-8">
                 <Link href="/provider/orders" className="block p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all group">
                    <div className="flex items-center justify-between font-bold text-sm">
                       <span>Live Orders</span>
                       <ChevronRight size={18} className="text-gray-700 group-hover:text-orange-500" />
                    </div>
                 </Link>
                 <Link href="/provider/menu" className="block p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all group">
                    <div className="flex items-center justify-between font-bold text-sm">
                       <span>Menu Architect</span>
                       <ChevronRight size={18} className="text-gray-700 group-hover:text-orange-500" />
                    </div>
                 </Link>
              </div>
           </Card>
        </div>
      </div>
    </ManagementPage>
  );
}
