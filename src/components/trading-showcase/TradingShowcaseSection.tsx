import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TradingApplicationCanvas } from "./TradingApplicationCanvas";

const STORY_STAGES = [
  {
    eyebrow: "Market Context",
    title: "Read the market.",
    desc: "Start with higher timeframe context, structure and the areas that matter."
  },
  {
    eyebrow: "Setup",
    title: "Build the setup.",
    desc: "Define the idea around structure, entry, invalidation and target areas."
  },
  {
    eyebrow: "Execution",
    title: "Execute with structure.",
    desc: "Bring the setup together into a clear trading plan before execution."
  }
];

function TradingStoryCard({ 
  index, 
  stage, 
  isActive, 
  cardRef 
}: { 
  index: number; 
  stage: typeof STORY_STAGES[0]; 
  isActive: boolean;
  cardRef: (el: HTMLDivElement | null) => void; key?: React.Key;
}) {
  const prefersReducedMotion = useReducedMotion();
  const scale = isActive ? 1 : 0.98;
  const opacity = isActive ? 1 : 0.45;

  return (
    <div 
      ref={cardRef}
      data-index={index}
      className="shrink-0 snap-center flex items-center justify-center transition-all duration-500 ease-out py-8"
      style={{ width: 'var(--card-width)' }}
    >
      <motion.div 
        animate={prefersReducedMotion ? {} : { scale, opacity }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full flex flex-col lg:flex-row bg-[#0A0A0B] border border-white/10 rounded-2xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] h-auto lg:h-[500px]"
      >
        {/* Left Copy */}
        <div className="w-full lg:w-[38%] p-8 md:p-10 lg:p-12 flex flex-col justify-center relative">
          <div className="text-sm font-semibold text-neutral-500 mb-4 tracking-widest uppercase">0{index + 1} / {stage.eyebrow}</div>
          <h3 className="text-3xl lg:text-4xl font-semibold mb-4 leading-tight">{stage.title}</h3>
          <p className="text-neutral-400 text-base lg:text-lg leading-relaxed">{stage.desc}</p>
        </div>

        {/* Right Canvas */}
        <div className="w-full lg:w-[62%] h-[400px] lg:h-full border-t lg:border-t-0 lg:border-l border-white/10 bg-[#050505] relative">
          <TradingApplicationCanvas activeState={index} />
        </div>
      </motion.div>
    </div>
  );
}

export function TradingShowcaseSection() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = React.useState(0);
  
  const handleScroll = React.useCallback(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const containerCenter = container.scrollLeft + container.clientWidth / 2;
    
    let closestIndex = 0;
    let minDistance = Infinity;

    cardRefs.current.forEach((card, index) => {
      if (!card) return;
      const cardCenter = card.offsetLeft + card.clientWidth / 2;
      const distance = Math.abs(cardCenter - containerCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    if (closestIndex !== activeIndex) {
      setActiveIndex(closestIndex);
    }
  }, [activeIndex]);

  const scrollTo = (index: number) => {
    if (!containerRef.current || !cardRefs.current[index]) return;
    const container = containerRef.current;
    const card = cardRefs.current[index];
    
    const scrollLeft = card.offsetLeft - container.clientWidth / 2 + card.clientWidth / 2;
    container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
  };

  // Custom pointer drag for desktop mouse users
  const isDragging = React.useRef(false);
  const startX = React.useRef(0);
  const scrollLeft = React.useRef(0);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    isDragging.current = true;
    startX.current = e.pageX - (containerRef.current?.offsetLeft || 0);
    scrollLeft.current = containerRef.current?.scrollLeft || 0;
    if (containerRef.current) {
        containerRef.current.style.scrollSnapType = 'none';
        containerRef.current.style.cursor = 'grabbing';
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    e.preventDefault(); // Prevent text selection while dragging
    const x = e.pageX - (containerRef.current.offsetLeft || 0);
    const walk = (x - startX.current) * 1.5; 
    containerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const onPointerUp = () => {
    if (!isDragging.current || !containerRef.current) return;
    isDragging.current = false;
    containerRef.current.style.scrollSnapType = 'x mandatory';
    containerRef.current.style.cursor = 'grab';
    
    handleScroll();
    
    // Snap to the closest item after free drag release
    const container = containerRef.current;
    const containerCenter = container.scrollLeft + container.clientWidth / 2;
    
    let closestIndex = 0;
    let minDistance = Infinity;

    cardRefs.current.forEach((card, index) => {
      if (!card) return;
      const cardCenter = card.offsetLeft + card.clientWidth / 2;
      const distance = Math.abs(cardCenter - containerCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });
    
    scrollTo(closestIndex);
  };

  const onPointerLeave = () => {
    if (isDragging.current) {
       onPointerUp();
    }
  };

  return (
    <section id="trading-showcase" className="relative w-full bg-[#050505] text-white overflow-hidden py-24 lg:py-32">
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .carousel-track {
          --card-width: 90vw;
          padding-left: calc((100vw - var(--card-width)) / 2);
          padding-right: calc((100vw - var(--card-width)) / 2);
        }
        @media (min-width: 768px) {
          .carousel-track {
            --card-width: 85vw;
          }
        }
        @media (min-width: 1024px) {
          .carousel-track {
            --card-width: min(960px, 80vw);
          }
        }
      `}} />
      
      {/* Intro Header */}
      <div className="px-4 max-w-2xl mx-auto text-center mb-12 lg:mb-16 relative z-10">
        <span className="text-[11px] font-semibold tracking-widest text-neutral-500 uppercase">Trading Experience</span>
        <h2 className="text-3xl lg:text-5xl font-semibold mt-4 mb-6 leading-[1.1]">Structure before execution.</h2>
        <p className="text-neutral-400 text-base lg:text-lg leading-relaxed">
           A visual look at how market context can move from analysis into a defined trading plan.
        </p>
      </div>

      {/* Controls & Progress */}
      <div className="max-w-[960px] mx-auto px-6 md:px-8 mb-8 lg:mb-10 flex items-center justify-between">
         {/* Progress */}
         <div className="flex items-center gap-4">
           <span className="text-sm font-mono text-neutral-400">0{activeIndex + 1} / 03</span>
           <div className="flex gap-1.5" role="progressbar" aria-valuenow={activeIndex + 1} aria-valuemin={1} aria-valuemax={3}>
             {[0, 1, 2].map((i) => (
               <div 
                 key={i}
                 className={`h-1 rounded-full transition-all duration-300
                   ${activeIndex === i ? 'w-8 bg-white' : activeIndex > i ? 'w-4 bg-white/40' : 'w-4 bg-white/10'}`}
               />
             ))}
           </div>
         </div>
         
         {/* Navigation */}
         <div className="flex gap-3">
           <Button 
             variant="icon-control"
             iconName="chevron-left"
             onClick={() => scrollTo(activeIndex - 1)}
             disabled={activeIndex === 0}
             aria-label="Previous stage"
           />
           <Button 
             variant="icon-control"
             iconName="chevron-right"
             onClick={() => scrollTo(activeIndex + 1)}
             disabled={activeIndex === 2}
             aria-label="Next stage"
           />
         </div>
      </div>

      {/* Carousel Wrapper */}
      <div
         className="relative w-full cursor-grab active:cursor-grabbing" 
         onPointerDown={onPointerDown}
         onPointerMove={onPointerMove}
         onPointerUp={onPointerUp}
         onPointerLeave={onPointerLeave}
      >
        <div 
          ref={containerRef}
          onScroll={handleScroll}
          className="carousel-track flex gap-6 lg:gap-8 overflow-x-auto snap-x snap-mandatory hide-scrollbar"
        >
          {STORY_STAGES.map((stage, i) => (
             <TradingStoryCard 
               key={i}
               index={i}
               stage={stage}
               isActive={activeIndex === i}
               cardRef={(el) => (cardRefs.current[i] = el)}
             />
          ))}
        </div>
      </div>
    </section>
  );
}
