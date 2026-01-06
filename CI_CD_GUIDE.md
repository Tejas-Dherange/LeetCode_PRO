# CI/CD GitHub Actions Workflows Guide

> **Complete guide for automated testing, building, and deployment of CodeLoom platform**

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Workflow Architecture](#workflow-architecture)
3. [Frontend CI/CD (Vercel)](#frontend-cicd-vercel)
4. [Backend CI/CD (Digital Ocean)](#backend-cicd-digital-ocean)
5. [Docker Image Build](#docker-image-build)
6. [Database Migrations](#database-migrations)
7. [Testing Workflows](#testing-workflows)
8. [Environment Secrets Setup](#environment-secrets-setup)
9. [Deployment Strategies](#deployment-strategies)
10. [Monitoring & Notifications](#monitoring--notifications)

---

## Overview

This guide provides complete GitHub Actions workflows for:
- ✅ **Automated Testing** - Run tests on every PR
- ✅ **Docker Image Building** - Build and push to GitHub Container Registry
- ✅ **Frontend Deployment** - Auto-deploy to Vercel
- ✅ **Backend Deployment** - SSH deploy to Digital Ocean
- ✅ **Database Migrations** - Safe Prisma migrations
- ✅ **Code Quality Checks** - Linting and formatting

---

## Workflow Architecture

```mermaid
graph TB
    A[Developer Push] --> B{Branch?}
    B -->|feature/*| C[Run Tests]
    B -->|main| D[Run Tests + Deploy]
    
    C --> E{Tests Pass?}
    E -->|Yes| F[Build Docker Image]
    E -->|No| G[Notify Failure]
    
    D --> H{Tests Pass?}
    H -->|Yes| I[Build & Push Images]
    H -->|No| G
    
    I --> J[Deploy Frontend to Vercel]
    I --> K[Deploy Backend to Digital Ocean]
    
    J --> L[Run E2E Tests]
    K --> L
    
    L --> M{E2E Pass?}
    M -->|Yes| N[Update Production]
    M -->|No| O[Rollback]
```

---

## Frontend CI/CD (Vercel)

### Automatic Deployment (Vercel Integration)

Vercel automatically deploys your frontend when connected to GitHub. However, you can add custom checks:

### `.github/workflows/frontend-ci.yml`

```yaml
name: Frontend CI

on:
  push:
    branches: [main, develop]
    paths:
      - 'frontend/**'
      - '.github/workflows/frontend-ci.yml'
  pull_request:
    branches: [main, develop]
    paths:
      - 'frontend/**'

jobs:
  lint-and-build:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      
      - name: Install dependencies
        working-directory: frontend
        run: npm ci
      
      - name: Run ESLint
        working-directory: frontend
        run: npm run lint
      
      - name: Build production bundle
        working-directory: frontend
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
          VITE_SOCKET_URL: ${{ secrets.VITE_SOCKET_URL }}
          VITE_GOOGLE_CLIENT_ID: ${{ secrets.VITE_GOOGLE_CLIENT_ID }}
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: frontend-build
          path: frontend/dist
          retention-days: 7
      
      - name: Check bundle size
        working-directory: frontend
        run: |
          BUNDLE_SIZE=$(du -sh dist | cut -f1)
          echo "Bundle size: $BUNDLE_SIZE"
          echo "::notice::Frontend bundle size is $BUNDLE_SIZE"

  lighthouse:
    runs-on: ubuntu-latest
    needs: lint-and-build
    if: github.event_name == 'pull_request'
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            https://codeloom.vercel.app
          uploadArtifacts: true
```

---

## Backend CI/CD (Digital Ocean)

### `.github/workflows/backend-deploy.yml`

```yaml
name: Backend Deploy

on:
  push:
    branches: [main]
    paths:
      - 'backend/**'
      - '.github/workflows/backend-deploy.yml'
  workflow_dispatch:

env:
  DOCKER_IMAGE: ghcr.io/${{ github.repository_owner }}/codeloom-backend
  DROPLET_IP: ${{ secrets.DROPLET_IP }}

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: codeloom_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
      
      redis:
        image: redis:7-alpine
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json
      
      - name: Install dependencies
        working-directory: backend
        run: npm ci
      
      - name: Generate Prisma Client
        working-directory: backend
        run: npx prisma generate
      
      - name: Run database migrations
        working-directory: backend
        run: npx prisma migrate deploy
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/codeloom_test
      
      - name: Run tests
        working-directory: backend
        run: npm test
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/codeloom_test
          REDIS_URL: redis://localhost:6379
          JWT_SECRET: test-secret

  build-and-push:
    runs-on: ubuntu-latest
    needs: test
    permissions:
      contents: read
      packages: write
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      
      - name: Log in to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.DOCKER_IMAGE }}
          tags: |
            type=sha,prefix={{branch}}-
            type=raw,value=latest
      
      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: ./backend
          file: ./backend/Dockerfile
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          platforms: linux/amd64

  deploy:
    runs-on: ubuntu-latest
    needs: build-and-push
    
    steps:
      - name: Deploy to Digital Ocean
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.DROPLET_IP }}
          username: ${{ secrets.DROPLET_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd ~/codeloom
            
            # Pull latest code
            git pull origin main
            
            # Pull latest Docker images
            docker pull ${{ env.DOCKER_IMAGE }}:latest
            
            # Run database migrations
            cd backend
            npx prisma migrate deploy
            
            # Restart services with docker-compose
            docker-compose -f docker-compose.prod.yml down
            docker-compose -f docker-compose.prod.yml up -d
            
            # Clean up old images
            docker image prune -af
            
            # Health check
            sleep 10
            curl -f http://localhost:3000/health || exit 1
            
            echo "Deployment successful!"
      
      - name: Notify deployment status
        if: always()
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Backend deployment to production ${{ job.status }}'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## Docker Image Build

### `.github/workflows/docker-build.yml` (Enhanced)

```yaml
name: Build and Push Docker Images

on:
  push:
    branches: [main, develop]
    paths:
      - 'backend/**'
      - '.github/workflows/docker-build.yml'
  pull_request:
    branches: [main]
  workflow_dispatch:

env:
  REGISTRY: ghcr.io
  BACKEND_IMAGE: ghcr.io/${{ github.repository_owner }}/codeloom-backend
  WORKER_IMAGE: ghcr.io/${{ github.repository_owner }}/codeloom-worker

jobs:
  build-backend:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      
      - name: Log in to GHCR
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.BACKEND_IMAGE }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=sha,prefix={{branch}}-
            type=raw,value=latest,enable={{is_default_branch}}
            type=semver,pattern={{version}}
      
      - name: Build and push Backend image
        uses: docker/build-push-action@v5
        with:
          context: ./backend
          file: ./backend/Dockerfile
          push: ${{ github.event_name != 'pull_request' }}
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          platforms: linux/amd64,linux/arm64

  build-worker:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      
      - name: Log in to GHCR
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.WORKER_IMAGE }}
          tags: |
            type=ref,event=branch
            type=sha,prefix={{branch}}-
            type=raw,value=latest,enable={{is_default_branch}}
      
      - name: Build and push Worker image
        uses: docker/build-push-action@v5
        with:
          context: ./backend
          file: ./backend/Dockerfile.worker
          push: ${{ github.event_name != 'pull_request' }}
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          platforms: linux/amd64

  scan-vulnerabilities:
    runs-on: ubuntu-latest
    needs: [build-backend]
    
    steps:
      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: ${{ env.BACKEND_IMAGE }}:latest
          format: 'sarif'
          output: 'trivy-results.sarif'
      
      - name: Upload Trivy results to GitHub Security
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-results.sarif'
```

---

## Database Migrations

### `.github/workflows/database-migration.yml`

```yaml
name: Database Migration

on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Target environment'
        required: true
        type: choice
        options:
          - development
          - staging
          - production

jobs:
  migrate:
    runs-on: ubuntu-latest
    environment: ${{ github.event.inputs.environment }}
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        working-directory: backend
        run: npm ci
      
      - name: Generate Prisma Client
        working-directory: backend
        run: npx prisma generate
      
      - name: Run database migrations
        working-directory: backend
        run: npx prisma migrate deploy
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
      
      - name: Verify migration
        working-directory: backend
        run: |
          npx prisma db execute --stdin <<EOF
          SELECT tablename FROM pg_tables WHERE schemaname='public';
          EOF
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
      
      - name: Seed database (optional)
        if: github.event.inputs.environment == 'development'
        working-directory: backend
        run: node prisma/seed.js
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
      
      - name: Notify migration status
        if: always()
        run: |
          echo "Migration ${{ job.status }} for ${{ github.event.inputs.environment }}"
```

---

## Testing Workflows

### `.github/workflows/tests.yml`

```yaml
name: Run Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18, 20]
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: codeloom_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
      
      redis:
        image: redis:7-alpine
        ports:
          - 6379:6379
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json
      
      - name: Install dependencies
        working-directory: backend
        run: npm ci
      
      - name: Generate Prisma Client
        working-directory: backend
        run: npx prisma generate
      
      - name: Run migrations
        working-directory: backend
        run: npx prisma migrate deploy
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/codeloom_test
      
      - name: Run unit tests
        working-directory: backend
        run: npm run test:unit
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/codeloom_test
          REDIS_URL: redis://localhost:6379
      
      - name: Run integration tests
        working-directory: backend
        run: npm run test:integration
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/codeloom_test
          REDIS_URL: redis://localhost:6379
      
      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          file: ./backend/coverage/coverage-final.json
          flags: backend
          name: backend-${{ matrix.node-version }}

  frontend-tests:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      
      - name: Install dependencies
        working-directory: frontend
        run: npm ci
      
      - name: Run tests
        working-directory: frontend
        run: npm test
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./frontend/coverage/coverage-final.json
          flags: frontend

  e2e-tests:
    runs-on: ubuntu-latest
    needs: [backend-tests, frontend-tests]
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install Playwright
        working-directory: frontend
        run: |
          npm ci
          npx playwright install --with-deps
      
      - name: Run E2E tests
        working-directory: frontend
        run: npx playwright test
      
      - name: Upload Playwright report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: frontend/playwright-report
          retention-days: 30
```

---

## Environment Secrets Setup

### Required GitHub Secrets

Add these secrets in your GitHub repository settings (`Settings > Secrets and variables > Actions`):

#### **Backend Secrets**
```
DATABASE_URL                  - PostgreSQL connection string
REDIS_URL                     - Redis connection string
JWT_SECRET                    - JWT signing key
GOOGLE_CLIENT_ID              - Google OAuth client ID
GOOGLE_CLIENT_SECRET          - Google OAuth secret
RAZORPAY_KEY_ID              - Razorpay API key
RAZORPAY_KEY_SECRET          - Razorpay secret
CLOUDINARY_CLOUD_NAME        - Cloudinary cloud name
CLOUDINARY_API_KEY           - Cloudinary API key
CLOUDINARY_API_SECRET        - Cloudinary secret
GEMINI_API_KEY               - Google Gemini API key
JUDGE0_BATCH_SUBMISSION_ENDPOINT - Judge0 API endpoint
JUDGE0_SULU_API_KEY          - Judge0 API key
```

#### **Frontend Secrets**
```
VITE_API_URL                 - Backend API URL
VITE_SOCKET_URL              - WebSocket server URL
VITE_GOOGLE_CLIENT_ID        - Google OAuth client ID
VITE_RAZORPAY_KEY_ID         - Razorpay publishable key
```

#### **Deployment Secrets**
```
DROPLET_IP                   - Digital Ocean droplet IP
DROPLET_USER                 - SSH username (e.g., root)
SSH_PRIVATE_KEY              - SSH private key for droplet access
VERCEL_TOKEN                 - Vercel deployment token (optional)
SLACK_WEBHOOK                - Slack notification webhook (optional)
```

### Setting Secrets via GitHub CLI

```bash
# Install GitHub CLI
gh auth login

# Set secrets
gh secret set DATABASE_URL --body "postgresql://user:pass@host:5432/db"
gh secret set JWT_SECRET --body "your-super-secret-key"
gh secret set SSH_PRIVATE_KEY < ~/.ssh/id_ed25519

# List all secrets
gh secret list
```

---

## Deployment Strategies

### Blue-Green Deployment

```yaml
# .github/workflows/blue-green-deploy.yml
name: Blue-Green Deployment

on:
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Deploy to Green environment
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.DROPLET_IP }}
          username: ${{ secrets.DROPLET_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            # Start green environment
            docker-compose -f docker-compose.green.yml up -d
            
            # Health check
            sleep 10
            curl -f http://localhost:3001/health || exit 1
            
            # Switch Nginx to green
            sudo ln -sf /etc/nginx/sites-available/green /etc/nginx/sites-enabled/default
            sudo systemctl reload nginx
            
            # Stop blue environment
            docker-compose -f docker-compose.blue.yml down
            
            # Swap blue and green
            mv docker-compose.green.yml docker-compose.blue.yml
```

### Canary Deployment

```yaml
# .github/workflows/canary-deploy.yml
name: Canary Deployment

on:
  workflow_dispatch:
    inputs:
      traffic_percentage:
        description: 'Percentage of traffic to canary'
        required: true
        default: '10'

jobs:
  deploy-canary:
    runs-on: ubuntu-latest
    
    steps:
      - name: Deploy canary instance
        run: |
          # Deploy new version to canary servers
          # Configure load balancer to send X% traffic to canary
          # Monitor metrics for 30 minutes
          # If successful, promote canary to production
```

---

## Monitoring & Notifications

### Slack Notifications

```yaml
# Add to any workflow
- name: Notify Slack
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: |
      Workflow: ${{ github.workflow }}
      Job: ${{ github.job }}
      Status: ${{ job.status }}
      Commit: ${{ github.sha }}
      Author: ${{ github.actor }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### Discord Notifications

```yaml
- name: Notify Discord
  if: always()
  uses: sarisia/actions-status-discord@v1
  with:
    webhook: ${{ secrets.DISCORD_WEBHOOK }}
    status: ${{ job.status }}
    title: "Deployment Status"
    description: "Build #${{ github.run_number }}"
    color: 0x00FF00
    username: GitHub Actions
```

### Email Notifications

```yaml
- name: Send email on failure
  if: failure()
  uses: dawidd6/action-send-mail@v3
  with:
    server_address: smtp.gmail.com
    server_port: 465
    username: ${{ secrets.MAIL_USERNAME }}
    password: ${{ secrets.MAIL_PASSWORD }}
    subject: "CI/CD Failure: ${{ github.workflow }}"
    to: admin@codeloom.com
    from: github-actions@codeloom.com
    body: |
      Workflow ${{ github.workflow }} failed!
      Repository: ${{ github.repository }}
      Commit: ${{ github.sha }}
      Author: ${{ github.actor }}
```

---

## Complete Workflow Setup

### Step-by-Step Setup Guide

#### 1. **Create Workflow Directory**
```bash
mkdir -p .github/workflows
```

#### 2. **Add All Workflow Files**
Copy all YAML files from this guide to `.github/workflows/`

#### 3. **Configure GitHub Secrets**
```bash
# Set all required secrets
gh secret set DATABASE_URL
gh secret set JWT_SECRET
gh secret set SSH_PRIVATE_KEY < ~/.ssh/id_ed25519
# ... (add all other secrets)
```

#### 4. **Setup SSH Access to Droplet**
```bash
# On your local machine
ssh-keygen -t ed25519 -C "github-actions@codeloom.com"

# Copy public key to droplet
ssh-copy-id user@your-droplet-ip

# Add private key to GitHub secrets
gh secret set SSH_PRIVATE_KEY < ~/.ssh/id_ed25519
```

#### 5. **Configure Vercel**
```bash
# Install Vercel CLI
npm i -g vercel

# Link project
cd frontend
vercel link

# Get deployment token
vercel whoami

# Add to GitHub secrets
gh secret set VERCEL_TOKEN
```

#### 6. **Test Workflows**
```bash
# Trigger workflow manually
gh workflow run "Backend Deploy"

# View workflow runs
gh run list

# View logs
gh run view <run-id>
```

---

## Troubleshooting

### Common Issues

**1. SSH Connection Failed**
```bash
# Verify SSH key format
cat ~/.ssh/id_ed25519 | base64

# Test SSH connection
ssh -i ~/.ssh/id_ed25519 user@droplet-ip
```

**2. Docker Build Fails**
```yaml
# Add debug step
- name: Debug Docker
  run: |
    docker version
    docker buildx version
    docker buildx ls
```

**3. Database Migration Errors**
```bash
# Check Prisma schema
npx prisma validate

# Reset migrations (dev only)
npx prisma migrate reset
```

**4. Environment Variables Not Set**
```yaml
# Add verification step
- name: Verify env vars
  run: |
    echo "DATABASE_URL is set: ${{ secrets.DATABASE_URL != '' }}"
    echo "JWT_SECRET is set: ${{ secrets.JWT_SECRET != '' }}"
```

---

## Best Practices

### ✅ Do's
- Use environment-specific secrets
- Enable branch protection rules
- Require status checks before merging
- Use semantic versioning for releases
- Run tests on every PR
- Use caching to speed up builds
- Monitor workflow execution times
- Set up failure notifications

### ❌ Don'ts
- Don't commit secrets to code
- Don't skip tests for quick deploys
- Don't deploy on Friday evening 😄
- Don't use `main` branch for experiments
- Don't ignore security vulnerabilities

---

## Workflow Templates

### Quick Start Template

Create `.github/workflows/main.yml`:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test
  
  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy
        run: echo "Deploy to production"
```

---

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Build-Push Action](https://github.com/docker/build-push-action)
- [Vercel GitHub Integration](https://vercel.com/docs/git/vercel-for-github)
- [Prisma Deploy Guide](https://www.prisma.io/docs/guides/deployment)
- [BullMQ Production Guide](https://docs.bullmq.io/guide/going-to-production)

---

**Last Updated:** January 6, 2026  
**Version:** 1.0  
**Author:** CodeLoom DevOps Team
