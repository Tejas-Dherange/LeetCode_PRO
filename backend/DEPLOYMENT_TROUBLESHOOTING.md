# Deployment Failure Troubleshooting Guide

## 🚨 Issue: Backend Container Unhealthy

**Status:** Deployment failed due to backend health check failure  
**Automatic Rollback:** Should have been triggered

---

## 📋 What the Logs Show

```
Container algopattern-backend Started
Container algopattern-backend Error
dependency failed to start: container algopattern-backend is unhealthy
```

**Translation:**
1. ✅ Backend container started
2. ❌ Failed health check (couldn't respond to `/health` endpoint)
3. ❌ Marked as unhealthy
4. ❌ Worker couldn't start (depends on healthy backend)

---

## 🔍 Diagnostic Commands

### Step 1: Check Container Status

```bash
ssh -i YOUR_KEY root@YOUR_IP
cd ~/LeetCode_PRO/backend

# See all containers and their health status
docker-compose -f docker-compose.prod.yml ps

# Expected output problems:
# - backend: "unhealthy" or "exited"
# - worker: "unhealthy" or "not started"
```

### Step 2: Check Backend Logs

```bash
# View last 100 lines of backend logs
docker-compose -f docker-compose.prod.yml logs backend --tail=100

# Look for specific errors
docker-compose -f docker-compose.prod.yml logs backend | grep -E "error|Error|ERROR|fail|Fail|FAIL|refused|timeout"

# Check entrypoint script output
docker-compose -f docker-compose.prod.yml logs backend | grep -E "🔗|🔄|🚀|❌|✅"
```

### Step 3: Check If Containers Are Even Running

```bash
# List all Docker containers
docker ps -a | grep algopattern

# If backend is "Exited", check exit code
docker inspect algopattern-backend | grep -A 5 "State"
```

---

## 🐛 Common Issues & Solutions

### Issue #1: Database Connection Failure ⭐ MOST LIKELY

**Symptoms:**
```
❌ Database connection timeout!
Error: P1001: Can't reach database server
ECONNREFUSED
```

**Causes:**
- `DATABASE_URL` not set in `.env`
- Database server not running
- Database not accessible from Docker network
- Firewall blocking connection

**Solution:**

```bash
# Check if .env exists and has DATABASE_URL
cat .env | grep DATABASE_URL

# Test database connection manually
docker-compose -f docker-compose.prod.yml exec backend npx prisma db execute --stdin <<< "SELECT 1"

# If using external database, check if host is reachable
docker-compose -f docker-compose.prod.yml exec backend ping -c 3 YOUR_DATABASE_HOST
```

**Fix:**
```bash
# Add DATABASE_URL to .env if missing
echo 'DATABASE_URL="postgresql://user:password@host:5432/dbname"' >> .env

# Restart containers
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d
```

---

### Issue #2: Migration Failure

**Symptoms:**
```
❌ Migration failed!
Error: P3009: Failed to migrate
Schema is invalid
```

**Causes:**
- Database doesn't exist
- User lacks permissions
- Migration syntax error
- Incompatible Prisma version

**Solution:**

```bash
# Check migration status
docker-compose -f docker-compose.prod.yml exec backend npx prisma migrate status

# Create database if it doesn't exist
# (Connect to your PostgreSQL server and run)
CREATE DATABASE your_database_name;

# Grant permissions
GRANT ALL PRIVILEGES ON DATABASE your_database_name TO your_user;
```

---

### Issue #3: Missing Environment Variables

**Symptoms:**
```
Error: Missing environment variable: JWT_SECRET
Error: process.env.REDIS_HOST is undefined
```

**Causes:**
- `.env` file missing
- Required variables not set
- `.env` file permissions

**Solution:**

```bash
# Check if .env exists
ls -la .env

# Check all required variables are set
cat .env

# Required variables:
# - DATABASE_URL
# - JWT_SECRET
# - REDIS_HOST (or REDIS_URL)
# - NODE_ENV=production
# - PORT=3000

# Fix permissions
chmod 644 .env
```

---

### Issue #4: Port Already in Use

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Causes:**
- Another process using port 3000
- Old container still running

**Solution:**

```bash
# Check what's using port 3000
sudo lsof -i :3000

# Or
sudo netstat -tlnp | grep 3000

# Stop all containers
docker-compose -f docker-compose.prod.yml down

# Kill process if needed
sudo kill -9 PROCESS_ID

# Restart
docker-compose -f docker-compose.prod.yml up -d
```

---

### Issue #5: Health Check Timing Out

**Symptoms:**
```
Health check failed
Container marked unhealthy after 40 seconds
```

**Causes:**
- App takes too long to start
- Database migrations taking too long
- Heavy dependencies loading slowly

**Solution:**

Update `docker-compose.prod.yml`:
```yaml
healthcheck:
  test: [ "CMD", "node", "-e", "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" ]
  interval: 30s
  timeout: 3s
  retries: 5  # Increase from 3
  start_period: 60s  # Increase from 40s
```

---

### Issue #6: entrypoint.sh Not Executable

**Symptoms:**
```
exec /app/entrypoint.sh: permission denied
```

**Causes:**
- Git didn't preserve execute permissions
- File was created on Windows

**Solution:**

```bash
# On server
cd ~/LeetCode_PRO/backend
chmod +x entrypoint.sh

# Rebuild
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build
```

---

## 🔧 Step-by-Step Debugging

### 1. Get Container Logs
```bash
docker-compose -f docker-compose.prod.yml logs backend --tail=200 > backend-logs.txt
cat backend-logs.txt
```

### 2. Check If App Started
```bash
# Look for "🚀 Starting application..."
docker-compose -f docker-compose.prod.yml logs backend | grep "🚀"

# If you see this, app tried to start
# If not, check earlier logs for database/migration issues
```

### 3. Manual Health Check
```bash
# From inside container
docker-compose -f docker-compose.prod.yml exec backend curl http://localhost:3000/health

# From host
curl http://localhost:3000/health

# Expected: status 200, response {"status":"ok"} or similar
```

### 4. Test Database Connection
```bash
docker-compose -f docker-compose.prod.yml exec backend npx prisma db execute --stdin <<< "SELECT 1"

# Should return: No error
# If error, database connection is the issue
```

### 5. Check Environment
```bash
docker-compose -f docker-compose.prod.yml exec backend env | grep -E "DATABASE_URL|NODE_ENV|PORT"

# Verify all are set correctly
```

---

## 📊 Diagnostic Decision Tree

```
Container unhealthy?
│
├─ App not starting at all?
│  ├─ Check entrypoint.sh logs (🔗 🔄 messages)
│  │  ├─ "Database connection timeout" → Fix DATABASE_URL
│  │  └─ "Migration failed" → Check database permissions
│  └─ No logs at all?
│     └─ Container permission issue → chmod +x entrypoint.sh
│
├─ App starts but health check fails?
│  ├─ Health endpoint returns error?
│  │  ├─ 500 error → App startup error, check logs
│  │  └─ Connection refused → App not listening on port
│  └─ Health check times out?
│     └─ Increase start_period in docker-compose
│
└─ App running but marked unhealthy?
   └─ Health check config issue → Check docker-compose healthcheck
```

---

## 🚀 Quick Fixes to Try

### Fix #1: Complete Restart
```bash
cd ~/LeetCode_PRO/backend
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build
docker-compose -f docker-compose.prod.yml logs -f backend
```

### Fix #2: Check .env
```bash
# Ensure .env is complete
cat .env

# Should have at minimum:
# DATABASE_URL=postgresql://...
# JWT_SECRET=your-secret
# NODE_ENV=production
# PORT=3000
```

### Fix #3: Manual Migration
```bash
# If migrations failing, try manually
docker-compose -f docker-compose.prod.yml run --rm backend npx prisma migrate deploy
```

---

## 📝 Information to Share

When asking for help, provide:

1. **Container status:**
   ```bash
   docker-compose -f docker-compose.prod.yml ps
   ```

2. **Backend logs:**
   ```bash
   docker-compose -f docker-compose.prod.yml logs backend --tail=100
   ```

3. **Environment check (sanitized):**
   ```bash
   docker-compose -f docker-compose.prod.yml exec backend env | grep -v "SECRET\|PASSWORD\|KEY"
   ```

4. **Health check result:**
   ```bash
   curl -v http://localhost:3000/health
   ```

---

## ✅ Expected Healthy State

When everything works:

```bash
$ docker-compose -f docker-compose.prod.yml ps

NAME                     STATUS                            PORTS
algopattern-backend      Up About a minute (healthy)       0.0.0.0:3000->3000/tcp
algopattern-worker       Up About a minute                 
algopattern-redis        Up About a minute (healthy)       0.0.0.0:6379->6379/tcp

$ docker-compose -f docker-compose.prod.yml logs backend | tail -20

🔗 Checking database connection...
✅ Database is ready
🔄 Running database migrations...
✅ Migrations completed successfully
🚀 Starting application...
Server listening on port 3000
Health endpoint ready at /health

$ curl http://localhost:3000/health
{"status":"ok","database":"connected"}
```

---

## 🎯 Next Steps

1. Run the diagnostic commands above
2. Identify which issue matches your logs
3. Apply the corresponding fix
4. Test manually before redeploying
5. Share logs if still stuck

The automatic rollback should have restored your previous working version, so your service should still be running! 🎉
