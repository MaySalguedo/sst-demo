import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  buildClaspAuthDocument,
  materializeClaspAuth,
  readClaspAuthDocument,
} from "../../scripts/lib/clasp-auth.mjs";

describe("clasp auth materialization", () => {
  it("builds a clasp v3 auth document", () => {
    const document = buildClaspAuthDocument({
      clientId: "client-id.apps.googleusercontent.com",
      clientSecret: "client-secret",
      refreshToken: "refresh-token",
    });

    expect(document).toEqual({
      tokens: {
        default: {
          type: "authorized_user",
          client_id: "client-id.apps.googleusercontent.com",
          client_secret: "client-secret",
          refresh_token: "refresh-token",
        },
      },
    });
  });

  it("rejects missing oauth values", () => {
    expect(() =>
      buildClaspAuthDocument({
        clientId: "client-id",
        clientSecret: "",
        refreshToken: "refresh-token",
      }),
    ).toThrow(
      "CLASP_CLIENT_ID, CLASP_CLIENT_SECRET and CLASP_REFRESH_TOKEN are required.",
    );
  });

  it("creates an auth file when it does not exist", () => {
    const tempDir = mkdtempSync(path.join(tmpdir(), "sst-clasp-auth-"));
    const authFilePath = path.join(tempDir, ".clasprc.json");

    const result = materializeClaspAuth({
      authFilePath,
      clientId: "client-id",
      clientSecret: "client-secret",
      refreshToken: "refresh-token",
    });

    expect(result.created).toBe(true);
    expect(readClaspAuthDocument(authFilePath)).toEqual(
      buildClaspAuthDocument({
        clientId: "client-id",
        clientSecret: "client-secret",
        refreshToken: "refresh-token",
      }),
    );
  });

  it("overwrites an existing auth file when forced", () => {
    const tempDir = mkdtempSync(path.join(tmpdir(), "sst-clasp-auth-"));
    const authFilePath = path.join(tempDir, ".clasprc.json");
    writeFileSync(authFilePath, '{"tokens":{"default":{"type":"existing"}}}\n');

    const result = materializeClaspAuth({
      authFilePath,
      clientId: "new-client-id",
      clientSecret: "new-client-secret",
      refreshToken: "new-refresh-token",
      force: true,
    });

    expect(result.created).toBe(true);
    expect(readClaspAuthDocument(authFilePath).tokens.default.client_id).toBe(
      "new-client-id",
    );
  });
});
