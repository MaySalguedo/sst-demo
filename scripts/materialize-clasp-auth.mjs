import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  materializeClaspAuth,
  resolveClaspAuthPath,
} from "./lib/clasp-auth.mjs";

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const authFilePath = resolveClaspAuthPath(
  rootDir,
  process.env.CLASP_AUTH_FILE,
);

try {
  const result = materializeClaspAuth({
    authFilePath,
    clientId: process.env.CLASP_CLIENT_ID,
    clientSecret: process.env.CLASP_CLIENT_SECRET,
    refreshToken: process.env.CLASP_REFRESH_TOKEN,
  });

  if (result.created) {
    console.log(`Created clasp auth file at ${result.authFilePath}`);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
