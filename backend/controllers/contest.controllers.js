import db from "../libs/db.js";
import {
  getLanguageNameById,
  pollBatchResults,
  submitBatch,
} from "../libs/judge0.lib.js";
import { addCodeExecutionJob } from "../libs/queue.lib.js";

const createContest = async (req, res) => {
  const userId = req.user.id;
  try {
    if (!userId) {
      return res.status(400).json({ message: "unauthorized" });
    }

    const { name, description, startTime, endTime, problems } = req.body;

    if (
      !name ||
      !startTime ||
      !endTime ||
      !Array.isArray(problems) ||
      problems.length === 0
    ) {
      return res.status(400).json({
        message: "all fields are required, including problems with marks",
      });
    }

    // Validate problems array
    for (const p of problems) {
      if (
        !p.problemId ||
        p.marks === undefined ||
        p.marks === null ||
        isNaN(p.marks) ||
        parseInt(p.marks) < 0
      ) {
        return res.status(400).json({
          message:
            "Each problem must have a valid problemId and non-negative marks",
        });
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
    const { getPaginationParams, paginatedResponse } = await import("../libs/pagination.lib.js");
    
    // Get pagination params (optional - defaults to all if not provided)
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    
    let queryOptions = {
      include: {
        problems: true,
      },
      orderBy: { createdAt: "desc" }
    };
    
    // Only apply pagination if page/limit provided
    if (page && limit) {
      const { skip, take } = getPaginationParams(req.query, {
        defaultLimit: 50,
        maxLimit: 100
      });
      queryOptions.skip = skip;
      queryOptions.take = take;
    }

    const [total, contests] = await Promise.all([
      db.contest.count(),
      db.contest.findMany(queryOptions)
    ]);

    if (!contests || contests.length === 0) {
      return res.status(404).json({ message: "no contests found" });
    }

    // Return paginated response if pagination requested
    if (page && limit) {
      return res.status(200).json({
        success: true,
        message: "contests fetched successfully",
        ...paginatedResponse(contests, total, page, limit)
      });
    }

    // Legacy response for backward compatibility
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

    // Get all submissions for the contest (include obtainedMarks)
    const submissions = await db.contestSubmission.findMany({
      where: { contestId: cid },
      select: {
        userId: true,
        problemId: true,
        status: true,
        createdAt: true,
        obtainedMarks: true,
      },
      orderBy: { createdAt: "asc" },
    });

    if (!submissions || submissions.length === 0) {
      return res
        .status(404)
        .json({ message: "no submissions found for this contest" });
    }

    // For each user, for each problem, keep the highest obtainedMarks (usually only one accepted per problem)
    const userProblemBest = {};
    submissions.forEach((sub) => {
      if (!userProblemBest[sub.userId]) userProblemBest[sub.userId] = {};
      const prev = userProblemBest[sub.userId][sub.problemId];
      if (!prev || (sub.obtainedMarks || 0) > (prev.obtainedMarks || 0)) {
        userProblemBest[sub.userId][sub.problemId] = sub;
      }
    });

    // Build leaderboard: userId -> { totalMarks, solvedCount, firstAcceptedAt }
    const leaderboardArr = Object.entries(userProblemBest).map(
      ([userId, problems]) => {
        let totalMarks = 0;
        let solvedCount = 0;
        let firstAcceptedAt = null;
        Object.values(problems).forEach((sub) => {
          if (sub.status === "Accepted" && (sub.obtainedMarks || 0) > 0) {
            totalMarks += sub.obtainedMarks || 0;
            solvedCount += 1;
            if (!firstAcceptedAt || sub.createdAt < firstAcceptedAt) {
              firstAcceptedAt = sub.createdAt;
            }
          }
        });
        return {
          userId,
          totalMarks,
          solvedCount,
          firstAcceptedAt,
        };
      },
    );

    // Fetch usernames for all userIds in leaderboard
    const userIds = leaderboardArr.map((entry) => entry.userId);
    const users = await db.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true },
    });
    const userMap = Object.fromEntries(users.map((u) => [u.id, u.name]));

    // Add username to each leaderboard entry
    leaderboardArr.forEach((entry) => {
      entry.username = userMap[entry.userId] || entry.userId;
    });

    // Sort by totalMarks desc, then solvedCount desc, then firstAcceptedAt asc
    leaderboardArr.sort((a, b) => {
      if (b.totalMarks !== a.totalMarks) return b.totalMarks - a.totalMarks;
      if (b.solvedCount !== a.solvedCount) return b.solvedCount - a.solvedCount;
      return new Date(a.firstAcceptedAt) - new Date(b.firstAcceptedAt);
    });

    return res.status(200).json({
      success: true,
      message: "leaderboard fetched successfully",
      leaderboard: leaderboardArr,
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
  if (
    marks === undefined ||
    marks === null ||
    isNaN(marks) ||
    parseInt(marks) < 0
  ) {
    return res.status(400).json({
      message: "Valid marks are required (must be a non-negative integer)",
    });
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

const contestSubmitCode = async (req, res) => {
  const {
    source_code,
    language_id,
    stdin,
    expected_outputs,
    problemId,
    contestId,
  } = req.body;
  const userId = req.user.id;

  console.log("Contest Code Submission Data:", {
    source_code,
    language_id,
    stdin,
    expected_outputs,
    problemId,
    contestId,
  }
  );
  

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (!contestId || !problemId) {
    return res
      .status(400)
      .json({ message: "contestId and problemId are required" });
  }

  try {
    if (
      !Array.isArray(stdin) ||
      stdin.length === 0 ||
      !Array.isArray(expected_outputs) ||
      expected_outputs.length !== stdin.length
    ) {
      return res.status(400).json({ error: "Invalid or missing testcase" });
    }

    // Add job to queue instead of direct execution
    const job = await addCodeExecutionJob({
      jobType: 'contest',
      userId,
      problemId,
      contestId,
      source_code,
      language_id,
      stdin,
      expected_outputs,
    });

    // Wait for job to complete
    const result = await job.waitUntilFinished();

    return res.status(201).json(result);
  } catch (error) {
    console.error("Error in contest code submission", error);
    return res.status(500).json({
      success: false,
      message: "Error in contest code submission",
      error: error.message || error,
    });
  }
};

// Calculate contest rating history for a user
const getUserContestRating = async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }
  try {
    // Get all contests the user participated in
    const registrations = await db.contestRegistration.findMany({
      where: { userId },
      include: { contest: true },
      orderBy: { createdAt: "asc" },
    });
    if (!registrations.length) {
      return res.json({ ratings: [] });
    }
    let rating = 1500;
    const ratings = [];
    for (const reg of registrations) {
      // Get leaderboard for this contest
      const submissions = await db.contestSubmission.findMany({
        where: { contestId: reg.contestId },
        select: { userId: true, problemId: true, status: true, createdAt: true, obtainedMarks: true },
        orderBy: { createdAt: "asc" },
      });
      // Build leaderboard logic (same as contestLeaderBoard)
      const userProblemBest = {};
      submissions.forEach((sub) => {
        if (!userProblemBest[sub.userId]) userProblemBest[sub.userId] = {};
        const prev = userProblemBest[sub.userId][sub.problemId];
        if (!prev || (sub.obtainedMarks || 0) > (prev.obtainedMarks || 0)) {
          userProblemBest[sub.userId][sub.problemId] = sub;
        }
      });
      const leaderboardArr = Object.entries(userProblemBest).map(
        ([userId, problems]) => {
          let totalMarks = 0;
          let solvedCount = 0;
          let firstAcceptedAt = null;
          Object.values(problems).forEach((sub) => {
            if (sub.status === "Accepted" && (sub.obtainedMarks || 0) > 0) {
              totalMarks += sub.obtainedMarks || 0;
              solvedCount += 1;
              if (!firstAcceptedAt || sub.createdAt < firstAcceptedAt) {
                firstAcceptedAt = sub.createdAt;
              }
            }
          });
          return {
            userId,
            totalMarks,
            solvedCount,
            firstAcceptedAt,
          };
        },
      );
      leaderboardArr.sort((a, b) => {
        if (b.totalMarks !== a.totalMarks) return b.totalMarks - a.totalMarks;
        if (b.solvedCount !== a.solvedCount) return b.solvedCount - a.solvedCount;
        return new Date(a.firstAcceptedAt) - new Date(b.firstAcceptedAt);
      });
      // Find user's rank
      const rank = leaderboardArr.findIndex((u) => u.userId === userId) + 1;
      // Elo-like update: higher rank = more points, lower = less (demo only)
      let delta = 0;
      if (rank > 0) {
        const n = leaderboardArr.length;
        delta = Math.round(100 * (n - rank) / (n - 1 || 1)); // 0-100 scale
      }
      rating += delta - 50; // Centered at 0, so top = +50, bottom = -50
      ratings.push({ contestName: reg.contest.name, rating,rank });
    }
    return res.json({ ratings });
  } catch (error) {
    console.error("Error in getUserContestRating", error);
    return res.status(500).json({ message: "Error fetching contest rating history" });
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
  getAllProblemsInContest,
  registerForContest,
  isRegisteredForContest, 
  unRegisterContest,
  contestSubmitCode,
  getUserContestRating,
};
