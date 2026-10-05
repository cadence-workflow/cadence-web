FROM node:24-bookworm-slim  AS base

FROM base AS dev
# Install git + CA bundle so git https can verify TLS
RUN apt-get update \
  && apt-get install -y --no-install-recommends git ca-certificates \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /app
# Supply-chain cooldown: only effective where the lockfile is generated
# (npm install), i.e. local dev inside this container. No-op for npm ci.
ENV npm_config_min_release_age=14
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

# Production image as distroless, copy necessary files and run next.
# The distroless nodejs24 nonroot image already runs as an unprivileged user
# (uid 65532) and ships no shell or package manager, so the addgroup/adduser/
# chown setup is no longer needed. Debian 13 runtime is glibc-compatible with
# the Debian 12 (bookworm) builder above.
FROM gcr.io/distroless/nodejs24-debian13:nonroot AS runner
WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED=1


COPY --from=builder /app/public ./public


# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder /app/src/__generated__/ ./src/__generated__/
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# The distroless image has no shell to expand ${VAR:-default}, so the defaults
# that were previously set inline in the `sh -c` CMD are baked in via ENV here.
ENV CADENCE_WEB_PORT=8088
ENV CADENCE_WEB_HOSTNAME=0.0.0.0

EXPOSE 8088

# The distroless nodejs image's ENTRYPOINT is `node`, so CMD only needs the
# script to run (equivalent to `node server.js`).
CMD ["server.js"]
