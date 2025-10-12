# Build stage
FROM node:lts-alpine AS build
WORKDIR /app
# Copy package files
COPY package*.json ./
# Install all dependencies (including dev for build)
RUN npm ci
# Copy source code
COPY . .
# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine
# Install curl for healthcheck
RUN apk add --no-cache curl
# Copy built app to nginx
COPY --from=build /app/dist /usr/share/nginx/html
# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf
# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S reactapp -u 1001
# Change ownership of nginx files
RUN chown -R reactapp:nodejs /var/cache/nginx && \
    chown -R reactapp:nodejs /var/log/nginx && \
    chown -R reactapp:nodejs /etc/nginx/conf.d
RUN touch /var/run/nginx.pid && \
    chown -R reactapp:nodejs /var/run/nginx.pid
USER reactapp
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]