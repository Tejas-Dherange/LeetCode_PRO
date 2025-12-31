import db from "../libs/db.js";

const seedPatterns = async () => {
  try {
    console.log("🌱 Starting pattern seeding...");

    // Default patterns
    const patterns = [
      {
        name: "Two Pointers",
        slug: "two-pointers",
        description:
          "Use two pointers to traverse an array or list, often used for problems involving pairs or subarrays. Common in array manipulation and string problems.",
        link: "https://leetcode.com/tag/two-pointers/",
        icon: "👉",
        order: 1,
      },
      {
        name: "Fast and Slow Pointers",
        slug: "fast-and-slow-pointers",
        description:
          "Also known as Floyd's Cycle Detection. Uses two pointers moving at different speeds to detect cycles or find middle elements in linked lists.",
        link: "https://en.wikipedia.org/wiki/Cycle_detection#Floyd's_tortoise_and_hare",
        icon: "🐢",
        order: 2,
      },
      {
        name: "Sliding Window",
        slug: "sliding-window",
        description:
          "Maintain a window of elements while traversing an array. Useful for finding subarrays or substrings that satisfy certain conditions with optimal time complexity.",
        link: "https://leetcode.com/tag/sliding-window/",
        icon: "🪟",
        order: 3,
      },
      {
        name: "Kadane's Algorithm",
        slug: "kadanes-algorithm",
        description:
          "Find the maximum sum of a contiguous subarray in O(n) time. Classic dynamic programming pattern for optimization problems on arrays.",
        link: "https://en.wikipedia.org/wiki/Maximum_subarray_problem",
        icon: "📊",
        order: 4,
      },
      {
        name: "Prefix Sum",
        slug: "prefix-sum",
        description:
          "Precompute cumulative sums to answer range sum queries efficiently. Useful for problems involving subarray sums and range queries.",
        link: "https://en.wikipedia.org/wiki/Prefix_sum",
        icon: "➕",
        order: 5,
      },
      {
        name: "Merge Intervals",
        slug: "merge-intervals",
        description:
          "Combine overlapping intervals or ranges. Common in scheduling problems, calendar management, and time-based queries.",
        link: "https://leetcode.com/tag/intervals/",
        icon: "📅",
        order: 6,
      },
    ];

    // Create patterns
    for (const patternData of patterns) {
      const existingPattern = await db.pattern.findUnique({
        where: { slug: patternData.slug },
      });

      if (!existingPattern) {
        await db.pattern.create({
          data: patternData,
        });
        console.log(`✅ Created pattern: ${patternData.name}`);
      } else {
        console.log(`⏭️  Pattern already exists: ${patternData.name}`);
      }
    }

    console.log("✨ Pattern seeding completed!");
  } catch (error) {
    console.error("❌ Error seeding patterns:", error);
    throw error;
  }
};

// Run seed if this file is executed directly
const runSeed = async () => {
  try {
    await seedPatterns();
    await db.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error(error);
    await db.$disconnect();
    process.exit(1);
  }
};

// Check if this file is being run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runSeed();
}

export default seedPatterns;
