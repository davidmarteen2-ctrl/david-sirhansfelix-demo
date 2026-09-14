import * as React from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { TELEGRAM_WELCOMING_URL } from "@/lib/config";
import { ArrowUpRight } from "lucide-react";

export function WordmarkFooter() {
  const shouldReduceMotion = useReducedMotion();
  const footerRef = React.useRef<HTMLElement>(null);
  const stageRef = React.useRef<HTMLDivElement>(null);
  const contentRef    = React.useRef<HTMLDivElement>(null);
  const bottomRailRef = React.useRef<HTMLDivElement>(null);
  const wordmarkRef   = React.useRef<HTMLDivElement>(null);

  const contentInView   = useInView(contentRef,    { once: true, margin: "-6% 0px" });
  const bottomInView    = useInView(bottomRailRef, { once: true, margin: "-6% 0px" });
  const wordmarkInView  = useInView(wordmarkRef,   { once: true, margin: "-8% 0px" });

  // Pointer smoothing refs for the ambient spotlight
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
    
    currentX.current = lerp(currentX.current, targetX.current, 0.15);
    currentY.current = lerp(currentY.current, targetY.current, 0.15);
    currentOpacity.current = lerp(currentOpacity.current, targetOpacity.current, 0.1);

    stageRef.current.style.setProperty('--spotlight-x', `${currentX.current}px`);
    stageRef.current.style.setProperty('--spotlight-y', `${currentY.current}px`);
    stageRef.current.style.setProperty('--spotlight-opacity', `${currentOpacity.current}`);

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

  // Framer-style subtle easing
  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show:   { opacity: 1, y: 0  },
  };
  const stagger = (i: number) => ({
    duration: 0.5,
    ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    delay: shouldReduceMotion ? 0 : i * 0.06,
  });

  return (
    <footer
      ref={footerRef}
      className="relative w-full bg-[#050505] text-white overflow-hidden"
      style={{
        marginTop: "-48px",
      }}
    >
      <style dangerouslySetInnerHTML={{__html: `
        .wordmark-reveal-layer {
          mask-image: radial-gradient(circle 240px at var(--spotlight-x, -1000px) var(--spotlight-y, -1000px), rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 20%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0) 70%);
          -webkit-mask-image: radial-gradient(circle 240px at var(--spotlight-x, -1000px) var(--spotlight-y, -1000px), rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 20%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0) 70%);
          opacity: var(--spotlight-opacity, 0);
          transition: opacity 0.12s ease-out;
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

      <div className="max-w-[1280px] mx-auto px-6 lg:px-12 flex flex-col pt-24 sm:pt-28 lg:pt-32">
        
        {/* Framer-Dev Style Header & Navigation */}
        <div
          ref={contentRef}
          className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 pb-16 border-b border-white/[0.08] relative z-10"
        >
          {/* Brand & Punchy One-Liner (6 cols) */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={contentInView ? "show" : "hidden"}
            transition={stagger(0)}
            className="md:col-span-5 lg:col-span-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="font-serif italic text-2xl tracking-tight text-white font-medium">
                  SirHansFelix
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono text-white/60 bg-white/[0.05] border border-white/[0.08]">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Desk
                </span>
              </div>
              <p className="text-sm text-white/50 max-w-sm leading-relaxed mb-6 font-light">
                High-probability forex setups and execution architecture for disciplined traders.
              </p>
            </div>

            {/* Quick Telegram Pill */}
            <div>
              <a
                href={TELEGRAM_WELCOMING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.06] hover:bg-white/10 border border-white/[0.1] text-xs font-medium text-white transition-all duration-200"
              >
                <span>Join Official Telegram</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-white/60 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
              </a>
            </div>
          </motion.div>

          {/* Clean 3-Column Minimal Links (6 cols) */}
          <div className="md:col-span-7 lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-8">
            
            {/* Column: Protocol */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate={contentInView ? "show" : "hidden"}
              transition={stagger(1)}
              className="flex flex-col space-y-3"
            >
              <div className="text-[11px] font-mono tracking-wider uppercase text-white/40">
                Protocol
              </div>
              <ul className="space-y-2.5 text-xs text-white/65">
                <li>
                  <a href="#signals" className="hover:text-white transition-colors duration-200">
                    Signals
                  </a>
                </li>
                <li>
                  <a href="#trading-showcase" className="hover:text-white transition-colors duration-200">
                    Setups
                  </a>
                </li>
                <li>
                  <a href="#offers" className="hover:text-white transition-colors duration-200">
                    Membership
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:text-white transition-colors duration-200">
                    Philosophy
                  </a>
                </li>
              </ul>
            </motion.div>

            {/* Column: Access */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate={contentInView ? "show" : "hidden"}
              transition={stagger(2)}
              className="flex flex-col space-y-3"
            >
              <div className="text-[11px] font-mono tracking-wider uppercase text-white/40">
                Access
              </div>
              <ul className="space-y-2.5 text-xs text-white/65">
                <li>
                  <a href="#apply" className="hover:text-white transition-colors duration-200">
                    Application
                  </a>
                </li>
                <li>
                  <a href="#broker" className="hover:text-white transition-colors duration-200">
                    Partner Broker
                  </a>
                </li>
                <li>
                  <a href="#community" className="hover:text-white transition-colors duration-200">
                    Community
                  </a>
                </li>
                <li>
                  <a href={TELEGRAM_WELCOMING_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-200 inline-flex items-center gap-1">
                    VIP Desk <ArrowUpRight className="w-2.5 h-2.5 opacity-50" />
                  </a>
                </li>
              </ul>
            </motion.div>

            {/* Column: Social / Direct */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate={contentInView ? "show" : "hidden"}
              transition={stagger(3)}
              className="flex flex-col space-y-3 col-span-2 sm:col-span-1"
            >
              <div className="text-[11px] font-mono tracking-wider uppercase text-white/40">
                Connect
              </div>
              <ul className="space-y-2.5 text-xs text-white/65">
                <li>
                  <a href={TELEGRAM_WELCOMING_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-200 inline-flex items-center gap-1">
                    Telegram <ArrowUpRight className="w-2.5 h-2.5 opacity-50" />
                  </a>
                </li>
                <li>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-200 inline-flex items-center gap-1">
                    Instagram <ArrowUpRight className="w-2.5 h-2.5 opacity-50" />
                  </a>
                </li>
                <li>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-200 inline-flex items-center gap-1">
                    Twitter / X <ArrowUpRight className="w-2.5 h-2.5 opacity-50" />
                  </a>
                </li>
                <li>
                  <a href="mailto:desk@sirhansfelix.com" className="hover:text-white transition-colors duration-200">
                    Direct Email
                  </a>
                </li>
              </ul>
            </motion.div>

          </div>
        </div>

        {/* Ambient Hero Wordmark Stage with Interactive Spotlight */}
        <div 
          ref={stageRef}
          onPointerMove={handlePointerMove}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          className="relative flex items-center justify-center py-14 lg:py-20 w-full select-none"
        >
          <motion.div
            ref={wordmarkRef}
            initial={shouldReduceMotion
              ? { opacity: 1, clipPath: 'inset(0 0 0% 0)', y: 0 }
              : { opacity: 0, clipPath: 'inset(0 0 40% 0)', y: 36 }
            }
            animate={wordmarkInView
              ? { opacity: 1, clipPath: 'inset(0 0 0% 0)', y: 0 }
              : {}
            }
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full flex justify-center items-center"
          >
            <div className="relative flex justify-center items-center w-full max-w-[98%]">
                {/* Layer A: Ambient Base Wordmark */}
                <div className="text-[clamp(42px,12vw,176px)] font-bold tracking-[-0.04em] lg:tracking-[-0.06em] leading-[0.85] text-white/[0.08] w-full text-center">
                  SIRHANSFELIX
                </div>

                {/* Layer B: Spotlight Reveal Wordmark */}
                <div 
                  aria-hidden="true"
                  className="wordmark-reveal-layer absolute inset-0 flex items-center justify-center text-[clamp(42px,12vw,176px)] font-bold tracking-[-0.04em] lg:tracking-[-0.06em] leading-[0.85] text-white/95 w-full text-center"
                >
                  SIRHANSFELIX
                </div>
            </div>
          </motion.div>
        </div>

        {/* Framer-Style Ultra-Minimal Bottom Bar */}
        <motion.div
          ref={bottomRailRef}
          variants={fadeUp}
          initial="hidden"
          animate={bottomInView ? "show" : "hidden"}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: shouldReduceMotion ? 0 : 0.12 }}
          className="flex flex-col sm:flex-row justify-between items-center py-8 border-t border-white/[0.06] gap-4 mt-auto relative z-10 text-[11px] font-mono text-white/40"
        >
          <div>
            &copy; {new Date().getFullYear()} SirHansFelix. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <span className="hidden md:inline text-white/25">•</span>
            <span className="text-white/30 hidden md:inline">London / New York Session Feeds</span>
            <span className="hidden md:inline text-white/25">•</span>
            <a href="#" className="hover:text-white/70 transition-colors duration-200">Privacy</a>
            <a href="#" className="hover:text-white/70 transition-colors duration-200">Terms</a>
          </div>
        </motion.div>

      </div>
    </footer>
  );
}
