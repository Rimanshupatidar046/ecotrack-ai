/**
 * @vitest-environment node
 */
import request from 'supertest';
import { describe, it, expect, vi } from 'vitest';

// Mock the Gemini API globally for server testing
vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: vi.fn().mockImplementation(() => ({
      models: {
        generateContent: vi.fn().mockResolvedValue({
          text: 'Mocked AI commentary response'
        })
      }
    }))
  };
});

import { app } from './server';

describe('API Routes', () => {
  
  describe('POST /api/ai/calculate', () => {
    it('returns 400 if inputs are missing', async () => {
      const res = await request(app).post('/api/ai/calculate').send({});
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('returns calculated footprint data for valid inputs', async () => {
      const inputs = {
        carKm: 10,
        bikeKm: 5,
        publicTransport: "none",
        flightsYear: 0,
        electricityKwh: 200,
        acHours: 2,
        renewablePct: 0,
        diet: "non-vegetarian",
        plasticLevel: "medium",
        recyclingHabits: "some",
        weeklyWasteKg: 5
      };

      const res = await request(app).post('/api/ai/calculate').send({ inputs });
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('carbonScore');
      expect(res.body).toHaveProperty('sustainabilityScore');
      expect(res.body).toHaveProperty('impactCategory');
      expect(res.body).toHaveProperty('breakdown');
      expect(res.body).toHaveProperty('recommendations');
      expect(Array.isArray(res.body.recommendations)).toBe(true);
      expect(res.body).toHaveProperty('commentary');
    });

    it('handles excellent score correctly', async () => {
      const inputs = {
        carKm: 0, bikeKm: 20, publicTransport: "high", flightsYear: 0,
        electricityKwh: 50, acHours: 0, renewablePct: 100,
        diet: "vegan", plasticLevel: "low", recyclingHabits: "all", weeklyWasteKg: 1
      };
      const res = await request(app).post('/api/ai/calculate').send({ inputs });
      expect(res.status).toBe(200);
      expect(res.body.impactCategory).toBe('Excellent');
    });
  });

  describe('POST /api/ai/chat', () => {
    it('returns 400 if messages are missing', async () => {
      const res = await request(app).post('/api/ai/chat').send({});
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('returns chat response', async () => {
      const messages = [{ role: 'user', text: 'How do I reduce my footprint?' }];
      const res = await request(app).post('/api/ai/chat').send({ messages, userScore: 2.5 });
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('text');
      expect(typeof res.body.text).toBe('string');
    });
  });
});
