import * as React from "react";
import { ArrowRight } from "lucide-react";
import { BentoCell } from "../primitives/BentoCell";
import { motion } from "motion/react";

export function SignalsModule() {
  return (
    <BentoCell
      className="col-span-2 md:col-span-6 lg:col-span-7 flex flex-col p-5 md:p-6 lg:p-7 min-h-[300px]"
      delay={0.14}
      direction="bottom-left"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xs font-semibold tracking-widest text-neutral-500 uppercase mb-1">Signals</h3>
          <div className="flex items-center gap-2">
            <span className="text-xl font-medium text-neutral-900">EUR/USD</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-100">SELL</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-bold tracking-wide uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 relative flex shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          </span>
          Live
        </div>
      </div>

      <div className="flex-1 relative w-full h-[120px] mb-6 flex items-end">
        {/* Simple mock chart */}
        <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
          <motion.path
            d="M0 20 L20 40 L40 10 L60 60 L80 40 L100 80"
            fill="none"
            stroke="#ef4444"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
          />
          {/* subtle gradient under line */}
          <motion.path
            d="M0 20 L20 40 L40 10 L60 60 L80 40 L100 80 L100 100 L0 100 Z"
            fill="url(#redGradient)"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.9, delay: 0.4 }}
          />
          <defs>
            <linearGradient id="redGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#fca5a5" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#fca5a5" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* dashed horizontal line for entry */}
        <div className="absolute top-1/4 left-0 w-full border-t border-dashed border-neutral-300 pointer-events-none" />
      </div>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex gap-4 md:gap-8">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-0.5">Entry</span>
            <span className="text-sm font-medium text-neutral-900 tabular-nums">1.0950</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-0.5">Stop</span>
            <span className="text-sm font-medium text-neutral-900 tabular-nums">1.1020</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-0.5">Target</span>
            <span className="text-sm font-medium text-neutral-900 tabular-nums">1.0820</span>
          </div>
        </div>

        <button className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-50 border border-neutral-200 group-hover:border-neutral-300 transition-colors">
          <ArrowRight className="w-4 h-4 text-neutral-500 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-neutral-900" />
        </button>
      </div>
    </BentoCell>
  );
}
