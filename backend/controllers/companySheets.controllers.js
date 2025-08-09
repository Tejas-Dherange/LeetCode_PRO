import db from "../libs/db.js";

export const getCompanySheets = async (req, res) => {
  // Get all company sheets
  try {
    const companySheets = await db.companySheet.findMany({
      where: { isPremium: false }, // Only fetch non-premium sheets for basic access
      orderBy: { createdAt: "desc" },
    });

    res.json({
      success: true,
      sheets: companySheets,
    });
  } catch (error) {
    console.error("Error fetching company sheets:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch company sheets" });
  }
};

export const getPremiumCompanySheets = async (req, res) => {
  // Get all premium company sheets
  try {
    const premiumCompanySheets = await db.companySheet.findMany({
      where: { isPremium: true },
      orderBy: { createdAt: "desc" },
      include: {
        problems: {
          select: {
            id: true,
            difficulty: true,
            tags: true,
            frequency: true,
          },
        },
      },
    });

    const formattedSheets = premiumCompanySheets.map((sheet) => ({
      id: sheet.id,
      name: sheet.name,
      color: sheet.color.startsWith("#") ? sheet.color : `bg-${sheet.color}`, // Optional: ensure Tailwind class format
      problems: sheet.problems.map((problem) => ({
        id: problem.id,
        difficulty: problem.difficulty,
        tags: problem.tags,
        frequency: problem.frequency,
      })),
    }));


    res.json({
      success: true,
      sheets: formattedSheets,
    });
  } catch (error) {
    console.error("Error fetching premium company sheets:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch premium company sheets",
      });
  }
};

export const getCompanySheetProblems = async (req, res) => {
  try {
    const { id } = req.params;

    const companySheet = await db.companySheet.findUnique({
      where: { id },
      include: {
        problems: {
          orderBy: { createdAt: "asc" },
          include: {
            problem: {
              select: {
                id: true,
                title: true,
                description: true,
                tags: true,
              },
            },
          },
        },
      },
    });

    if (!companySheet) {
      return res.status(404).json({
        success: false,
        message: "Company sheet not found",
      });
    }

    // Transform into your desired format
    const formattedSheet = {
      name: companySheet.name,
      color: companySheet.color,
      problems: companySheet.problems.map((p) => ({
        id: p.problem.id,
        title: p.problem.title,
        difficulty: p.difficulty,
        status: "unsolved", // or fetch from user progress
        tags: p.problem.tags || [],
        description: p.problem.description,
      })),
    };

    res.json({
      success: true,
      sheet: formattedSheet,
    });
  } catch (error) {
    console.error("Error fetching company sheet problems:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch company sheet problems",
    });
  }
};


export const createCompanySheet = async (req, res) => {
  // Create a new company sheet

  try {
    const { name, description, slug, color, isPremium, requiredPlan } =
      req.body;

    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Name is required" });
    }

    const newSheet = await db.companySheet.create({
      data: {
        name,
        description,
        color: color || "#3B82F6", // Default to blue if not provided
        isPremium: isPremium || false,
        logoUrl: "",
        slug: slug ? slug : name.toLowerCase().replace(/\s+/g, "-"),
        requiredPlan: requiredPlan || "FREE",
      },
    });

    res.status(201).json({
      success: true,
      message: "Company sheet created successfully",
      sheet: newSheet,
    });
  } catch (error) {
    console.error("Error creating company sheet:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to create company sheet" });
  }
};

export const updateCompanySheet = async (req, res) => {
  // Update an existing company sheet
  try {
    const { id } = req.params;
    const { name, description, color, isPremium, requiredPlan } = req.body;

    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const updatedSheet = await db.companySheet.update({
      where: { id },
      data: {
        name,
        description,
        color,
        isPremium,
        requiredPlan,
      },
    });

    res.json({
      success: true,
      message: "Company sheet updated successfully",
      sheet: updatedSheet,
    });
  } catch (error) {
    console.error("Error updating company sheet:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update company sheet" });
  }
};

export const deleteCompanySheet = async (req, res) => {
  // Delete a company sheet
  try {
    const { id } = req.params;

    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    await db.companySheet.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "Company sheet deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting company sheet:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete company sheet" });
  }
};

export const addProblemToCompanySheet = async (req, res) => {
  // Add a problem to a company sheet
  try {
    const { sheetId, problemId, difficulty, frequency } = req.body;

    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const updatedSheet = await db.CompanySheetProblem.create({
      data: {
        companySheetId: sheetId,
        problemId,
        difficulty,
        frequency,
      },
    });
    res.json({
      success: true,
      message: "Problem added to company sheet successfully",
      sheet: updatedSheet,
    });
  } catch (error) {
    console.error("Error adding problem to company sheet:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to add problem to company sheet",
      });
  }
};
