/**
 * A8.1 — PluginManifest primitive tests
 */

import { describe, test, expect } from "bun:test";
import {
  pluginManifestRid,
  PluginManifestRegistry,
  type PluginManifestDeclaration,
} from "../../ontology/primitives/plugin-manifest";
import {
  hookEventAllowlistRid,
  HookEventAllowlistRegistry,
  type HookEventAllowlistDeclaration,
} from "../../ontology/primitives/hook-event-allowlist";

const makeManifest = (id: string): PluginManifestDeclaration => ({
  rid: pluginManifestRid(id),
  name: "palantir-mini",
  version: "1.3.0",
  requiresClaudeCodeVersion: ">=2.1.113",
  compatibleSchemaVersions: "^1.13.0",
  mcpServers: {
    "palantir-mini": { type: "stdio", command: "bun", args: ["run", "bridge/mcp-server.ts"] },
  },
  hooks: [
    { event: "SessionStart", handler: "hooks/session-start.ts" },
  ],
});

const makeAllowlist = (v: string): HookEventAllowlistDeclaration => ({
  rid: hookEventAllowlistRid(`al:${v}`),
  forCCVersion: v,
  validEvents: new Set(["SessionStart", "UserPromptSubmit"]),
  deprecatedEvents: [],
});

describe("PluginManifest — Rid brand", () => {
  test("rid helper round-trip", () => {
    expect(String(pluginManifestRid("pm:1"))).toBe("pm:1");
  });
});

describe("PluginManifest — Registry", () => {
  test("register + get + list round-trip", () => {
    const reg = new PluginManifestRegistry();
    const decl = makeManifest("pm-1");
    reg.register(decl);
    expect(reg.get(decl.rid)).toBe(decl);
    expect(reg.list()).toHaveLength(1);
  });

  test("validate surfaces valid hook events", () => {
    const reg = new PluginManifestRegistry();
    const decl = makeManifest("pm-1");
    reg.register(decl);
    const allowReg = new HookEventAllowlistRegistry();
    allowReg.register(makeAllowlist("2.1.113"));
    const result = reg.validate(decl.rid, "2.1.113", allowReg, {
      readEvents: () => ["SessionStart"],
    });
    expect(result.hookEvents.invalidEvents).toHaveLength(0);
    expect(result.structural).toHaveLength(0);
  });

  test("validate reports missing manifest", () => {
    const reg = new PluginManifestRegistry();
    const allowReg = new HookEventAllowlistRegistry();
    allowReg.register(makeAllowlist("2.1.113"));
    const result = reg.validate(
      pluginManifestRid("pm-missing"),
      "2.1.113",
      allowReg,
      { readEvents: () => [] },
    );
    expect(result.structural.length).toBeGreaterThan(0);
  });
});
