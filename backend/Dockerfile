# ── Stage 1: install dependencies ────────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev --no-fund --no-audit

# ── Stage 2: lean runtime image ───────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Non-root user for security
RUN addgroup -S catpomo && adduser -S catpomo -G catpomo

COPY --from=deps /app/node_modules ./node_modules
COPY src ./src

RUN chown -R catpomo:catpomo /app
USER catpomo

EXPOSE 4000
HEALTHCHECK --interval=15s --timeout=5s --retries=5 \
  CMD wget -qO- http://localhost:4000/health || exit 1

CMD ["node", "src/index.js"]
