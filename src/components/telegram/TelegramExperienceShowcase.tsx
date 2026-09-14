import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { TelegramProductFrame } from "./TelegramProductFrame";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TELEGRAM_WELCOMING_URL } from "@/lib/config";
import { ArrowRight } from "lucide-react";

export function TelegramExperienceShowcase() {
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <section id="telegram" className="relative w-full py-24 lg:py-32 bg-surface border-t border-border overflow-hidden">
      <div className="mx-4 lg:mx-8 xl:mx-auto max-w-[1280px] grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
         
         <motion.div 
           initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -20 }}
           whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
           className="flex flex-col justify-center order-2 lg:order-1"
         >
            <Badge variant="outline" className="self-start text-secondary font-semibold uppercase tracking-wider text-[11px] px-3 py-1 mb-6">
              Telegram Experience
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-semibold text-primary tracking-tight mb-6 leading-[1.1]">
              The trading experience continues in Telegram.
            </h2>
            <p className="text-lg text-secondary leading-relaxed max-w-md mb-8">
              Connect with Hans's existing Telegram experience for signals, community and the next step in your trading journey.
            </p>
            <div className="flex">
              <Button href={TELEGRAM_WELCOMING_URL} target="_blank" rel="noopener noreferrer" variant="platform-handoff" iconName="telegram" iconPosition="left" size="lg" className="w-full sm:w-auto">
                Join Telegram
              </Button>
            </div>
         </motion.div>
         
         <motion.div
           initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
           whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
           className="order-1 lg:order-2 flex justify-center lg:justify-end"
         >
            <TelegramProductFrame />
         </motion.div>
         
      </div>
    </section>
  );
}
