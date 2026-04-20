/**
 * A8.1 — HookEventAllowlist primitive tests
 */

import { describe, test, expect } from "bun:test";
import {
  hookEventAllowlistRid,
  HookEventAllowlistRegistry,
  KNOWN_INVALID_EVENTS,
  type HookEventAllowlistDeclaration,
} from "../../ontology/primitives/hook-event-allowlist";

const makeDecl = (id: string, v: string): HookEventAllowlistDeclaration => ({
  rid: hookEventAllowlistRid(id),
  forCCVersion: v,
  validEvents: new Set(["SessionStart", "UserPromptSubmit", "PreToolUse", "PostToolUse"]),
  deprecatedEvents: [
    { name: "AgentStart", replacement: "SubagentStart", removedIn: "2.1.0" },
  ],
});

describe("HookEventAllowlist — Rid brand", () => {
  test("rid helper round-trip", () => {
    expect(String(hookEventAllowlistRid("allowlist:2.1.113"))).toBe("allowlist:2.1.113");
  });
});

describe("HookEventAllowlist — KNOWN_INVALID_EVENTS", () => {
  test("contains the 14 known bad event names", () => {
    expect(KNOWN_INVALID_EVENTS).toHaveLength(14);
    expect(KNOWN_INVALID_EVENTS).toContain("MemoryWrite");
    expect(KNOWN_INVALID_EVENTS).toContain("AgentStart");
  });
});

describe("HookEventAllowlist — Registry", () => {
  test("register + get + list round-trip", () => {
    const reg = new HookEventAllowlistRegistry();
    const decl = makeDecl("al-1", "2.1.113");
    reg.register(decl);
    expect(reg.get(decl.rid)).toBe(decl);
    expect(reg.list()).toHaveLength(1);
  });

  test("getByCCVersion returns the allowlist bound to that version", () => {
    const reg = new HookEventAllowlistRegistry();
    const decl = makeDecl("al-1", "2.1.113");
    reg.register(decl);
    expect(reg.getByCCVersion("2.1.113")).toBe(decl);
    expect(reg.getByCCVersion("2.0.0")).toBeUndefined();
  });

  test("validate flags invalid + deprecated event references", () => {
    const reg = new HookEventAllowlistRegistry();
    reg.register(makeDecl("al-1", "2.1.113"));
    const result = reg.validate(["/h.json"], "2.1.113", {
      readEvents: () => ["SessionStart", "MemoryWrite", "AgentStart"],
    });
    expect(result.invalidEvents.some((e) => e.event === "MemoryWrite")).toBe(true);
    expect(result.deprecatedEvents.some((e) => e.event === "AgentStart")).toBe(true);
  });
});
