import * as React from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { TELEGRAM_WELCOMING_URL } from "@/lib/config";
import { Button } from "@/components/ui/Button";

export function WordmarkFooter() {
  const shouldReduceMotion = useReducedMotion();
  const footerRef = React.useRef<HTMLElement>(null);
  const stageRef = React.useRef<HTMLDivElement>(null);
  const topRailRef = React.useRef<HTMLDivElement>(null);
  const bottomRailRef = React.useRef<HTMLDivElement>(null);

  const topRailInView   = useInView(topRailRef,    { once: true, margin: "-8% 0px" });
  const bottomInView    = useInView(bottomRailRef, { once: true, margin: "-8% 0px" });

  // Pointer smoothing refs
  const targetX = React.useRef(0);
  const targetY = React.useRef(0);
  const currentX = React.useRef(0);
  const currentY = React.useRef(0);
  const targetOpacity = React.useRef(0);
  const currentOpacity = React.useRef(0);
  const frameRef = React.useRef<number | null>(null);

  const lerp = (start: number, end: number, factor: number) => {
    return start + (end - start) * factor;
  };

  const updatePointer = React.useCallback(() => {
    if (!stageRef.current) return;
    
    // Smooth the coordinate and opacity values
    currentX.current = lerp(currentX.current, targetX.current, 0.15);
    currentY.current = lerp(currentY.current, targetY.current, 0.15);
    currentOpacity.current = lerp(currentOpacity.current, targetOpacity.current, 0.1);

    stageRef.current.style.setProperty('--spotlight-x', `${currentX.current}px`);
    stageRef.current.style.setProperty('--spotlight-y', `${currentY.current}px`);
    stageRef.current.style.setProperty('--spotlight-opacity', `${currentOpacity.current}`);

    // If still moving, request next frame
    const isMoving = 
      Math.abs(currentX.current - targetX.current) > 0.1 ||
      Math.abs(currentY.current - targetY.current) > 0.1 ||
      Math.abs(currentOpacity.current - targetOpacity.current) > 0.01;

    if (isMoving) {
      frameRef.current = requestAnimationFrame(updatePointer);
    } else {
      frameRef.current = null;
    }
  }, []);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (shouldReduceMotion || !stageRef.current || e.pointerType === 'touch') return;
    
    const rect = stageRef.current.getBoundingClientRect();
    targetX.current = e.clientX - rect.left;
    targetY.current = e.clientY - rect.top;
    targetOpacity.current = 1;

    if (!frameRef.current) {
      frameRef.current = requestAnimationFrame(updatePointer);
    }
  };

  const handlePointerEnter = (e: React.PointerEvent) => {
    if (shouldReduceMotion || !stageRef.current || e.pointerType === 'touch') return;
    
    const rect = stageRef.current.getBoundingClientRect();
    currentX.current = e.clientX - rect.left;
    currentY.current = e.clientY - rect.top;
    targetX.current = currentX.current;
    targetY.current = currentY.current;
    targetOpacity.current = 1;
    
    if (!frameRef.current) {
      frameRef.current = requestAnimationFrame(updatePointer);
    }
  };

  const handlePointerLeave = (e: React.PointerEvent) => {
    if (e.pointerType === 'touch') return;
    targetOpacity.current = 0;
    if (!frameRef.current) {
      frameRef.current = requestAnimationFrame(updatePointer);
    }
  };

  React.useEffect(() => {
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const isInView = useInView(footerRef, { once: true, margin: "-10% 0px" });

  // Shared reveal variants
  const fadeUp = {
    hidden: { opacity: 0, y: 22 },
    show:   { opacity: 1, y: 0  },
  };
  const stagger = (i: number) => ({
    duration: 0.55,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    delay: shouldReduceMotion ? 0 : i * 0.07,
  });

  return (
    <footer
      ref={footerRef}
      className="relative w-full bg-[#050505] text-white overflow-hidden"
      style={{
        /* Rounded top edge that slides up and overtakes the form section */
        borderRadius: "48px 48px 0 0",
        marginTop: "-48px",
        position: "relative",
        zIndex: 10,
      }}
    >
      
      <style dangerouslySetInnerHTML={{__html: `
        .wordmark-reveal-layer {
          mask-image: radial-gradient(circle 220px at var(--spotlight-x, -1000px) var(--spotlight-y, -1000px), rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 18%, rgba(0,0,0,0.55) 42%, rgba(0,0,0,0) 68%);
          -webkit-mask-image: radial-gradient(circle 220px at var(--spotlight-x, -1000px) var(--spotlight-y, -1000px), rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 18%, rgba(0,0,0,0.55) 42%, rgba(0,0,0,0) 68%);
          opacity: var(--spotlight-opacity, 0);
          transition: opacity 0.1s ease-out; /* fallback if JS is disabled */
        }
        @media (hover: none) and (pointer: coarse) {
          .wordmark-reveal-layer {
            mask-image: radial-gradient(ellipse at 70% 50%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 70%);
            -webkit-mask-image: radial-gradient(ellipse at 70% 50%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 70%);
            opacity: 1 !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .wordmark-reveal-layer {
            mask-image: radial-gradient(ellipse at 70% 50%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 70%);
            -webkit-mask-image: radial-gradient(ellipse at 70% 50%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 70%);
            opacity: 1 !important;
          }
        }
      `}} />

      <div className="max-w-[1280px] mx-auto px-6 lg:px-12 flex flex-col min-h-[60vh] lg:min-h-[75vh]">
        
        {/* Footer Top Rail — staggered scroll reveal */}
        <div
          ref={topRailRef}
          className="flex flex-col md:flex-row justify-between items-start md:items-center py-10 lg:py-12 gap-8 z-10 relative"
        >
          {/* Wordmark */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={topRailInView ? "show" : "hidden"}
            transition={stagger(0)}
            className="font-serif italic text-[22px] tracking-tight text-white/90"
          >
            SirHansFelix
          </motion.div>

          <nav aria-label="Footer" className="flex flex-wrap items-center gap-6 lg:gap-10 text-[13px] font-medium tracking-wide">
            {(["Offers", "Signals", "Telegram", "About"] as const).map((label, i) => (
              <motion.a
                key={label}
                href={`#${label.toLowerCase()}`}
                variants={fadeUp}
                initial="hidden"
                animate={topRailInView ? "show" : "hidden"}
                transition={stagger(i + 1)}
                className="text-white/60 hover:text-white transition-colors duration-200"
              >
                {label}
              </motion.a>
            ))}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate={topRailInView ? "show" : "hidden"}
              transition={stagger(5)}
            >
              <Button
                variant="feature-action"
                iconName="arrow-up-right"
                className="text-white/90 p-0 h-auto"
                href={TELEGRAM_WELCOMING_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Join Telegram
              </Button>
            </motion.div>
          </nav>
        </div>

        {/* Wordmark Stage */}
        <div 
          ref={stageRef}
          onPointerMove={handlePointerMove}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          className="relative flex-1 flex items-center justify-center min-h-[300px] lg:min-h-[420px] w-full select-none"
        >
          {/* Scroll Reveal Wrapper */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, clipPath: 'inset(0)' } : { opacity: 0.65, clipPath: 'inset(0 0 18% 0)', y: 24 }}
            animate={isInView ? { opacity: 1, clipPath: 'inset(0 0 0% 0)', y: 0 } : {}}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full flex justify-center items-center"
          >
            <div className="relative flex justify-center items-center w-full max-w-[96%]">
                {/* Layer A: Base Semantic Wordmark */}
                <div className="text-[clamp(40px,10.5vw,164px)] font-bold tracking-[-0.04em] lg:tracking-[-0.06em] leading-[0.85] text-white/10 w-full text-center">
                  SIRHANSFELIX
                </div>

                {/* Layer B: Reveal Wordmark */}
                <div 
                  aria-hidden="true"
                  className="wordmark-reveal-layer absolute inset-0 flex items-center justify-center text-[clamp(40px,10.5vw,164px)] font-bold tracking-[-0.04em] lg:tracking-[-0.06em] leading-[0.85] text-white/95 w-full text-center"
                >
                  SIRHANSFELIX
                </div>
            </div>
          </motion.div>
        </div>

        {/* Footer Bottom Rail — scroll reveal */}
        <motion.div
          ref={bottomRailRef}
          variants={fadeUp}
          initial="hidden"
          animate={bottomInView ? "show" : "hidden"}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: shouldReduceMotion ? 0 : 0.15 }}
          className="flex flex-col sm:flex-row justify-between items-center py-6 lg:py-8 border-t border-white/10 gap-4 mt-auto relative z-10"
        >
          <div className="text-xs text-white/50 tracking-wide">&copy; {new Date().getFullYear()} SirHansFelix. All rights reserved.</div>
          <div className="flex gap-6 text-xs text-white/50 tracking-wide">
            <a href="#" className="hover:text-white transition-colors duration-200">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors duration-200">Terms of Service</a>
          </div>
        </motion.div>

      </div>
    </footer>
  );
}
