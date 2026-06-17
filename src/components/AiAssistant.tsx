/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from "react";
import { Message, CalculationResult } from "../types";
import { Send, Bot } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AiAssistantProps {
  scoreResult: CalculationResult | null;
}

export default function AiAssistant({ scoreResult }: AiAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text: "Hello! I am your EcoTrack AI Sustainability Assistant. Ask me anything about domestic emissions, home thermodynamical loads, circular composting loops, or custom habit changes to reduce your carbon footstep!",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputVal, setInputVal] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Suggested prompts to click
  const promptSuggestions = [
    "How to offset AC cooling power draw?",
    "Show average diet emission comparisons?",
    "Core ways to offset flight carbon multipliers?",
    "How does circular sorting decrease landfill methane?"
  ];

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      role: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          userScore: scoreResult ? scoreResult.carbonScore : null,
          breakdown: scoreResult ? scoreResult.breakdown : null
        })
      });

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: data.text || "I apologize, I encountered a brief telemetry offline. Could you please prompt me again?",
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    } catch (err) {
      console.error("AI Assistant error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  return (
    <div className="glassmorphism rounded-2xl p-4 md:p-6 shadow-xl flex flex-col justify-between h-[540px] text-left border border-white/10" id="companion-console">
      
      {/* 1. Header context banner */}
      <div className="border-b border-white/10 pb-3 mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20 text-emerald-400">
            <Bot className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>EcoTrack AI Companion</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </h3>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Powered by Gemini 3.5 Flash</p>
          </div>
        </div>
        
        {scoreResult && (
          <div className="text-right text-[10px] font-mono text-emerald-400 font-bold">
            ACTIVE ASSESSMENT: {scoreResult.carbonScore}T CO₂e/yr
          </div>
        )}
      </div>

      {/* 2. Chat history pane with AnimatePresence */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1 scrollbar-thin scrollbar-thumb-white/5 text-left" id="chat-scroller" aria-live="polite" aria-atomic="false">
        
        <AnimatePresence initial={false}>
          {messages.map((m, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, type: "spring" as const, stiffness: 150, damping: 15 }}
              className={`flex flex-col max-w-[85%] ${
                m.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
              }`}
            >
              <div 
                className={`p-3.5 rounded-2xl text-xs md:text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 rounded-br-none shadow-md shadow-emerald-500/5 font-bold"
                    : "bg-white/5 border border-white/10 text-slate-200 rounded-bl-none font-sans"
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>
              </div>
              <span className="text-[9px] font-mono text-slate-500 mt-1 uppercase tracking-wider">{m.timestamp}</span>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col mr-auto items-start max-w-[85%]"
          >
            <div className="bg-white/5 px-4 py-3 border border-white/10 rounded-2xl rounded-bl-none flex items-center space-x-2 text-xs">
              <div className="flex space-x-1">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-slate-400 text-[10px] font-mono font-bold">ADVISOR IS THINKING...</span>
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* 3. Helper suggestions quick-buttons with hover reactions */}
      {messages.length === 1 && (
        <div className="mb-4 text-left">
          <span className="text-[10px] font-mono text-slate-500 block mb-2 uppercase font-bold">RECOMMENDED CONVERSATIONAL CONTEXTS:</span>
          <div className="flex flex-wrap gap-2 text-left">
            {promptSuggestions.map((s, i) => (
              <motion.button
                key={i}
                type="button"
                whileHover={{ scale: 1.02, x: 2, borderColor: "rgba(16, 185, 129, 0.25)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSendMessage(s)}
                className="bg-white/5 border border-white/10 text-[11px] text-slate-300 font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer text-left focus:outline-none"
              >
                {s}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* 4. Chat interactive bar */}
      <div className="flex items-center space-x-2 bg-white/5 p-2.5 rounded-xl border border-white/10">
        <label htmlFor="ai-chat-input" className="sr-only">Type a message to your AI Assistant</label>
        <input
          id="ai-chat-input"
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputVal)}
          placeholder="Ask local carbon advisor..."
          className="flex-1 bg-transparent text-xs text-white border-none outline-none focus:ring-0 placeholder-slate-500 font-sans"
        />
        <button
          type="button"
          onClick={() => handleSendMessage(inputVal)}
          disabled={isLoading || !inputVal.trim()}
          aria-label="Send Message"
          className="bg-emerald-500 hover:brightness-105 active:scale-95 text-slate-950 p-2 rounded-lg font-bold flex items-center justify-center transition-all disabled:opacity-40 cursor-pointer outline-none shadow-md shadow-emerald-500/10 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1 focus-visible:ring-offset-[#050B14]"
        >
          <Send className="w-4 h-4 text-slate-950" aria-hidden="true" />
        </button>
      </div>

    </div>
  );
}
