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
    // Support both Upstash Redis URL and local Redis configuration
    let redisConfig;
    
    if (process.env.REDIS_URL && process.env.REDIS_URL.startsWith('redis')) {
      // Upstash or external Redis with full URL (e.g., rediss://...)
      redisConfig = {
        // ioredis automatically parses redis:// or rediss:// URLs
        // For TLS connections, it will enable TLS automatically
        maxRetriesPerRequest: null, // Required by BullMQ for blocking operations
        enableReadyCheck: true,
        lazyConnect: false,
        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
      };
      
      // Pass URL as first parameter
      redisClient = new Redis(process.env.REDIS_URL, redisConfig);
    } else {
      // Local Redis with host/port configuration
      redisConfig = {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD || undefined,
        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        maxRetriesPerRequest: null,
        enableReadyCheck: true,
        lazyConnect: false,
      };
      
      redisClient = new Redis(redisConfig);
    }

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
