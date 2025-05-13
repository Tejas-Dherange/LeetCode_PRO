import db from "../libs/db.js";

const createPlaylist = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!title) {
      return res.status(404).json({ error: "title is required" });
    }

    const playlist = await db.playlist.create({
      data: {
        name,
        description,
        userId: req.user.id,
      },
    });

    if (!playlist) {
      return res.status(404).json({ error: "error in creatin playlist" });
    }

    return res.status(201).json({
      success: true,
      message: "playlist created succesfully",
      playlist,
    });
  } catch (error) {
    console.error("error in creating playlist", error);
    return res.status(400).json({
      success: false,
      message: "error in creating playlist",
    });
  }
};
const deletePlaylist = async (req, res) => {
  try {
    const { playListId } = req.params;

    if (!playListId) {
      return res.status(404).json({ error: "playlist  not found" });
    }

    const deletedPlaylist = await db.playlist.delete({
      where: {
        id: playListId,
      },
    });

    if (!deletedPlaylist) {
      return res.status(400).json({ error: "error in deleting playlist" });
    }

    return res.status(200).json({
      success: true,
      message: "playlist deleted successfully",
    });
  } catch (error) {
    console.error("error in deleting playlist", error);
    return res.status(400).json({
      success: false,
      message: "error in deleting playlist",
    });
  }
};
const getAllPlayLists = async (req, res) => {
  try {
    const allPlaylists = await db.playlist.findMany({
      where: {
        userId: req.user.id,
      },
    });

    if (!allPlaylists) {
      return res.status(404).json({ message: "playlists not found" });
    }

    return res.status(200).json({
      success: true,
      message: "playlists fetched succesfully",
      allPlaylists,
    });
  } catch (error) {
    console.error("error in fetching playlist", error);
    return res.status(400).json({
      success: false,
      message: "error in fetching playlist",
    });
  }
};
const getPlayListById = async (req, res) => {};
const addProblemInPlayList = async (req, res) => {};
const removeProblemInPlayList = async (req, res) => {};

export {
  createPlaylist,
  deletePlaylist,
  getAllPlayLists,
  getPlayListById,
  addProblemInPlayList,
  removeProblemInPlayList,
};
