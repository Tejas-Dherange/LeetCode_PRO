/**
 * Judge0 Integration Library
 * 
 * Supports both:
 * 1. RapidAPI / Sulu.sh (requires API key)
 * 2. Self-hosted Judge0 (no API key)
 * 
 * Auto-detects based on JUDGE0_SULU_API_KEY environment variable
 */

import axios from "axios";

/**
 * Get headers for Judge0 requests
 * Automatically adds Authorization header if API key is present
 */
const getJudge0Headers = () => {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  // If API key is set, add Authorization header (for RapidAPI/Sulu)
  if (process.env.JUDGE0_SULU_API_KEY && process.env.JUDGE0_SULU_API_KEY.trim()) {
    // headers["X-Auth-Token"] = process.env.JUDGE0_SULU_API_KEY;
     headers["x-rapidapi-key"] = process.env.JUDGE0_SULU_API_KEY;       // ← correct header name
     headers["x-rapidapi-host"] = "judge0-ce.p.rapidapi.com"; 
    console.log('[Judge0] Using API authentication (RapidAPI/Sulu)');
  } else {
    console.log('[Judge0] Using self-hosted mode (no auth)');
  }

  return headers;
};

export const getLanguageById = (language) => {
  const languageMap = {
    JAVASCRIPT: 63,  // Node.js 12.14.0
    "C++": 54,       // GCC 9.2.0 (updated to latest)
    JAVA: 62,        // OpenJDK 13.0.1
    PYTHON: 71,      // Python 3.8.1
    C: 50,           // GCC 9.2.0
  };

  return languageMap[language.toUpperCase()];
};

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

/**
 * Submit batch of code submissions to Judge0
 * Works with both RapidAPI and self-hosted Judge0
 */
export const submitBatch = async (submissions) => {
  const endpoint = process.env.JUDGE0_BATCH_SUBMISSION_ENDPOINT;
  
  if (!endpoint) {
    throw new Error('JUDGE0_BATCH_SUBMISSION_ENDPOINT is not configured');
  }

  console.log(`[Judge0] Submitting batch to: ${endpoint}`);
  console.log(`[Judge0] Submissions count: ${submissions.length}`);

  try {
    const { data } = await axios.post(
      `${endpoint}/submissions/batch?base64_encoded=false`,
      {
        submissions: submissions,
      },
      {
        headers: getJudge0Headers(),
      }
    );

    console.log("[Judge0] Batch submission successful");
    return data;
  } catch (error) {
    console.error('[Judge0] Batch submission failed:', error.message);
    if (error.response) {
      console.error('[Judge0] Response status:', error.response.status);
      console.error('[Judge0] Response data:', error.response.data);
    }
    throw error;
  }
};

/**
 * Poll for batch submission results
 * Works with both RapidAPI and self-hosted Judge0
 */
export const pollBatchResults = async (tokens) => {
  const endpoint = process.env.JUDGE0_BATCH_SUBMISSION_ENDPOINT;
  
  if (!endpoint) {
    throw new Error('JUDGE0_BATCH_SUBMISSION_ENDPOINT is not configured');
  }

  let attempts = 0;
  const maxAttempts = 60; // 60 seconds max polling

  while (attempts < maxAttempts) {
    try {
      const { data } = await axios.get(
        `${endpoint}/submissions/batch`,
        {
          params: {
            tokens: tokens.join(","),
            base64_encoded: false,
          },
          headers: getJudge0Headers(),
        }
      );

      const results = data.submissions;
      
      // Log current status of submissions
      console.log(`[Judge0] Poll attempt ${attempts + 1}/${maxAttempts}`);
      const statusSummary = results.map(r => r.status.description).join(', ');
      console.log(`[Judge0] Statuses: ${statusSummary}`);
      
      // Check if all submissions are done (status.id not 1 or 2)
      // 1 = In Queue, 2 = Processing
      const isAllDone = results.every(
        (res) => res.status.id !== 1 && res.status.id !== 2
      );

      if (isAllDone) {
        console.log('[Judge0] All submissions completed');
        return results;
      }

      attempts++;
      await sleep(1000);
    } catch (error) {
      console.error('[Judge0] Polling error:', error.message);
      throw error;
    }
  }

  throw new Error('[Judge0] Polling timeout - submissions took too long');
};

export const getLanguageNameById = (languageId) => {
  const languageMap = {
    63: "JAVASCRIPT",  // Node.js 12.14.0
    54: "C++",         // GCC 9.2.0 (updated to latest)
    62: "JAVA",        // OpenJDK 13.0.1
    71: "PYTHON",      // Python 3.8.1
    50: "C",           // GCC 9.2.0
  };

  return languageMap[languageId];
};
