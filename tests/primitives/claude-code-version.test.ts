/**
 * A8.1 — ClaudeCodeVersion primitive tests
 */

import { describe, test, expect } from "bun:test";
import {
  claudeCodeVersionRid,
  compareClaudeCodeVersions,
  ClaudeCodeVersionRegistry,
  type ClaudeCodeVersionDeclaration,
} from "../../ontology/primitives/claude-code-version";

const makeDecl = (id: string, v: string): ClaudeCodeVersionDeclaration => ({
  rid: claudeCodeVersionRid(id),
  version: v,
  releasedAt: "2026-04-19T00:00:00Z",
  docsVerifiedAt: "2026-04-19T00:00:00Z",
  requiredByPlugin: ["palantir-mini"],
  features: {
    hookEvents: ["SessionStart", "UserPromptSubmit"],
    slashCommands: ["/help"],
  },
});

describe("ClaudeCodeVersion — Rid brand", () => {
  test("rid helper round-trip", () => {
    expect(String(claudeCodeVersionRid("cc:2.1.113"))).toBe("cc:2.1.113");
  });
});

describe("ClaudeCodeVersion — compareClaudeCodeVersions", () => {
  test("returns 0 for equal versions", () => {
    expect(compareClaudeCodeVersions("2.1.113", "2.1.113")).toBe(0);
  });

  test("returns -1 when a < b", () => {
    expect(compareClaudeCodeVersions("2.1.112", "2.1.113")).toBe(-1);
    expect(compareClaudeCodeVersions("2.0.99", "2.1.0")).toBe(-1);
  });

  test("returns 1 when a > b", () => {
    expect(compareClaudeCodeVersions("2.1.114", "2.1.113")).toBe(1);
    expect(compareClaudeCodeVersions("3.0.0", "2.99.99")).toBe(1);
  });
});

describe("ClaudeCodeVersion — Registry", () => {
  test("register + get + list round-trip", () => {
    const reg = new ClaudeCodeVersionRegistry();
    const decl = makeDecl("cc:2.1.113", "2.1.113");
    reg.register(decl);
    expect(reg.get(decl.rid)).toBe(decl);
    expect(reg.list()).toHaveLength(1);
  });
});
