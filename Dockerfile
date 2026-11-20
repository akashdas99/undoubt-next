FROM node:22-bookworm-slim AS build
RUN corepack enable && corepack prepare pnpm@10.33.4 --activate
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm exec turbo build --filter=api
RUN pnpm --filter api deploy --prod --legacy /out

FROM oven/bun:1
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /out .
COPY --from=build /app/apps/api/dist ./dist
EXPOSE 3001
CMD ["bun", "dist/main.js"]
