/**
 * palantir-mini — ForwardProp / BackwardProp policy primitives
 *
 * Forward: ontology -> contracts -> codegen -> runtime -> events
 * Backward: events -> replay -> lineage -> refinement -> ontology update
 *
 * This file declares the policy shape. Runtime traversal lives in
 * palantir-mini/agents/propagation-tracer.md and
 * palantir-mini/bridge/handlers/replay-lineage.ts.
 */

export interface ForwardPropPolicy {
  readonly name: string;
  readonly description?: string;
  readonly steps: ReadonlyArray<{
    readonly step: number;
    readonly name: string;
    /** Where does this step's output live? */
    readonly outputPath: string;
    /** DDD/DRY/OCP/PECS rationale (for docs + audit) */
    readonly dc5Rationale?: string;
  }>;
}

export interface BackwardPropPolicy {
  readonly name: string;
  readonly description?: string;
  readonly steps: ReadonlyArray<{
    readonly step: number;
    readonly name: string;
    /** Where does this step read from? */
    readonly inputPath: string;
    readonly dc5Rationale?: string;
  }>;
  /** Known gaps (non-durable persistence, deferred feedback) */
  readonly gaps: ReadonlyArray<string>;
}

/** v0 reference policies — matches blueprint.json forwardProp/backwardProp */
export const FORWARD_PROP_V0: ForwardPropPolicy = Object.freeze({
  name: "palantir-mini-forward-prop-v0",
  description: "Ontology declarations -> palantir-mini codegen -> per-project generated code -> runtime -> events.jsonl -> snapshot",
  steps: [
    { step: 1, name: "ontology declarations", outputPath: "~/.claude/schemas/ontology/{primitives,functions,policies,lineage,generators}/",
      dc5Rationale: "DDD: matches Palantir OSDK 2.0 vocabulary; DRY: single schema shared across 3 projects" },
    { step: 2, name: "palantir-mini codegen", outputPath: "~/.claude/plugins/palantir-mini/lib/codegen/descender-gen.ts",
      dc5Rationale: "OCP: new primitives add generator templates, never modify existing generators" },
    { step: 3, name: "per-project generated code", outputPath: "<project>/src/generated/{objects,links,actions,functions,events}.d.ts",
      dc5Rationale: "OSDK 2.0 client/generated split; generated code never hand-edited" },
    { step: 4, name: "project runtime", outputPath: "<project>/src/** (consumers)",
      dc5Rationale: "PECS: consumers use supertypes, producers extend" },
    { step: 5, name: "events.jsonl append", outputPath: "<project>/.palantir-mini/session/events.jsonl",
      dc5Rationale: "DRY: single append path for all state changes via AtomicCommit" },
    { step: 6, name: "derived snapshot", outputPath: "<project>/.palantir-mini/session/snapshots/{ontology,manifest}.json",
      dc5Rationale: "snapshot is cache, events.jsonl is truth" },
  ],
});

export const BACKWARD_PROP_V0: BackwardPropPolicy = Object.freeze({
  name: "palantir-mini-backward-prop-v0",
  description: "events.jsonl -> replay_lineage -> 5-dim lineage graph -> refinement -> ontologist review -> ontology update",
  steps: [
    { step: 1, name: "runtime events", inputPath: "<project>/.palantir-mini/session/events.jsonl",
      dc5Rationale: "DDD: WHEN/ATOP_WHICH/THROUGH_WHICH/BY_WHOM/WITH_WHAT" },
    { step: 2, name: "replay_lineage MCP tool", inputPath: "~/.claude/plugins/palantir-mini/bridge/handlers/replay-lineage.ts",
      dc5Rationale: "DRY: single replay primitive serves all backward queries" },
    { step: 3, name: "decision lineage graph", inputPath: "in-memory",
      dc5Rationale: "DDD: matches Palantir Decision Lineage vocabulary" },
    { step: 4, name: "refinement proposal (non-durable in v0)", inputPath: "agent inbox via SendMessage",
      dc5Rationale: "PECS: proposal consumers use supertype" },
    { step: 5, name: "ontologist review", inputPath: "decision-log.json",
      dc5Rationale: "human-in-the-loop governance" },
    { step: 6, name: "ontology declaration update", inputPath: "~/.claude/schemas/ontology/ git commit",
      dc5Rationale: "closed loop: BackwardProp terminates at start of ForwardProp" },
  ],
  gaps: [
    "Step 4 (refinement proposal persistence): non-durable in v0 — add refinement_proposed event variant post-v0.",
    "Step 5 (ontologist review decision): should itself be a LEARN-domain event — add review_decision event variant post-v0.",
  ],
});
