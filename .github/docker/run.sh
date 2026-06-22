#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
IMAGE_NAME="${SST_DEMO_CI_IMAGE:-sst-demo-ci}"
PNPM_VERSION="${PNPM_VERSION:-11.8.0}"

docker build \
  --build-arg "PNPM_VERSION=${PNPM_VERSION}" \
  -f "${ROOT_DIR}/.github/docker/Dockerfile" \
  -t "${IMAGE_NAME}" \
  "${ROOT_DIR}"

docker run --rm \
  -e CI=true \
  -e PNPM_VERSION="${PNPM_VERSION}" \
  -u "$(id -u):$(id -g)" \
  -v "${ROOT_DIR}:/app" \
  -w /app \
  "${IMAGE_NAME}" \
  bash -lc '
    cp .github/docker/.npmrc.ci .npmrc
    CLASP_AUTH_FILE="/app/.config/clasp/.clasprc.json"
    if [ -f "$CLASP_AUTH_FILE" ]; then
      export CLASP_CONFIG_AUTH="$CLASP_AUTH_FILE"
    fi
    pnpm install --frozen-lockfile
    exec "$@"
  ' _ "$@"
