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

# Build Strapi (with error checking)
RUN npm run build && ls -la build/ || (echo "Build failed or build directory missing" && exit 1)

# Create non-root user with proper home directory
RUN groupadd --system --gid 1001 strapi && \
    useradd --system --uid 1001 --gid strapi --home-dir /app --shell /bin/bash strapi

# Make entrypoint script executable
RUN chmod +x docker-entrypoint.sh

# Change ownership of the app directory
RUN chown -R strapi:strapi /app

USER strapi

EXPOSE 8080

# Use the entrypoint script
ENTRYPOINT ["./docker-entrypoint.sh"]