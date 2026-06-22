FROM node:24-bookworm-slim

ARG PNPM_VERSION=11.8.0

ENV PNPM_HOME="/pnpm"
ENV PATH="${PNPM_HOME}/bin:${PATH}"
ENV CI=true

RUN mkdir -p "${PNPM_HOME}" \
  && npm install -g "pnpm@${PNPM_VERSION}" --prefix "${PNPM_HOME}" \
  && chmod -R a+rX "${PNPM_HOME}"

WORKDIR /app

CMD ["pnpm", "--version"]
