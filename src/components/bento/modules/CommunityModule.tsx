import * as React from "react";
import { ArrowRight, MessageSquare } from "lucide-react";
import { BentoCell } from "../primitives/BentoCell";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const ACTIVITY = [
  { id: 1, user: "David", action: "posted", context: "New York session", time: "2m ago", active: true },
  { id: 2, user: "System", action: "24 members", context: "active now", time: "Live", active: false },
  { id: 3, user: "Sarah", action: "started", context: "New discussion", time: "15m ago", active: false },
];

export function CommunityModule() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <BentoCell
      className="col-span-2 md:col-span-3 lg:col-span-4 flex flex-col p-5 md:p-6 min-h-[300px]"
      delay={0.32}
      direction="bottom"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xs font-semibold tracking-widest text-neutral-500 uppercase mb-1">Community</h3>
          <div className="flex items-center gap-2">
            <span className="text-xl font-medium text-neutral-900">127</span>
            <span className="text-xs font-medium text-neutral-500">members</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center space-y-3">
        {ACTIVITY.map((item, i) => (
          <motion.div
            key={item.id}
            initial={shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
            whileInView={{ opacity: item.active ? 1 : 0.5, x: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.26, delay: 0.32 + i * 0.06, ease: "easeOut" }}
            className={cn(
              "flex items-center gap-3 p-2 rounded-lg transition-all duration-200",
              item.active ? "bg-neutral-50 border border-neutral-100" : "hover:bg-neutral-50/50 hover:opacity-100"
            )}
          >
            <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center shrink-0">
              <MessageSquare className="w-3.5 h-3.5 text-neutral-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-neutral-900 truncate">
                {item.user} <span className="text-neutral-500 font-normal">{item.action}</span>
              </p>
              <p className="text-[10px] text-neutral-500 truncate">{item.context}</p>
            </div>
            <div className="text-[10px] font-medium text-neutral-400 shrink-0">
              {item.time}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-neutral-100">
        <span className="text-xs font-medium text-neutral-600">Open community</span>
        <button className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-50 border border-neutral-200 group-hover:border-neutral-300 transition-colors">
          <ArrowRight className="w-4 h-4 text-neutral-500 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-neutral-900" />
        </button>
      </div>
    </BentoCell>
  );
}
