"use client";

import { AlertCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorMessageProps {
  message?: string;
  className?: string;
  variant?: "error" | "warning";
}

export function ErrorMessage({ message, className, variant = "error" }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-xl animate-in slide-in-from-top-2 duration-300",
        variant === "error" && "bg-red-50 border border-red-200",
        variant === "warning" && "bg-yellow-50 border border-yellow-200",
        className
      )}
    >
      {variant === "error" ? (
        <XCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
      ) : (
        <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
      )}
      <div className="flex-1">
        <p
          className={cn(
            "text-sm font-medium",
            variant === "error" && "text-red-800",
            variant === "warning" && "text-yellow-800"
          )}
        >
          {message}
        </p>
      </div>
    </div>
  );
}

interface FieldErrorProps {
  error?: string;
}

export function FieldError({ error }: FieldErrorProps) {
  if (!error) return null;

  return (
    <p className="text-xs text-red-600 font-medium mt-1.5 flex items-center gap-1 animate-in slide-in-from-top-1 duration-200">
      <XCircle className="h-3 w-3" />
      {error}
    </p>
  );
}
