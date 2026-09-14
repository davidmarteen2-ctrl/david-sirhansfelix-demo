import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Settings, Maximize2, Activity, List, BarChart2, Crosshair } from "lucide-react";

interface TradingApplicationCanvasProps {
  activeState: number; // 0 = Context, 1 = Setup, 2 = Execution
}

// Deterministic candle data
const demoCandles = [
  { open: 30, high: 35, low: 25, close: 32, up: true },
  { open: 32, high: 45, low: 30, close: 40, up: true },
  { open: 40, high: 42, low: 35, close: 36, up: false },
  { open: 36, high: 50, low: 35, close: 48, up: true },
  { open: 48, high: 55, low: 45, close: 52, up: true },
  { open: 52, high: 60, low: 48, close: 49, up: false },
  { open: 49, high: 52, low: 40, close: 42, up: false },
  { open: 42, high: 48, low: 38, close: 46, up: true },
  { open: 46, high: 65, low: 45, close: 62, up: true },
  { open: 62, high: 68, low: 58, close: 60, up: false },
  { open: 60, high: 75, low: 55, close: 72, up: true },
  { open: 72, high: 82, low: 70, close: 80, up: true },
  { open: 80, high: 85, low: 75, close: 78, up: false },
  { open: 78, high: 88, low: 75, close: 85, up: true },
  { open: 85, high: 95, low: 80, close: 92, up: true }, // High point
  { open: 92, high: 96, low: 85, close: 88, up: false },
  { open: 88, high: 92, low: 75, close: 78, up: false },
  { open: 78, high: 82, low: 65, close: 68, up: false },
  { open: 68, high: 72, low: 60, close: 62, up: false },
  { open: 62, high: 68, low: 58, close: 65, up: true },
  { open: 65, high: 70, low: 55, close: 58, up: false },
  { open: 58, high: 62, low: 45, close: 48, up: false },
  { open: 48, high: 55, low: 42, close: 52, up: true },
  { open: 52, high: 58, low: 48, close: 50, up: false },
  { open: 50, high: 55, low: 40, close: 42, up: false },
  { open: 42, high: 48, low: 35, close: 38, up: false }, // Low point
  { open: 38, high: 45, low: 35, close: 42, up: true },
  { open: 42, high: 50, low: 40, close: 48, up: true },
  { open: 48, high: 52, low: 45, close: 46, up: false },
  { open: 46, high: 58, low: 45, close: 55, up: true },
];

export function TradingApplicationCanvas({ activeState }: TradingApplicationCanvasProps) {
  const prefersReducedMotion = useReducedMotion();
  const transitionDuration = prefersReducedMotion ? 0 : 0.4;
  const panelTransition = prefersReducedMotion ? { duration: 0 } : { duration: 0.3 };
  const xOffset = prefersReducedMotion ? 0 : 10;
  return (
    <div className="w-full h-full flex flex-col bg-[#050505] text-white font-sans overflow-hidden">
      {/* Top Bar */}
      <div className="h-10 lg:h-12 border-b border-white/5 flex items-center justify-between px-3 lg:px-4 bg-[#0A0A0B] shrink-0">
         <div className="flex items-center gap-3 lg:gap-4">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <span className="font-semibold text-xs lg:text-sm tracking-wide">EUR/USD</span>
               <span className="text-[10px] lg:text-xs text-neutral-500 bg-white/5 px-2 py-0.5 rounded ml-2 border border-white/5">DEMO CHART</span>
            </div>
            <div className="hidden sm:flex h-4 w-px bg-white/10 mx-2" />
            <div className="hidden sm:flex items-center gap-1 text-[10px] lg:text-xs text-neutral-400">
               <button className="px-2 py-1 hover:bg-white/10 rounded transition-colors">15M</button>
               <button className="px-2 py-1 hover:bg-white/10 rounded transition-colors text-white font-medium">1H</button>
               <button className="px-2 py-1 hover:bg-white/10 rounded transition-colors">4H</button>
               <button className="px-2 py-1 hover:bg-white/10 rounded transition-colors">1D</button>
            </div>
         </div>
         <div className="flex items-center gap-2 lg:gap-3 text-neutral-400">
            <button className="p-1.5 hover:bg-white/10 rounded transition-colors"><Activity className="w-3.5 h-3.5 lg:w-4 lg:h-4" /></button>
            <button className="p-1.5 hover:bg-white/10 rounded transition-colors"><Settings className="w-3.5 h-3.5 lg:w-4 lg:h-4" /></button>
            <button className="p-1.5 hover:bg-white/10 rounded transition-colors"><Maximize2 className="w-3.5 h-3.5 lg:w-4 lg:h-4" /></button>
         </div>
      </div>

      <div className="flex-1 flex min-h-0">
        {/* Main Chart Area */}
        <div className="flex-1 relative bg-[#050505]">
           <div className="absolute inset-0 p-4 lg:p-8 flex items-center justify-center">
              <svg width="100%" height="100%" viewBox="0 0 200 100" preserveAspectRatio="none" className="overflow-visible">
                 <defs>
                   <linearGradient id="grid-fade" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
                     <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                   </linearGradient>
                 </defs>
                 
                 {/* Chart Grid */}
                 <g className="grid-lines" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5">
                   <line x1="0" y1="20" x2="200" y2="20" />
                   <line x1="0" y1="40" x2="200" y2="40" />
                   <line x1="0" y1="60" x2="200" y2="60" />
                   <line x1="0" y1="80" x2="200" y2="80" />
                   
                   <line x1="40" y1="0" x2="40" y2="100" />
                   <line x1="80" y1="0" x2="80" y2="100" />
                   <line x1="120" y1="0" x2="120" y2="100" />
                   <line x1="160" y1="0" x2="160" y2="100" />
                 </g>

                 {/* Deterministic Candles */}
                 <g className="candles">
                    {demoCandles.map((candle, i) => {
                      const spacing = 200 / demoCandles.length;
                      const x = (i * spacing) + (spacing / 2);
                      const isUp = candle.up;
                      
                      // Invert Y values because SVG origin is top-left, and chart origin is bottom-left
                      const y1 = 100 - candle.high;
                      const y2 = 100 - candle.low;
                      const rectY = 100 - Math.max(candle.open, candle.close);
                      const rectH = Math.max(1, Math.abs(candle.close - candle.open));
                      
                      const color = isUp ? "var(--color-trading-positive, #34d399)" : "var(--color-trading-negative, #f87171)";
                      
                      return (
                        <g key={i}>
                          <line x1={x} y1={y1} x2={x} y2={y2} stroke={color} strokeWidth="0.5" />
                          <rect x={x - (spacing * 0.3)} y={rectY} width={spacing * 0.6} height={rectH} fill={color} rx="0.5" />
                        </g>
                      );
                    })}
                 </g>

                 {/* State 0: Context */}
                 <AnimatePresence>
                   {activeState === 0 && (
                     <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: transitionDuration }}>
                       {/* Liquidity Zone */}
                       <rect x="0" y="5" width="200" height="15" fill="rgba(248, 113, 113, 0.05)" />
                       <line x1="0" y1="20" x2="200" y2="20" stroke="rgba(248, 113, 113, 0.3)" strokeWidth="0.5" strokeDasharray="2,2" />
                       <text x="195" y="15" fill="rgba(248, 113, 113, 0.6)" fontSize="3" textAnchor="end" className="font-mono">Resistance Zone</text>
                       
                       {/* Structure Low */}
                       <rect x="0" y="65" width="200" height="15" fill="rgba(52, 211, 153, 0.05)" />
                       <line x1="0" y1="65" x2="200" y2="65" stroke="rgba(52, 211, 153, 0.3)" strokeWidth="0.5" strokeDasharray="2,2" />
                       <text x="195" y="75" fill="rgba(52, 211, 153, 0.6)" fontSize="3" textAnchor="end" className="font-mono">Support Zone</text>
                     </motion.g>
                   )}
                 </AnimatePresence>
                 
                 {/* State 1: Setup */}
                 <AnimatePresence>
                   {activeState === 1 && (
                     <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: transitionDuration }}>
                       {/* Entry Area */}
                       <rect x="150" y="40" width="50" height="10" fill="rgba(59, 130, 246, 0.1)" />
                       <line x1="150" y1="45" x2="200" y2="45" stroke="rgba(59, 130, 246, 0.5)" strokeWidth="0.5" />
                       <text x="195" y="43.5" fill="rgba(59, 130, 246, 0.8)" fontSize="2.5" textAnchor="end" className="font-mono">Entry Area</text>
                       
                       {/* Invalidation Area */}
                       <rect x="150" y="20" width="50" height="20" fill="rgba(248, 113, 113, 0.05)" />
                       <line x1="150" y1="20" x2="200" y2="20" stroke="rgba(248, 113, 113, 0.5)" strokeWidth="0.5" strokeDasharray="1,1" />
                       <text x="195" y="18.5" fill="rgba(248, 113, 113, 0.8)" fontSize="2.5" textAnchor="end" className="font-mono">Invalidation</text>
                       
                       {/* Target Area */}
                       <rect x="150" y="50" width="50" height="25" fill="rgba(52, 211, 153, 0.05)" />
                       <line x1="150" y1="75" x2="200" y2="75" stroke="rgba(52, 211, 153, 0.5)" strokeWidth="0.5" strokeDasharray="1,1" />
                       <text x="195" y="73.5" fill="rgba(52, 211, 153, 0.8)" fontSize="2.5" textAnchor="end" className="font-mono">Target Area</text>
                     </motion.g>
                   )}
                 </AnimatePresence>
                 
                 {/* State 2: Execution */}
                 <AnimatePresence>
                   {activeState === 2 && (
                     <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: transitionDuration }}>
                       {/* Trade Plan Mapped */}
                       <rect x="160" y="25" width="25" height="20" fill="rgba(248, 113, 113, 0.15)" />
                       <rect x="160" y="45" width="25" height="30" fill="rgba(52, 211, 153, 0.15)" />
                       
                       <line x1="155" y1="45" x2="190" y2="45" stroke="rgba(255,255,255,0.8)" strokeWidth="0.5" />
                       
                       <text x="172.5" y="36" fill="rgba(248, 113, 113, 0.9)" fontSize="2.5" textAnchor="middle" className="font-mono">RISK</text>
                       <text x="172.5" y="62" fill="rgba(52, 211, 153, 0.9)" fontSize="2.5" textAnchor="middle" className="font-mono">REWARD</text>
                     </motion.g>
                   )}
                 </AnimatePresence>
              </svg>
           </div>
        </div>

        {/* Right Panel */}
        <div className="hidden md:flex w-[260px] lg:w-[280px] bg-[#0A0A0B] border-l border-white/5 flex-col p-4 lg:p-5">
           <div className="flex items-center justify-between mb-6">
             <span className="text-[10px] lg:text-xs font-semibold text-neutral-400 uppercase tracking-widest">
               {activeState === 0 ? 'Context' : activeState === 1 ? 'Setup' : 'Trade Plan'}
             </span>
             <List className="w-3 h-3 lg:w-4 lg:h-4 text-neutral-600" />
           </div>
           
           <div className="flex-1 relative">
             <AnimatePresence mode="wait">
               {activeState === 0 && (
                 <motion.div key="state0" initial={{ opacity: 0, x: xOffset }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -xOffset }} transition={panelTransition} className="flex flex-col gap-4">
                   <div className="bg-white/5 rounded-lg p-3 lg:p-4 border border-white/5">
                      <div className="flex items-center gap-2 mb-2 lg:mb-3">
                        <BarChart2 className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-blue-400" />
                        <span className="text-xs lg:text-sm font-medium">Market Context</span>
                      </div>
                      <div className="text-[11px] lg:text-xs text-neutral-400 leading-relaxed">
                        Demo market context mapped on higher timeframes. Identifying major resistance and support blocks.
                      </div>
                   </div>
                   <div className="bg-white/5 rounded-lg p-3 lg:p-4 border border-white/5">
                      <span className="text-[10px] lg:text-xs text-neutral-500 mb-1.5 lg:mb-2 block">Key Areas</span>
                      <div className="flex justify-between items-center text-xs lg:text-sm py-1">
                        <span className="text-neutral-400">Resistance</span>
                        <span className="font-mono text-neutral-300">Mapped</span>
                      </div>
                      <div className="flex justify-between items-center text-xs lg:text-sm py-1 border-t border-white/5 mt-1 pt-2">
                        <span className="text-neutral-400">Support</span>
                        <span className="font-mono text-neutral-300">Mapped</span>
                      </div>
                   </div>
                 </motion.div>
               )}
               
               {activeState === 1 && (
                 <motion.div key="state1" initial={{ opacity: 0, x: xOffset }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -xOffset }} transition={panelTransition} className="flex flex-col gap-4">
                   <div className="flex gap-2">
                     <button className="flex-1 py-1.5 lg:py-2 rounded bg-white/5 text-neutral-400 text-[11px] lg:text-xs font-medium border border-transparent">Buy</button>
                     <button className="flex-1 py-1.5 lg:py-2 rounded bg-red-500/10 text-red-400 text-[11px] lg:text-xs font-medium border border-red-500/20">Sell</button>
                   </div>
                   
                   <div className="flex flex-col gap-3 lg:gap-4 mt-2">
                     <div className="flex flex-col gap-1.5">
                       <label className="text-[9px] lg:text-[10px] text-neutral-500 uppercase tracking-wide">Entry Area</label>
                       <div className="bg-[#121214] border border-white/10 rounded px-3 py-2 text-xs lg:text-sm font-mono flex justify-between">
                         <span className="text-blue-400">Mapped</span>
                       </div>
                     </div>
                     <div className="flex flex-col gap-1.5">
                       <label className="text-[9px] lg:text-[10px] text-neutral-500 uppercase tracking-wide">Invalidation</label>
                       <div className="bg-[#121214] border border-white/10 rounded px-3 py-2 text-xs lg:text-sm font-mono text-red-400">
                         Defined
                       </div>
                     </div>
                     <div className="flex flex-col gap-1.5">
                       <label className="text-[9px] lg:text-[10px] text-neutral-500 uppercase tracking-wide">Target Area</label>
                       <div className="bg-[#121214] border border-white/10 rounded px-3 py-2 text-xs lg:text-sm font-mono text-emerald-400">
                         Defined
                       </div>
                     </div>
                   </div>
                   
                   <button className="w-full mt-2 lg:mt-4 bg-white text-black py-2 lg:py-2.5 rounded text-[11px] lg:text-sm font-semibold hover:bg-neutral-200 transition-colors">
                     Review Setup
                   </button>
                 </motion.div>
               )}
               
               {activeState === 2 && (
                 <motion.div key="state2" initial={{ opacity: 0, x: xOffset }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -xOffset }} transition={panelTransition} className="flex flex-col gap-4">
                   <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 lg:p-5 flex flex-col items-center justify-center text-center gap-2">
                     <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-1 lg:mb-2">
                       <Crosshair className="w-4 h-4 lg:w-5 lg:h-5" />
                     </div>
                     <span className="text-emerald-400 font-semibold text-xs lg:text-sm">Plan Ready</span>
                     <span className="text-[10px] lg:text-xs text-neutral-400">Illustrative trade plan mapped</span>
                   </div>
                   
                   <div className="mt-4 flex flex-col gap-3">
                     <div className="flex justify-between items-center text-xs lg:text-sm">
                       <span className="text-neutral-500">Direction</span>
                       <span className="font-mono text-white">SELL</span>
                     </div>
                     <div className="flex justify-between items-center text-xs lg:text-sm border-t border-white/5 pt-2 lg:pt-3">
                       <span className="text-neutral-500">Risk Defined</span>
                       <span className="font-mono text-red-400">Yes</span>
                     </div>
                     <div className="flex justify-between items-center text-xs lg:text-sm border-t border-white/5 pt-2 lg:pt-3">
                       <span className="text-neutral-500">Target Defined</span>
                       <span className="font-mono text-emerald-400">Yes</span>
                     </div>
                   </div>
                 </motion.div>
               )}
             </AnimatePresence>
           </div>
        </div>
      </div>
    </div>
  );
}
