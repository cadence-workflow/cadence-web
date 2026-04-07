FROM node:18-bookworm-slim  AS base

FROM base AS dev
# Install git + CA bundle so git https can verify TLS
RUN apt-get update \
  && apt-get install -y --no-install-recommends git ca-certificates \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY . .


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
RUN apt-get update \
  && apt-get install -y --no-install-recommends git ca-certificates \
  && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci
RUN npm run install-idl
COPY . .

# Disable Next.js telemetry from collecting general usage data.
# Learn more here: https://nextjs.org/telemetry
ENV NEXT_TELEMETRY_DISABLED=1


RUN npm run generate:idl
RUN npm run build-standalone
RUN npm run post-build-standalone

# Production image, copy necessary files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public


# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/src/__generated__/ ./src/__generated__/
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs


CMD  ["sh","-c", "CADENCE_WEB_PORT=${CADENCE_WEB_PORT:-8088} CADENCE_WEB_HOSTNAME=${CADENCE_WEB_HOSTNAME:-0.0.0.0} exec node server.js"]
