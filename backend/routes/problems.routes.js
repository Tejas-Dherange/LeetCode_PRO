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

router.post("/create-problem", isLoggedIn, createProblem); //done
router.delete("/delete-problem/:id", isLoggedIn, deleteProblem); //done
router.post("/update-problem/:id", isLoggedIn, updateProblem); //done
router.get("/get-problem-byId/:id", isLoggedIn, getProblemById); //done
router.get("/getAllProblems", isLoggedIn, getAllProblems); //done
router.get( 
  "/getAllProblemsSolvedByUser",
  isLoggedIn,
  getAllProblemsSolvedByUser,
); //done

export default router;
