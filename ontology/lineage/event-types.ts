/**
 * palantir-mini — Event type registry primitive (prim-data-01 DATA domain)
 *
 * The 10-variant EventEnvelope discriminator registry. This is the canonical
 * list used by palantir-mini/lib/event-log/types.ts and by any project that
 * wants to build a visitor over the event log.
 *
 * This file is PURE TYPE DECLARATION — no runtime logic. The actual
 * EventEnvelope union lives in palantir-mini/lib/event-log/types.ts.
 */

export const EVENT_TYPE_NAMES = [
  "edit_proposed",
  "edit_committed",
  "submission_criteria_failed",
  "validation_phase_completed",
  "codegen_started",
  "codegen_completed",
  "phase_completed",
  "drift_detected",
  "session_started",
  "session_ended",
  "ontology_registered",
  "capability_token_issued",
  "schema_locked",
  "scenario_created",
  "pr_body_generated",
  "session_complete",
  "doc_drift_detected",
  "refinement_proposed",
  "review_decision",
  "impact_edge_registered",
  "outcome_evaluated",
  "edits_computed_dry_run",
  "session_resumed",
  "semantic_frontmatter_validated",
  "research_library_refreshed",
  "research_library_pruned",
  "claude_code_version_checked",
  "research_docs_drift_detected",
  "orphan_event_reconciled",
  // v1.14 harness events (6) — Prithvi Rajasekaran 3-agent harness lifecycle
  "harness_agent_spawned",
  "sprint_contract_negotiated",
  "sprint_contract_bound",
  "feedback_loop_opened",
  "playwright_scenario_executed",
  "grading_completed",
  // v1.15 — D4 fix: split feedback_loop close from open for cleaner Decision Lineage
  "feedback_loop_closed",
] as const;

export type EventTypeName = typeof EVENT_TYPE_NAMES[number];

export interface EventTypeDeclaration {
  readonly name: EventTypeName;
  readonly description: string;
  /** Which domain is this event primarily associated with */
  readonly primaryDomain: "data" | "logic" | "action" | "security" | "learn";
}

export const EVENT_TYPE_REGISTRY: Readonly<Record<EventTypeName, EventTypeDeclaration>> = Object.freeze({
  edit_proposed: {
    name: "edit_proposed",
    description: "An EditFunction returned hypothetical OntologyEdit[] without committing.",
    primaryDomain: "logic",
  },
  edit_committed: {
    name: "edit_committed",
    description: "AtomicCommit applied edits to ontology state via submission criteria pre-flight.",
    primaryDomain: "action",
  },
  submission_criteria_failed: {
    name: "submission_criteria_failed",
    description: "A commit was rejected because one or more submission criteria failed.",
    primaryDomain: "security",
  },
  validation_phase_completed: {
    name: "validation_phase_completed",
    description: "A validation phase (design/compile/runtime/post_write) finished with a verdict.",
    primaryDomain: "logic",
  },
  codegen_started: {
    name: "codegen_started",
    description: "A descender regeneration run started.",
    primaryDomain: "action",
  },
  codegen_completed: {
    name: "codegen_completed",
    description: "A descender regeneration run finished with a list of generated files.",
    primaryDomain: "action",
  },
  phase_completed: {
    name: "phase_completed",
    description: "A task or workflow phase was marked complete.",
    primaryDomain: "learn",
  },
  drift_detected: {
    name: "drift_detected",
    description: "A drift signal (schema_mismatch / stale_codegen / orphan_reference) was surfaced.",
    primaryDomain: "learn",
  },
  session_started: {
    name: "session_started",
    description: "A new Claude session opened for this project.",
    primaryDomain: "learn",
  },
  session_ended: {
    name: "session_ended",
    description: "A Claude session ended (clear / logout / compact / other).",
    primaryDomain: "learn",
  },
  ontology_registered: {
    name: "ontology_registered",
    description: "A new primitive or ontology declaration was registered via pm-ontology-register.",
    primaryDomain: "action",
  },
  capability_token_issued: {
    name: "capability_token_issued",
    description: "A CapabilityToken was issued to a holder for a scoped set of operations.",
    primaryDomain: "security",
  },
  schema_locked: {
    name: "schema_locked",
    description: "The schema surface was locked for a release; no further structural edits permitted until unlock.",
    primaryDomain: "action",
  },
  scenario_created: {
    name: "scenario_created",
    description: "A ScenarioSandbox was spawned for isolated what-if analysis.",
    primaryDomain: "learn",
  },
  pr_body_generated: {
    name: "pr_body_generated",
    description: "A pull request body was generated from events.jsonl lineage by the /ship skill.",
    primaryDomain: "action",
  },
  session_complete: {
    name: "session_complete",
    description: "A session was formally completed via /ship; emitted after PR merge or explicit completion signal.",
    primaryDomain: "learn",
  },
  doc_drift_detected: {
    name: "doc_drift_detected",
    description: "detect-doc-drift found a stale reference (missing file, wrong version, dead symbol) in a tracked document.",
    primaryDomain: "learn",
  },
  refinement_proposed: {
    name: "refinement_proposed",
    description: "BackwardProp closed a loop — runtime evidence produced a proposed refinement to ontology or validation.",
    primaryDomain: "learn",
  },
  review_decision: {
    name: "review_decision",
    description: "An ontologist accepted, rejected, or deferred a proposed refinement.",
    primaryDomain: "learn",
  },
  impact_edge_registered: {
    name: "impact_edge_registered",
    description: "A new ImpactEdge was added to the Context Engineering graph substrate.",
    primaryDomain: "learn",
  },
  outcome_evaluated: {
    name: "outcome_evaluated",
    description: "Outcomes-grader returned a rubric verdict (satisfied / needs_revision) for an agent pipeline work slice. Local mirror of Anthropic Managed Agents define_outcome.",
    primaryDomain: "learn",
  },
  edits_computed_dry_run: {
    name: "edits_computed_dry_run",
    description: "An edit function computed OntologyEdit[] via compute_edits_dry_run MCP without committing. Tier-2 compute-only path.",
    primaryDomain: "logic",
  },
  session_resumed: {
    name: "session_resumed",
    description: "A session was resumed from an events.jsonl checkpoint (last_session_rid + last_sequence restored). Local mirror of Managed Agents durable Session resume.",
    primaryDomain: "learn",
  },
  semantic_frontmatter_validated: {
    name: "semantic_frontmatter_validated",
    description: "PreToolUse/PostToolUse hook validated a hand-written ontology/primitives/contracts/codegen file for semantic frontmatter (owner+purpose).",
    primaryDomain: "logic",
  },
  research_library_refreshed: {
    name: "research_library_refreshed",
    description: "research_library_refresh MCP tool re-fetched upstream docs (palantir-foundry sitemap / Claude Code release notes) and reconciled local ~/.claude/research/ with added/removed/changed URL sets.",
    primaryDomain: "learn",
  },
  research_library_pruned: {
    name: "research_library_pruned",
    description: "research_library_prune MCP tool archived stale interpretation files (age-based or citation-based) to _archive/ under palantir-vision/.",
    primaryDomain: "learn",
  },
  claude_code_version_checked: {
    name: "claude_code_version_checked",
    description: "claude_code_version_delta MCP tool fetched Anthropic release notes and surfaced new features / deprecations / breaking changes requiring research-doc updates.",
    primaryDomain: "learn",
  },
  research_docs_drift_detected: {
    name: "research_docs_drift_detected",
    description: "Drift signal raised against ~/.claude/research/ — a tracked BROWSE/INDEX/MEMORY entry references a doc that was refreshed, pruned, or rendered stale by upstream change.",
    primaryDomain: "learn",
  },
  orphan_event_reconciled: {
    name: "orphan_event_reconciled",
    description: "An orphan event (emitted without a matching ontology-registered primitive) was reconciled post-hoc — either by registering the missing primitive or by archiving the orphan event with a documented rationale.",
    primaryDomain: "learn",
  },
  // v1.14 harness lifecycle events — Prithvi Rajasekaran 3-agent harness
  harness_agent_spawned: {
    name: "harness_agent_spawned",
    description: "A HarnessAgent (planner/generator/evaluator/orchestrator/grader_*) was spawned with a role binding to a sprint or feedback loop. Records role, phase, modelRef, and tool allowlist for audit.",
    primaryDomain: "learn",
  },
  sprint_contract_negotiated: {
    name: "sprint_contract_negotiated",
    description: "Generator and Evaluator exchanged a proposal/counter-proposal during SprintContract negotiation. Recorded per round to track convergence. File-based IPC in .palantir-mini/harness/sprints/*/contract-negotiation.md.",
    primaryDomain: "action",
  },
  sprint_contract_bound: {
    name: "sprint_contract_bound",
    description: "A SprintContract transitioned from 'negotiating' to 'bound' status. From this point the contract is frozen — modifications require a new contract (version bump).",
    primaryDomain: "action",
  },
  feedback_loop_opened: {
    name: "feedback_loop_opened",
    description: "A FeedbackLoop was opened for a bound SprintContract, binding a Generator and Evaluator pair. Tracks iterationCount=0 at open; subsequent iterations append feedback artifacts until termination.",
    primaryDomain: "logic",
  },
  playwright_scenario_executed: {
    name: "playwright_scenario_executed",
    description: "A PlaywrightScenario was executed by the Evaluator against a running application via mcp__playwright__* or mcp__claude-in-chrome__* MCP. Captures evidence (screenshots/logs/network) per EvidenceCaptureSpec.",
    primaryDomain: "learn",
  },
  grading_completed: {
    name: "grading_completed",
    description: "Evaluator finished scoring artifacts against a GradingRubric (ordered Set<GradingCriterion>). Emits weighted score, per-criterion scores, and hard-threshold pass/fail verdict. Consumed by FeedbackLoop orchestrator to decide next state.",
    primaryDomain: "learn",
  },
  // v1.15 lifecycle event — D4 fix from H3 retrospective (harness-h3-retrospective.md)
  feedback_loop_closed: {
    name: "feedback_loop_closed",
    description: "A FeedbackLoop transitioned to terminal state (passed/failed/aborted). Replaces the v1.14 pattern of overloading feedback_loop_opened with payload.transition='close'. Cleaner Decision Lineage: 'when did this loop open' = filter by feedback_loop_opened; 'when did it close' = feedback_loop_closed. During v1.15 deprecation window, both variants are accepted by consumers; producers SHOULD emit feedback_loop_closed.",
    primaryDomain: "logic",
  },
});
