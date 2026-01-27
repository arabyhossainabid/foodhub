"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import AOS from "aos";
import "aos/dist/aos.css";

export const AOSProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Initial AOS setup
    AOS.init({
      duration: 800,
      once: true, // Only animate once to prevent disappearing on scroll
      easing: "ease-out-quad",
      offset: 50,
      disable: 'mobile',
    });
  }, []);

  // Refresh and re-run AOS on every route change
  useEffect(() => {
    if (isMounted) {
      setTimeout(() => {
        AOS.refresh();
      }, 100);
    }
  }, [pathname, isMounted]);

  return <>{children}</>;
};
