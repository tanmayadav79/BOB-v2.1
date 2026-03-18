import { Router } from "express";
import { saveResult, getMyResults, getUserResults } from "../controllers/dass";
import { authMiddleware } from "../middlewares/validUser";

const router = Router();

router.post("/result",          authMiddleware, saveResult);
router.get("/my-results",       authMiddleware, getMyResults);
router.get("/user/:userId",     authMiddleware, getUserResults);

export default router;
