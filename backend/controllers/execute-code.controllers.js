import {
  getLanguageNameById,
  pollBatchResults,
  submitBatch,
} from "../libs/judge0.lib.js";
import db from "../libs/db.js";
import { updatePatternProgress } from "./pattern.controllers.js";
import { addCodeExecutionJob, getQueueMetrics } from "../libs/queue.lib.js";
import getRedisClient from "../libs/redis.lib.js";

/**
 * Check if user can submit (rate limiting)
 * @param {string} userId - User ID
 * @returns {Promise<{allowed: boolean, retryAfter: number}>}
 */
const checkSubmissionRateLimit = async (userId) => {
  const redis = getRedisClient();
  const rateLimitKey = `submission_rate_limit:${userId}`;
  const rateLimitSeconds = 10; // 1 submission per 10 seconds

  try {
    const lastSubmission = await redis.get(rateLimitKey);
    
    if (lastSubmission) {
      const timeSinceLastSubmission = Date.now() - parseInt(lastSubmission);
      const remainingTime = rateLimitSeconds * 1000 - timeSinceLastSubmission;
      
      if (remainingTime > 0) {
        return {
          allowed: false,
          retryAfter: Math.ceil(remainingTime / 1000),
        };
      }
    }
    
    // Set new timestamp
    await redis.set(rateLimitKey, Date.now().toString(), 'EX', rateLimitSeconds);
    
    return { allowed: true, retryAfter: 0 };
  } catch (error) {
    console.error('[RateLimit] Error checking rate limit:', error);
    // Fail open - allow submission if Redis fails
    return { allowed: true, retryAfter: 0 };
  }
};

// Controller: Run code (no DB save, just return results)
const runCode = async (req, res) => {
  const { source_code, language_id, stdin, expected_outputs } = req.body;
  const userId = req.user.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Check rate limit
    const rateLimit = await checkSubmissionRateLimit(userId);
    if (!rateLimit.allowed) {
      return res.status(429).json({
        success: false,
        message: `Please wait ${rateLimit.retryAfter} seconds before submitting again`,
        retryAfter: rateLimit.retryAfter,
      });
    }
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

    // Get queue position
    const queueMetrics = await getQueueMetrics();
    const queuePosition = queueMetrics ? queueMetrics.waiting + 1 : null;
    const estimatedWaitMinutes = queuePosition ? Math.ceil(queuePosition * 15 / 60) : 0;

    console.log(`[Queue] Job ${job.id} added. Position: ${queuePosition}, Wait: ~${estimatedWaitMinutes}min`);

    // Wait for job to complete
    const result = await job.waitUntilFinished();

    return res.status(200).json({
      ...result,
      queueInfo: queueMetrics ? {
        position: queuePosition,
        estimatedWait: `${estimatedWaitMinutes} minute${estimatedWaitMinutes !== 1 ? 's' : ''}`,
        waiting: queueMetrics.waiting,
        active: queueMetrics.active,
      } : null,
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
  const { source_code, language_id, stdin, expected_outputs, problemId, contestId } = req.body;
  const userId = req.user.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!problemId) {
    return res.status(400).json({ message: "problemId is required" });
  }

  try {
    // Check rate limit for submissions
    const rateLimit = await checkSubmissionRateLimit(userId);
    if (!rateLimit.allowed) {
      return res.status(429).json({
        success: false,
        message: `Please wait ${rateLimit.retryAfter} seconds before submitting again`,
        retryAfter: rateLimit.retryAfter,
      });
    }
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

    // Get queue position
    const queueMetrics = await getQueueMetrics();
    const queuePosition = queueMetrics ? queueMetrics.waiting + 1 : null;
    const estimatedWaitMinutes = queuePosition ? Math.ceil(queuePosition * 15 / 60) : 0;

    console.log(`[Queue] Submission ${job.id} added. Position: ${queuePosition}, Wait: ~${estimatedWaitMinutes}min`);

    // Wait for job to complete
    const result = await job.waitUntilFinished();

    return res.status(200).json({
      ...result,
      queueInfo: queueMetrics ? {
        position: queuePosition,
        estimatedWait: `${estimatedWaitMinutes} minute${estimatedWaitMinutes !== 1 ? 's' : ''}`,
        waiting: queueMetrics.waiting,
        active: queueMetrics.active,
      } : null,
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
