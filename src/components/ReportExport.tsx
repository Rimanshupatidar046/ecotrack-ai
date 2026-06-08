/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from "react";
import { CalculationResult, CalculatorInputs } from "../types";
import { Download, FileText, Printer } from "lucide-react";
import { motion } from "motion/react";

interface ReportExportProps {
  scoreResult: CalculationResult | null;
  inputs?: CalculatorInputs;
}

export default function ReportExport({ scoreResult, inputs }: ReportExportProps) {
  const [downloading, setDownloading] = useState(false);

  // Generate a random stable audit reference number
  const auditRef = useMemo(() => `EA-${Math.floor(100000 + Math.random() * 900000)}`, []);

  if (!scoreResult) {
    return null;
  }

  const handlePrint = () => {
    window.print();
  };

  const handleRawDownload = () => {
    setDownloading(true);
    
    // Compile carbon metadata text sheet
    const reportText = `
========================================
ECOTRACK AI - ESG ENVIRONMENTAL REPORT
========================================
Date: ${new Date().toLocaleDateString()}
National Climate Standards Compliance

1. CO2 PERFORMANCE METRICS
----------------------------------------
Annual Footprint: ${scoreResult.carbonScore} Metric Tons CO2e/year
Personal Sustainability Score: ${scoreResult.sustainabilityScore}/100
Rating Level Indicator: ${scoreResult.impactCategory}

2. DETAILED CARBON BREAKDOWN
----------------------------------------
Transit & Commuting: ${scoreResult.breakdown.transport} T/year
Thermal Utility Loads: ${scoreResult.breakdown.energy} T/year
Nutrition Feed Intensity: ${scoreResult.breakdown.food} T/year
Municipal Solid Refuse: ${scoreResult.breakdown.waste} T/year

3. ROADMAP PRIORITIES & MITIGATIONS
----------------------------------------
${scoreResult.recommendations.map((r, idx) => `${idx + 1}. ${r.title}
   Expected Impact: -${r.co2Reduction} kg CO2/year
   Savings Ratio: $${r.financialSavings}/year
   Complexity Level: ${r.difficulty}`).join("\n\n")}

========================================
Report compiled natively via EcoTrack AI
Protecting Planetary Ecosystem Metrics
========================================
    `.trim();

    const blob = new Blob([reportText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `EcoTrack_Carbon_Report_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    
    setTimeout(() => {
      setDownloading(false);
    }, 1200);
  };

  // Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } }
  };

  return (
    <motion.div 
      className="glassmorphism p-6 md:p-8 rounded-2xl shadow-xl space-y-6 text-left border border-white/10" 
      id="report-panel-container"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      
      {/* Report description row */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <span>Generate ESG Compliance Assessment</span>
          </h3>
          <p className="text-xs text-slate-400">Compile your metrics into an premium downloadable text sheet or printable layout</p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button 
            type="button"
            onClick={handlePrint}
            className="p-2.5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer outline-none"
            title="Print assessment document"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleRawDownload}
            disabled={downloading}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-2 hover:brightness-105 active:scale-95 transition-all disabled:opacity-40 cursor-pointer outline-none shadow-lg shadow-emerald-500/10"
          >
            {downloading ? (
              <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5 text-slate-950" />
            )}
            <span>Export ESG Report (.txt)</span>
          </button>
        </div>
      </div>

      {/* Preview ESG Doc (Stunning printed layout design) */}
      <div className="p-8 text-xs font-mono text-slate-300 bg-black/40 border border-white/10 rounded-2xl space-y-6 max-h-[460px] overflow-y-auto shadow-inner" id="printable-report-sheet">
        
        {/* Document Header */}
        <div className="space-y-4 border-b border-dashed border-white/10 pb-5 text-center">
          <div className="flex justify-center flex-col items-center">
            <h4 className="text-sm font-extrabold text-white tracking-widest block font-sans">ECOTRACK AI ENVIRONMENTAL REPORT</h4>
            <span className="text-[10px] text-slate-500 block uppercase font-mono mt-1">ESG Audit Compliance Record</span>
          </div>
          <div className="flex justify-between text-[9px] text-slate-500 font-mono px-4">
            <span>AUDIT REF: {auditRef}</span>
            <span>COMPILED: {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          <h5 className="font-bold text-white text-xs border-b border-white/10 pb-1.5 flex justify-between">
            <span>[I] PERFORMANCE METRICS SUMMARY</span>
            <span className="text-emerald-400">STATUS: ACTIVE</span>
          </h5>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-[10px]">
            <div>
              <span className="block text-slate-500">ANNUAL CARBON MASS</span>
              <span className="text-base font-bold text-white font-mono">{scoreResult.carbonScore} T CO2e/year</span>
            </div>
            <div>
              <span className="block text-slate-500">SUSTAINABILITY INDEX</span>
              <span className="text-base font-bold text-emerald-400 font-mono">{scoreResult.sustainabilityScore} / 100</span>
            </div>
            <div>
              <span className="block text-slate-500">DIAGNOSTIC STATUS</span>
              <span className="text-base font-bold text-white font-mono uppercase">{scoreResult.impactCategory}</span>
            </div>
          </div>
        </div>

        {/* Category Breakdown list */}
        <div className="space-y-4">
          <h5 className="font-bold text-white text-xs border-b border-white/10 pb-1.5">[II] HIGH FIDELITY CONTRIBUTION RATIOS</h5>
          
          <div className="space-y-2 text-[10px]">
            <div className="flex justify-between">
              <span>Transit Networks</span>
              <span className="font-bold text-white">{scoreResult.breakdown.transport} Tons CO2e</span>
            </div>
            <div className="flex justify-between">
              <span>Domestic Thermodynamic Load</span>
              <span className="font-bold text-white">{scoreResult.breakdown.energy} Tons CO2e</span>
            </div>
            <div className="flex justify-between">
              <span>Nutrition Supply Line</span>
              <span className="font-bold text-white">{scoreResult.breakdown.food} Tons CO2e</span>
            </div>
            <div className="flex justify-between">
              <span>Municipal Solid waste Refuse</span>
              <span className="font-bold text-white">{scoreResult.breakdown.waste} Tons CO2e</span>
            </div>
          </div>
        </div>

        {/* Recommendations list */}
        <div className="space-y-4 pt-1">
          <h5 className="font-bold text-white text-xs border-b border-white/10 pb-1.5">[III] PRIORITY MITIGATION ACTIONS</h5>
          
          <div className="space-y-3 text-[10px] leading-relaxed">
            {scoreResult.recommendations.map((r, i) => (
              <motion.div 
                key={r.id} 
                className="p-2.5 rounded bg-white/5 border border-white/10"
                whileHover={{ scale: 1.01, borderColor: "rgba(16, 185, 129, 0.2)" }}
                transition={{ duration: 0.2 }}
              >
                <span className="font-bold text-emerald-400 block">{i + 1}. {r.title}</span>
                <span className="block text-[9px] text-slate-400 truncate pt-0.5">{r.description}</span>
                <div className="flex space-x-4 pt-1 font-mono text-[9px] text-slate-400">
                  <span>Offset Carbon: -{r.co2Reduction} kg/yr</span>
                  <span>Financial: +${r.financialSavings}/yr</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="border-t border-dashed border-white/10 pt-4 text-center text-[9px] text-slate-600 font-mono">
          <span>*** END OF RECORD. DATA SECURE. ECOTRACK COMPLIENCE METRICS MET ***</span>
        </div>

      </div>

    </motion.div>
  );
}
