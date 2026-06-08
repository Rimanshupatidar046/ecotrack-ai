/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RoadmapMilestone } from "../types";
import { CheckCircle2, Milestone } from "lucide-react";
import { motion } from "motion/react";
import { AnimatedCard } from "./AnimatedCard";

interface RoadmapProps {
  milestones: RoadmapMilestone[];
  onToggleMilestone: (id: string) => void;
}

export default function Roadmap({ milestones, onToggleMilestone }: RoadmapProps) {
  
  // Calculate total targets achieved
  const totalRoadmapKg = milestones.reduce((acc, m) => acc + (m.achieved ? m.savingsKg : 0), 0);
  const totalCount = milestones.length;
  const completedCount = milestones.filter(m => m.achieved).length;
  const percentComplete = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Stagger configurations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1, transition: { type: "spring" as const, stiffness: 100, damping: 14 } }
  };

  return (
    <motion.div 
      className="space-y-6 text-left" 
      id="roadmap-wrapper"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      
      {/* 1. Header roadmap summary */}
      <motion.div 
        variants={itemVariants}
        className="glassmorphism p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl relative overflow-hidden border border-white/10"
      >
        <div className="space-y-1">
          <span className="text-emerald-400 font-mono text-xs tracking-widest block font-bold">NET ZERO TARGET PATHWAYS</span>
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <Milestone className="w-5 h-5 text-emerald-400" />
            <span>Carbon Reduction Roadmap Milestones</span>
          </h3>
          <p className="text-xs text-slate-400">Track milestones across Short-term, Mid-term and Long-term target dates</p>
        </div>

        <div className="flex items-center space-x-6 text-xs text-slate-300">
          <div className="text-center bg-white/5 p-4 rounded-xl border border-white/10">
            <span className="block text-[10px] text-slate-400 font-mono">MITIGATED CARBON MASS</span>
            <span className="text-xl font-bold text-emerald-400">{totalRoadmapKg} kg / yr</span>
          </div>
          
          <div className="text-center bg-white/5 p-4 rounded-xl border border-white/10">
            <span className="block text-[10px] text-slate-400 font-mono">COMPLETE PERCENTAGE</span>
            <span className="text-xl font-bold text-white">{percentComplete}% Done</span>
          </div>
        </div>
      </motion.div>

      {/* 2. Interactive Timeline grids */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="milestones-columns">
        
        {/* Short Term */}
        <motion.div variants={itemVariants} className="h-full">
          <AnimatedCard 
            className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between min-h-[380px] w-full h-full"
            glowColor="rgba(16, 185, 129, 0.15)"
          >
            <div>
              <div className="border-b border-white/10 pb-3 mb-4 flex items-center justify-between text-[10px] font-mono font-extrabold">
                <span className="text-emerald-400 font-bold uppercase">SHORT-TERM TARGETS</span>
                <span className="text-slate-400 uppercase">1 - 3 MONTHS</span>
              </div>
              
              <div className="space-y-3">
                {milestones.filter(m => m.timeframe === "Short-term").map((m) => (
                  <motion.div 
                    key={m.id}
                    onClick={() => onToggleMilestone(m.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all outline-none text-left ${
                      m.achieved 
                        ? "bg-emerald-500/10 border-emerald-500/35 text-emerald-300 shadow-md" 
                        : "bg-white/5 border-white/5 text-slate-400 hover:border-white/15 hover:bg-white/10"
                    }`}
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-start space-x-2.5">
                      <CheckCircle2 className={`w-4.5 h-4.5 flex-shrink-0 mt-0.5 ${m.achieved ? "text-emerald-405" : "text-slate-650"}`} />
                      <div>
                        <h4 className="text-xs font-bold text-white leading-normal">{m.title}</h4>
                        <p className="text-[10px] text-slate-400 leading-normal pt-1">{m.description}</p>
                        <span className="text-[8px] font-mono mt-2 inline-block text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded bg-black/30 font-bold">{m.savingsKg} kg offset</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatedCard>
        </motion.div>

        {/* Mid-term */}
        <motion.div variants={itemVariants} className="h-full">
          <AnimatedCard 
            className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between min-h-[380px] w-full h-full"
            glowColor="rgba(6, 182, 212, 0.15)"
          >
            <div>
              <div className="border-b border-white/10 pb-3 mb-4 flex items-center justify-between text-[10px] font-mono font-extrabold">
                <span className="text-cyan-400 font-bold uppercase">MID-TERM SCHEMES</span>
                <span className="text-slate-400 uppercase">3 - 12 MONTHS</span>
              </div>

              <div className="space-y-3">
                {milestones.filter(m => m.timeframe === "Mid-term").map((m) => (
                  <motion.div 
                    key={m.id}
                    onClick={() => onToggleMilestone(m.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all outline-none text-left ${
                      m.achieved 
                        ? "bg-emerald-500/10 border-emerald-500/35 text-emerald-300 shadow-md" 
                        : "bg-white/5 border-white/5 text-slate-400 hover:border-white/15 hover:bg-white/10"
                    }`}
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-start space-x-2.5">
                      <CheckCircle2 className={`w-4.5 h-4.5 flex-shrink-0 mt-0.5 ${m.achieved ? "text-emerald-405" : "text-slate-655"}`} />
                      <div>
                        <h4 className="text-xs font-bold text-white leading-normal">{m.title}</h4>
                        <p className="text-[10px] text-slate-400 leading-normal pt-1">{m.description}</p>
                        <span className="text-[8px] font-mono mt-2 inline-block text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded bg-black/30 font-bold">{m.savingsKg} kg offset</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatedCard>
        </motion.div>

        {/* Long-term */}
        <motion.div variants={itemVariants} className="h-full">
          <AnimatedCard 
            className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between min-h-[380px] w-full h-full"
            glowColor="rgba(59, 130, 246, 0.15)"
          >
            <div>
              <div className="border-b border-white/10 pb-3 mb-4 flex items-center justify-between text-[10px] font-mono font-extrabold">
                <span className="text-blue-400 font-bold uppercase">LONG-TERM ROADMAP</span>
                <span className="text-slate-400 uppercase">12+ MONTHS</span>
              </div>

              <div className="space-y-3">
                {milestones.filter(m => m.timeframe === "Long-term").map((m) => (
                  <motion.div 
                    key={m.id}
                    onClick={() => onToggleMilestone(m.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all outline-none text-left ${
                      m.achieved 
                        ? "bg-emerald-500/10 border-emerald-500/35 text-emerald-300 shadow-md" 
                        : "bg-white/5 border-white/5 text-slate-400 hover:border-white/15 hover:bg-white/10"
                    }`}
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-start space-x-2.5">
                      <CheckCircle2 className={`w-4.5 h-4.5 flex-shrink-0 mt-0.5 ${m.achieved ? "text-emerald-405" : "text-slate-655"}`} />
                      <div>
                        <h4 className="text-xs font-bold text-white leading-normal">{m.title}</h4>
                        <p className="text-[10px] text-slate-400 leading-normal pt-1">{m.description}</p>
                        <span className="text-[8px] font-mono mt-2 inline-block text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded bg-black/30 font-bold">{m.savingsKg} kg offset</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatedCard>
        </motion.div>

      </div>

    </motion.div>
  );
}
