# Multi-stage build for optimal size
FROM node:20-alpine AS deps

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install production dependencies only with specific optimizations
RUN npm ci --omit=dev --ignore-scripts && \
    npm cache clean --force

# ===================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# ===================================
FROM node:20-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Install only runtime dependencies for Prisma
RUN apk add --no-cache openssl && \
    rm -rf /var/cache/apk/*

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs

# Copy production node_modules from deps stage
COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copy application code from builder
COPY --from=builder --chown=nodejs:nodejs /app/src ./src
COPY --from=builder --chown=nodejs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nodejs:nodejs /app/libs ./libs
COPY --from=builder --chown=nodejs:nodejs /app/controllers ./controllers
COPY --from=builder --chown=nodejs:nodejs /app/routes ./routes
COPY --from=builder --chown=nodejs:nodejs /app/middleware ./middleware
COPY --from=builder --chown=nodejs:nodejs /app/workers ./workers
COPY --from=builder --chown=nodejs:nodejs /app/socket ./socket

# Copy Prisma generated client
COPY --from=builder --chown=nodejs:nodejs /app/node_modules/.prisma ./node_modules/.prisma

# Copy package.json for version info
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./

# Remove unnecessary Prisma query engines to save space
RUN rm -rf /app/node_modules/.prisma/client/libquery_engine-debian-* \
    /app/node_modules/.prisma/client/libquery_engine-darwin-* \
    /app/node_modules/.prisma/client/libquery_engine-windows-* \
    /app/node_modules/.prisma/client/query_engine-debian-* \
    /app/node_modules/.prisma/client/query_engine-darwin-* \
    /app/node_modules/.prisma/client/query_engine-windows-* && \
    find /app/node_modules -name "*.md" -type f -delete && \
    find /app/node_modules -name "*.txt" -type f -delete && \
    find /app/node_modules -name "LICENSE*" -type f -delete && \
    find /app/node_modules -name "*.map" -type f -delete

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["node", "src/index.js"]
