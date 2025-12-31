# How to Add Problems to Patterns - Quick Guide

## 🎯 Overview

After creating the pattern structure, you need to populate patterns with problems. Here's how to do it as an admin.

---

## 📝 Method 1: Using the Admin UI (Recommended)

### Step 1: Login as Admin
1. Navigate to `http://localhost:5173/login`
2. Login with your admin account

### Step 2: Access Pattern Management
1. Click on your profile icon (top right)
2. Select "Manage Patterns" from the dropdown
   - OR navigate directly to `/admin/patterns`

### Step 3: View Pattern Details
1. Click the "View" (eye icon) button next to any pattern
2. This takes you to the pattern detail page

### Step 4: Add Problems
1. Click the **"Add Problem"** button (top right)
2. In the modal:
   - Search for the problem by name
   - Select the problem from the dropdown
   - Set the order (position in pattern)
   - Optionally add a reference link
   - Optionally add notes about why this problem fits the pattern
3. Click **"Add Problem"**

### Step 5: Repeat
- Add more problems to build out the pattern
- Problems will automatically appear in order

---

## 📝 Method 2: Using API (Bulk Adding)

### Prerequisites:
- Backend running on `http://localhost:3000`
- Admin authentication token/cookie
- Problem IDs from your database

### Add Single Problem to Pattern:
```bash
POST /api/v1/patterns/:patternId/problems
Content-Type: application/json

{
  "problemId": "uuid-of-problem",
  "order": 1,
  "link": "https://example.com/solution",
  "notes": "Classic two pointer problem"
}
```

### Bulk Add Script:
```javascript
// Example: Add multiple problems to "Two Pointers" pattern
const twoPointerProblems = [
  {
    problemId: "problem-uuid-1",
    order: 1,
    notes: "Basic two pointer - opposite ends"
  },
  {
    problemId: "problem-uuid-2",
    order: 2,
    notes: "Two pointer - same direction"
  },
  // ... more problems
];

async function bulkAddProblems(patternId, problems) {
  const baseURL = "http://localhost:3000/api/v1";
  
  for (const problem of problems) {
    try {
      const response = await fetch(`${baseURL}/patterns/${patternId}/problems`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(problem),
      });
      
      if (response.ok) {
        console.log(`✅ Added problem ${problem.order}`);
      }
    } catch (error) {
      console.error(`❌ Error adding problem:`, error);
    }
  }
}

// Usage:
// bulkAddProblems("pattern-uuid", twoPointerProblems);
```

---

## 🎯 Recommended Problems for Each Pattern

### 1. Two Pointers 👉
**Easy:**
- Two Sum (if array is sorted)
- Valid Palindrome
- Remove Duplicates from Sorted Array
- Merge Sorted Array

**Medium:**
- 3Sum
- Container With Most Water
- Sort Colors (Dutch National Flag)
- Trapping Rain Water

**Hard:**
- Minimum Window Substring
- Trapping Rain Water II

---

### 2. Fast and Slow Pointers 🐢
**Easy:**
- Linked List Cycle
- Happy Number
- Middle of Linked List

**Medium:**
- Linked List Cycle II
- Find the Duplicate Number
- Reorder List
- Palindrome Linked List

**Hard:**
- Find Median from Data Stream

---

### 3. Sliding Window 🪟
**Easy:**
- Maximum Average Subarray I
- Contains Duplicate II

**Medium:**
- Longest Substring Without Repeating Characters
- Longest Repeating Character Replacement
- Permutation in String
- Maximum Sum Subarray of Size K
- Fruit Into Baskets

**Hard:**
- Minimum Window Substring
- Sliding Window Maximum
- Longest Substring with At Most K Distinct Characters

---

### 4. Kadane's Algorithm 📊
**Easy:**
- Maximum Subarray (classic)
- Best Time to Buy and Sell Stock

**Medium:**
- Maximum Product Subarray
- Maximum Sum Circular Subarray
- Longest Turbulent Subarray

**Hard:**
- Maximum Sum Rectangle in 2D Matrix

---

### 5. Prefix Sum ➕
**Easy:**
- Range Sum Query - Immutable
- Find Pivot Index

**Medium:**
- Subarray Sum Equals K
- Continuous Subarray Sum
- Product of Array Except Self
- Range Sum Query 2D - Immutable

**Hard:**
- Count of Range Sum
- Maximum Sum of Rectangle No Larger Than K

---

### 6. Merge Intervals 📅
**Easy:**
- Meeting Rooms

**Medium:**
- Merge Intervals (classic)
- Insert Interval
- Non-overlapping Intervals
- Meeting Rooms II
- Interval List Intersections

**Hard:**
- Employee Free Time
- Data Stream as Disjoint Intervals

---

## 🔍 Finding Problem IDs

### Method 1: Check Database
```sql
SELECT id, title FROM "Problem" 
WHERE title LIKE '%Two Sum%';
```

### Method 2: Use Problem Store
In your frontend:
```javascript
import { useProblemStore } from './store/useProblemStore';

// In your component
const { problems, getAllProblems } = useProblemStore();

useEffect(() => {
  getAllProblems();
}, []);

// Then search in problems array
const twoSumProblem = problems.find(p => p.title.includes('Two Sum'));
console.log('Problem ID:', twoSumProblem.id);
```

### Method 3: API Call
```bash
GET /api/v1/problems/getAllProblems
```

---

## ✅ Verification Steps

After adding problems:

1. **Check Pattern Detail Page**
   - Navigate to `/patterns/:slug`
   - Verify problems appear in correct order
   - Check difficulty badges display correctly

2. **Test Filtering**
   - Use difficulty filter (Easy/Medium/Hard)
   - Use status filter (Solved/Unsolved)

3. **Solve a Problem**
   - Click on a problem
   - Submit a correct solution
   - Return to pattern page
   - Verify progress bar updated
   - Check problem shows "Solved" badge

4. **Check Progress**
   - Navigate to `/patterns`
   - Verify pattern card shows updated progress
   - Progress percentage should update
   - Completed count should increment

---

## 🎨 Best Practices

### Ordering:
- Start with easiest problems (order: 1, 2, 3...)
- Progress from Easy → Medium → Hard
- Put fundamental problems first

### Notes:
- Explain why this problem fits the pattern
- Add key insights or hints
- Mention variations of the pattern used

### Links:
- Link to LeetCode problem
- Link to solution explanation
- Link to video tutorial

### Coverage:
- Include 5-10 problems per pattern (minimum)
- Mix difficulty levels
- Cover different variations of the pattern

---

## 📊 Example: Complete Two Pointers Pattern

```javascript
// Complete setup for Two Pointers pattern
const twoPointerSetup = {
  pattern: {
    name: "Two Pointers",
    slug: "two-pointers",
    icon: "👉",
  },
  problems: [
    {
      title: "Valid Palindrome",
      order: 1,
      notes: "Introduction to two pointers - opposite ends",
      difficulty: "EASY"
    },
    {
      title: "Two Sum II",
      order: 2,
      notes: "Two pointers on sorted array",
      difficulty: "EASY"
    },
    {
      title: "3Sum",
      order: 3,
      notes: "Extension to three numbers - reduces to Two Sum",
      difficulty: "MEDIUM"
    },
    {
      title: "Container With Most Water",
      order: 4,
      notes: "Greedy approach with two pointers",
      difficulty: "MEDIUM"
    },
    {
      title: "Trapping Rain Water",
      order: 5,
      notes: "Advanced two pointer with preprocessing",
      difficulty: "HARD"
    }
  ]
};
```

---

## 🚀 Quick Start Script

Save this as `add-pattern-problems.js`:

```javascript
// Configuration
const BACKEND_URL = "http://localhost:3000/api/v1";
const PATTERN_ID = "your-pattern-uuid"; // Get from database or API

const problems = [
  // Add your problem IDs and details here
  { problemId: "uuid-1", order: 1, notes: "Intro problem" },
  { problemId: "uuid-2", order: 2, notes: "Next level" },
];

async function addProblems() {
  for (const problem of problems) {
    const response = await fetch(`${BACKEND_URL}/patterns/${PATTERN_ID}/problems`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(problem),
    });
    
    const data = await response.json();
    console.log(data.success ? `✅ ${problem.order}` : `❌ ${data.message}`);
  }
}

addProblems();
```

---

## 💡 Tips

1. **Start Small**: Begin with 3-5 problems per pattern
2. **Test Often**: Solve one problem and verify progress updates
3. **Iterate**: Add more problems based on user feedback
4. **Curate**: Quality over quantity - choose representative problems
5. **Document**: Add helpful notes for each problem

---

## 🆘 Troubleshooting

**Problem not appearing?**
- Check if problem ID is correct
- Verify pattern ID is correct
- Check backend logs for errors

**Progress not updating?**
- Ensure problem is marked as "Accepted"
- Check PatternProgress table in database
- Verify updatePatternProgress function is called

**Can't add duplicate?**
- Each problem can only be in a pattern once
- Remove and re-add if you need to update

---

Happy pattern building! 🎉
