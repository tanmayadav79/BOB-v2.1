import { Response } from "express";
import { db } from "../config/prismaClient";
import { AuthRequest } from "../middlewares/validUser";

const requireCounsellor = (req: AuthRequest, res: Response): boolean => {
  if (!req.user || req.user.role !== "counsellor") {
    res.status(403).json({ success: false, message: "Access denied. Counsellors only." });
    return false;
  }
  return true;
};

export const appointmentDetails = async (req: AuthRequest, res: Response) => {
  try {
    if (!requireCounsellor(req, res)) return;

    const { status, date } = req.query;

    const appointments = await db.appointment.findMany({
      where: {
        ...(status && { status: String(status) as any }),
        ...(date && { date: { gte: new Date(`${date}T00:00:00.000Z`), lte: new Date(`${date}T23:59:59.999Z`) } }),
      },
      select: {
        id: true, name: true, phoneNumber: true, email: true,
        date: true, time: true, status: true, details: true,
        resolvedAt: true, resolvedBy: true, cancelNote: true, createdAt: true,
        user: {
          select: {
            id: true, username: true, college: true, mobileNo: true,
            dassResults: {
              orderBy: { takenAt: "desc" },
              take: 1,
              select: {
                depressionSeverity: true, anxietySeverity: true, stressSeverity: true,
                depressionScore: true, anxietyScore: true, stressScore: true,
                takenAt: true,
              },
            },
          },
        },
      },
      orderBy: [{ date: "asc" }, { time: "asc" }],
    });

    const enriched = appointments.map(a => ({
      ...a,
      user: {
        ...a.user,
        latestDass: a.user.dassResults[0] ?? null,
        dassResults: undefined,
      },
    }));

    return res.status(200).json({ success: true, count: enriched.length, data: enriched });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch appointments" });
  }
};

export const completeAppointment = async (req: AuthRequest, res: Response) => {
  try {
    if (!requireCounsellor(req, res)) return;

    const { id } = req.params as { id: string };

    const appointment = await db.appointment.findUnique({ where: { id } });
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }
    if (appointment.status !== "scheduled") {
      return res.status(400).json({
        success: false,
        message: `Cannot complete an appointment that is already "${appointment.status}"`,
      });
    }

    const updated = await db.appointment.update({
      where: { id },
      data: {
        status: "completed",
        resolvedAt: new Date(),
        resolvedBy: req.user!.username ?? req.user!.id,
      },
      select: {
        id: true,
        status: true,
        resolvedAt: true,
        resolvedBy: true,
        name: true,
        date: true,
        time: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Appointment marked as completed",
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const cancelAppointment = async (req: AuthRequest, res: Response) => {
  try {
    if (!requireCounsellor(req, res)) return;

    const { id } = req.params as { id: string };
    const { cancelNote } = req.body;

    const appointment = await db.appointment.findUnique({ where: { id } });
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }
    if (appointment.status !== "scheduled") {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel an appointment that is already "${appointment.status}"`,
      });
    }

    const updated = await db.appointment.update({
      where: { id },
      data: {
        status: "cancelled",
        resolvedAt: new Date(),
        resolvedBy: req.user!.username ?? req.user!.id,
        cancelNote: cancelNote ? String(cancelNote).trim().slice(0, 500) : null,
      },
      select: {
        id: true,
        status: true,
        resolvedAt: true,
        resolvedBy: true,
        cancelNote: true,
        name: true,
        date: true,
        time: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Appointment cancelled",
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    if (!requireCounsellor(req, res)) return;

    const [total, scheduled, completed, cancelled] = await Promise.all([
      db.appointment.count(),
      db.appointment.count({ where: { status: "scheduled" } }),
      db.appointment.count({ where: { status: "completed" } }),
      db.appointment.count({ where: { status: "cancelled" } }),
    ]);

    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setUTCHours(0, 0, 0, 0);
    const todayEnd = new Date(now);
    todayEnd.setUTCHours(23, 59, 59, 999);

    const todayScheduled = await db.appointment.count({
      where: { date: { gte: todayStart, lte: todayEnd }, status: "scheduled" },
    });

    return res.status(200).json({
      success: true,
      data: { total, scheduled, completed, cancelled, todayScheduled },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch stats" });
  }
};
