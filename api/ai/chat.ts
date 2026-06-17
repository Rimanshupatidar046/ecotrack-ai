import { createChatResponse } from "./common.js";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }

  try {
    const { messages, userScore, breakdown } = req.body || {};
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ success: false, error: "Messages array is required." });
    }

    const text = await createChatResponse(messages, userScore ?? null, breakdown ?? null);
    return res.status(200).json({ success: true, text });
  } catch (error: any) {
    console.error("API /api/ai/chat error:", error);
    return res.status(500).json({ success: false, error: error?.message || "Failed to query EcoTrack AI Companion" });
  }
}
