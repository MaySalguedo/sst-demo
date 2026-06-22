import { describe, expect, it, vi, afterEach } from "vitest";
import { mapExtinguisherRow } from "@domain/extinguisher-mapper";

describe("extinguisher mapper", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("maps upcoming extinguishers", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-22T12:00:00"));

    const item = mapExtinguisherRow({
      code: "EXT-2",
      location: "Office",
      type: "CO2",
      last_recharge: "2025-01-01",
      next_recharge: "2026-07-01",
    });

    expect(item.status).toBe("Próximo");
  });
});
