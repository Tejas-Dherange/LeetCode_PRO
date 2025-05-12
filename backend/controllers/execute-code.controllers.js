import {
  getLanguageNameById,
  pollBatchResults,
  submitBatch,
} from "../libs/judge0.lib.js";

const executeCode = async (req, res) => {
  const { source_code, language_id, stdin, expected_outputs, problemId } =
    req.body;

  const id = req.user.id;

  if (!id) {
    return res.status(400).json({
      message: "some error occured",
    });
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

    const allPassed = true;

    const detailedResults = results.map((result, i) => {
      const stdout = result.stdout.trim();
      const expected_output = expected_outputs[i].trim();
      const passed = stdout == expected_output;

      if (!passed) {
        allPassed = false;
      }

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
      //   console.log(`Teastcase #${i+1}`);
      //   console.log(`Input ${stdin[i]}`);
      //   console.log(`Expected output ${expected_output}`);
      //   console.log(`Actual output ${stdout}`);
      //   console.log("Matched",passed);
    });

    //save it into db
    // console.log(detailedResults);

    const submission = await db.submission.create({
      data: {
        userId: id,
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

    return res.status(200).json({
      success: true,
      message: "Code executed succesfully",
      results,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      error: "Error in executing code",
    });
  }
};

export { executeCode };
