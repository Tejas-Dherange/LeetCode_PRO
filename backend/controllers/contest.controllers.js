import db from "../libs/db.js";

const createContest = async (req, res) => {
  const userId = req.user.id;
  try {
    if (!userId) {
      return res.status(400).json({ message: "unauthorized" });
    }

    const { name, description, startTime, endTime, problems } = req.body;

    if (!name || !startTime || !endTime || !Array.isArray(problems) || problems.length === 0) {
      return res.status(400).json({ message: "all fields are required, including problems with marks" });
    }

    // Validate problems array
    for (const p of problems) {
      if (!p.problemId || p.marks === undefined || p.marks === null || isNaN(p.marks) || parseInt(p.marks) < 0) {
        return res.status(400).json({ message: "Each problem must have a valid problemId and non-negative marks" });
      }
    }

    const contest = await db.contest.create({
      data: {
        name,
        description,
        startTime,
        endTime,
        createdBy: userId,
        problems: {
          create: problems.map((p) => ({
            problem: { connect: { id: p.problemId } },
            marks: parseInt(p.marks),
          })),
        },
      },
      include: {
        problems: { include: { problem: true } },
      },
    });

    if (!contest) {
      return res.status(400).json({ message: "error in creating contest" });
    }
    return res.status(201).json({
      success: true,
      message: "contest created successfully",
      contest,
    });
  } catch (error) {
    console.error("error in creating contest", error);
    return res.status(500).json({
      success: false,
      message: "error in creating contest",
    });
  }
};

const getAllContest = async (req, res) => {
  try {
    const contests = await db.contest.findMany({
      include: {
        problems: true,
      },
    });

    if (!contests) {
      return res.status(404).json({ message: "no contests found" });
    }

    return res.status(200).json({
      success: true,
      message: "contests fetched successfully",
      contests,
    });
  } catch (error) {
    console.error("error in fetching contests", error);
    return res.status(500).json({
      success: false,
      message: "error in fetching contests",
    });
  }
};

const getContestById = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(400).json({ message: "contest id is required" });
    }

    const contest = await db.contest.findUnique({
      where: { id },
      include: {
        problems: true,
      },
    });

    if (!contest) {
      return res.status(404).json({ message: "contest not found" });
    }

    return res.status(200).json({
      success: true,
      message: "contest fetched successfully",
      contest,
    });
  } catch (error) {
    console.error("error in fetching contest", error);
    return res.status(500).json({
      success: false,
      message: "error in fetching contest",
    });
  }
};

const deleteContest = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(400).json({ message: "contest id is required" });
    }

    const contest = await db.contest.delete({
      where: { id },
    });

    if (!contest) {
      return res.status(404).json({ message: "contest not found" });
    }

    return res.status(200).json({
      success: true,
      message: "contest deleted successfully",
      contest,
    });
  } catch (error) {
    console.error("error in deleting contest", error);
    return res.status(500).json({
      success: false,
      message: "error in deleting contest",
    });
  }
};

// const contestInterface = async (req, res) => {
//   const { cid, pid } = req.params;
//   try {
//     if (!cid || !pid) {
//       return res
//         .status(400)
//         .json({ message: "contest id and problem id are required" });
//     }

//     const contest = await db.contest.findUnique({
//       where: { id: cid },
//       include: {
//         problems: true,
//       },
//     });

//     if (!contest) {
//       return res.status(404).json({ message: "contest not found" });
//     }

//     const problem = contest.problems.find((p) => p.id === pid);
//     if (!problem) {
//       return res
//         .status(404)
//         .json({ message: "problem not found in this contest" });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "contest interface fetched successfully",
//       contest,
//       problem,
//     });
//   } catch (error) {
//     console.error("error in fetching contest interface", error);
//     return res.status(500).json({
//       success: false,
//       message: "error in fetching contest interface",
//     });
//   }
// };

const contestLeaderBoard = async (req, res) => {
  const { cid } = req.params;
  try {
    if (!cid) {
      return res.status(400).json({ message: "contest id is required" });
    }

    // Get all submissions for the contest
    const submissions = await db.contestSubmission.findMany({
      where: { contestId: cid },
      select: {
        userId: true,
        problemId: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });

    if (!submissions || submissions.length === 0) {
      return res
        .status(404)
        .json({ message: "no submissions found for this contest" });
    }

    // Only consider accepted submissions
    const accepted = submissions.filter((s) => s.status === "Accepted");

    // Build leaderboard: userId -> { solvedCount, solvedProblems, firstAcceptedAt }
    const leaderboardMap = {};

    accepted.forEach((sub) => {
      if (!leaderboardMap[sub.userId]) {
        leaderboardMap[sub.userId] = {
          userId: sub.userId,
          solvedProblems: new Set(),
          firstAcceptedAt: sub.createdAt,
        };
      }
      leaderboardMap[sub.userId].solvedProblems.add(sub.problemId);
      if (sub.createdAt < leaderboardMap[sub.userId].firstAcceptedAt) {
        leaderboardMap[sub.userId].firstAcceptedAt = sub.createdAt;
      }
    });

    // Convert to array and sort
    const leaderboard = Object.values(leaderboardMap)
      .map((entry) => ({
        userId: entry.userId,
        solvedCount: entry.solvedProblems.size,
        firstAcceptedAt: entry.firstAcceptedAt,
      }))
      .sort((a, b) => {
        // Sort by solvedCount desc, then by firstAcceptedAt asc
        if (b.solvedCount !== a.solvedCount) {
          return b.solvedCount - a.solvedCount;
        }
        return new Date(a.firstAcceptedAt) - new Date(b.firstAcceptedAt);
      });

    return res.status(200).json({
      success: true,
      message: "leaderboard fetched successfully",
      leaderboard,
    });
  } catch (error) {
    console.error("error in fetching leaderboard", error);
    return res.status(500).json({
      success: false,
      message: "error in fetching leaderboard",
    });
  }
};

const addProblemToContest = async (req, res) => {
  const { problemId, marks } = req.body;
  const { contestId } = req.params;

  if (!contestId || !problemId) {
    return res
      .status(400)
      .json({ message: "contestId and problemId are required" });
  }

  // Validate marks
  if (marks === undefined || marks === null || isNaN(marks) || parseInt(marks) < 0) {
    return res.status(400).json({ message: "Valid marks are required (must be a non-negative integer)" });
  }

  try {
    // Check if contest exists
    const contest = await db.contest.findUnique({
      where: { id: contestId },
    });
    if (!contest) {
      return res.status(404).json({ message: "Contest not found" });
    }

    // Check if problem exists
    const problem = await db.problem.findUnique({
      where: { id: problemId },
    });
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // Check if already added
    const exists = await db.contestProblem.findUnique({
      where: {
        contestId_problemId: {
          contestId,
          problemId,
        },
      },
    });
    if (exists) {
      return res
        .status(400)
        .json({ message: "Problem already added to contest" });
    }

    // Add problem to contest
    const contestProblem = await db.contestProblem.create({
      data: {
        contestId,
        problemId,
        marks: parseInt(marks),
      },
    });

    return res.status(201).json({
      success: true,
      message: "Problem added to contest successfully",
      contestProblem,
    });
  } catch (error) {
    console.error("Error adding problem to contest", error);
    return res.status(500).json({
      success: false,
      message: "Error adding problem to contest",
    });
  }
};

const contestProblemSubmission = async (req, res) => {
  const { cid, pid } = req.params;
  const {
    sourceCode,
    language,
    stdin,
    stdout,
    time,
    stderr,
    compile_output,
    status,
    memory,
  } = req.body;

  if (!cid || !pid || !sourceCode || !language) {
    return res.status(400).json({
      message: "contest id, problem id, sourceCode and language are required",
    });
  }

  try {
    // Check if contest exists
    const contest = await db.contest.findUnique({
      where: { id: cid },
    });
    if (!contest) {
      return res.status(404).json({ message: "Contest not found" });
    }

    // Check if problem exists in contest
    const problem = await db.contestProblem.findFirst({
      where: { contestId: cid, problemId: pid },
    });
    if (!problem) {
      return res
        .status(404)
        .json({ message: "Problem not found in this contest" });
    }

    // Create submission
    const submission = await db.contestSubmission.create({
      data: {
        contestId: cid,
        problemId: pid,
        userId: req.user.id,
        sourceCode, // should be JSON (string or object)
        language,
        stdin: stdin || null,
        stdout: stdout || null,
        time: time || null,
        stderr: stderr || null,
        compile_output: compile_output || null,
        status: status || "Pending", // default to Pending
        memory: memory || null, // default to null
      },
    });

    return res.status(201).json({
      success: true,
      message: "Submission created successfully",
      submission,
    });
  } catch (error) {
    console.error("Error in contest submission", error);
    return res.status(500).json({
      success: false,
      message: "Error in contest submission",
    });
  }
};

const getAllProblemsInContest = async (req, res) => {
  const { cid } = req.params;

  if (!cid) {
    return res.status(400).json({ message: "contest id is required" });
  }

  try {
    const contest = await db.contest.findUnique({
      where: { id: cid },
      include: {
        problems: {
          include: {
            problem: true,
          },
        },
      },
    });

    if (!contest) {
      return res.status(404).json({ message: "contest not found" });
    }

    return res.status(200).json({
      success: true,
      message: "problems fetched successfully",
      problems: contest.problems,
    });
  } catch (error) {
    console.error("error in fetching problems", error);
    return res.status(500).json({
      success: false,
      message: "error in fetching problems",
    });
  }
};

const registerForContest = async (req, res) => {
  const userId = req.user.id;
  const { contestId } = req.body;

  if (!userId || !contestId) {
    return res
      .status(400)
      .json({ message: "userId and contestId are required" });
  }

  try {
    // Check if already registered
    const exists = await db.contestRegistration.findUnique({
      where: { userId_contestId: { userId, contestId } },
    });
    if (exists) {
      return res
        .status(400)
        .json({ message: "Already registered for this contest" });
    }

    const registration = await db.contestRegistration.create({
      data: { userId, contestId },
    });

    return res.status(201).json({
      success: true,
      message: "Registered for contest successfully",
      registration,
    });
  } catch (error) {
    console.error("Error registering for contest", error);
    return res.status(500).json({
      success: false,
      message: "Error registering for contest",
    });
  }
};
const isRegisteredForContest = async (req, res) => {
  const userId = req.user.id;
  const { contestId } = req.params;
  const exists = await db.contestRegistration.findUnique({
    where: { userId_contestId: { userId, contestId } },
  });
  res.json({ registered: !!exists });
};

const unRegisterContest = async (req, res) => {
  const userId = req.user.id;
  const { contestId } = req.params;

  if (!userId || !contestId) {
    return res
      .status(400)
      .json({ message: "userId and contestId are required" });
  }

  try {
    // Check if registration exists
    const registration = await db.contestRegistration.findUnique({
      where: { userId_contestId: { userId, contestId } },
    });
    if (!registration) {
      return res
        .status(404)
        .json({ message: "Not registered for this contest" });
    }

    await db.contestRegistration.delete({
      where: { userId_contestId: { userId, contestId } },
    });

    return res.status(200).json({
      success: true,
      message: "Unregistered from contest successfully",
    });
  } catch (error) {
    console.error("Error unregistering from contest", error);
    return res.status(500).json({
      success: false,
      message: "Error unregistering from contest",
    });
  }
};

export {
  createContest,
  getAllContest,
  // contestInterface,
  contestLeaderBoard,
  getContestById,
  deleteContest,
  addProblemToContest,
  contestProblemSubmission,
  getAllProblemsInContest,
  registerForContest,
  isRegisteredForContest,
  unRegisterContest,
};
