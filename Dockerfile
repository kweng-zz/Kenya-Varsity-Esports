# Use the official Node.js 18 Alpine image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package*.json ./
COPY kuer/package*.json ./kuer/
RUN npm ci
RUN cd kuer && npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/kuer/node_modules ./kuer/node_modules
COPY . .

# Build Strapi first (only if needed)
RUN cd kuer && npm run build

# Build Next.js
# Set environment variables for build time
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# Build Next.js with fallback environment variables to prevent build failures
ENV NEXT_PUBLIC_APPWRITE_ENDPOINT=""
ENV NEXT_PUBLIC_APPWRITE_PROJECT_ID=""
ENV APPWRITE_API_KEY=""

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy Strapi build
COPY --from=builder /app/kuer/dist ./kuer/dist
COPY --from=builder /app/kuer/node_modules ./kuer/node_modules
COPY --from=builder /app/kuer/package.json ./kuer/package.json
COPY --from=builder /app/kuer/config ./kuer/config

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Start the application
CMD ["node", "server.js"]