/**
 * A8.1 — LineageConformancePolicy primitive tests
 */

import { describe, test, expect } from "bun:test";
import {
  lineageConformancePolicyRid,
  LineageConformancePolicyRegistry,
  DEFAULT_POLICY,
  SESSION_STARTED_POLICY,
  ALL_LINEAGE_DIMENSIONS,
  type LineageConformancePolicyDeclaration,
  type LineageDimension,
} from "../../ontology/primitives/lineage-conformance-policy";

describe("LineageConformancePolicy — Rid brand", () => {
  test("rid helper round-trip", () => {
    expect(String(lineageConformancePolicyRid("policy:x"))).toBe("policy:x");
  });
});

describe("LineageConformancePolicy — defaults", () => {
  test("DEFAULT_POLICY requires all 5 dimensions", () => {
    expect(DEFAULT_POLICY.requiredDims.size).toBe(ALL_LINEAGE_DIMENSIONS.length);
    expect(DEFAULT_POLICY.enforcement).toBe("hard");
  });

  test("SESSION_STARTED_POLICY exempts withWhat", () => {
    expect(SESSION_STARTED_POLICY.requiredDims.has("withWhat" as LineageDimension)).toBe(false);
  });
});

describe("LineageConformancePolicy — Registry", () => {
  test("register + get + list round-trip", () => {
    const reg = new LineageConformancePolicyRegistry();
    reg.register(DEFAULT_POLICY);
    reg.register(SESSION_STARTED_POLICY);
    expect(reg.get("session_started")).toBe(SESSION_STARTED_POLICY);
    expect(reg.list()).toHaveLength(2);
  });

  test("audit flags events missing required dimensions", () => {
    const reg = new LineageConformancePolicyRegistry();
    reg.register(DEFAULT_POLICY);
    const report = reg.audit([
      { type: "edit_committed", when: "2026-04-19", atopWhich: "sha", throughWhich: "claude-code", byWhom: { identity: "user" }, withWhat: "reasoning" },
      { type: "edit_committed", when: "2026-04-19" },
    ]);
    expect(report.eventsScanned).toBe(2);
    expect(report.violations).toHaveLength(1);
    expect(report.violations[0]!.missingDims.length).toBeGreaterThan(0);
  });
});
