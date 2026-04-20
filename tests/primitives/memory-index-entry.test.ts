/**
 * A8.1 — MEMORYIndexEntry primitive tests
 */

import { describe, test, expect } from "bun:test";
import {
  memoryIndexEntryRid,
  MEMORYIndexEntryRegistry,
  renderMEMORYIndexEntryLine,
  type MEMORYIndexEntryDeclaration,
} from "../../ontology/primitives/memory-index-entry";

const makeDecl = (id: string): MEMORYIndexEntryDeclaration => ({
  rid: memoryIndexEntryRid(id),
  filePath: "/abs/MEMORY.md",
  title: "Sample",
  hookDescription: "one-line hook",
  targetMdPath: "/abs/sample.md",
  maxLineChars: 150,
  lastCheckedAt: "2026-04-19T00:00:00Z",
});

describe("MEMORYIndexEntry — Rid brand", () => {
  test("rid helper round-trip", () => {
    expect(String(memoryIndexEntryRid("entry:1"))).toBe("entry:1");
  });
});

describe("MEMORYIndexEntry — render", () => {
  test("renders canonical markdown line", () => {
    const line = renderMEMORYIndexEntryLine({
      title: "Sample",
      hookDescription: "one-line hook",
      targetMdPath: "/abs/sample.md",
    });
    expect(line).toBe("- [Sample](sample.md) — one-line hook");
  });
});

describe("MEMORYIndexEntry — Registry", () => {
  test("register + get + list round-trip", () => {
    const reg = new MEMORYIndexEntryRegistry();
    const decl = makeDecl("entry-1");
    reg.register(decl);
    expect(reg.get(decl.rid)).toBe(decl);
    expect(reg.list()).toHaveLength(1);
  });

  test("validate reports target_missing when file does not exist", () => {
    const reg = new MEMORYIndexEntryRegistry();
    reg.register(makeDecl("entry-1"));
    const errors = reg.validate({ fileExists: () => false });
    expect(errors).toHaveLength(1);
    expect(errors[0]!.kind).toBe("target_missing");
  });

  test("validate passes when file exists and line within budget", () => {
    const reg = new MEMORYIndexEntryRegistry();
    reg.register(makeDecl("entry-1"));
    const errors = reg.validate({ fileExists: () => true });
    expect(errors).toHaveLength(0);
  });
});
