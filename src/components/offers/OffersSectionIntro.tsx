import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Badge } from "@/components/ui/Badge";

export function OffersSectionIntro() {
  const shouldReduceMotion = useReducedMotion();
  
  const v = {
    hidden: { opacity: 0, y: 14 },
    visible: (customDelay: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1], delay: customDelay }
    })
  };

  return (
    <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16 lg:mb-20">
      <motion.div
        initial={shouldReduceMotion ? "visible" : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        custom={0}
        variants={v}
      >
        <Badge variant="outline" className="text-secondary font-semibold uppercase tracking-wider text-[11px] px-3 py-1 mb-6">
          What Hans Offers
        </Badge>
      </motion.div>
      <h2 className="text-3xl lg:text-4xl xl:text-[42px] font-semibold text-primary tracking-tight mb-6 leading-[1.1]">
        <motion.span
          initial={shouldReduceMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          custom={0.07}
          variants={v}
          className="block"
        >
          More than charts.
        </motion.span>
        <motion.span
          initial={shouldReduceMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          custom={0.14}
          variants={v}
          className="block text-muted"
        >
          A complete trading ecosystem.
        </motion.span>
      </h2>
      <motion.p
        initial={shouldReduceMotion ? "visible" : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        custom={0.22}
        variants={v}
        className="text-lg text-secondary leading-relaxed max-w-lg"
      >
        Explore signals, community access, broker guidance and trading education through the SirHansFelix experience.
      </motion.p>
    </div>
  );
}

