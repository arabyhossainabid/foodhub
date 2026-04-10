"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FullPageLoader } from "@/components/shared/FullPageLoader";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("CUSTOMER" | "PROVIDER" | "ADMIN")[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (allowedRoles && !allowedRoles.includes(user.role as any)) {
        router.push("/");
      } else {
        setIsReady(true);
      }
    }
  }, [user, loading, router, allowedRoles]);

  // If still loading identity, show full loader
  if (loading) {
    return <FullPageLoader message="Authenticating Environment..." transparent />;
  }

  // If not ready (redirecting), show nothing to prevent flickering
  if (!isReady || !user || (allowedRoles && !allowedRoles.includes(user.role as any))) {
    return null;
  }

  return <>{children}</>;
}
