# syntax=docker/dockerfile:1.7

ARG NODE_VERSION=24.13.1

FROM node:${NODE_VERSION}-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

# -----------------------------------------------------------------------------
# Prepare pruned workspace
# -----------------------------------------------------------------------------

FROM base AS prepare

WORKDIR /app

COPY . .

RUN pnpm dlx turbo prune api --docker

# -----------------------------------------------------------------------------
# Install dependencies
# -----------------------------------------------------------------------------

FROM base AS installer

WORKDIR /app

COPY --from=prepare /app/out/json/ ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

COPY --from=prepare /app/out/full/ ./

# Optional Turbo Remote Cache
# ARG TURBO_TEAM
# ARG TURBO_TOKEN
# ENV TURBO_TEAM=$TURBO_TEAM
# ENV TURBO_TOKEN=$TURBO_TOKEN

RUN pnpm turbo build

# -----------------------------------------------------------------------------
# Runtime
# -----------------------------------------------------------------------------

FROM node:${NODE_VERSION}-slim AS runner

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app

COPY --from=installer /app .

USER node

EXPOSE 8080

CMD ["node", "apps/api/dist/src/index.js"]