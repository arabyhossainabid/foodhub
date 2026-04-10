/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ManagementPage } from '@/components/dashboard/ManagementPage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { adminService } from '@/services/adminService';
import {
  DollarSign,
  Grid,
  LayoutDashboard,
  Package,
  ShieldAlert,
  ShoppingBag,
  TrendingUp,
  UserPlus,
  Users,
  ArrowUpRight,
  MoreVertical,
  Activity
} from 'lucide-react';
import { useEffect, useState } from 'react';

const adminNavItems = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: <LayoutDashboard size={20} />,
  },
  { title: 'User Management', href: '/admin/users', icon: <Users size={20} /> },
  { title: 'Categories', href: '/admin/categories', icon: <Grid size={20} /> },
  {
    title: 'All Orders',
    href: '/admin/orders',
    icon: <ShoppingBag size={20} />,
  },
  {
    title: 'Moderation',
    href: '/admin/reviews',
    icon: <ShieldAlert size={20} />,
  },
];

export default function AdminDashboard() {
  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}

function AdminDashboardContent() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      setLoading(true);
      try {
        const data = await adminService.getStats();
        setStats(data);
      } catch (error) {
        console.error('System statistics fetch failed:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  return (
    <ManagementPage
      title='Admin Control'
      description='Global overview and system-wide management.'
      items={adminNavItems}
      loading={loading}
    >
      <div className='space-y-12 pb-12'>
        {/* Stats Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {[
            {
              title: 'Platform Revenue',
              value: formatCurrency(stats?.totalRevenue || 125000),
              icon: <DollarSign size={24} className='text-green-500' />,
              trend: '+12.5%',
              color: 'bg-green-50'
            },
            {
              title: 'Active Customers',
              value: stats?.totalUsers || 2450,
              icon: <UserPlus size={24} className='text-orange-500' />,
              trend: '+24 new',
              color: 'bg-orange-50'
            },
            {
              title: 'Shop Partners',
              value: stats?.totalProviders || 128,
              icon: <TrendingUp size={24} className='text-blue-500' />,
              trend: 'Top Growth',
              color: 'bg-blue-50'
            },
            {
              title: 'Fulfilled Orders',
              value: stats?.totalOrders || 8420,
              icon: <Package size={24} className='text-purple-500' />,
              trend: 'All time',
              color: 'bg-purple-50'
            },
          ].map((stat, i) => (
            <Card
              key={i}
              className='border-none shadow-xl shadow-gray-200/50 p-8 rounded-3xl group hover:-translate-y-1 transition-all'
            >
              <div className='flex justify-between items-start mb-6'>
                <div className={`h-14 w-14 ${stat.color} rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-6`}>
                  {stat.icon}
                </div>
                <span className='px-3 py-1 bg-gray-50 text-[10px] font-black text-gray-400 rounded-lg'>{stat.trend}</span>
              </div>
              <div className='space-y-1'>
                <h3 className='text-3xl font-black text-gray-900 tracking-tight'>
                  {stat.value}
                </h3>
                <p className='text-xs font-black text-gray-400 uppercase tracking-widest'>
                  {stat.title}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
           {/* Revenue Chart Placeholder */}
           <Card className="lg:col-span-2 border-none shadow-xl shadow-gray-200/50 p-8 rounded-[40px] bg-white">
              <div className="flex justify-between items-center mb-10">
                 <div>
                    <h4 className="text-xl font-black text-gray-900">Revenue Analytics</h4>
                    <p className="text-sm font-bold text-gray-400">Monthly breakdown of platform income</p>
                 </div>
                 <Button variant="outline" size="sm" className="rounded-xl font-bold border-gray-100">
                    2026 Yearly <ArrowUpRight size={14} className="ml-2" />
                 </Button>
              </div>
              
              <div className="flex items-end justify-between h-64 gap-3 px-4">
                 {(stats?.monthlyRevenue || Array.from({ length: 6 }).map((_, i) => ({ month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i], amount: 0 }))).map((item: any, i: number) => {
                    const maxAmount = Math.max(...(stats?.monthlyRevenue?.map((t: any) => t.amount) || [1000]));
                    const height = maxAmount > 0 ? (item.amount / maxAmount) * 100 : 0;
                    return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                           <div className="w-full bg-gray-50 rounded-full relative overflow-hidden h-full">
                              <div 
                                className="absolute bottom-0 left-0 w-full bg-orange-500 rounded-full transition-all duration-1000 group-hover:bg-orange-600" 
                                style={{ height: `${Math.max(height, 5)}%` }}
                              >
                                 {item.amount > 0 && (
                                   <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-[8px] px-2 py-1 rounded-md pointer-events-none mb-2 font-bold whitespace-nowrap">
                                      {formatCurrency(item.amount)}
                                   </div>
                                 )}
                              </div>
                           </div>
                           <span className="text-[10px] font-black text-gray-300 uppercase">
                              {item.month}
                           </span>
                        </div>
                    );
                 })}
              </div>
           </Card>

           {/* Distribution Pie Chart Placeholder */}
           <Card className="border-none shadow-xl shadow-gray-200/50 p-8 rounded-[40px] bg-gray-950 text-white flex flex-col items-center justify-center space-y-8 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500 rounded-full blur-[80px] opacity-20"></div>
              <div className="text-center">
                 <h4 className="text-xl font-black">User Distribution</h4>
                 <p className="text-sm font-medium text-gray-500">Global account types</p>
              </div>
              
              <div className="relative w-48 h-48 flex items-center justify-center">
                 <svg className="w-full h-full transform -rotate-90">
                    <circle cx="96" cy="96" r="80" stroke="#1f2937" strokeWidth="24" fill="transparent" />
                    <circle cx="96" cy="96" r="80" stroke="#f97316" strokeWidth="24" strokeDasharray={`${3.14 * 160 * 0.7} ${3.14 * 160 * 0.3}`} fill="transparent" />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black">70%</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Customers</span>
                 </div>
              </div>

              <div className="w-full space-y-4 pt-4">
                 <div className="flex justify-between items-center text-xs font-black uppercase">
                    <span className="flex items-center gap-2"><div className="w-2 h-2 bg-orange-500 rounded-full"></div> Customers</span>
                    <span>70%</span>
                 </div>
                 <div className="flex justify-between items-center text-xs font-black uppercase">
                    <span className="flex items-center gap-2"><div className="w-2 h-2 bg-gray-700 rounded-full"></div> Providers</span>
                    <span>25%</span>
                 </div>
                 <div className="flex justify-between items-center text-xs font-black uppercase">
                    <span className="flex items-center gap-2"><div className="w-2 h-2 bg-gray-800 rounded-full"></div> Admins</span>
                    <span>5%</span>
                 </div>
              </div>
           </Card>
        </div>

        {/* Recent Activity Table Placeholder */}
        <Card className="border-none shadow-xl shadow-gray-200/50 rounded-[40px] overflow-hidden">
           <CardHeader className="p-8 border-b border-gray-50 flex flex-row justify-between items-center">
              <div>
                 <CardTitle className="text-2xl font-black text-gray-900">Recent System Activity</CardTitle>
                 <p className="text-sm font-black text-gray-400 mt-1 uppercase tracking-widest flex items-center gap-2">
                    <Activity size={14} className="text-orange-500" /> Real-time Monitoring
                 </p>
              </div>
              <Button variant="ghost" className="rounded-xl"><MoreVertical size={20} /></Button>
           </CardHeader>
           <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                 <thead>
                    <tr className="bg-gray-50/50">
                       <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Transaction / Event</th>
                       <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                       <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Amount</th>
                       <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Date</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50">
                    {[
                      { name: 'Sushi Platter Deluxe', user: 'Sarah Johnson', status: 'Completed', amount: '$124.50', date: '2 mins ago' },
                      { name: 'Burger Party Pack', user: 'Mike Brown', status: 'Pending', amount: '$85.00', date: '15 mins ago' },
                      { name: 'New Provider Signup', user: 'Taste of Italy', status: 'Verification', amount: '--', date: '1 hour ago' },
                      { name: 'Bulk Order: Pizza', user: 'Google Office', status: 'Completed', amount: '$540.20', date: '3 hours ago' },
                      { name: 'Withdrawal Request', user: 'Spicy Thai', status: 'Processing', amount: '$1,200', date: '5 hours ago' },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50/30 transition-colors">
                         <td className="px-8 py-6">
                            <p className="font-bold text-gray-900">{row.name}</p>
                            <p className="text-xs text-gray-400 font-medium">{row.user}</p>
                         </td>
                         <td className="px-8 py-6">
                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                               row.status === 'Completed' ? 'bg-green-50 text-green-600' :
                               row.status === 'Pending' ? 'bg-orange-50 text-orange-600' :
                               'bg-blue-50 text-blue-600'
                            }`}>{row.status}</span>
                         </td>
                         <td className="px-8 py-6 font-black text-gray-900">{row.amount}</td>
                         <td className="px-8 py-6 text-xs font-bold text-gray-400">{row.date}</td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </Card>
      </div>
    </ManagementPage>
  );
}
