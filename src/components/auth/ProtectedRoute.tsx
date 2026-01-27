"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ChefHat } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("CUSTOMER" | "PROVIDER" | "ADMIN")[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (allowedRoles && !allowedRoles.includes(user.role as any)) {
        router.push("/");
      }
    }
  }, [user, loading, router, allowedRoles]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-md z-100 flex flex-col items-center justify-center space-y-6">
        <div className="relative">
          <div className="h-24 w-24 bg-orange-50 rounded-[2.5rem] flex items-center justify-center text-[#FF5200] animate-pulse shadow-xl shadow-orange-500/10">
            <ChefHat size={48} className="animate-bounce" />
          </div>
          <div className="absolute inset-0 border-[3px] border-[#FF5200] border-t-transparent rounded-[2.5rem] animate-spin"></div>
        </div>

        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-black text-gray-900 tracking-tighter">Verifying Access</h2>
          <div className="flex items-center space-x-1 justify-center">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-1.5 w-1.5 bg-[#FF5200] rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user || (allowedRoles && !allowedRoles.includes(user.role as any))) {
    return null;
  }

  return <>{children}</>;
}
