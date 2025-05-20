FROM hub.lumigame.com/base/node:20.9.0-alpine-24h1.1 AS base
WORKDIR /app

### Builder
FROM base AS builder
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm install
COPY . .
RUN npm run build

### Cleaner
FROM base AS cleaner
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm install --omit=dev
COPY --from=builder /app/dist ./dist

### Production
FROM base as app
RUN chown -R node:node /app
COPY --from=cleaner /app .
USER node
EXPOSE 5000
CMD [ "node", "./dist/bin.js"]
