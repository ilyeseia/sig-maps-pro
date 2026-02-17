# GIS Maps Pro - Multi-stage Docker Build
# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Install dependencies for native modules
RUN apk add --no-cache libc6-compat openssl

# Copy package files
COPY package.json bun.lock ./

# Install dependencies
RUN npm install -g bun && \
    bun install --frozen-lockfile --production

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Install bun for build
RUN npm install -g bun

# Generate Prisma client
RUN bun run db:generate

# Build application
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN bun run build

# Stage 3: Runner (Production)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/prisma ./prisma

# Set correct ownership
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Set environment variables
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Start application
CMD ["node", "server.js"]
