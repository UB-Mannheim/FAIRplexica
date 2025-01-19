FROM node:20.18.0-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat 
WORKDIR /home/perplexica
COPY ui/package.json ui/yarn.lock ./
RUN yarn install --frozen-lockfile


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /home/perplexica
COPY --from=deps /home/perplexica/node_modules ./node_modules
COPY ui/* .
ENV NEXT_TELEMETRY_DISABLED 1
RUN yarn install
RUN yarn build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /home/perplexica
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
# You only need to copy next.config.js if you are NOT using the default configuration
# COPY --from=builder /app/next.config.js ./
COPY --from=builder /home/perplexica/public ./public
COPY --from=builder /home/perplexica/package.json ./package.json
# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /home/perplexica/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /home/perplexica/.next/static ./.next/static

ARG NEXT_PUBLIC_WS_URL=ws://127.0.0.1:3001
ARG NEXT_PUBLIC_API_URL=http://127.0.0.1:3001/api
ENV NEXT_PUBLIC_WS_URL=${NEXT_PUBLIC_WS_URL}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

USER nextjs
EXPOSE 3000
ENV PORT=3000
# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]