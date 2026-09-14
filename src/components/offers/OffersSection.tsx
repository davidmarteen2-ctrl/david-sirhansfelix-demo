import * as React from "react";
import { OffersSectionIntro } from "./OffersSectionIntro";
import { BentoSystem } from "../bento/BentoSystem";
import { MotionConfig } from "motion/react";

export function OffersSection() {
  return (
    <section id="offers" className="relative w-full py-20 lg:py-24 bg-canvas scroll-mt-24 overflow-hidden">
      <div className="mx-auto max-w-[1160px] px-6 md:px-8">
        <MotionConfig transition={{ ease: [0.22, 1, 0.36, 1] }}>
          <OffersSectionIntro />
          <div className="mt-12 lg:mt-16">
            <BentoSystem />
          </div>
        </MotionConfig>
      </div>
    </section>
  );
}
