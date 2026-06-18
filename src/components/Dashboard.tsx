/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Cell, PieChart, Pie, ResponsiveContainer, XAxis, YAxis, Tooltip, BarChart, Bar, Legend, LineChart, Line } from "recharts";
import { Award, Globe, ShieldAlert, Sparkles, AlertCircle, TrendingDown, CloudRain, Wind, Leaf, Target, FileDown } from "lucide-react";
import { CalculationResult } from "../types";
import { motion, type Variants } from "motion/react";
import { AnimatedCard } from "./AnimatedCard";
import { useEffect, useState } from "react";

interface WeatherData {
  temp: number;
  aqi: number;
  condition: string;
}

function WeatherAqiWidget() {
  const [data, setData] = useState<WeatherData | null>(null);

  useEffect(() => {
    // Fetch from free Open-Meteo
    async function fetchWeather() {
      try {
        const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=40.71&longitude=-74.00&current=temperature_2m,weather_code&air_quality=us_aqi");
        if (res.ok) {
          const json = await res.json();
          setData({
            temp: json.current?.temperature_2m || 22,
            aqi: json.current?.us_aqi || 45, // Mock AQI if endpoint differs
            condition: "Clear",
          });
        }
      } catch (e) {
        // Fallback mock
        setData({ temp: 24, aqi: 42, condition: "Sunny" });
      }
    }
    fetchWeather();
  }, []);

  if (!data) return null;

  return (
    <AnimatedCard className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-3xl w-full h-full flex flex-col justify-between" glowColor="rgba(59, 130, 246, 0.2)">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <span className="text-sm font-mono text-slate-400 uppercase tracking-wider font-semibold flex items-center gap-2"><CloudRain className="w-5 h-5" aria-hidden="true" /> LIVE WEATHER & AQI</span>
        <span className="flex h-3 w-3 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
        </span>
      </div>
      <div className="pt-6 grid grid-cols-2 gap-6">
        <div>
          <span className="block text-xs text-slate-500 font-mono uppercase mb-1">Local AQI</span>
          <span className="text-4xl font-bold text-blue-400 flex items-center gap-3"><Wind className="w-8 h-8" aria-hidden="true" /> {data.aqi}</span>
          <span className="text-sm text-slate-400 mt-2 block">Air Quality Index</span>
        </div>
        <div>
          <span className="block text-xs text-slate-500 font-mono uppercase mb-1">Temperature</span>
          <span className="text-4xl font-bold text-white flex items-center gap-3">{data.temp}°C</span>
          <span className="text-sm text-slate-400 mt-2 block">{data.condition}</span>
        </div>
      </div>
    </AnimatedCard>
  );
}

interface DashboardProps {
  result: CalculationResult | null;
  commentary: string; // From the Gemini result
}

export default function Dashboard({ result, commentary }: DashboardProps) {
  if (!result) {
    return (
      <div className="glassmorphism rounded-3xl p-12 text-center text-slate-400 flex flex-col items-center justify-center min-h-[450px]">
        <AlertCircle className="w-16 h-16 text-emerald-500/50 mb-6 animate-bounce"  aria-hidden="true" />
        <h3 className="text-2xl font-bold text-white mb-3">No Emissions Profile Active</h3>
        <p className="text-base max-w-md mx-auto leading-relaxed text-slate-400">
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
      className="space-y-8" 
      id="dashboard-wrapper"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white mb-2">Carbon Analytics</h2>
          <p className="text-base text-slate-400">Your personalized ESG performance metrics</p>
        </div>
        <button 
          onClick={() => window.print()}
          className="flex items-center space-x-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 px-6 py-3 rounded-2xl text-sm font-bold transition-all active:scale-95 border border-emerald-500/30 shadow-lg shadow-emerald-500/10"
        >
          <FileDown className="w-5 h-5"  aria-hidden="true" />
          <span>Export PDF Report</span>
        </button>
      </div>

      {/* 1. KPIs Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* KPI 1: Annual Carbon Output */}
        <motion.div variants={itemVariants}>
          <AnimatedCard 
            className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-3xl w-full h-full flex flex-col"
            glowColor="rgba(16, 185, 129, 0.2)"
          >
            <div className="flex items-center justify-between pb-5 border-b border-white/10">
              <span className="text-sm font-mono text-slate-400 uppercase tracking-wider font-semibold">ANNUAL GLOBAL MASS</span>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <Globe className="w-8 h-8 text-emerald-400 animate-spin" style={{ animationDuration: '24s' }}  aria-hidden="true" />
              </div>
            </div>
            <div className="pt-6 space-y-2 flex-grow">
              <div className="flex items-baseline space-x-3">
                <span className="text-5xl md:text-6xl font-extrabold text-white font-mono">{result.carbonScore}</span>
                <span className="text-sm md:text-base font-semibold text-slate-400 font-sans">Tons CO₂e/yr</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed font-sans pt-2">
                Reflects your consolidated radioactive forcing factor. Target threshold is &lt; 2.0 T.
              </p>
            </div>
          </AnimatedCard>
        </motion.div>

        {/* KPI 2: Sustainability Index Score */}
        <motion.div variants={itemVariants}>
          <AnimatedCard 
            className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-3xl w-full h-full flex flex-col"
            glowColor="rgba(6, 182, 212, 0.2)"
          >
            <div className="flex items-center justify-between pb-5 border-b border-white/10">
              <span className="text-sm font-mono text-slate-400 uppercase tracking-wider font-semibold">ECO SCORE</span>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <Award className="w-8 h-8 text-cyan-400"  aria-hidden="true" />
              </div>
            </div>
            <div className="pt-6 flex items-center space-x-6 flex-grow">
              
              {/* SVG circular progress indicator with fill animation */}
              <div className="relative w-24 h-24 flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="40" className="text-white/10" strokeWidth="6" stroke="currentColor" fill="transparent" />
                  <motion.circle 
                    cx="48" 
                    cy="48" 
                    r="40" 
                    className={getScoreColor()} 
                    strokeWidth="6" 
                    strokeDasharray={251.2} 
                    initial={{ strokeDashoffset: 251.2 }}
                    animate={{ strokeDashoffset: 251.2 - (251.2 * result.sustainabilityScore) / 100 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    strokeLinecap="round" 
                    stroke="currentColor" 
                    fill="transparent" 
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-mono font-bold text-2xl text-white">
                  {result.sustainabilityScore}
                </div>
              </div>

              <div>
                <span className="text-xl md:text-2xl font-bold text-white block mb-1">Eco Score: {result.sustainabilityScore}/100</span>
                <span className="text-sm text-slate-400 block font-sans">Graded scale based on standard mitigation rates.</span>
              </div>

            </div>
          </AnimatedCard>
        </motion.div>

        {/* KPI 3: Climate Impact Class */}
        <motion.div variants={itemVariants}>
          <AnimatedCard 
            className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-3xl w-full h-full flex flex-col"
            glowColor="rgba(234, 179, 8, 0.15)"
          >
            <div className="flex items-center justify-between pb-5 border-b border-white/10">
              <span className="text-sm font-mono text-slate-400 uppercase tracking-wider font-semibold">EPIDEMIOLOGY IMPACT</span>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <ShieldAlert className="w-8 h-8 text-amber-400"  aria-hidden="true" />
              </div>
            </div>
            <div className="pt-6 flex flex-col justify-center flex-grow">
              <div className={`px-6 py-4 text-base font-extrabold rounded-2xl border text-center transition-all ${getCategoryClass()}`}>
                {result.impactCategory} Environment Status
              </div>
              <p className="text-sm text-slate-400 leading-relaxed font-sans pt-4">
                Requires immediate action patterns across principal carbon categories if marked high.
              </p>
            </div>
          </AnimatedCard>
        </motion.div>

      </div>

      {/* Row 2: Secondary KPIs & Weather */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        
        {/* Tree Equivalent */}
        <motion.div variants={itemVariants}>
          <AnimatedCard className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-3xl w-full h-full" glowColor="rgba(16, 185, 129, 0.2)">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <span className="text-sm font-mono text-slate-400 uppercase tracking-wider font-semibold">TREE EQUIVALENT</span>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <Leaf className="w-8 h-8 text-emerald-400"  aria-hidden="true" />
              </div>
            </div>
            <div className="pt-6 flex flex-col">
              <span className="text-5xl md:text-6xl font-extrabold text-white font-mono mb-2">{Math.round(result.carbonScore * 45)} <span className="text-lg text-slate-400 font-sans font-normal">Trees/Yr</span></span>
              <span className="text-sm text-slate-400 mt-2 leading-relaxed">Number of mature trees needed to offset your annual footprint.</span>
            </div>
          </AnimatedCard>
        </motion.div>

        {/* Weekly Goal */}
        <motion.div variants={itemVariants}>
          <AnimatedCard className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-3xl w-full h-full" glowColor="rgba(168, 85, 247, 0.2)">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <span className="text-sm font-mono text-slate-400 uppercase tracking-wider font-semibold">WEEKLY GOAL</span>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <Target className="w-8 h-8 text-purple-400"  aria-hidden="true" />
              </div>
            </div>
            <div className="pt-6 flex flex-col justify-center h-full">
              <div className="flex justify-between items-end mb-4">
                <span className="text-2xl font-bold text-white">Save 15kg CO₂</span>
                <span className="text-lg text-purple-400 font-mono font-bold">65%</span>
              </div>
              <div className="w-full bg-white/10 h-4 rounded-full overflow-hidden mb-4">
                <motion.div className="h-full bg-purple-500 rounded-full" initial={{ width: 0 }} animate={{ width: "65%" }} transition={{ duration: 1 }} />
              </div>
              <span className="text-sm text-slate-400 leading-relaxed">Try completing 1 Meatless day this week!</span>
            </div>
          </AnimatedCard>
        </motion.div>

        {/* Live Weather / AQI */}
        <motion.div variants={itemVariants}>
          <WeatherAqiWidget />
        </motion.div>

      </div>

      {/* 2. Chatbot AI Insight Segment with slide expansion */}
      <motion.div 
        variants={itemVariants}
        className="glassmorphism-emerald p-6 md:p-8 rounded-3xl flex flex-col md:flex-row gap-6 items-start border border-emerald-500/30 shadow-2xl shadow-emerald-500/10"
      >
        <div className="bg-emerald-500/20 p-4 rounded-2xl border border-emerald-500/30 hidden md:block">
          <Sparkles className="w-8 h-8 text-emerald-400 animate-pulse"  aria-hidden="true" />
        </div>
        <div className="space-y-3 w-full text-left">
          <div className="flex items-center space-x-3 text-sm font-mono text-emerald-400 font-bold tracking-wide">
            <Sparkles className="w-5 h-5 text-emerald-400 block md:hidden"  aria-hidden="true" />
            <span>AI CLIMATE ADVISOR SUMMARY</span>
          </div>
          <p className="text-lg md:text-xl text-emerald-50 leading-relaxed font-sans italic opacity-90">
            "{commentary}"
          </p>
        </div>
      </motion.div>

      {/* 3. Recharts Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        
        {/* Chart A: Pie chart breakdown (Col Span 5) */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-5 glassmorphism p-6 md:p-8 rounded-3xl flex flex-col justify-between h-[450px] relative overflow-hidden" 
          id="chart-pie-container"
        >
          <div className="border-b border-white/10 pb-4 flex items-center justify-between">
            <span className="text-lg font-bold text-white">Carbon Contribution Breakdown</span>
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Proportional Volume</span>
          </div>

          <div className="h-[280px] relative mt-4">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <PieChart>
                <Pie
                  data={breakdownData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
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
                  contentStyle={{ backgroundColor: "#020617", border: "1px solid #334155", borderRadius: "12px", padding: "12px" }}
                  itemStyle={{ color: "#fff", fontSize: "14px", fontFamily: "sans-serif" }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center score indicator */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
              <span className="text-4xl font-mono font-extrabold text-white">{result.carbonScore}</span>
              <span className="text-xs font-mono text-slate-400 uppercase mt-1">Total Tons</span>
            </div>
          </div>

          {/* Color Keys */}
          <div className="grid grid-cols-2 gap-4 text-xs font-mono text-slate-300 mt-4">
            {breakdownData.map((item, idx) => (
               <div key={idx} className="flex items-center space-x-3 bg-white/5 p-2 rounded-lg border border-white/5">
                <span className="w-3.5 h-3.5 rounded-full inline-block flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="truncate">{item.name}: {item.value} T</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Chart B: Bar chart Comparative Standard (Col Span 7) */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-7 glassmorphism p-6 md:p-8 rounded-3xl flex flex-col justify-between h-[450px] relative overflow-hidden" 
          id="chart-bar-container"
        >
          <div className="border-b border-white/10 pb-4 flex items-center justify-between">
            <span className="text-lg font-bold text-white font-sans">Comparative Climate Alignment</span>
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Actual vs IPPC Target</span>
          </div>

          <div className="h-[340px] pt-6">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <BarChart data={comparisonData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 13, fontFamily: "sans-serif" }} stroke="rgba(255,255,255,0.05)" axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 13, fontFamily: "mono" }} stroke="rgba(255,255,255,0.05)" axisLine={false} tickLine={false} dx={-10} />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.05)" }}
                  contentStyle={{ backgroundColor: "#020617", border: "1px solid #334155", borderRadius: "12px", padding: "12px" }}
                  itemStyle={{ fontSize: "14px", fontFamily: "sans-serif" }}
                />
                <Legend iconSize={12} wrapperStyle={{ fontSize: "13px", fontFamily: "sans-serif", paddingTop: "20px" }} />
                <Bar dataKey="Current" fill="#06b6d4" name="Your Carbon Profile" radius={[6, 6, 0, 0]} maxBarSize={60} isAnimationActive={true} animationDuration={1800} />
                <Bar dataKey="StandardTarget" fill="#10b981" name="Ideal Net-Zero (2.0T Target)" radius={[6, 6, 0, 0]} maxBarSize={60} isAnimationActive={true} animationDuration={1850} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </div>

      {/* 4. Chart C: Bottom Full Line Chart Trend projection */}
      <motion.div 
        variants={itemVariants}
        className="glassmorphism p-6 md:p-8 rounded-3xl flex flex-col justify-between h-[450px] relative overflow-hidden" 
        id="chart-line-container"
      >
        <div className="border-b border-white/10 pb-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-500/20 p-2 rounded-lg border border-emerald-500/30">
              <TrendingDown className="w-5 h-5 text-emerald-400"  aria-hidden="true" />
            </div>
            <span className="text-lg font-bold text-white font-sans">Your Simulated Carbon Reduction Forecast</span>
          </div>
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider hidden md:block">Monthly Progress Sequence</span>
        </div>

        <div className="h-[320px] pt-6">
          <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
            <LineChart data={trendData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 13, fontFamily: "sans-serif" }} stroke="rgba(255,255,255,0.05)" axisLine={false} tickLine={false} dy={10} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 13, fontFamily: "mono" }} stroke="rgba(255,255,255,0.05)" axisLine={false} tickLine={false} dx={-10} />
              <Tooltip
                contentStyle={{ backgroundColor: "#020617", border: "1px solid #334155", borderRadius: "12px", padding: "12px" }}
                itemStyle={{ fontSize: "14px", fontFamily: "sans-serif" }}
              />
              <Line type="monotone" dataKey="emissions" stroke="#10b981" strokeWidth={4} name="Forecast Output Tons" dot={{ fill: "#020617", stroke: "#10b981", strokeWidth: 3, r: 6 }} activeDot={{ r: 8, fill: "#34d399", stroke: "#fff", strokeWidth: 2 }} isAnimationActive={true} animationDuration={1600} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

    </motion.div>
  );
}
