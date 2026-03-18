import { Router } from "express";
import { createAppointment, getMyAppointments } from "../controllers/appointment";
import { authMiddleware } from "../middlewares/validUser";

const router = Router();

router.post("/appointment", authMiddleware, createAppointment);
router.get("/my-appointments", authMiddleware, getMyAppointments);

export default router;
