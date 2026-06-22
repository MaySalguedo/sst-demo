import { describe, expect, it, vi, afterEach } from "vitest";
import { buildAlertsFromEntities } from "@domain/alert-builder";
import { cell } from "@domain/appsheet-row-utils";
import { countEppThisMonth, countRecentEpp } from "@domain/epp-utils";
import {
  isOpenInspectionStatus,
  trendsByArea,
} from "@domain/inspection-utils";

describe("server domain helpers", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("builds alerts from domain entities", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-22T12:00:00"));

    const alerts = buildAlertsFromEntities(
      [
        {
          id: "EMP-1",
          name: "Ana",
          area: "Ops",
          email: "ana@demo.com",
          medicalExamExpires: "2026-06-10",
          status: "Vencido",
        },
      ],
      [
        {
          code: "EXT-1",
          location: "Plant",
          type: "PQS",
          lastRecharge: "2025-01-01",
          nextRecharge: "2026-07-01",
          status: "Próximo",
        },
      ],
      30,
    );

    expect(alerts).toHaveLength(2);
  });

  it("skips entities outside the alert window", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-22T12:00:00"));

    const alerts = buildAlertsFromEntities(
      [
        {
          id: "EMP-2",
          name: "Bob",
          area: "QA",
          email: "bob@demo.com",
          medicalExamExpires: "2027-01-01",
          status: "Vigente",
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

    const alerts = buildAlertsFromEntities(
      [],
      [
        {
          code: "EXT-9",
          location: "Office",
          type: "CO2",
          lastRecharge: "2025-01-01",
          nextRecharge: "2027-01-01",
          status: "Vigente",
        },
      ],
      30,
    );

    expect(alerts).toHaveLength(0);
  });

  it("reads AppSheet row cells", () => {
    expect(cell({ employee_id: "EMP-1" }, "employee_id")).toBe("EMP-1");
    expect(cell({}, "missing")).toBe("");
  });

  it("counts EPP rows for the month", () => {
    expect(
      countEppThisMonth([{ date: "2026-06-01" }], new Date("2026-06-15")),
    ).toBe(1);
    expect(
      countEppThisMonth([{ date: "" }], new Date("2026-06-15")),
    ).toBe(0);
  });

  it("limits recent EPP totals", () => {
    expect(countRecentEpp(2, 5)).toBe(2);
  });

  it("evaluates inspection helpers", () => {
    expect(isOpenInspectionStatus("pending")).toBe(true);
    expect(isOpenInspectionStatus("closed")).toBe(false);
    expect(trendsByArea([{ area: "QA" }])).toEqual([{ label: "QA", value: 1 }]);
    expect(trendsByArea([{ area: "" }])).toEqual([
      { label: "Sin área", value: 1 },
    ]);
  });
});
