import db from "../libs/db.js";

const createPlaylist = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
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
      include: {
        problem: {
          include: {
            problem: true,
          },
        },
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

const getPlayListById = async (req, res) => {
  try {
    const {playListId} = req.params;
    
    if (!playListId) {
      return res.status(400).json({ message: "some error occured" });
    }

    const playlist = await db.playlist.findUnique({
      where: {
        id: playListId,
        userId: req.user.id,
      },
      include: {
        problem: {
          include: {
            problem: true,
          },
        },
      },
    });
    if (!playlist) {
      return res.status(404).json({ message: "playlists not found" });
    }

    return res.status(200).json({
      success: true,
      message: "playlist found successfully",
      playlist,
    });
  } catch (error) {
    console.error("error in fetching playlist", error);
    return res.status(400).json({
      success: false,
      message: "error in fetching playlist",
    });
  }
};

const addProblemInPlayList = async (req, res) => {
  try {
    const { playListId } = req.params;
    const { problemIds } = req.body;

    console.log(problemIds);
    
    if (!playListId && !problemIds) {
      return res.status(400).json({ error: "some error occured" });
    }

    if (!Array.isArray(problemIds) || problemIds.length === 0) {
      return res.status(400).json({ error: "Invalid or missing problemIds" });
    }
    const problemsInPlayList = await db.problemInPlayList.createMany({
      data: problemIds.map((problemId) => ({
        playListId,
        problemId,
      })),
      
       skipDuplicates: true,
    });

    return res.status(201).json({
      success: true,
      message: "problem added to playlist succesfully",
      problemsInPlayList,
    });
  } catch (error) {
    console.error("error in adding problem to playlist", error);
    return res.status(400).json({
      success: false,
      message: "error in adding problem to playlist",
    });
  }
};

const removeProblemInPlayList = async (req, res) => {
  try {
    const { playListId } = req.params;
    const { problemId } = req.body;

    if (!playListId && !problemId) {
      return res.status(400).json({ error: "some error occured" });
    }

    const deleteProblemsInPlayList = await db.problemInPlayList.deleteMany({
      where: {
        problemId,
        playListId,
      },
    });

    return res.status(201).json({
      success: true,
      message: "problem deleted to playlist succesfully",
      deleteProblemsInPlayList,
    });
  } catch (error) {
    console.error("error in deleting problem to playlist", error);
    return res.status(400).json({
      success: false,
      message: "error in deleting problem to playlist",
    });
  }
};

export {
  createPlaylist,
  deletePlaylist,
  getAllPlayLists,
  getPlayListById,
  addProblemInPlayList,
  removeProblemInPlayList,
};
