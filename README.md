<div align="center">

# 🦺 SST Demo Hub

Occupational health and safety (SST) management hub for the **Human and Organizational Development (DHO)** area — KPIs, automated alerts, AppSheet forms, and Looker Studio dashboards on a native AppSheet database.

<p>
  <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB"/>
  <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white"/>
  <img src="https://img.shields.io/badge/tailwindcss-%2306B6D4.svg?style=for-the-badge&logo=tailwindcss&logoColor=white"/>
  <img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"/>
  <img src="https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white"/>
</p>
<p>
  <img src="https://img.shields.io/badge/Google%20Apps%20Script-4285F4?style=for-the-badge&logo=google&logoColor=white"/>
  <img src="https://img.shields.io/badge/AppSheet-4285F4?style=for-the-badge&logo=google&logoColor=white"/>
  <img src="https://img.shields.io/badge/Looker%20Studio-4285F4?style=for-the-badge&logo=looker&logoColor=white"/>
  <img src="https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white"/>
  <img src="https://img.shields.io/badge/GitHub%20Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white"/>
  <img src="https://img.shields.io/badge/vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white"/>
  <img src="https://img.shields.io/badge/eslint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white"/>
  <img src="https://img.shields.io/badge/license-MIT-green?style=for-the-badge"/>
</p>

</div>

---

## ✨ Highlights

- **React 19 + TypeScript + Vite + Tailwind CSS 4** — single-page app bundled as one HTML file for Google Apps Script
- **Hexagonal architecture** — component-oriented client (`src/client`) and module-oriented server (`src/server`)
- **AppSheet REST API** — live data for employees, PPE deliveries, inspections, and extinguishers
- **Local dev with real data** — Vite proxy keeps the access key off the browser
- **Automated SST alerts** — Gmail notifications via Apps Script `MailApp`
- **Looker Studio embed** — executive dashboards inside the hub
- **CI/CD** — sequential Docker-based GitHub Actions (audit → lint → check → coverage → deploy)

## 🏗 Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│  React Web App (Vite → single index.html)                   │
│  gasSstGateway │ appsheetLocalGateway (Vite proxy)                 │
└───────────────────────────┬─────────────────────────────────┘
                            │ google.script.run (deployed)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  Apps Script server (esbuild → code.js / api.js)            │
│  Use cases → AppSheet repositories → UrlFetchApp API          │
└───────────────────────────┬─────────────────────────────────┘
                            │ Find action
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  AppSheet native database                                   │
└─────────────────────────────────────────────────────────────┘
```

## 🧰 Tech stack

| Layer        | Technology                                   |
| ------------ | -------------------------------------------- |
| UI           | React 19, Tailwind CSS 4, Lucide React       |
| Client build | Vite, vite-plugin-singlefile                 |
| Server       | Google Apps Script (V8), esbuild             |
| Data         | AppSheet REST API                            |
| Dashboards   | Looker Studio (embedded)                     |
| Forms        | AppSheet mobile / web forms                  |
| Deploy       | clasp                                        |
| CI/CD        | GitHub Actions, Docker, [act](https://github.com/nektos/act) |
| Tests        | Vitest + v8 coverage (90% gate on `develop`)  |

## 📋 Prerequisites

- Node.js **24+**
- pnpm **11.8+** (`corepack enable`)
- Google account with Apps Script and AppSheet access
- **Apps Script API** enabled ([User Settings](https://script.google.com/home/usersettings)) — required for `clasp run` / `sync:properties`
- AppSheet app with **API enabled** (Settings → Integrations → Enable)
- Looker Studio report with **embedding enabled** (File → Embed report)

## 🚀 Quick start

### 1. Clone and install

```bash
git clone https://github.com/MaySalguedo/sst-demo.git
cd sst-demo
pnpm install
```

### 2. Environment variables

Copy the examples and fill in your values:

```bash
cp .env.example .env
cp .vars.example .vars
cp .secrets.example .secrets
```

| Variable              | Description                                       |
| --------------------- | ------------------------------------------------- |
| `APPSHEET_APP_ID`     | AppSheet app UUID (Integrations tab)              |
| `APPSHEET_ACCESS_KEY` | Application access key (`V2-…`)                   |
| `APPSHEET_REGION`     | API base URL (usually `https://www.appsheet.com`) |
| `APPSHEET_DB_URL`     | AppSheet database share URL (UI links)            |
| `LOOKER_REPORT_URL`   | Looker Studio report URL                          |
| `LOOKER_EMBED_URL`    | Looker embed URL (`/embed/reporting/…`)           |
| `ALERT_DAYS_BEFORE`   | Alert window in days (default `30`)               |
| `EMAIL_SST`           | SST notification recipient                        |
| `CD_SYNC_TOKEN`       | Token for CD/local sync of Script Properties      |

Local development reads `.env` for the Vite AppSheet proxy. Production runtime config is stored in **Apps Script Script Properties**, not embedded in `code.js`.

### 2b. clasp credentials (deploy / CD)

clasp reads OAuth credentials from a **local file**, not from a JSON environment variable.

```bash
pnpm exec clasp login
mkdir -p .config/clasp
cp ~/.clasprc.json .config/clasp/.clasprc.json
```

See [`.config/clasp/.clasprc.json.example`](.config/clasp/.clasprc.json.example) for the expected v3 format. The real file is gitignored.

For CI, GitHub stores three separate secrets (`CLASP_CLIENT_ID`, `CLASP_CLIENT_SECRET`, `CLASP_REFRESH_TOKEN`); CD runs `pnpm run clasp:auth` to materialize the same file before deploy.

**One-time migration:** open your existing `.clasprc.json` and copy:

| JSON path | GitHub Secret |
| --------- | ------------- |
| `tokens.default.client_id` | `CLASP_CLIENT_ID` |
| `tokens.default.client_secret` | `CLASP_CLIENT_SECRET` |
| `tokens.default.refresh_token` | `CLASP_REFRESH_TOKEN` |

### 3. Local development (real AppSheet data)

```bash
pnpm dev
```

Open `http://localhost:5173`. Requires `APPSHEET_APP_ID` and `APPSHEET_ACCESS_KEY` in `.env`; the app uses the **local AppSheet gateway** (Vite proxy at `/appsheet-proxy/*`).

### 4. Production deploy

```bash
pnpm deploy              # build + clasp push (no secrets in bundle when BUILD_PROFILE=production)
pnpm run sync:properties # write GitHub/.env values to Script Properties via clasp run
```

For local deploys, set `CD_SYNC_TOKEN` and the runtime variables in `.env` or your shell before running `sync:properties`.

CD on `main` runs both steps automatically: deploy with `BUILD_PROFILE=production`, then sync Script Properties.

Then create or update the **Web App** deployment in Apps Script (Execute as: user deploying the app; access: anyone with the link).

## 📜 NPM scripts

| Script               | Description                                          |
| -------------------- | ---------------------------------------------------- |
| `pnpm dev`           | Vite dev server with AppSheet proxy                  |
| `pnpm build`         | Build client + server into `dist/`                   |
| `pnpm deploy`        | Build and push to Apps Script via clasp              |
| `pnpm clasp:auth`    | Materialize `.config/clasp/.clasprc.json` from env     |
| `pnpm sync:properties` | Sync runtime config to Script Properties via clasp run |
| `pnpm check`         | TypeScript check (client + server)                   |
| `pnpm lint`          | ESLint                                               |
| `pnpm audit`         | Dependency vulnerability audit                       |
| `pnpm test`          | Run Vitest unit tests                                |
| `pnpm test:cov`      | Tests with **90%** coverage gate                     |
| `pnpm template`      | Generate `sst-demo-template.xlsx` (reference schema) |

## 🗄 AppSheet schema

Tables and columns use **snake_case**:

| Table            | Key columns                                                                   |
| ---------------- | ----------------------------------------------------------------------------- |
| `employees`      | `employee_id`, `full_name`, `area`, `email`, `medical_exam_expiry`, `status` |
| `ppe_deliveries` | `delivery_id`, `date`, `employee_id`, `items`, `quantity`, …                  |
| `inspections`    | `inspection_id`, `date`, `area`, `type`, `findings`, `risk_level`, `status`   |
| `extinguishers`  | `code`, `location`, `type`, `last_recharge`, `next_recharge`, `status`      |

Run `pnpm template` to generate a reference Excel file importable into Google Sheets / AppSheet.

## 📁 Project structure

```text
src/
├── client/                    # React SPA (hexagonal, component-oriented)
│   ├── app/
│   │   ├── components/        # One component per folder (*.component.tsx)
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── providers/
│   ├── domain/                # Types, date utils, alert builders
│   └── infra/adapters/        # gas and local AppSheet gateways
└── server/                    # Apps Script backend (hexagonal, modules)
    ├── modules/               # Use cases (alerts, config, dashboard, setup)
    ├── infra/adapters/        # AppSheet API, mail, properties store
    └── shared/domain/         # Constants, models, pure domain logic
scripts/                       # esbuild / Vite helpers, template generator
tests/                         # Vitest suites (client + server domain)
.github/
├── docker/                    # Shared CI/CD Docker image + runner script
├── events/                    # act event payloads per branch/scenario
└── workflows/                 # CI and CD pipelines
```

## 🔄 CI pipeline (`CI` workflow)

Runs on **every push and pull request** as a **sequential pipeline** (each job depends on the previous one):

| Job      | Depends on | Branches / context                       | Command                  |
| -------- | ---------- | ---------------------------------------- | ------------------------ |
| Audit    | —          | All                                      | `pnpm run audit`         |
| Lint     | Audit      | All                                      | `pnpm run lint`          |
| Check    | Lint       | `main`, `develop`, or PRs targeting them | `pnpm run check`         |
| Coverage | Check      | `develop` only (push or PR)              | `pnpm run test:cov`      |

All jobs run through `.github/docker/run.sh`, which builds and executes commands inside the shared CI image defined in `.github/docker/Dockerfile`.

## 🚢 CD pipeline (`CD` workflow)

Triggered only on **`main`**:

- Manual **workflow_dispatch** (from the `main` branch)
- Successful completion of the **CI** workflow on `main`

Steps: materialize clasp auth → `pnpm run deploy` with `BUILD_PROFILE=production` → `pnpm run sync:properties` (two sequential jobs via the Docker runner).

Runtime configuration (AppSheet credentials, Looker URLs, alert settings) is written to **Script Properties** on every CD run. It is not baked into the pushed `code.js` bundle.

### GitHub configuration

**Repository variables** (`.vars.example`):

- `NODE_VERSION`, `PNPM_VERSION`
- `APPSHEET_REGION`, `APPSHEET_DB_URL`
- `LOOKER_REPORT_URL`, `LOOKER_EMBED_URL`
- `ALERT_DAYS_BEFORE`, `EMAIL_SST`

**Repository secrets** (`.secrets.example`):

- `APPSHEET_APP_ID`
- `APPSHEET_ACCESS_KEY`
- `CD_SYNC_TOKEN` (random 32+ char token; bootstrapped into Script Properties on first sync)
- `CLASP_CLIENT_ID` (from `tokens.default.client_id` in `.clasprc.json`)
- `CLASP_CLIENT_SECRET` (from `tokens.default.client_secret`)
- `CLASP_REFRESH_TOKEN` (from `tokens.default.refresh_token`)

### Test workflows locally with act

For **CD**, place your clasp credentials at `.config/clasp/.clasprc.json` before running act (the materialize step skips if the file already exists). CI secrets in `.secrets` are only needed when testing the materialize step without a local auth file.

Use the event payloads under `.github/events/` with `--eventpath`:

```bash
# CI on main (audit → lint → check)
act push -W .github/workflows/ci.yml \
  --eventpath .github/events/push-main.json \
  --var-file .vars \
  --secret-file .secrets

# CI on develop (includes coverage)
act push -W .github/workflows/ci.yml \
  --eventpath .github/events/push-develop.json \
  --var-file .vars \
  --secret-file .secrets

# CI on a feature branch (audit → lint only)
act push -W .github/workflows/ci.yml \
  --eventpath .github/events/push-feature.json \
  --var-file .vars \
  --secret-file .secrets

# CD on main (manual)
act workflow_dispatch -W .github/workflows/cd.yml \
  --eventpath .github/events/workflow-dispatch-main.json \
  --var-file .vars \
  --secret-file .secrets

# CD after successful CI on main
act workflow_run -W .github/workflows/cd.yml \
  --eventpath .github/events/workflow-run-success-main.json \
  --var-file .vars \
  --secret-file .secrets
```

Run a single job locally with the shared Docker runner:

```bash
bash .github/docker/run.sh pnpm run check
```

## 📊 Looker Studio embedding

1. Open the report in **Edit** mode.
2. **File → Embed report** → enable embedding.
3. Set sharing to **Anyone with the link** (Viewer).
4. Copy the `/embed/reporting/{id}/page/{pageId}` URL into `LOOKER_EMBED_URL`.

## 📄 License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

<div align="center">

Made for SST / DHO demo purposes · [MaySalguedo/sst-demo](https://github.com/MaySalguedo/sst-demo)

</div>
