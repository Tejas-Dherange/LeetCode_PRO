import express from "express";
import { isLoggedIn } from "../middleware/isLoggedIn.js";
import {
  getQueueStatus,
  getJudge0Health,
  getRedisMetrics,
  getSubmissionAnalytics,
  getSystemHealth,
  getUserAnalytics,
  getProblemSolvingStats,
  getTopUsers,
  getUsersList,
  getUserActivityTimeline,
  getUserDetails,
} from "../controllers/monitoring.controller.js";

const router = express.Router();

// Admin-only middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required.",
    });
  }
  next();
};

// All monitoring routes require authentication and admin role
router.use(isLoggedIn, requireAdmin);

// System monitoring endpoints
router.get("/queue", getQueueStatus);
router.get("/judge0", getJudge0Health);
router.get("/redis", getRedisMetrics);
router.get("/submissions", getSubmissionAnalytics);
router.get("/system", getSystemHealth);

// User analytics endpoints
router.get("/users/analytics", getUserAnalytics);
router.get("/problems/stats", getProblemSolvingStats);
router.get("/users/top", getTopUsers);
router.get("/users", getUsersList);
router.get("/users/:userId/details", getUserDetails);
router.get("/activity", getUserActivityTimeline);

export default router;
