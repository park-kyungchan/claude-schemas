/**
 * A8.1 — ManagedSettingsFragment primitive tests
 */

import { describe, test, expect } from "bun:test";
import {
  managedSettingsFragmentRid,
  ManagedSettingsFragmentRegistry,
  type ManagedSettingsFragmentDeclaration,
} from "../../ontology/primitives/managed-settings-fragment";

const makeDecl = (id: string, tools: string[]): ManagedSettingsFragmentDeclaration => ({
  rid: managedSettingsFragmentRid(id),
  fragmentId: `50-${id}`,
  projectRid: "palantir-math",
  permissionRules: tools.map((pattern) => ({ kind: "allow" as const, pattern })),
  checksum: "sha256:abc",
  lastMigratedAt: "2026-04-19T00:00:00Z",
});

describe("ManagedSettingsFragment — Rid brand", () => {
  test("rid helper round-trip", () => {
    expect(String(managedSettingsFragmentRid("frag:x"))).toBe("frag:x");
  });
});

describe("ManagedSettingsFragment — Registry", () => {
  test("register + get + list round-trip", () => {
    const reg = new ManagedSettingsFragmentRegistry();
    const decl = makeDecl("f-1", ["mcp__palantir-mini__emit_event"]);
    reg.register(decl);
    expect(reg.get(decl.rid)).toBe(decl);
    expect(reg.list()).toHaveLength(1);
  });

  test("audit reports missing tools when expected list diverges", () => {
    const reg = new ManagedSettingsFragmentRegistry();
    const decl = makeDecl("f-1", ["mcp__palantir-mini__emit_event"]);
    reg.register(decl);
    const report = reg.audit(decl.rid, [
      "mcp__palantir-mini__emit_event",
      "mcp__palantir-mini__impact_query",
    ]);
    expect(report.drift.length).toBeGreaterThan(0);
    expect(report.drift.some((d) => d.kind === "missing-tool")).toBe(true);
  });

  test("audit returns drift for unregistered fragment", () => {
    const reg = new ManagedSettingsFragmentRegistry();
    const report = reg.audit(
      managedSettingsFragmentRid("frag:missing"),
      [],
    );
    expect(report.drift).toHaveLength(1);
  });
});
