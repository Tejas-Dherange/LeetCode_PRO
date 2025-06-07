import {
  getLanguageNameById,
  pollBatchResults,
  submitBatch,
} from "../libs/judge0.lib.js";
import db from "../libs/db.js";

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

    const submissions = stdin.map((input) => ({
      source_code,
      language_id,
      stdin: input,
    }));

    const submissionResults = await submitBatch(submissions);
    const tokens = submissionResults.map((res) => res.token);
    const results = await pollBatchResults(tokens);

    let allPassed = true;
    const detailedResults = results.map((result, i) => {
      const stdout = result.stdout !== null ? result.stdout.trim() : result.stdout;
      const expected_output = expected_outputs[i].trim();
      const passed = stdout == expected_output;
      if (!passed) allPassed = false;
      return {
        testcase: i + 1,
        passed,
        stdout,
        expected: expected_output,
        stderr: result.stderr || null,
        compileOutput: result.compile_output || null,
        status: result.status.description,
        memory: result.memory ? `${result.memory} KB` : undefined,
        time: result.time ? `${result.time} s` : undefined,
        stdin: stdin[i] || null,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Code executed successfully (not saved)",
      allPassed,
      results: detailedResults,
    });
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
  const { source_code, language_id, stdin, expected_outputs, problemId } = req.body;
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

    const submissions = stdin.map((input) => ({
      source_code,
      language_id,
      stdin: input,
    }));

    const submissionResults = await submitBatch(submissions);
    const tokens = submissionResults.map((res) => res.token);
    const results = await pollBatchResults(tokens);

    let allPassed = true;
    const detailedResults = results.map((result, i) => {
      const stdout = result.stdout !== null ? result.stdout.trim() : result.stdout;
      const expected_output = expected_outputs[i].trim();
      const passed = stdout == expected_output;
      if (!passed) allPassed = false;
      return {
        testcase: i + 1,
        passed,
        stdout,
        expected: expected_output,
        stderr: result.stderr || null,
        compileOutput: result.compile_output || null,
        status: result.status.description,
        memory: result.memory ? `${result.memory} KB` : undefined,
        time: result.time ? `${result.time} s` : undefined,
        stdin: stdin[i] || null,
      };
    });

    // Save submission to DB
    const submission = await db.submission.create({
      data: {
        userId,
        problemId,
        sourceCode: source_code,
        language: getLanguageNameById(language_id),
        stdin: stdin.join("/n"),
        stdout: JSON.stringify(detailedResults.map((r) => r.stdout)),
        time: detailedResults.some((r) => r.time)
          ? JSON.stringify(detailedResults.map((r) => r.time))
          : null,
        memory: detailedResults.some((r) => r.memory)
          ? JSON.stringify(detailedResults.map((r) => r.memory))
          : null,
        stderr: detailedResults.some((r) => r.stderr)
          ? JSON.stringify(detailedResults.map((r) => r.stderr))
          : null,
        compile_output: detailedResults.some((r) => r.compileOutput)
          ? JSON.stringify(detailedResults.map((r) => r.compileOutput))
          : null,
        status: allPassed ? "Accepted" : "Wrong Answer",
      },
    });

    if (allPassed) {
      await db.problemSolved.upsert({
        where: {
          userId_problemId: {
            userId,
            problemId,
          },
        },
        update: {},
        create: {
          userId,
          problemId,
        },
      });
    }

    const testCaseResults = detailedResults.map((result) => ({
      submissionId: submission.id,
      testcase: result.testcase,
      passed: result.passed,
      stdout: result.stdout,
      expected: result.expected,
      stderr: result.stderr,
      compileOutput: result.compileOutput,
      status: result.status,
      memory: result.memory,
      time: result.time,
    }));

    await db.teastCaseResult.createMany({
      data: testCaseResults,
    });

    const submissionWithTestcase = await db.submission.findUnique({
      where: {
        id: submission.id,
      },
      include: {
        testCases: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Code submitted and saved successfully",
      submission: submissionWithTestcase,
    });
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
