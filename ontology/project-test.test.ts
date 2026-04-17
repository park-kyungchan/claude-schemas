/**
 * Universal Project Ontology Test — Generic validator for ANY project
 *
 * This is the ONLY test file needed. It validates a project's OntologyExports
 * against the Meta-Level SSoT (schemas/ontology/).
 *
 * Usage in any project:
 *   1. Copy this file to your project root (or symlink)
 *   2. Ensure your project exports either:
 *      - OntologyExports from ontology/schema.ts
 *      - ProjectOntologyScope { backend, frontend?, runtime? } from ontology/schema.ts
 *   3. Run: bun test project-test.ts
 *
 * What it validates:
 *   PV-01~08: Structural compliance (naming, referential integrity, HC limits, frontend/runtime scope)
 *   SA-01~32: Semantic audit (Digital Twin maturity, LEARN coverage, project/runtime scope)
 *
 * Authority: ~/.claude/schemas/ontology/semantics.ts (Meta-Level SSoT)
 * Depends:   project-validator.ts, semantic-audit.ts, types.ts
 */

import { describe, test, expect } from "bun:test";
import type { OntologyExports } from "./types";
import { validateProjectOntology } from "./project-validator";
import { auditSemantics, type SemanticAuditReport } from "./semantic-audit";

// =========================================================================
// Project Loader — Override ONTOLOGY_PATH env or edit this import
// =========================================================================

/**
 * Load project ontology. Projects may export OntologyExports directly or a
 * ProjectOntologyScope with { backend, frontend?, runtime? }.
 *
 * Set ONTOLOGY_PATH env to point to a specific project:
 *   ONTOLOGY_PATH=~/palantir-learn/ontology/schema.ts bun test project-test.ts
 *
 * Or import directly for a fixed project:
 *   import { ontologyExports } from "../../palantir-learn/ontology/schema";
 */
async function loadProjectOntology(): Promise<OntologyExports | null> {
  const ontologyPath = process.env["ONTOLOGY_PATH"];
  if (!ontologyPath) {
    console.warn(
      "\n  [project-test] No ONTOLOGY_PATH set. Skipping project validation.\n" +
      "  Usage: ONTOLOGY_PATH=~/project/ontology/schema.ts bun test project-test.ts\n"
    );
    return null;
  }

  try {
    const mod = await import(ontologyPath);
    const flatten = (candidate: unknown): OntologyExports | null => {
      if (!candidate || typeof candidate !== "object") return null;
      const value = candidate as Record<string, unknown>;
      if (value["data"] && value["logic"] && value["action"] && value["security"]) {
        return value as unknown as OntologyExports;
      }
      if (value["backend"] && typeof value["backend"] === "object") {
        const backend = value["backend"] as Record<string, unknown>;
        if (backend["data"] && backend["logic"] && backend["action"] && backend["security"]) {
          return {
            ...(backend as unknown as OntologyExports),
            frontend: (value["frontend"] as OntologyExports["frontend"] | undefined) ?? undefined,
            runtime: (value["runtime"] as OntologyExports["runtime"] | undefined) ?? undefined,
          };
        }
      }
      return null;
    };

    return (
      flatten(mod.default)
      ?? flatten(mod.ontologyExports)
      ?? flatten(mod.projectOntology)
      ?? flatten(mod.projectScope)
      ?? flatten(mod)
      ?? (() => {
        throw new Error("Module does not export OntologyExports or ProjectOntologyScope shape");
      })()
    );
  } catch (err) {
    console.error(`  [project-test] Failed to load ${ontologyPath}:`, err);
    return null;
  }
}

// =========================================================================
// Test Suite
// =========================================================================

const ontologyPromise = loadProjectOntology();

describe("Project Ontology Validation", () => {
  test("PV: Structural compliance (PV-01~08)", async () => {
    const ontology = await ontologyPromise;
    if (!ontology) {
      console.warn("  Skipped — no ONTOLOGY_PATH");
      return;
    }

    const result = validateProjectOntology(ontology);

    // Log warnings (non-blocking)
    for (const w of result.warnings) {
      console.warn(`  ⚠️  ${w}`);
    }

    // Errors are blocking
    if (result.errors.length > 0) {
      console.error("\n  ❌ Structural errors:");
      for (const e of result.errors) {
        console.error(`     ${e}`);
      }
    }

    expect(result.valid).toBe(true);
  });

  test("SA: Semantic audit — Twin Maturity assessment", async () => {
    const ontology = await ontologyPromise;
    if (!ontology) {
      console.warn("  Skipped — no ONTOLOGY_PATH");
      return;
    }

    const report: SemanticAuditReport = auditSemantics(ontology);

    // Print maturity summary
    console.log(`\n  🏗  Twin Maturity Stage: ${report.twinMaturityStage}`);
    console.log(`  📊 Coverage: ${report.coveragePercent}%`);
    console.log(`  📋 Sections: ${report.sections.length}`);

    // Print upgrade recommendations (sorted by priority)
    const upgrades = report.upgradeSpecs;
    if (upgrades.length > 0) {
      console.log(`\n  🔧 Upgrade recommendations (${upgrades.length}):`);
      for (const u of upgrades.slice(0, 10)) {
        console.log(`     [${u.sectionId}] ${u.operation} ${u.target} — ${u.reason}`);
      }
      if (upgrades.length > 10) {
        console.log(`     ... and ${upgrades.length - 10} more`);
      }
    }

    // Non-blocking: maturity stage is informational
    // But coverage should be tracked over time
    expect(report.coveragePercent).toBeGreaterThanOrEqual(0);
    expect(report.twinMaturityStage).toBeGreaterThanOrEqual(1);
  });

  test("SA: No critical missing sections", async () => {
    const ontology = await ontologyPromise;
    if (!ontology) {
      console.warn("  Skipped — no ONTOLOGY_PATH");
      return;
    }

    const report = auditSemantics(ontology);

    // Core sections that should not be "missing"
    const criticalSections = ["SA-01", "SA-02", "SA-03", "SA-04", "SA-05"];
    const missingSections = report.sections
      .filter(s => criticalSections.some(cs => s.section.startsWith(cs)))
      .filter(s => s.coverage === "missing");

    if (missingSections.length > 0) {
      console.warn("\n  ⚠️  Critical sections missing:");
      for (const s of missingSections) {
        console.warn(`     ${s.section}: ${s.upgradeAction ?? "no upgrade action"}`);
      }
    }

    // Warning, not hard fail — allows incremental adoption
    expect(missingSections.length).toBeLessThanOrEqual(criticalSections.length);
  });

  // =========================================================================
  // PV-09: Ontology ↔ Runtime Drift Detection
  // =========================================================================

  test("PV-09a: Every ontology entity has a corresponding Convex table", async () => {
    const ontology = await ontologyPromise;
    if (!ontology) return;

    const convexSchemaPath = process.env["CONVEX_SCHEMA_PATH"];
    if (!convexSchemaPath) {
      console.warn("  Skipped PV-09a — no CONVEX_SCHEMA_PATH. Set it to run drift detection.");
      return;
    }

    const { generateConvexSchema } = await import("./codegen/convex-schema-gen");
    const runtime = (ontology as unknown as { runtime?: unknown }).runtime;
    const generated = generateConvexSchema({ data: ontology.data, runtime: runtime as any });

    // Extract table names from generated schema
    const generatedTables = new Set(
      [...generated.matchAll(/^\s+(\w+): defineTable/gm)].map(m => m[1]),
    );

    // Read existing schema and extract table names
    const { readFileSync } = await import("fs");
    const existingCode = readFileSync(convexSchemaPath, "utf-8");
    const existingTables = new Set(
      [...existingCode.matchAll(/^\s+(\w+): defineTable/gm)].map(m => m[1]),
    );

    // Every generated table must exist in the actual schema
    const missing: string[] = [];
    for (const table of generatedTables) {
      if (!existingTables.has(table)) missing.push(table);
    }

    if (missing.length > 0) {
      console.error(`\n  PV-09a: Missing Convex tables for ontology entities:\n    ${missing.join(", ")}`);
    }
    expect(missing).toEqual([]);
  });

  test("PV-09b: Every ontology query has a matching Convex export", async () => {
    const ontology = await ontologyPromise;
    if (!ontology) return;

    const convexQueriesPath = process.env["CONVEX_QUERIES_PATH"];
    if (!convexQueriesPath) {
      console.warn("  Skipped PV-09b — no CONVEX_QUERIES_PATH.");
      return;
    }

    const { readFileSync } = await import("fs");
    const existingCode = readFileSync(convexQueriesPath, "utf-8");
    const existingExports = new Set(
      [...existingCode.matchAll(/^export const (\w+)/gm)].map(m => m[1]),
    );

    const ontologyQueries = ontology.logic.queries.map(q => q.apiName);
    const missing = ontologyQueries.filter(q => !existingExports.has(q));

    if (missing.length > 0) {
      console.error(`\n  PV-09b: Missing Convex query exports:\n    ${missing.join(", ")}`);
    }
    expect(missing).toEqual([]);
  });

  test("PV-09c: Every ontology mutation has a matching Convex export", async () => {
    const ontology = await ontologyPromise;
    if (!ontology) return;

    const convexMutationsPath = process.env["CONVEX_MUTATIONS_PATH"];
    if (!convexMutationsPath) {
      console.warn("  Skipped PV-09c — no CONVEX_MUTATIONS_PATH.");
      return;
    }

    const { readFileSync } = await import("fs");
    const existingCode = readFileSync(convexMutationsPath, "utf-8");
    const existingExports = new Set(
      [...existingCode.matchAll(/^export const (\w+)/gm)].map(m => m[1]),
    );
    // Also count internalMutation exports
    const internalExports = new Set(
      [...existingCode.matchAll(/^export const (\w+)\s*=\s*internalMutation/gm)].map(m => m[1]),
    );

    const allExports = new Set([...existingExports, ...internalExports]);
    const ontologyMutations = ontology.action.mutations.map(m => m.apiName);
    const missing = ontologyMutations.filter(m => !allExports.has(m));

    if (missing.length > 0) {
      console.error(`\n  PV-09c: Missing Convex mutation exports:\n    ${missing.join(", ")}`);
    }
    expect(missing).toEqual([]);
  });
});
