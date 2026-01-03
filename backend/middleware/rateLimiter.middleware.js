/**
 * Rate Limiter Middleware
 * 
 * Enforces rate limits on code execution endpoints using Redis.
 * Implements three types of limits:
 * 1. User per minute: 5 runs
 * 2. User per hour: 20 runs
 * 3. User per problem per 30 seconds: 3 runs
 * 
 * Uses atomic Redis operations (INCR + EXPIRE) for thread-safe counting.
 * Fails closed: if Redis is down, blocks execution.
 */

import getRedisClient, { isRedisHealthy } from '../libs/redis.lib.js';

/**
 * Rate limit configuration
 */
const RATE_LIMITS = {
  USER_PER_MINUTE: {
    limit: 5,
    window: 60, // seconds
    keyPrefix: 'run:user',
    keySuffix: 'minute',
  },
  USER_PER_HOUR: {
    limit: 20,
    window: 3600, // seconds
    keyPrefix: 'run:user',
    keySuffix: 'hour',
  },
  USER_PROBLEM_PER_30S: {
    limit: 3,
    window: 30, // seconds
    keyPrefix: 'run:user',
    keySuffix: 'problem',
  },
};

/**
 * Check and increment rate limit counter
 * @param {string} key - Redis key
 * @param {number} limit - Maximum allowed count
 * @param {number} window - Time window in seconds
 * @returns {Promise<{allowed: boolean, current: number, resetAt: Date}>}
 */
async function checkRateLimit(key, limit, window) {
  const redis = getRedisClient();
  
  try {
    // Use pipeline for atomic operations
    const pipeline = redis.pipeline();
    pipeline.incr(key);
    pipeline.ttl(key);
    
    const results = await pipeline.exec();
    
    if (!results || results.some(([err]) => err)) {
      throw new Error('Redis pipeline execution failed');
    }
    
    const current = results[0][1]; // Result of INCR
    const ttl = results[1][1]; // Result of TTL
    
    // If TTL is -1, key exists but has no expiry - set it
    // If TTL is -2, key doesn't exist (shouldn't happen after INCR)
    if (ttl === -1) {
      await redis.expire(key, window);
    } else if (current === 1) {
      // First increment, set expiry
      await redis.expire(key, window);
    }
    
    const resetAt = new Date(Date.now() + (ttl > 0 ? ttl : window) * 1000);
    
    return {
      allowed: current <= limit,
      current,
      resetAt,
    };
  } catch (error) {
    console.error(`[RateLimiter] Error checking rate limit for key ${key}:`, error.message);
    throw error;
  }
}

/**
 * Rate limiter middleware
 * Checks all rate limits before allowing code execution
 */
export const rateLimiter = async (req, res, next) => {
  const userId = req.user?.id;
  
  // Check authentication
  if (!userId) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required',
    });
  }
  
  // Check Redis health - fail closed if Redis is down
  const healthy = await isRedisHealthy();
  if (!healthy) {
    console.error('[RateLimiter] Redis is not healthy - blocking request');
    return res.status(503).json({
      error: 'Service temporarily unavailable',
      message: 'Rate limiting service is unavailable. Please try again later.',
    });
  }
  
  // Extract problemId from request body (may be undefined for run-code)
  const problemId = req.body?.problemId;
  
  try {
    // Check user per minute limit
    const minuteKey = `${RATE_LIMITS.USER_PER_MINUTE.keyPrefix}:${userId}:${RATE_LIMITS.USER_PER_MINUTE.keySuffix}`;
    const minuteCheck = await checkRateLimit(
      minuteKey,
      RATE_LIMITS.USER_PER_MINUTE.limit,
      RATE_LIMITS.USER_PER_MINUTE.window
    );
    
    if (!minuteCheck.allowed) {
      logRateLimitViolation(userId, problemId, 'user_per_minute', minuteCheck);
      return res.status(429).json({
        error: 'Rate limit exceeded',
        limit: `${RATE_LIMITS.USER_PER_MINUTE.limit} runs per minute`,
        current: minuteCheck.current,
        retryAfter: Math.ceil((minuteCheck.resetAt - new Date()) / 1000),
        resetAt: minuteCheck.resetAt.toISOString(),
      });
    }
    
    // Check user per hour limit
    const hourKey = `${RATE_LIMITS.USER_PER_HOUR.keyPrefix}:${userId}:${RATE_LIMITS.USER_PER_HOUR.keySuffix}`;
    const hourCheck = await checkRateLimit(
      hourKey,
      RATE_LIMITS.USER_PER_HOUR.limit,
      RATE_LIMITS.USER_PER_HOUR.window
    );
    
    if (!hourCheck.allowed) {
      logRateLimitViolation(userId, problemId, 'user_per_hour', hourCheck);
      return res.status(429).json({
        error: 'Rate limit exceeded',
        limit: `${RATE_LIMITS.USER_PER_HOUR.limit} runs per hour`,
        current: hourCheck.current,
        retryAfter: Math.ceil((hourCheck.resetAt - new Date()) / 1000),
        resetAt: hourCheck.resetAt.toISOString(),
      });
    }
    
    // Check user per problem limit (only if problemId is provided)
    if (problemId) {
      const problemKey = `${RATE_LIMITS.USER_PROBLEM_PER_30S.keyPrefix}:${userId}:${RATE_LIMITS.USER_PROBLEM_PER_30S.keySuffix}:${problemId}`;
      const problemCheck = await checkRateLimit(
        problemKey,
        RATE_LIMITS.USER_PROBLEM_PER_30S.limit,
        RATE_LIMITS.USER_PROBLEM_PER_30S.window
      );
      
      if (!problemCheck.allowed) {
        logRateLimitViolation(userId, problemId, 'user_problem_per_30s', problemCheck);
        return res.status(429).json({
          error: 'Rate limit exceeded',
          limit: `${RATE_LIMITS.USER_PROBLEM_PER_30S.limit} runs per 30 seconds for this problem`,
          current: problemCheck.current,
          retryAfter: Math.ceil((problemCheck.resetAt - new Date()) / 1000),
          resetAt: problemCheck.resetAt.toISOString(),
        });
      }
    }
    
    // All rate limits passed - proceed to next middleware
    next();
    
  } catch (error) {
    console.error('[RateLimiter] Error in rate limiting:', error);
    // Fail closed - block execution if rate limiting fails
    return res.status(503).json({
      error: 'Service temporarily unavailable',
      message: 'Unable to verify rate limits. Please try again.',
    });
  }
};

/**
 * Log rate limit violations for monitoring
 * @param {string} userId - User ID
 * @param {string|undefined} problemId - Problem ID (if applicable)
 * @param {string} limitType - Type of limit exceeded
 * @param {Object} checkResult - Result from checkRateLimit
 */
function logRateLimitViolation(userId, problemId, limitType, checkResult) {
  console.log(JSON.stringify({
    event: 'RATE_LIMIT_EXCEEDED',
    userId,
    problemId: problemId || null,
    limitType,
    current: checkResult.current,
    resetAt: checkResult.resetAt.toISOString(),
    timestamp: new Date().toISOString(),
  }));
}

export default rateLimiter;
