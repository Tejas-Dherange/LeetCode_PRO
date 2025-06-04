import express from "express";
import { isLoggedIn } from "../middleware/isLoggedIn.js";
import {
  contestInterface,
  contestLeaderBoard,
  createContest,
  deleteContest,
  getAllContest,
  getContestById,
} from "../controllers/contest.controllers.js";

const router = express.Router();

router.post("/create-contest", isLoggedIn, createContest);
router.get("/get-all-contests", isLoggedIn, getAllContest);
router.get("/get-contest/:id", isLoggedIn, getContestById);
router.get("/get-contest/:id", isLoggedIn, getContestById);
router.delete("/delete-contest/:id", isLoggedIn, deleteContest);
router.post("/contest/:cid/problem/:pid", isLoggedIn, contestInterface);
router.post("/contest/:cid/leaderboard", isLoggedIn, contestLeaderBoard);

export default router;
