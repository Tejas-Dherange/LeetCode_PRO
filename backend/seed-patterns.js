// Run this in browser console or use Postman to seed patterns
// Make sure backend is running on http://localhost:3000

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

// Function to create patterns
async function seedPatterns() {
  const baseURL = "http://localhost:3000/api/v1";
  
  console.log("🌱 Starting to seed patterns...");

  for (const pattern of patterns) {
    try {
      const response = await fetch(`${baseURL}/patterns`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add your auth token here if needed
          // "Authorization": "Bearer YOUR_TOKEN"
        },
        credentials: "include", // Important for cookies
        body: JSON.stringify(pattern),
      });

      const data = await response.json();
      
      if (response.ok) {
        console.log(`✅ Created pattern: ${pattern.name}`);
      } else {
        console.log(`⏭️  ${data.message || 'Pattern might already exist'}: ${pattern.name}`);
      }
    } catch (error) {
      console.error(`❌ Error creating ${pattern.name}:`, error);
    }
  }

  console.log("✨ Pattern seeding completed!");
}

// Run the function
seedPatterns();

// Alternative: Using axios (if available)
// import axios from 'axios';
// 
// async function seedPatternsAxios() {
//   const baseURL = "http://localhost:3000/api/v1";
//   
//   for (const pattern of patterns) {
//     try {
//       await axios.post(`${baseURL}/patterns`, pattern, {
//         withCredentials: true
//       });
//       console.log(`✅ Created pattern: ${pattern.name}`);
//     } catch (error) {
//       console.log(`⏭️  Pattern might exist: ${pattern.name}`);
//     }
//   }
// }
