import express from "express";
import {
  createProblem,
  deleteProblem,
  getAllProblems,
  getAllProblemsSolvedByUser,
  getProblemById,
  updateProblem,
} from "../controllers/problem.controller.js";
import { isLoggedIn } from "../middleware/isLoggedIn.js";

const router = express.Router();

router.post("/create-problem", isLoggedIn, createProblem);
router.delete("/delete-problem", isLoggedIn, deleteProblem);
router.update("/update-problem", isLoggedIn, updateProblem);
router.get("/get-problem-byId/:id", isLoggedIn, getProblemById);
router.get("/getAllProblems", isLoggedIn, getAllProblems);
router.get(
  "/getAllProblemsSolvedByUser",
  isLoggedIn,
  getAllProblemsSolvedByUser,
);

export default router;
