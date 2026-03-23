import { Request, Response } from "express";

const OLLAMA_URL = process.env.OLLAMA_URL || "http://127.0.0.1:11434/api/generate";
const MODEL = "bobbuddy:latest";

export const sendMessage = async (req: Request, res: Response) => {
  const { content, context } = req.body;

  if (!content || typeof content !== "string" || !content.trim()) {
    return res.status(400).json({ message: "Message content is required." });
  }

  try {
    const ollamaRes = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        prompt: content.trim(),
        stream: false,
        ...(Array.isArray(context) && context.length > 0 ? { context } : {}),
      }),
    });

    if (!ollamaRes.ok) {
      const errText = await ollamaRes.text().catch(() => "");
      console.error("Ollama error:", ollamaRes.status, errText);
      return res.status(502).json({
        message: "BOB is unavailable right now. Please try again in a moment.",
      });
    }

    const data = await ollamaRes.json();

    const reply = data?.response?.trim();
    if (!reply) {
      return res.status(502).json({ message: "BOB returned an empty response." });
    }

    return res.status(200).json({ reply, context: data.context ?? []});
  } catch (error) {
    console.error("Could not reach Ollama:", error);
    return res.status(503).json({
      message: "Could not connect to BOB. Make sure the bot server is running.",
    });
  }
};
