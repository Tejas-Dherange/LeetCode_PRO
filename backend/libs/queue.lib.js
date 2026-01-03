/**
 * Queue System Library
 * 
 * Manages code execution jobs using BullMQ with Redis backend.
 * Provides job queuing, concurrency control, and retry logic.
 */

import { Queue, QueueEvents } from 'bullmq';
import getRedisClient from './redis.lib.js';

let codeExecutionQueue = null;
let queueEvents = null;

/**
 * Get or create QueueEvents instance for monitoring job completion
 * @returns {QueueEvents} BullMQ QueueEvents instance
 */
export const getQueueEvents = () => {
  if (!queueEvents) {
    const redis = getRedisClient();
    
    queueEvents = new QueueEvents('code-execution', {
      connection: redis.duplicate(), // Use a separate connection for events
    });

    queueEvents.on('error', (err) => {
      console.error('[QueueEvents] Error:', err.message);
    });

    console.log('[QueueEvents] Queue events listener initialized');
  }

  return queueEvents;
};

/**
 * Get or create code execution queue instance
 * @returns {Queue} BullMQ Queue instance
 */
export const getCodeExecutionQueue = () => {
  if (!codeExecutionQueue) {
    const redis = getRedisClient();
    
    codeExecutionQueue = new Queue('code-execution', {
      connection: redis,
      defaultJobOptions: {
        attempts: 3, // Retry failed jobs up to 3 times
        backoff: {
          type: 'exponential',
          delay: 2000, // Start with 2 second delay
        },
        removeOnComplete: {
          age: 3600, // Keep completed jobs for 1 hour
          count: 1000, // Keep last 1000 completed jobs
        },
        removeOnFail: {
          age: 7200, // Keep failed jobs for 2 hours
        },
        timeout: parseInt(process.env.QUEUE_JOB_TIMEOUT || '60000'), // 60 seconds default
      },
    });

    codeExecutionQueue.on('error', (err) => {
      console.error('[Queue] Queue error:', err.message);
    });

    console.log('[Queue] Code execution queue initialized');
  }

  return codeExecutionQueue;
};

/**
 * Add a code execution job to the queue
 * @param {Object} jobData - Job payload
 * @param {string} jobData.jobType - 'run' or 'submit' or 'contest'
 * @param {string} jobData.userId - User ID
 * @param {string} jobData.problemId - Problem ID (optional for 'run' type)
 * @param {string} jobData.contestId - Contest ID (only for 'contest' type)
 * @param {string} jobData.source_code - Source code
 * @param {number} jobData.language_id - Language ID
 * @param {string[]} jobData.stdin - Test inputs
 * @param {string[]} jobData.expected_outputs - Expected outputs
 * @returns {Promise<Object>} Job object with wait methods
 */
export const addCodeExecutionJob = async (jobData) => {
  const queue = getCodeExecutionQueue();
  const queueEvents = getQueueEvents(); // Get QueueEvents instance
  
  // Validate job data
  if (!jobData.jobType || !['run', 'submit', 'contest'].includes(jobData.jobType)) {
    throw new Error('Invalid job type. Must be "run", "submit", or "contest"');
  }
  
  if (!jobData.userId) {
    throw new Error('userId is required');
  }
  
  if (!jobData.source_code || !jobData.language_id) {
    throw new Error('source_code and language_id are required');
  }
  
  if (!Array.isArray(jobData.stdin) || !Array.isArray(jobData.expected_outputs)) {
    throw new Error('stdin and expected_outputs must be arrays');
  }
  
  // Create job with unique ID
  const jobId = `${jobData.jobType}-${jobData.userId}-${Date.now()}`;
  
  try {
    const job = await queue.add(
      'execute-code',
      jobData,
      {
        jobId,
        priority: jobData.jobType === 'contest' ? 1 : 10, // Contest submissions have higher priority
      }
    );
    
    console.log(`[Queue] Job added: ${jobId} (type: ${jobData.jobType})`);
    
    // Attach a method to wait for completion using QueueEvents
    job.waitUntilFinished = async () => {
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          cleanup();
          reject(new Error('Job timeout waiting for result'));
        }, 120000); // 2 minute timeout

        const cleanup = () => {
          clearTimeout(timeout);
          queueEvents.off('completed', onCompleted);
          queueEvents.off('failed', onFailed);
        };

        const onCompleted = ({ jobId: completedId, returnvalue }) => {
          if (completedId === jobId) {
            cleanup();
            resolve(returnvalue);
          }
        };

        const onFailed = ({ jobId: failedId, failedReason }) => {
          if (failedId === jobId) {
            cleanup();
            reject(new Error(failedReason));
          }
        };

        queueEvents.on('completed', onCompleted);
        queueEvents.on('failed', onFailed);
      });
    };
    
    return job;
  } catch (error) {
    console.error('[Queue] Error adding job:', error.message);
    throw new Error('Failed to queue code execution request');
  }
};

/**
 * Get queue metrics for monitoring
 * @returns {Promise<Object>} Queue statistics
 */
export const getQueueMetrics = async () => {
  const queue = getCodeExecutionQueue();
  
  try {
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      queue.getWaitingCount(),
      queue.getActiveCount(),
      queue.getCompletedCount(),
      queue.getFailedCount(),
      queue.getDelayedCount(),
    ]);
    
    return {
      waiting,
      active,
      completed,
      failed,
      delayed,
      total: waiting + active + delayed,
    };
  } catch (error) {
    console.error('[Queue] Error getting metrics:', error.message);
    return null;
  }
};

/**
 * Close queue connection gracefully
 * @returns {Promise<void>}
 */
export const closeQueue = async () => {
  if (codeExecutionQueue) {
    await codeExecutionQueue.close();
    codeExecutionQueue = null;
    console.log('[Queue] Queue closed gracefully');
  }
};

export default getCodeExecutionQueue;
