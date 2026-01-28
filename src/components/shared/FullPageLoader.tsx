"use client";

import { ChefHat } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FullPageLoaderProps {
  message?: string;
  transparent?: boolean;
  mode?: "fixed" | "local";
}

export function FullPageLoader({
  message = "Preparing Your Experience",
  transparent = false,
  mode = "fixed"
}: FullPageLoaderProps) {
  const containerClasses = mode === "fixed"
    ? `fixed inset-0 z-99999 ${transparent ? "bg-white/80 backdrop-blur-md" : "bg-white"}`
    : `absolute inset-0 z-50 rounded-md ${transparent ? "bg-white/60 backdrop-blur-sm" : "bg-white"}`;

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-6", containerClasses)}>
      <div className="relative">
        <div className="h-20 w-20 bg-orange-50 rounded-[2rem] flex items-center justify-center text-[#FF5200] animate-pulse shadow-xl shadow-orange-500/10">
          <ChefHat size={40} className="animate-bounce" />
        </div>
        <div className="absolute inset-0 border-[3px] border-[#FF5200] border-t-transparent rounded-[2rem] animate-spin"></div>
      </div>

      <div className="space-y-1 text-center text-gray-900">
        <h2 className={cn("font-black tracking-tighter", mode === "local" ? "text-lg" : "text-2xl")}>{message}</h2>
        <div className="flex items-center space-x-1 justify-center">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-1 w-1 bg-[#FF5200] rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
