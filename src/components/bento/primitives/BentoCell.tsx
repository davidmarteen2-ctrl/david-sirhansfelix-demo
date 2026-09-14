import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "motion/react";

interface BentoCellProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "bottom-left" | "right" | "bottom" | "top";
}

export function BentoCell({
  children,
  className,
  delay = 0,
  direction = "bottom",
  ...props
}: BentoCellProps) {
  const shouldReduceMotion = useReducedMotion();

  const getInitialPosition = () => {
    if (shouldReduceMotion) return { x: 0, y: 0 };
    switch (direction) {
      case "bottom-left":
        return { x: -12, y: 16 };
      case "right":
        return { x: 18, y: 0 };
      case "bottom":
        return { x: 0, y: 16 };
      case "top":
        return { x: 0, y: -16 };
      default:
        return { x: 0, y: 16 };
    }
  };

  const initialPos = getInitialPosition();

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...initialPos }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{
        duration: 0.52,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(
        "group relative flex flex-col overflow-hidden",
        "bg-white rounded-[20px] border border-neutral-200/60 shadow-sm",
        "transition-colors hover:border-neutral-300/80",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
