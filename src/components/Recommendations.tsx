/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { useState } from "react";
import { Recommendation } from "../types";
import { Check, DollarSign } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AnimatedCard } from "./AnimatedCard";

interface RecommendationsProps {
  recommendations: Recommendation[];
  onCommitRecommendation: (id: string, co2: number, savings: number) => void;
  committedIds: string[];
}

export default function Recommendations({ recommendations, onCommitRecommendation, committedIds }: RecommendationsProps) {
  const [activeTab, setActiveTab] = useState<string>("all");

  const categories = [
    { id: "all", label: "All Priorities" },
    { id: "transport", label: "Transportation" },
    { id: "energy", label: "Thermodynamics" },
    { id: "food", label: "Nutrition" },
    { id: "waste", label: "Circular waste" }
  ];

  const filteredRecs = recommendations.filter(
    (rec) => activeTab === "all" || rec.category === activeTab
  );

  const getDifficultyColor = (diff: Recommendation["difficulty"]) => {
    switch (diff) {
      case "Easy": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "Medium": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
      case "Hard": return "bg-rose-500/10 text-rose-400 border-rose-500/30";
    }
  };

  return (
    <div className="space-y-6 text-left" id="recommendations-container">
      
      {/* 1. Category Filter Switchers */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-white/10">
        {categories.map((c) => {
          const isActive = activeTab === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setActiveTab(c.id)}
              className={`relative px-4 py-2 text-xs font-bold rounded-xl transition-all duration-300 border outline-none cursor-pointer ${
                isActive
                  ? "border-emerald-500/40 text-emerald-400 font-extrabold"
                  : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20 hover:bg-white/10"
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-rec-tab-pill"
                  className="absolute inset-0 bg-emerald-500/10 rounded-xl"
                  transition={{ type: "spring" as const, stiffness: 350, damping: 25 }}
                />
              )}
              <span className="relative z-10">{c.label}</span>
            </button>
          );
        })}
      </div>

      {/* 2. Grid items with Filter Layout Animation */}
      <motion.div 
        layout 
        className="grid grid-cols-1 md:grid-cols-2 gap-6" 
        id="priorities-grid"
      >
        <AnimatePresence mode="popLayout">
          {filteredRecs.map((rec) => {
            const isCommitted = committedIds.includes(rec.id);
            return (
              <motion.div
                layout
                key={rec.id}
                id={`priority-card-${rec.id}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35 }}
                className="h-full"
              >
                <AnimatedCard
                  className={`p-6 rounded-2xl border h-full w-full ${
                    isCommitted
                      ? "bg-emerald-950/20 border-emerald-500/40 shadow-lg shadow-emerald-950/5"
                      : "bg-white/5 border-white/10"
                  }`}
                  glowColor={isCommitted ? "rgba(16, 185, 129, 0.25)" : "rgba(3, 105, 161, 0.15)"}
                >
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      {/* Diff Indicator */}
                      <div className="flex justify-between items-start mb-4">
                        <span className={`px-2.5 py-1 text-[10px] uppercase font-mono font-bold rounded-lg border ${getDifficultyColor(rec.difficulty)}`}>
                          {rec.difficulty} complexity
                        </span>
                        <span className="text-xs font-mono text-slate-500 capitalize">{rec.category} priority</span>
                      </div>

                      {/* Title & info */}
                      <div className="space-y-2 mb-4">
                        <h4 className="text-lg font-bold text-white flex items-center space-x-2">
                          <span>{rec.title}</span>
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed font-sans">{rec.description}</p>
                      </div>
                    </div>

                    <div>
                      {/* Dynamic counters segment */}
                      <div className="grid grid-cols-2 gap-4 py-4 my-4 border-y border-white/10 text-xs text-left">
                        <div>
                          <span className="block text-[10px] uppercase tracking-wider text-slate-500 font-mono">Carbon Reduction</span>
                          <span className="text-base font-bold text-emerald-400 font-mono">-{rec.co2Reduction} kg CO₂ / yr</span>
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase tracking-wider text-slate-500 font-mono">Quarterly Savings</span>
                          <span className="text-base font-bold text-white font-mono flex items-center">
                            <DollarSign className="w-3.5 h-3.5 text-emerald-400 inline" />
                            <span>+{rec.financialSavings} / yr</span>
                          </span>
                        </div>
                      </div>

                      {/* Interactivity: Commit button */}
                      <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/10">
                        <span className="text-[10px] font-mono text-slate-405">
                          {isCommitted ? "Active in roadmap goals" : "Ready to implement?"}
                        </span>
                        
                        <button
                          type="button"
                          onClick={() => onCommitRecommendation(rec.id, rec.co2Reduction, rec.financialSavings)}
                          disabled={isCommitted}
                          className={`px-4 py-2.5 rounded-lg text-[11px] font-bold transition-all active:scale-95 flex items-center space-x-1.5 cursor-pointer outline-none ${
                            isCommitted
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-not-allowed"
                              : "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:brightness-105"
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 text-slate-950" strokeWidth={3} />
                          <span className="text-slate-950">{isCommitted ? "Committed" : "Commit Action"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </AnimatedCard>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

    </div>
  );
}
