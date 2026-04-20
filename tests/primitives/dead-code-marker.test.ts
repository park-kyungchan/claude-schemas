/**
 * A8.1 — DeadCodeMarker primitive tests
 */

import { describe, test, expect } from "bun:test";
import {
  deadCodeMarkerRid,
  DeadCodeMarkerRegistry,
  type DeadCodeMarkerDeclaration,
} from "../../ontology/primitives/dead-code-marker";

const makeDecl = (id: string): DeadCodeMarkerDeclaration => ({
  rid: deadCodeMarkerRid(id),
  symbolPath: `src/foo.ts#${id}`,
  gatedBy: { kind: "flag", value: "LEGACY" },
  firstGatedAt: "2026-04-01T00:00:00Z",
  reapableAfter: "2026-06-01T00:00:00Z",
});

describe("DeadCodeMarker — Rid brand", () => {
  test("rid helper round-trip", () => {
    expect(String(deadCodeMarkerRid("m:1"))).toBe("m:1");
  });
});

describe("DeadCodeMarker — Registry", () => {
  test("register + get + list round-trip", () => {
    const reg = new DeadCodeMarkerRegistry();
    const decl = makeDecl("m-1");
    reg.register(decl);
    expect(reg.get(decl.rid)).toBe(decl);
    expect(reg.list()).toHaveLength(1);
  });

  test("scan registers markers found by the scanner", () => {
    const reg = new DeadCodeMarkerRegistry();
    const markers = [makeDecl("m-a"), makeDecl("m-b")];
    const out = reg.scan("/project", () => markers);
    expect(out).toHaveLength(2);
    expect(reg.list()).toHaveLength(2);
  });
});
