import * as React from "react";
import { 
  motion, 
  useInView, 
  useReducedMotion,
  useMotionValue,
  useSpring,
  useMotionValueEvent
} from "motion/react";
import { ArrowRight, Activity, MessageCircle } from "lucide-react";
import { TELEGRAM_WELCOMING_URL } from "@/lib/config";
import { Button } from "@/components/ui/Button";

// --- MOTION TOKENS ---
const MOTION = {
  duration: {
    micro: 0.15,
    icon: 0.18,
    hover: 0.2,
    chip: 0.28,
    copy: 0.36,
    headline: 0.55,
    surface: 0.65,
    product: 0.8,
    atmosphere: 1.0,
  },
  stagger: {
    micro: 0.04,
    text: 0.07,
    product: 0.09,
  },
  ease: {
    enter: [0.22, 1, 0.36, 1],
    product: [0.16, 1, 0.3, 1],
    micro: [0.2, 0, 0, 1]
  }
};

const TIMINGS = {
  stage: 0,
  atmosphere: 0,
  eyebrow: 0.12,
  headlineL1: 0.18,
  headlineL2: 0.25,
  headlineAccent: 0.32,
  peripheral: 0.52,
  centerProduct: 0.65,
  leftProduct: 0.74,
  rightProduct: 0.82,
  
  centerChrome: 0.85,
  centerPanels: 0.95,
  
  leftHeader: 0.94,
  leftBars: 1.04,
  leftFooter: 1.24,
  
  rightIcon: 1.04,
  rightTitle: 1.10,
  rightCopy: 1.16,
  rightStatus: 1.22,
  
  supportingCopy: 1.08,
  ctaActivation: 1.28,
  focusShift: 1.45
};

export function ImmersiveCTAStage() {
  const shouldReduceMotion = useReducedMotion();
  const stageRef = React.useRef<HTMLElement>(null);
  const isInView = useInView(stageRef, { once: true, margin: "-15% 0px" });

  const pointerPx = useMotionValue(0);
  const pointerPy = useMotionValue(0);
  const pointerLightX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
  const pointerLightY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 0);

  const springConfig = { stiffness: 90, damping: 22, mass: 0.7 };
  const smoothPx = useSpring(pointerPx, springConfig);
  const smoothPy = useSpring(pointerPy, springConfig);
  const smoothLightX = useSpring(pointerLightX, springConfig);
  const smoothLightY = useSpring(pointerLightY, springConfig);
  
  const [isHovering, setIsHovering] = React.useState(false);

  useMotionValueEvent(smoothPx, "change", (v) => {
    if (stageRef.current && !shouldReduceMotion) stageRef.current.style.setProperty('--px', v.toString());
  });
  useMotionValueEvent(smoothPy, "change", (v) => {
    if (stageRef.current && !shouldReduceMotion) stageRef.current.style.setProperty('--py', v.toString());
  });
  useMotionValueEvent(smoothLightX, "change", (v) => {
    if (stageRef.current && !shouldReduceMotion) stageRef.current.style.setProperty('--mouse-x', `${v}px`);
  });
  useMotionValueEvent(smoothLightY, "change", (v) => {
    if (stageRef.current && !shouldReduceMotion) stageRef.current.style.setProperty('--mouse-y', `${v}px`);
  });

  const handlePointerMove = (e: React.PointerEvent) => {
    if (shouldReduceMotion || e.pointerType === 'touch') return;
    const px = (e.clientX / window.innerWidth - 0.5) * 2;
    const py = (e.clientY / window.innerHeight - 0.5) * 2;
    pointerPx.set(px);
    pointerPy.set(py);
    pointerLightX.set(e.clientX);
    pointerLightY.set(e.clientY);
  };

  const handlePointerEnter = (e: React.PointerEvent) => {
    if (e.pointerType !== 'touch') setIsHovering(true);
  };

  const handlePointerLeave = (e: React.PointerEvent) => {
    if (e.pointerType === 'touch') return;
    setIsHovering(false);
    pointerPx.set(0);
    pointerPy.set(0);
    pointerLightX.set(window.innerWidth / 2);
    pointerLightY.set(window.innerHeight / 2);
  };

  return (
    <section 
      ref={stageRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      // Soft Footer Handoff: The gradient seamlessly merges with the footer black without animating out.
      className="relative w-full pt-16 pb-28 lg:pt-24 lg:pb-36 px-4 lg:px-8 bg-gradient-to-b from-[#FAF9F8] via-[#FAF9F8] to-[#050505] overflow-hidden"
    >
      <motion.div 
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.988, y: 14 }}
        animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
        transition={{ duration: MOTION.duration.surface, ease: MOTION.ease.enter }}
        className="relative mx-auto w-full max-w-[1280px] min-h-[620px] lg:min-h-[720px] rounded-[28px] lg:rounded-[36px] bg-[#0A0A0A] overflow-hidden border border-white/[0.04] flex items-center justify-center shadow-2xl"
      >
        {/* Layer 02: Ambient Gradient Field */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,rgba(255,255,255,0.035),transparent_70%)] pointer-events-none" />
        
        {/* Layer 03: Trading Grid Texture */}
        <motion.div 
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: MOTION.duration.atmosphere, delay: 0.1, ease: "linear" }}
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
            backgroundPosition: 'center',
            maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 75%)',
            ...(!shouldReduceMotion && { transform: 'translate(calc(var(--px) * 1px), calc(var(--py) * 1px))' })
          }}
        />

        {/* Layer 04: Soft Radial Light (Pointer Spotlight) */}
        {!shouldReduceMotion && (
          <motion.div 
            initial={{ opacity: 0, scale: 1.06 }}
            animate={isInView && isHovering ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.06 }}
            transition={{ duration: MOTION.duration.atmosphere, ease: "easeOut" }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(500px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.035), transparent 60%)`
            }}
          />
        )}

        {/* Layer 05: Edge Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.5)_120%)] pointer-events-none" />


        {/* --- Peripheral Artifact Layer --- */}

        {/* Background Depth (±2px) */}
        <div className="absolute inset-0 pointer-events-none hidden lg:block">
          {/* Artifact 03: Market Analysis (Top Right) */}
          <motion.div 
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: 20, scale: 0.97 }}
            animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: TIMINGS.peripheral, ease: MOTION.ease.enter }}
            className="absolute top-[80px] right-[40px] xl:right-[-20px]"
          >
            <motion.div
               initial={{ opacity: 1 }}
               animate={isInView ? { opacity: 0.55 } : {}}
               transition={{ duration: 0.5, delay: TIMINGS.focusShift, ease: MOTION.ease.enter }}
            >
              <motion.div 
                 style={!shouldReduceMotion ? { transform: 'translate(calc(var(--px) * 2px), calc(var(--py) * 2px))' } : {}}
                 whileHover={{ y: -3, scale: 1.008 }}
                 className="bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 flex items-center gap-2 shadow-lg pointer-events-auto"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                <span className="text-[10px] font-semibold tracking-widest text-neutral-300 uppercase">Market Analysis</span>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Artifact 04: Market Context (Top Left) */}
          <motion.div 
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -20, scale: 0.97 }}
            animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: TIMINGS.peripheral + 0.07, ease: MOTION.ease.enter }}
            className="absolute top-[120px] left-[60px]"
          >
            <motion.div
               initial={{ opacity: 1 }}
               animate={isInView ? { opacity: 0.55 } : {}}
               transition={{ duration: 0.5, delay: TIMINGS.focusShift, ease: MOTION.ease.enter }}
            >
              <motion.div 
                 style={!shouldReduceMotion ? { transform: 'translate(calc(var(--px) * 2px), calc(var(--py) * 2px))' } : {}}
                 whileHover={{ y: -3, scale: 1.008 }}
                 className="bg-[#111] border border-white/5 rounded-2xl p-4 w-[160px] shadow-xl pointer-events-auto"
              >
                <div className="text-[9px] font-semibold tracking-widest text-neutral-500 mb-2 uppercase">Market Context</div>
                <div className="h-1.5 w-3/4 bg-white/10 rounded-full mb-2" />
                <div className="h-1.5 w-1/2 bg-white/10 rounded-full mb-4" />
                <div className="text-[9px] font-semibold tracking-widest text-neutral-500 uppercase">Structure Mapped</div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Midground Depth (±4px, ±3px) */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Artifact 01: Trading Chart (Bottom Left cropped) - hidden on mobile to avoid clutter */}
          <motion.div 
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 85, scale: 0.96 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.7, delay: TIMINGS.leftProduct, ease: MOTION.ease.product }}
            className="absolute bottom-[-60px] left-[-30px] hidden lg:block"
          >
            <motion.div
               initial={{ opacity: 1 }}
               animate={isInView ? { opacity: 0.82 } : {}}
               transition={{ duration: 0.5, delay: TIMINGS.focusShift, ease: MOTION.ease.enter }}
               style={!shouldReduceMotion ? { transform: 'translate(calc(var(--px) * 4px), calc(var(--py) * 3px))' } : {}}
            >
              <motion.div 
                whileHover={{ y: -3, scale: 1.008 }}
                className="bg-[#111] border border-white/10 rounded-2xl p-5 w-[240px] shadow-2xl pointer-events-auto cursor-default hover:border-white/20 transition-colors"
              >
                <div className="flex justify-between items-center mb-4">
                  <motion.span 
                    initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.2, delay: TIMINGS.leftHeader }}
                    className="text-xs font-semibold text-neutral-300"
                  >
                    EUR/USD
                  </motion.span>
                  <motion.span 
                    initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 4 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.2, delay: TIMINGS.leftHeader }}
                    className="text-[10px] text-neutral-500 bg-white/5 px-2 py-0.5 rounded"
                  >
                    4H
                  </motion.span>
                </div>
                <div className="w-full h-[60px] flex items-end gap-1">
                  {[40, 60, 30, 80, 50, 70, 45, 90].map((h, i) => (
                    <motion.div 
                      key={i} 
                      initial={shouldReduceMotion ? { scaleY: 1 } : { scaleY: 0 }}
                      animate={isInView ? { scaleY: 1 } : {}}
                      transition={{ duration: 0.35, delay: TIMINGS.leftBars + (i * 0.04), ease: MOTION.ease.product }}
                      className="flex-1 bg-neutral-700/40 rounded-sm origin-bottom" 
                      style={{ height: `${h}%` }} 
                    />
                  ))}
                </div>
                <motion.div 
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.3, delay: TIMINGS.leftFooter }}
                  className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between"
                >
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">Plan Defined</span>
                  <Activity className="w-3.5 h-3.5 text-neutral-400" />
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Artifact 05: Session Chip (Bottom Right, mid-height) - hidden on mobile */}
          <motion.div 
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: 20, scale: 0.97 }}
            animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: TIMINGS.peripheral + 0.14, ease: MOTION.ease.enter }}
            className="absolute bottom-[240px] right-[50px] hidden lg:block"
          >
            <motion.div
               initial={{ opacity: 1 }}
               animate={isInView ? { opacity: 0.55 } : {}}
               transition={{ duration: 0.5, delay: TIMINGS.focusShift, ease: MOTION.ease.enter }}
            >
              <motion.div 
                 style={!shouldReduceMotion ? { transform: 'translate(calc(var(--px) * 4px), calc(var(--py) * 3px))' } : {}}
                 whileHover={{ y: -3, scale: 1.008 }}
                 className="bg-[#151515] border border-white/10 rounded-full px-5 py-2.5 flex items-center gap-2 shadow-lg pointer-events-auto hover:border-white/20 transition-colors cursor-default"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
                <span className="text-[10px] font-semibold tracking-widest text-neutral-300 uppercase">Trading Session</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Foreground Depth (±4px, ±3px) */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Artifact 02: Telegram Handoff (Bottom Right cropped) - Visible on mobile! */}
          <motion.div 
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 90, x: 20, scale: 0.96 }}
            animate={isInView ? { opacity: 1, y: 0, x: 0, scale: 1 } : {}}
            transition={{ duration: 0.7, delay: TIMINGS.rightProduct, ease: MOTION.ease.product }}
            className="absolute -bottom-[20px] -right-[30px] sm:bottom-[-30px] sm:right-[-20px] opacity-40 sm:opacity-100"
          >
            <motion.div
              initial={{ opacity: 1 }}
              animate={isInView ? { opacity: 0.82 } : {}}
              transition={{ duration: 0.5, delay: TIMINGS.focusShift, ease: MOTION.ease.enter }}
              style={!shouldReduceMotion ? { transform: 'translate(calc(var(--px) * 4px), calc(var(--py) * 3px))' } : {}}
            >
              <a href={TELEGRAM_WELCOMING_URL} target="_blank" rel="noopener noreferrer" className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-2xl group pointer-events-auto">
                <motion.div 
                  whileHover={{ y: -4 }}
                  className="bg-[#181818] border border-white/10 rounded-2xl p-5 w-[180px] sm:w-[220px] shadow-[0_24px_48px_rgba(0,0,0,0.4)] hover:border-white/20 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <motion.div 
                      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.85 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.22, delay: TIMINGS.rightIcon, ease: MOTION.ease.enter }}
                      className="w-8 h-8 rounded-full bg-[#2AABEE]/10 flex items-center justify-center transition-transform duration-200 group-hover:scale-[1.06]"
                    >
                      <MessageCircle className="w-4 h-4 text-[#2AABEE]" />
                    </motion.div>
                    <motion.span 
                      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 4 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.2, delay: TIMINGS.rightTitle }}
                      className="text-sm font-semibold text-white"
                    >
                      Telegram
                    </motion.span>
                  </div>
                  <p className="text-[13px] text-neutral-400 mb-0 leading-relaxed font-medium hidden sm:block">
                    <motion.span 
                      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 4 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.2, delay: TIMINGS.rightCopy }}
                      className="block"
                    >
                      Community access
                    </motion.span>
                    <motion.span 
                      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 4 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.2, delay: TIMINGS.rightStatus }}
                      className="inline-flex items-center gap-1 group-hover:text-white transition-colors duration-200 mt-1"
                    >
                      Connected 
                      <span className="transition-transform duration-200 group-hover:translate-x-[3px]">&rarr;</span>
                    </motion.span>
                  </p>
                </motion.div>
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Foreground Product Stage (Center cropped) */}
        <motion.div 
          initial={shouldReduceMotion ? { opacity: 0.3, x: "-50%" } : { opacity: 0, y: 110, scale: 0.94, x: "-50%" }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1, x: "-50%" } : {}}
          transition={{ duration: 0.85, delay: TIMINGS.centerProduct, ease: MOTION.ease.product }}
          className="absolute bottom-[-100px] sm:bottom-[-80px] left-1/2 w-[120%] max-w-[480px] h-[160px] opacity-30 lg:opacity-100 hidden sm:block pointer-events-none"
        >
          <motion.div 
             initial={{ opacity: 1 }}
             animate={isInView ? { opacity: 0.82 } : {}}
             transition={{ duration: 0.5, delay: TIMINGS.focusShift, ease: MOTION.ease.enter }}
             style={!shouldReduceMotion ? { transform: 'translate(calc(var(--px) * -6px), calc(var(--py) * -4px))' } : {}}
          >
             <div className="bg-[#121212] border border-white/[0.08] rounded-t-3xl shadow-[0_32px_64px_rgba(0,0,0,0.5)] p-6 w-full h-[160px]">
               <motion.div 
                 initial={shouldReduceMotion ? { opacity: 0.5 } : { opacity: 0 }}
                 animate={isInView ? { opacity: 0.5 } : {}}
                 transition={{ duration: 0.2, delay: TIMINGS.centerChrome }}
                 className="flex items-center gap-2 mb-6"
               >
                 <div className="w-2.5 h-2.5 rounded-full bg-neutral-600" />
                 <div className="w-2.5 h-2.5 rounded-full bg-neutral-600" />
                 <div className="w-2.5 h-2.5 rounded-full bg-neutral-600" />
               </motion.div>
               <div className="flex gap-4 opacity-50">
                 <motion.div 
                   initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
                   animate={isInView ? { opacity: 1, y: 0 } : {}}
                   transition={{ duration: 0.3, delay: TIMINGS.centerPanels }}
                   className="w-1/3 h-10 bg-white/5 rounded-lg border border-white/5" 
                 />
                 <motion.div 
                   initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
                   animate={isInView ? { opacity: 1, y: 0 } : {}}
                   transition={{ duration: 0.3, delay: TIMINGS.centerPanels + 0.05 }}
                   className="w-2/3 h-10 bg-white/5 rounded-lg border border-white/5 relative overflow-hidden"
                 >
                    <div className="absolute left-0 bottom-0 w-full h-[1px] bg-white/10" />
                    <motion.div 
                      initial={shouldReduceMotion ? { scaleX: 1 } : { scaleX: 0 }}
                      animate={isInView ? { scaleX: 1 } : {}}
                      transition={{ duration: 0.6, delay: TIMINGS.centerPanels + 0.2, ease: "easeOut" }}
                      className="absolute left-4 bottom-0 w-[40px] h-[2px] bg-neutral-300 origin-left" 
                    />
                 </motion.div>
               </div>
             </div>
          </motion.div>
        </motion.div>


        {/* --- Main CTA Content --- */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-[720px] px-6 mb-12 lg:mb-24 pointer-events-auto">
          
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10, scale: 0.97 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: TIMINGS.eyebrow, ease: MOTION.ease.enter }}
            className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm shadow-sm"
          >
            <span className="text-[10px] font-semibold tracking-widest text-neutral-300 uppercase">
              Private Trading Community
            </span>
          </motion.div>

          <h2 className="text-[clamp(44px,6vw,84px)] font-semibold text-white leading-[0.98] tracking-[-0.04em] mb-6 flex flex-col items-center">
            <div className="overflow-hidden overflow-y-clip pb-1">
              <motion.div
                initial={shouldReduceMotion ? { opacity: 1, y: "0%" } : { opacity: 0.2, y: "105%" }}
                animate={isInView ? { opacity: 1, y: "0%" } : {}}
                transition={{ duration: MOTION.duration.headline, delay: TIMINGS.headlineL1, ease: MOTION.ease.enter }}
              >
                Take the next step
              </motion.div>
            </div>
            <div className="overflow-hidden overflow-y-clip pb-1">
              <motion.div
                initial={shouldReduceMotion ? { opacity: 1, y: "0%" } : { opacity: 0.2, y: "105%" }}
                animate={isInView ? { opacity: 1, y: "0%" } : {}}
                transition={{ duration: MOTION.duration.headline, delay: TIMINGS.headlineL2, ease: MOTION.ease.enter }}
                className="flex gap-3 items-center justify-center"
              >
                <span>inside the</span>
                <motion.em
                  initial={shouldReduceMotion ? { opacity: 1, y: "0%", filter: "blur(0px)" } : { opacity: 0, y: "110%", filter: "blur(2px)" }}
                  animate={isInView ? { opacity: 1, y: "0%", filter: "blur(0px)" } : {}}
                  transition={{ duration: 0.6, delay: TIMINGS.headlineAccent, ease: MOTION.ease.enter }}
                  className="font-serif italic font-medium text-white/95 leading-none"
                >
                  community.
                </motion.em>
              </motion.div>
            </div>
          </h2>

          <motion.p
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: TIMINGS.supportingCopy, ease: MOTION.ease.enter }}
            className="text-[16px] lg:text-[17px] text-neutral-400 leading-relaxed max-w-[500px] mb-10"
          >
            Join Hans on Telegram for trading insights, signals, education and access to the community.
          </motion.p>

          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10, scale: 0.97 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: TIMINGS.ctaActivation, ease: MOTION.ease.enter }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button 
              variant="conversion-primary" 
              iconName="arrow-right"
              size="lg"
              href={TELEGRAM_WELCOMING_URL} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Join Telegram
            </Button>
            <Button 
              variant="feature-action" 
              iconName="arrow-right"
              size="lg"
              href="#apply"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              Apply for Access
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
