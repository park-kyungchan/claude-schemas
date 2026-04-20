# Ontology Schema Changelog

## 1.15.0 (package) / primitives surface — 2026-04-20

### Added — PedagogyContract primitive + feedback_loop_closed event split

2 new primitive files under `ontology/primitives/`:
- `pedagogy-contract.ts` (LEARN, `prim-learn-12`) — Composable pedagogy plug-in framework. Declares `PedagogyContract` + `PedagogyApplication` + `PedagogyParams` discriminated union (cpa / productive-failure / constructionism / variation-theory) + `CognitiveLoadConstraint` meta-audit shape + `PEDAGOGY_CONTRACT_REGISTRY`. Promoted from mathcrew project-local `ontology/pedagogy.ts`; mathcrew's project-local becomes a thin re-export in Sprint 2 P1.
- `feedback-loop-closed.ts` (DATA, `prim-data-09`) — Declares `FeedbackLoopClosedPayload` for the terminal-state transition event. Self-contained schema (inlines TerminationCondition shape) so consumers outside the plugin can import payload type without cross-file dependencies.

EVENT_TYPE_REGISTRY expanded 35 → 36:
- `feedback_loop_closed` (LOGIC) — replaces the v1.14 overloaded `feedback_loop_opened` with `payload.transition: "close"` pattern identified as ontology smell in H3 D4.

Deprecation: `FeedbackLoopOpenedEnvelope.payload.transition | verdict | terminationCondition` optional fields retained for one MINOR cycle (removed in v1.16). During v1.15, consumers accept BOTH variants.

Authority: research/palantir-vision/synthesis/2026-04-20-mathcrew-redesign-research.md §Topic 2 + research/claude-code/harness-h3-retrospective.md §D4.

### Per-Axis Version Matrix (v1.15.0)
| Axis | Version | Source |
|------|---------|--------|
| ontology/types.ts | 1.12.0 (unchanged) | primitives surface extended separately |
| ontology/primitives/ | 28 files (+2) | pedagogy-contract + feedback-loop-closed added |
| ontology/lineage/event-types | 36 events (+1) | feedback_loop_closed |
| interaction | 0.1.2 | unchanged |
| meta | 0.1.0 | unchanged |
| rendering | 0.1.0 | unchanged |
| **root package** | **1.15.0** | **MINOR bump (additive)** |

---

## 1.14.0 (package) / primitives surface — 2026-04-20

### Added — 5 harness primitives + 6 lifecycle events
5 new primitive files under `ontology/primitives/`:
- `harness-agent.ts` (LEARN, `prim-learn-11`) — 8-role taxonomy (planner/generator/evaluator/orchestrator + 4 grader specializations) with phase binding, model anchor, tools allowlist, output contract, maxTurns. Binds agent .md semantics to typed primitive.
- `sprint-contract.ts` (ACTION, `prim-action-05`) — File-based Generator↔Evaluator agreement; status state machine (drafting/negotiating/bound/aborted); hard-threshold policy (per-criterion floors + overall ceiling); disagreement resolution enum.
- `feedback-loop.ts` (LOGIC, `prim-logic-04`) — 7-state iteration tracker (negotiating→generating→evaluating→feedback→passed/failed/aborted) binding a Generator+Evaluator pair to a SprintContract. Monotonic feedback artifact paths.
- `grading-criterion.ts` (DATA, `prim-data-08`) — AIP Evals 5-evaluator taxonomy (code/rule/model/human/hybrid), 9-domain applicability scope, pass/fail logic with 4 combinator types, hybrid sub-criteria composition. Rubric = ordered Set<Criterion> with sum(weight)=1.0.
- `playwright-scenario.ts` (LEARN, `prim-learn-04`) — 17-kind browser step taxonomy, evidence capture spec (screenshots/network/console/video/a11y/DOM), MCP binding enum (Playwright | Claude-in-Chrome).

EVENT_TYPE_REGISTRY expanded 29→35:
- `harness_agent_spawned`, `sprint_contract_negotiated`, `sprint_contract_bound`, `feedback_loop_opened`, `playwright_scenario_executed`, `grading_completed`

Authority: Prithvi Rajasekaran's Anthropic Labs harness + Palantir AIP Evals 5-evaluator + Claude Code Lead Protocol v2.

### Per-Axis Version Matrix (v1.14.0)
| Axis | Version | Source |
|------|---------|--------|
| ontology/types.ts | 1.12.0 (unchanged) | primitives surface extended separately |
| ontology/primitives/ | 26 files (+5) | harness primitives added |
| ontology/lineage/event-types | 35 events (+6) | harness lifecycle |
| interaction | 0.1.2 | unchanged |
| meta | 0.1.0 | unchanged |
| rendering | 0.1.0 | unchanged |
| **root package** | **1.14.0** | **MINOR bump (additive)** |

---

## 1.0.0 (package) / primitives surface — 2026-04-17

### Breaking Change Signal
Major package version bump (0.2.1 → 1.0.0) signals a new canonical primitive surface.
Zero actual breaking changes: all existing types.ts and semantics.ts interfaces are
preserved for backward compatibility. Consumer projects may continue importing from
existing subpaths without modification.

### Added (9 new primitive files under primitives/)
- **`primitives/struct.ts`** (prim-data-05) — StructRid + StructDeclaration + StructRegistry singleton. Reusable named record type (Palantir Struct analog) embedded inside ObjectType properties.
- **`primitives/value-type.ts`** (prim-data-06) — ValueTypeRid + ValueTypeDeclaration + ValueTypeRegistry + BaseScalarType union (`string`|`number`|`integer`|`boolean`|`date`). Scalar constraint type wrapping base primitives with semantic validation.
- **`primitives/shared-property-type.ts`** (prim-data-07) — SharedPropertyTypeRid + SharedPropertyTypeDeclaration + SharedPropertyTypeRegistry. Promoted from inline interface in types.ts; enables cross-object property group reuse (e.g. AuditFields).
- **`primitives/capability-token.ts`** (prim-security-02) — CapabilityTokenRid + CapabilityTokenDeclaration + CapabilityTokenRegistry. L2 RBAC token with holder, scope, issuedAt, expiresAt, signature.
- **`primitives/marking-declaration.ts`** (prim-security-03) — MarkingRid + MarkingDeclaration + MarkingDeclarationRegistry. Cell/column classification with SensitivityLevel (`public`|`internal`|`confidential`|`restricted`) and applicableFieldPaths.
- **`primitives/automation-declaration.ts`** (prim-action-03) — AutomationRid + AutomationDeclaration + AutomationDeclarationRegistry. Cron/trigger scheduled action metadata (schedule, actionTypeRid, enabled).
- **`primitives/webhook-declaration.ts`** (prim-action-04) — WebhookRid + WebhookDeclaration + WebhookDeclarationRegistry. External ingress event descriptor (endpoint, authHeader, payloadSchema, eventTypeFilter).
- **`primitives/scenario-sandbox.ts`** (prim-learn-03) — ScenarioRid + ScenarioSandboxDeclaration + ScenarioSandboxRegistry. Isolated what-if analysis context (scenarioId, parentSessionId, isolation: full|shared-read, createdAt, metadata).
- **`primitives/aip-logic-function.ts`** (prim-logic-03) — AIPLogicFunctionRid + AIPLogicFunctionDeclaration + AIPLogicFunctionRegistry. LLM-backed function (modelRef, promptTemplate, outputSchema, deterministic: false).

### Added (event registry expansion)
- **`lineage/event-types.ts`** — EVENT_TYPE_REGISTRY expanded from 10 to 16 variants. New events: `ontology_registered`, `capability_token_issued`, `schema_locked`, `scenario_created`, `pr_body_generated`, `session_complete`.

### Deprecation Notes
The following inline interfaces in `types.ts` are superseded by the new primitive files and should be migrated in W3+:
- `SharedPropertyType` → `primitives/shared-property-type.ts:SharedPropertyTypeDeclaration`
- `StructType` → `primitives/struct.ts:StructDeclaration`

Types.ts interfaces are preserved read-only (managed-settings deny rules lock them) and will remain for backcompat through at least v1.x.

### Per-Axis Version Matrix (v1.0.0)
| Axis | Version | Source |
|------|---------|--------|
| ontology | 1.12.0 | ontology/CHANGELOG.md (no bump — additive primitives live outside types.ts) |
| interaction | 0.1.2 | interaction/types.ts |
| meta | 0.1.0 | meta/types.ts |
| rendering | 0.1.0 | rendering/types.ts |
| **root package** | **1.0.0** | **package.json + CHANGELOG.md** |

---

## 1.12.0 — 2026-04-10

### Added (typed BackPropagation / Workflow Lineage upgrade)
- **`feedbackEntityRef` / `feedbackMutationRefs`** (`types.ts`) — typed LEARN-02 declaration for human/operator feedback surfaces
- **`evaluationEntityRef` / `evaluationMutationRefs` / `evaluationFunctionRefs`** (`types.ts`) — typed evaluator/rubric declaration so semantic audit no longer depends on naming heuristics alone
- **`outcomeEntityRef` / `outcomeMutationRefs`** (`types.ts`) — typed LEARN-03 / REF-01 outcome tracking declaration
- **`accuracyEntityRef` / `refinementSignalEntityRef` / `graduationMutationRefs`** (`types.ts`) — typed REF-02..05 BackPropagation declaration
- **`workflowLineageEntityRefs`** (`types.ts`) — typed Workflow Lineage declaration for trace entities
- **`schemas/ontology/BROWSE.md` + `schemas/ontology/INDEX.md`** — question-first retrieval and structure map for schema work

### Updated
- **`semantic-audit.ts`** now prefers typed LEARN / REF / WL refs before inferential heuristics for SA-11, SA-12, SA-21, SA-22, and Stage 5 maturity calculation
- **`project-validator.ts`** validates typed LEARN refs against real entities, mutations, and functions and emits warnings when boolean-only LEARN declarations are underspecified
- **`project-test.test.ts`** now preserves `runtime` when flattening `ProjectOntologyScope`, so runtime audit/backprop declarations are not dropped during validation
- **`CLAUDE.md` + `rules/03-forward-backward-propagation.md` + `rules/05-lineage-governance-learn.md`** aligned to the typed BackPropagation contract
- **`research/BROWSE.md` + `research/INDEX.md`** gained explicit BackPropagation / Workflow Lineage retrieval paths
- **`semantics.ts`** schema version bumped to `1.12.0`

### Verified
- `cd ~/.claude/schemas/ontology && bun test`
- `bunx tsc --noEmit --module esnext --target es2022 --moduleResolution bundler ~/.claude/schemas/ontology/types.ts ~/.claude/schemas/ontology/semantics.ts ~/.claude/schemas/ontology/semantic-audit.ts ~/.claude/schemas/ontology/project-validator.ts ~/.claude/schemas/ontology/project-test.test.ts`

## 1.11.0 — 2026-04-03

### Added (external-agent + local-first + structural governance alignment)
- **`agentToolDescription`** (`types.ts`) — optional action-level guidance mirroring Ontology MCP's official Agent tool description field for externally callable actions
- **`permissionModel`** (`types.ts`) — optional per-project declaration for `ontologyRoles` vs `projectBased` permission surfaces
- **`embeddedOntologyApp` + offline sync fields** (`types.ts`) — frontend scope can now declare offline-capable embedded ontology views via `supportsOffline` and `syncEntityApiNames`
- **`embeddedOntology` runtime support kind** (`types.ts`) — runtime support bindings can now declare the local embedded ontology support surface explicitly
- **`EMBEDDED_ONTOLOGY_APP_SURFACES`** (`semantics.ts`) — EO-01..05 constants promoting Foundry's embedded ontology/offline app path into typed schema authority
- **`STRUCTURAL_CHANGE_GOVERNANCE_SURFACES`** (`semantics.ts`) — SCG-01..05 constants capturing branches, proposals, delegated ownership, and approval/protection boundaries for structural change

### Updated
- **`ONTOLOGY_MCP`** (`semantics.ts`) now reflects official query/function/action guidance boundaries instead of treating MCP purely as `toolExposure` inference
- **`semantic-audit.ts`** adds richer `SA-23` evidence using `agentToolDescription` and a new `SA-32` check for embedded ontology / offline-capable frontend surfaces
- **`project-validator.ts`** validates offline sync entity refs, allowed offline surfaces, and the required runtime `embeddedOntology` support binding when offline views are declared
- **`semantics.ts`** schema version bumped to `1.11.0`

### Verified
- `cd ~/.claude/schemas/ontology && bun test`
- `bunx tsc --noEmit --module esnext --target es2022 --moduleResolution bundler ~/.claude/schemas/ontology/types.ts ~/.claude/schemas/ontology/semantics.ts ~/.claude/schemas/ontology/semantic-audit.ts ~/.claude/schemas/ontology/project-validator.ts`

## 1.10.0 — 2026-03-25

### Added (Project-scope backend/frontend contract)
- **`BackendOntology`** (`types.ts`) — explicit alias for the semantic core (`data`, `logic`, `action`, `security`, `learn`) so backend ontology can be referenced independently from broader project scope
- **`FrontendOntology`** (`types.ts`) — typed frontend contract for route/view declarations, agent surfaces, scenario flows, and optional interaction/rendering exports
- **`ProjectOntologyScope`** (`types.ts`) — `{ backend, frontend? }` export shape for projects that want AI agents to scaffold full-stack ontology scope instead of backend declarations only
- **`HUMAN_AGENT_LEVERAGE_CRITERIA`** (`semantics.ts`) — typed promotion of DevCon 5's 3 leverage conditions: shared mutable context, clear validation criteria, feedback-driven optimization
- **`PROJECT_SCOPE_ONTOLOGY_SURFACES`** (`semantics.ts`) — typed authority for backend semantic core, frontend application surface, agent surface, and sandbox/review surface
- **`ONTOLOGY_DESIGN_PRINCIPLES`** (`semantics.ts`) — DevCon 5's 4 ontology design principles promoted into schema authority (`ODP-01..04`)

### Updated
- **`OntologyExports`** (`types.ts`) now supports optional `frontend` while remaining backward-compatible with existing flat backend-only exports
- **`project-validator.ts`** adds `PV-07` frontend ontology validation: backend↔frontend reference integrity for views, agent surfaces, scenario flows, interaction bindings, and 3D rendering declarations
- **`project-test.test.ts`** loader now accepts both flat `OntologyExports` and scoped `{ backend, frontend? }` project exports
- **`semantics.ts`** schema version bumped to `1.10.0`

### Verified
- `bun test /home/palantirkc/.claude/schemas/ontology/project-test.test.ts`
- `bunx tsc --noEmit --module esnext --target es2022 --moduleResolution bundler /home/palantirkc/.claude/schemas/ontology/types.ts /home/palantirkc/.claude/schemas/ontology/semantics.ts /home/palantirkc/.claude/schemas/interaction/types.ts /home/palantirkc/.claude/schemas/rendering/types.ts`
- Known environment limitation: direct `bunx tsc` on `project-validator.ts` fails without Bun test typings (`bun:test`) in this standalone schema directory

## 1.9.1 — 2026-03-18

### Fixed (Research-driven source reference audit)
- **32 stale source references** across `semantics.ts`, `data/schema.ts`, `logic/schema.ts`, `action/schema.ts` — 4 deleted research files (`ontology-architecture.md`, `ssot-full-audit-2026-03-17.md`, `_latest-devcon5-aipcon9-research.md`, `devcon-aipcon.md`) replaced with correct paths after 2026-03-18 research library restructure
- **HC-SEC-01** rule text corrected: "All three security layers" → "All four security layers" — model has had 4 layers (RBAC, Markings, Object Security, Cell-Level) since v1.3.0
- **HC-SEC-09** source field updated to include both `object-security.md` and `markings.md` (rule covers both RLS and marking aspects of SearchAround traversal)
- **`AutomationConditionType`** (`action/schema.ts`): added `"timeBased"` member — research documents 7 condition types (1 time-based + 6 object set), schema previously had only 6. Also added to `AUTOMATION_CONDITION_TYPES` array and `CONDITION_TYPE_TO_TRIGGER_MODEL` mapping table
- **HC comment ranges** corrected: `logic/schema.ts` "05..34"→"05..37", `action/schema.ts` "06..28"→"06..37", `data/schema.ts` "06..36"→"06..40"
- **HC-DATA-33 comment** clarified: "removed" → "reassigned" (was reassigned from "required array min 1 item" to "Edit-only properties" in v1.4.0)
- **HC-DATA-26** source field updated from deleted `ontology-architecture.md` to `data/entities.md §DATA.EN-11, §DATA.EN-19`
- **Source path prefixes**: added `.claude/` prefix to HC-LOGIC-35..37 and HC-ACTION-34..35 source fields for consistency
- **`data/schema.ts`**: added missing `StructuralRule` import from `../types` (pre-existing issue)
- **`data/schema.ts` header**: "13 research files" → "15 research files"

### Verified
- 1,044 tests, 0 fail, 6,953 assertions (+2 from `timeBased` mapping table expansion)
- Zero stale source references remaining (verified via grep across all schema files)
- Reference documents updated: MEMORY.md, INDEX.md, ontology-model.md, llm-grounding.md, validation/README.md

## 1.9.0 — 2026-03-17

### Added (Adapter taxonomy + experiment semantics)
- **`EVALUATION_EXPERIMENT_CAPABILITIES`** (`semantics.ts`) — official experiment-level AIP Evals capabilities promoted into typed authority (`EEXP-01..05`)
- **`LOCAL_WORKFLOW_RESOURCE_TAXONOMY`** (`semantics.ts`) — explicit adapter-level 24-resource / 24-edge workflow graph taxonomy promoted from `frontend-dashboard/convex/schema.ts`
- **DS-32** (`semantics.test.ts`) — runtime graph taxonomy integrity checks

### Updated
- `semantics.ts` schema version bumped to `1.9.0`
- `frontend-dashboard/ontology/schema.ts` tracked schema version updated to `1.9.0`

### Verified
- `bun test semantics.test.ts`
- `bunx tsc --noEmit` (frontend-dashboard)
- `bun run test:e2e:local` (frontend-dashboard)

## 1.8.0 — 2026-03-17

### Added (Canonical taxonomy sync)
- **`PALANTIR_MCP_TOOL_CATEGORIES`** (`semantics.ts`) — official 13-category, 65-tool Palantir MCP taxonomy promoted into typed authority
- **`WORKFLOW_LINEAGE_GRAPH_MODEL`** (`semantics.ts`) — official Workflow Lineage graph surface promoted with 10 node types, hidden edge defaults, color legend groups, refactoring capabilities, and AIP usage metrics
- **DS-30 / DS-31** (`semantics.test.ts`) — integrity tests for MCP taxonomy and Workflow Lineage graph model

### Updated
- `semantics.ts` schema version bumped to `1.8.0`
- `frontend-dashboard/ontology/schema.ts` tracked schema version updated to `1.8.0`
- `FOUNDRY_ORCHESTRATION_MAP` builder surface updated from stale `Pilot` wording to active `Agent Studio`

### Verified
- `bun test semantics.test.ts`
- `bunx tsc --noEmit` (frontend-dashboard)

## 1.7.0 — 2026-03-17

### Added (Whole-codebase direction alignment)
- **`FOUNDRY_ORCHESTRATION_MAP`** (`semantics.ts`) — 6-layer directional map (`ORCH-01..06`) binding builder surfaces, ontology core, runtime twin, governance/lineage, LEARN/backprop, and integration surfaces into one explicit architecture
- **`orchestration-map.md`** (`research/palantir/`) — whole-codebase SSoT explaining how the repo should evolve as a Palantir-style digital twin and self-improving decision system
- **DS-29** (`semantics.test.ts`) — orchestration map integrity checks

### Updated
- `semantics.ts` schema version bumped to `1.7.0`
- `frontend-dashboard/ontology/schema.ts` tracked schema version updated and ontology-side orchestration constants added
- `frontend-dashboard/CLAUDE.md` architecture/orchestration sections updated for current route/eval surface counts

### Verified
- 1,021 tests, 0 fail, 6,818 assertions
- frontend-dashboard TypeScript passes
- convex TypeScript passes

## 1.6.0 — 2026-03-17

### Added (DevCon5 / AIPCon9 / AIP Evals alignment)
- **`LEARN_EVALUATION_SURFACES`** (`semantics.ts`) — 5 typed official evaluation surfaces (`LES-01..05`: deterministic, heuristic, rubric grader, custom function, ontology edit simulator) derived from verified AIP Evals docs
- **`PLATFORM_OPEN_SOURCE_BOUNDARY`** (`semantics.ts`) — 3-entry boundary table clarifying what is platform-native vs protocol surface vs official public repo
- **`MCP_PRODUCT_SPLIT`** (`semantics.ts`) — explicit builder-vs-consumer split between `Palantir MCP` and `Ontology MCP`
- **DS-27 / DS-28** (`semantics.test.ts`) — new tests covering LEARN evaluation surfaces, OSS boundary, and MCP split
- **`semantic-audit.ts` SA-11 upgrade** — LEARN-02 now distinguishes simple human feedback from explicit rubric/evaluator support; audit can scaffold `EvaluationRecord` + `recordEvaluation`
- **Audit UI rubric visibility** (`frontend-dashboard/src/components/audit/AuditPanel.tsx`) — latest rubric evaluations and rubric KPIs surfaced in the dashboard

### Updated (Research SSoT alignment)
- **`research/INDEX.md`** — platform file count, schema stats, and latest verified memo injection updated
- **`research/palantir/platform/announcements.md`** — `AIP Evals` added as official LEARN surface with OSS boundary note
- **`philosophy/digital-twin.md`** and **`philosophy/tribal-knowledge.md`** — LEARN-02 now explicitly references rubric/evaluator surfaces from official AIP Evals docs
- **`architecture/ontology-model.md`** status line updated to current test/assertion totals and schema version

### Verified
- 1,016 tests, 0 fail, 6,808 assertions
- `bunx tsc --noEmit -p tsconfig.json` (frontend-dashboard) passes
- `bunx tsc --noEmit -p convex/tsconfig.json` passes

## 1.3.0 — 2026-03-14

### Added (Enforcement Absorption — enforcement/ → philosophy/ + semantics.ts)
- **`OPERATIONAL_CONTEXT_EXAMPLES`** (`semantics.ts`) — 5 real-world AIPCon deployments (GE Aerospace, ShipOS, Centrus, World View, Freedom Mortgage) decomposed into DATA/LOGIC/ACTION/LEARN in operational context. Anchored in developer statement: "The semantics HAVE to be more than just data, and they have to be modeled how the real world is actually working."
- **`LEARN_MECHANISMS`** (`semantics.ts`) — 3 typed mechanisms (LEARN-01 Write-Back, LEARN-02 Evaluation Feedback, LEARN-03 Decision Outcome Tracking) defining HOW the LEARN stage feeds outcomes back into the twin
- **`ACTION_GOVERNANCE`** (`semantics.ts`) — 5 governance dimensions (AG-01..05: who/conditions/review/changes/trace) with cross-references to existing enforcement constants (SECURITY_OVERLAY, HC-ACTION-05, PROGRESSIVE_AUTONOMY_LEVELS, DECISION_LINEAGE)
- **`TWIN_FIDELITY_DIMENSIONS`** (`semantics.ts`) — 5 dimensions (TF-01..05: Entity Correspondence, Relationship Faithfulness, Interpretation Consistency, Action Determinism, Temporal Coherence) showing without/with semantic modeling contrast
- **`TWIN_MATURITY_STAGES`** (`semantics.ts`) — 5-stage twin progression (Snapshot→Mirror→Model→Operator→Living System) with cumulative semantic requirements per stage
- **DS-13..DS-16 test groups** (`semantics.test.ts`) — 4 new test groups with ~50 tests covering all new constants + cross-constant connection integrity
- **`digital-twin.md`** — expanded LEARN section (3 mechanisms), Twin Fidelity table, Twin Maturity progression, Governance-Enables-Autonomy, Graduation Pattern, AIPCon additions (GE 26%, Centrus nuclear)
- **`llm-grounding.md`** — Ontology-Grounded Agents section (tool surfacing, agent composition patterns, Agent Studio)
- **`ontology-ultimate-vision.md`** — §4.5 Enforcement Mechanisms (Workflow Lineage, Scenarios/COA, Action Governance), §8 Operational Context Modeling, AIPCon 9 additions (GE BOM, Centrus nuclear, US CDAO COA)
- **`tribal-knowledge.md`** — Stage 4 gap expanded with 3 LEARN mechanisms, LEARN-02/03 cross-references in feedback loop
- **`README.md`** — Developer's Core Statement, Typed Constants table (12 philosophy→code mappings)

### Removed (Enforcement Directory — redundant with philosophy/ + cc-runtime-constraints.md)
- **`research/palantir/enforcement/`** (6 files, ~540 lines) — aip-automate.md, decision-lineage.md, agent-architecture.md, digital-twin-feedback.md, action-governance.md, README.md. All unique content absorbed into philosophy/ files and semantics.ts typed constants.
- **Rationale:** enforcement/ was a redundant intermediate layer between philosophy/ (WHY) and cc-runtime-constraints.md (adapter gaps). 80-90% overlap with existing content. Unique content (AIPCon quotes, LEARN mechanisms, governance model) now lives as typed constants in semantics.ts with test coverage.

### Removed (Architecture Cleanup — schemas/ = ontology/ only)
- **`schemas/types.ts`** (198 lines) — adapter bridge; ontology/ never imported it
- **`schemas/convex/`** (~6,000 lines, ~35 files) — translation tables + DH-SEC ID collision with ontology/security/
- **`schemas/frontend/`** (~2,620 lines, ~10 files) — tech-stack UI mapping tables
- **`schemas/cross-pipeline/`** (464 lines, 3 files) — adapter consistency tests
- **`schemas/frontend-ontology-check/`** (1,326 lines, 7 files) — project-level validation tool
- **`schemas/lsp-audit/`** (1,578 lines, 15 files) — skill internal infrastructure
- **`schemas/polish/`** (3,590 lines, 16 files) — QA skill internal infrastructure
- **Total removed: ~15,776 lines across ~87 files**
- **Rationale:** These were adapter translation tables, code generation templates, and operational tools masquerading as semantic definitions. Ontology defines WHAT things mean; adapters compile at skill execution time. Tools belong in skills/, not schemas/.
- **SEMANTIC_COMPILATION_PIPELINE Stage 3** updated: removed bridge reference, now reads "schemas/ontology/ (semantic SSoT) → skill-time compilation → convex/schema.ts + src/"
- **Key finding:** convex/security.ts had DH-SEC-01..08 with DIFFERENT questions from ontology/security/schema.ts — same IDs, different content = K-LLM consistency violation. Resolved by deletion.

### Verified
- 716 tests, 0 fail, 4764 assertions — identical to pre-cleanup baseline

## 1.2.1 — 2026-03-14

### Fixed (Upstream Documentation Staleness)
- **`tribal-knowledge.md`** — DH count updated from 34→36 (LOGIC 12→13, ACTION 12→13), HC count updated from 76+→92 (added HC-SEC-01..12 to tally). DH-LOGIC-13 (toolExposure) and DH-ACTION-13 (progressive autonomy) were added in v1.2.0 but upstream philosophy doc was not synced.
- **`semantics.ts` SEMANTIC_COMPILATION_PIPELINE** — Stage 3 `ourMapping` updated to include `schemas/types.ts` bridge layer in the dataflow path: `schemas/ontology/ → schemas/types.ts (type bridge) → schemas/{convex,frontend}/ → convex/schema.ts`

### Verified (Full Deep Dive Audit)
- 752 tests, 0 failures, 4962 assertions across 8 schema test files
- All 13 philosophy-derived requirements (REQ-01..REQ-13) verified against code
- Cross-domain CI-01..CI-09 invariants: all hold
- DH counts confirmed: DATA=10, LOGIC=13, ACTION=13, SECURITY=8 (total 44 including security)
- HC counts confirmed: DATA=23, LOGIC=29, ACTION=28, SECURITY=12 (total 92)
- Type bridge: 19 BasePropertyType → 24 OntologyPropertyType mapping verified bidirectional
- Dataflow: research/palantir/ → schemas/ontology/ → schemas/types.ts → schemas/{convex,frontend}/ → schemas/cross-pipeline/ verified intact

## 1.2.0 — 2026-03-14

### Reverted (OOSD-02 Compliance — v1.3.0 contamination removed)
- **`RuntimeViability` type** removed from `semantics.ts` — execution-environment concern (WHERE things run) does not belong in semantic definitions (WHAT things mean)
- **`HardConstraint.runtimeViability?`** optional field removed — HardConstraints define platform rules, not adapter capability
- **`HallucinationReductionPattern.runtimeViability`** field and values (HRP-01..03) removed
- **`ProgressiveAutonomyLevel.runtimeViability`** field and values (PA-01..05) removed
- **Section 11** (`CCRuntimeConstraint` interface + `CC_RUNTIME_CONSTRAINTS` array, ~64 lines) deleted entirely
- **`security/schema.ts`** — `runtimeViability` removed from all 12 HC-SEC constraints
- **SCHEMA_VERSION** held at `"1.2.0"` in all 5 schema files (v1.3.0 was never released)
- **Governance reframe**: `rules/cc-runtime-constraints.md` rewritten from "Declaration vs Enforcement" to "Schema = Semantics, Adapter = Implementation" — zero viability annotations
- **Research reframe**: `research/claude-code/runtime-constraints.md` reframed from "Conflict Matrix" (CCR-*) to "Adapter Gap Matrix" (AGM-*) with 2-step decision tree (semantic classification → adapter assessment)

### Added (DATA Domain Deep Dive)
- **`PLATFORM_EXTENDED_BASE_TYPES`** (`data/schema.ts`) — `byte`, `decimal`, `short` — Palantir platform types excluded from core 19 `BasePropertyType` because they map to existing Convex primitives with no semantic distinction
- **`UNIVERSAL_FILTER_OPS`** (`data/schema.ts`) — `hasProperty` null check available on ALL property types
- **`OSDK_FILTER_OPERATORS`** (`data/schema.ts`) — 13 declarative where-clause operators (`$eq`, `$gt`, `$isNull`, `$or`, etc.) for OSDK 2.0 filter syntax
- **`TIMESERIES_STREAM_AGGREGATION_METHODS`** (`data/schema.ts`) — 11 server-side aggregation methods (SUM, MEAN, STANDARD_DEVIATION, etc.)
- **`TIMESERIES_STREAM_STRATEGIES`** (`data/schema.ts`) — 3 strategies (CUMULATIVE, ROLLING, PERIODIC)
- **`TIMESERIES_RESPONSE_FORMATS`** (`data/schema.ts`) — JSON, ARROW
- **`OSDK_TYPE_SUPPORT`** (`data/schema.ts`) — Consolidated OSDK language support matrix for 9 special types (cipher, vector, struct, timeseries, etc.) — previously scattered across 5+ research files
- **`OSV_FEATURE_COMPARISON`** (`data/schema.ts`) — Object Storage V1 vs V2 capability matrix (6 features)
- **`STRUCT_CONSTRAINTS`** (`data/schema.ts`) — Explicit typed constants: NON_FILTERABLE, MAX_NESTING_DEPTH, PARTIAL_UPDATE_SUPPORTED, INDIVIDUAL_FIELD_REQUIRED, RID_INHERITANCE
- **`text-embedding-3-large`** added to `EMBEDDING_MODELS` with note about exceeding 2048 platform limit
- **3 new test groups** (`data/schema.test.ts`) — DD-10 (Platform Extended Types), DD-11 (OSDK Support Matrix), DD-12 (TimeSeries/OSv Constants)

### Added (Progressive Autonomy — `semantics.ts`)
- **`PROGRESSIVE_AUTONOMY_LEVELS`** — 5-level typed constant (Monitor→Recommend→Approve-then-act→Act-then-inform→Full autonomy) with descriptions, examples, and primaryDomain mapping. Closes the last philosophy→domain gap: `digital-twin.md §Progressive Autonomy` → `semantics.ts` → `action/schema.ts AUTONOMY_LEVELS`

### Added (Philosophy Meta-Layer — `semantics.ts`)
- **`DECISION_LINEAGE`** — 5 dimensions (WHEN/ATOP/THROUGH/BY/WITH) of the LEARN feedback mechanism
- **`HALLUCINATION_REDUCTION_PATTERNS`** — 3 official Palantir patterns (OAG→DATA, Logic Tools→LOGIC, Action Review→ACTION), each with domain mapping and system implications
- **`TRIBAL_KNOWLEDGE_PROGRESSION`** — 5-stage maturity model (Tribal Knowledge→DecisionHeuristic→LLM Tools→Institutional Memory→Autonomous Reasoning) with `ourSystemState` markers
- **`SEMANTIC_COMPILATION_PIPELINE`** — 4-stage pipeline (Business Language→Domain Modeling→Schema Compilation→Logic Binding) with `ourMapping` to project structure
- **`K_LLM`** — Multi-model consensus definition (mechanism, our implementation, principle)
- **`OOSD_PRINCIPLES`** — 4 principles (Code in Business Language, Abstraction, Marginal Cost→Zero, Defragmented Enterprise)
- **DS-10 test groups** (`semantics.test.ts`) — 6 sub-groups covering all philosophy constants (21 new tests)

### Added (LOGIC Domain Deep Dive)
- **`FUNCTION_RUNTIME_FEATURES`** (`logic/schema.ts`) — 11-entry v1 vs v2 feature support matrix (EditBatch, interface params, OSDK integration, deployed execution, class-based functions, BYOM, etc.)
- **`EDIT_COLLAPSE_RULES`** (`logic/schema.ts`) — 5 typed rules for edit merging semantics (property collapse, link order preservation, create→update collapse, modify→delete, create→delete no-op) with Freudenthal paradigmatic example in JSDoc
- **DL-10 test groups** (`logic/schema.test.ts`) — 12 new tests for runtime features and collapse rules

### Added (ACTION Domain Deep Dive)
- **`SIMPLE_RULE_COMPOSITION`** (`action/schema.ts`) — 8 typed rules for declarative rule interaction (collapse, ordering, FK vs M:N link rule selection, function exclusivity) with Freudenthal paradigmatic example in JSDoc
- **`WRITEBACK_OUTPUT_FLOW`** (`action/schema.ts`) — 5 typed constants for the writeback webhook output parameter architecture (external system response → subsequent ontology rule input)
- **`INLINE_EDIT_CONSTRAINTS`** (`action/schema.ts`) — 7 typed constraints for inline edit mode (single object, no join links, no side effects, self-only criteria)
- **DA-10 test groups** (`action/schema.test.ts`) — 19 new tests for rule composition, writeback flow, inline constraints

### Changed
- **`SCHEMA_VERSION`** → `"1.2.0"` in `data/schema.ts`, `semantics.ts`, `logic/schema.ts`, and `action/schema.ts`
- **EMBEDDING_MODELS count** — 4 → 5 entries

### Added (Cross-Domain Connection Integrity — `semantics.test.ts`)
- **DS-11 test group** — 6 sub-groups verifying philosophy→domain linkage:
  - HRP→Domain Heuristic Connection (6 tests) — each `HALLUCINATION_REDUCTION_PATTERNS[].primaryDomain` has corresponding `*_HEURISTICS` with entries
  - Tribal Knowledge Stage→System State Reality (9 tests) — stages 1-3 "achieved" backed by real DH/HC constants; stages 4-5 "future" reference existing constants
  - Semantic Compilation Pipeline→File Path Validity (5 tests) — each stage's `ourMapping` references valid project paths
  - Philosophy Constant Counts (6 tests) — OOSD=4, DECISION_LINEAGE=5, HRP=3, TKP=5, SCP=4, K_LLM=3 fields
  - Schema Version Alignment (3 tests) — all schema files at 1.2.0
  - Cross-Domain HC Consistency (6 tests) — HC-{DOMAIN}-NN pattern, no duplicate IDs, all severity=error, HC-LOGIC-15 PK immutability cross-ref
  - Progressive Autonomy → Domain Connection (7 tests) — PA-01..05 levels match action/schema.ts AUTONOMY_LEVELS, domain progression data→logic→action

### Changed (Security Version Alignment)
- **`SCHEMA_VERSION`** → `"1.2.0"` in `security/schema.ts` — no structural changes, aligned for consistency across all 5 schema files

### Test Results
- 716 pass / 0 fail across ontology (7 files) — 4,764 assertions

## 1.1.1 — 2026-03-14

### Changed
- **Type Bridge Consolidation** — `schemas/types.ts` now imports `BasePropertyType` from `ontology/types.ts` and exports canonical `ALL_ONTOLOGY_PROPERTY_TYPES`, `CASING_NORMALIZATION`, `TYPE_MODIFIERS`, `normalizeBaseType()`, `toBaseType()`
- **SSoT deduplication** — `cross-pipeline/types.ts` and `convex/types.ts` now re-export from bridge instead of hardcoding constants
- **Test infra dedup** — `convex/types.ts` imports `TestResult`, `DomainGateResult`, `TestSeverity` from `ontology/types.ts` instead of redefining
- **Helper dedup** — `convex/helpers.ts` re-exports `isPascalCase`, `isCamelCase`, `isValidPlural` from `ontology/helpers.ts` instead of duplicating
- **JSDoc clarification** — both `StructuralRule` interfaces (ontology naming vs adapter codegen) now have clear JSDoc distinguishing their purposes

### Test Results
- 722 pass / 0 fail across ontology (594), frontend (92), cross-pipeline (36) — 5,003 assertions

## 1.1.0 — 2026-03-14

### Added
- **Philosophy meta-layer** (`research/palantir/philosophy/`) — README.md, tribal-knowledge.md, llm-grounding.md, digital-twin.md
- **Security governance overlay** (`semantics.ts`) — `GovernanceOverlaySemantics` interface + `SECURITY_OVERLAY` constant; security is a typed governance overlay, not a 4th domain
- **6 new adapter constraints** (`convex/security.ts`) — AC-SEC-07..12 covering RLS index requirement, CLS return types, marking deny-on-unknown, action auth propagation, scheduled function auth, env var secrets
- **3 new decision heuristics** (`convex/security.ts`) — DH-SEC-06 (role count strategy), DH-SEC-07 (union semantics), DH-SEC-08 (interface permissions)
- **DH/HC backport** to research SSoT — all 34 DH and 76+ HC now documented in upstream research topic files
- **Worked examples** in entry/ domain — SaveTicker requirements capture and decomposition
- **Cross-domain contracts** (`validation/cross-domain-contracts.md`) — contract triangle enforcement patterns

### Fixed
- **Stale reference** (`semantics.ts:17`) — `vision.md` → `architecture/ontology-model.md`
- **Heuristic IDs** (`convex/security.ts`) — informal IDs mapped to DH-SEC-01..05 format
- **Domain README cross-refs** — all 5 domain READMEs updated to reference `architecture/ontology-model.md` instead of archived `vision.md`/`adaptation.md`

### Changed
- **`SCHEMA_VERSION`** → `"1.1.0"` in all 5 schema files

## 1.0.0 — 2026-03-13

Initial versioned release. Baseline established from Ontology Schema Audit (score 8.4/10, 368 tests).

### Added
- **Security governance overlay** (`security/schema.ts`) — 8-section schema with 12 hard constraints, 8 heuristics, 6 mapping tables, 4 structural rules, 6 thresholds
- **Centralized `StructuralRule`** in `types.ts` — removed 3 duplicate definitions from data/logic/action schemas
- **Unified heuristic quality bar** — all domains enforce >=600 chars + COUNTER-EXAMPLE in `realWorldExample`
- **Expanded `visual.html`** — 88 hard constraints (was 14) with SECURITY domain and filter toggles
- **Helper functions** (`helpers.ts`) — `validateApiName`, `validateBilingualDesc`, `validateHardConstraintId`, `validateHeuristicId`, `generateSchemaStats`
- **`SCHEMA_VERSION = "1.0.0"`** in all schema files (`semantics.ts`, `data/schema.ts`, `logic/schema.ts`, `action/schema.ts`, `security/schema.ts`)

### Test coverage
- 84 security tests (DS-0..DS-8)
- 34 helper tests (HLP-0..HLP-5)
- Semver format tests in all 5 schema test files
