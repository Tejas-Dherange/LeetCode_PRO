import express from "express";
import { isLoggedIn } from "../middleware/isLoggedIn.js";
import { getCountOfSubmissions, getSubmissionForProblem } from "../controllers/contest-submission.controllers.js";

const router = express.Router();

router.get(
  "/get-submission-for-problem/:problemId",
  isLoggedIn,
  getSubmissionForProblem,
);


router.get(
  "/get-count-of-submissions/:problemId",
  isLoggedIn,
  getCountOfSubmissions,
);

export default router;
