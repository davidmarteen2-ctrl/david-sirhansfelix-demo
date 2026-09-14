import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

interface SectionIntroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}

export function SectionIntro({ eyebrow, title, description, className }: SectionIntroProps) {
  return (
    <div className={cn("flex flex-col max-w-3xl mb-12 lg:mb-16", className)}>
      {eyebrow && (
        <Badge variant="outline" className="w-fit mb-5 text-secondary font-semibold uppercase tracking-wider text-[11px] px-3 py-1">
          {eyebrow}
        </Badge>
      )}
      <h2 className="text-3xl lg:text-5xl font-semibold text-primary tracking-tight mb-4">
        {title}
      </h2>
      {description && (
        <p className="text-lg lg:text-xl text-secondary leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
