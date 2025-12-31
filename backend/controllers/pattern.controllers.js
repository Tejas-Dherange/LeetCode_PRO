import db from "../libs/db.js";

// Get all patterns with problem counts and user progress
export const getAllPatterns = async (req, res) => {
  const userId = req.user?.id;

  try {
    const patterns = await db.pattern.findMany({
      where: { isActive: true },
      include: {
        problems: {
          select: { id: true },
        },
        patternProgress: userId
          ? {
              where: { userId },
              select: {
                completedProblems: true,
                totalProblems: true,
                lastSolvedAt: true,
              },
            }
          : false,
      },
      orderBy: { order: "asc" },
    });

    const formattedPatterns = patterns.map((pattern) => ({
      id: pattern.id,
      name: pattern.name,
      slug: pattern.slug,
      description: pattern.description,
      link: pattern.link,
      icon: pattern.icon,
      order: pattern.order,
      totalProblems: pattern.problems.length,
      completedProblems: pattern.patternProgress?.[0]?.completedProblems || 0,
      progress: pattern.patternProgress?.[0]
        ? Math.round(
            (pattern.patternProgress[0].completedProblems /
              pattern.patternProgress[0].totalProblems) *
              100
          )
        : 0,
      lastSolvedAt: pattern.patternProgress?.[0]?.lastSolvedAt || null,
    }));

    return res.status(200).json({
      success: true,
      message: "Patterns fetched successfully",
      patterns: formattedPatterns,
    });
  } catch (error) {
    console.error("Error in getAllPatterns:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching patterns",
    });
  }
};

// Get pattern by ID with problems
export const getPatternById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  try {
    const pattern = await db.pattern.findUnique({
      where: { id },
      include: {
        problems: {
          include: {
            problem: {
              select: {
                id: true,
                title: true,
                difficulty: true,
                tags: true,
                companyTags: true,
              },
            },
          },
          orderBy: { order: "asc" },
        },
        patternProgress: userId
          ? {
              where: { userId },
            }
          : false,
      },
    });

    if (!pattern) {
      return res.status(404).json({
        success: false,
        message: "Pattern not found",
      });
    }

    // Get solved problems for this user
    let solvedProblemIds = [];
    if (userId) {
      const solvedProblems = await db.problemSolved.findMany({
        where: {
          userId,
          problemId: {
            in: pattern.problems.map((p) => p.problemId),
          },
        },
        select: { problemId: true },
      });
      solvedProblemIds = solvedProblems.map((sp) => sp.problemId);
    }

    const formattedPattern = {
      id: pattern.id,
      name: pattern.name,
      slug: pattern.slug,
      description: pattern.description,
      link: pattern.link,
      icon: pattern.icon,
      problems: pattern.problems.map((p) => ({
        id: p.id,
        problemId: p.problem.id,
        title: p.problem.title,
        difficulty: p.problem.difficulty,
        tags: p.problem.tags,
        companyTags: p.problem.companyTags,
        order: p.order,
        link: p.link,
        notes: p.notes,
        isSolved: solvedProblemIds.includes(p.problem.id),
      })),
      progress: pattern.patternProgress?.[0] || {
        completedProblems: 0,
        totalProblems: pattern.problems.length,
        lastSolvedAt: null,
      },
    };

    return res.status(200).json({
      success: true,
      message: "Pattern fetched successfully",
      pattern: formattedPattern,
    });
  } catch (error) {
    console.error("Error in getPatternById:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching pattern",
    });
  }
};

// Get pattern by slug
export const getPatternBySlug = async (req, res) => {
  const { slug } = req.params;
  const userId = req.user?.id;

  try {
    const pattern = await db.pattern.findUnique({
      where: { slug },
      include: {
        problems: {
          include: {
            problem: {
              select: {
                id: true,
                title: true,
                difficulty: true,
                tags: true,
                companyTags: true,
              },
            },
          },
          orderBy: { order: "asc" },
        },
        patternProgress: userId
          ? {
              where: { userId },
            }
          : false,
      },
    });

    if (!pattern) {
      return res.status(404).json({
        success: false,
        message: "Pattern not found",
      });
    }

    // Get solved problems for this user
    let solvedProblemIds = [];
    if (userId) {
      const solvedProblems = await db.problemSolved.findMany({
        where: {
          userId,
          problemId: {
            in: pattern.problems.map((p) => p.problemId),
          },
        },
        select: { problemId: true },
      });
      solvedProblemIds = solvedProblems.map((sp) => sp.problemId);
    }

    const formattedPattern = {
      id: pattern.id,
      name: pattern.name,
      slug: pattern.slug,
      description: pattern.description,
      link: pattern.link,
      icon: pattern.icon,
      problems: pattern.problems.map((p) => ({
        id: p.id,
        problemId: p.problem.id,
        title: p.problem.title,
        difficulty: p.problem.difficulty,
        tags: p.problem.tags,
        companyTags: p.problem.companyTags,
        order: p.order,
        link: p.link,
        notes: p.notes,
        isSolved: solvedProblemIds.includes(p.problem.id),
      })),
      progress: pattern.patternProgress?.[0] || {
        completedProblems: 0,
        totalProblems: pattern.problems.length,
        lastSolvedAt: null,
      },
    };

    return res.status(200).json({
      success: true,
      message: "Pattern fetched successfully",
      pattern: formattedPattern,
    });
  } catch (error) {
    console.error("Error in getPatternBySlug:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching pattern",
    });
  }
};

// Get user progress for all patterns
export const getUserPatternProgress = async (req, res) => {
  const userId = req.user.id;

  try {
    const progress = await db.patternProgress.findMany({
      where: { userId },
      include: {
        pattern: {
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Pattern progress fetched successfully",
      progress,
    });
  } catch (error) {
    console.error("Error in getUserPatternProgress:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching pattern progress",
    });
  }
};

// Create a new pattern (Admin only)
export const createPattern = async (req, res) => {
  const user = req.user;

  if (user.role !== "ADMIN") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { name, slug, description, link, icon, order } = req.body;

  if (!name || !slug || !description) {
    return res.status(400).json({
      success: false,
      message: "Name, slug, and description are required",
    });
  }

  try {
    // Check if pattern with same slug exists
    const existingPattern = await db.pattern.findUnique({
      where: { slug },
    });

    if (existingPattern) {
      return res.status(400).json({
        success: false,
        message: "Pattern with this slug already exists",
      });
    }

    const pattern = await db.pattern.create({
      data: {
        name,
        slug,
        description,
        link: link || null,
        icon: icon || "📚",
        order: order || 0,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Pattern created successfully",
      pattern,
    });
  } catch (error) {
    console.error("Error in createPattern:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating pattern",
    });
  }
};

// Update pattern (Admin only)
export const updatePattern = async (req, res) => {
  const user = req.user;

  if (user.role !== "ADMIN") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id } = req.params;
  const { name, slug, description, link, icon, order, isActive } = req.body;

  try {
    const pattern = await db.pattern.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description && { description }),
        ...(link !== undefined && { link }),
        ...(icon && { icon }),
        ...(order !== undefined && { order }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Pattern updated successfully",
      pattern,
    });
  } catch (error) {
    console.error("Error in updatePattern:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating pattern",
    });
  }
};

// Delete pattern (Admin only)
export const deletePattern = async (req, res) => {
  const user = req.user;

  if (user.role !== "ADMIN") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id } = req.params;

  try {
    await db.pattern.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: "Pattern deleted successfully",
    });
  } catch (error) {
    console.error("Error in deletePattern:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting pattern",
    });
  }
};

// Add problem to pattern (Admin only)
export const addProblemToPattern = async (req, res) => {
  const user = req.user;

  if (user.role !== "ADMIN") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { patternId } = req.params;
  const { problemId, order, link, notes } = req.body;

  if (!problemId) {
    return res.status(400).json({
      success: false,
      message: "Problem ID is required",
    });
  }

  try {
    // Check if problem already in pattern
    const existing = await db.problemInPattern.findUnique({
      where: {
        patternId_problemId: {
          patternId,
          problemId,
        },
      },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Problem already in this pattern",
      });
    }

    const problemInPattern = await db.problemInPattern.create({
      data: {
        patternId,
        problemId,
        order: order || 0,
        link: link || null,
        notes: notes || null,
      },
      include: {
        problem: {
          select: {
            id: true,
            title: true,
            difficulty: true,
          },
        },
      },
    });

    // Update all users' pattern progress total count
    await db.patternProgress.updateMany({
      where: { patternId },
      data: {
        totalProblems: {
          increment: 1,
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: "Problem added to pattern successfully",
      problemInPattern,
    });
  } catch (error) {
    console.error("Error in addProblemToPattern:", error);
    return res.status(500).json({
      success: false,
      message: "Error adding problem to pattern",
    });
  }
};

// Remove problem from pattern (Admin only)
export const removeProblemFromPattern = async (req, res) => {
  const user = req.user;

  if (user.role !== "ADMIN") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { patternId, problemId } = req.params;

  try {
    await db.problemInPattern.delete({
      where: {
        patternId_problemId: {
          patternId,
          problemId,
        },
      },
    });

    // Update all users' pattern progress total count
    await db.patternProgress.updateMany({
      where: { patternId },
      data: {
        totalProblems: {
          decrement: 1,
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Problem removed from pattern successfully",
    });
  } catch (error) {
    console.error("Error in removeProblemFromPattern:", error);
    return res.status(500).json({
      success: false,
      message: "Error removing problem from pattern",
    });
  }
};

// Update problem order in pattern (Admin only)
export const updateProblemOrder = async (req, res) => {
  const user = req.user;

  if (user.role !== "ADMIN") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { patternId } = req.params;
  const { problemOrders } = req.body; // Array of { problemId, order }

  if (!Array.isArray(problemOrders)) {
    return res.status(400).json({
      success: false,
      message: "problemOrders must be an array",
    });
  }

  try {
    // Update each problem's order
    await Promise.all(
      problemOrders.map((item) =>
        db.problemInPattern.update({
          where: {
            patternId_problemId: {
              patternId,
              problemId: item.problemId,
            },
          },
          data: {
            order: item.order,
          },
        })
      )
    );

    return res.status(200).json({
      success: true,
      message: "Problem orders updated successfully",
    });
  } catch (error) {
    console.error("Error in updateProblemOrder:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating problem orders",
    });
  }
};

// Update pattern progress when user solves a problem
export const updatePatternProgress = async (userId, problemId) => {
  try {
    console.log(`🔄 Updating pattern progress for user: ${userId}, problem: ${problemId}`);
    
    // Find all patterns that contain this problem
    const problemInPatterns = await db.problemInPattern.findMany({
      where: { problemId },
      select: { patternId: true },
    });

    console.log(`📚 Found ${problemInPatterns.length} patterns containing this problem`);

    for (const pip of problemInPatterns) {
      // Get all problems in this pattern
      const patternProblems = await db.problemInPattern.findMany({
        where: { patternId: pip.patternId },
        select: { problemId: true },
      });

      const totalProblems = patternProblems.length;
      
      // Count how many problems in this pattern the user has solved
      const solvedProblemsInPattern = await db.problemSolved.count({
        where: {
          userId,
          problemId: {
            in: patternProblems.map(p => p.problemId),
          },
        },
      });

      console.log(`✅ Pattern ${pip.patternId}: ${solvedProblemsInPattern}/${totalProblems} solved`);

      // Check if user already has progress record for this pattern
      const existingProgress = await db.patternProgress.findUnique({
        where: {
          userId_patternId: {
            userId,
            patternId: pip.patternId,
          },
        },
      });

      if (existingProgress) {
        // Update existing progress with actual count
        await db.patternProgress.update({
          where: {
            userId_patternId: {
              userId,
              patternId: pip.patternId,
            },
          },
          data: {
            completedProblems: solvedProblemsInPattern,
            totalProblems,
            lastSolvedAt: new Date(),
          },
        });
        console.log(`📝 Updated progress for pattern ${pip.patternId}`);
      } else {
        // Create new progress record
        await db.patternProgress.create({
          data: {
            userId,
            patternId: pip.patternId,
            completedProblems: solvedProblemsInPattern,
            totalProblems,
            lastSolvedAt: new Date(),
          },
        });
        console.log(`🆕 Created progress for pattern ${pip.patternId}`);
      }
    }
  } catch (error) {
    console.error("❌ Error updating pattern progress:", error);
  }
};

// Recalculate all pattern progress for a user (utility function)
export const recalculateUserProgress = async (req, res) => {
  const userId = req.user.id;

  try {
    console.log(`🔄 Recalculating all pattern progress for user: ${userId}`);

    // Get all patterns
    const patterns = await db.pattern.findMany({
      where: { isActive: true },
      include: {
        problems: {
          select: { problemId: true },
        },
      },
    });

    let updatedCount = 0;

    for (const pattern of patterns) {
      if (pattern.problems.length === 0) continue;

      // Count how many problems in this pattern the user has solved
      const solvedProblemsInPattern = await db.problemSolved.count({
        where: {
          userId,
          problemId: {
            in: pattern.problems.map(p => p.problemId),
          },
        },
      });

      const totalProblems = pattern.problems.length;

      // Upsert progress record
      await db.patternProgress.upsert({
        where: {
          userId_patternId: {
            userId,
            patternId: pattern.id,
          },
        },
        update: {
          completedProblems: solvedProblemsInPattern,
          totalProblems,
          lastSolvedAt: solvedProblemsInPattern > 0 ? new Date() : null,
        },
        create: {
          userId,
          patternId: pattern.id,
          completedProblems: solvedProblemsInPattern,
          totalProblems,
          lastSolvedAt: solvedProblemsInPattern > 0 ? new Date() : null,
        },
      });

      updatedCount++;
      console.log(`✅ Pattern "${pattern.name}": ${solvedProblemsInPattern}/${totalProblems}`);
    }

    return res.status(200).json({
      success: true,
      message: `Recalculated progress for ${updatedCount} patterns`,
      details: `Check console for details`,
    });
  } catch (error) {
    console.error("❌ Error recalculating progress:", error);
    return res.status(500).json({
      success: false,
      message: "Error recalculating pattern progress",
    });
  }
};
