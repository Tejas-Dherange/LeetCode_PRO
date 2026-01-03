# Redis Rate Limiting & Queue System - Complete Documentation

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Setup Instructions](#setup-instructions)
4. [Rate Limiting](#rate-limiting)
5. [Queue System](#queue-system)
6. [Monitoring](#monitoring)
7. [Troubleshooting](#troubleshooting)

---

## Overview

This implementation adds Redis-based rate limiting and BullMQ queue system to control code execution requests and prevent Judge0 API abuse.

### Key Features
- ✅ Three-tier rate limiting (per minute, per hour, per problem)
- ✅ Queue-based execution with concurrency controls
- ✅ Fail-closed security (blocks on Redis failure)
- ✅ Atomic Redis operations
- ✅ Retry logic with exponential backoff
- ✅ Docker-based deployment
- ✅ Comprehensive logging

### Protected Endpoints
1. `POST /api/v1/execute-code/run-code`
2. `POST /api/v1/execute-code/submit-code`
3. `POST /api/v1/contest/contest-submission/submit-code`

---

## Architecture

```
┌──────────┐
│  Client  │
└─────┬────┘
      │
      ▼
┌─────────────────────┐
│   Express Route     │
└─────┬───────────────┘
      │
      ▼
┌─────────────────────┐
│  Rate Limiter       │ ◄──── Redis (atomic INCR + EXPIRE)
│  Middleware         │
└─────┬───────────────┘
      │ (if passed)
      ▼
┌─────────────────────┐
│  Queue System       │ ◄──── Redis (BullMQ backend)
│  (add job)          │
└─────┬───────────────┘
      │
      ▼
┌─────────────────────┐
│  Queue Worker       │
│  (process job)      │
└─────┬───────────────┘
      │
      ▼
┌─────────────────────┐
│  Judge0 API         │
└─────────────────────┘
```

### Components

#### 1. Redis (`libs/redis.lib.js`)
- Singleton client with automatic reconnection
- Health checks
- Connection pooling

#### 2. Rate Limiter (`middleware/rateLimiter.middleware.js`)
- Atomic counter updates
- TTL management
- 429 responses with retry information

#### 3. Queue Library (`libs/queue.lib.js`)
- Job management
- Priority queuing (contest jobs = higher priority)
- Job metrics

#### 4. Queue Worker (`workers/codeExecutionWorker.js`)
- Processes jobs asynchronously
- Reuses existing Judge0 logic
- Saves results to database

---

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

**New packages:**
- `bullmq` - Queue system
- `ioredis` - Redis client

### 2. Configure Environment Variables

Add to your `.env` file:

```env
# Redis Configuration
REDIS_HOST=localhost        # or 'redis' in Docker
REDIS_PORT=6379
REDIS_PASSWORD=            # Optional

# Queue Configuration
QUEUE_CONCURRENCY=5
QUEUE_JOB_TIMEOUT=60000
```

### 3. Start Services

#### Option A: Local Development (Redis installed locally)

```bash
# Terminal 1: Start Redis
redis-server

# Terminal 2: Start Queue Worker
node workers/codeExecutionWorker.js

# Terminal 3: Start Backend API
npm run dev
```

#### Option B: Docker (Recommended)

```bash
# Start Redis and Queue Worker
docker-compose up -d

# Start Backend API (or add to docker-compose)
npm run dev
```

### 4. Verify Setup

Check Redis connection:
```bash
redis-cli ping
# Should return: PONG
```

Check worker logs:
```bash
docker logs -f leetcode_queue_worker
# Should show: [Worker] Worker is ready and waiting for jobs
```

---

## Rate Limiting

### Rate Limit Rules

| Limit Type | Max Requests | Time Window | Redis Key Pattern |
|------------|--------------|-------------|-------------------|
| User per minute | 5 | 60s | `run:user:{userId}:minute` |
| User per hour | 20 | 3600s | `run:user:{userId}:hour` |
| User per problem | 3 | 30s | `run:user:{userId}:problem:{problemId}` |

### How It Works

1. **Request arrives** → Middleware intercepts
2. **Check Redis health** → Fail closed if Redis is down
3. **Increment counters** → Atomic `INCR` operations
4. **Set TTL** → Only on first increment (`EXPIRE`)
5. **Compare limits** → Block if any limit exceeded
6. **Return 429** → With retry information if blocked
7. **Allow through** → If all limits passed

### Response Format

**Success (Rate Limit Passed):**
```json
{
  "success": true,
  "message": "Code executed successfully",
  "results": [...]
}
```

**Rate Limit Exceeded:**
```json
{
  "error": "Rate limit exceeded",
  "limit": "5 runs per minute",
  "current": 6,
  "retryAfter": 45,
  "resetAt": "2026-01-03T13:00:00Z"
}
```

### Testing Rate Limits

```bash
# Send 10 requests quickly
for i in {1..10}; do
  curl -X POST http://localhost:4000/api/v1/execute-code/run-code \
    -H "Authorization: Bearer YOUR_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"source_code":"...", "language_id":62, "stdin":["1"], "expected_outputs":["1"]}'
  echo "Request $i done"
done
```

Expected: First 5 succeed, remaining get 429 responses.

---

## Queue System

### Queue Workflow

1. **Job Creation** → Controller adds job to queue
2. **Job Storage** → Redis stores job data
3. **Worker Pulls** → Worker fetches job when available
4. **Execute Code** → Worker calls Judge0
5. **Save Results** → Worker saves to database
6. **Return to Client** → Job completion triggers response

### Job Types

| Type | Description | Priority | Database Save |
|------|-------------|----------|---------------|
| `run` | Quick code test | 10 (low) | No |
| `submit` | Problem submission | 10 (low) | Yes |
| `contest` | Contest submission | 1 (high) | Yes |

### Job Payload Example

```javascript
{
  jobType: 'submit',
  userId: 'user123',
  problemId: 'problem456',
  contestId: null,
  source_code: 'public class Solution { ... }',
  language_id: 62,
  stdin: ['1', '2'],
  expected_outputs: ['1', '2']
}
```

### Concurrency Control

Controlled by `QUEUE_CONCURRENCY` environment variable (default: 5).

```env
QUEUE_CONCURRENCY=5  # Max 5 jobs running simultaneously
```

### Retry Logic

- **Max attempts:** 3
- **Backoff:** Exponential (2s,  4s, 8s)
- **Timeout:** 60 seconds per job

---

## Monitoring

### Queue Metrics

**Check queue status:**
```javascript
// In your code
import { getQueueMetrics } from './libs/queue.lib.js';

const metrics = await getQueueMetrics();
console.log(metrics);
// {
//   waiting: 5,
//   active: 2,
//   completed: 150,
//   failed: 3,
//   delayed: 0
// }
```

### Redis Monitoring

**Check key count:**
```bash
redis-cli DBSIZE
```

**List rate limit keys:**
```bash
redis-cli KEYS "run:user:*"
```

**Check specific user's limits:**
```bash
redis-cli GET "run:user:user123:minute"
redis-cli TTL "run:user:user123:minute"
```

### Worker Logs

**Monitor worker activity:**
```bash
# Docker
docker logs -f leetcode_queue_worker

# Local
# Check terminal running worker
```

**Log format:**
```
[Worker] Processing job run-user123-1704280000000 (type: run, user: user123)
[Worker] Job run-user123-1704280000000 completed successfully
```

### Rate Limit Violation Logs

**Format:**
```json
{
  "event": "RATE_LIMIT_EXCEEDED",
  "userId": "user123",
  "problemId": "problem456",
  "limitType": "user_per_minute",
  "current": 6,
  "resetAt": "2026-01-03T13:00:00Z",
  "timestamp": "2026-01-03T12:59:15Z"
}
```

---

## Troubleshooting

### Issue: Redis Connection Failed

**Symptoms:**
- 503 errors on all execution requests
- Logs show: `[Redis] Redis connection error`

**Solutions:**
```bash
# Check if Redis is running
docker ps | grep redis
# or
redis-cli ping

# Restart Redis (Docker)
docker-compose restart redis

# Check connection settings
echo $REDIS_HOST
echo $REDIS_PORT
```

### Issue: Queue Worker Not Processing Jobs

**Symptoms:**
- Requests accepted but never complete
- Queue fills up (`waiting` count increases)

**Solutions:**
```bash
# Check if worker is running
docker ps | grep queue_worker

# Restart worker
docker-compose restart queue-worker

# Check worker logs
docker logs leetcode_queue_worker

# Manually start worker (local)
node workers/codeExecutionWorker.js
```

### Issue: Jobs Timing Out

**Symptoms:**
- Jobs fail after 60 seconds
- Logs show: `Job timeout`

**Solutions:**
```env
# Increase timeout in .env
QUEUE_JOB_TIMEOUT=120000  # 2 minutes

# Restart worker to apply changes
docker-compose restart queue-worker
```

### Issue: Too Many Rate Limit Blocks

**Symptoms:**
- Legitimate users getting 429 errors
- Rate limits too restrictive

**Solutions:**
```javascript
// Edit middleware/rateLimiter.middleware.js
const RATE_LIMITS = {
  USER_PER_MINUTE: {
    limit: 10,  // Increase from 5
    window: 60,
  },
  // ...
};
```

### Issue: Redis Memory Full

**Symptoms:**
- Redis errors: `OOM command not allowed`
- Requests fail intermittently

**Solutions:**
```bash
# Check Redis memory
redis-cli INFO memory

# Clear old keys
redis-cli FLUSHDB

# Increase maxmemory in docker-compose.yml
command: redis-server --maxmemory 512mb --maxmemory-policy allkeys-lru
```

### Debugging Tips

1. **Enable verbose logging:**
```javascript
// Add to redis.lib.js
redisClient.on('connect', () => {
  console.log('[Redis] Connected - Connection details:', redisClient.options);
});
```

2. **Test rate limiter manually:**
```bash
# Check current count
redis-cli GET "run:user:YOUR_USER_ID:minute"

# Reset limit for testing
redis-cli DEL "run:user:YOUR_USER_ID:minute"
```

3. **Monitor job failures:**
```javascript
// Add to queue worker
worker.on('failed', (job, err) => {
  console.error('[Worker] Job failed:', {
    jobId: job.id,
    error: err.message,
    stack: err.stack,
    data: job.data
  });
});
```

---

## Production Deployment Checklist

- [ ] Set `REDIS_PASSWORD` in production
- [ ] Configure Redis persistence (RDB or AOF)
- [ ] Set up Redis monitoring (RedisInsight, Datadog, etc.)
- [ ] Configure queue worker auto-restart  (systemd, PM2, Kubernetes)
- [ ] Set appropriate `QUEUE_CONCURRENCY` based on server capacity
- [ ] Enable Redis authentication
- [ ] Set up log aggregation (ELK, Splunk, CloudWatch)
- [ ] Configure alerts for queue depth, Redis memory, worker crashes
- [ ] Test failover scenarios
- [ ] Document runbooks for common issues

---

## Future Enhancements

### Tier-Based Rate Limits
```javascript
// Example: Different limits for paid users
const limits = user.isPremium 
  ? { limit: 20, window: 60 }  // Premium
  : { limit: 5, window: 60 };   // Free
```

### Dashboard
- Real-time queue metrics
- Rate limit analytics
- User usage graphs

### Advanced Monitoring
- Prometheus metrics export
- Grafana dashboards
- Alert integration (PagerDuty, Slack)

---

## Support

For issues or questions:
1. Check logs (Redis, Worker, API)
2. Review this documentation
3. Test with `redis-cli` and `curl`
4. Check environment variables

**Common Commands:**
```bash
# Restart all services
docker-compose restart

# View all logs
docker-compose logs -f

# Check Redis CLI
redis-cli ping

# Monitor Redis in real-time
redis-cli MONITOR
```
