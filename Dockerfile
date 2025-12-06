FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# Production image with nginx
FROM nginx:alpine AS runner

# Copy static export to nginx
COPY --from=builder /app/out /usr/share/nginx/html

# Custom nginx config for SPA routing
RUN echo 'server { \
    listen 80; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    location / { \
        try_files $uri $uri.html $uri/ /index.html; \
    } \
    \
    # Cache static assets \
    location /_next/static/ { \
        expires 1y; \
        add_header Cache-Control "public, immutable"; \
    } \
    \
    # Security headers \
    add_header X-Frame-Options "SAMEORIGIN" always; \
    add_header X-Content-Type-Options "nosniff" always; \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
