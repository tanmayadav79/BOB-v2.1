import { Response } from "express";
import { db } from "../config/prismaClient";
import { AuthRequest } from "../middlewares/validUser";

export const createAppointment = async (req: AuthRequest, res: Response) => {
  const { name, email, date, time, details } = req.body;
  try {
    if (!date || !time) {
      return res.status(400).json({ message: "Date and time are required" });
    }
    if (!req.user?.id || !req.user?.mobileNo) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const appointmentDate = new Date(date);
    if (isNaN(appointmentDate.getTime())) {
      return res.status(400).json({ message: "Invalid date" });
    }

    if (appointmentDate < new Date()) {
      return res.status(400).json({ message: "Cannot book an appointment in the past" });
    }

    const appointment = await db.appointment.create({
      data: {
        userId: req.user.id,
        phoneNumber: req.user.mobileNo,
        name: name || null,
        email: email || null,
        date: appointmentDate,
        time,
        details: details || null,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const getMyAppointments = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: "Not authenticated" });

    const { status } = req.query;

    const appointments = await db.appointment.findMany({
      where: {
        userId: req.user.id,
        ...(status && { status: String(status) as any }),
      },
      orderBy: { date: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        date: true,
        time: true,
        status: true,
        details: true,
        cancelNote: true,
        resolvedAt: true,
        createdAt: true,
      },
    });

    return res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};
