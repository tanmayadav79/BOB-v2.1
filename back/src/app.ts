import express, { ErrorRequestHandler, Request, Response } from "express";
import cors from "cors";
import cookies from "cookie-parser";
import dotenv from "dotenv";

import authRoutes from "./routes/auth";
import appointmentRoutes from "./routes/appointment";
import counsellorRoutes from "./routes/counsellor";
import profileRoutes from "./routes/profile";
import moodRoutes from "./routes/mood";
import dassRoutes from "./routes/dass";
import chatRoutes from "./routes/chat";

dotenv.config();

const app = express();
app.use(cookies());

const clients = [process.env.CLIENT_URL, "http://localhost:5173"];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || clients.includes(origin)) callback(null, true);
      else callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/book", appointmentRoutes);
app.use("/counsellor", counsellorRoutes);
app.use("/profile", profileRoutes);
app.use("/mood", moodRoutes);
app.use("/dass", dassRoutes);
app.use("/chat", chatRoutes);

app.use((req: Request, res: Response) => {
  return res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error("Unhandled API error:", err);
  const status = typeof err?.status === "number" ? err.status : 500;

  return res.status(status).json({
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err?.message || "Internal server error",
  });
};

app.use(errorHandler);

export default app;
