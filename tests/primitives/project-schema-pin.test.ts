/**
 * A8.1 — ProjectSchemaPin primitive tests
 */

import { describe, test, expect } from "bun:test";
import {
  projectSchemaPinRid,
  ProjectSchemaPinRegistry,
  type ProjectSchemaPinDeclaration,
} from "../../ontology/primitives/project-schema-pin";

const makeDecl = (id: string): ProjectSchemaPinDeclaration => ({
  rid: projectSchemaPinRid(id),
  projectRid: "palantir-math",
  pinnedSchema: "^1.13.0",
  installedSchema: "1.13.1",
  compatibilityVerdict: "compatible",
  lastResolvedAt: "2026-04-19T00:00:00Z",
});

describe("ProjectSchemaPin — Rid brand", () => {
  test("rid helper round-trip", () => {
    expect(String(projectSchemaPinRid("pin:palantir-math"))).toBe("pin:palantir-math");
  });
});

describe("ProjectSchemaPin — Registry", () => {
  test("register + get + list round-trip", () => {
    const reg = new ProjectSchemaPinRegistry();
    const decl = makeDecl("pin-1");
    reg.register(decl);
    expect(reg.get(decl.rid)).toBe(decl);
    expect(reg.list()).toHaveLength(1);
  });

  test("verify delegates to the injected verifier and registers the result", () => {
    const reg = new ProjectSchemaPinRegistry();
    const decl = makeDecl("pin-1");
    const verifier = () => decl;
    const out = reg.verify("/abs/palantir-math", "^1.13.0", verifier);
    expect(out).toBe(decl);
    expect(reg.get(decl.rid)).toBe(decl);
  });
});
