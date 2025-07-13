import db from "../libs/db.js";

const getSubmissionForProblem = async (req, res) => {
  const { problemId } = req.params;
  const userId = req.user.id;
  if (!problemId) {
    return res.status(400).json({ message: "problemId is required" });
  }
  try {
    const submissions = await db.contestSubmission.findMany({
      where: { problemId, userId },
    });
    // console.log("Submissions for problemId:", problemId, "UserId:", userId, "Submissions:", submissions);
    
    return res.json({ submissions });
  } catch (error) {
    console.error("Error in getSubmissionForProblem", error);
    return res.status(500).json({ message: "Error fetching submissions" });
  }
};

const getCountOfSubmissions = async (req, res) => {
  const { problemId } = req.params;
  const userId = req.user.id;
  if (!problemId) {
    return res.status(400).json({ message: "problemId is required" });
  }
  try {
    const count = await db.contestSubmission.count({
      where: { problemId, userId },
    });
    return res.json({ count });
  } catch (error) {
    console.error("Error in getCountOfSubmissions", error);
    return res.status(500).json({ message: "Error fetching submission count" });
  }
};

export { getSubmissionForProblem, getCountOfSubmissions };