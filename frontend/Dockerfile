# ── Stage 1: build React app ─────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

ARG VITE_API_URL=http://localhost:4000
ENV VITE_API_URL=$VITE_API_URL

COPY package.json ./
RUN npm install --no-fund --no-audit

COPY . .
RUN npm run build

# ── Stage 2: serve with nginx ─────────────────────────────────────────────────
FROM nginx:1.25-alpine AS runner

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# nginx config: SPA fallback + reverse proxy /api → backend
RUN printf '\
server {\n\
  listen 80;\n\
  root /usr/share/nginx/html;\n\
  index index.html;\n\
\n\
  # Proxy API calls to backend service\n\
  location /api/ {\n\
    proxy_pass         http://api:4000;\n\
    proxy_http_version 1.1;\n\
    proxy_set_header   Host              $host;\n\
    proxy_set_header   X-Real-IP         $remote_addr;\n\
    proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;\n\
    proxy_set_header   X-Forwarded-Proto $scheme;\n\
  }\n\
\n\
  location /health {\n\
    proxy_pass http://api:4000/health;\n\
  }\n\
\n\
  # SPA: send all other routes to index.html\n\
  location / {\n\
    try_files $uri $uri/ /index.html;\n\
  }\n\
\n\
  gzip on;\n\
  gzip_types text/plain text/css application/javascript application/json image/svg+xml;\n\
}\n\
' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
