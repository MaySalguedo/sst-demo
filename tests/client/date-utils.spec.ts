import { describe, expect, it } from "vitest";
import {
  daysUntil,
  normalizeDate,
  resolveExpirationStatus,
} from "../../src/client/domain/date-utils";

describe("client date-utils", () => {
  const today = new Date("2026-06-22T12:00:00");

  it("normalizes ISO dates", () => {
    expect(normalizeDate("2026-06-22")).toBe("2026-06-22");
  });

  it("normalizes US dates", () => {
    expect(normalizeDate("6/22/2026")).toBe("2026-06-22");
  });

  it("normalizes parseable date strings", () => {
    expect(normalizeDate("June 22, 2026")).toBe("2026-06-22");
  });

  it("returns raw values when parsing fails", () => {
    expect(normalizeDate("not-a-date")).toBe("not-a-date");
  });

  it("returns empty for blank values", () => {
    expect(normalizeDate("")).toBe("");
    expect(normalizeDate("   ")).toBe("");
  });

  it("computes days until a future date", () => {
    expect(daysUntil("2026-06-25", today)).toBe(3);
  });

  it("computes negative days for past dates", () => {
    expect(daysUntil("2026-06-10", today)).toBe(-12);
  });

  it("returns NaN for invalid dates", () => {
    expect(Number.isNaN(daysUntil("", today))).toBe(true);
    expect(Number.isNaN(daysUntil("invalid", today))).toBe(true);
  });

  it("resolves expiration status", () => {
    expect(resolveExpirationStatus(-1)).toBe("Vencido");
    expect(resolveExpirationStatus(10)).toBe("Próximo");
    expect(resolveExpirationStatus(45)).toBe("Vigente");
    expect(resolveExpirationStatus(Number.NaN)).toBe("Vigente");
  });
});
