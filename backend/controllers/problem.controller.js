import db from "../libs/db.js";
import {
  getLanguageById,
  pollBatchResults,
  submitBatch,
} from "../libs/judge0.lib.js";
import axios from "axios"

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
    editorial,
    testcases,
    codeSnippet,
    referenceSolutions,
  } = req.body;

  const user = req.user;
  if (user.role !== "ADMIN") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  console.log(title,user.id);
  
  //*********** after checking uncomment it */
  //   if (
  //     !title ||
  //     !description ||
  //     !difficulty ||
  //     !tags ||
  //     !examples ||
  //     !constraints ||
  //     !testcases ||
  //     !codeSnippet ||
  //     !referenceSolutions
  //   ) {
  //     return res.status(400).json({ message: "All fields are required" });
  //   }

  try {
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
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

      const tokens = submissionResults.map((res) => res.token);

      const results = await pollBatchResults(tokens);

      for (let i = 0; i < results.length; i++) {
        console.log("results",results[i]);
        
        const result = results[i];

        if (result.status.id !== 3) {
          return res
            .status(400)
            .json({ error: `testcases ${i + 1} failed for ${language}` });
        }
      }

      const newProblem = await db.problem.create(
        {
        data:{
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        editorial,
        testcases,
        codeSnippet,
        referenceSolutions,
        userId:user.user.id
      }
    });

      if (!newProblem) {
        return res.status(400).json({ message: "error in creating problem" });
      }

      return res.status(200).json({ message: "problem created succesfully" });
    }
  } catch (error) {
    console.error(error, "error in creating problem");
    return res.status(400).json({ message: "error while creating problem" });
  }
};
const getProblemById = async (req, res) => {

};
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
