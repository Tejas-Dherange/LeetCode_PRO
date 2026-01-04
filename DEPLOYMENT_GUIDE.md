# Deployment & Scaling Guide

This guide provides recommended infrastructure configurations based on your expected concurrent user base.

**Core Stack:**
*   **Web Server:** Node.js (Express + Socket.io)
*   **Database:** PostgreSQL (Prisma)
*   **Real-time:** Redis (Pub/Sub)
*   **Code Execution:** Judge0 (Docker)

---

## 🏗️ Required Services

1.  **Backend Host (VPS/PaaS)**
    *   *Providers:* DigitalOcean (Droplet), AWS (EC2), Railway, Render.
    *   *Usage:* Hosts the API, WebSocket Server, and Execution Worker.
2.  **Database Hosting**
    *   *Providers:* Neon, Supabase, AWS RDS, DigitalOcean Managed Database.
    *   *Usage:* Persistent data storage. **Connection pooling is critical.**
3.  **Redis Hosting**
    *   *Providers:* Upstash, AWS ElastiCache, DigitalOcean Managed Redis.
    *   *Usage:* Socket.io adapter and BullMQ job queue.
4.  **Frontend Hosting**
    *   *Providers:* Vercel, Netlify, AWS Amplify.
    *   *Usage:* Serves React static files.

---

## 📏 Configuration by Scale

### Tier 1: Small Contest / Class (200 - 500 Users)
*Suitable for internal hackathons or university classes.*

| Component | Configuration | Recommended Specs | Cost Est. |
| :--- | :--- | :--- | :--- |
| **Backend** | Single Instance | **2 vCPU / 4 GB RAM** | ~$20/mo |
| **Worker** | Same instance as API | `WORKER_CONCURRENCY=10` | - |
| **Database** | Managed Shared | **50 Connections** Max | Free/Low |
| **Redis** | Managed Serverless | Free Tier (Upstash) | Free |
| **Judge0** | Self-hosted (Docker) | Installed on Backend Server | - |

**Environment Tweak:**
```bash
WORKER_CONCURRENCY=10
DATABASE_URL="...&connection_limit=40"
```

---

### Tier 2: Medium Contest (500 - 1,500 Users)
*Suitable for regional contests or multiple simultaneous events.*

| Component | Configuration | Recommended Specs | Cost Est. |
| :--- | :--- | :--- | :--- |
| **Backend** | Single Powerful Node | **4 vCPU / 8 GB RAM** | ~$40/mo |
| **Worker** | **Separate Instance** | **4 vCPU / 8 GB RAM** | ~$40/mo |
| **Database** | Managed Dedicated | **0.5 vCPU / 2GB RAM** (Neon Compute) | ~$30/mo |
| **Redis** | Managed | Basic Paid Plan | ~$10/mo |
| **Judge0** | Dedicated Node | **4 vCPU** (Optimized Compute) | ~$40/mo |

**Key Change:** Move the worker to a separate server so compiling code doesn't slow down the website.
**Environment Tweak:**
```bash
# On Worker Server
WORKER_CONCURRENCY=30

# On API Server
DATABASE_URL="...&connection_limit=80"
```

---

### Tier 3: Large Scale (1,500 - 5,000+ Users)
*Suitable for large open contests.*

| Component | Configuration | Recommended Specs | Cost Est. |
| :--- | :--- | :--- | :--- |
| **Backend** | **Cluster Mode / LB** | **2-3 Nodes** (2 vCPU each) + Load Balancer | ~$80/mo |
| **Worker** | **Worker Fleet** | **2-3 Nodes** (4 vCPU each) | ~$120/mo |
| **Database** | Dedicated + **Pooler** | **2 vCPU / 8 GB RAM** + PgBouncer | ~$100/mo |
| **Redis** | Dedicated Cluster | High Availability | ~$50/mo |
| **Judge0** | Auto-scaling Group | **4+ Nodes** | ~$150/mo |

**Key Change:** Horizontal scaling. Use Nginx or AWS ALB to distribute traffic. Use PgBouncer for DB pooling (thousands of connections).

---

## 🚀 Scaling Checklist

1.  **Separate the Worker:** As soon as you hit >500 users, run the `codeExecutionWorker.js` on a different server than `index.js`.
    *   *Why?* Compiling code (GCC/Python) uses 100% CPU. If it's on the main server, the website will freeze.
    
2.  **Connection Pooling:** Ensure your Database URL includes `pgbouncer=true` (if using Neon/Supabase) or sets a reasonable `connection_limit`.

3.  **Redis Latency:** Keep your Backend and Redis in the **same region** (e.g., both in AWS us-east-1). High Redis latency kills real-time performance.

4.  **Judge0 Limits:** If hosting Judge0 yourself, ensure `MAX_QUEUE_SIZE` is set high enough, or requests will be dropped.
