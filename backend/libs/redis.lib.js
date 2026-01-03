/**
 * Redis Client Configuration
 * 
 * Provides a singleton Redis client for rate limiting and queue operations.
 * Implements fail-closed behavior: if Redis is down, operations will fail.
 */

import Redis from 'ioredis';

let redisClient = null;

/**
 * Get or create Redis client instance
 * @returns {Redis} Redis client instance
 */
export const getRedisClient = () => {
  if (!redisClient) {
    const redisConfig = {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD || undefined,
      retryStrategy: (times) => {
        // Retry connection with exponential backoff
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: null, // Required by BullMQ for blocking operations
      enableReadyCheck: true,
      lazyConnect: false,
    };

    redisClient = new Redis(redisConfig);

    // Connection event handlers
    redisClient.on('connect', () => {
      console.log('[Redis] Connected to Redis server');
    });

    redisClient.on('ready', () => {
      console.log('[Redis] Redis client ready');
    });

    redisClient.on('error', (err) => {
      console.error('[Redis] Redis connection error:', err.message);
      // Don't exit process - let fail-closed behavior handle it
    });

    redisClient.on('close', () => {
      console.warn('[Redis] Redis connection closed');
    });

    redisClient.on('reconnecting', () => {
      console.log('[Redis] Reconnecting to Redis...');
    });
  }

  return redisClient;
};

/**
 * Check if Redis is connected and healthy
 * @returns {Promise<boolean>} True if Redis is healthy
 */
export const isRedisHealthy = async () => {
  try {
    const client = getRedisClient();
    const result = await client.ping();
    return result === 'PONG';
  } catch (error) {
    console.error('[Redis] Health check failed:', error.message);
    return false;
  }
};

/**
 * Close Redis connection gracefully
 * @returns {Promise<void>}
 */
export const closeRedis = async () => {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    console.log('[Redis] Connection closed gracefully');
  }
};

export default getRedisClient;
