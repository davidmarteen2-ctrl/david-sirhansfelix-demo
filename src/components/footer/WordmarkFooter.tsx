import * as React from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { TELEGRAM_WELCOMING_URL } from "@/lib/config";
import { 
  ArrowUpRight, 
  Send, 
  ShieldCheck, 
  Activity, 
  CheckCircle2, 
  Lock, 
  TrendingUp,
  Globe2
} from "lucide-react";

export function WordmarkFooter() {
  const shouldReduceMotion = useReducedMotion();
  const footerRef = React.useRef<HTMLElement>(null);
  const stageRef = React.useRef<HTMLDivElement>(null);
  const topRailRef    = React.useRef<HTMLDivElement>(null);
  const bottomRailRef = React.useRef<HTMLDivElement>(null);
  const wordmarkRef   = React.useRef<HTMLDivElement>(null);

  const topRailInView   = useInView(topRailRef,    { once: true, margin: "-6% 0px" });
  const bottomInView    = useInView(bottomRailRef, { once: true, margin: "-6% 0px" });
  const wordmarkInView  = useInView(wordmarkRef,   { once: true, margin: "-8% 0px" });

  // Pointer smoothing refs for the wordmark spotlight
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

  // Shared reveal variants
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show:   { opacity: 1, y: 0  },
  };
  const stagger = (i: number) => ({
    duration: 0.55,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
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
          mask-image: radial-gradient(circle 220px at var(--spotlight-x, -1000px) var(--spotlight-y, -1000px), rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 18%, rgba(0,0,0,0.55) 42%, rgba(0,0,0,0) 68%);
          -webkit-mask-image: radial-gradient(circle 220px at var(--spotlight-x, -1000px) var(--spotlight-y, -1000px), rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 18%, rgba(0,0,0,0.55) 42%, rgba(0,0,0,0) 68%);
          opacity: var(--spotlight-opacity, 0);
          transition: opacity 0.1s ease-out;
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
        
        {/* Main Footer Content Grid */}
        <div
          ref={topRailRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-16 border-b border-white/[0.08] relative z-10"
        >
          {/* Col 1: Brand & Institutional Identity (4 cols) */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={topRailInView ? "show" : "hidden"}
            transition={stagger(0)}
            className="lg:col-span-4 flex flex-col pr-0 lg:pr-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="font-serif italic text-2xl tracking-tight text-white font-medium">
                SirHansFelix
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-white/10 text-white/80 border border-white/10">
                Praxis Protocol
              </span>
            </div>

            <p className="text-[13px] leading-relaxed text-white/60 mb-6 max-w-sm">
              Institutional FX execution desk, algorithmic order-flow architecture, and high-probability daily trade setups engineered for disciplined market operators.
            </p>

            {/* Live Trading Desk Status Indicator */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] mb-6">
              <div className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </div>
              <div className="text-xs">
                <div className="font-medium text-white/90">London & New York Desks Active</div>
                <div className="text-white/50 text-[11px]">Real-Time Liquidity Feeds • Live Setups</div>
              </div>
            </div>

            {/* Quick Trust Badges */}
            <div className="flex items-center gap-4 text-xs text-white/50">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Verified Track Record
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-white/60" />
                Institutional Encryption
              </span>
            </div>
          </motion.div>

          {/* Col 2: Signals & Strategies (2 cols) */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={topRailInView ? "show" : "hidden"}
            transition={stagger(1)}
            className="lg:col-span-2 flex flex-col space-y-3.5"
          >
            <h4 className="text-[11px] font-semibold tracking-widest uppercase text-white/40">
              Signals & Setups
            </h4>
            <ul className="space-y-2.5 text-[13px]">
              <li>
                <a href="#signals" className="text-white/70 hover:text-white transition-colors duration-200">
                  London Open Setups
                </a>
              </li>
              <li>
                <a href="#signals" className="text-white/70 hover:text-white transition-colors duration-200">
                  NY Session Breakouts
                </a>
              </li>
              <li>
                <a href="#trading-showcase" className="text-white/70 hover:text-white transition-colors duration-200">
                  XAU/USD Gold Engine
                </a>
              </li>
              <li>
                <a href="#trading-showcase" className="text-white/70 hover:text-white transition-colors duration-200">
                  Order Flow Models
                </a>
              </li>
              <li>
                <a href="#offers" className="text-white/70 hover:text-white transition-colors duration-200">
                  Risk Management Rules
                </a>
              </li>
              <li>
                <a href="#offers" className="text-white/70 hover:text-white transition-colors duration-200">
                  Performance Ledger
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Col 3: Membership & Access (2 cols) */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={topRailInView ? "show" : "hidden"}
            transition={stagger(2)}
            className="lg:col-span-2 flex flex-col space-y-3.5"
          >
            <h4 className="text-[11px] font-semibold tracking-widest uppercase text-white/40">
              Desk & Access
            </h4>
            <ul className="space-y-2.5 text-[13px]">
              <li>
                <a href={TELEGRAM_WELCOMING_URL} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors duration-200 inline-flex items-center gap-1">
                  Private VIP Telegram
                  <ArrowUpRight className="w-3 h-3 text-white/40" />
                </a>
              </li>
              <li>
                <a href="#apply" className="text-white/70 hover:text-white transition-colors duration-200">
                  Direct Trader Application
                </a>
              </li>
              <li>
                <a href="#broker" className="text-white/70 hover:text-white transition-colors duration-200">
                  Institutional Broker Desk
                </a>
              </li>
              <li>
                <a href="#offers" className="text-white/70 hover:text-white transition-colors duration-200">
                  Tier-1 Membership Tiers
                </a>
              </li>
              <li>
                <a href="#about" className="text-white/70 hover:text-white transition-colors duration-200">
                  1-on-1 Portfolio Reviews
                </a>
              </li>
              <li>
                <a href="#community" className="text-white/70 hover:text-white transition-colors duration-200">
                  Global Trader Network
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Col 4: Dispatch & Instant Channel Card (4 cols) */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={topRailInView ? "show" : "hidden"}
            transition={stagger(3)}
            className="lg:col-span-4 flex flex-col"
          >
            <div className="p-6 rounded-2xl bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-white/[0.1] shadow-2xl relative overflow-hidden">
              {/* Subtle ambient gradient accent */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/[0.04] rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-semibold tracking-tight text-white">
                  Join the Live Telegram Dispatch
                </h4>
              </div>

              <p className="text-[12px] text-white/60 leading-relaxed mb-5">
                Receive immediate institutional alert dispatches, London session pre-market analysis, and real-time execution parameters.
              </p>

              <a
                href={TELEGRAM_WELCOMING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-full inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-white text-black font-semibold text-xs tracking-wide hover:bg-white/90 active:scale-[0.99] transition-all shadow-[0_0_24px_rgba(255,255,255,0.15)] mb-4"
              >
                <Send className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                <span>Enter Official Telegram Channel</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
              </a>

              <div className="flex items-center justify-between text-[11px] text-white/50 pt-2 border-t border-white/[0.06]">
                <span className="inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Zero Spam • Verified Signals
                </span>
                <span className="text-white/40">15,000+ Active Traders</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Regulatory Risk Notice Box */}
        <div className="py-8 border-b border-white/[0.08] relative z-10">
          <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-col md:flex-row items-start md:items-center gap-4 text-white/50 text-[11px] leading-relaxed">
            <div className="flex-shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/[0.05] border border-white/10 font-mono text-[10px] tracking-wider uppercase text-white/70">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              Risk Disclosure
            </div>
            <p className="flex-1">
              Trading Foreign Exchange (Forex), Bullion, and Contracts for Difference (CFDs) carries a substantial level of risk and may not be suitable for all investors. Leveraged instruments amplify both potential profits and potential downside losses. Past performance, backtested analytics, and historical trade setups are not guarantees of future outcomes. All information provided by SirHansFelix is for educational, analytical, and strategic market review purposes only.
            </p>
          </div>
        </div>

        {/* Large Ambient Wordmark Stage with Interactive Spotlight */}
        <div 
          ref={stageRef}
          onPointerMove={handlePointerMove}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          className="relative flex items-center justify-center py-12 lg:py-16 w-full select-none"
        >
          {/* Wordmark Scroll Reveal */}
          <motion.div
            ref={wordmarkRef}
            initial={shouldReduceMotion
              ? { opacity: 1, clipPath: 'inset(0 0 0% 0)', y: 0 }
              : { opacity: 0, clipPath: 'inset(0 0 40% 0)', y: 48 }
            }
            animate={wordmarkInView
              ? { opacity: 1, clipPath: 'inset(0 0 0% 0)', y: 0 }
              : {}
            }
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full flex justify-center items-center"
          >
            <div className="relative flex justify-center items-center w-full max-w-[98%]">
                {/* Layer A: Base Semantic Wordmark */}
                <div className="text-[clamp(38px,11vw,168px)] font-bold tracking-[-0.04em] lg:tracking-[-0.06em] leading-[0.85] text-white/10 w-full text-center">
                  SIRHANSFELIX
                </div>

                {/* Layer B: Reveal Wordmark with Spotlight */}
                <div 
                  aria-hidden="true"
                  className="wordmark-reveal-layer absolute inset-0 flex items-center justify-center text-[clamp(38px,11vw,168px)] font-bold tracking-[-0.04em] lg:tracking-[-0.06em] leading-[0.85] text-white/95 w-full text-center"
                >
                  SIRHANSFELIX
                </div>
            </div>
          </motion.div>
        </div>

        {/* Footer Bottom Rail */}
        <motion.div
          ref={bottomRailRef}
          variants={fadeUp}
          initial="hidden"
          animate={bottomInView ? "show" : "hidden"}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: shouldReduceMotion ? 0 : 0.15 }}
          className="flex flex-col sm:flex-row justify-between items-center py-8 border-t border-white/10 gap-4 mt-auto relative z-10 text-[12px] text-white/50"
        >
          <div className="flex items-center gap-2">
            <span>&copy; {new Date().getFullYear()} SirHansFelix Praxis Desk. All rights reserved.</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-white/60">
            <a href="#signals" className="hover:text-white transition-colors duration-200">Signals</a>
            <a href="#broker" className="hover:text-white transition-colors duration-200">Broker Protocol</a>
            <a href="#apply" className="hover:text-white transition-colors duration-200">Trader Intake</a>
            <a href="#" className="hover:text-white transition-colors duration-200">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors duration-200">Terms of Desk</a>
          </div>
        </motion.div>

      </div>
    </footer>
  );
}
