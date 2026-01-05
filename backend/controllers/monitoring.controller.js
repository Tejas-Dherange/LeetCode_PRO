import { getQueueMetrics } from "../libs/queue.lib.js";
import getRedisClient from "../libs/redis.lib.js";
import axios from "axios";
import db from "../libs/db.js";

/**
 * Get queue metrics for monitoring
 */
export const getQueueStatus = async (req, res) => {
  try {
    const metrics = await getQueueMetrics();

    if (!metrics) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch queue metrics",
      });
    }

    // Calculate throughput (submissions per minute) - simplified
    const throughput = metrics.active > 0 ? metrics.active * 4 : 0; // Rough estimate

    return res.status(200).json({
      success: true,
      data: {
        ...metrics,
        throughput,
        status: metrics.waiting > 50 ? "warning" : metrics.waiting > 20 ? "normal" : "optimal",
      },
    });
  } catch (error) {
    console.error("[Monitoring] Error fetching queue status:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching queue metrics",
    });
  }
};

/**
 * Get Judge0 health status
 */
export const getJudge0Health = async (req, res) => {
  try {
    const endpoint = process.env.JUDGE0_BATCH_SUBMISSION_ENDPOINT;

    if (!endpoint) {
      return res.status(200).json({
        success: true,
        data: {
          status: "not_configured",
          endpoint: null,
          message: "Judge0 endpoint not configured",
        },
      });
    }

    const startTime = Date.now();
    
    try {
      const response = await axios.get(`${endpoint}/about`, { timeout: 5000 });
      const responseTime = Date.now() - startTime;

      return res.status(200).json({
        success: true,
        data: {
          status: responseTime < 100 ? "healthy" : responseTime < 500 ? "degraded" : "slow",
          endpoint,
          responseTime,
          version: response.data.version || "unknown",
          workers: 2, // From your judge0.conf
        },
      });
    } catch (error) {
      return res.status(200).json({
        success: true,
        data: {
          status: "down",
          endpoint,
          error: error.message,
          responseTime: null,
        },
      });
    }
  } catch (error) {
    console.error("[Monitoring] Error checking Judge0 health:", error);
    return res.status(500).json({
      success: false,
      message: "Error checking Judge0 health",
    });
  }
};

/**
 * Get Redis metrics
 */
export const getRedisMetrics = async (req, res) => {
  try {
    const redis = getRedisClient();
    const info = await redis.info("memory");
    const stats = await redis.info("stats");

    // Parse info strings
    const parseInfo = (infoStr) => {
      const lines = infoStr.split("\r\n");
      const data = {};
      lines.forEach((line) => {
        const [key, value] = line.split(":");
        if (key && value) data[key] = value;
      });
      return data;
    };

    const memoryInfo = parseInfo(info);
    const statsInfo = parseInfo(stats);

    return res.status(200).json({
      success: true,
      data: {
        memoryUsed: memoryInfo.used_memory_human || "N/A",
        memoryPeak: memoryInfo.used_memory_peak_human || "N/A",
        memoryLimit: memoryInfo.maxmemory_human || "No limit",
        connectedClients: parseInt(statsInfo.connected_clients || 0),
        opsPerSec: parseInt(statsInfo.instantaneous_ops_per_sec || 0),
        status: "healthy",
      },
    });
  } catch (error) {
    console.error("[Monitoring] Error fetching Redis metrics:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching Redis metrics",
    });
  }
};

/**
 * Get submission analytics
 */
export const getSubmissionAnalytics = async (req, res) => {
  try {
    const { period = "24h" } = req.query;

    // Calculate time range
    const now = new Date();
    const startTime = new Date();
    
    if (period === "1h") {
      startTime.setHours(now.getHours() - 1);
    } else if (period === "24h") {
      startTime.setHours(now.getHours() - 24);
    } else if (period === "7d") {
      startTime.setDate(now.getDate() - 7);
    }

    // Get submissions in time range
    const submissions = await db.submission.findMany({
      where: {
        createdAt: {
          gte: startTime,
        },
      },
      select: {
        status: true,
        language: true,
        createdAt: true,
      },
    });

    // Calculate metrics
    const total = submissions.length;
    const successful = submissions.filter((s) => s.status === "ACCEPTED").length;
    const failed = total - successful;
    const successRate = total > 0 ? ((successful / total) * 100).toFixed(1) : 0;

    // Language distribution
    const byLanguage = {};
    submissions.forEach((s) => {
      byLanguage[s.language] = (byLanguage[s.language] || 0) + 1;
    });

    // Timeline data (hourly buckets)
    const timeline = [];
    const buckets = period === "1h" ? 12 : period === "24h" ? 24 : 168; // 5min, 1h, or 1h buckets
    const bucketSize = period === "1h" ? 5 * 60 * 1000 : 60 * 60 * 1000; // 5min or 1h in ms

    for (let i = 0; i < buckets; i++) {
      const bucketStart = new Date(startTime.getTime() + i * bucketSize);
      const bucketEnd = new Date(bucketStart.getTime() + bucketSize);
      
      const count = submissions.filter(
        (s) => s.createdAt >= bucketStart && s.createdAt < bucketEnd
      ).length;

      timeline.push({
        time: bucketStart.toISOString(),
        count,
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        total,
        successful,
        failed,
        successRate: parseFloat(successRate),
        byLanguage,
        timeline,
        period,
      },
    });
  } catch (error) {
    console.error("[Monitoring] Error fetching submission analytics:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching submission analytics",
    });
  }
};

/**
 * Get overall system health
 */
export const getSystemHealth = async (req, res) => {
  try {
    const startTime = Date.now();

    // Check database
    let dbStatus = "unknown";
    let dbResponseTime = null;
    try {
      const dbStart = Date.now();
      await db.$queryRaw`SELECT 1`;
      dbResponseTime = Date.now() - dbStart;
      dbStatus = dbResponseTime < 50 ? "healthy" : dbResponseTime < 200 ? "degraded" : "slow";
    } catch (error) {
      dbStatus = "down";
    }

    // Check Redis
    let redisStatus = "unknown";
    let redisResponseTime = null;
    try {
      const redis = getRedisClient();
      const redisStart = Date.now();
      await redis.ping();
      redisResponseTime = Date.now() - redisStart;
      redisStatus = redisResponseTime < 10 ? "healthy" : redisResponseTime < 50 ? "degraded" : "slow";
    } catch (error) {
      redisStatus = "down";
    }

    // Check Judge0
    let judge0Status = "unknown";
    let judge0ResponseTime = null;
    const endpoint = process.env.JUDGE0_BATCH_SUBMISSION_ENDPOINT;
    
    if (endpoint) {
      try {
        const judge0Start = Date.now();
        await axios.get(`${endpoint}/about`, { timeout: 3000 });
        judge0ResponseTime = Date.now() - judge0Start;
        judge0Status = judge0ResponseTime < 100 ? "healthy" : judge0ResponseTime < 500 ? "degraded" : "slow";
      } catch (error) {
        judge0Status = "down";
      }
    } else {
      judge0Status = "not_configured";
    }

    // Overall system status
    const allHealthy = [dbStatus, redisStatus, judge0Status].every(
      (s) => s === "healthy" || s === "not_configured"
    );
    const anyDown = [dbStatus, redisStatus, judge0Status].some((s) => s === "down");

    const overallStatus = anyDown ? "degraded" : allHealthy ? "healthy" : "warning";

    return res.status(200).json({
      success: true,
      data: {
        status: overallStatus,
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        services: {
          database: { status: dbStatus, responseTime: dbResponseTime },
          redis: { status: redisStatus, responseTime: redisResponseTime },
          judge0: { status: judge0Status, responseTime: judge0ResponseTime },
        },
      },
    });
  } catch (error) {
    console.error("[Monitoring] Error fetching system health:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching system health",
    });
  }
};
