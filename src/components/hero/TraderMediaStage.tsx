import * as React from "react";
import { motion } from "motion/react";
import { Shield } from "lucide-react";
// Since dynamic imports or variables in image paths can sometimes be tricky in Vite if not handled, 
// I will import the static path that was generated, or we can use a relative reference.
// The image generated is /src/assets/images/editorial_trader_portrait_1788105217312.jpg
import traderImage from "@/assets/images/editorial_trader_portrait_1788105217312.jpg";

export function TraderMediaStage() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.985, y: 14 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full h-[500px] lg:h-[720px] rounded-[16px] lg:rounded-[18px] overflow-hidden bg-neutral-100 group"
    >
      {/* Media Image */}
      <motion.img
        src={traderImage}
        alt="Professional Trader Workspace"
        className="absolute inset-0 w-full h-full object-cover"
        transition={{ duration: 0.6 }}
        whileHover={{ scale: 1.012 }}
      />

      {/* Media Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

      {/* Media Feature Badge */}
      <div className="absolute bottom-6 left-6 lg:bottom-8 lg:left-8 flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-white">
        <Shield className="w-4 h-4 mr-2 opacity-90" />
        <span className="text-sm font-medium tracking-wide opacity-90">
          Trading • Education • Community
        </span>
      </div>
    </motion.div>
  );
}
