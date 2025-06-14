import express from "express";
import { isLoggedIn } from "../middleware/isLoggedIn.js";
import {
  addProblemInPlayList,
  createPlaylist,
  deletePlaylist,
  getAllPlayLists,
  getPlayListById,
  removeProblemInPlayList,
} from "../controllers/playlists.controllers.js";

const router = express.Router();

router.get("/", isLoggedIn, getAllPlayLists);
router.get("/get-playlist-by-id/:playListId", isLoggedIn, getPlayListById);
router.post("/:playListId/add-problem", isLoggedIn, addProblemInPlayList);
router.post(
  "/:playListId/remove-problem",
  isLoggedIn,
  removeProblemInPlayList,
);
router.post("/create-playlist", isLoggedIn, createPlaylist);
router.delete("/delete-playlist/:playListId", isLoggedIn, deletePlaylist);

export default router;
