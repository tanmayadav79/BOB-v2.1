import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/profile";
import { authMiddleware } from "../middlewares/validUser";

const router = Router();

router.get("/me", authMiddleware, getProfile);
router.patch("/me", authMiddleware, updateProfile);

export default router;
