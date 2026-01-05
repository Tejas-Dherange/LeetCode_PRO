import db from "../libs/db.js";
import {
  getLanguageById,
  pollBatchResults,
  submitBatch,
} from "../libs/judge0.lib.js";
import { processCodeSnippet } from "../libs/codeTemplateEngine.js";

const createProblem = async (req, res) => {
  //taking data from body
  //check if user is admin
  //check if all fields are present
  //loop through each reference solution for different languages

  const {
    title,
    description,
    difficulty,
    tags,
    companyTags, // <-- add this
    examples,
    constraints,
    testcases,
    hints,
    codeSnippets,
    referenceSolutions,
  } = req.body;

  const user = req.user;
  if (user.role !== "ADMIN") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      console.log(language);

      const languageId = getLanguageById(language);
      if (!languageId) {
        return res
          .status(400)
          .json({ error: `Language ${language} is not supported` });
      }

      const submissions = testcases.map(({ input, output }) => ({
        source_code: solutionCode,
        stdin: input,
        language_id: languageId,
        expected_output: output,
      }));

      const submissionResults = await submitBatch(submissions);
      console.log("✅ Batch submitted successfully for", language);
      console.log("📝 Tokens received:", submissionResults.map(r => r.token));

      const tokens = submissionResults.map((res) => res.token);

      console.log("⏳ Polling for results...");
      
      const results = await pollBatchResults(tokens);

      console.log("✅ Results received for", language);
      console.log("📊 Total results:", results.length);
      for (let i = 0; i < results.length; i++) {
        const result = results[i];

        console.log("result", result);

        if (result.status.id !== 3) {
          console.error(`Testcase ${i + 1} failed for ${language}`);

          return res.status(400).json({
            error: `Testcase ${i + 1} failed for ${language}`,
            details: {
              status: result.status,
              expected: testcases[i].output,
              actual: result.stdout,
              stderr: result.stderr,
              compile_output: result.compile_output,
            },
          });
        }
      }
    }

    const newProblem = await db.problem.create({
      data: {
        title,
        description,
        difficulty,
        tags,
        companyTags, // <-- add this
        examples,
        hints,
        constraints,
        testcase: testcases,
        codeSnippet: codeSnippets,
        referenceSolution: referenceSolutions,
        userId: req.user.id,
      },
    });

    if (!newProblem) {
      return res.status(400).json({ message: "Error creating problem" });
    }

    return res.status(200).json({
      message: "Problem created successfully",
      problem: { newProblem },
    });
  } catch (error) {
    console.error("Error in creating problem:",error);
    return res
      .status(400)  
      .json({ message: "Catch block error while creating problem" });
  }
};

const getProblemById = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({
        message: "some error occured",
      });
    }

    const problem = await db.problem.findUnique({
      where: {
        id,
      },
    });

    if (!problem) {
      return res.status(404).json({
        message: "problem not found",
      });
    }

    console.log("problem", problem);

    // Process code snippets to extract student-visible code
    const studentCodeSnippet = {};
    
    if (problem.codeSnippet && typeof problem.codeSnippet === 'object') {
      for (const [language, code] of Object.entries(problem.codeSnippet)) {
        const processed = processCodeSnippet(code);
        studentCodeSnippet[language] = processed.studentView;
      }
    }

    return res.status(200).json({
      success: true,
      message: "problem found successfully",
      problem: {
        ...problem,
        studentCodeSnippet, // Add processed student-visible code
      },
    });
  } catch (error) {
    console.error("Error in fetching problem by id:", error);
    return res.status(400).json({
      success: false,
      message: "error in fetching problem by id",
    });
  }
};

const getAllProblems = async (req, res) => {
  const id = req.user.id;

  if (!id) {
    return res.status(400).json({ message: "Unauthorized" });
  }

  try {
    // Extract pagination and filter parameters from query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || "";
    const difficulty = req.query.difficulty || "";
    const tag = req.query.tag || "";

    // Calculate skip for offset-based pagination
    const skip = (page - 1) * limit;

    // Build where clause for filtering
    const whereClause = {};

    // Search filter (title contains search term)
    if (search) {
      whereClause.title = {
        contains: search,
        mode: "insensitive", // case-insensitive search
      };
    }

    // Difficulty filter
    if (difficulty && difficulty !== "ALL") {
      whereClause.difficulty = difficulty;
    }

    // Tag filter
    if (tag && tag !== "ALL") {
      whereClause.tags = {
        has: tag,
      };
    }

    // Get total count for pagination metadata
    const total = await db.problem.count({
      where: whereClause,
    });

    // Fetch problems with pagination and filters
    const allProblems = await db.problem.findMany({
      where: whereClause,
      include: {
        solvedBy: {
          where: {
            userId: req.user.id,
          },
        },
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc", // newest first
      },
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;

    return res.status(200).json({
      message: "Problems fetched successfully",
      allProblems,
      pagination: {
        total,
        currentPage: page,
        totalPages,
        hasMore,
        limit,
      },
    });
  } catch (error) {
    console.error("Error in fetching all problems:", error);
    return res.status(400).json({
      success: false,
      message: "error in fetching all problems",
    });
  }
};

const deleteProblem = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(id);

    if (!id) {
      return res.status(400).json({ message: "some error occured" });
    }

    const problem = await db.problem.findUnique({
      where: {
        id,
      },
    });

    console.log(problem);

    if (!problem) {
      return res.status(404).json({
        message: "problem not found",
      });
    }

    await db.problem.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "problem deleted successfully",
      problem,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "error in deleting problem ",
    });
  }
};

const updateProblem = async (req, res) => {
  const {
    title,
    description,
    difficulty,
    tags,
    companyTags, // <-- add this
    examples,
    constraints,
    testcases,
    codeSnippets,
    referenceSolutions,
  } = req.body;

  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      message: "some error occured",
    });
  }

  const user = req.user;
  if (user.role !== "ADMIN") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      console.log(language);

      const languageId = getLanguageById(language);
      if (!languageId) {
        return res
          .status(400)
          .json({ error: `Language ${language} is not supported` });
      }

      const submissions = testcases.map(({ input, output }) => ({
        source_code: solutionCode,
        stdin: input,
        language_id: languageId,
        expected_output: output,
      }));

      const submissionResults = await submitBatch(submissions);
      console.log("ndfhufghig", submissionResults);

      const tokens = submissionResults.map((res) => res.token);

      const results = await pollBatchResults(tokens);

      // console.log(results);
      for (let i = 0; i < results.length; i++) {
        const result = results[i];

        console.log("result", result);

        if (result.status.id !== 3) {
          console.error(`Testcase ${i + 1} failed for ${language}`);

          return res.status(400).json({
            error: `Testcase ${i + 1} failed for ${language}`,
            details: {
              status: result.status,
              expected: testcases[i].output,
              actual: result.stdout,
              stderr: result.stderr,
              compile_output: result.compile_output,
            },
          });
        }
      }
    }

    const newProblem = await db.problem.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        difficulty,
        tags,
        companyTags, // <-- add this
        examples,
        constraints,
        testcase: testcases,
        codeSnippet: codeSnippets,
        referenceSolution: referenceSolutions,
        userId: req.user.id,
      },
    });

    if (!newProblem) {
      return res.status(400).json({ message: "Error in updating problem" });
    }

    return res.status(200).json({
      message: "Problem updated successfully",
      problem: { newProblem },
    });
  } catch (error) {
    console.error("Error in updating problem:");
    return res
      .status(400)
      .json({ message: "Catch block error while updating problem" });
  }
};

const getAllProblemsSolvedByUser = async (req, res) => {
  try {
    const id = req.user.id;

    console.log(id);

    if (!id) {
      return res.status(400).json({ message: "some error occured" });
    }

    const problemSolvedByUser = await db.problem.findMany({
      where: {
        solvedBy: {
          some: {
            userId: id,
          },
        },
      },
      include: {
        solvedBy: {
          where: {
            userId: id,
          },
        },
      },
    });

    console.log(problemSolvedByUser);

    if (!problemSolvedByUser) {
      return res.status(404).json({
        message: "problem not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "problem solved by user found successfully",
      problemSolvedByUser,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "error in fetching problem solved by user",
    });
  }
};

const getProblemByMultipleIds = async (req, res) => {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: "Invalid problem IDs" });
  }

  try {
    const problems = await db.problem.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    if (problems.length === 0) {
      return res.status(404).json({ message: "No problems found" });
    }

    return res.status(200).json({
      success: true,
      message: "Problems fetched successfully",
      problems,
    });
  } catch (error) {
    console.error("Error fetching problems by multiple IDs:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export {
  createProblem,
  getProblemById,
  getAllProblems,
  deleteProblem,
  updateProblem,
  getAllProblemsSolvedByUser,
  getProblemByMultipleIds,
};
