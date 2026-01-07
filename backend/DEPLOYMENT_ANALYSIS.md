# Backend Deployment Analysis & Issues

## 🔍 Executive Summary

After analyzing your backend deployment configuration, I've identified **several critical issues** that explain the `npx: command not found` error and other potential deployment problems.

## ❌ Critical Issues Found

### 1. **Docker Compose Configuration Mismatch** (🔴 CRITICAL)

**Problem:**
- `docker-compose.prod.yml` references **non-existent Docker images**:
  ```yaml
  image: ghcr.io/YOUR_GITHUB_USERNAME/algopattern-backend:latest
  ```
- These images are **never built or pushed** anywhere
- The GitHub workflow tries to use this file, causing failures

**Impact:** Deployment will fail because Docker cannot pull these images.

---

### 2. **Prisma Migrations Running Outside Docker** (🔴 CRITICAL)

**Current Workflow (Line 166):**
```bash
cd ~/LeetCode_PRO/backend
npm ci --production
npx prisma migrate deploy
docker-compose -f docker-compose.prod.yml up -d --build
```

**Problems:**
- Prisma migrations run on the **host** (Digital Ocean droplet), not inside Docker
- The production app runs **inside Docker** with its own database connection
- **Host and Docker use different DATABASE_URL values** (likely)
- Migrations applied on host may not affect the containerized database

**Why `npx` fails:**
- Node.js isn't properly installed/configured on the host
- Even if fixed, migrations won't apply to the Docker database

---

### 3. **Missing Dockerfile Build in Production** (🟡 HIGH)

`docker-compose.prod.yml` expects **pre-built images**, but:
- No CI/CD step builds and pushes images to GitHub Container Registry
- The `build` directive is missing in `docker-compose.prod.yml`
- This creates a chicken-and-egg problem

---

### 4. **Manual Script vs. Automated Workflow Inconsistency** (🟡 HIGH)

**Manual `deploy.sh`:**
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```
- ✅ Uses `--build` flag (rebuilds locally)
- ✅ Works because it builds from source

**GitHub Workflow:**
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```
- ❌ Same command, but relies on **pulling** images that don't exist
- ❌ Won't work in CI/CD without image registry setup

---

### 5. **No Database Migration Strategy in Docker** (🟠 MEDIUM)

Neither `docker-compose.yml` nor `docker-compose.prod.yml` handles database migrations properly:
- No init container or migration job
- Migrations should run **inside** the backend container on startup

---

## ✅ Recommended Solutions

### Solution 1: Use Local Build Strategy (Simplest)

Update `docker-compose.prod.yml` to build from source:

```yaml
version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: algopattern-backend
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env
    depends_on:
      - redis
    networks:
      - app-network
    volumes:
      - ./logs:/app/logs
    # Run migrations on container start
    command: sh -c "npx prisma migrate deploy && node src/index.js"
    healthcheck:
      test: [ "CMD", "node", "-e", "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" ]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 40s

  worker:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: algopattern-worker
    restart: unless-stopped
    command: node workers/codeExecutionWorker.js
    environment:
      - NODE_ENV=production
    env_file:
      - .env
    depends_on:
      - redis
      - backend
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    container_name: algopattern-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes --maxmemory 100mb --maxmemory-policy allkeys-lru
    volumes:
      - redis_data:/data
    networks:
      - app-network
    healthcheck:
      test: [ "CMD", "redis-cli", "ping" ]
      interval: 30s
      timeout: 3s
      retries: 3

networks:
  app-network:
    driver: bridge

volumes:
  redis_data:
    driver: local
```

**Key Changes:**
- ✅ Added `build` directives instead of referencing non-existent images
- ✅ Migrations run **inside** the backend container on startup
- ✅ Worker waits for backend to be ready
- ✅ Consistent with local deployment

---

### Solution 2: Update GitHub Workflow

Remove the problematic Prisma migration step:

```yaml
- name: Deploy to Digital Ocean
  uses: appleboy/ssh-action@v1.0.0
  with:
    host: ${{ secrets.DROPLET_IP }}
    username: ${{ secrets.DROPLET_USER }}
    key: ${{ secrets.SSH_PRIVATE_KEY }}
    port: 22
    script_stop: true
    script: |
      set -e
      
      echo "🚀 Starting automated deployment..."
      
      # Navigate to project
      cd ~/LeetCode_PRO/backend
      
      # Pull latest changes
      echo "📥 Pulling latest code..."
      git pull origin main
      
      # Build and restart containers (migrations run inside container)
      echo "🐳 Rebuilding Docker containers..."
      docker-compose -f docker-compose.prod.yml up -d --build
      
      # Clean up
      echo "🧹 Cleaning up old images..."
      docker image prune -f
      
      # Health check
      echo "🏥 Performing health check..."
      sleep 10
      
      HEALTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/health)
      
      if [ "$HEALTH_STATUS" = "200" ]; then
        echo "✅ Deployment successful! Backend is healthy."
        docker-compose -f docker-compose.prod.yml ps
      else
        echo "❌ Health check failed (HTTP $HEALTH_STATUS)"
        echo "🔄 Rolling back..."
        docker-compose -f docker-compose.prod.yml logs --tail=50
        exit 1
      fi
```

**Key Changes:**
- ❌ Removed NVM sourcing (not needed)
- ❌ Removed `npm ci --production` (not needed on host)
- ❌ Removed `npx prisma migrate deploy` (runs inside container now)
- ✅ Simplified to **only** Docker operations

---

### Solution 3: Update Dockerfile for Safer Migrations

Create a startup script to handle migrations gracefully:

**`entrypoint.sh`** (new file in backend):
```bash
#!/bin/sh
set -e

echo "🔄 Running database migrations..."
npx prisma migrate deploy

echo "🚀 Starting application..."
exec "$@"
```

**Updated Dockerfile (last line):**
```dockerfile
# Copy entrypoint
COPY --chown=nodejs:nodejs entrypoint.sh ./
RUN chmod +x entrypoint.sh

# Use entrypoint for migrations
ENTRYPOINT ["./entrypoint.sh"]
CMD ["node", "src/index.js"]
```

---

## 📋 Action Items (Priority Order)

### Immediate Actions (Fix Deployment Now)

1. **Update `docker-compose.prod.yml`** with Solution 1
2. **Update GitHub workflow** with Solution 2
3. **Test manual deployment:**
   ```bash
   cd ~/LeetCode_PRO/backend
   git pull origin main
   docker-compose -f docker-compose.prod.yml up -d --build
   docker-compose -f docker-compose.prod.yml ps
   docker-compose -f docker-compose.prod.yml logs backend
   ```

### Optional Improvements

4. **Add `entrypoint.sh`** for cleaner migration handling (Solution 3)
5. **Add environment variable validation** in startup script
6. **Implement rollback strategy** (keep previous images tagged)

---

## 🎯 Root Cause of Original Error

```
err: bash: line 19: npx: command not found
```

**Explanation:**
1. GitHub workflow SSHs into the droplet
2. Tries to run `npx prisma migrate deploy` **on the host**
3. Host doesn't have Node.js/npm in the SSH session's PATH
4. Even if it did, migrations would apply to the wrong database (host vs Docker)

**Why this is wrong:**
- Migrations should run **inside** the Docker container where the app runs
- The container has the correct `DATABASE_URL` pointing to the containerized or external PostgreSQL
- The host's environment is irrelevant to the containerized app

---

## 🔧 Verification Steps

After applying fixes, verify:

```bash
# 1. Check containers are running
docker-compose -f docker-compose.prod.yml ps

# 2. Check backend logs for migration success
docker-compose -f docker-compose.prod.yml logs backend | grep -i prisma

# 3. Verify database connection
docker-compose -f docker-compose.prod.yml exec backend npx prisma db pull

# 4. Test health endpoint
curl http://localhost:3000/health

# 5. Check Redis connection
docker-compose -f docker-compose.prod.yml logs backend | grep -i redis
```

---

## 📝 Additional Notes

### Why Docker Compose Dev vs. Prod?

- **`docker-compose.yml`**: For local development (commented out backend)
- **`docker-compose.prod.yml`**: For production deployment

**Current Issue:** Both exist but serve different purposes correctly. The problem is **prod** references non-existent images.

### Database Setup

Ensure your `.env` has correct `DATABASE_URL`:
- **Local dev:** Points to local PostgreSQL
- **Production:** Points to managed database (e.g., Digital Ocean Managed Database)

### Redis Configuration

Both compose files use Redis correctly. No issues here.

---

## Summary

| Issue | Severity | Fixed? |
|-------|----------|--------|
| Non-existent Docker images | 🔴 Critical | ✅ Solution provided |
| Migrations outside Docker | 🔴 Critical | ✅ Solution provided |
| npx command not found | 🟡 High | ✅ Explained + fixed |
| Manual vs. CI/CD mismatch | 🟡 High | ✅ Solution provided |
| No migration strategy | 🟠 Medium | ✅ Solution provided |

Apply the solutions above and your deployment will work correctly! 🚀
