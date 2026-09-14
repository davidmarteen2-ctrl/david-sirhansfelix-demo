import * as React from "react";
import { BentoShell } from "./primitives/BentoShell";
import { BentoGrid } from "./primitives/BentoGrid";
import { SignalsModule } from "./modules/SignalsModule";
import { BrokerModule } from "./modules/BrokerModule";
import { CommunityModule } from "./modules/CommunityModule";
import { LearningModule } from "./modules/LearningModule";
import { PerformanceModule } from "./modules/PerformanceModule";

export function BentoSystem() {
  return (
    <BentoShell>
      <BentoGrid>
        <SignalsModule />
        <BrokerModule />
        <CommunityModule />
        <LearningModule />
        <PerformanceModule />
      </BentoGrid>
    </BentoShell>
  );
}
