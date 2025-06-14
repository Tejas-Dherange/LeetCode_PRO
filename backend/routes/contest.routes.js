import express from "express";
import { isLoggedIn } from "../middleware/isLoggedIn.js";
import {
  addProblemToContest,
  // contestInterface,
  contestLeaderBoard, 
  contestSubmitCode,
  createContest,
  deleteContest,
  getAllContest,
  getAllProblemsInContest,
  getContestById,
  isRegisteredForContest,
  registerForContest,
  unRegisterContest,
  getUserContestRating,
} from "../controllers/contest.controllers.js";

const router = express.Router();

router.post("/create-contest", isLoggedIn, createContest);
router.get("/get-all-contests", isLoggedIn, getAllContest);
router.get("/get-contest/:id", isLoggedIn, getContestById);
router.delete("/delete-contest/:id", isLoggedIn, deleteContest);
router.post("/contest/:cid/leaderboard", isLoggedIn, contestLeaderBoard); //remaining to check
router.post("/add-problem-to-contest/:cid", isLoggedIn, addProblemToContest); //remaining to check

// router.post(
//   "/contest-submission/:cid/:pid",
//   isLoggedIn,
//   contestProblemSubmission,
// ); //remaining to check
router.post(
  "/contest-submission/submit-code",
  isLoggedIn,
  contestSubmitCode,
); //remaining to check
router.get(
  "/get-all-problems-in-contest/:cid",
  isLoggedIn,
  getAllProblemsInContest,
);
router.post("/register", isLoggedIn, registerForContest);
router.get("/is-registered/:contestId", isLoggedIn, isRegisteredForContest);
router.get("/user-rating/:userId", isLoggedIn, getUserContestRating);

router.delete("/unregister/:contestId", isLoggedIn, unRegisterContest);

export default router;
