import express from "express";
import {
  getAllPatterns,
  getPatternById,
  getPatternBySlug,
  getUserPatternProgress,
  createPattern,
  updatePattern,
  deletePattern,
  addProblemToPattern,
  removeProblemFromPattern,
  updateProblemOrder,
  recalculateUserProgress,
} from "../controllers/pattern.controllers.js";
import {isLoggedIn} from "../middleware/isLoggedIn.js";

const router = express.Router();

// Routes (all require auth to show user-specific progress)
router.get("/", isLoggedIn, getAllPatterns);
router.get("/:id", isLoggedIn, getPatternById);
router.get("/slug/:slug", isLoggedIn, getPatternBySlug);

// Protected routes
router.get("/progress/user", isLoggedIn, getUserPatternProgress);
router.post("/progress/recalculate", isLoggedIn, recalculateUserProgress);

// Admin routes
router.post("/", isLoggedIn, createPattern);
router.put("/:id", isLoggedIn, updatePattern);
router.delete("/:id", isLoggedIn, deletePattern);
router.post("/:patternId/problems", isLoggedIn, addProblemToPattern);
router.delete("/:patternId/problems/:problemId", isLoggedIn, removeProblemFromPattern);
router.put("/:patternId/problems/order", isLoggedIn, updateProblemOrder);

export default router;
