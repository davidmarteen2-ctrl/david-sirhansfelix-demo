import * as React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  className?: string;
  children?: React.ReactNode;
  variant?: "default" | "dark" | "outline";
}

export function Badge({ className, variant = "default", children }: BadgeProps) {
  const variants = {
    default: "bg-neutral-100 text-primary",
    dark: "bg-primary text-white",
    outline: "border border-border text-primary",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        variants[variant],
        className
      )}
    >
      {children}
    </div>
  );
}
