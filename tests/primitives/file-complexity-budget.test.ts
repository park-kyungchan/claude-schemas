/**
 * A8.1 — FileComplexityBudget primitive tests
 */

import { describe, test, expect } from "bun:test";
import {
  fileComplexityBudgetRid,
  FileComplexityBudgetRegistry,
  ONTOLOGY_FILE_BUDGET,
  PRIMITIVE_FILE_BUDGET,
  HANDLER_FILE_BUDGET,
  type FileComplexityBudgetDeclaration,
} from "../../ontology/primitives/file-complexity-budget";

const makeDecl = (id: string, maxLines: number): FileComplexityBudgetDeclaration => ({
  rid: fileComplexityBudgetRid(id),
  pathGlob: "**/foo/*.ts",
  maxLines,
});

describe("FileComplexityBudget — Rid brand", () => {
  test("rid helper round-trip", () => {
    expect(String(fileComplexityBudgetRid("budget:1"))).toBe("budget:1");
  });
});

describe("FileComplexityBudget — defaults", () => {
  test("default budgets are non-empty and have valid globs", () => {
    expect(ONTOLOGY_FILE_BUDGET.maxLines).toBeGreaterThan(0);
    expect(PRIMITIVE_FILE_BUDGET.maxLines).toBeGreaterThan(0);
    expect(HANDLER_FILE_BUDGET.maxLines).toBeGreaterThan(0);
    expect(ONTOLOGY_FILE_BUDGET.pathGlob).toContain("ontology");
  });
});

describe("FileComplexityBudget — Registry", () => {
  test("register + get + list round-trip", () => {
    const reg = new FileComplexityBudgetRegistry();
    const decl = makeDecl("b-1", 600);
    reg.register(decl);
    expect(reg.get(decl.rid)).toBe(decl);
    expect(reg.list()).toHaveLength(1);
  });

  test("scan flags files over budget", () => {
    const reg = new FileComplexityBudgetRegistry();
    reg.register(makeDecl("b-1", 100));
    const results = reg.scan("/project", () => [
      { file: "/project/foo/a.ts", lines: 50 },
      { file: "/project/foo/b.ts", lines: 150 },
    ]);
    expect(results).toHaveLength(2);
    expect(results.find((r) => r.file.endsWith("a.ts"))!.over).toBe(false);
    expect(results.find((r) => r.file.endsWith("b.ts"))!.over).toBe(true);
  });
});
