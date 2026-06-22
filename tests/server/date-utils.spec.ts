import { afterEach, describe, expect, it, vi } from "vitest";
import {
  addDays,
  daysUntil,
  formatDate,
  normalizeDate,
  resolveExpirationStatus,
  startOfMonth,
} from "../../src/server/shared/domain/date-utils";

describe("server date-utils", () => {
  const today = new Date("2026-06-22T12:00:00");

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("normalizes ISO, US and parseable dates", () => {
    expect(normalizeDate("2026-01-05")).toBe("2026-01-05");
    expect(normalizeDate("1/5/2026")).toBe("2026-01-05");
    expect(normalizeDate("January 5, 2026")).toBe("2026-01-05");
    expect(normalizeDate("invalid-date")).toBe("invalid-date");
    expect(normalizeDate("   ")).toBe("");
  });

  it("computes day differences for strings and dates", () => {
    expect(daysUntil("2026-06-22", today)).toBe(0);
    expect(daysUntil("2026-06-23", today)).toBe(1);
    expect(daysUntil(new Date("2026-06-20T00:00:00"), today)).toBe(-2);
  });

  it("resolves expiration buckets", () => {
    expect(resolveExpirationStatus(-2)).toBe("Vencido");
    expect(resolveExpirationStatus(30)).toBe("Próximo");
    expect(resolveExpirationStatus(31)).toBe("Vigente");
  });

  it("formats dates through Apps Script utilities", () => {
    vi.stubGlobal("Utilities", {
      formatDate: () => "2026-06-22",
    });

    expect(formatDate(new Date("2026-06-22"))).toBe("2026-06-22");
  });

  it("adds days and resolves month starts", () => {
    const base = new Date("2026-06-22T00:00:00");
    expect(addDays(base, 3).getDate()).toBe(25);
    expect(startOfMonth(base).getDate()).toBe(1);
  });
});
