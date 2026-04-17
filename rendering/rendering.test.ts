/**
 * Rendering Schema Validation Tests (Axis 3)
 *
 * Verifies well-formedness and internal consistency of all
 * rendering HC/DH constants. Parallel to:
 *   schemas/ontology/*.test.ts  (Axis 1: backend)
 *   schemas/interaction/*.test.ts (Axis 2: frontend interaction)
 *
 * Run: bun test ~/.claude/schemas/rendering/rendering.test.ts
 */

import { describe, test, expect } from "bun:test";

import { RENDERING_AUTHORITY, RENDERER_MATERIAL_MATRIX, CDN_DEPENDENCY_RULE, SCHEMA_VERSION } from "./semantics";
import { MATERIAL_HARD_CONSTRAINTS } from "./materials/schema";
import { PIPELINE_HARD_CONSTRAINTS } from "./pipeline/schema";
import { SCENE_HARD_CONSTRAINTS } from "./scene/schema";
import { PERFORMANCE_HARD_CONSTRAINTS } from "./performance/schema";
import type { RenderingHardConstraint, RenderingDomain } from "./types";

// ─── Collect all HC constants ─────────────────────────────────

const ALL_CONSTRAINTS: RenderingHardConstraint[] = [
  ...MATERIAL_HARD_CONSTRAINTS,
  ...PIPELINE_HARD_CONSTRAINTS,
  ...SCENE_HARD_CONSTRAINTS,
  ...PERFORMANCE_HARD_CONSTRAINTS,
];

// ─── Tests ────────────────────────────────────────────────────

describe("Rendering Schema — Structural Validation", () => {
  test("schema version is valid semver", () => {
    expect(SCHEMA_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
  });

  test("RENDERING_AUTHORITY.totalConstants matches actual count", () => {
    expect(ALL_CONSTRAINTS.length).toBe(RENDERING_AUTHORITY.totalConstants);
  });

  test("subdomain counts match actual per-domain counts", () => {
    const domainCounts: Record<string, number> = {};
    for (const hc of ALL_CONSTRAINTS) {
      const domain = hc.domain;
      domainCounts[domain] = (domainCounts[domain] ?? 0) + 1;
    }

    for (const sub of RENDERING_AUTHORITY.subdomains) {
      expect(domainCounts[sub.name] ?? 0).toBe(sub.count);
    }
  });

  test("all HC IDs follow naming convention HC-RENDER-{DOMAIN}-{NN}", () => {
    const pattern = /^HC-RENDER-(MAT|PIPE|SC|PERF)-\d{2}$/;
    for (const hc of ALL_CONSTRAINTS) {
      expect(hc.id).toMatch(pattern);
    }
  });

  test("all HC IDs are unique", () => {
    const ids = ALL_CONSTRAINTS.map(hc => hc.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test("all HC constants have severity 'error' or 'warn'", () => {
    for (const hc of ALL_CONSTRAINTS) {
      expect(["error", "warn", "info"]).toContain(hc.severity);
    }
  });

  test("all HC constants have valid domain", () => {
    const validDomains: (RenderingDomain | "cross")[] = [
      "materials", "pipeline", "scene", "performance", "cross"
    ];
    for (const hc of ALL_CONSTRAINTS) {
      expect(validDomains).toContain(hc.domain);
    }
  });
});

describe("Rendering Schema — ConstraintContext Completeness", () => {
  test("all HC constants have required context fields", () => {
    for (const hc of ALL_CONSTRAINTS) {
      expect(hc.context).toBeDefined();
      expect(hc.context.mechanism).toBeTruthy();
      expect(hc.context.antiPattern).toBeTruthy();
      expect(hc.context.correctPattern).toBeTruthy();
      expect(hc.context.evidence).toBeTruthy();
    }
  });

  test("all HC constants have detectionSignal in context", () => {
    for (const hc of ALL_CONSTRAINTS) {
      expect(hc.context.detectionSignal).toBeTruthy();
    }
  });

  test("evidence references mathcrew project", () => {
    for (const hc of ALL_CONSTRAINTS) {
      expect(hc.context.evidence?.toLowerCase()).toContain("mathcrew");
    }
  });
});

describe("Rendering Schema — Cross-Domain Constants", () => {
  test("RENDERER_MATERIAL_MATRIX has webgpu and webgl2 entries", () => {
    expect(RENDERER_MATERIAL_MATRIX.webgpu).toBeDefined();
    expect(RENDERER_MATERIAL_MATRIX.webgl2).toBeDefined();
  });

  test("WebGPU forbids ShaderMaterial", () => {
    expect(RENDERER_MATERIAL_MATRIX.webgpu.forbidden).toContain("ShaderMaterial");
  });

  test("WebGPU allows NodeMaterial variants", () => {
    const allowed = RENDERER_MATERIAL_MATRIX.webgpu.allowed;
    expect(allowed).toContain("MeshToonNodeMaterial");
    expect(allowed).toContain("MeshStandardNodeMaterial");
    expect(allowed).toContain("MeshPhysicalNodeMaterial");
    expect(allowed).toContain("MeshBasicNodeMaterial");
  });

  test("CDN_DEPENDENCY_RULE has alternatives for all forbidden patterns", () => {
    expect(CDN_DEPENDENCY_RULE.forbidden.length).toBeGreaterThan(0);
    expect(CDN_DEPENDENCY_RULE.alternatives.hdri).toBeTruthy();
    expect(CDN_DEPENDENCY_RULE.alternatives.fonts).toBeTruthy();
    expect(CDN_DEPENDENCY_RULE.alternatives.textures).toBeTruthy();
  });
});

describe("Rendering Schema — Numeric Integrity", () => {
  test("materials domain has exactly 5 HC constants", () => {
    expect(MATERIAL_HARD_CONSTRAINTS.length).toBe(5);
  });

  test("pipeline domain has exactly 5 HC constants", () => {
    expect(PIPELINE_HARD_CONSTRAINTS.length).toBe(5);
  });

  test("scene domain has exactly 4 HC constants", () => {
    expect(SCENE_HARD_CONSTRAINTS.length).toBe(4);
  });

  test("performance domain has exactly 6 HC constants", () => {
    expect(PERFORMANCE_HARD_CONSTRAINTS.length).toBe(6);
  });

  test("total HC count is 20", () => {
    expect(ALL_CONSTRAINTS.length).toBe(20);
  });
});
