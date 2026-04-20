/**
 * A8.1 — CodegenHeaderContract primitive tests
 */

import { describe, test, expect } from "bun:test";
import {
  codegenHeaderContractRid,
  CodegenHeaderContractRegistry,
  DEFAULT_CONTRACT,
  type CodegenHeaderContractDeclaration,
} from "../../ontology/primitives/codegen-header-contract";

describe("CodegenHeaderContract — Rid brand", () => {
  test("rid helper round-trip", () => {
    expect(String(codegenHeaderContractRid("contract:x"))).toBe("contract:x");
  });
});

describe("CodegenHeaderContract — DEFAULT_CONTRACT", () => {
  test("declares the 4 canonical required fields", () => {
    expect(DEFAULT_CONTRACT.requiredFields).toEqual([
      "schemaVersion",
      "ontologyHash",
      "generatorVersion",
      "timestamp",
    ]);
  });
});

describe("CodegenHeaderContract — Registry", () => {
  test("register + get + list round-trip", () => {
    const reg = new CodegenHeaderContractRegistry();
    reg.register(DEFAULT_CONTRACT);
    expect(reg.get(DEFAULT_CONTRACT.rid)).toBe(DEFAULT_CONTRACT);
    expect(reg.list()).toHaveLength(1);
  });

  test("validate flags missing required fields", () => {
    const reg = new CodegenHeaderContractRegistry();
    reg.register(DEFAULT_CONTRACT);
    const result = reg.validate(
      DEFAULT_CONTRACT.rid,
      "/abs/generated.ts",
      () => "// @generated { schemaVersion: 1.13.0 }\nexport const x = 1;",
    );
    expect(result.valid).toBe(false);
    expect(result.missingFields).toContain("ontologyHash");
    expect(result.missingFields).toContain("generatorVersion");
    expect(result.missingFields).toContain("timestamp");
  });

  test("validate passes when all required fields are present", () => {
    const reg = new CodegenHeaderContractRegistry();
    reg.register(DEFAULT_CONTRACT);
    const header = "// @generated { schemaVersion: 1.13.0, ontologyHash: abc, generatorVersion: 1.0, timestamp: 2026-04-19 }";
    const result = reg.validate(
      DEFAULT_CONTRACT.rid,
      "/abs/generated.ts",
      () => `${header}\nexport const x = 1;`,
    );
    expect(result.valid).toBe(true);
    expect(result.missingFields).toHaveLength(0);
  });

  test("validate returns no-contract when rid unknown", () => {
    const reg = new CodegenHeaderContractRegistry();
    const result = reg.validate(
      codegenHeaderContractRid("unknown"),
      "/abs/generated.ts",
      () => "",
    );
    expect(result.valid).toBe(false);
    expect(result.missingFields).toContain("<no-contract>");
  });
});
