import * as React from "react";
import { motion, HTMLMotionProps, useMotionValue, useSpring, useMotionTemplate, useTransform } from "motion/react";
import { cn } from "@/lib/utils";
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";

export type ButtonVariant = 
  | "header-primary"
  | "hero-primary"
  | "hero-secondary"
  | "feature-action"
  | "platform-handoff"
  | "editorial-action"
  | "conversion-primary"
  | "icon-control";

export type ButtonSize = "sm" | "md" | "lg";
export type ButtonIcon = "none" | "arrow-right" | "arrow-up-right" | "telegram" | "chevron-left" | "chevron-right";

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "size"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconName?: ButtonIcon;
  iconPosition?: "left" | "right";
  href?: string;
  target?: string;
  rel?: string;
}

// MOTION TOKENS
const SPRING_MAGNETIC = { stiffness: 140, damping: 24, mass: 0.7 };
const EASE_ENTER = [0.22, 1, 0.36, 1];
const DURATIONS = {
  press: 0.12,
  hoverFast: 0.16,
  hover: 0.20,
  hoverSlow: 0.24,
  highlightSweep: 0.52
};

export const Button = React.forwardRef<HTMLButtonElement & HTMLAnchorElement, ButtonProps>(
  (
    {
      className,
      variant = "hero-primary",
      size = "md",
      iconName = "none",
      iconPosition = "right",
      href,
      children,
      onPointerMove,
      onPointerLeave,
      ...props
    },
    ref
  ) => {
    const Component = (href ? motion.a : motion.button) as any;
    
    // Magnetic logic
    const isMagnetic = variant === "conversion-primary";
    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const springMx = useSpring(mx, SPRING_MAGNETIC);
    const springMy = useSpring(my, SPRING_MAGNETIC);
    
    // Content moves slightly more than container
    const contentMx = useTransform(springMx, (v) => v * 2);
    const contentMy = useTransform(springMy, (v) => v * 2);

    const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement | HTMLAnchorElement>) => {
      if (isMagnetic && e.pointerType !== "touch") {
        const rect = e.currentTarget.getBoundingClientRect();
        // Normalize -1 to 1
        const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
        // Clamp to ±1px container, ±2px content
        mx.set(Math.max(-1, Math.min(1, x)));
        my.set(Math.max(-1, Math.min(1, y)));
      }
      if (onPointerMove) onPointerMove(e as any);
    };

    const handlePointerLeave = (e: React.PointerEvent<HTMLButtonElement | HTMLAnchorElement>) => {
      if (isMagnetic && e.pointerType !== "touch") {
        mx.set(0);
        my.set(0);
      }
      if (onPointerLeave) onPointerLeave(e as any);
    };

    const IconElement = () => {
      if (iconName === "none") return null;
      const IconProps = { className: "w-4 h-4" };
      switch (iconName) {
        case "arrow-right": return <ArrowRight {...IconProps} />;
        case "arrow-up-right": return <ArrowUpRight {...IconProps} />;
        case "telegram": return <MessageCircle {...IconProps} />;
        case "chevron-left": return <ChevronLeft {...IconProps} />;
        case "chevron-right": return <ChevronRight {...IconProps} />;
      }
    };

    // Shared Base Styles
    const baseStyles = "relative inline-flex items-center justify-center font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none group";

    // Size Styles
    const sizes = {
      sm: "h-9 px-4 text-xs rounded-full",
      md: "h-11 px-6 text-sm rounded-full",
      lg: "h-13 px-8 py-3 text-[15px] rounded-full",
    };
    
    if (variant === "icon-control") {
      sizes.md = "h-11 w-11 rounded-full";
      sizes.sm = "h-9 w-9 rounded-full";
      sizes.lg = "h-14 w-14 rounded-full";
    }

    if (variant === "hero-secondary" || variant === "editorial-action") {
      sizes.sm = "py-2 text-xs";
      sizes.md = "py-2.5 text-sm";
      sizes.lg = "py-3 text-[15px]";
    }

    // Structure configuration based on variant
    const getVariantConfig = () => {
      switch (variant) {
        case "header-primary":
          return {
            containerClass: "bg-[#111] text-white hover:bg-[#1a1a1a] focus-visible:ring-neutral-900 focus-visible:ring-offset-white",
            containerHover: { y: -1 },
            containerPress: { y: 0, scale: 0.985 },
            iconHover: { x: 3 },
            iconTransition: { duration: DURATIONS.hoverFast, ease: EASE_ENTER },
            containerTransition: { duration: DURATIONS.hover, ease: EASE_ENTER },
          };
        case "hero-primary":
          return {
            containerClass: "bg-[#111] text-white overflow-hidden focus-visible:ring-neutral-900 focus-visible:ring-offset-[#FAF9F8]",
            containerHover: { y: -2, boxShadow: "0 12px 24px -8px rgba(0,0,0,0.2)" },
            containerPress: { scale: 0.985 },
            iconHover: { x: 4 },
            hasHighlightSweep: true,
            containerTransition: { duration: DURATIONS.hover, ease: EASE_ENTER },
          };
        case "hero-secondary":
          return {
            containerClass: "bg-transparent text-[#181818] overflow-visible",
            labelClass: "opacity-75 group-hover:opacity-100 transition-opacity duration-200 relative",
            labelHover: { x: 2 },
            iconHover: { x: 3 },
            hasUnderlineReveal: true,
            containerHover: {},
            containerPress: {},
          };
        case "feature-action":
          return {
            containerClass: "bg-transparent text-primary hover:text-black",
            iconHover: iconName === "arrow-up-right" ? { x: 2, y: -2 } : { x: 3 },
            hasSharedSurfaceHighlight: true,
            containerHover: {},
            containerPress: {},
          };
        case "platform-handoff":
          return {
            containerClass: "bg-[#F5F5F3] text-black hover:bg-white overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)]",
            containerHover: { y: -2 },
            containerPress: { scale: 0.985 },
            iconHover: { x: 2, y: -2 },
            telegramIconHover: { scale: 1.06, opacity: 1 },
            containerTransition: { duration: DURATIONS.hover, ease: EASE_ENTER },
          };
        case "editorial-action":
          return {
            containerClass: "bg-transparent border border-neutral-200 text-primary hover:border-neutral-300 hover:bg-neutral-50/50",
            iconHover: { x: 3 },
            containerHover: {},
            containerPress: {},
            containerTransition: { duration: DURATIONS.hover, ease: EASE_ENTER },
          };
        case "conversion-primary":
          return {
            containerClass: "bg-white text-black overflow-hidden shadow-[0_8px_24px_rgba(255,255,255,0.12)] focus-visible:ring-white focus-visible:ring-offset-[#0A0A0A]",
            containerHover: { y: -2 },
            containerPress: { scale: 0.982 },
            iconHover: { x: 3, y: -2 },
            hasHighlightSweep: true,
            containerTransition: { duration: DURATIONS.hover, ease: EASE_ENTER },
          };
        case "icon-control":
          return {
            containerClass: "bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 backdrop-blur-md",
            iconHover: iconName === "chevron-left" ? { x: -2 } : { x: 2 },
            containerHover: {},
            containerPress: { scale: 0.95 },
            containerTransition: { duration: DURATIONS.hoverFast, ease: EASE_ENTER },
          };
        default:
          return {
            containerClass: "bg-[#111] text-white hover:bg-[#1a1a1a]",
            containerHover: {},
            containerPress: { scale: 0.985 },
          };
      }
    };

    const config = getVariantConfig();

    return (
      <Component
        ref={ref}
        href={href}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className={cn(baseStyles, sizes[size], config.containerClass, className)}
        style={{ x: isMagnetic ? springMx : 0, y: isMagnetic ? springMy : 0 }}
        initial="rest"
        whileHover="hover"
        whileTap="pressed"
        variants={{
          rest: { y: 0, scale: 1, boxShadow: "none" },
          hover: config.containerHover || {},
          pressed: config.containerPress || {}
        }}
        transition={config.containerTransition || { duration: DURATIONS.hover, ease: EASE_ENTER }}
        {...props}
      >
        {/* Optional Sweep Highlight */}
        {config.hasHighlightSweep && (
          <motion.div 
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ 
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
              width: "120%",
              left: "-10%"
            }}
            variants={{
              rest: { x: "-100%" },
              hover: { x: "100%" }
            }}
            transition={{ duration: DURATIONS.highlightSweep, ease: EASE_ENTER }}
          />
        )}

        {/* Optional Shared Surface Highlight */}
        {config.hasSharedSurfaceHighlight && (
           <div className="absolute inset-0 rounded-full bg-neutral-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10" />
        )}

        {/* Content Wrapper for Magnetic offset */}
        <motion.div 
          className="relative flex items-center justify-center gap-2 z-10 w-full"
          style={{ x: isMagnetic ? contentMx : 0, y: isMagnetic ? contentMy : 0 }}
        >
          {/* Left Icon */}
          {iconName !== "none" && iconPosition === "left" && (
            <motion.span
              variants={{
                rest: { scale: iconName === "telegram" && variant === "platform-handoff" ? 0.8 : 1, opacity: iconName === "telegram" && variant === "platform-handoff" ? 0.8 : 1 },
                hover: config.telegramIconHover || config.iconHover || {},
              }}
              transition={config.iconTransition || { duration: DURATIONS.hoverFast, ease: EASE_ENTER }}
            >
              <IconElement />
            </motion.span>
          )}

          {/* Label */}
          {children && (
             <motion.span
                className={cn(config.labelClass)}
                variants={{
                  rest: { x: 0 },
                  hover: config.labelHover || {},
                }}
                transition={{ duration: DURATIONS.hoverFast, ease: EASE_ENTER }}
             >
               {children}
               {config.hasUnderlineReveal && (
                 <motion.span 
                   className="absolute left-0 -bottom-1 w-full h-[1.5px] bg-[#181818] origin-left"
                   variants={{
                     rest: { scaleX: 0 },
                     hover: { scaleX: 1 }
                   }}
                   transition={{ duration: 0.22, ease: EASE_ENTER }}
                 />
               )}
             </motion.span>
          )}

          {/* Right Icon */}
          {((iconName !== "none" && iconPosition === "right") || variant === "platform-handoff") && (
            <motion.span
              className="inline-flex items-center justify-center"
              variants={{
                rest: { x: 0, y: 0 },
                hover: config.iconHover || {},
              }}
              transition={config.iconTransition || { duration: DURATIONS.hoverFast, ease: EASE_ENTER }}
            >
              {variant === "platform-handoff" ? <ArrowUpRight className="w-4 h-4" /> : <IconElement />}
            </motion.span>
          )}
        </motion.div>
      </Component>
    );
  }
);
Button.displayName = "Button";
