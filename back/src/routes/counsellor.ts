import { Router } from "express";
import {
  appointmentDetails,
  completeAppointment,
  cancelAppointment,
  getDashboardStats,
} from "../controllers/counsellor";
import { authMiddleware } from "../middlewares/validUser";

const router = Router();

router.get("/dashboard", authMiddleware, appointmentDetails);
router.get("/stats", authMiddleware, getDashboardStats);
router.patch("/appointments/:id/complete", authMiddleware, completeAppointment);
router.patch("/appointments/:id/cancel", authMiddleware, cancelAppointment);

export default router;
