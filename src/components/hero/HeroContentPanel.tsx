import * as React from "react";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TELEGRAM_WELCOMING_URL } from "@/lib/config";

export function HeroContentPanel() {
  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col justify-center h-full max-w-xl py-12 lg:py-0"
    >
      <motion.div variants={itemVariants} className="mb-6">
        <Badge variant="outline" className="text-secondary font-semibold uppercase tracking-wider text-[11px] px-3 py-1">
          SIRHANSFELIX
        </Badge>
      </motion.div>

      <motion.h1
        variants={itemVariants}
        className="text-[clamp(44px,5vw,76px)] leading-[1.02] tracking-[-0.03em] font-semibold text-primary mb-6"
      >
        Trade with structure. <br />
        <span className="text-neutral-400">Move with confidence.</span>
      </motion.h1>

      <motion.p
        variants={itemVariants}
        className="text-lg text-secondary leading-relaxed mb-10 max-w-lg"
      >
        Market insights, trading signals, community access and trading education, connected through Hans's Telegram experience.
      </motion.p>

      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-14">
        <Button size="lg" variant="hero-primary" iconName="arrow-right" className="w-full sm:w-auto" href={TELEGRAM_WELCOMING_URL} target="_blank" rel="noopener noreferrer">
          Join Telegram
        </Button>
        <Button size="lg" variant="hero-secondary" iconName="arrow-right" className="w-full sm:w-auto" href="#apply">
          Apply for Access
        </Button>
      </motion.div>
    </motion.div>
  );
}
