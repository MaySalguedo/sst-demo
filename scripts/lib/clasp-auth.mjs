import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

export const DEFAULT_CLASP_AUTH_RELATIVE_PATH = ".config/clasp/.clasprc.json";

export function resolveClaspAuthPath(rootDir, overridePath) {
  if (overridePath) {
    return path.isAbsolute(overridePath)
      ? overridePath
      : path.join(rootDir, overridePath);
  }

  return path.join(rootDir, DEFAULT_CLASP_AUTH_RELATIVE_PATH);
}

export function buildClaspAuthDocument({
  clientId,
  clientSecret,
  refreshToken,
}) {
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      "CLASP_CLIENT_ID, CLASP_CLIENT_SECRET and CLASP_REFRESH_TOKEN are required.",
    );
  }

  return {
    tokens: {
      default: {
        type: "authorized_user",
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
      },
    },
  };
}

export function materializeClaspAuth({
  authFilePath,
  clientId,
  clientSecret,
  refreshToken,
}) {
  if (existsSync(authFilePath)) {
    return { created: false, authFilePath };
  }

  const document = buildClaspAuthDocument({
    clientId,
    clientSecret,
    refreshToken,
  });

  mkdirSync(path.dirname(authFilePath), { recursive: true });
  writeFileSync(authFilePath, `${JSON.stringify(document, null, 2)}\n`, {
    encoding: "utf8",
    mode: 0o600,
  });

  return { created: true, authFilePath };
}

export function readClaspAuthDocument(authFilePath) {
  return JSON.parse(readFileSync(authFilePath, "utf8"));
}
