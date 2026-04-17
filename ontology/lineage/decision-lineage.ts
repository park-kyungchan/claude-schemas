/**
 * palantir-mini — Decision Lineage 5-dim primitive (prim-learn-02)
 *
 * Palantir Decision Lineage 5 dimensions per §DL-02:
 *   WHEN / ATOP_WHICH / THROUGH_WHICH / BY_WHOM / WITH_WHAT
 *
 * Captured on every EventEnvelope via EventEnvelopeBase. Enables root-cause
 * analysis of ontology changes and is the foundation for BackwardProp.
 */

export interface DecisionLineage5Dim {
  /** ISO8601 timestamp — when did the decision happen? */
  readonly when: string;
  /** Git SHA at time of decision — atop which version? */
  readonly atopWhich: string;
  /** Through which session / tool / cwd did the decision flow? */
  readonly throughWhich: {
    readonly sessionId: string;
    readonly toolName:  string;
    readonly cwd:       string;
  };
  /** By whom was the decision made (identity + optional agent/team) */
  readonly byWhom: {
    readonly identity:   string;
    readonly agentName?: string;
    readonly teamName?:  string;
  };
  /** With what reasoning / hypothesis */
  readonly withWhat?: {
    readonly reasoning?:  string;
    readonly hypothesis?: string;
  };
}

/** Lineage dimensions enumerated for filter construction */
export const LINEAGE_DIMENSIONS = ["when", "atopWhich", "throughWhich", "byWhom", "withWhat"] as const;
export type LineageDimension = typeof LINEAGE_DIMENSIONS[number];
