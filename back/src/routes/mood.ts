import { Router } from "express";
import { logMood, getMoodHistory, getMoodStats } from "../controllers/mood";
import { authMiddleware } from "../middlewares/validUser";

const router = Router();

router.post("/log", authMiddleware, logMood);
router.get("/history", authMiddleware, getMoodHistory);
router.get("/stats", authMiddleware, getMoodStats);

export default router;
