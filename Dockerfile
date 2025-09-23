FROM node:18-slim

# Install dependencies
RUN apt-get update && apt-get install -y \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080
ENV HOST=0.0.0.0

# Build Strapi
RUN npm run build

# Create non-root user
RUN addgroup --system --gid 1001 strapi
RUN adduser --system --uid 1001 strapi

# Change ownership of the app directory
RUN chown -R strapi:strapi /app

USER strapi

EXPOSE 8080

# Start Strapi
CMD ["npm", "run", "start"]