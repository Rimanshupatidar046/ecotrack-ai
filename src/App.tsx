/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Leaf, Globe, Sparkles, Bot, LogOut, Award, BarChart3, Compass, Milestone, LayoutDashboard, FileText, ChevronRight, Check } from "lucide-react";
import LandingPage from "./components/LandingPage";
import CarbonCalculator from "./components/CarbonCalculator";
import Dashboard from "./components/Dashboard";
import Recommendations from "./components/Recommendations";
import Gamification from "./components/Gamification";
import Roadmap from "./components/Roadmap";
import AiAssistant from "./components/AiAssistant";
import ReportExport from "./components/ReportExport";
import WeeklyTips from "./components/WeeklyTips";
import { EcoChallenge, AchievementBadge, RoadmapMilestone, CalculationResult } from "./types";

// Setup interactive initial mockup databases
const INITIAL_CHALLENGES: EcoChallenge[] = [
  { id: "ch_1", title: "Green Ride Commute", description: "Swap your solo car trip for a cycle, scooter, or bus commute.", category: "transport", points: 25, completed: false, type: "daily" },
  { id: "ch_2", title: "Thermodynamic Warden", description: "Set your domestic climate thermostat to 24°C or above for the day.", category: "energy", points: 15, completed: false, type: "daily" },
  { id: "ch_3", title: "Circularity Sorting", description: "Meticulously sort all plastic, metal, and compost kitchen refuse.", category: "waste", points: 20, completed: false, type: "weekly" },
  { id: "ch_4", title: "Agrarian Plant-Biased Day", description: "Take fully vegetarian or vegan breakfast, lunch, and dinner.", category: "food", points: 20, completed: false, type: "weekly" }
];

const INITIAL_BADGES: AchievementBadge[] = [
  { id: "b_1", name: "Green Commuter", description: "Complete a Green Ride Commute challenge", icon: "Bike", unlocked: false },
  { id: "b_2", name: "Zero Waste Vanguard", description: "Sort household refuse bins completely", icon: "Trash", unlocked: false },
  { id: "b_3", name: "Thermic Specialist", description: "Lock domestic AC offsets for 2+ targets", icon: "Zap", unlocked: false },
  { id: "b_4", name: "Ecology Champion", description: "Unlock sustainability score over 80", icon: "Award", unlocked: false }
];

const INITIAL_MILESTONES: RoadmapMilestone[] = [
  { id: "m_1", title: "Transition washing cycles to cold laundry water", timeframe: "Short-term", targetDate: "Q3 2026", description: "Drives down electricity heater coil consumption dramatically.", achieved: false, savingsKg: 120 },
  { id: "m_2", title: "Deploy advanced smart thermostats in HVAC outlets", timeframe: "Short-term", targetDate: "Q3 2026", description: "Dampens useless idle thermodynamic load.", achieved: false, savingsKg: 200 },
  { id: "m_3", title: "Exchange household bulbs to energy-saver LED grids", timeframe: "Mid-term", targetDate: "Q4 2026", description: "Improves overall light wattage efficiencies by 80%.", achieved: false, savingsKg: 350 },
  { id: "m_4", title: "Transition weekly commutes to public transit network", timeframe: "Mid-term", targetDate: "Q4 2026", description: "Reduces point-source solo combustion exhaust rates.", achieved: false, savingsKg: 800 },
  { id: "m_5", title: "Deploy central roof micro-solar PV array system", timeframe: "Long-term", targetDate: "Q2 2027", description: "Provides grid offsets for carbon-negative baseline levels.", achieved: false, savingsKg: 1800 }
];

export default function App() {
  const [activeView, setActiveView] = useState<"landing" | "app">("landing");
  const [activeTab, setActiveTab] = useState<"dashboard" | "calculator" | "recommendations" | "gamification" | "roadmap" | "assistant" | "report">("calculator");
  
  // App wide states
  const [scoreResult, setScoreResult] = useState<CalculationResult | null>(null);
  const [calculatorTaken, setCalculatorTaken] = useState(false);
  const [committedIds, setCommittedIds] = useState<string[]>([]);
  const [userPoints, setUserPoints] = useState(0);
  const [xpPoints, setXpPoints] = useState(20); // starts with initial sign-on award
  const [challenges, setChallenges] = useState<EcoChallenge[]>(INITIAL_CHALLENGES);
  const [badges, setBadges] = useState<AchievementBadge[]>(INITIAL_BADGES);
  const [milestones, setMilestones] = useState<RoadmapMilestone[]>(INITIAL_MILESTONES);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-unlock standard badges on state parameters changes
  useEffect(() => {
    if (scoreResult && scoreResult.sustainabilityScore >= 80) {
      setBadges(prev => prev.map(b => b.id === "b_4" ? { ...b, unlocked: true } : b));
    }
  }, [scoreResult]);

  // Handle calculator results response
  const handleCalculationComplete = (data: any) => {
    setScoreResult({
      carbonScore: data.carbonScore,
      sustainabilityScore: data.sustainabilityScore,
      impactCategory: data.impactCategory,
      breakdown: data.breakdown,
      recommendations: data.recommendations
    });
    setCalculatorTaken(true);
    setActiveTab("dashboard");
    // Award standard calculator XP
    setXpPoints(prev => prev + 45);
  };

  // Commit target priorities to active roadmap goals
  const handleCommitRecommendation = (id: string, co2: number, savings: number) => {
    if (!committedIds.includes(id)) {
      setCommittedIds((prev) => [...prev, id]);
      setUserPoints((prev) => prev + 50);
      setXpPoints((prev) => prev + 20);
      
      // Inject standard custom roadmap milestone dynamically based on commitment
      const recItem = scoreResult?.recommendations.find(r => r.id === id);
      if (recItem) {
        const newMilestone: RoadmapMilestone = {
          id: `m_dyn_${id}`,
          title: `Implement Committed: ${recItem.title}`,
          timeframe: recItem.difficulty === "Easy" ? "Short-term" : recItem.difficulty === "Medium" ? "Mid-term" : "Long-term",
          targetDate: "Dynamic Target",
          description: recItem.description,
          achieved: false,
          savingsKg: recItem.co2Reduction
        };
        setMilestones(prev => [newMilestone, ...prev]);
      }
    }
  };

  // Complete eco-challenges & claims XP
  const handleCompleteChallenge = (id: string, pts: number) => {
    setChallenges(prev => prev.map(c => c.id === id ? { ...c, completed: true } : c));
    setUserPoints(prev => prev + pts);
    setXpPoints(prev => prev + pts);

    // Associated badge unlock checks
    if (id === "ch_1") {
      setBadges(prev => prev.map(b => b.id === "b_1" ? { ...b, unlocked: true } : b));
    } else if (id === "ch_3") {
      setBadges(prev => prev.map(b => b.id === "b_2" ? { ...b, unlocked: true } : b));
    } else if (id === "ch_2") {
      setBadges(prev => prev.map(b => b.id === "b_3" ? { ...b, unlocked: true } : b));
    }
  };

  // Toggle checklist milestones status in timeline
  const handleToggleMilestone = (id: string) => {
    setMilestones(prev => prev.map(m => {
      if (m.id === id) {
        const nextState = !m.achieved;
        if (nextState) {
          setUserPoints(curr => curr + 40);
          setXpPoints(curr => curr + 15);
        }
        return { ...m, achieved: nextState };
      }
      return m;
    }));
  };
  return (
    <div className="w-full min-h-screen text-[#E0E7FF] bg-[#050A0E] flex flex-col font-sans select-text scroll-smooth relative overflow-hidden" id="app-viewport">
      
      {/* Ambient Background Orbs */}
      <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-[#10B981] opacity-[0.08] rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[600px] h-[600px] bg-[#3B82F6] opacity-[0.08] rounded-full blur-[150px] pointer-events-none z-0"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-[#064E3B] to-[#1E3A8A] opacity-[0.04] rounded-full blur-[100px] pointer-events-none z-0"></div>

      {/* 1. Master Header Navbar (Shared) */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-white/5 backdrop-blur-md transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setActiveView("landing")} role="button" aria-label="Go to EcoTrack AI Homepage" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setActiveView("landing")}>
            <div className="w-10 h-10 bg-gradient-to-br from-[#10B981] to-[#3B82F6] rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
              <Leaf className="w-5.5 h-5.5 text-white" strokeWidth={2.5} aria-hidden="true" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-400">EcoTrack AI</span>
              <span className="text-[9px] block font-mono text-slate-400 leading-none tracking-wider uppercase">Carbon Metric Engine</span>
            </div>
          </div>

          <nav aria-label="Main Navigation" className="flex items-center space-x-3">
            <button
              onClick={() => setActiveView("landing")}
              id="top-nav-landing-toggle"
              aria-current={activeView === "landing" ? "page" : undefined}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-200 ${
                activeView === "landing"
                  ? "bg-white/10 border border-white/20 text-[#10B981]"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              Platform Home
            </button>

            <button
              onClick={() => {
                setActiveView("app");
                if (scoreResult) setActiveTab("dashboard");
              }}
              id="top-nav-workspace-toggle"
              aria-current={activeView === "app" ? "page" : undefined}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-200 flex items-center space-x-1.5 ${
                activeView === "app"
                  ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
                  : "bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10"
              }`}
            >
              <span>Explore Workspace</span>
              <ChevronRight className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
            </button>

            {/* Glassmorphic Points Pill */}
            <div className="px-3.5 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-semibold text-emerald-400 backdrop-blur-sm shadow-md flex items-center gap-1.5">
              <span>{userPoints} pts</span>
            </div>
          </nav>

        </div>
      </header>

      {/* 2. Main Page Render Route */}
      <main id="main-content" className="flex-1 relative z-10">
        {activeView === "landing" ? (
          <LandingPage 
            onStartCalculator={() => {
              setActiveView("app");
              setActiveTab("calculator");
            }}
            onExploreDashboard={() => {
              setActiveView("app");
              if (scoreResult) {
                setActiveTab("dashboard");
              } else {
                setActiveTab("calculator");
              }
            }}
            calculatorTaken={calculatorTaken}
          />
        ) : (
          /* Premium Full-Stack Application Interface Workspace */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8" id="sustainability-workspace-root">
            <h1 className="sr-only">EcoTrack AI Workspace</h1>
            
            {/* Left Nav menu Column (Col Span 3) */}
            <aside aria-label="Workspace Navigation" className="lg:col-span-3 flex flex-col space-y-4" id="workspace-sidebar">
              
              <nav aria-label="Workspace Tools" className="rounded-2xl p-4 space-y-1.5 glassmorphism shadow-xl">
                <h2 className="text-[10px] text-slate-400 font-mono tracking-widest block mb-2 px-2 uppercase m-0">Diagnostic Workspace</h2>
                
                <button
                  onClick={() => setActiveTab("calculator")}
                  id="tab-btn-calculator"
                  aria-current={activeTab === "calculator" ? "page" : undefined}
                  className={`w-full p-2.5 rounded-xl text-xs font-bold text-left flex items-center space-x-2.5 transition-all outline-none ${
                    activeTab === "calculator"
                      ? "bg-white/10 text-emerald-400 border border-white/20 shadow-md"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Globe className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                  <span>Carbon Assessment</span>
                </button>

                <button
                  onClick={() => scoreResult && setActiveTab("dashboard")}
                  disabled={!scoreResult}
                  id="tab-btn-dashboard"
                  aria-current={activeTab === "dashboard" ? "page" : undefined}
                  className={`w-full p-2.5 rounded-xl text-xs font-bold text-left flex items-center justify-between transition-all outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                    !scoreResult 
                      ? "opacity-30 cursor-not-allowed text-slate-600"
                      : activeTab === "dashboard"
                        ? "bg-white/10 text-emerald-400 border border-white/20 shadow-md"
                        : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className="flex items-center space-x-2.5">
                    <BarChart3 className="w-4 h-4" aria-hidden="true" />
                    <span>Analytics Dashboard</span>
                  </span>
                  {scoreResult && <Check className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />}
                </button>

                <button
                  onClick={() => scoreResult && setActiveTab("recommendations")}
                  disabled={!scoreResult}
                  id="tab-btn-recommendations"
                  aria-current={activeTab === "recommendations" ? "page" : undefined}
                  className={`w-full p-2.5 rounded-xl text-xs font-bold text-left flex items-center justify-between transition-all outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                    !scoreResult 
                      ? "opacity-30 cursor-not-allowed text-slate-600"
                      : activeTab === "recommendations"
                        ? "bg-white/10 text-emerald-400 border border-white/20 shadow-md"
                        : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className="flex items-center space-x-2.5">
                    <Compass className="w-4 h-4" aria-hidden="true" />
                    <span>Commit Solutions</span>
                  </span>
                  {committedIds.length > 0 && (
                    <span className="bg-emerald-500/20 text-emerald-400 font-mono text-[9px] px-1.5 py-0.5 rounded border border-emerald-500/30">
                      {committedIds.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab("gamification")}
                  id="tab-btn-gamification"
                  aria-current={activeTab === "gamification" ? "page" : undefined}
                  className={`w-full p-2.5 rounded-xl text-xs font-bold text-left flex items-center justify-between transition-all outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                    activeTab === "gamification"
                      ? "bg-white/10 text-emerald-400 border border-white/20 shadow-md"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className="flex items-center space-x-2.5">
                    <Award className="w-4 h-4" aria-hidden="true" />
                    <span>Eco Missions</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    {userPoints} pts
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("roadmap")}
                  id="tab-btn-roadmap"
                  aria-current={activeTab === "roadmap" ? "page" : undefined}
                  className={`w-full p-2.5 rounded-xl text-xs font-bold text-left flex items-center justify-between transition-all outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                    activeTab === "roadmap"
                      ? "bg-white/10 text-emerald-400 border border-white/20 shadow-md"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className="flex items-center space-x-2.5">
                    <Milestone className="w-4 h-4" aria-hidden="true" />
                    <span>Reduction Roadmap</span>
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("assistant")}
                  id="tab-btn-assistant"
                  aria-current={activeTab === "assistant" ? "page" : undefined}
                  className={`w-full p-2.5 rounded-xl text-xs font-bold text-left flex items-center justify-between transition-all outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                    activeTab === "assistant"
                      ? "bg-white/10 text-emerald-400 border border-white/20 shadow-md"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className="flex items-center space-x-2.5">
                    <Bot className="w-4 h-4" aria-hidden="true" />
                    <span>AI Chatbot Assistant</span>
                  </span>
                </button>

                <button
                  onClick={() => scoreResult && setActiveTab("report")}
                  disabled={!scoreResult}
                  id="tab-btn-report"
                  aria-current={activeTab === "report" ? "page" : undefined}
                  className={`w-full p-2.5 rounded-xl text-xs font-bold text-left flex items-center justify-between transition-all outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                    !scoreResult 
                      ? "opacity-30 cursor-not-allowed text-slate-600"
                      : activeTab === "report"
                        ? "bg-white/10 text-emerald-400 border border-white/20 shadow-md"
                        : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className="flex items-center space-x-2.5">
                    <FileText className="w-4 h-4" aria-hidden="true" />
                    <span>Download ESG Reports</span>
                  </span>
                </button>

              </nav>

              {/* Weekly tips carousel widget */}
              <WeeklyTips />

            </aside>

            {/* Right workspace Viewport Workspace (Col Span 9) */}
            <div className="lg:col-span-9" id="workspace-viewport">
              <h2 className="sr-only">Active Workspace Tool</h2>
              {activeTab === "calculator" && (
                <CarbonCalculator 
                  onCalculationComplete={handleCalculationComplete}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
              )}

              {activeTab === "dashboard" && scoreResult && (
                <Dashboard 
                  result={scoreResult} 
                  commentary={scoreResult.recommendations ? (scoreResult as any).commentary || "Diagnostics completed." : ""}
                />
              )}

              {activeTab === "recommendations" && scoreResult && (
                <Recommendations 
                  recommendations={scoreResult.recommendations}
                  onCommitRecommendation={handleCommitRecommendation}
                  committedIds={committedIds}
                />
              )}

              {activeTab === "gamification" && (
                <Gamification 
                  challenges={challenges}
                  badges={badges}
                  userPoints={userPoints}
                  xpPoints={xpPoints}
                  onCompleteChallenge={handleCompleteChallenge}
                />
              )}

              {activeTab === "roadmap" && (
                <Roadmap 
                  milestones={milestones}
                  onToggleMilestone={handleToggleMilestone}
                />
              )}

              {activeTab === "assistant" && (
                <AiAssistant scoreResult={scoreResult} />
              )}

              {activeTab === "report" && scoreResult && (
                <ReportExport scoreResult={scoreResult} />
              )}
            </div>

          </div>
        )}
      </main>

    </div>
  );
}
