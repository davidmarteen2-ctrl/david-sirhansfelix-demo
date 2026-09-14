import * as React from "react";
import { TopNavigationBar } from "@/components/navigation/TopNavigationBar";
import { SplitHero } from "@/components/hero/SplitHero";
import { PartnerLogoMarquee } from "@/components/marquee/PartnerLogoMarquee";
import { OffersSection } from "@/components/offers/OffersSection";
import { TradingShowcaseSection } from "@/components/trading-showcase/TradingShowcaseSection";
import { TelegramExperienceShowcase } from "@/components/telegram/TelegramExperienceShowcase";
import { TraderEditorialProfile } from "@/components/about/TraderEditorialProfile";
import { ImmersiveCTAStage } from "@/components/cta/ImmersiveCTAStage";
import { LeadApplication } from "@/components/lead-capture/LeadApplication";
import { WordmarkFooter } from "@/components/footer/WordmarkFooter";
import { MotionConfig } from "motion/react";

export function MarketingShell() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen bg-canvas overflow-hidden">
        <TopNavigationBar />
        
        <main>
          <SplitHero />
          <PartnerLogoMarquee />
          <OffersSection />
          <TradingShowcaseSection />
          <TelegramExperienceShowcase />
          <TraderEditorialProfile />
          <ImmersiveCTAStage />

          {/* ── Lead Capture ── n8n automation entry point ── */}
          <LeadApplication />
        </main>
        
        <WordmarkFooter />
      </div>
    </MotionConfig>
  );
}

