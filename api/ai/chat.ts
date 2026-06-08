import { createChatResponse } from "./common";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { messages, userScore, breakdown } = req.body || {};
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    const text = await createChatResponse(messages, userScore ?? null, breakdown ?? null);
    return res.status(200).json({ text });
  } catch (error: any) {
    console.error("API /api/ai/chat error:", error);
    return res.status(500).json({ error: "Failed to query EcoTrack AI Companion" });
  }
}
