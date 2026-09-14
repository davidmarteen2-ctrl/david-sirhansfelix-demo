import * as React from "react";
import { MoreHorizontal } from "lucide-react";
import { motion } from "motion/react";

export function TelegramProductFrame() {
  return (
    <div className="w-full max-w-[320px] bg-[#E4E4E5] border border-neutral-300 rounded-[32px] p-2 shadow-2xl mx-auto relative overflow-hidden">
       {/* Screen */}
       <div className="bg-[#F4F4F5] w-full h-[520px] rounded-[24px] overflow-hidden flex flex-col relative border border-white">
          {/* Header */}
          <div className="h-16 bg-white border-b border-neutral-200 flex items-center px-4 flex-shrink-0 z-10 shadow-sm">
             <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center text-white font-serif italic text-lg mr-3">H</div>
             <div className="flex flex-col">
               <span className="font-semibold text-sm">SirHansFelix Channel</span>
               <span className="text-[10px] text-neutral-500">Subscribers hidden</span>
             </div>
          </div>
          
          {/* Chat Body */}
          <div className="flex-1 p-4 flex flex-col justify-end gap-3 pb-6 relative z-0" style={{
            backgroundImage: `radial-gradient(#d4d4d8 1px, transparent 1px)`,
            backgroundSize: '16px 16px'
          }}>
             <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="self-start max-w-[85%] bg-white border border-neutral-200 rounded-2xl rounded-tl-sm p-3 shadow-sm">
                <div className="text-xs font-semibold text-neutral-900 mb-1">SirHansFelix</div>
                <p className="text-sm text-neutral-700 leading-snug">EUR/USD liquidity swept at 1.1020. Waiting for 15m structure shift before we look for entries.</p>
                <div className="text-[9px] text-neutral-400 text-right mt-1">10:42 AM</div>
             </motion.div>
             
             <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="self-start max-w-[85%] bg-white border border-neutral-200 rounded-2xl rounded-tl-sm p-3 shadow-sm">
                <div className="text-xs font-semibold text-neutral-900 mb-1">SirHansFelix</div>
                <div className="w-full h-24 bg-neutral-100 rounded-lg mb-2 border border-neutral-200 flex items-center justify-center overflow-hidden">
                   <svg viewBox="0 0 100 40" className="w-full h-full text-blue-500/20" preserveAspectRatio="none">
                      <path d="M0,30 L20,35 L40,15 L60,25 L80,5 L100,10" fill="none" stroke="currentColor" strokeWidth="2" />
                      <path d="M0,30 L20,35 L40,15 L60,25 L80,5 L100,10 L100,40 L0,40 Z" fill="currentColor" opacity="0.3" />
                   </svg>
                </div>
                <p className="text-sm text-neutral-700 leading-snug">Setup is valid. Entry 1.0950.</p>
                <div className="text-[9px] text-neutral-400 text-right mt-1">11:15 AM</div>
             </motion.div>
          </div>
          
          {/* Footer Input */}
          <div className="h-14 bg-white border-t border-neutral-200 flex items-center px-4 flex-shrink-0 z-10 gap-3">
             <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
               <MoreHorizontal className="w-4 h-4" />
             </div>
             <div className="flex-1 h-8 rounded-full bg-neutral-100 px-3 flex items-center text-xs text-neutral-400">Mute</div>
          </div>
       </div>
    </div>
  );
}
