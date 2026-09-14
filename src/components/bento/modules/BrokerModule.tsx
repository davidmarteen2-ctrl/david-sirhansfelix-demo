import * as React from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { BentoCell } from "../primitives/BentoCell";
import { motion } from "motion/react";

export function BrokerModule() {
  return (
    <BentoCell
      className="col-span-2 md:col-span-3 lg:col-span-5 flex flex-col p-5 md:p-6 min-h-[300px]"
      delay={0.42}
      direction="bottom"
    >
      <div className="flex justify-between items-start mb-auto">
        <div>
          <h3 className="text-xs font-semibold tracking-widest text-neutral-500 uppercase mb-1">Broker Setup</h3>
          <span className="text-xl font-medium text-neutral-900">MT5</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50/50 px-2.5 py-1 rounded-full border border-emerald-100">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Connected</span>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Account</span>
          <div className="flex items-baseline gap-1">
            <span className="text-neutral-500 font-medium">$</span>
            <span className="text-3xl font-semibold text-neutral-900 tracking-tight tabular-nums">200,000</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-medium text-neutral-500">Connection</span>
            <span className="font-semibold text-neutral-900">94%</span>
          </div>
          <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-neutral-900 rounded-full"
              initial={{ width: "0%" }}
              whileInView={{ width: "94%" }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-6 pt-6 border-t border-neutral-100">
        <span className="text-xs font-medium text-neutral-600">Manage setup</span>
        <button className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-50 border border-neutral-200 group-hover:border-neutral-300 transition-colors">
          <ArrowRight className="w-4 h-4 text-neutral-500 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-neutral-900" />
        </button>
      </div>
    </BentoCell>
  );
}
