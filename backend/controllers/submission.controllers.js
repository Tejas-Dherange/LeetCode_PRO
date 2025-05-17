import db from "../libs/db.js";
// const getSubmissionById = (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!id) {
//       return res.status(400).json({ message: "some error occured" });
//     }

//     const submission = db.submission.findUnique({
//       where: {
//         problemId:id,
//       },
//     });

//     if (!submission) {
//       return res.status(404).json({ message: "submission not found" });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "submission found successfully",
//       submission,
//     });
//   } catch (error) {
//     return res.status(400).json({
//       success: false,
//       message: "error in fetching submission by id",
//     });
//   }
// };

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
};
