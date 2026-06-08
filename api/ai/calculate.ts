import { buildCalculatedResponse } from "./common";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }

  try {
    const inputs = req.body?.inputs;
    if (!inputs || typeof inputs !== "object") {
      return res.status(400).json({ success: false, error: "Input factors are missing or malformed" });
    }

    const result = await buildCalculatedResponse(inputs);
    return res.status(200).json({ success: true, ...result });
  } catch (error: any) {
    console.error("API /api/ai/calculate error:", error);
    return res.status(500).json({ success: false, error: error?.message || "Failed to calculate footprint details" });
  }
}
