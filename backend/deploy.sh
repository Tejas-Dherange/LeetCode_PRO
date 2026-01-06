#!/bin/bash
set -e

echo "🚀 Starting deployment..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Navigate to project directory
cd ~/LeetCode_PRO/backend

echo -e "${BLUE}📥 Pulling latest changes...${NC}"
git pull origin main

echo -e "${BLUE}🐳 Building and starting Docker containers...${NC}"
docker-compose -f docker-compose.prod.yml up -d --build

echo -e "${BLUE}🧹 Cleaning up unused Docker images...${NC}"
docker image prune -f

echo -e "${BLUE}🔍 Checking container status...${NC}"
docker-compose -f docker-compose.prod.yml ps

echo -e "${GREEN}✅ Deployment complete!${NC}"

# Optional: Show logs
# docker-compose -f docker-compose.prod.yml logs --tail=50
