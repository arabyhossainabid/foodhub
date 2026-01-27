"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { UtensilsCrossed } from "lucide-react";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["CUSTOMER", "PROVIDER"]),
  shopName: z.string().optional(),
  address: z.string().optional(),
  cuisine: z.string().optional(),
}).refine(data => {
  if (data.role === "PROVIDER") {
    return !!data.shopName && !!data.address && !!data.cuisine;
  }
  return true;
}, {
  message: "Shop Name, Address, and Cuisine are required for Providers",
  path: ["shopName"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Get role from URL if present
  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const initialRole = searchParams?.get("role") === "PROVIDER" ? "PROVIDER" : "CUSTOMER";

  const [selectedRole, setSelectedRole] = useState<"CUSTOMER" | "PROVIDER">(initialRole);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: initialRole },
  });

  const handleRoleChange = (role: "CUSTOMER" | "PROVIDER") => {
    setSelectedRole(role);
    setValue("role", role);
  };

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        ...(data.role === "PROVIDER" ? {
          shopName: data.shopName,
          address: data.address,
          cuisine: data.cuisine,
          // Support both flattened and nested for maximum compatibility
          providerProfile: {
            shopName: data.shopName,
            address: data.address,
            cuisine: data.cuisine
          }
        } : {})
      };

      await api.post("/auth/register", payload);
      toast.success("Account created successfully! Please login.");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4 relative overflow-hidden bg-[#0A0A0A]">
      {/* Background Orbs */}
      <div className="absolute top-0 -right-20 w-96 h-96 bg-[#FF5200]/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-0 -left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-pulse-slow"></div>

      <div className="w-full max-w-lg z-10" data-aos="zoom-in">
        <Card className="glass border-white/10 shadow-2xl overflow-hidden rounded-[2.5rem]">
          <CardHeader className="text-center pt-12 pb-8">
            <div className="h-16 w-16 bg-[#FF5200] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-500/30 mx-auto mb-6">
              <Link href="/">
                <UtensilsCrossed size={32} />
              </Link>
            </div>
            <CardTitle className="text-4xl font-black text-white tracking-tighter">Create Account</CardTitle>
            <CardDescription className="text-gray-400 font-medium">
              Join the most advanced food hub community
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-12 space-y-10">
            {/* Role Selection */}
            <div className="flex p-1.5 bg-white/5 border border-white/10 rounded-2xl">
              <button
                type="button"
                className={`flex-1 py-3 text-sm font-black rounded-xl transition-all ${selectedRole === "CUSTOMER" ? "bg-[#FF5200] text-white shadow-lg shadow-orange-500/20" : "text-gray-500 hover:text-gray-300"
                  }`}
                onClick={() => handleRoleChange("CUSTOMER")}
              >
                Customer
              </button>
              <button
                type="button"
                className={`flex-1 py-3 text-sm font-black rounded-xl transition-all ${selectedRole === "PROVIDER" ? "bg-[#FF5200] text-white shadow-lg shadow-orange-500/20" : "text-gray-500 hover:text-gray-300"
                  }`}
                onClick={() => handleRoleChange("PROVIDER")}
              >
                Food Provider
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Full Name</label>
                  <Input
                    placeholder="John Doe"
                    className="h-14 rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:ring-[#FF5200]/20"
                    {...register("name")}
                  />
                  {errors.name && <p className="text-xs text-red-500 font-medium ml-1">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Email Address</label>
                  <Input
                    type="email"
                    placeholder="asif@example.com"
                    className="h-14 rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:ring-[#FF5200]/20"
                    {...register("email")}
                  />
                  {errors.email && <p className="text-xs text-red-500 font-medium ml-1">{errors.email.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Security Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="h-14 rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:ring-[#FF5200]/20"
                  {...register("password")}
                />
                {errors.password && <p className="text-xs text-red-500 font-medium ml-1">{errors.password.message}</p>}
              </div>

              {selectedRole === "PROVIDER" && (
                <div className="space-y-6 pt-4 border-t border-white/5 animate-in fade-in slide-in-from-top-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Shop Name</label>
                      <Input
                        placeholder="My Delicious Food"
                        className="h-14 rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:ring-[#FF5200]/20"
                        {...register("shopName")}
                      />
                      {errors.shopName && <p className="text-xs text-red-500 font-medium ml-1">{errors.shopName.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Cuisine Type</label>
                      <Input
                        placeholder="Italian, Fast Food..."
                        className="h-14 rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:ring-[#FF5200]/20"
                        {...register("cuisine")}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Shop Full Address</label>
                    <Input
                      placeholder="123 Street, City"
                      className="h-14 rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:ring-[#FF5200]/20"
                      {...register("address")}
                    />
                    {errors.address && <p className="text-xs text-red-500 font-medium ml-1">{errors.address.message}</p>}
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full h-16 rounded-2xl text-lg font-black shadow-xl shadow-orange-500/20 mt-4" isLoading={isLoading}>
                Create Account
              </Button>
            </form>

            <p className="text-center text-sm text-gray-500 font-medium">
              Already have an account?{" "}
              <Link href="/login" className="text-[#FF5200] font-black hover:underline underline-offset-4">
                Login Here
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
