/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Cell, PieChart, Pie, ResponsiveContainer, XAxis, YAxis, Tooltip, BarChart, Bar, Legend, LineChart, Line } from "recharts";
import { Award, Globe, ShieldAlert, Sparkles, AlertCircle, TrendingDown } from "lucide-react";
import { CalculationResult } from "../types";
import { motion, type Variants } from "motion/react";
import { AnimatedCard } from "./AnimatedCard";

interface DashboardProps {
  result: CalculationResult | null;
  commentary: string; // From the Gemini result
}

export default function Dashboard({ result, commentary }: DashboardProps) {
  if (!result) {
    return (
      <div className="glassmorphism rounded-3xl p-12 text-center text-slate-400 flex flex-col items-center justify-center min-h-[450px]">
        <AlertCircle className="w-12 h-12 text-emerald-500/50 mb-4 animate-bounce" />
        <h3 className="text-xl font-bold text-white mb-2">No Emissions Profile Active</h3>
        <p className="text-xs max-w-sm mx-auto leading-relaxed text-slate-400">
          Complete the Carbon Assessment form to compile high fidelity scientific indicators, breakdown charts, and AI-personalized recommendations.
        </p>
      </div>
    );
  }

  // Breakdown values
  const breakdownData = [
    { name: "Transit Networks", value: result.breakdown.transport, color: "#10b981" },
    { name: "Thermodynamic Loads", value: result.breakdown.energy, color: "#06b6d4" },
    { name: "Nutrition Cycles", value: result.breakdown.food, color: "#3b82f6" },
    { name: "Municipal Waste", value: result.breakdown.waste, color: "#eab308" }
  ].filter(d => d.value > 0);

  // Historical progress simulation sequence
  const trendData = [
    { name: "Base Year", emissions: result.carbonScore },
    { name: "Month 1", emissions: Number((result.carbonScore * 0.95).toFixed(2)) },
    { name: "Month 2", emissions: Number((result.carbonScore * 0.88).toFixed(2)) },
    { name: "Month 3", emissions: Number((result.carbonScore * 0.80).toFixed(2)) },
    { name: "Target Phase", emissions: 2.0 } // target carbon goal is standard 2.0 T
  ];

  // Target comparative data
  const comparisonData = [
    { name: "Aviation/Transit", Current: result.breakdown.transport, StandardTarget: 0.6 },
    { name: "Home Power Draw", Current: result.breakdown.energy, StandardTarget: 0.5 },
    { name: "Agricultural Feed", Current: result.breakdown.food, StandardTarget: 0.5 },
    { name: "Solid Waste Refuse", Current: result.breakdown.waste, StandardTarget: 0.4 }
  ];

  // Helper colors for circular progress rings
  const getScoreColor = () => {
    if (result.sustainabilityScore >= 80) return "text-emerald-400";
    if (result.sustainabilityScore >= 60) return "text-cyan-400";
    if (result.sustainabilityScore >= 40) return "text-yellow-400";
    return "text-rose-400";
  };

  const getCategoryClass = () => {
    switch (result.impactCategory) {
      case "Excellent": return "bg-emerald-500/10 border-emerald-500/30 text-emerald-300";
      case "Good": return "bg-cyan-500/10 border-cyan-500/30 text-cyan-300";
      case "Average": return "bg-yellow-500/10 border-yellow-500/30 text-yellow-300";
      case "High Impact": return "bg-rose-500/10 border-rose-500/30 text-rose-300";
    }
  };

  // Motion entrance variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 25 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } }
  };

  return (
    <motion.div 
      className="space-y-6" 
      id="dashboard-wrapper"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      
      {/* 1. KPIs Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* KPI 1: Annual Carbon Output */}
        <motion.div variants={itemVariants}>
          <AnimatedCard 
            className="bg-white/5 border border-white/10 p-6 rounded-2xl w-full h-full"
            glowColor="rgba(16, 185, 129, 0.2)"
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">ANNUAL GLOBAL MASS</span>
              <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                <Globe className="w-4 h-4 text-emerald-400 animate-spin" style={{ animationDuration: '24s' }} />
              </div>
            </div>
            <div className="pt-4 space-y-1">
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-extrabold text-white font-mono">{result.carbonScore}</span>
                <span className="text-xs font-semibold text-slate-400 font-sans">Tons CO₂e/yr</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans pt-1">
                Reflects your consolidated radioactive forcing factor. Target threshold is &lt; 2.0 T.
              </p>
            </div>
          </AnimatedCard>
        </motion.div>

        {/* KPI 2: Sustainability Index Score */}
        <motion.div variants={itemVariants}>
          <AnimatedCard 
            className="bg-white/5 border border-white/10 p-6 rounded-2xl w-full h-full"
            glowColor="rgba(6, 182, 212, 0.2)"
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">SUSTAINABILITY PROFILE</span>
              <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                <Award className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div className="pt-4 flex items-center space-x-4">
              
              {/* SVG circular progress indicator with fill animation */}
              <div className="relative w-16 h-16 flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="32" cy="32" r="26" className="text-white/10" strokeWidth="4" stroke="currentColor" fill="transparent" />
                  <motion.circle 
                    cx="32" 
                    cy="32" 
                    r="26" 
                    className={getScoreColor()} 
                    strokeWidth="4" 
                    strokeDasharray={163.3} 
                    initial={{ strokeDashoffset: 163.3 }}
                    animate={{ strokeDashoffset: 163.3 - (163.3 * result.sustainabilityScore) / 100 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    strokeLinecap="round" 
                    stroke="currentColor" 
                    fill="transparent" 
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-mono font-bold text-sm text-white">
                  {result.sustainabilityScore}
                </div>
              </div>

              <div>
                <span className="text-lg font-bold text-white block">Eco Index: {result.sustainabilityScore}/100</span>
                <span className="text-[11px] text-slate-400 block font-sans">Graded scale based on standard mitigation rates.</span>
              </div>

            </div>
          </AnimatedCard>
        </motion.div>

        {/* KPI 3: Climate Impact Class */}
        <motion.div variants={itemVariants}>
          <AnimatedCard 
            className="bg-white/5 border border-white/10 p-6 rounded-2xl w-full h-full"
            glowColor="rgba(234, 179, 8, 0.15)"
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">EPIDEMIOLOGY IMPACT</span>
              <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
              </div>
            </div>
            <div className="pt-4">
              <div className={`px-4 py-2 text-xs font-extrabold rounded-xl border text-center transition-all ${getCategoryClass()}`}>
                {result.impactCategory} Environment Status
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans pt-2">
                Requires immediate action patterns across principal carbon categories if marked high.
              </p>
            </div>
          </AnimatedCard>
        </motion.div>

      </div>

      {/* 2. Chatbot AI Insight Segment with slide expansion */}
      <motion.div 
        variants={itemVariants}
        className="glassmorphism-emerald p-5 md:p-6 rounded-2xl flex flex-col md:flex-row gap-5 items-start border border-emerald-500/20 shadow-lg shadow-emerald-500/5"
      >
        <div className="bg-emerald-500/15 p-3 rounded-xl border border-emerald-500/25 hidden md:block">
          <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
        </div>
        <div className="space-y-1 w-full text-left">
          <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 block md:hidden" />
            <span>AI CLIMATE ADVISOR SUMMARY</span>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed font-sans italic">
            "{commentary}"
          </p>
        </div>
      </motion.div>

      {/* 3. Recharts Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Chart A: Pie chart breakdown (Col Span 5) */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-5 glassmorphism p-5 rounded-2xl flex flex-col justify-between h-[360px] relative overflow-hidden" 
          id="chart-pie-container"
        >
          <div className="border-b border-white/10 pb-3 flex items-center justify-between">
            <span className="text-sm font-bold text-white">Carbon Contribution Breakdown</span>
            <span className="text-[10px] font-mono text-slate-400 uppercase">Proportional Volume</span>
          </div>

          <div className="h-[210px] relative">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <PieChart>
                <Pie
                  data={breakdownData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                  isAnimationActive={true}
                  animationDuration={1500}
                >
                  {breakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#020617", border: "1px solid #334155", borderRadius: "10px" }}
                  itemStyle={{ color: "#fff", fontSize: "11px", fontFamily: "sans-serif" }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center score indicator */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
              <span className="text-xl font-mono font-extrabold text-white">{result.carbonScore}</span>
              <span className="text-[9px] font-mono text-slate-400 uppercase">Total Tons</span>
            </div>
          </div>

          {/* Color Keys */}
          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-300">
            {breakdownData.map((item, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: item.color }} />
                <span className="truncate">{item.name}: {item.value} Tons</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Chart B: Bar chart Comparative Standard (Col Span 7) */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-7 glassmorphism p-5 rounded-2xl flex flex-col justify-between h-[360px] relative overflow-hidden" 
          id="chart-bar-container"
        >
          <div className="border-b border-white/10 pb-3 flex items-center justify-between">
            <span className="text-sm font-bold text-white font-sans">Comparative Climate Alignment</span>
            <span className="text-[10px] font-mono text-slate-400 uppercase">Actual vs IPPC Target</span>
          </div>

          <div className="h-[260px] pt-4">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <BarChart data={comparisonData}>
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10, fontFamily: "sans-serif" }} stroke="rgba(255,255,255,0.05)" />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 10, fontFamily: "mono" }} stroke="rgba(255,255,255,0.05)" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#020617", border: "1px solid #334155", borderRadius: "10px" }}
                  itemStyle={{ fontSize: "11px", fontFamily: "sans-serif" }}
                />
                <Legend iconSize={8} wrapperStyle={{ fontSize: "10px", fontFamily: "sans-serif" }} />
                <Bar dataKey="Current" fill="#06b6d4" name="Your Carbon Profile" radius={[4, 4, 0, 0]} isAnimationActive={true} animationDuration={1800} />
                <Bar dataKey="StandardTarget" fill="#10b981" name="Ideal Net-Zero (2.0T Target)" radius={[4, 4, 0, 0]} isAnimationActive={true} animationDuration={1850} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </div>

      {/* 4. Chart C: Bottom Full Line Chart Trend projection */}
      <motion.div 
        variants={itemVariants}
        className="glassmorphism p-5 rounded-2xl flex flex-col justify-between h-[320px] relative overflow-hidden" 
        id="chart-line-container"
      >
        <div className="border-b border-white/10 pb-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingDown className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-bold text-white font-sans">Your Simulated Carbon Reduction Forecast</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400 uppercase">Monthly Progress Sequence</span>
        </div>

        <div className="h-[220px] pt-4">
          <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
            <LineChart data={trendData}>
              <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10, fontFamily: "sans-serif" }} stroke="rgba(255,255,255,0.05)" />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 10, fontFamily: "mono" }} stroke="rgba(255,255,255,0.05)" />
              <Tooltip
                contentStyle={{ backgroundColor: "#020617", border: "1px solid #334155", borderRadius: "10px" }}
                itemStyle={{ fontSize: "11px", fontFamily: "sans-serif" }}
              />
              <Line type="monotone" dataKey="emissions" stroke="#10b981" strokeWidth={3} name="Forecast Output Tons" dot={{ fill: "#a7f3d0", strokeWidth: 2 }} activeDot={{ r: 6 }} isAnimationActive={true} animationDuration={1600} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

    </motion.div>
  );
}
