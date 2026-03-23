import { Router } from "express";
import { sendMessage } from "../controllers/chat";

const router = Router();

router.post("/message", sendMessage);

export default router;