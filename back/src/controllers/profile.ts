import { Response } from "express";
import { db } from "../config/prismaClient";
import { AuthRequest } from "../middlewares/validUser";

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Not authenticated" });

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        mobileNo: true,
        college: true,
        role: true,
        bio: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,

        appointments: {
          select: { status: true },
        },
        moodLogs: {
          orderBy: { loggedAt: "desc" },
          take: 7,
          select: { mood: true, loggedAt: true },
        },
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    const appointmentCounts = {
      total: user.appointments.length,
      scheduled: user.appointments.filter(a => a.status === "scheduled").length,
      completed: user.appointments.filter(a => a.status === "completed").length,
      cancelled: user.appointments.filter(a => a.status === "cancelled").length,
    };

    const { appointments, ...rest } = user;

    return res.status(200).json({
      success: true,
      data: {
        ...rest,
        appointmentCounts,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Not authenticated" });

    const { bio, avatarUrl, college } = req.body;

    const updateData: Record<string, string> = {};
    if (bio !== undefined) updateData.bio = String(bio).trim().slice(0, 500);
    if (avatarUrl !== undefined) updateData.avatarUrl = String(avatarUrl).trim();
    if (college !== undefined) updateData.college = String(college).trim();

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No valid fields provided to update" });
    }

    const updated = await db.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        username: true,
        mobileNo: true,
        college: true,
        role: true,
        bio: true,
        avatarUrl: true,
        updatedAt: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};
