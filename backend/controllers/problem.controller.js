import db from "../libs/db.js";
import { getLanguageById, pollBatchResults, submitBatch } from "../libs/judge0.lib.js";

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
    examples,
    constraints,
    hints,
    editorial,
    testcase,
    codeSnippet,
    referenceSolution,
  } = req.body;

  const user = req.user;
  if (user.role !== "ADMIN") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  //*********** after checking uncomment it */
  //   if (
  //     !title ||
  //     !description ||
  //     !difficulty ||
  //     !tags ||
  //     !examples ||
  //     !constraints ||
  //     !testcase ||
  //     !codeSnippet ||
  //     !referenceSolution
  //   ) {
  //     return res.status(400).json({ message: "All fields are required" });
  //   }

  try {
    for (const [language, solutionCode] of Object.entries(referenceSolution)) {
      const languageId = getLanguageById(language);
      if (!languageId) {
        return res
          .status(400)
          .json({ error: `Language ${language} is not supported` });
      }

      const submissions = testcase.map(({ input, output }) => ({
        source_code: solutionCode,
        stdin: input,
        language_id: languageId,
        expected_output: output,
      }));

      const submissionResults = await submitBatch(submissions);

      const tokens = submissionResults.map((res) => res.token);

      const results=await pollBatchResults(tokens);

      
    }
  } catch (error) {}
};
const getProblemById = async (req, res) => {};
const getAllProblems = async (req, res) => {};
const deleteProblem = async (req, res) => {};
const updateProblem = async (req, res) => {};
const getAllProblemsSolvedByUser = async (req, res) => {};

export {
  createProblem,
  getProblemById,
  getAllProblems,
  deleteProblem,
  updateProblem,
  getAllProblemsSolvedByUser,
};
