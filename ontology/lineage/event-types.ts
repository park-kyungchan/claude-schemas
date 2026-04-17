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
});
