FROM node:24-bookworm-slim

ARG PNPM_VERSION=11.8.0

ENV PNPM_HOME="/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"
ENV CI=true

RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate

WORKDIR /app

CMD ["pnpm", "--version"]
