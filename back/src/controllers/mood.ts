import { Response } from "express";
import { db } from "../config/prismaClient";
import { AuthRequest } from "../middlewares/validUser";

const VALID_MOODS = ["calm", "happy", "anxious", "sad", "frustrated", "numb"] as const;
type Mood = typeof VALID_MOODS[number];

const dayBounds = (date: Date) => {
  const start = new Date(date);
  start.setUTCHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setUTCHours(23, 59, 59, 999);
  return { start, end };
};

const moodScore: Record<Mood, number> = {
  happy: 5,
  calm: 4,
  numb: 3,
  anxious: 2,
  sad: 2,
  frustrated: 1,
};

export const logMood = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Not authenticated, Please login" });

    const { mood, note } = req.body;

    if (!mood || !VALID_MOODS.includes(mood as Mood)) {
      return res.status(400).json({
        message: `Invalid mood. Must be one of: ${VALID_MOODS.join(", ")}`,
      });
    }

    const now = new Date();
    const { start, end } = dayBounds(now);

    const existing = await db.moodLog.findFirst({
      where: { userId, loggedAt: { gte: start, lte: end } },
    });

    let moodLog;
    if (existing) {
      moodLog = await db.moodLog.update({
        where: { id: existing.id },
        data: {
          mood: mood as Mood,
          note: note ? String(note).trim().slice(0, 300) : null,
          loggedAt: now,
        },
      });
    } else {
      moodLog = await db.moodLog.create({
        data: {
          userId,
          mood: mood as Mood,
          note: note ? String(note).trim().slice(0, 300) : null,
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: existing ? "Mood updated for today" : "Mood logged successfully",
      data: moodLog,
    });
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const getMoodHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Not authenticated, Please login" });

    const days = Math.min(parseInt(String(req.query.days ?? "7"), 10) || 7, 90);
    const since = new Date();
    since.setDate(since.getDate() - days);
    since.setUTCHours(0, 0, 0, 0);

    const logs = await db.moodLog.findMany({
      where: { userId, loggedAt: { gte: since } },
      orderBy: { loggedAt: "asc" },
      select: { id: true, mood: true, note: true, loggedAt: true },
    });

    return res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const getMoodStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Not authenticated, Please login" });

    const now = new Date();

    const since14 = new Date(now);
    since14.setDate(since14.getDate() - 14);
    since14.setUTCHours(0, 0, 0, 0);

    const logs = await db.moodLog.findMany({
      where: { userId, loggedAt: { gte: since14 } },
      orderBy: { loggedAt: "asc" },
      select: { mood: true, loggedAt: true },
    });

    const { start: todayStart, end: todayEnd } = dayBounds(now);
    const todayLog = logs.find(l => l.loggedAt >= todayStart && l.loggedAt <= todayEnd);

    let streak = 0;
    const cursor = new Date(now);
    while (true) {
      const { start, end } = dayBounds(cursor);
      const hasLog = logs.some(l => l.loggedAt >= start && l.loggedAt <= end);
      if (!hasLog) break;
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    }

    const since7 = new Date(now);
    since7.setDate(since7.getDate() - 7);
    const thisWeekLogs = logs.filter(l => l.loggedAt >= since7);
    const thisWeekAvg = thisWeekLogs.length
      ? thisWeekLogs.reduce((sum, l) => sum + moodScore[l.mood as Mood], 0) / thisWeekLogs.length
      : null;

    const prevWeekLogs = logs.filter(l => l.loggedAt < since7);
    const prevWeekAvg = prevWeekLogs.length
      ? prevWeekLogs.reduce((sum, l) => sum + moodScore[l.mood as Mood], 0) / prevWeekLogs.length
      : null;

    let weeklyChange: number | null = null;
    if (thisWeekAvg !== null && prevWeekAvg !== null && prevWeekAvg !== 0) {
      weeklyChange = Math.round(((thisWeekAvg - prevWeekAvg) / prevWeekAvg) * 100);
    }

    return res.status(200).json({
      success: true,
      data: {
        todayMood: todayLog?.mood ?? null,
        currentStreak: streak,
        averageScore: thisWeekAvg !== null ? Math.round(thisWeekAvg * 10) / 10 : null,
        weeklyChange,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};
