"use client";

import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Shield, ShieldCheck, MapPin, Calendar, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfilePageContent />
    </ProtectedRoute>
  );
}

function ProfilePageContent() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row items-center gap-12" data-aos="fade-up">
          <div className="relative">
            <div className="h-48 w-48 bg-[#FF5200] rounded-[3rem] shadow-2xl shadow-orange-500/30 flex items-center justify-center text-6xl font-black text-white">
              {user.name.charAt(0)}
            </div>
            <div className="absolute -bottom-4 -right-4 bg-white p-3 rounded-2xl shadow-xl border border-gray-100">
              <ShieldCheck className="text-green-500" size={32} />
            </div>
          </div>

          <div className="text-center md:text-left space-y-4">
            <h1 className="text-5xl font-black text-gray-900 tracking-tight">{user.name}</h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <span className="px-4 py-1.5 bg-gray-100 text-gray-600 rounded-full text-xs font-black uppercase tracking-widest">{user.role}</span>
              <span className="px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-black uppercase tracking-widest">Active Account</span>
            </div>
            <p className="text-gray-500 font-medium max-w-md">Member since January 2026. Premium member of the FoodHub community.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8" data-aos="fade-up" data-aos-delay="200">
          <Card className="border-none shadow-xl shadow-gray-200/40 p-8 space-y-8 rounded-[2.5rem]">
            <h3 className="text-xl font-bold flex items-center">
              <User className="mr-3 text-[#FF5200]" size={20} /> Personal Information
            </h3>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Email Address</p>
                  <p className="font-bold text-gray-900">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                  <Shield size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Account ID</p>
                  <p className="font-bold text-gray-900">#{user.id.slice(-8).toUpperCase()}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="border-none shadow-xl shadow-gray-200/40 p-8 space-y-8 rounded-[2.5rem]">
            <h3 className="text-xl font-bold flex items-center">
              <MapPin className="mr-3 text-[#FF5200]" size={20} /> Preferences
            </h3>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Joined On</p>
                  <p className="font-bold text-gray-900">January 27, 2026</p>
                </div>
              </div>
              <Button variant="outline" className="w-full rounded-2xl h-12 border-gray-100" onClick={logout}>
                <LogOut size={18} className="mr-2" /> Sign Out from All Devices
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
