/**
 * @palantirKC/claude-schemas — root aggregator
 *
 * Preferred usage: import from an axis subpath:
 *   import type { OntologyExports } from "@palantirKC/claude-schemas/ontology";
 *   import type { RenderingExports } from "@palantirKC/claude-schemas/rendering";
 *   import type { InteractionExports } from "@palantirKC/claude-schemas/interaction";
 *
 * This root re-exports axis entrypoints for consumers that want a single
 * import surface — not recommended for large codebases; prefer the subpath form.
 */

export * as Ontology from "./ontology/types";
export * as Rendering from "./rendering/index";
export * as Interaction from "./interaction/index";
export * as Meta from "./meta/index";

// v1.0 primitives — re-exported under Ontology namespace subpaths
export * from "./ontology/primitives/struct";
export * from "./ontology/primitives/value-type";
export * from "./ontology/primitives/shared-property-type";
export * from "./ontology/primitives/capability-token";
export * from "./ontology/primitives/marking-declaration";
export * from "./ontology/primitives/automation-declaration";
export * from "./ontology/primitives/webhook-declaration";
export * from "./ontology/primitives/scenario-sandbox";
export * from "./ontology/primitives/aip-logic-function";
