import * as React from "react";
import { ArrowRight } from "lucide-react";
import { BentoCell } from "../primitives/BentoCell";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const TOPICS = [
  { id: 1, label: "BOS", active: true },
  { id: 2, label: "FVG", active: false },
  { id: 3, label: "LIQUIDITY", active: false },
];

export function LearningModule() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <BentoCell
      className="col-span-2 md:col-span-3 lg:col-span-4 flex flex-col p-5 md:p-6 min-h-[300px]"
      delay={0.52}
      direction="bottom"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <motion.h3 
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.52 }}
            className="text-xs font-semibold tracking-widest text-neutral-500 uppercase mb-1"
          >
            Learn
          </motion.h3>
          <motion.div 
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.56 }}
            className="text-xl font-medium text-neutral-900"
          >
            Market Structure
          </motion.div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center space-y-3">
        {TOPICS.map((topic, i) => (
          <motion.div
            key={topic.id}
            initial={shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
            whileInView={{ opacity: topic.active ? 1 : 0.4, x: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.3, delay: 0.6 + i * 0.05, ease: "easeOut" }}
            className={cn(
              "text-sm font-semibold tracking-wide transition-all duration-200 cursor-default",
              topic.active ? "text-neutral-900" : "text-neutral-400 hover:text-neutral-600 hover:opacity-100 hover:translate-x-1"
            )}
          >
            {topic.label}
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.7 }}
        className="flex items-center justify-between mt-6 pt-6 border-t border-neutral-100"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-md">04</span>
          <span className="text-xs font-medium text-neutral-500">lessons</span>
        </div>
        <button className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-50 border border-neutral-200 group-hover:border-neutral-300 transition-colors">
          <ArrowRight className="w-4 h-4 text-neutral-500 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-neutral-900" />
        </button>
      </motion.div>
    </BentoCell>
  );
}
