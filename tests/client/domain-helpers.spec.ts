import { describe, expect, it } from "vitest";
import { cell } from "@domain/appsheet-row-utils";
import { mapExtinguisherRow } from "@domain/extinguisher-mapper";
import { countEppThisMonth, countRecentEpp } from "@domain/epp-utils";
import {
  isOpenInspectionStatus,
  trendsByArea,
} from "@domain/inspection-utils";

describe("client domain helpers", () => {
  it("reads row cells safely", () => {
    expect(cell({ code: " EXT-1 " }, "code")).toBe("EXT-1");
    expect(cell({}, "missing")).toBe("");
  });

  it("maps extinguisher rows", () => {
    const item = mapExtinguisherRow({
      code: "EXT-1",
      location: "Plant",
      type: "PQS",
      last_recharge: "2025-01-01",
      next_recharge: "2026-06-10",
    });

    expect(item.code).toBe("EXT-1");
    expect(item.status).toBe("Vencido");
  });

  it("counts EPP deliveries in the current month", () => {
    const count = countEppThisMonth(
      [{ date: "2026-06-05" }, { date: "2026-05-01" }, { date: "" }],
      new Date("2026-06-22"),
    );
    expect(count).toBe(1);
  });

  it("caps recent EPP count", () => {
    expect(countRecentEpp(12, 5)).toBe(5);
  });

  it("detects open inspection statuses", () => {
    expect(isOpenInspectionStatus("Abierta")).toBe(true);
    expect(isOpenInspectionStatus("closed")).toBe(false);
  });

  it("aggregates inspection trends by area", () => {
    expect(
      trendsByArea([
        { area: "Ops" },
        { area: "Ops" },
        { area: "" },
      ]),
    ).toEqual([
      { label: "Ops", value: 2 },
      { label: "Sin área", value: 1 },
    ]);
  });
});
