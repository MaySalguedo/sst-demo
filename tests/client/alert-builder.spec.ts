import { describe, expect, it, vi, afterEach } from "vitest";
import { buildAlertsFromRows } from "@domain/alert-builder";

describe("buildAlertsFromRows", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("builds and sorts medical and extinguisher alerts", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-22T12:00:00"));

    const alerts = buildAlertsFromRows(
      [
        {
          employee_id: "EMP-1",
          full_name: "Ana",
          area: "Ops",
          medical_exam_expiry: "2026-06-10",
        },
      ],
      [
        {
          code: "EXT-1",
          location: "Plant",
          next_recharge: "2026-06-30",
        },
      ],
      30,
    );

    expect(alerts).toHaveLength(2);
    expect(alerts[0]?.type).toBe("examen_medico");
    expect(alerts[1]?.type).toBe("extintor");
  });

  it("ignores records outside the alert window", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-22T12:00:00"));

    const alerts = buildAlertsFromRows(
      [
        {
          employee_id: "EMP-2",
          full_name: "Bob",
          area: "QA",
          medical_exam_expiry: "2027-01-01",
        },
      ],
      [],
      30,
    );

    expect(alerts).toHaveLength(0);
  });

  it("skips extinguishers outside the alert window", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-22T12:00:00"));

    const alerts = buildAlertsFromRows(
      [],
      [
        {
          code: "EXT-2",
          location: "Office",
          next_recharge: "2027-01-01",
        },
      ],
      30,
    );

    expect(alerts).toHaveLength(0);
  });
});
