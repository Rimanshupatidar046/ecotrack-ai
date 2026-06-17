/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with client header and fallback safety
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("EcoTrack AI: Gemini SDK successfully initialized.");
  } catch (error) {
    console.error("EcoTrack AI: Failed to initialize Gemini SDK:", error);
  }
} else {
  console.log("EcoTrack AI: Operating in fallback heuristic mode. (GEMINI_API_KEY missing in server.env)");
}

// ----------------------------------------------------------------------
// BACKEND API ROUTES
// ----------------------------------------------------------------------

// Heuristic recommendations as a fallback
const FALLBACK_RECOMMENDATIONS = [
  {
    id: "rec_transport_public",
    title: "Switch to Transit Commuting",
    description: "Opt for public transit or high-speed rail instead of solo driving on core weekly commutes to slash peak transport emissions.",
    co2Reduction: 1200,
    financialSavings: 840,
    difficulty: "Easy" as const,
    category: "transport" as const,
    icon: "Train"
  },
  {
    id: "rec_energy_solar",
    title: "Deploy Domestic Solar Array",
    description: "Leverage standard grid-tied micro-inverters or solar arrays to offset up to 80% of daily residential peak electricity consumption.",
    co2Reduction: 2100,
    financialSavings: 1100,
    difficulty: "Hard" as const,
    category: "energy" as const,
    icon: "Sun"
  },
  {
    id: "rec_energy_thermal",
    title: "Optimize Thermostat Strategy",
    description: "Introduce smart thermodynamic thresholds (e.g. keeping AC at 24°C) to dramatically buffer standard mechanical wear and energy overheads.",
    co2Reduction: 450,
    financialSavings: 180,
    difficulty: "Easy" as const,
    category: "energy" as const,
    icon: "Thermometer"
  },
  {
    id: "rec_food_plant",
    title: "Transition to Plant-Biased Diet",
    description: "Swap conventional red-meat meals for plant-based high-protein sources at least 3-4 days a week to mitigate intensive agricultural footprint.",
    co2Reduction: 850,
    financialSavings: 350,
    difficulty: "Medium" as const,
    category: "food" as const,
    icon: "Leaf"
  },
  {
    id: "rec_waste_circular",
    title: "Zero Single-Use Plastics",
    description: "Adopt metallic multi-use storage containers to interrupt post-consumer municipal plastic debris landfill flows.",
    co2Reduction: 180,
    financialSavings: 120,
    difficulty: "Easy" as const,
    category: "waste" as const,
    icon: "Trash2"
  },
  {
    id: "rec_waste_compost",
    title: "In-House Organic Circular Composting",
    description: "Compost weekly food scraps and peelings locally to completely eradicate anaerobic landfills methane release cycles.",
    co2Reduction: 300,
    financialSavings: 50,
    difficulty: "Medium" as const,
    category: "waste" as const,
    icon: "Sparkles"
  }
];

// Calculation API with scientific formula and optional Gemini analysis
app.post("/api/ai/calculate", async (req, res) => {
  try {
    const inputs = req.body.inputs;
    if (!inputs) {
      return res.status(400).json({ error: "Input factors are missing" });
    }

    const {
      carKm = 0,
      bikeKm = 0,
      publicTransport = "none",
      flightsYear = 0,
      electricityKwh = 0,
      acHours = 0,
      renewablePct = 0,
      diet = "non-vegetarian",
      plasticLevel = "medium",
      recyclingHabits = "some",
      weeklyWasteKg = 0
    } = inputs;

    // --- Scientific Footprint Modeling (kg CO2e / year) ---
    // 1. Transportation
    const carCO2 = carKm * 365 * 0.18; // 180g CO2 per km
    const bikeCO2 = 0; // Carbon-neutral
    let publicTransportCO2 = 0;
    if (publicTransport === "high") publicTransportCO2 = 150;
    else if (publicTransport === "medium") publicTransportCO2 = 450;
    else if (publicTransport === "low") publicTransportCO2 = 800;
    const flightsCO2 = flightsYear * 800; // Average 800kg per local/intl flight equivalent
    const transportTotal = carCO2 + bikeCO2 + publicTransportCO2 + flightsCO2;

    // 2. Home Energy
    const baseElectricityCO2 = electricityKwh * 12 * 0.4; // 400g per kWh
    const acCO2 = acHours * 365 * 1.5 * 0.4; // 1.5 kW AC draw, 400g per kWh
    const energyOffset = 1 - (renewablePct / 100);
    const energyTotal = (baseElectricityCO2 + acCO2) * energyOffset;

    // 3. Nutrition Habits
    let foodTotal = 2500; // Normal omnivore
    if (diet === "vegan") foodTotal = 1000;
    else if (diet === "vegetarian") foodTotal = 1500;

    // 4. Circular Waste Loops
    let plasticOffset = 150;
    if (plasticLevel === "high") plasticOffset = 300;
    else if (plasticLevel === "low") plasticOffset = 50;

    const baseWasteCO2 = weeklyWasteKg * 52 * 0.5; // 0.5kg emission per kg trash
    let recyclingDiscount = 1.0;
    if (recyclingHabits === "all") recyclingDiscount = 0.5; // 50% discount
    else if (recyclingHabits === "some") recyclingDiscount = 0.8; // 20% discount
    const wasteTotal = (baseWasteCO2 + plasticOffset) * recyclingDiscount;

    // Total Carbon (Converted to Metric Tons CO2 / year)
    const totalCO2Kg = transportTotal + energyTotal + foodTotal + wasteTotal;
    const carbonScore = Number((totalCO2Kg / 1000).toFixed(2));

    // Calculate dynamic state scales (Lower is better, ideal average is around ~4.0 T)
    // Scale standard score 0 - 100: ideal carbon footprint is ~2.0 T (Score = 100)
    // extremely heavy footprint is > 16.0 T (Score = 10)
    let sustainabilityScore = Math.max(10, Math.round(100 - (carbonScore - 2.0) * 6));
    if (carbonScore <= 2.0) {
      sustainabilityScore = Math.min(100, Math.round(95 + (2 - carbonScore) * 2));
    }

    let impactCategory: "Excellent" | "Good" | "Average" | "High Impact" = "Average";
    if (carbonScore < 3.0) impactCategory = "Excellent";
    else if (carbonScore < 5.0) impactCategory = "Good";
    else if (carbonScore < 10.0) impactCategory = "Average";
    else impactCategory = "High Impact";

    const breakdown = {
      transport: Number((transportTotal / 1000).toFixed(2)),
      energy: Number((energyTotal / 1000).toFixed(2)),
      food: Number((foodTotal / 1000).toFixed(2)),
      waste: Number((wasteTotal / 1000).toFixed(2))
    };

    // Personalized smart recommendations tailored to highest emitters
    const customRecs = [...FALLBACK_RECOMMENDATIONS];
    // Sort suggestions to showcase the category that is the highest contributor first
    const categoriesSorted = Object.entries(breakdown).sort((a, b) => b[1] - a[1]);
    const dominantCategory = categoriesSorted[0][0];

    // Rearrange recommendations to prioritize dominant category
    customRecs.sort((a, b) => {
      if (a.category === dominantCategory && b.category !== dominantCategory) return -1;
      if (b.category === dominantCategory && a.category !== dominantCategory) return 1;
      return 0;
    });

    let aiCommentary = "";

    // Generate smart AI synthesis if client key is configured
    if (ai) {
      try {
        const prompt = `You are a climate scientist and lead consultant at EcoTrack AI.
        Generate a concise, professional, startup-style sustainability synthesis for an user with these carbon numbers:
        - Total Annual Footprint: ${carbonScore} Metric Tons CO2e/year
        - National average varies of ~15 Tons in US, but global target is < 2 Tons.
        - Category: ${impactCategory} (Personal Sustainability Score: ${sustainabilityScore}/100)
        - Breakdown: Transport: ${breakdown.transport}T, Energy: ${breakdown.energy}T, Food: ${breakdown.food}T, Waste: ${breakdown.waste}T
        - Inputs context: Car km/day: ${carKm}, Flights/year: ${flightsYear}, Energy renewable %: ${renewablePct}, Diet type: ${diet}, Weekly waste: ${weeklyWasteKg} kg.

        Provide a very engaging 2-3 sentence personalized review focusing directly on their highest contributor, praise their good segments and deliver a high impact, inspiring motivation to improve. Keep it inspiring, concrete, scientific yet completely friendly. No jargon.`;

        const aiResponse = await ai.models.generateContent({
          model: "gemini-1.5-flash",
          contents: prompt,
        });

        if (aiResponse && aiResponse.text) {
          aiCommentary = aiResponse.text.trim();
        }
      } catch (err) {
        console.error("Gemini calculator generation failed, using standard commentary:", err);
      }
    }

    if (!aiCommentary) {
      if (impactCategory === "Excellent") {
        aiCommentary = "Spectacular effort! Your lifestyle footprints are exceptional to the environment. Your conscious choices in green commuting and high zero-carbon offsets are demonstrating a sustainable future model.";
      } else if (impactCategory === "Good") {
        aiCommentary = "Great progress! You are currently keeping your greenhouse footprint tightly checked. By adjusting small sectors, particularly in your dominant emissions, you can easily shift into the elite carbon-neutral rank.";
      } else if (impactCategory === "Average") {
        aiCommentary = "You are currently near the standard global citizen threshold, but there's solid headroom to optimize. Re-evaluating daily heating schedules and solo automobile transits will dramatically shift your trajectory toward a secure ecology.";
      } else {
        aiCommentary = "Your emissions profile indicates major carbon intensifications. Transitioning toward renewable inputs, green diets, or public transit is vital to scale back your high planetary demand.";
      }
    }

    return res.json({
      carbonScore,
      sustainabilityScore,
      impactCategory,
      breakdown,
      recommendations: customRecs,
      commentary: aiCommentary
    });

  } catch (error: any) {
    console.error("Calculator endpoint error:", error);
    return res.status(500).json({ error: error.message || "Failed to calculate footprint details" });
  }
});

// AI Chatbot Companion Endpoint
app.post("/api/ai/chat", async (req, res) => {
  const { messages, userScore, breakdown } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required." });
  }

  // Format history for Gemini chat structure
  const formattedContents = messages.map((m: any) => {
    return {
      role: m.role === "user" ? ("user" as const) : ("model" as const),
      parts: [{ text: m.text }],
    };
  });

  const latestMessageText = messages[messages.length - 1]?.text || "Hello";

  // If no AI key, use robust expert fallback system
  if (!ai) {
    const isQuestionAboutScore = latestMessageText.toLowerCase().includes("score") || latestMessageText.toLowerCase().includes("carbon") || latestMessageText.toLowerCase().includes("footprint");
    const isQuestionAboutReduce = latestMessageText.toLowerCase().includes("reduce") || latestMessageText.toLowerCase().includes("how") || latestMessageText.toLowerCase().includes("tip");

    let fallbackText = "I would be happy to discuss sustainability metrics with you! Could you please share more details about your daily travel or energy habits? Alternatively, complete our Carbon Calculator tab to unlock precise analysis!";

    if (userScore) {
      if (isQuestionAboutScore) {
        fallbackText = `According to our diagnostic tools, your annual carbon footprint stands at **${userScore} Metric Tons of CO2e** with a general Sustainability Score of **${breakdown ? (userScore > 7 ? 'Average' : 'Excellent') : 'Active User'}**. Your energy and circular practices can easily be tuned further!`;
      } else if (isQuestionAboutReduce) {
        fallbackText = `To reduce your footprint of **${userScore} Tons**, I highly recommend focusing on these primary avenues:
1. **Electrify Transportation**: Leverage micromobility, electric vehicles, or public transport to heavily decrease transit impact.
2. **Thermal Adjustments**: Set residential thermostats to 24°C in summer and utilize smart power strips to prevent phantom power draw.
3. **Weekly Meatless Days**: Standard plant diets have less than half the carbon intensity of conventional red meat.`;
      } else {
        fallbackText = `Excellent query. To maintain your carbon target near **${userScore} T**, try tracking your recycling ratios weekly. Standard household sorting can reduce waste emissions by over 45% annually! Let me know if you would like custom advice on any specific category.`;
      }
    } else {
      if (isQuestionAboutReduce) {
        fallbackText = "Reducing your emissions of greenhouse gases begins with basic changes: swap fluorescent lights for standard LED bulbs (retaining up to 80% luminous efficiency for 90% less energy), consider cold-washing laundry (saving 75-90% water heat energy), and minimizing food waste!";
      }
    }

    // Add friendly hint about localized hosting
    fallbackText += "\n\n*(Note: Running in offline EcoTrack expert model as no API Key was detected in environment variables)*";

    return res.json({ text: fallbackText });
  }

  try {
    // Provide scientific/startup context in the system instruction
    const scoreCtx = userScore 
      ? `The user's carbon footprint is computed at ${userScore} Metric Tons of CO2e/year. Breakdown details: Transport: ${breakdown?.transport || 0}T, Energy: ${breakdown?.energy || 0}T, Food: ${breakdown?.food || 0}T, Waste: ${breakdown?.waste || 0}T.` 
      : "The user has not taken the carbon footprint calculator yet. Gently encourage them to try the scientific footprint calculator.";

    const systemInstruction = `You are a world-class Climate Scientist and lead conversational counselor at EcoTrack AI.
    Your mission is to guide individuals toward understanding, monitoring, and reducing their municipal and domestic greenhouse footprint.
    Be inspiring, deeply scientific yet completely human, friendly, and practical. Offer concrete recommendations.
    Use Markdown list formatting where helpful to make instructions scannable. Keep answers concise (max 3 short paragraphs).
    Current User Context: ${scoreCtx}`;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    return res.json({ text: response.text });
  } catch (err: any) {
    console.error("Gemini assistant generation error:", err);
    return res.status(500).json({ error: "Failed to query EcoTrack AI Companion" });
  }
});

// ----------------------------------------------------------------------
// VITE OR STATIC FILE MIDDLEWARE
// ----------------------------------------------------------------------

if (process.env.NODE_ENV !== "production") {
  createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  }).then((vite) => {
    app.use(vite.middlewares);
    
    // Fallback index.html router for SPA
    app.get("*", (req, res, next) => {
      // Do not catch API paths
      if (req.path.startsWith("/api/")) return next();
      
      const indexHtml = path.resolve(process.cwd(), "index.html");
      vite.transformIndexHtml(req.originalUrl, req.path).then((html) => {
        res.status(200).set({ "Content-Type": "text/html" }).end(html);
      }).catch(next);
    });
    
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`[EcoTrack Dev] Active on http://0.0.0.0:${PORT}`);
    });
  });
} else {
  // Serve production bundled folder
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/")) return next();
    res.sendFile(path.resolve(distPath, "index.html"));
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[EcoTrack Prod] Service running on port ${PORT}`);
  });
}
