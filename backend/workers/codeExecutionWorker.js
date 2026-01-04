/**
 * Code Execution Worker
 * 
 * Processes code execution jobs from the BullMQ queue.
 * Runs independently from the main API server.
 * Reuses existing Judge0 integration logic.
 */

import { Worker } from 'bullmq';
import dotenv from 'dotenv';
import getRedisClient from '../libs/redis.lib.js';
import {
  submitBatch,
  pollBatchResults,
  getLanguageNameById,
} from '../libs/judge0.lib.js';
import db from '../libs/db.js';
import { updatePatternProgress } from '../controllers/pattern.controllers.js';

// Load environment variables
dotenv.config();

/**
 * Process code execution job
 * @param {Object} job - BullMQ job object
 * @returns {Promise<Object>} Execution results
 */
async function processCodeExecution(job) {
  const {
    jobType,
    userId,
    problemId,
    contestId,
    source_code,
    language_id,
    stdin,
    expected_outputs,
  } = job.data;

  console.log(`[Worker] Processing job ${job.id} (type: ${jobType}, user: ${userId}) [V2-PUB-SUB-ACTIVE]`);

  try {
    // Step 1: Execute code using Judge0 (existing logic)
    const submissions = stdin.map((input) => ({
      source_code,
      language_id,
      stdin: input,
    }));

    const submissionResults = await submitBatch(submissions);
    const tokens = submissionResults.map((res) => res.token);
    const results = await pollBatchResults(tokens);

    // Step 2: Process results
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

    // Step 3: Save to database based on job type
    if (jobType === 'run') {
      // For 'run' jobs, just return results (no DB save)
      return {
        success: true,
        message: 'Code executed successfully (not saved)',
        allPassed,
        results: detailedResults,
      };
    } else if (jobType === 'submit') {
      // Save regular submission
      return await saveRegularSubmission(
        userId,
        problemId,
        source_code,
        language_id,
        stdin,
        detailedResults,
        allPassed
      );
    } else if (jobType === 'contest') {
      // Save contest submission
      return await saveContestSubmission(
        userId,
        problemId,
        contestId,
        source_code,
        language_id,
        stdin,
        detailedResults,
        allPassed
      );
    }
  } catch (error) {
    console.error(`[Worker] Error processing job ${job.id}:`, error);
    throw error; // BullMQ will handle retry
  }
}

/**
 * Save regular problem submission to database
 */
async function saveRegularSubmission(
  userId,
  problemId,
  source_code,
  language_id,
  stdin,
  detailedResults,
  allPassed
) {
  const submission = await db.submission.create({
    data: {
      userId,
      problemId,
      sourceCode: source_code,
      language: getLanguageNameById(language_id),
      stdin: stdin.join('/n'),
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
      status: allPassed ? 'Accepted' : 'Wrong Answer',
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

    // Update pattern progress
    await updatePatternProgress(userId, problemId);
  }

  // Save test case results
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
    where: { id: submission.id },
    include: { testCases: true },
  });

  return {
    success: true,
    message: 'Code submitted and saved successfully',
    submission: submissionWithTestcase,
  };
}

/**
 * Save contest submission to database
 */
async function saveContestSubmission(
  userId,
  problemId,
  contestId,
  source_code,
  language_id,
  stdin,
  detailedResults,
  allPassed
) {
  // Fetch contest and problem marks
  const contest = await db.contest.findUnique({ where: { id: contestId } });
  if (!contest) throw new Error('Contest not found');

  const problem = await db.contestProblem.findFirst({
    where: { contestId, problemId },
  });
  if (!problem) throw new Error('Problem not found in this contest');

  // Determine obtained marks
  let obtainedMarks = 0;
  if (allPassed) obtainedMarks = problem.marks || 0;

  // Save to ContestSubmission
  const contestSubmission = await db.contestSubmission.create({
    data: {
      userId,
      contestId,
      problemId,
      sourceCode: source_code,
      language: getLanguageNameById(language_id),
      stdin: stdin.join('/n'),
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
      status: allPassed ? 'Accepted' : 'Wrong Answer',
      obtainedMarks,
    },
  });

  // Also save to regular Submission model
  const submission = await db.submission.create({
    data: {
      userId,
      problemId,
      sourceCode: source_code,
      language: getLanguageNameById(language_id),
      stdin: stdin.join('/n'),
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
      status: allPassed ? 'Accepted' : 'Wrong Answer',
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

  // Save testcase results ONLY for the regular submission
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

  await db.teastCaseResult.createMany({ data: testCaseResults });

  const submissionWithTestcase = await db.submission.findUnique({
    where: { id: submission.id },
    include: { testCases: true },
  });

  // Publish update to Redis for real-time leaderboard
  try {
    const redis = getRedisClient();
    await redis.publish(
      "leaderboard_updates",
      JSON.stringify({ contestId })
    );
    // console.log(`[Worker] Published leaderboard update for contest ${contestId}`);
  } catch (redisError) {
    console.error("[Worker] Failed to publish leaderboard update:", redisError);
  }

  return {
    success: true,
    message: 'Contest code submitted and saved successfully',
    contestSubmission,
    submission: submissionWithTestcase,
    allPassed,
    obtainedMarks,
    results: detailedResults,
  };
}

// Create and start the worker
const redis = getRedisClient();

const worker = new Worker('code-execution', processCodeExecution, {
  connection: redis,
  concurrency: parseInt(process.env.QUEUE_CONCURRENCY || '5'),
  limiter: {
    max: 10, // Max 10 jobs
    duration: 1000, // per second
  },
});

// Worker event handlers
worker.on('completed', (job, result) => {
  console.log(`[Worker] Job ${job.id} completed successfully`);
});

worker.on('failed', (job, err) => {
  console.error(`[Worker] Job ${job?.id} failed:`, err.message);
});

worker.on('error', (err) => {
  console.error('[Worker] Worker error:', err.message);
});

worker.on('ready', () => {
  console.log('[Worker] Worker is ready and waiting for jobs');
});

console.log('[Worker] Code execution worker started');
console.log(`[Worker] Concurrency: ${process.env.QUEUE_CONCURRENCY || '5'} jobs`);

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('[Worker] SIGTERM received, closing worker...');
  await worker.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('[Worker] SIGINT received, closing worker...');
  await worker.close();
  process.exit(0);
});
