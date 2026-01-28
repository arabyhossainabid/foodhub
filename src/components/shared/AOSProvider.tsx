"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export const AOSProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const initAOS = () => {
      AOS.init({
        duration: 800,
        once: false,
      });
    };

    if (document.readyState === 'complete') {
      initAOS();
    } else {
      window.addEventListener('load', initAOS);
      return () => window.removeEventListener('load', initAOS);
    }
  }, []);

  return <>{children}</>;
};
