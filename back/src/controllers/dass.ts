import { Response } from "express";
import { db } from "../config/prismaClient";
import { AuthRequest } from "../middlewares/validUser";

type Cat = "depression" | "anxiety" | "stress";

const RANGES: Record<Cat, [number, string][]> = {
  depression: [[0,"Normal"],[10,"Mild"],[14,"Moderate"],[21,"Severe"],[28,"Extremely Severe"]],
  anxiety:    [[0,"Normal"],[8,"Mild"],[10,"Moderate"],[15,"Severe"],[20,"Extremely Severe"]],
  stress:     [[0,"Normal"],[15,"Mild"],[19,"Moderate"],[26,"Severe"],[34,"Extremely Severe"]],
};

function getSeverity(cat: Cat, scaled: number): string {
  let label = "Normal";
  for (const [min, sev] of RANGES[cat]) { if (scaled >= min) label = sev; }
  return label;
}

export const saveResult = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Not authenticated, Please login" });

    const { depressionRaw, anxietyRaw, stressRaw } = req.body;

    if (
      typeof depressionRaw !== "number" || depressionRaw < 0 || depressionRaw > 21 ||
      typeof anxietyRaw    !== "number" || anxietyRaw    < 0 || anxietyRaw    > 21 ||
      typeof stressRaw     !== "number" || stressRaw     < 0 || stressRaw     > 21
    ) {
      return res.status(400).json({ message: "Invalid scores. Each subscale must be 0–21." });
    }

    const depressionScore = depressionRaw * 2;
    const anxietyScore    = anxietyRaw    * 2;
    const stressScore     = stressRaw     * 2;

    const result = await db.dassResult.create({
      data: {
        userId,
        depressionRaw, anxietyRaw, stressRaw,
        depressionScore, anxietyScore, stressScore,
        depressionSeverity: getSeverity("depression", depressionScore),
        anxietySeverity:    getSeverity("anxiety",    anxietyScore),
        stressSeverity:     getSeverity("stress",     stressScore),
      },
    });

    return res.status(201).json({ success: true, message: "Result saved", data: result });
  } catch (error) {
    return res.status(500).json({ message: error instanceof Error ? error.message : "Internal server error" });
  }
};

export const getMyResults = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Not authenticated, Please login" });

    const results = await db.dassResult.findMany({
      where: { userId },
      orderBy: { takenAt: "desc" },
      select: {
        id: true,
        depressionScore: true, anxietyScore: true, stressScore: true,
        depressionSeverity: true, anxietySeverity: true, stressSeverity: true,
        takenAt: true,
      },
    });

    return res.status(200).json({ success: true, count: results.length, data: results });
  } catch (error) {
    return res.status(500).json({ message: error instanceof Error ? error.message : "Internal server error" });
  }
};

export const getUserResults = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== "counsellor") {
      return res.status(403).json({ success: false, message: "Access denied. Counsellors only." });
    }

    const { userId } = req.params;
    const results = await db.dassResult.findMany({
      where: { userId },
      orderBy: { takenAt: "desc" },
      select: {
        id: true,
        depressionScore: true, anxietyScore: true, stressScore: true,
        depressionSeverity: true, anxietySeverity: true, stressSeverity: true,
        takenAt: true,
      },
    });

    const user = await db.user.findUnique({ where: { id: userId }, select: { username: true, college: true } });

    return res.status(200).json({ success: true, count: results.length, user, data: results });
  } catch (error) {
    return res.status(500).json({ message: error instanceof Error ? error.message : "Internal server error" });
  }
};
