# System Scale Estimation & Capacity Planning

This document provides a "back-of-the-envelope" calculation of the current system's capacity and identifies critical bottlenecks.

---

## 📊 Executive Summary

| Component | Current Capacity (Approx.) | Limiting Factor |
| :--- | :--- | :--- |
| **Browsing Users** | **2,000 - 5,000** concurrent | Database Connections (20 max) |
| **Real-Time Users** | **~5,000** connected | Node.js Single Thread / RAM |
| **Code Submissions** | **~150** per minute | **Worker Concurrency (5)** |
| **Database Storage** | **~10M** records | Disk Space (Not a bottleneck) |

> **Verdict:** Your system handles **browsing/reading** well but will struggle if **>150 users** try to submit code simultaneously (e.g., in a contest end-rush).

---

## 🧮 Detailed Calculations

### 1. Code Execution Engine (The Hardest Bottleneck)
This is the most resource-intensive part of your app.

*   **Configured Concurrency:** `WORKER_CONCURRENCY = 5`
*   **Average Execution Time:** ~2 seconds (includes network to Judge0, processing, db save)
*   **Throughput Formula:** $\frac{\text{Concurrency}}{\text{Avg Time}} = \text{Ops/Sec}$
*   **Calculation:** $\frac{5}{2} = 2.5 \text{ submissions/second}$
*   **Per Minute:** $2.5 \times 60 = \mathbf{150 \text{ submissions/minute}}$

**Impact:**
If 500 users participate in a contest and all submit in the last 2 minutes:
*   Total Submissions: 500
*   Time to Process: $\frac{500}{2.5} = 200 \text{ seconds}$ (~3.5 minutes)
*   **Result:** Users will see "Pending..." for up to 3.5 minutes.

### 2. Real-Time Leaderboard
*   **Technology:** Redis Pub/Sub + Socket.io
*   **Efficiency:** High. The backend broadcasts 1 message per submission.
*   **Fan-out:** If 1000 users are online, 1 submission = 1000 outgoing packets.
*   **Node.js Capacity:** Can handle ~10k-50k small packets/sec.
*   **Limit:** Single Node.js instance CPU.
*   **Estimate:** Can comfortably handle **1,000 - 2,000** users watching the leaderboard live without lag.

### 3. Database (PostgreSQL)
*   **Configured Pool:** `connection_limit = 20`
*   **Query Time (Reads):** ~5-10ms (thanks to new indexes).
*   **Query Time (Writes):** ~20-50ms.
*   **Throughput:** $\frac{20 \text{ conns}}{0.01s} = 2,000 \text{ queries/sec}$ (theoretical max).
*   **Realistic:** ~500-800 req/sec considering complex joins.
*   **Estimate:** Sufficient for **5,000+** concurrent browsing users (loading pages, profiles, problems).

---

## 📈 Scaling Roadmap

To handle **10x Scale (10k Users, 2k Submissions/min):**

### Phase 1: Easy Wins (Configuration)
1.  **Increase Worker Concurrency:** Change `WORKER_CONCURRENCY` to **20**.
    *   *Result:* 600 subs/min (4x capacity).
    *   *Req:* Stronger VPS (4-8 vCPUs).
2.  **Increase DB Pool:** Change `connection_limit` to **50**.
    *   *Result:* Higher read throughput.

### Phase 2: Horizontal Scaling (Architectural)
1.  **Multiple API Servers:** Run 3-4 instances of the backend behind a Load Balancer (Nginx/AWS ALB).
    *   *Result:* Handle 20k+ concurrent websocket connections.
2.  **Dedicated Worker Fleet:** Move `codeExecutionWorker.js` to a separate fleet of servers.
    *   *Result:* Infinite submission scaling (just add more worker servers).

### Phase 3: Database Scaling
1.  **Read Replicas:** Send all `GET` requests to read-only DB replicas.
2.  **Caching:** Cache `getContestLeaderboard` for 30s using Redis.
    *   *Result:* Database load drops by 95%.

---

## 🧪 Load Testing Plan
To verify these numbers, you can run a load test using tools like **Artillery** or **k6**:

1.  **Smoke Test:** 10 virtual users (VUs) submitting code.
2.  **Stress Test:** 500 VUs browsing, 50 VUs submitting.
3.  **Spike Test:** 1000 VUs joining a room instantly.

This estimation assumes your underlying infrastructure (VPS/Cloud) has adequate CPU/RAM to support the Node.js process limits.
