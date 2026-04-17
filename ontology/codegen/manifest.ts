/**
 * Ontology Codegen Manifest
 *
 * Declarative list of generators. Consumers (pm-codegen, project validators)
 * iterate this manifest instead of hardcoding generator module paths.
 *
 * Axis version: 1.12.0 (ontology)
 */

export interface GeneratorSpec {
  /** Stable generator id — used in generated file headers. */
  id: string;
  /** Human-readable description for `pm-verify` output. */
  description: string;
  /** Module path (relative to schemas/ontology/codegen/). */
  module: string;
  /** Named export that returns the generated code as a string. */
  exportName: string;
  /** Inputs: which sub-domains of the ontology this generator reads. */
  inputs: Array<"data" | "logic" | "action" | "runtime" | "frontend">;
  /** Output relative path under `<project>/` where the generated file lands. */
  outputPath: string;
  /** Generator version — bumped independently of axis version. */
  version: string;
}

export const CODEGEN_MANIFEST: readonly GeneratorSpec[] = [
  {
    id: "convex-schema",
    description: "Convex table + index schema from ontology DATA declarations.",
    module: "./convex-schema-gen",
    exportName: "generateConvexSchema",
    inputs: ["data", "runtime"],
    outputPath: "convex/schema.ts",
    version: "1.0.0",
  },
  {
    id: "convex-queries",
    description: "Convex query functions from ontology LOGIC declarations.",
    module: "./convex-queries-gen",
    exportName: "generateConvexQueries",
    inputs: ["data", "logic"],
    outputPath: "convex/queries.ts",
    version: "1.0.0",
  },
  {
    id: "convex-mutations",
    description: "Convex mutation stubs from ontology ACTION declarations.",
    module: "./convex-mutations-gen",
    exportName: "generateConvexMutations",
    inputs: ["data", "action"],
    outputPath: "convex/mutations.generated.ts",
    version: "1.0.0",
  },
  {
    id: "runtime-bindings",
    description: "Runtime binding declarations for agent/user/rendering surfaces.",
    module: "./runtime-bindings-gen",
    exportName: "generateRuntimeBindings",
    inputs: ["runtime"],
    outputPath: "src/lib/runtimeBindings.generated.ts",
    version: "1.0.0",
  },
  {
    id: "frontend-registry",
    description: "Frontend ontology-view registry for viewBindings + crossViewDependencies.",
    module: "./frontend-registry-gen",
    exportName: "generateFrontendRegistry",
    inputs: ["runtime", "frontend"],
    outputPath: "src/generated/ontology-registry.generated.ts",
    version: "1.0.0",
  },
] as const;

export type GeneratorId = typeof CODEGEN_MANIFEST[number]["id"];

/** Standard header all generated files must carry. */
export function generatedFileHeader(args: {
  generatorId: GeneratorId;
  generatorVersion: string;
  schemaVersion: string;
  ontologyHash: string;
  timestamp: string;
}): string {
  return `// GENERATED FILE — do not edit by hand.
// Generator: ${args.generatorId}@${args.generatorVersion}
// Schema: @palantirKC/claude-schemas@${args.schemaVersion}
// Ontology hash: sha256:${args.ontologyHash}
// Generated: ${args.timestamp}
// Regenerate: /pm-codegen
`;
}
