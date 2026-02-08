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

/**
 * Get user analytics - overall user statistics
 */
export const getUserAnalytics = async (req, res) => {
  try {
    const now = new Date();
    const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

    // Total users
    const totalUsers = await db.user.count();

    // New users by period
    const newUsersToday = await db.user.count({
      where: { createdAt: { gte: oneDayAgo } }
    });
    
    const newUsersThisWeek = await db.user.count({
      where: { createdAt: { gte: oneWeekAgo } }
    });
    
    const newUsersThisMonth = await db.user.count({
      where: { createdAt: { gte: oneMonthAgo } }
    });

    // Active users (submitted in last 7 days)
    const activeUsers = await db.user.count({
      where: {
        Submission: {
          some: {
            createdAt: { gte: oneWeekAgo }
          }
        }
      }
    });

    // Users by role
    const usersByRole = await db.user.groupBy({
      by: ['role'],
      _count: true
    });

    // Subscription breakdown
    const subscriptionBreakdown = await db.subscription.groupBy({
      by: ['plan'],
      _count: true
    });

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        newUsersToday,
        newUsersThisWeek,
        newUsersThisMonth,
        usersByRole: usersByRole.reduce((acc, item) => {
          acc[item.role] = item._count;
          return acc;
        }, {}),
        subscriptionBreakdown: subscriptionBreakdown.reduce((acc, item) => {
          acc[item.plan] = item._count;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    console.error("[Monitoring] Error fetching user analytics:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching user analytics"
    });
  }
};

/**
 * Get problem solving statistics
 */
export const getProblemSolvingStats = async (req, res) => {
  try {
    // Total problems
    const totalProblems = await db.problem.count();

    // Total solved (unique problem IDs)
    const solvedProblems = await db.problemSolved.groupBy({
      by: ['problemId'],
      _count: true
    });
    const totalSolved = solvedProblems.length;

    // Unique solvers
    const uniqueSolvers = await db.user.count({
      where: {
        solvedProblem: {
          some: {}
        }
      }
    });

    // Average problems per user
    const avgProblemsPerUser = uniqueSolvers > 0 
      ? (await db.problemSolved.count() / uniqueSolvers).toFixed(1)
      : 0;

    // Problems by difficulty
    const difficultyStats = await db.problem.groupBy({
      by: ['difficulty'],
      _count: true
    });

    // Solve count by difficulty
    const solvesByDifficulty = await db.problem.findMany({
      select: {
        difficulty: true,
        solvedBy: {
          select: { id: true }
        }
      }
    });

    const byDifficulty = {};
    ['EASY', 'MEDIUM', 'HARD'].forEach(diff => {
      const total = difficultyStats.find(d => d.difficulty === diff)?._count || 0;
      const solvedCount = solvesByDifficulty.filter(
        p => p.difficulty === diff && p.solvedBy.length > 0
      ).length;
      byDifficulty[diff] = { total, solved: solvedCount };
    });

    return res.status(200).json({
      success: true,
      data: {
        totalProblems,
        totalSolved,
        uniqueSolvers,
        avgProblemsPerUser: parseFloat(avgProblemsPerUser),
        byDifficulty
      }
    });
  } catch (error) {
    console.error("[Monitoring] Error fetching problem stats:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching problem statistics"
    });
  }
};

/**
 * Get top users leaderboard
 */
export const getTopUsers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        solvedProblem: {
          select: { id: true }
        },
        Submission: {
          select: { status: true }
        },
        Subscription: {
          select: { plan: true }
        }
      },
      take: limit * 3 // Get more to rank properly
    });

    // Calculate stats and rank
    const rankedUsers = users.map(user => {
      const problemsSolved = user.solvedProblem.length;
      const submissions = user.Submission.length;
      const accepted = user.Submission.filter(s => s.status === 'ACCEPTED').length;
      const successRate = submissions > 0 
        ? parseFloat(((accepted / submissions) * 100).toFixed(1))
        : 0;

      return {
        id: user.id,
        name: user.name || 'Anonymous',
        email: user.email,
        image: user.image,
        problemsSolved,
        submissions,
        successRate,
        createdAt: user.createdAt,
        subscription: user.Subscription?.plan || 'FREE'
      };
    })
    .sort((a, b) => b.problemsSolved - a.problemsSolved)
    .slice(0, limit);

    return res.status(200).json({
      success: true,
      data: rankedUsers
    });
  } catch (error) {
    console.error("[Monitoring] Error fetching top users:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching top users"
    });
  }
};

/**
 * Get paginated users list with stats
 */
export const getUsersList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    const whereClause = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    } : {};

    const [total, users] = await Promise.all([
      db.user.count({ where: whereClause }),
      db.user.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          createdAt: true,
          solvedProblem: { select: { id: true } },
          Submission: { select: { createdAt: true } },
          Subscription: { select: { plan: true } }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      })
    ]);

    const usersWithStats = users.map(user => ({
      id: user.id,
      name: user.name || 'Anonymous',
      email: user.email,
      image: user.image,
      role: user.role,
      problemsSolved: user.solvedProblem.length,
      submissions: user.Submission.length,
      lastActive: user.Submission.length > 0 
        ? user.Submission.sort((a, b) => b.createdAt - a.createdAt)[0].createdAt
        : null,
      subscription: user.Subscription?.plan || 'FREE',
      createdAt: user.createdAt
    }));

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
      data: {
        users: usersWithStats,
        pagination: {
          total,
          currentPage: page,
          totalPages,
          hasMore: page < totalPages,
          limit
        }
      }
    });
  } catch (error) {
    console.error("[Monitoring] Error fetching users list:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching users list"
    });
  }
};

/**
 * Get user activity timeline
 */
export const getUserActivityTimeline = async (req, res) => {
  try {
    const { period = '7d' } = req.query;
    
    const now = new Date();
    const startTime = new Date();
    let days = 7;

    if (period === '30d') {
      days = 30;
      startTime.setDate(now.getDate() - 30);
    } else if (period === '90d') {
      days = 90;
      startTime.setDate(now.getDate() - 90);
    } else {
      startTime.setDate(now.getDate() - 7);
    }

    // Get all data in timeframe
    const [newUsers, submissions, problemsSolved] = await Promise.all([
      db.user.findMany({
        where: { createdAt: { gte: startTime } },
        select: { createdAt: true }
      }),
      db.submission.findMany({
        where: { createdAt: { gte: startTime } },
        select: { createdAt: true }
      }),
      db.problemSolved.findMany({
        where: { createdAt: { gte: startTime } },
        select: { createdAt: true }
      })
    ]);

    // Create timeline buckets (daily)
    const timeline = [];
    for (let i = 0; i < days; i++) {
      const bucketDate = new Date(startTime);
      bucketDate.setDate(startTime.getDate() + i);
      const nextDay = new Date(bucketDate);
      nextDay.setDate(bucketDate.getDate() + 1);

      const newUsersCount = newUsers.filter(u => 
        u.createdAt >= bucketDate && u.createdAt < nextDay
      ).length;

      const submissionsCount = submissions.filter(s => 
        s.createdAt >= bucketDate && s.createdAt < nextDay
      ).length;

      const problemsSolvedCount = problemsSolved.filter(p => 
        p.createdAt >= bucketDate && p.createdAt < nextDay
      ).length;

      timeline.push({
        date: bucketDate.toISOString().split('T')[0],
        newUsers: newUsersCount,
        submissions: submissionsCount,
        problemsSolved: problemsSolvedCount
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        timeline,
        period,
        totalActivity: submissions.length + problemsSolved.length
      }
    });
  } catch (error) {
    console.error("[Monitoring] Error fetching activity timeline:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching activity timeline"
    });
  }
};

/**
 * Get detailed user information for admin modal
 */
export const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    // Get user basic info
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        Subscription: true,
        solvedProblem: {
          include: {
            problem: {
              select: {
                id: true,
                title: true,
                difficulty: true,
                tags: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        Submission: {
          select: {
            id: true,
            status: true,
            language: true,
            createdAt: true,
            problem: {
              select: {
                title: true,
                difficulty: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 50
        },
        PatternProgress: {
          include: {
            pattern: {
              select: {
                name: true,
                slug: true
              }
            }
          }
        },
        ContestRegistration: {
          include: {
            contest: {
              select: {
                name: true,
                startTime: true,
                endTime: true
              }
            }
          },
          take: 10,
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Calculate statistics
    const totalSubmissions = user.Submission.length;
    const acceptedSubmissions = user.Submission.filter(s => s.status === 'ACCEPTED').length;
    const successRate = totalSubmissions > 0 
      ? parseFloat(((acceptedSubmissions / totalSubmissions) * 100).toFixed(1))
      : 0;

    // Language breakdown
    const languageStats = {};
    user.Submission.forEach(sub => {
      languageStats[sub.language] = (languageStats[sub.language] || 0) + 1;
    });

    // Difficulty breakdown
    const difficultyStats = {
      EASY: 0,
      MEDIUM: 0,
      HARD: 0
    };
    user.solvedProblem.forEach(sp => {
      difficultyStats[sp.problem.difficulty]++;
    });

    // Submission timeline (last 30 days, daily buckets)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentSubmissions = user.Submission.filter(s => s.createdAt >= thirtyDaysAgo);
    const submissionTimeline = [];
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(thirtyDaysAgo);
      date.setDate(thirtyDaysAgo.getDate() + i);
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);
      
      const count = recentSubmissions.filter(s => 
        s.createdAt >= date && s.createdAt < nextDay
      ).length;
      
      submissionTimeline.push({
        date: date.toISOString().split('T')[0],
        count
      });
    }

    // Recent activity (last 10 submissions)
    const recentActivity = user.Submission.slice(0, 10).map(sub => ({
      id: sub.id,
      problemTitle: sub.problem.title,
      difficulty: sub.problem.difficulty,
      status: sub.status,
      language: sub.language,
      submittedAt: sub.createdAt
    }));

    // Pattern progress
    const patternProgress = user.PatternProgress.map(pp => ({
      patternName: pp.pattern.name,
      patternSlug: pp.pattern.slug,
      completedProblems: pp.completedProblems,
      totalProblems: pp.totalProblems,
      progressPercentage: pp.totalProblems > 0 
        ? parseFloat(((pp.completedProblems / pp.totalProblems) * 100).toFixed(1))
        : 0
    }));

    // Tag preferences (top 5)
    const tagCounts = {};
    user.solvedProblem.forEach(sp => {
      sp.problem.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    const topTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag, count]) => ({ tag, count }));

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          createdAt: user.createdAt,
          subscription: user.Subscription?.plan || 'FREE'
        },
        stats: {
          problemsSolved: user.solvedProblem.length,
          totalSubmissions,
          acceptedSubmissions,
          successRate,
          difficultyBreakdown: difficultyStats,
          contestsParticipated: user.ContestRegistration.length
        },
        languageStats,
        submissionTimeline,
        recentActivity,
        patternProgress,
        topTags,
        contests: user.ContestRegistration.map(cr => ({
          name: cr.contest.name,
          startTime: cr.contest.startTime,
          endTime: cr.contest.endTime,
          registeredAt: cr.createdAt
        }))
      }
    });
  } catch (error) {
    console.error("[Monitoring] Error fetching user details:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching user details"
    });
  }
};
