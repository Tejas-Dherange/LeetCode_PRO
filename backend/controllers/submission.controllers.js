import db from "../libs/db.js";
const getSubmissionByUserAndProblem = async (req, res) => {
  try {
    const { problemId, userId } = req.params;
    if (!problemId || !userId) {
      return res.status(400).json({ message: "some error occured" });
    }
    const submission = await db.submission.findMany({
      where: {
        problemId,
        userId,
      },
    });

    if (!submission) {
      return res
        .status(404)
        .json({ message: "submission not found for user and problem" });
    }
    return res.status(200).json({
      message: "Submission fetched succesfully for user and problem",
      submission,
    });
  } catch (error) {
    console.error("error in getting submission by user and problem", error);
    return res.status(400).json({
      success: false,
      message: "error in getting submission by user and problem",
    });
  }
};

const getAllSubmissions = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ message: "Unauthorized" });
    }

    const allSubmissions = await db.submission.findMany({
      where: {
        userId,
      },
    });

    if (!allSubmissions) {
      return res.status(404).json({ message: "submissions not found" });
    }

    return res.status(200).json({
      message: "Submissions fetched succesfully",
      allSubmissions,
    });
  } catch (error) {
    console.log(error);

    return res.status(400).json({
      success: false,
      message: "error in fetching all submissions",
    });
  }
};

const getAllSubmissionsForProblem = async (req, res) => {
  try {
    const { problemId } = req.params;
    const { userId } = req.user.id;
    if (!problemId) {
      return res.status(400).json({ message: "some error occured" });
    }

    const allSubmissions = await db.submission.findMany({
      where: {
        userId,
        problemId,
      },
    });

    if (!allSubmissions) {
      return res
        .status(404)
        .json({ message: "submissions not found for problem" });
    }

    return res.status(200).json({
      message: "Submissions fetched succesfully for problem",
      allSubmissions,
    });
  } catch (error) {
    console.error("error in getting all submission for problem", error);
    return res.status(400).json({
      success: false,
      message: "error in fetching all submissions for problrm",
    });
  }
};

const countSubmissions = async (req, res) => {
  try {
    const { problemId } = req.params;

    if (!problemId) {
      return res.status(400).json({ message: "some error occured" });
    }

    const count = await db.submission.count({
      where: {
        problemId,
        userId: req.user.id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "submissions count found successfully",
      count,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "error in fetching all submissions",
    });
  }
};

export {
  //   getSubmissionById,
  getAllSubmissions,
  countSubmissions,
  getAllSubmissionsForProblem,
  getSubmissionByUserAndProblem,
};
