# Quick Setup Guide - Redis Rate Limiting & Queue System

## Prerequisites
- Node.js 18+
- Docker & Docker Compose (or local Redis installation)

## 5-Minute Setup

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Add Environment Variables

Add to your `.env` file:
```env
# Redis & Queue Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
QUEUE_CONCURRENCY=5
QUEUE_JOB_TIMEOUT=60000
```

### Step 3: Start Redis & Worker

**Option A: Using Docker (Recommended)**
```bash
docker-compose up -d
```

**Option B: Local Redis**
```bash
# Terminal 1: Start Redis
redis-server

# Terminal 2: Start Worker
node workers/codeExecutionWorker.js
```

### Step 4: Start Backend
```bash
npm run dev
```

### Step 5: Verify

Test Redis:
```bash
redis-cli ping
# Expected: PONG
```

Test Rate Limiting:
```bash
# Make 6 requests rapidly - last one should return 429
for i in {1..6}; do
  curl -X POST http://localhost:4000/api/v1/execute-code/run-code \
    -H "Authorization: Bearer YOUR_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"source_code":"console.log(1)", "language_id":63, "stdin":[""], "expected_outputs":["1"]}'
done
```

## What's Enabled

✅ **Rate Limiting:**
- 5 requests per minute per user
- 20 requests per hour per user
- 3 requests per 30 seconds per problem

✅ **Queue System:**
- Controlled concurrency (5 jobs max by default)
- Automatic retries (3 attempts)
- Job timeout (60 seconds)

✅ **Protected Endpoints:**
- `POST /api/v1/execute-code/run-code`
- `POST /api/v1/execute-code/submit-code`
- `POST /api/v1/contest/contest-submission/submit-code`

## Monitoring

View queue worker logs:
```bash
docker logs -f leetcode_queue_worker
```

Check Redis keys:
```bash
redis-cli KEYS "run:user:*"
```

## Troubleshooting

**Redis not connecting?**
```bash
docker ps | grep redis
docker-compose logs redis
```

**Worker not processing?**
```bash
docker logs leetcode_queue_worker
docker-compose restart queue-worker
```

**Rate limits too strict?**
Edit `backend/middleware/rateLimiter.middleware.js` and adjust limits.

## Next Steps

📖 Read full documentation: `REDIS_QUEUE_DOCUMENTATION.md`
🔧 Customize rate limits: `middleware/rateLimiter.middleware.js`
📊 Monitor metrics: See monitoring section in docs
