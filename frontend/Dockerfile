FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps --production=false
COPY . .
RUN npm run build || npm run build:prod || npm run build

#For test staging
FROM builder AS test

#Production build and serve
FROM builder AS build

# Use Nginx to serve the build and proxy API requests
FROM nginx:alpine AS production
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
