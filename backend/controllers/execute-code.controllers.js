import {
  getLanguageNameById,
  pollBatchResults,
  submitBatch,
} from "../libs/judge0.lib.js";
import db from "../libs/db.js";
import { updatePatternProgress } from "./pattern.controllers.js";
import { addCodeExecutionJob } from "../libs/queue.lib.js";

// Controller: Run code (no DB save, just return results)
const runCode = async (req, res) => {
  const { source_code, language_id, stdin, expected_outputs } = req.body;
  const userId = req.user.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
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
      jobType: 'run',
      userId,
      problemId: null,
      source_code,
      language_id,
      stdin,
      expected_outputs,
    });

    // Wait for job to complete
    const result = await job.waitUntilFinished();

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in running code", error);
    return res.status(500).json({
      success: false,
      message: "Error in running code",
      error: error.message || error,
    });
  }
};


// Controller: Submit code (save to DB)
const submitCode = async (req, res) => {
  const { source_code, language_id, stdin, expected_outputs, problemId, contestId } = req.body;
  const userId = req.user.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!problemId) {
    return res.status(400).json({ message: "problemId is required" });
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
      jobType: contestId ? 'contest' : 'submit',
      userId,
      problemId,
      contestId, // Pass contestId to job
      source_code,
      language_id,
      stdin,
      expected_outputs,
    });

    // Wait for job to complete
    const result = await job.waitUntilFinished();

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in submitting code", error);
    return res.status(500).json({
      success: false,
      message: "Error in submitting code",
      error: error.message || error,
    });
  }
};

export { runCode, submitCode };
