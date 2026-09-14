import * as React from "react";
import { cn } from "@/lib/utils";

interface BentoGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function BentoGrid({ children, className, ...props }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-3 md:gap-4 lg:gap-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
