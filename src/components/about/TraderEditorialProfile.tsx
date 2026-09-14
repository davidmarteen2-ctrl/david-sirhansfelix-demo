import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import traderImage from "@/assets/images/editorial_trader_portrait_1788105217312.jpg";
import { TELEGRAM_WELCOMING_URL } from "@/lib/config";

import { Button } from "@/components/ui/Button";
const PHILOSOPHY_ITEMS = [
  {
    index: "01",
    label: "MARKET STRUCTURE",
    copy: "Read context before reacting."
  },
  {
    index: "02",
    label: "RISK AWARENESS",
    copy: "Define the idea before the trade."
  },
  {
    index: "03",
    label: "CLEAR EXECUTION",
    copy: "Keep the plan simple enough to follow."
  }
];

function PhilosophyItem({ item, i }: { item: typeof PHILOSOPHY_ITEMS[0], i: number, key?: React.Key }) {
  return (
    <div className="group flex items-start gap-4 py-6 border-b border-neutral-200 last:border-b-0 transition-colors">
      <div className="text-sm font-semibold text-neutral-400 group-hover:text-neutral-500 transition-colors w-6 shrink-0">{item.index}</div>
      <div className="flex-1">
        <h4 className="text-xs font-semibold tracking-widest text-neutral-500 group-hover:text-neutral-900 transition-colors mb-1 uppercase">
          {item.label}
        </h4>
        <p className="text-base text-neutral-700 group-hover:text-neutral-900 transition-colors">
          {item.copy}
        </p>
      </div>
      <div className="mt-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
        <ArrowRight className="w-4 h-4 text-neutral-900" />
      </div>
    </div>
  );
}

export function TraderEditorialProfile() {
  const prefersReducedMotion = useReducedMotion();
  const staggerBase = 0.08;

  return (
    <section id="about" className="relative w-full py-24 lg:py-32 bg-[#FAF9F8]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-[90px]">
          
          {/* Left: Portrait Media Stage (46%) */}
          <div className="w-full lg:w-[46%] max-w-[500px] lg:max-w-none mx-auto lg:mx-0">
            <motion.div 
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 1.025, clipPath: 'inset(10% 0 10% 0)' }}
              whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, clipPath: 'inset(0% 0 0% 0)' }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="relative aspect-[4/5] rounded-[24px] overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] group"
            >
              <img 
                src={traderImage} 
                alt="Trader reviewing market charts at a desk" 
                className="w-full h-full object-cover object-[center_20%] transition-transform duration-700 ease-out group-hover:scale-[1.01]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              
              {/* Floating Identity Badge */}
              <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/20 shadow-sm flex flex-col justify-center">
                <div className="text-[11px] font-bold tracking-[0.15em] text-neutral-900 uppercase leading-none">
                  SirHansFelix
                </div>
                <div className="text-[9px] font-semibold tracking-widest text-neutral-500 uppercase leading-none mt-1.5">
                  Trader • Creator
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Profile Narrative (54%) */}
          <div className="w-full lg:w-[54%] max-w-[600px] mx-auto lg:mx-0 flex flex-col">
            
            <motion.div
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.5, delay: 0, ease: "easeOut" }}
              className="text-[11px] font-semibold tracking-widest text-neutral-500 uppercase mb-4"
            >
              About Hans
            </motion.div>
            
            <motion.h2
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.5, delay: staggerBase, ease: "easeOut" }}
              className="text-4xl lg:text-[52px] xl:text-[56px] font-semibold text-neutral-900 leading-[1.08] mb-6 tracking-tight"
            >
              Trading with structure,<br className="hidden md:block"/> not noise.
            </motion.h2>
            
            <motion.p
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.5, delay: staggerBase * 2, ease: "easeOut" }}
              className="text-lg lg:text-[20px] text-neutral-600 leading-[1.6] mb-10"
            >
              SirHansFelix shares his view of the market through trading content, signals, community and education, with Telegram acting as the main place to continue the experience.
            </motion.p>
            
            <motion.div
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.5, delay: staggerBase * 3, ease: "easeOut" }}
              className="flex flex-col border-t border-neutral-200 mb-10"
            >
              {PHILOSOPHY_ITEMS.map((item, i) => (
                 <PhilosophyItem key={item.index} item={item} i={i} />
              ))}
            </motion.div>
            
            <motion.div
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.5, delay: staggerBase * 4, ease: "easeOut" }}
            >
              <Button 
                variant="editorial-action"
                iconName="arrow-right"
                href={TELEGRAM_WELCOMING_URL} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Join Telegram
              </Button>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
