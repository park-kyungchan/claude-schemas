/**
 * A8.1 — ResearchDocument primitive tests
 */

import { describe, test, expect } from "bun:test";
import {
  researchDocumentRid,
  ResearchDocumentRegistry,
  type ResearchDocumentDeclaration,
} from "../../ontology/primitives/research-document";

const makeDecl = (id: string): ResearchDocumentDeclaration => ({
  rid: researchDocumentRid(id),
  name: "ontology-model.md",
  path: `/abs/${id}.md`,
  topic: "palantir/ontology",
  lastVerified: "2026-04-19T00:00:00Z",
  staleThresholdDays: 30,
});

describe("ResearchDocument — Rid brand", () => {
  test("rid helper round-trip preserves the string", () => {
    const rid = researchDocumentRid("doc:palantir:ontology-model");
    expect(String(rid)).toBe("doc:palantir:ontology-model");
  });
});

describe("ResearchDocument — Registry", () => {
  test("register + get round-trip", () => {
    const reg = new ResearchDocumentRegistry();
    const decl = makeDecl("doc-1");
    reg.register(decl);
    expect(reg.get(decl.rid)).toBe(decl);
  });

  test("list returns all registered declarations", () => {
    const reg = new ResearchDocumentRegistry();
    reg.register(makeDecl("doc-1"));
    reg.register(makeDecl("doc-2"));
    expect(reg.list()).toHaveLength(2);
  });

  test("get returns undefined for unregistered rid", () => {
    const reg = new ResearchDocumentRegistry();
    expect(reg.get(researchDocumentRid("doc-missing"))).toBeUndefined();
  });
});
