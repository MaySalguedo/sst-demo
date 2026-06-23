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
  -e HOME=/app \
  -e XDG_CACHE_HOME=/app/.cache \
  -e NODE_OPTIONS="--dns-result-order=ipv4first" \
  -e PNPM_VERSION="${PNPM_VERSION}" \
  -e BUILD_PROFILE="${BUILD_PROFILE:-}" \
  -e CLASP_CLIENT_ID="${CLASP_CLIENT_ID:-}" \
  -e CLASP_CLIENT_SECRET="${CLASP_CLIENT_SECRET:-}" \
  -e CLASP_REFRESH_TOKEN="${CLASP_REFRESH_TOKEN:-}" \
  -e APPSHEET_APP_ID="${APPSHEET_APP_ID:-}" \
  -e APPSHEET_ACCESS_KEY="${APPSHEET_ACCESS_KEY:-}" \
  -e APPSHEET_REGION="${APPSHEET_REGION:-}" \
  -e APPSHEET_DB_URL="${APPSHEET_DB_URL:-}" \
  -e LOOKER_REPORT_URL="${LOOKER_REPORT_URL:-}" \
  -e LOOKER_EMBED_URL="${LOOKER_EMBED_URL:-}" \
  -e ALERT_DAYS_BEFORE="${ALERT_DAYS_BEFORE:-}" \
  -e EMAIL_SST="${EMAIL_SST:-}" \
  -u "$(id -u):$(id -g)" \
  -v "${ROOT_DIR}:/app" \
  -w /app \
  "${IMAGE_NAME}" \
  bash -lc '
    export PATH="/pnpm/bin:${PATH}"
    export npm_config_verify_deps_before_run=false
    export npm_config_store_dir=/app/.pnpm-store
    mkdir -p "$XDG_CACHE_HOME" "$npm_config_store_dir"
    if [ ! -f .npmrc ] || [ -w .npmrc ]; then
      cp .github/docker/.npmrc.ci .npmrc
    fi

    CLASP_AUTH_DIR="/app/.config/clasp"
    CLASP_AUTH_FILE="${CLASP_AUTH_DIR}/.clasprc.json"
    if [ ! -f "$CLASP_AUTH_FILE" ] && [ -n "${CLASP_CLIENT_ID:-}" ]; then
      node scripts/materialize-clasp-auth.mjs
    fi
    if [ -f "$CLASP_AUTH_FILE" ]; then
      export clasp_config_auth="$CLASP_AUTH_FILE"
    fi

    pnpm install --frozen-lockfile

    export NODE_OPTIONS="${NODE_OPTIONS} --require /app/scripts/fetch-patch.cjs"

    if [ "${CI:-}" = "true" ]; then
      echo "--- Testing connectivity to Google APIs ---"
      curl -sSf --connect-timeout 10 --max-time 15 "https://script.googleapis.com/robots.txt" 2>&1 || echo "curl exit code: $?"
      echo "--- Connectivity test done ---"
    fi

    exec "$@"
  ' _ "$@"
