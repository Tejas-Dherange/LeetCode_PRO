# CI/CD Implementation Guide - Step by Step

> **Complete guide to implement automated deployments for CodeLoom**

---

## 📋 Prerequisites Checklist

Before starting, ensure you have:
- ✅ Digital Ocean droplet running Ubuntu 20.04+
- ✅ GitHub repository for LeetCode_PRO
- ✅ Project cloned on droplet at `~/LeetCode_PRO`
- ✅ Docker and Docker Compose installed on droplet
- ✅ GitHub account with admin access to repository

---

## 🚀 Step 1: Setup Digital Ocean Droplet

### 1.1 Connect to Your Droplet

```bash
# From your local machine
ssh root@your-droplet-ip
```

### 1.2 Install Required Software

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installations
docker --version
docker-compose --version
node --version
npm --version
```

### 1.3 Clone Repository

```bash
# Navigate to home directory
cd ~

# Clone your repository (if not already done)
git clone https://github.com/Tejas-Dherange/LeetCode_PRO.git
cd LeetCode_PRO

# Verify you're on main branch
git branch
```

---

## 🔐 Step 2: Setup SSH Authentication (Fix Git Credentials Issue)

### 2.1 Generate SSH Key on Droplet

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "deploy@codeloom" -f ~/.ssh/id_ed25519 -N ""

# Display public key (you'll need this)
cat ~/.ssh/id_ed25519.pub
```

**Copy the entire output** (should start with `ssh-ed25519 AAAA...`)

### 2.2 Add SSH Key to GitHub

1. Go to: https://github.com/settings/keys
2. Click **"New SSH key"**
3. **Title:** `Digital Ocean Droplet - CodeLoom`
4. **Key type:** Authentication Key
5. **Paste** the copied public key
6. Click **"Add SSH key"**

### 2.3 Configure Git to Use SSH

```bash
cd ~/LeetCode_PRO

# Check current remote URL
git remote -v

# Change to SSH (replace with your username)
git remote set-url origin git@github.com:Tejas-Dherange/LeetCode_PRO.git

# Verify the change
git remote -v
# Should show: git@github.com:Tejas-Dherange/...

# Test SSH connection
ssh -T git@github.com
# You should see: "Hi Tejas-Dherange! You've successfully authenticated..."

# Test git pull (should work without password!)
git pull origin main
```

✅ **Success!** Git will no longer ask for username/password.

---

## ⚙️ Step 3: Setup Environment Variables on Droplet

### 3.1 Create Production .env File

```bash
cd ~/LeetCode_PRO/backend

# Create .env file
nano .env
```

### 3.2 Add Environment Variables

Paste the following (replace with your actual values):

```env
# Server
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://your-frontend.vercel.app

# Database
DATABASE_URL=postgresql://user:password@host:5432/database?connection_limit=50

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_URL=redis://redis:6379

# Authentication
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=7d

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=https://api.codeloom.com/api/v1/auth/google/callback

# Judge0
JUDGE0_BATCH_SUBMISSION_ENDPOINT=https://your-judge0-url/submissions/batch
JUDGE0_SULU_API_KEY=your-judge0-api-key

# Payments
RAZORPAY_KEY_ID=rzp_live_xxx
RAZORPAY_KEY_SECRET=your-razorpay-secret
RAZORPAY_WEBHOOK_SECRET=your-webhook-secret

# File Upload
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# AI
GEMINI_API_KEY=your-gemini-api-key

# Queue Worker
WORKER_CONCURRENCY=10
QUEUE_JOB_TIMEOUT=60000
```

**Save:** Press `Ctrl+X`, then `Y`, then `Enter`

### 3.3 Secure the .env File

```bash
# Set proper permissions (only owner can read/write)
chmod 600 .env

# Verify it's secure
ls -la .env
# Should show: -rw------- (no group/others access)
```

---

## 🗄️ Step 4: Setup Database

### 4.1 Install Prisma CLI

```bash
cd ~/LeetCode_PRO/backend
npm install
```

### 4.2 Run Database Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Verify tables created
npx prisma db execute --stdin <<EOF
SELECT tablename FROM pg_tables WHERE schemaname='public';
EOF
```

### 4.3 Seed Database (Optional)

```bash
# Seed patterns and initial data
node seed-patterns.js
```

---

## 🐳 Step 5: Test Docker Setup Locally

### 5.1 Update docker-compose.prod.yml

```bash
cd ~/LeetCode_PRO/backend
nano docker-compose.prod.yml
```

Ensure it looks like this:

```yaml
version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: codeloom-backend
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
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"]
      interval: 30s
      timeout: 3s
      retries: 3

  worker:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: codeloom-worker
    restart: unless-stopped
    command: node workers/codeExecutionWorker.js
    environment:
      - NODE_ENV=production
    env_file:
      - .env
    depends_on:
      - redis
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    container_name: codeloom-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes --maxmemory 256mb --maxmemory-policy allkeys-lru
    volumes:
      - redis_data:/data
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  redis_data:
    driver: local
```

Save the file.

### 5.2 Test Docker Build

```bash
# Build and start containers
docker-compose -f docker-compose.prod.yml up -d --build

# Check container status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Test health endpoint
curl http://localhost:3000/health

# Should return: {"status":"ok"}
```

✅ **If successful, proceed to next step!**

---

## 🔑 Step 6: Setup GitHub Secrets

### 6.1 Generate SSH Key for GitHub Actions

On your **local machine** (not droplet):

```bash
# This is the SAME key from the droplet
# Get the private key
ssh root@your-droplet-ip "cat ~/.ssh/id_ed25519"

# Copy the entire output including:
# -----BEGIN OPENSSH PRIVATE KEY-----
# ... (multiple lines)
# -----END OPENSSH PRIVATE KEY-----
```

### 6.2 Add Secrets to GitHub

1. Go to: https://github.com/Tejas-Dherange/LeetCode_PRO/settings/secrets/actions

2. Click **"New repository secret"** for each:

#### Deployment Secrets

| Secret Name | Value | Example |
|-------------|-------|---------|
| `DROPLET_IP` | Your droplet IP | `164.52.123.45` |
| `DROPLET_USER` | SSH username | `root` |
| `SSH_PRIVATE_KEY` | Full private key | `-----BEGIN OPENSSH...` |
| `APP_URL` | Backend URL | `https://api.codeloom.com` |

#### Database Secret

| Secret Name | Value |
|-------------|-------|
| `DATABASE_URL` | PostgreSQL connection string |

#### Frontend Secrets (for CI builds)

| Secret Name | Value |
|-------------|-------|
| `VITE_API_URL` | `https://api.codeloom.com` |
| `VITE_SOCKET_URL` | `https://api.codeloom.com` |
| `VITE_GOOGLE_CLIENT_ID` | Your Google Client ID |

**Total: 7 secrets**

### 6.3 Verify Secrets

```bash
# Using GitHub CLI
gh secret list

# Should show all 7 secrets
```

---

## 🌍 Step 7: Setup GitHub Environments (Optional but Recommended)

### 7.1 Create Production Environment

1. Go to: https://github.com/Tejas-Dherange/LeetCode_PRO/settings/environments
2. Click **"New environment"**
3. Name: `production`
4. Click **"Configure environment"**

### 7.2 Add Protection Rules

**For Production:**
- ✅ Check **"Required reviewers"** - Add yourself
- ✅ Check **"Deployment branches"** - Select "Selected branches" → Add `main`

Click **"Save protection rules"**

### 7.3 Optional: Create Staging Environment

Repeat above steps with name `staging` and branch `develop`

---

## ✅ Step 8: Test GitHub Actions Workflows

### 8.1 Push Code to Trigger Workflow

```bash
# On your local machine
cd /path/to/LeetCode_PRO

# Make a small change
echo "# CI/CD Enabled" >> README.md

# Commit and push
git add .
git commit -m "test: trigger CI/CD workflow"
git push origin main
```

### 8.2 Monitor Workflow Execution

**Option 1: GitHub Web UI**
1. Go to: https://github.com/Tejas-Dherange/LeetCode_PRO/actions
2. Click on the running workflow
3. Watch real-time logs

**Option 2: GitHub CLI**
```bash
# List recent runs
gh run list

# Watch live
gh run watch
```

### 8.3 Verify Deployment

```bash
# SSH to droplet
ssh root@your-droplet-ip

# Check containers
cd ~/LeetCode_PRO/backend
docker-compose -f docker-compose.prod.yml ps

# Test health endpoint
curl http://localhost:3000/health

# View logs
docker-compose -f docker-compose.prod.yml logs backend
```

---

## 🎯 Step 9: Configure Vercel for Frontend

### 9.1 Connect Repository to Vercel

1. Go to: https://vercel.com/new
2. Import `LeetCode_PRO` repository
3. **Root Directory:** `frontend`
4. **Framework Preset:** Vite
5. **Build Command:** `npm run build`
6. **Output Directory:** `dist`

### 9.2 Add Environment Variables in Vercel

Go to: **Project Settings > Environment Variables**

Add these:

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://api.codeloom.com` |
| `VITE_SOCKET_URL` | `https://api.codeloom.com` |
| `VITE_GOOGLE_CLIENT_ID` | Your Google Client ID |
| `VITE_RAZORPAY_KEY_ID` | Your Razorpay Key |

### 9.3 Deploy

Click **"Deploy"** - Vercel will auto-deploy on every push to `main`!

---

## 🔄 Step 10: Manual Deployment Test

### 10.1 Trigger Manual Deployment

**Using GitHub CLI:**
```bash
gh workflow run "Deploy Backend" -f environment=production
```

**Using GitHub Web UI:**
1. Go to: https://github.com/Tejas-Dherange/LeetCode_PRO/actions
2. Click **"Deploy Backend"**
3. Click **"Run workflow"**
4. Select branch: `main`
5. Select environment: `production`
6. Click **"Run workflow"**

### 10.2 Monitor Deployment

```bash
# Watch logs
gh run watch

# Or view in browser
# GitHub > Actions > Click on the workflow run
```

### 10.3 Verify Successful Deployment

You should see:
- ✅ Green checkmarks for all steps
- ✅ "Deployment successful! Backend is healthy."
- ✅ Container status showing all running

---

## 📊 Step 11: Setup Monitoring (Optional)

### 11.1 Check Deployment Logs

```bash
# SSH to droplet
ssh root@your-droplet-ip

# View container logs
cd ~/LeetCode_PRO/backend
docker-compose -f docker-compose.prod.yml logs -f

# Check specific service
docker-compose -f docker-compose.prod.yml logs backend
docker-compose -f docker-compose.prod.yml logs worker
docker-compose -f docker-compose.prod.yml logs redis
```

### 11.2 Monitor Container Health

```bash
# Check container stats
docker stats

# Check health status
docker-compose -f docker-compose.prod.yml ps
```

---

## 🎉 Success Checklist

Verify everything is working:

- [ ] SSH to droplet works without password
- [ ] Git pull works without credentials
- [ ] Docker containers are running
- [ ] Health endpoint returns 200 OK
- [ ] GitHub Actions workflows run successfully
- [ ] Manual deployment works
- [ ] Automatic deployment on push works
- [ ] Frontend auto-deploys on Vercel
- [ ] Database migrations run successfully
- [ ] Environment variables are secure

---

## 🚨 Common Issues & Solutions

### Issue 1: SSH Connection Failed
```bash
# Test SSH connection
ssh -v root@your-droplet-ip

# Verify key permissions
chmod 600 ~/.ssh/id_ed25519

# Test with explicit key
ssh -i ~/.ssh/id_ed25519 root@your-droplet-ip
```

### Issue 2: Health Check Failed
```bash
# Check if backend is running
docker ps

# View backend logs
docker logs codeloom-backend

# Test health endpoint directly
curl -v http://localhost:3000/health

# Check if port is open
netstat -tuln | grep 3000
```

### Issue 3: Database Connection Failed
```bash
# Test database connection
docker exec -it codeloom-backend npx prisma db execute --stdin <<< "SELECT 1"

# Check DATABASE_URL
cat ~/LeetCode_PRO/backend/.env | grep DATABASE_URL

# Test PostgreSQL connectivity
psql $DATABASE_URL -c "SELECT 1"
```

### Issue 4: Git Still Asks for Password
```bash
# Verify remote is SSH
git remote -v
# Should show: git@github.com:...

# If not, fix it:
git remote set-url origin git@github.com:Tejas-Dherange/LeetCode_PRO.git

# Test SSH
ssh -T git@github.com
```

### Issue 5: Docker Build Fails
```bash
# Clear Docker cache
docker system prune -a

# Rebuild from scratch
docker-compose -f docker-compose.prod.yml build --no-cache

# Check Dockerfile syntax
docker build -t test-build -f Dockerfile .
```

---

## 📚 Next Steps

After successful setup:

1. **Enable Branch Protection**
   - Settings > Branches > Add rule for `main`
   - Require PR reviews
   - Require status checks to pass

2. **Setup Staging Environment**
   - Create `staging` branch
   - Deploy to separate droplet
   - Test changes before production

3. **Add Monitoring**
   - Setup PM2 or similar for process management
   - Configure log aggregation
   - Add uptime monitoring (UptimeRobot, etc.)

4. **Backup Strategy**
   - Automated database backups
   - Docker volume backups
   - .env file backups (encrypted)

5. **Documentation**
   - Document deployment process
   - Create runbooks for common issues
   - Maintain changelog

---

## 💡 Pro Tips

1. **Never commit secrets** - Always use GitHub Secrets or environment variables
2. **Test in staging first** - Don't deploy directly to production
3. **Monitor deployments** - Watch logs during deployment
4. **Keep .env backed up** - Store encrypted backup in secure location
5. **Rotate secrets regularly** - Change JWT_SECRET, API keys quarterly
6. **Use deploy keys** - Consider dedicated deploy keys for production
7. **Enable notifications** - Get alerts on deployment failures
8. **Document changes** - Keep commit messages clear and descriptive

---

## 🆘 Need Help?

If you encounter issues:

1. Check workflow logs in GitHub Actions
2. SSH to droplet and check container logs
3. Verify all secrets are correctly set
4. Review the troubleshooting section above
5. Check `.github/workflows/README.md` for additional info

---

**Congratulations! 🎉**

You now have a fully automated CI/CD pipeline:
- ✅ Code push → Tests run automatically
- ✅ Merge to main → Auto-deploy to production
- ✅ Database migrations included
- ✅ Health checks with auto-rollback
- ✅ Zero-downtime deployments

**Last Updated:** January 6, 2026  
**Version:** 1.0
