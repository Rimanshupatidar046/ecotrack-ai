/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CalculatorInputs {
  carKm: number;
  bikeKm: number;
  publicTransport: string; // 'none' | 'low' | 'medium' | 'high'
  flightsYear: number;
  electricityKwh: number;
  acHours: number;
  renewablePct: number;
  diet: string; // 'vegan' | 'vegetarian' | 'non-vegetarian'
  plasticLevel: string; // 'low' | 'medium' | 'high'
  recyclingHabits: string; // 'none' | 'some' | 'all'
  weeklyWasteKg: number;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  co2Reduction: number; // kg CO2 per year
  financialSavings: number; // $ per year
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: 'transport' | 'energy' | 'food' | 'waste';
  icon: string;
}

export interface CalculationResult {
  carbonScore: number; // metric tons CO2 / year
  sustainabilityScore: number; // 0 - 100
  impactCategory: 'Excellent' | 'Good' | 'Average' | 'High Impact';
  breakdown: {
    transport: number; // in tons
    energy: number;
    food: number;
    waste: number;
  };
  recommendations: Recommendation[];
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export interface EcoChallenge {
  id: string;
  title: string;
  description: string;
  category: 'transport' | 'energy' | 'food' | 'waste';
  points: number;
  completed: boolean;
  type: 'daily' | 'weekly';
}

export interface AchievementBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface RoadmapMilestone {
  id: string;
  title: string;
  timeframe: 'Short-term' | 'Mid-term' | 'Long-term';
  targetDate: string;
  description: string;
  achieved: boolean;
  savingsKg: number;
}

export interface EcoTip {
  title: string;
  content: string;
  category: string;
  impactLevel: string;
}
