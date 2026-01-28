"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FullPageLoader } from "@/components/shared/FullPageLoader";

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

  if (loading && !user) {
    return <FullPageLoader message="Verifying Access" transparent />;
  }

  if (!user || (allowedRoles && !allowedRoles.includes(user.role as any))) {
    return null;
  }

  return <>{children}</>;
}
