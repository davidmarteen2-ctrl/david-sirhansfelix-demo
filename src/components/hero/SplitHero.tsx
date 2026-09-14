import * as React from "react";
import { HeroContentPanel } from "./HeroContentPanel";
import { TraderMediaStage } from "./TraderMediaStage";

export function SplitHero() {
  return (
    <section className="relative w-full pt-32 lg:pt-36 pb-12 lg:pb-20">
      <div className="mx-4 lg:mx-8 xl:mx-auto max-w-[1280px]">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-4 lg:justify-between items-stretch">
          {/* Left: Content Panel (approx 48%) */}
          <div className="w-full lg:w-[48%] flex items-center">
            <HeroContentPanel />
          </div>

          {/* Right: Media Stage (approx 52%) */}
          <div className="w-full lg:w-[50%] flex items-center mt-8 lg:mt-0">
            <TraderMediaStage />
          </div>
        </div>
      </div>
    </section>
  );
}
