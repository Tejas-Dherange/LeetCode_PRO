import {
  getLanguageNameById,
  pollBatchResults,
  submitBatch,
} from "../libs/judge0.lib.js";
import db from "../libs/db.js"; 

const executeCode = async (req, res) => {
  const { source_code, language_id, stdin, expected_outputs, problemId } =
    req.body;

  const userId = req.user.id;

  if (!userId) {
    return res.status(400).json({ message: "Unauthorized" });
  }

  try {
    if (
      !Array.isArray(stdin) ||
      stdin.length === 0 ||
      !Array.isArray(expected_outputs) ||
      expected_outputs.length !== stdin.length
    ) {
      return res.status(400).json({
        error: "Invalid or missing testcase",
      });
    }

    const submissions = stdin.map((input) => ({
      source_code,
      language_id,
      stdin: input,
    }));

    console.log(submissions);

    const submissionResults = await submitBatch(submissions);

    const tokens = submissionResults.map((res) => res.token);

    console.log(tokens);
    const results = await pollBatchResults(tokens);

    console.log("Results ****************");
    console.log(results);

    let allPassed = true;

    const detailedResults = results.map((result, i) => {
      const stdout = result.stdout !== null ? result.stdout.trim() : result.stdout;
      const expected_output = expected_outputs[i].trim();
      const passed = stdout == expected_output;

      if (!passed) {
        allPassed = false;
      }

      // console.log(`Teastcase #${i+1}`);
      //   console.log(`Input ${stdin[i]}`);
      //   console.log(`Expected output ${expected_output}`);
      //   console.log(`Actual output ${stdout}`);
      //   console.log("Matched",passed);
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
      };
        
    });

    //save it into db
    // console.log(detailedResults);

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
      message: "Code executed succesfully",
      submission: submissionWithTestcase,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "error in executing code",
    });
  }
};

export { executeCode };
