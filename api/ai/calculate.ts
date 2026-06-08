import { buildCalculatedResponse } from "./common";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const inputs = req.body?.inputs;
    if (!inputs) {
      return res.status(400).json({ error: "Input factors are missing" });
    }

    const result = await buildCalculatedResponse(inputs);
    return res.status(200).json(result);
  } catch (error: any) {
    console.error("API /api/ai/calculate error:", error);
    return res.status(500).json({ error: error?.message || "Failed to calculate footprint details" });
  }
}
