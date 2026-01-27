"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Users, LayoutDashboard, Grid, Search, ShieldAlert, ShieldCheck, Mail, Calendar, User as UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { User } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

const adminNavItems = [
  { title: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard size={20} /> },
  { title: "User Management", href: "/admin/users", icon: <Users size={20} /> },
  { title: "Categories", href: "/admin/categories", icon: <Grid size={20} /> },
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
    <DashboardLayout items={adminNavItems}>
      <div className="space-y-10" data-aos="fade-up">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-extra-bold text-gray-900 tracking-tight">User Directory</h1>
            <p className="text-gray-500 font-medium">Manage all platform users and their access levels.</p>
          </div>

          <div className="relative w-full md:w-80">
            <Input
              placeholder="Search users..."
              className="pl-11 rounded-2xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-2xl"></div>)}
            </div>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <Card key={user.id} className="border-none shadow-sm hover:shadow-md transition-all duration-300 bg-white group border border-gray-100 overflow-hidden">
                <CardContent className="p-4 flex flex-col md:flex-row items-center gap-6">
                  <div className="h-14 w-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-[#FF5200] group-hover:text-white transition-colors duration-500">
                    <UserIcon size={24} />
                  </div>

                  <div className="grow grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                    <div className="space-y-1">
                      <p className="text-sm font-black text-gray-900">{user.name}</p>
                      <div className="flex items-center text-xs text-gray-400 font-bold tracking-tight">
                        <Mail size={12} className="mr-1.5" /> {user.email}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-black uppercase text-gray-400 tracking-widest">Role</p>
                      <span className={cn(
                        "text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-widest",
                        user.role === 'ADMIN' ? "bg-purple-100 text-purple-700" :
                          user.role === 'PROVIDER' ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
                      )}>
                        {user.role}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-black uppercase text-gray-400 tracking-widest">Status</p>
                      <span className={cn(
                        "text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-widest",
                        user.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      )}>
                        {user.isActive ? "Active" : "Suspended"}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-50 w-full md:w-auto flex justify-end">
                    {user.role !== 'ADMIN' && (
                      user.isActive ? (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => toggleStatus(user.id, false)}
                        >
                          Suspend
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="default"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => toggleStatus(user.id, true)}
                        >
                          Activate
                        </Button>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="py-24 text-center bg-white rounded-3xl border border-gray-100 border-dashed">
              <p className="text-gray-500 font-bold">No users found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
