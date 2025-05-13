import express from "express";
import {
  countSubmissions,
  getAllSubmissions,
  getAllSubmissionsForProblem,
} from "../controllers/submission.controllers.js";
import { isLoggedIn } from "../middleware/isLoggedIn.js";

const router = express.Router();

router.get("/get-all-submissions", isLoggedIn, getAllSubmissions);
router.get("/get-submission-byId/:problemId", isLoggedIn, getAllSubmissionsForProblem);
router.get("/count-submissions/:problemId", isLoggedIn, countSubmissions);
// router.get("get-all-submissions-for-problem/:problemId", isLoggedIn, );


export default router;
