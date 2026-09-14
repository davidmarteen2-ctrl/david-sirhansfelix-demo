import * as React from "react";
import { ArrowRight, TrendingUp } from "lucide-react";
import { BentoCell } from "../primitives/BentoCell";
import { motion, useReducedMotion } from "motion/react";

export function PerformanceModule() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <BentoCell
      className="col-span-2 md:col-span-3 lg:col-span-4 flex flex-col p-5 md:p-6 min-h-[300px]"
      delay={0.62}
      direction="bottom"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xs font-semibold tracking-widest text-neutral-500 uppercase mb-1">Performance</h3>
          <span className="text-xl font-medium text-neutral-900">This Week</span>
        </div>
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-50 text-emerald-600">
          <TrendingUp className="w-4 h-4" />
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-6">
        <div>
          <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Win Rate</div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-semibold text-neutral-900 tracking-tight">68</span>
            <span className="text-lg font-medium text-neutral-500">%</span>
          </div>
        </div>

        <div>
          <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Return</div>
          <div className="flex items-baseline gap-1 text-emerald-600">
            <span className="text-xl font-semibold">+1.2</span>
            <span className="text-sm font-medium">%</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-6 pt-6 border-t border-neutral-100">
        <span className="text-xs font-medium text-neutral-600">View analytics</span>
        <button className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-50 border border-neutral-200 group-hover:border-neutral-300 transition-colors">
          <ArrowRight className="w-4 h-4 text-neutral-500 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-neutral-900" />
        </button>
      </div>
    </BentoCell>
  );
}
