/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { CalculatorInputs, CalculationResult } from "../types";
import { Car, Zap, Leaf, Trash2, ArrowLeft, ArrowRight, Sparkles, Sun } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CarbonCalculatorProps {
  onCalculationComplete: (result: CalculationResult) => void;
  isLoading: boolean;
  setIsLoading: (val: boolean) => void;
}

const DEFAULT_INPUTS: CalculatorInputs = {
  carKm: 25,
  bikeKm: 5,
  publicTransport: "medium",
  flightsYear: 2,
  electricityKwh: 350,
  acHours: 4,
  renewablePct: 0,
  diet: "non-vegetarian",
  plasticLevel: "medium",
  recyclingHabits: "some",
  weeklyWasteKg: 10
};

export default function CarbonCalculator({ onCalculationComplete, isLoading, setIsLoading }: CarbonCalculatorProps) {
  const [inputs, setInputs] = useState<CalculatorInputs>(DEFAULT_INPUTS);
  const [activeStep, setActiveStep] = useState<number>(0); // 0: Transport, 1: Energy, 2: Diet, 3: Waste

  const handleInputChange = (field: keyof CalculatorInputs, value: string | number) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const steps = [
    { title: "Transportation", icon: Car, desc: "Commute distances & core aviation parameters" },
    { title: "Home Energy", icon: Zap, desc: "Thermodynamics & green grid offsets" },
    { title: "Diet habits", icon: Leaf, desc: "Agricultural intensity preferences" },
    { title: "Circular waste", icon: Trash2, desc: "Plastic consumption & recycling loops" }
  ];

  const triggerCalculate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/ai/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputs })
      });
      const data = await response.json();
      onCalculationComplete(data);
    } catch (error) {
      console.error("Calculator error response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (activeStep < 3) {
      setActiveStep(activeStep + 1);
    } else {
      triggerCalculate();
    }
  };

  const handlePrev = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  return (
    <div className="w-full rounded-3xl p-6 md:p-8 shadow-2xl glassmorphism relative overflow-hidden" id="calculator-panel">
      
      {/* 1. Header with micro specs */}
      <div className="mb-6 flex justify-center">
        <h2 className="text-2xl font-extrabold text-white">Carbon Assessment Diagnostic</h2>
      </div>

      {/* 2. Step Progress Indicators - Animate Active State */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" id="calculator-steps-list">
        {steps.map((step, idx) => {
          const StepIcon = step.icon;
          const isActive = idx === activeStep;
          const isCompleted = idx < activeStep;
          return (
            <button
              key={idx}
              onClick={() => setActiveStep(idx)}
              id={`step-indicator-${idx}`}
              className={`relative flex items-center space-x-3 text-left p-3.5 rounded-2xl border transition-all duration-300 outline-none cursor-pointer ${
                isActive 
                  ? "bg-white/10 border-white/30 text-emerald-400 shadow-lg shadow-emerald-500/5" 
                  : isCompleted 
                    ? "bg-white/5 border-white/15 text-slate-300"
                    : "bg-transparent border-white/5 text-slate-500 hover:border-white/15 hover:bg-white/2"
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-step-pill" 
                  className="absolute inset-0 border border-emerald-500/30 rounded-2xl pointer-events-none" 
                  transition={{ type: "spring" as const, stiffness: 380, damping: 30 }}
                />
              )}
              <div className={`p-2 rounded-xl transition-colors ${isActive ? "bg-emerald-500/10 text-emerald-400 animate-pulse" : "bg-black/20 text-slate-400"}`}>
                <StepIcon className="w-5 h-5" />
              </div>
              <div className="hidden sm:block z-10">
                <span className="text-[10px] block font-mono">0{idx + 1} / STEP</span>
                <span className="text-xs font-bold font-sans">{step.title}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Main Step Form Fields with Sliding Transition */}
      <div className="min-h-[290px] relative overflow-hidden" id="step-content-container">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -25 }}
            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
          >
            {/* Step 1: TRANSPORTATION */}
            {activeStep === 0 && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Car className="w-5 h-5 text-emerald-400"  aria-hidden="true" />
                  <span>Transportation Metrics</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Car travel KM/day */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm font-semibold">
                      <label htmlFor="carKm" className="text-slate-300">Car Travel Distance</label>
                      <span className="text-emerald-400 font-mono text-xs font-bold">{inputs.carKm} km/day</span>
                    </div>
                    <input
                      type="range"
                      id="carKm"
                      min="0"
                      max="150"
                      step="5"
                      value={inputs.carKm}
                      onChange={(e) => handleInputChange("carKm", Number(e.target.value))}
                    />
                  </div>

                  {/* Bike travel KM/day */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm font-semibold">
                      <label htmlFor="bikeKm" className="text-slate-300">Bicycle / Electric Scooters</label>
                      <span className="text-emerald-400 font-mono text-xs font-bold">{inputs.bikeKm} km/day</span>
                    </div>
                    <input
                      type="range"
                      id="bikeKm"
                      min="0"
                      max="50"
                      step="1"
                      value={inputs.bikeKm}
                      onChange={(e) => handleInputChange("bikeKm", Number(e.target.value))}
                    />
                  </div>

                  {/* Public Transport intensity level */}
                  <div className="space-y-2">
                    <span id="publicTransportLabel" className="text-sm font-semibold text-slate-300 block mb-1">Public Transit Integration</span>
                    <div role="group" aria-labelledby="publicTransportLabel" className="grid grid-cols-4 gap-2">
                      {[
                        { val: "none", label: "Zero Usage" },
                        { val: "low", label: "Occasional" },
                        { val: "medium", label: "Moderate" },
                        { val: "high", label: "Always" }
                      ].map((lvl) => (
                        <button
                          key={lvl.val}
                          type="button"
                          role="radio"
                          aria-checked={inputs.publicTransport === lvl.val}
                          onClick={() => handleInputChange("publicTransport", lvl.val)}
                          className={`py-3.5 rounded-xl text-xs font-bold text-center border transition-all duration-300 outline-none cursor-pointer ${
                            inputs.publicTransport === lvl.val
                              ? "bg-white/15 border-white/35 text-emerald-400 shadow-md transform scale-[1.02]"
                              : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20"
                          }`}
                        >
                          {lvl.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Flights per year */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm font-semibold">
                      <label htmlFor="flightsYear" className="text-slate-300">Aviation Journeys</label>
                      <span className="text-rose-400 font-mono text-xs font-bold">{inputs.flightsYear} flights/year</span>
                    </div>
                    <input
                      type="range"
                      id="flightsYear"
                      min="0"
                      max="15"
                      step="1"
                      value={inputs.flightsYear}
                      onChange={(e) => handleInputChange("flightsYear", Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: HOME ENERGY */}
            {activeStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-emerald-400"  aria-hidden="true" />
                  <span>Electricity & AC Thermodynamics</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Electricity consumption kwh/month */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm font-semibold">
                      <label htmlFor="electricityKwh" className="text-slate-300">Monthly Power Draw</label>
                      <span className="text-emerald-400 font-mono text-xs font-bold">{inputs.electricityKwh} kWh/month</span>
                    </div>
                    <input
                      type="range"
                      id="electricityKwh"
                      min="50"
                      max="1200"
                      step="25"
                      value={inputs.electricityKwh}
                      onChange={(e) => handleInputChange("electricityKwh", Number(e.target.value))}
                    />
                  </div>

                  {/* Air Conditioning active hours/day */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm font-semibold">
                      <label htmlFor="acHours" className="text-slate-300">Air Conditioning Intensity</label>
                      <span className="text-emerald-400 font-mono text-xs font-bold">{inputs.acHours} hours/day</span>
                    </div>
                    <input
                      type="range"
                      id="acHours"
                      min="0"
                      max="24"
                      step="1"
                      value={inputs.acHours}
                      onChange={(e) => handleInputChange("acHours", Number(e.target.value))}
                    />
                  </div>

                  {/* Renewable energy offsets % */}
                  <div className="space-y-2 md:col-span-2">
                    <div className="flex justify-between items-center text-sm font-semibold">
                      <div className="flex items-center space-x-2">
                        <Sun className="w-4 h-4 text-emerald-400"  aria-hidden="true" />
                        <label htmlFor="renewablePct" className="text-slate-300">Renewable Input Ratio</label>
                      </div>
                      <span className="text-cyan-400 font-mono text-xs font-bold">{inputs.renewablePct}% offsets</span>
                    </div>
                    <input
                      type="range"
                      id="renewablePct"
                      min="0"
                      max="100"
                      step="5"
                      value={inputs.renewablePct}
                      onChange={(e) => handleInputChange("renewablePct", Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: DIET DIETARY LOOPS */}
            {activeStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-emerald-400"  aria-hidden="true" />
                  <span>Nutrition Habits & Agrisect Intensity</span>
                </h3>

                <div role="group" aria-label="Diet Selection" className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  {[
                    {
                      id: "vegan",
                      title: "100% Plant-Based (Vegan)",
                      carbon: "Lowest Intensity (~1.0 T/yr)",
                      desc: "Zero dairy or animal consumption, fully mitigating stockyard feed processing loops."
                    },
                    {
                      id: "vegetarian",
                      title: "Dairy Lacto-Ovo (Vegetarian)",
                      carbon: "Moderate Impact (~1.5 T/yr)",
                      desc: "Methane intensity from standard dairy husbandry processes is retained."
                    },
                    {
                      id: "non-vegetarian",
                      title: "Omnivorous / Non-Vegetarian",
                      carbon: "Highest Intensity (~2.5 T/yr)",
                      desc: "High agricultural footprint including regular red meat, beef, or poultry supply lines."
                    }
                  ].map((diet) => (
                    <button
                      key={diet.id}
                      type="button"
                      role="radio"
                      aria-checked={inputs.diet === diet.id}
                      onClick={() => handleInputChange("diet", diet.id)}
                      className={`p-5 rounded-2xl border text-left flex flex-col justify-between transition-all duration-300 outline-none cursor-pointer group hover:scale-[1.03] ${
                        inputs.diet === diet.id
                          ? "bg-white/15 border-white/40 text-white shadow-lg shadow-emerald-500/5"
                          : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/15"
                      }`}
                    >
                      <div>
                        <h4 className="font-bold text-[10px] font-mono uppercase text-emerald-400 mb-1">{diet.carbon}</h4>
                        <span className="font-extrabold text-white text-base block">{diet.title}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-3 leading-relaxed transition-colors group-hover:text-slate-300">{diet.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: CIRCULAR WASTE */}
            {activeStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Trash2 className="w-5 h-5 text-emerald-400"  aria-hidden="true" />
                  <span>Circular Post-Consumer Recycling & Waste Loops</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Plastic reliance */}
                  <div className="space-y-2">
                    <span id="plasticLevelLabel" className="text-sm font-semibold text-slate-300 block mb-1">Plastic Packaging Dependency</span>
                    <div role="group" aria-labelledby="plasticLevelLabel" className="grid grid-cols-3 gap-2">
                      {[
                        { id: "low", label: "Conscious Low" },
                        { id: "medium", label: "Standard Moderate" },
                        { id: "high", label: "Heavy Disposable" }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          role="radio"
                          aria-checked={inputs.plasticLevel === item.id}
                          onClick={() => handleInputChange("plasticLevel", item.id)}
                          className={`py-3 rounded-xl text-xs font-bold text-center border transition-all duration-350 outline-none cursor-pointer ${
                            inputs.plasticLevel === item.id
                              ? "bg-white/15 border-white/35 text-emerald-400 shadow-md"
                              : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/15"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Recycling Habits */}
                  <div className="space-y-2">
                    <span id="recyclingHabitsLabel" className="text-sm font-semibold text-slate-300 block mb-1">Recycling Habits (Sorting Ratios)</span>
                    <div role="group" aria-labelledby="recyclingHabitsLabel" className="grid grid-cols-3 gap-2">
                      {[
                        { id: "none", label: "Send to Trash" },
                        { id: "some", label: "Basic Sorting" },
                        { id: "all", label: "Strict Circularity" }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          role="radio"
                          aria-checked={inputs.recyclingHabits === item.id}
                          onClick={() => handleInputChange("recyclingHabits", item.id)}
                          className={`py-3 rounded-xl text-xs font-bold text-center border transition-all duration-350 outline-none cursor-pointer ${
                            inputs.recyclingHabits === item.id
                              ? "bg-white/15 border-white/35 text-emerald-400 shadow-md"
                              : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/15"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Weekly waste generation kg */}
                  <div className="space-y-2 md:col-span-2">
                    <div className="flex justify-between items-center text-sm font-semibold">
                      <label htmlFor="weeklyWasteKg" className="text-slate-300">Weekly Household Solid Refuse</label>
                      <span className="text-emerald-400 font-mono text-xs font-bold">{inputs.weeklyWasteKg} kg/week</span>
                    </div>
                    <input
                      type="range"
                      id="weeklyWasteKg"
                      min="1"
                      max="40"
                      step="1"
                      value={inputs.weeklyWasteKg}
                      onChange={(e) => handleInputChange("weeklyWasteKg", Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 4. Controls/Navigation Footer */}
      <div className="mt-10 border-t border-white/10 pt-6 flex justify-between items-center">
        
        <button
          onClick={handlePrev}
          disabled={activeStep === 0 || isLoading}
          className={`px-5 py-2.5 rounded-xl border text-xs font-bold flex items-center space-x-2 transition-all duration-300 outline-none cursor-pointer ${
            activeStep === 0 
              ? "border-white/5 text-slate-600 cursor-not-allowed opacity-30" 
              : "border-white/10 text-slate-300 bg-white/5 hover:bg-white/10"
          }`}
        >
          <ArrowLeft className="w-4 h-4"  aria-hidden="true" />
          <span>Previous Step</span>
        </button>

        <button
          onClick={handleNext}
          disabled={isLoading}
          className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold rounded-xl hover:brightness-110 active:scale-95 transition-all text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/10"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
              <span>Analyzing Emissions...</span>
            </>
          ) : activeStep === 3 ? (
            <>
              <Sparkles className="w-4 h-4 text-slate-950 animate-bounce"  aria-hidden="true" />
              <span>Calculate Carbon Profile</span>
            </>
          ) : (
            <>
              <span>Next Parameter</span>
              <ArrowRight className="w-4 h-4 text-slate-950"  aria-hidden="true" />
            </>
          )}
        </button>

      </div>

    </div>
  );
}
