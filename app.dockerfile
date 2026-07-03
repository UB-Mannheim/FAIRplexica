FROM node:20.18.0-slim AS builder

WORKDIR /home/fairplexica

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --network-timeout 600000

COPY tsconfig.json next.config.mjs next-env.d.ts postcss.config.js drizzle.config.ts tailwind.config.ts ./
COPY src ./src
COPY public ./public

RUN mkdir -p /home/fairplexica/data
RUN yarn build

# Disable yarn telemetry
ENV YARN_ENABLE_TELEMETRY=0
RUN yarn config set enableTelemetry false

RUN yarn add --dev @vercel/ncc
RUN yarn ncc build ./src/lib/db/migrate.ts -o migrator

FROM node:20.18.0-slim

WORKDIR /home/fairplexica

COPY --from=builder /home/fairplexica/public ./public
COPY --from=builder /home/fairplexica/.next/static ./public/_next/static

COPY --from=builder /home/fairplexica/.next/standalone ./
COPY --from=builder /home/fairplexica/data ./data
COPY drizzle ./drizzle
COPY --from=builder /home/fairplexica/migrator/build ./build
COPY --from=builder /home/fairplexica/migrator/index.js ./migrate.js

RUN mkdir /home/fairplexica/uploads

COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh
CMD ["./entrypoint.sh"]