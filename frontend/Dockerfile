FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps --production=false
COPY . .
RUN npm run build || npm run build:prod || npm run build

# Use a lightweight web server to serve the build
FROM node:18-alpine AS production
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173"]
