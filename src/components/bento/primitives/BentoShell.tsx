import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "motion/react";

interface BentoShellProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function BentoShell({ children, className, ...props }: BentoShellProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
      className={cn("w-full mx-auto max-w-[1160px]", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
