/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { EcoTip } from "../types";
import { ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function WeeklyTips() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const tips: EcoTip[] = [
    {
      title: "Cold Laundry Cycles",
      content: "Cold-washing clothes protects fabrics and reduces heating demands. Up to 75-90% of electricity draw from conventional laundry cycles comes strictly from heating the water volume.",
      category: "Home thermodynamical loads",
      impactLevel: "Medium Impact"
    },
    {
      title: "Thermal AC Adjustments",
      content: "Keeping household AC thresholds locked at 24°C rather than standard chill ranges saves up to 4% energy per degree offset, easing utility draw on central power stations.",
      category: "Thermodynamics",
      impactLevel: "High Impact"
    },
    {
      title: "Curb Phantom Power Draw",
      content: "Household equipment consumes miniature phantom loads (standby draw) when not in use. Engage smart extension rails or shut power strips to cut up to 8% of residential power drift.",
      category: "Home Energy",
      impactLevel: "Medium Impact"
    },
    {
      title: "Micro-Commute Integration",
      content: "Over half of municipal passenger solo commutes span less than 5 km distance. Transitioning to bikes or electric micromobility on nice days offsets up to 180g of direct CO2 exhaust per km.",
      category: "Transit Networks",
      impactLevel: "High Impact"
    }
  ];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === tips.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? tips.length - 1 : prev - 1));
  };

  const currTip = tips[currentIndex];

  return (
    <div className="glassmorphism p-6 rounded-2xl relative overflow-hidden text-left" id="tips-panel">
      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
      
      <div className="flex justify-between items-center pb-3 border-b border-white/10 mb-4 text-xs font-mono">
        <span className="text-emerald-400 font-bold uppercase tracking-widest flex items-center space-x-1.5">
          <Zap className="w-3.5 h-3.5 text-emerald-400"  aria-hidden="true" />
          <span>WEEKLY ECO TIP METRIC</span>
        </span>
        <span className="text-slate-500">{currentIndex + 1} / {tips.length}</span>
      </div>

      <div className="min-h-[140px] flex flex-col justify-between">
        
        {/* Animated Tip Sliding Screen */}
        <div className="relative overflow-hidden h-[110px] w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="absolute inset-0 space-y-2 text-left"
            >
              <div className="inline-block">
                <span className="text-[9px] text-emerald-400 uppercase tracking-wide font-mono px-2 py-0.5 rounded border border-emerald-500/25 bg-emerald-500/5 font-bold">
                  {currTip.impactLevel}
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-white pt-1 truncate">{currTip.title}</h4>
              <p className="text-[11px] text-slate-300 leading-relaxed font-sans line-clamp-3">{currTip.content}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-white/10 text-[10px] text-slate-500 font-mono">
          <span>CAT: {currTip.category}</span>
          <div className="flex space-x-2">
            <button 
              type="button"
              onClick={handlePrev}
              className="p-1 rounded bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer outline-none"
            >
              <ChevronLeft className="w-3.5 h-3.5"  aria-hidden="true" />
            </button>
            <button 
              type="button"
              onClick={handleNext}
              className="p-1 rounded bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer outline-none"
            >
              <ChevronRight className="w-3.5 h-3.5"  aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
