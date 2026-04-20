/**
 * @stable — SprintContract primitive (prim-action-05, v1.14.0)
 *
 * File-based agreement between Generator and Evaluator defining "what done
 * looks like" for a sprint. Bridges spec-level user stories with verifiable
 * implementation criteria. Mirrors Palantir Two-Tier Action pattern — the
 * contract is a Tier-2 function-backed action (returns Edits[] without
 * commit until iteration passes hard threshold).
 *
 * Authority:
 *   - Prithvi Rajasekaran's harness (research/claude-code — sprint
 *     contracts with 27+ criteria per sprint)
 *   - Palantir Two-Tier Action: research/palantir-foundry/ontology/
 *     ontology-actions-*.md
 *   - research/claude-code/palantir-mini-blueprint.md §Palantir 5 infra
 *     patterns (Two-Tier Action Architecture)
 *
 * D/L/A domain: ACTION (executable contract binding input spec → verifiable
 * output; mirrors Palantir ActionType semantics)
 * @owner palantirkc-ontology
 * @purpose Sprint negotiation contract (Two-Tier Action-aligned)
 */

export type SprintContractRid = string & { readonly __brand: "SprintContractRid" };

export const sprintContractRid = (s: string): SprintContractRid => s as SprintContractRid;

/**
 * Status of the negotiation at read time. Contract is file-based and
 * mutable during "negotiating"; frozen at "bound". Once "bound",
 * modifications require a new contract (version bump).
 */
export type SprintContractStatus =
  | "drafting"
  | "negotiating"
  | "bound"
  | "aborted";

/**
 * Disagreement resolution policy when Generator and Evaluator fail to
 * converge on the contract during "negotiating" phase.
 *   lead-arbitrated       — Orchestrator agent decides
 *   priority-criterion    — criterion with highest weightInRubric wins
 *   abort-on-disagreement — any disagreement aborts sprint (strictest)
 */
export type DisagreementResolution =
  | "lead-arbitrated"
  | "priority-criterion"
  | "abort-on-disagreement";

export interface FeatureSpecRef {
  /** Stable identifier for the feature within the parent Planner spec */
  readonly featureId: string;
  /** Human-readable feature name */
  readonly title: string;
  /** 1-3 sentence description */
  readonly description: string;
}

export interface HardThresholdPolicy {
  /**
   * Per-GradingCriterion minimum — keyed by GradingCriterionRid string form.
   * If ANY criterion falls below its threshold the sprint FAILS regardless
   * of the overall weighted score. Prithvi's "hard threshold" pattern.
   */
  readonly perCriterion: Readonly<Record<string, number>>;
  /**
   * Overall weighted-score threshold. Separate from perCriterion — overall
   * gates PASS, perCriterion gates FAIL.
   */
  readonly overall: number;
  /** Score scale reference */
  readonly scale: "0-10" | "0-1" | "pass-fail";
}

export interface SprintContractDeclaration {
  readonly contractId: SprintContractRid;
  /** Parent sprint number (1-based) within the harness execution */
  readonly sprintNumber: number;
  readonly status: SprintContractStatus;
  /** Features this sprint delivers. Pulled from Planner spec. */
  readonly inputs: readonly FeatureSpecRef[];
  /**
   * GradingCriterion RIDs (as strings) that define success. Evaluator
   * scores artifacts against these criteria at sprint end.
   */
  readonly successCriteriaRids: readonly string[];
  /**
   * 5-15 per Prithvi's original paper. Hard cap enforced by FeedbackLoop
   * orchestrator; re-spawning a Generator+Evaluator pair beats extending
   * beyond 15 iterations.
   */
  readonly iterationLimit: number;
  /** Hard threshold policy — both per-criterion floors + overall ceiling */
  readonly hardThreshold: HardThresholdPolicy;
  /**
   * Wall-clock budget in milliseconds. Orchestrator aborts the sprint on
   * timeout (emits sprint_contract_bound event with reason="timeout_aborted").
   */
  readonly timeoutMs: number;
  /**
   * Token budget hint — not a hard cap (model-dependent), used by
   * orchestrator for auto-shutdown planning.
   */
  readonly budgetTokens: number;
  /**
   * File path (relative to project harness/ dir) where Generator proposals
   * and Evaluator counter-proposals are exchanged during negotiation.
   * File-based IPC per Prithvi's design; direct messaging is not used
   * for contract negotiation to preserve audit trail.
   */
  readonly negotiationFile: string;
  /** How to resolve Generator↔Evaluator disagreements during negotiation */
  readonly disagreementResolution: DisagreementResolution;
  readonly description?: string;
}

export class SprintContractRegistry {
  private readonly items = new Map<SprintContractRid, SprintContractDeclaration>();

  register(decl: SprintContractDeclaration): void {
    this.items.set(decl.contractId, decl);
  }

  get(rid: SprintContractRid): SprintContractDeclaration | undefined {
    return this.items.get(rid);
  }

  byStatus(status: SprintContractStatus): SprintContractDeclaration[] {
    return [...this.items.values()].filter((c) => c.status === status);
  }

  keys(): IterableIterator<SprintContractRid> {
    return this.items.keys();
  }

  list(): SprintContractDeclaration[] {
    return [...this.items.values()];
  }
}

export const SPRINT_CONTRACT_REGISTRY = new SprintContractRegistry();
