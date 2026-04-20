/**
 * @palantirKC/claude-schemas — primitives barrel (v1.14.0)
 *
 * Single import surface for every canonical primitive under ontology/primitives/.
 * Import the barrel when you want the full primitive API; import individual
 * files when you want a narrow surface.
 *
 * Primitive inventory (v1.15.0 — 28 files):
 *   v1.0 core (9)      — struct, value-type, shared-property-type,
 *                        capability-token, marking-declaration,
 *                        automation-declaration, webhook-declaration,
 *                        scenario-sandbox, aip-logic-function
 *   pre-v1.0 carryover — action-type, interface-type, link-type,
 *                        object-type, property-type
 *   v1.13 governance   — research-document, memory-index-entry,
 *                        claude-code-version, hook-event-allowlist,
 *                        plugin-manifest, project-schema-pin,
 *                        file-complexity-budget, dead-code-marker,
 *                        lineage-conformance-policy,
 *                        managed-settings-fragment,
 *                        codegen-header-contract, impact-edge
 *   v1.14 harness (5)  — harness-agent, sprint-contract, feedback-loop,
 *                        grading-criterion, playwright-scenario
 *                        (Prithvi Rajasekaran 3-agent + AIP Evals 5-evaluator)
 *   v1.15 pedagogy (2) — pedagogy-contract, feedback-loop-closed
 *                        (mathcrew H4 Sprint 2 + H3 D4 fix)
  * @owner palantirkc-ontology
 * @purpose primitives barrel (v1.15.0)
 */

// --- v1.0 core (9) ---
export * from "./struct";
export * from "./value-type";
export * from "./shared-property-type";
export * from "./capability-token";
export * from "./marking-declaration";
export * from "./automation-declaration";
export * from "./webhook-declaration";
export * from "./scenario-sandbox";
export * from "./aip-logic-function";

// --- pre-v1.0 carryover ---
export * from "./action-type";
export * from "./interface-type";
export * from "./link-type";
export * from "./object-type";
export * from "./property-type";

// --- v1.13 governance primitives (A1.1 - A1.12) ---
export * from "./research-document";
export * from "./memory-index-entry";
export * from "./claude-code-version";
export * from "./hook-event-allowlist";
export * from "./plugin-manifest";
export * from "./project-schema-pin";
export * from "./file-complexity-budget";
export * from "./dead-code-marker";
export * from "./lineage-conformance-policy";
export * from "./managed-settings-fragment";
export * from "./codegen-header-contract";
export * from "./impact-edge";

// --- v1.14 harness primitives (H1.1 - H1.5) ---
// Prithvi Rajasekaran 3-agent harness + AIP Evals 5-evaluator pattern.
// Companions: palantir-mini v2.0 agents/ + bridge/harness MCP handlers.
export * from "./harness-agent";
export * from "./sprint-contract";
export * from "./feedback-loop";
export * from "./grading-criterion";
export * from "./playwright-scenario";

// --- v1.15 pedagogy + harness D4 fix (P1.1, P1.2) ---
// mathcrew H4 Sprint 2: promotes PedagogyContract from project-local to canonical.
// Also closes H3 retrospective D4: feedback_loop_closed split from _opened.
export * from "./pedagogy-contract";
export * from "./feedback-loop-closed";
