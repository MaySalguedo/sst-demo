import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const claspArgs = process.argv.slice(2);

if (claspArgs.length === 0) {
  console.error("Usage: node scripts/clasp-with-retry.mjs <clasp-args...>");
  process.exit(1);
}

const maxAttempts = Number(process.env.CLASP_RETRY_ATTEMPTS || 3);
const delayMs = Number(process.env.CLASP_RETRY_DELAY_MS || 5000);

function sleep(ms) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    // wait
  }
}

function runClasp() {
  execFileSync("pnpm", ["exec", "clasp", ...claspArgs], {
    cwd: rootDir,
    stdio: "inherit",
    env: process.env,
  });
}

for (let attempt = 1; attempt <= maxAttempts; attempt++) {
  try {
    runClasp();
    process.exit(0);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (attempt >= maxAttempts) {
      console.error(`clasp failed after ${maxAttempts} attempts: ${message}`);
      process.exit(1);
    }

    console.error(
      `clasp failed (attempt ${attempt}/${maxAttempts}): ${message}. Retrying in ${delayMs}ms...`,
    );
    sleep(delayMs);
  }
}
