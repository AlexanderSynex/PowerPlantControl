# Multi-stage build
FROM node:lts-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:lts-alpine AS production

WORKDIR /app

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Install serve to serve static files
RUN npm install -g serve

# Expose port
EXPOSE 3000 443

# Install dumb-init for better signal handling
RUN apk add --no-cache dumb-init

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:80 || exit 1

# Start the application
# CMD ["serve", "-s", "dist", "-l", "80"]
CMD ["dumb-init", "serve", "-s", "dist", "-l", "3000"]