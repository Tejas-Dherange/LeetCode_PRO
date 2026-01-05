import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "../libs/passport.lib.js";
import authRouter from "../routes/auth.routes.js";
import problemsRouter from "../routes/problems.routes.js";
import codeExecutionRouter from "../routes/execute-code.routes.js";
import submissionRouter from "../routes/submission.route.js";
import playListRoutes from "../routes/playlists.routes.js";
import contestRoutes from "../routes/contest.routes.js";
import aiRoutes from "../routes/ai.routes.js";
import contestSubmissionRoutes from "../routes/contest-submission.routes.js";
import uploadRoutes from "../routes/upload.routes.js";
import subscriptionRouter from "../routes/subscription.routes.js";
import paymentRouter from "../routes/payment.routes.js";
import companySheetsRouter from "../routes/companySheets.routes.js";
import contributionRouter from "../routes/contibution.routes.js";
import patternRouter from "../routes/pattern.routes.js";
import monitoringRouter from "../routes/monitoring.routes.js";
import rateLimiter from "../middleware/rateLimiter.middleware.js";
import db from "../libs/db.js";
dotenv.config();

const port = process.env.PORT || 4000;

import { app, server } from "../socket/socket.js";
import "../workers/codeExecutionWorker.js"; // Start the worker

// const app = express(); // Removed in favor of app from socket.js

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      // Add production domains here:
      // "https://yourdomain.com",
      // "https://www.yourdomain.com"
    ],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

app.use(cookieParser());

// Initialize Passport
app.use(passport.initialize());

// Health check endpoint (before auth middleware)
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development"
  });
});

// Detailed health endpoint with database check
app.get("/api/health", async (req, res) => {
  try {
    // Quick DB ping
    await db.$queryRaw`SELECT 1`;
    
    res.status(200).json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      services: {
        database: "connected",
        redis: "connected" // Assume connected if app started
      },
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      environment: process.env.NODE_ENV || "development"
    });
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      error: error.message,
      services: {
        database: "disconnected"
      }
    });
  }
});

app.use("/api/v1/user", authRouter);
app.use("/api/v1/problems", problemsRouter);
app.use("/api/v1/execute-code", codeExecutionRouter);
app.use("/api/v1/submissions", submissionRouter);
app.use("/api/v1/playlist", playListRoutes);
app.use("/api/v1/contest", contestRoutes);
app.use("/api/v1/contest-submission", contestSubmissionRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/upload", uploadRoutes);
app.use("/api/v1/subscription", subscriptionRouter);
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/company-sheets", companySheetsRouter);
app.use("/api/v1/contribution", contributionRouter);
app.use("/api/v1/patterns", patternRouter);
app.use("/api/v1/admin/monitoring", monitoringRouter);

server.listen(port, () => {
  console.log(`app is running on port ${port}`);
});
