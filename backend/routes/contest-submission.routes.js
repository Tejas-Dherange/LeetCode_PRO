import express from "express";
import { isLoggedIn } from "../middleware/isLoggedIn.js";
import { getCountOfSubmissions, getSubmissionForProblem, getSubmissionForProblemByUser } from "../controllers/contest-submission.controllers.js";
import { rateLimiter } from "../middleware/rateLimiter.middleware.js";

const router = express.Router();

router.get(
  "/get-submission-for-problem/:problemId",
  isLoggedIn,
  rateLimiter,
  getSubmissionForProblem,
);


router.get(
  "/get-count-of-submissions/:problemId",
  isLoggedIn,
  rateLimiter,
  getCountOfSubmissions,
);

router.get("/contest-submission/get-submission-for-problem-by-user/:problemId/:userId",
isLoggedIn,
rateLimiter,
getSubmissionForProblemByUser,
);

export default router;
