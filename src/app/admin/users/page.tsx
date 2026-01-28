"use client";

import { Search, ShieldAlert, ShieldCheck, Mail, User as UserIcon, Users, LayoutDashboard, Grid, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { User } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ManagementPage } from "@/components/dashboard/ManagementPage";

const adminNavItems = [
  { title: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard size={20} /> },
  { title: "User Management", href: "/admin/users", icon: <Users size={20} /> },
  { title: "Categories", href: "/admin/categories", icon: <Grid size={20} /> },
  { title: "All Orders", href: "/admin/orders", icon: <ShoppingBag size={20} /> },
  { title: "Moderation", href: "/admin/reviews", icon: <ShieldAlert size={20} /> },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data.data);
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      await api.patch(`/admin/users/${userId}`, { isActive: !currentStatus });
      toast.success(currentStatus ? "User suspended" : "User activated");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update user status");
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ManagementPage
      title="User Directory"
      description="Manage all platform users and their access levels."
      items={adminNavItems}
      loading={loading}
      action={
        <div className="relative w-full md:w-80">
          <Input
            placeholder="Search users..."
            className="pl-11 rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user, idx) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="premium-card group overflow-hidden border-none shadow-sm h-full">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-16 w-16 bg-gray-50 rounded-md flex items-center justify-center text-gray-400 group-hover:bg-orange-500 group-hover:text-white transition-all duration-500 shadow-sm overflow-hidden">
                        <UserIcon size={28} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-gray-900 leading-tight">{user.name}</h3>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Joined Jan 2026</p>
                      </div>
                    </div>
                    <span className={cn(
                      "text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-sm",
                      user.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    )}>
                      {user.isActive ? "Active Account" : "Access Revoked"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-50">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Email Address</p>
                      <div className="flex items-center text-sm font-bold text-gray-700">
                        <Mail size={14} className="mr-2 text-orange-500" /> {user.email}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Platform Role</p>
                      <div className="flex items-center text-sm font-bold text-gray-700">
                        <ShieldCheck size={14} className="mr-2 text-orange-500" /> {user.role}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(i => <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[8px] font-black">U{i}</div>)}
                    </div>
                    {user.role !== 'ADMIN' && (
                      <Button
                        size="sm"
                        variant={user.isActive ? "destructive" : "default"}
                        className={cn("rounded-md font-black px-6", !user.isActive && "bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/20")}
                        onClick={() => toggleStatus(user.id, user.isActive)}
                      >
                        {user.isActive ? "Revoke Access" : "Grant Access"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="lg:col-span-2 py-32 text-center bg-white rounded-[3rem] border-2 border-gray-50 border-dashed">
            <p className="text-gray-500 font-bold text-lg tracking-tight">System holds no records for your search.</p>
          </div>
        )}
      </div>
    </ManagementPage>
  );
}
