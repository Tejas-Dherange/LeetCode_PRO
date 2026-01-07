# CRITICAL FIX: entrypoint.sh Syntax Error

## 🔴 Issue Found

**Error:** `./entrypoint.sh: line 9: syntax error: unexpected redirection`

**Root Cause:** The script used `<<<` (here-string), which is a **bash** feature, but Alpine Linux uses `#!/bin/sh` (ash) which doesn't support it.

---

## ✅ Fixed Script

I've corrected two issues:

1. **Replaced `<<<` with `echo |`** (POSIX-compatible)
2. **Fixed `npx prisma db deploy` → `npx prisma migrate deploy`** (correct command)

---

## 🚀 Deploy the Fix

**1. Commit the fixed entrypoint.sh:**

```bash
git add backend/entrypoint.sh
git commit -m "fix: POSIX-compatible entrypoint.sh for Alpine Linux"
git push origin main
```

**2. Or manually update on server:**

```bash
# SSH into server
ssh -i ~/.ssh/codeloom_deploy root@143.244.134.116

# Navigate to backend
cd ~/LeetCode_PRO/backend

# Pull latest changes
git pull origin main

# Rebuild containers
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build

# Monitor logs
docker-compose -f docker-compose.prod.yml logs -f backend
```

---

## 🔍 What Changed

### Before (BROKEN):
```bash
until npx prisma db execute --stdin <<< "SELECT 1" > /dev/null 2>&1 || [ $ELAPSED -ge $TIMEOUT ]; do
                                      ^^^
                                   bash-only syntax
```

### After (FIXED):
```bash
until echo "SELECT 1" | npx prisma db execute --stdin > /dev/null 2>&1 || [ $ELAPSED -ge $TIMEOUT ]; do
      ^^^^^^^^^^^^^^
         POSIX-compatible
```

---

## ✅ Expected Output After Fix

```
🔗 Checking database connection...
✅ Database is ready
🔄 Running database migrations...
✅ Migrations completed successfully
🚀 Starting application...
Server listening on port 3000
```

---

## 🎯 Why This Happened

Alpine Linux (used in our Docker image) uses `ash` (Alpine Shell) as `/bin/sh`, not `bash`. The `<<<` operator is bash-specific and caused a syntax error.

**Solution:** Always use POSIX sh syntax when writing `#!/bin/sh` scripts, or change to `#!/bin/bash` if bash-specific features are needed.
