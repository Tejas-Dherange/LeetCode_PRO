import db from "../libs/db.js";

export const getContributionActivity = async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    // STEP 1: Fetch all submissions (not solved problems)
    const submissions = await db.submission.findMany({
      where: {
        userId,
        createdAt: {
          gte: oneYearAgo,
        },
      },
      select: {
        createdAt: true,
      },
    });

    // STEP 2: Group by Date (YYYY-MM-DD)
    const grouped = {};
    submissions.forEach((s) => {
      const date = s.createdAt.toISOString().split("T")[0];
      grouped[date] = (grouped[date] || 0) + 1;
    });

    // STEP 3: Convert to heatmap format
    const formatted = Object.entries(grouped).map(([date, count]) => ({
      date,
      count,
    }));

    return res.status(200).json({
      success: true,
      message: "Contribution activity fetched successfully",
      data: formatted,
    });
  } catch (error) {
    console.error("Error fetching contribution activity:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
