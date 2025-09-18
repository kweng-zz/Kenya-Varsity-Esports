# Multi-stage build for Next.js + Strapi
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies for both Next.js and Strapi
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

# Build Strapi first
RUN cd kuer && npm run build

# Build Next.js
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built applications
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/kuer/dist ./kuer/dist
COPY --from=builder /app/kuer/node_modules ./kuer/node_modules
COPY --from=builder /app/kuer/package.json ./kuer/package.json
COPY --from=builder /app/kuer/config ./kuer/config

USER nextjs

EXPOSE 3000
EXPOSE 1337

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Start both applications
CMD ["npm", "start"]