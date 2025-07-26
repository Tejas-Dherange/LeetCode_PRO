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
    res.status(500).json({ success: false, message: "Failed to fetch company sheets" });
  }
};

export const getPremiumCompanySheets = async (req, res) => {
  // Get all premium company sheets
  try {
    const premiumCompanySheets = await db.companySheet.findMany({
      where: { isPremium: true }, // Only fetch premium sheets
      orderBy: { createdAt: "desc" },
    });

    res.json({
      success: true,
      sheets: premiumCompanySheets,
    });
  } catch (error) {
    console.error("Error fetching premium company sheets:", error);
    res.status(500).json({ success: false, message: "Failed to fetch premium company sheets" });
  }
};

export const getCompanySheetProblems = async (req, res) => {
  // Get problems for specific company sheet
  try {
    const { id } = req.params;

    const companySheet = await db.companySheet.findUnique({
      where: { id },
      include: {
        problems: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!companySheet) {
      return res.status(404).json({ success: false, message: "Company sheet not found" });
    }

    res.json({
      success: true,
      sheet: companySheet,
    });
  } catch (error) {
    console.error("Error fetching company sheet problems:", error);
    res.status(500).json({ success: false, message: "Failed to fetch company sheet problems" });
  }
};

export const createCompanySheet = async (req, res) => {
  // Create a new company sheet

  try {
    const { name, description,slug, color, isPremium, requiredPlan } =
      req.body;

    if(req.user.role !== "ADMIN") {
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
        requiredPlan: requiredPlan || "FREE"
      },
    });

    res
      .status(201)
      .json({
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

    if(req.user.role !== "ADMIN") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const updatedSheet = await db.companySheet.update({
      where: { id },
      data: {
        name,
        description,
        color,
        isPremium,
        requiredPlan
      },
    });

    res.json({
      success: true,
      message: "Company sheet updated successfully",
      sheet: updatedSheet,
    });
  } catch (error) {
    console.error("Error updating company sheet:", error);
    res.status(500).json({ success: false, message: "Failed to update company sheet" });
  }
};

export const deleteCompanySheet = async (req, res) => {
  // Delete a company sheet
  try {
    const { id } = req.params;

    if(req.user.role !== "ADMIN") {
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
    res.status(500).json({ success: false, message: "Failed to delete company sheet" });
  }
};

export const addProblemToCompanySheet = async (req, res) => {
  // Add a problem to a company sheet
  try {
    const { sheetId, problemId, difficulty, frequency } = req.body;

    if(req.user.role !== "ADMIN") {
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
    res.status(500).json({ success: false, message: "Failed to add problem to company sheet" });
  }
};



