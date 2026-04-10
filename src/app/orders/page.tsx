"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ManagementPage } from "@/components/dashboard/ManagementPage";
import { ShoppingBag, Clock, CheckCircle2, Package, Search, ChevronRight, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

const customerNavItems = [
  { title: 'My Orders', href: '/orders', icon: <ShoppingBag size={20} /> },
  { title: 'Track Order', href: '/track-order', icon: <Clock size={20} /> },
];

export default function OrdersPage() {
  const mockOrders = [
    { id: 'FH-8192', date: 'Oct 12, 2026', total: 45.50, status: 'Completed', items: 3 },
    { id: 'FH-9031', date: 'Oct 10, 2026', total: 28.00, status: 'In Transit', items: 1 },
    { id: 'FH-7729', date: 'Oct 05, 2026', total: 120.25, status: 'Cancelled', items: 5 },
  ];

  return (
    <ProtectedRoute allowedRoles={['CUSTOMER']}>
      <ManagementPage 
        title="My Orders" 
        description="Review and manage your culinary adventures." 
        items={customerNavItems}
      >
        <div className="space-y-10 pb-20">
           {/* Filters */}
           <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
              <div className="relative w-full md:w-96 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                <input 
                  placeholder="Find an order..." 
                  className="w-full h-14 pl-12 pr-6 rounded-2xl bg-white border border-gray-100 focus:border-orange-500 transition-all font-bold outline-none shadow-sm"
                />
              </div>
              <div className="flex gap-4">
                 {['All', 'Active', 'Past'].map(f => (
                   <button key={f} className="px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest bg-white border border-gray-100 hover:bg-orange-500 hover:text-white transition-all shadow-sm">
                     {f}
                   </button>
                 ))}
              </div>
           </div>

           {/* Orders List */}
           <div className="space-y-6">
              {mockOrders.map((order) => (
                <Card 
                  key={order.id} 
                  className="p-8 rounded-[40px] border-none shadow-xl shadow-gray-200/40 bg-white group hover:-translate-y-1 transition-all duration-500 overflow-hidden relative"
                >
                   <div className="absolute top-0 left-0 w-2 h-full bg-orange-500 scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-500"></div>
                   <div className="flex flex-col lg:flex-row justify-between items-center gap-10">
                      <div className="flex items-center gap-8">
                         <div className="h-20 w-20 bg-gray-50 rounded-3xl flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all duration-500">
                            <Package size={32} />
                         </div>
                         <div>
                            <div className="flex items-center gap-3 mb-1">
                               <h3 className="text-2xl font-black text-gray-900">{order.id}</h3>
                               <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                                 order.status === 'Completed' ? 'bg-green-50 text-green-600' :
                                 order.status === 'In Transit' ? 'bg-orange-50 text-orange-600' :
                                 'bg-red-50 text-red-600'
                               }`}>{order.status}</span>
                            </div>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{order.date} • {order.items} Items</p>
                         </div>
                      </div>

                      <div className="flex items-center gap-12">
                         <div className="text-right">
                            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Total Paid</p>
                            <p className="text-2xl font-black text-gray-950">{formatCurrency(order.total)}</p>
                         </div>
                         <div className="flex gap-4">
                            <Link href="/track-order">
                               <Button variant="outline" className="h-14 px-8 rounded-2xl border-gray-100 font-black text-xs uppercase tracking-widest hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all">
                                  Track Details
                               </Button>
                            </Link>
                            <Button className="h-14 w-14 p-0 rounded-2xl bg-gray-950 hover:bg-orange-500 transition-all shadow-xl">
                               <MessageSquare size={20} className="text-white" />
                            </Button>
                         </div>
                      </div>
                   </div>
                </Card>
              ))}
           </div>

           {/* Empty State Mock */}
           {mockOrders.length === 0 && (
             <div className="py-40 text-center space-y-8 bg-white rounded-[64px] border border-dashed border-gray-200">
                <div className="h-24 w-24 bg-gray-50 rounded-[32px] flex items-center justify-center mx-auto text-gray-200">
                   <ShoppingBag size={48} />
                </div>
                <div>
                   <h4 className="text-3xl font-black text-gray-900 mb-2">No Culinary Requests Yet</h4>
                   <p className="text-gray-400 font-bold">Your stomach is waiting. Let's find something delicious.</p>
                </div>
                <Link href="/meals">
                   <Button className="h-16 px-12 rounded-3xl bg-orange-500 font-black text-lg shadow-2xl shadow-orange-500/20">Start Exploring</Button>
                </Link>
             </div>
           )}
        </div>
      </ManagementPage>
    </ProtectedRoute>
  );
}
