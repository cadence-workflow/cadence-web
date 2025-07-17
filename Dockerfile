FROM node:18-alpine AS base

RUN apk update
RUN apk --no-cache add git
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json ./
RUN npm ci
RUN npm run install-idl



FROM base AS dev

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .



# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1
# optimize Build size by including only required resources

RUN npm run generate:idl
RUN npm run build
RUN npm run build-standalone
RUN npm run post-build-standalone

# Production image as distroless, copy all the files and run next
FROM gcr.io/distroless/nodejs18:nonroot AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED 1


COPY --from=builder /app/public ./public



# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder /app/src/__generated__/ ./src/__generated__ 
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

ENV CADENCE_WEB_PORT=8088
ENV CADENCE_WEB_HOSTNAME=0.0.0.0

EXPOSE 8088

CMD ["server.js"]
