/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EcoChallenge, AchievementBadge } from "../types";
import { Trophy, Compass, TreeDeciduous, CheckCircle2, Check } from "lucide-react";
import { motion } from "motion/react";
import { AnimatedCard } from "./AnimatedCard";

interface GamificationProps {
  challenges: EcoChallenge[];
  badges: AchievementBadge[];
  userPoints: number;
  onCompleteChallenge: (id: string, pts: number) => void;
  xpPoints: number;
}

export default function Gamification({ challenges, badges, userPoints, onCompleteChallenge, xpPoints }: GamificationProps) {
  
  // Calculate dynamic level indicators: Level 1 starts at 0 XP, Level 2 at 100 XP, etc.
  const level = Math.floor(xpPoints / 100) + 1;
  const currentXPPercent = xpPoints % 100;

  // Stagger variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -15 },
    show: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 120, damping: 15 } }
  };

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.85 },
    show: { opacity: 1, scale: 1, transition: { type: "spring" as const, stiffness: 100, damping: 12 } }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left" 
      id="gamification-workspace"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      
      {/* 1. Level progress section */}
      <motion.div 
        variants={itemVariants}
        className="lg:col-span-12 glassmorphism-emerald p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl relative overflow-hidden border border-emerald-500/20"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center space-x-4">
          <motion.div 
            className="bg-gradient-to-br from-emerald-400 to-teal-500 p-4 rounded-2xl text-slate-950 font-mono font-extrabold text-2xl flex items-center justify-center w-16 h-16 shadow-lg shadow-emerald-500/15"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring" as const, stiffness: 400, damping: 10 }}
          >
            {level}
          </motion.div>
          <div>
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block font-bold">ECO CITIZEN STATUS</span>
            <h2 className="text-xl font-extrabold text-white">Sustainability Level {level}</h2>
            <p className="text-xs text-slate-400">Claim XP milestones by checking daily or weekly tasks</p>
          </div>
        </div>

        <div className="w-full md:w-1/2 space-y-2">
          <div className="flex justify-between text-xs font-mono text-slate-400">
            <span>XP Progress Metrics</span>
            <span className="text-emerald-400 font-bold">{xpPoints} XP / {level * 100} Target</span>
          </div>
          <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/10">
            <motion.div 
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full" 
              initial={{ width: 0 }}
              animate={{ width: `${currentXPPercent}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

      </motion.div>

      {/* 2. Challenges lists (Col Span 7) */}
      <motion.div 
        variants={itemVariants}
        className="lg:col-span-7 glassmorphism p-5 md:p-6 rounded-2xl flex flex-col justify-between min-h-[400px]"
      >
        
        <div className="border-b border-white/10 pb-4 mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Compass className="w-5 h-5 text-emerald-400"  aria-hidden="true" />
              <span>Active Eco Challenges & Missions</span>
            </h2>
            <p className="text-[11px] text-slate-400">Complete standard physical tasks to register carbon points</p>
          </div>
          <div className="bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-xs font-mono text-emerald-400 font-bold">
            {userPoints} ECO POINTS
          </div>
        </div>

        <div className="space-y-3.5 mb-6">
          {challenges.map((task) => (
            <motion.div 
              key={task.id}
              className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-4 ${
                task.completed 
                  ? "bg-white/5 border-emerald-500/10 text-slate-500" 
                  : "bg-white/5 border-white/10 text-slate-200 hover:border-white/20 hover:bg-white/10"
              }`}
              whileHover={!task.completed ? { x: 5, borderColor: "rgba(16, 185, 129, 0.2)" } : {}}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center space-x-3.5">
                <div className={`p-2 rounded-xl border ${task.completed ? "border-emerald-500/10 text-emerald-500/40" : "border-white/10 text-emerald-400"}`}>
                  <TreeDeciduous className="w-4 h-4"  aria-hidden="true" />
                </div>
                <div>
                  <h3 className={`text-sm font-bold ${task.completed ? "line-through text-slate-505" : "text-white"}`}>{task.title}</h3>
                  <p className="text-[11px] text-slate-400">{task.description}</p>
                </div>
              </div>

              <div>
                <button
                  disabled={task.completed}
                  onClick={() => onCompleteChallenge(task.id, task.points)}
                  aria-label={task.completed ? "Mission Completed" : "Complete Mission"}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                    task.completed 
                      ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/25" 
                      : "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:brightness-105 active:scale-95"
                  }`}
                >
                  {task.completed ? (
                      <CheckCircle2 className="w-5 h-5"  aria-hidden="true" />
                  ) : (
                    <span className="text-[10px] font-bold">+{task.points}</span>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      </motion.div>

      {/* 3. Badges (Col Span 5) */}
      <motion.div 
        variants={itemVariants}
        className="lg:col-span-5 glassmorphism p-5 md:p-6 rounded-2xl flex flex-col justify-between min-h-[400px]"
      >
        
        <div className="border-b border-white/10 pb-4 mb-4 flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-emerald-400 animate-bounce"  aria-hidden="true" />
          <div>
            <h2 className="text-base font-bold text-white">Earned Badges & Ribbons</h2>
            <p className="text-[11px] text-slate-400">Unlock awards based on carbon reductions</p>
          </div>
        </div>

        <motion.div 
          className="grid grid-cols-2 gap-4 pb-4"
          variants={containerVariants}
        >
          {badges.map((badge) => (
            <motion.div
              key={badge.id}
              variants={badgeVariants}
            >
              <AnimatedCard 
                className={`p-4 rounded-xl border text-center flex flex-col items-center justify-center space-y-2.5 transition-all w-full h-full ${
                  badge.unlocked 
                    ? "bg-white/10 border-emerald-400/30 text-white shadow-lg" 
                    : "bg-white/5 border-white/5 text-slate-600 opacity-60"
                }`}
                glowColor={badge.unlocked ? "rgba(16, 185, 129, 0.2)" : "rgba(255, 255, 255, 0)"}
                tiltAmount={badge.unlocked ? 10 : 0}
              >
                <div className={`w-12 h-12 rounded-full border flex items-center justify-center text-xl ${
                  badge.unlocked 
                    ? "bg-emerald-500/10 border-emerald-400 text-emerald-400" 
                    : "bg-white/5 border-white/10 text-slate-600"
                }`}>
                  <Check className="w-5 h-5" aria-hidden="true" />
                </div>

                <div>
                  <span className={`text-[11px] font-bold block ${badge.unlocked ? "text-white" : "text-slate-500"}`}>{badge.name}</span>
                  <span className="text-[9px] block text-slate-400 leading-tight pt-1">{badge.description}</span>
                </div>

                {badge.unlocked && (
                  <span className="inline-block bg-emerald-500/10 text-emerald-400 font-mono text-[8px] px-1.5 py-0.5 rounded border border-emerald-500/25 uppercase">
                    UNLOCKED
                  </span>
                )}
              </AnimatedCard>
            </motion.div>
          ))}
        </motion.div>

      </motion.div>

    </motion.div>
  );
}
