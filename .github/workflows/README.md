# GitHub Workflows - Industry Standard Setup

This directory contains automated CI/CD workflows for the CodeLoom platform.

## 📁 Workflow Files

### 1. `ci.yml` - Continuous Integration
**Triggers:** Push/PR to main or develop branches

**Jobs:**
- ✅ **Frontend Tests** - Lint, build, bundle size check
- ✅ **Backend Tests** - Database migrations, tests with PostgreSQL & Redis
- ✅ **Code Quality** - Security checks, file size validation

**Purpose:** Validate code before merging

---

### 2. `deploy-backend.yml` - Backend Deployment
**Triggers:** Push to main, manual dispatch

**Features:**
- 🚀 SSH deployment to Digital Ocean droplet
- 🗄️ Automatic database migrations
- 🐳 Docker Compose rebuild
- 🏥 Health checks with automatic rollback
- 🌍 Environment support (production/staging)

**Deployment Flow:**
1. Pull latest code from GitHub
2. Run Prisma migrations
3. Rebuild Docker containers
4. Health check (HTTP 200 on /health)
5. Rollback if health check fails

---

### 3. `database-migration.yml` - Manual Migrations
**Triggers:** Manual dispatch only

**Purpose:** Run database migrations independently for specific environments

**Environments:** Development, Staging, Production

---

## 🔑 Required GitHub Secrets

Add these in: **Settings > Secrets and variables > Actions**

### Deployment Secrets
```
DROPLET_IP              # Digital Ocean droplet IP address
DROPLET_USER            # SSH username (usually 'root')
SSH_PRIVATE_KEY         # SSH private key for authentication
APP_URL                 # https://api.codeloom.com
```

### Application Secrets
```
DATABASE_URL            # PostgreSQL connection string
VITE_API_URL           # Frontend API URL
VITE_SOCKET_URL        # WebSocket server URL
VITE_GOOGLE_CLIENT_ID  # Google OAuth client ID
```

## 🌍 GitHub Environments Setup

Create environments in: **Settings > Environments**

### Production Environment
- **Protection rules:**
  - ✅ Required reviewers (1-2 people)
  - ✅ Wait timer: 5 minutes
  - ✅ Deployment branches: main only

### Staging Environment (Optional)
- **Protection rules:**
  - ✅ Deployment branches: develop, staging

## 📋 Workflow Execution

### Automatic Deployments
```bash
# Triggers automatically when you push to main
git push origin main

# CI runs on all branches
git push origin feature/new-feature
```

### Manual Deployments
```bash
# Using GitHub CLI
gh workflow run "Deploy Backend" -f environment=production

# Or via GitHub UI:
# Actions > Deploy Backend > Run workflow > Select environment
```

### Database Migrations
```bash
# Manual trigger only
gh workflow run "Database Migration" -f environment=production
```

## 🔍 Monitoring Workflows

### View Workflow Runs
```bash
# List recent runs
gh run list

# View specific run
gh run view <run-id>

# Watch live logs
gh run watch
```

### Check Deployment Status
```bash
# SSH into droplet
ssh root@your-droplet-ip

# Check containers
cd ~/LeetCode_PRO/backend
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f backend
```

## 🚨 Rollback Procedure

### Automatic Rollback
The deployment workflow includes automatic rollback if health checks fail.

### Manual Rollback
```bash
# SSH to droplet
ssh root@your-droplet-ip

cd ~/LeetCode_PRO/backend

# Revert to previous commit
git reset --hard HEAD~1

# Rebuild containers
docker-compose -f docker-compose.prod.yml up -d --build
```

## 🛠️ deploy.sh Usage

The `deploy.sh` script is kept for **manual/emergency deployments** only.

**When to use:**
- Emergency fixes outside of CI/CD
- Local testing before pushing
- When GitHub Actions is down

**Usage:**
```bash
# SSH to droplet
ssh root@your-droplet-ip

cd ~/LeetCode_PRO/backend
./deploy.sh
```

**Note:** Normal deployments should use GitHub Actions, not the script directly.

## 📊 Workflow Best Practices

### ✅ Do's
- Always use manual workflow dispatch for production
- Review changes before deploying to production
- Monitor logs after deployment
- Use staging environment for testing
- Keep secrets updated and rotated

### ❌ Don'ts
- Don't deploy on Friday evening
- Don't skip health checks
- Don't commit secrets to code
- Don't deploy without testing
- Don't force push to main

## 🔐 Security Considerations

1. **SSH Keys:** Use dedicated deploy keys, not personal SSH keys
2. **Secrets:** Rotate secrets quarterly
3. **Environments:** Use environment-specific secrets
4. **Branch Protection:** Require PR reviews before merging
5. **Audit Logs:** Regularly review deployment logs

## 📈 Deployment Metrics

Track these metrics for each deployment:
- ⏱️ Deployment duration
- ✅ Success rate
- 🔄 Rollback frequency
- 🏥 Health check response time
- 📦 Docker image size

## 🆘 Troubleshooting

### Issue: SSH Connection Failed
**Solution:**
```bash
# Verify SSH key
ssh -i ~/.ssh/id_ed25519 root@droplet-ip

# Check GitHub secret format
cat ~/.ssh/id_ed25519 | base64
```

### Issue: Health Check Failed
**Solution:**
```bash
# Check container logs
docker-compose logs backend

# Verify health endpoint
curl localhost:3000/health

# Check database connection
docker-compose exec backend npx prisma db execute --stdin <<< "SELECT 1"
```

### Issue: Database Migration Failed
**Solution:**
```bash
# Check migration status
npx prisma migrate status

# Resolve migration
npx prisma migrate resolve --applied <migration-name>
```

## 📚 Additional Resources

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [SSH Action Docs](https://github.com/appleboy/ssh-action)
- [Docker Compose Docs](https://docs.docker.com/compose/)
- [Prisma Migrations](https://www.prisma.io/docs/concepts/components/prisma-migrate)

---

**Last Updated:** January 6, 2026  
**Maintained By:** DevOps Team
