FROM node:lts-alpine3.22 as builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:lts-alpine3.22
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production
COPY server/ .
COPY --from=builder /app/dist ./public
EXPOSE 8080
CMD ["node", "server.js"]