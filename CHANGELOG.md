# @palantirKC/claude-schemas — CHANGELOG

Root-level aggregator. Each axis has its own CHANGELOG:
- `ontology/CHANGELOG.md` (canonical for ontology axis, currently at v1.12.0)
- `interaction/` (no CHANGELOG; see types.ts version constants)
- `meta/` (no CHANGELOG; see types.ts)
- `rendering/` (no CHANGELOG; see types.ts)

---

## [1.15.0] — 2026-04-20

### Added — PedagogyContract primitive (mathcrew H4 Sprint 2)

- **`ontology/primitives/pedagogy-contract.ts`** (LEARN, `prim-learn-12`) — Composable pedagogy plug-in framework promoted from mathcrew project-local `ontology/pedagogy.ts`. Declares `PedagogyContract` (conceptId + bloomTarget + pedagogies[] + cognitiveLoad), `PedagogyApplication` (id + role + params), `PedagogyParams` discriminated union over 4 PedagogyId variants (cpa / productive-failure / constructionism / variation-theory), plus CognitiveLoadConstraint meta-audit shape. Provenance: CPA = Bruner (1966) → Singapore Math; PF = Kapur (2008-2024); Constructionism = Papert (1980); VT = Marton; Bloom = Anderson & Krathwohl (CLASSIFICATION axis only); CLT = Sweller (META-CONSTRAINT only). Registry mirrors HARNESS_AGENT_REGISTRY pattern (in-memory, consumer-populated at startup).

### Added — feedback_loop_closed event type split (H3 D4 fix)

- **`ontology/primitives/feedback-loop-closed.ts`** (DATA, `prim-data-09`) — Declares `FeedbackLoopClosedPayload` + `FeedbackLoopClosedTerminationCondition` so the terminal-state transition has its own schema. Cleaner Decision Lineage: "when did this loop open" = filter by `feedback_loop_opened`; "when did it close" = filter by `feedback_loop_closed`. Replaces the v1.14 pattern of overloading FeedbackLoopOpenedEnvelope with `payload.transition: "close"`.
- **`ontology/lineage/event-types.ts`** — EVENT_TYPE_NAMES + EVENT_TYPE_REGISTRY expanded 35 → 36; new `feedback_loop_closed` entry (primaryDomain: logic).

### Deprecated — one MINOR cycle (removal in v1.16)

- Producers SHOULD emit `feedback_loop_closed` instead of `feedback_loop_opened` with `payload.transition: "close"`.
- Consumers SHOULD accept BOTH variants during v1.15. `FeedbackLoopOpenedEnvelope` retains optional `transition` / `verdict` / `terminationCondition` fields for backward compatibility.
- v1.16 will remove the deprecated overload fields.

### Consumer impact

- palantir-mini plugin bumps `compatibleSchemaVersions` `>=1.14.0 <2.0.0` → `>=1.15.0 <2.0.0` (v2.0.2 PATCH). `close-feedback-loop.ts` handler emits `feedback_loop_closed` (new type) instead of `feedback_loop_opened` with transition overload. EventSnapshot fold + switch gain a new counter (exhaustive union coverage preserved).
- mathcrew bumps peerDep to `>=1.15.0 <2.0.0` (Sprint 2 P1); project-local `ontology/pedagogy.ts` becomes a thin re-export.
- shared-core (`~/ontology/shared-core/`) bumps version 1.1.0 → 1.2.0 and re-exports `pedagogy-contract` + `feedback-loop-closed`.
- palantir-math / kosmos — untouched; additive surface, pin compatibility preserved.

### Authority + provenance

- `research/palantir-vision/synthesis/2026-04-20-mathcrew-redesign-research.md` §Topic 2 — PedagogyContract framework spec.
- `research/claude-code/harness-h3-retrospective.md` §D4 — feedback_loop_closed split rationale.

### Why MINOR

All changes are additive: 2 new primitive files, 1 new event type, 2 new subpath exports, deprecation notice on existing `FeedbackLoopOpenedEnvelope` (fields retained). Consumers pinned at `^1.14.0` (inclusive of `1.14.0 ≤ x < 2.0.0`) continue to work untouched; those that don't import the new primitives remain untouched. Per rule 08, additive primitive surface → MINOR bump.

---

## [1.14.0] — 2026-04-20

### Added — 5 harness primitives + 6 lifecycle events (palantir-mini v2.0 substrate)
v1.14.0 lands the ontology substrate for the 3-agent harness (Planner / Generator / Evaluator + Orchestrator + AIP Evals 4-grader specializations) that palantir-mini v2.0 will consume as its runtime layer. Purely additive — consumer projects (kosmos, palantir-math, mathcrew, palantir-mini v1.6.x) pinned at `^1.13.0` continue to work; plugin `compatibleSchemaVersions` range `>=1.13.0 <2.0.0` covers this bump.

Design rationale: merges Prithvi Rajasekaran's Anthropic Labs harness pattern (3-agent GAN-inspired separation; research/claude-code/features.md §26) with Palantir AIP Evals 5-evaluator taxonomy (research/palantir-foundry/aip/aip-evals-*.md, 10 verbatim official docs) so that Prithvi's 4-criteria frontend rubric (Design / Originality / Craft / Functionality) is recoverable as one domain-specific instance of a GradingRubric assembled from GradingCriterion primitives, while 3D-scene / ontology-audit / teaching / backend rubrics compose from the same primitive.

- **5 new primitive files** under `ontology/primitives/`:
  - `harness-agent.ts` (LEARN, `prim-learn-11`) — HarnessAgentRid + HarnessAgentRole (8 roles: planner/generator/evaluator/orchestrator/grader_code/grader_rule/grader_model/grader_human) + HarnessAgentPhase + HarnessAgentDeclaration + registry. Binds agent .md frontmatter semantics to an ontology primitive so the phase-gate (SubagentStop) + model-SoT (Lead Protocol v2 §Model policy) + output-contract validation surfaces have a shared type.
  - `sprint-contract.ts` (ACTION, `prim-action-05`) — SprintContractRid + FeatureSpecRef + HardThresholdPolicy (per-criterion floors + overall ceiling) + SprintContractDeclaration + registry. File-based Generator↔Evaluator agreement defining "what done looks like"; mirrors Palantir Two-Tier Action (Tier-2 function-backed). Status state machine: drafting → negotiating → bound (frozen) → aborted.
  - `feedback-loop.ts` (LOGIC, `prim-logic-04`) — FeedbackLoopRid + FeedbackLoopState (7-state machine: negotiating / generating / evaluating / feedback / passed / failed / aborted) + TerminationCondition + FeedbackLoopDeclaration + registry. Tracks Generator↔Evaluator iteration loop for a bound SprintContract; iteration cap 5-15 per Prithvi's paper.
  - `grading-criterion.ts` (DATA, `prim-data-08`) — GradingCriterionRid + RubricDomain (5: code/rule/model/human/hybrid — AIP Evals 5-evaluator) + CriterionApplicability (9-domain scope) + PassFailLogic + GradingCriterionDeclaration + registry. Composable atom — rubrics are ordered Set<GradingCriterion> with sum(weightInRubric)=1.0.
  - `playwright-scenario.ts` (LEARN, `prim-learn-04`) — PlaywrightScenarioRid + 17 PlaywrightStepKind + PlaywrightStep + EvidenceCaptureSpec + PlaywrightMcpBinding (mcp__playwright__* | mcp__claude-in-chrome__*) + PlaywrightScenarioDeclaration + registry. Live-app browser automation scenario — Evaluator substrate for evidence-based QA.

- **`ontology/primitives/index.ts`** — barrel updated to v1.14.0, re-exports all 5 new primitives; inventory comment now lists 26 files (21 → 26).

- **EVENT_TYPE_REGISTRY expanded 29→35** in `ontology/lineage/event-types.ts`:
  - `harness_agent_spawned` (LEARN)
  - `sprint_contract_negotiated` (ACTION)
  - `sprint_contract_bound` (ACTION)
  - `feedback_loop_opened` (LOGIC)
  - `playwright_scenario_executed` (LEARN)
  - `grading_completed` (LEARN)

- **New `package.json` subpath exports** — 5 new entries (one per harness primitive) under `./ontology/primitives/*`.

- **`~/ontology/shared-core/index.ts`** — 5 harness primitive re-exports added; `SHARED_CORE_VERSION` bumped `1.0.0` → `1.1.0`.

### Authority + provenance
- Primary synthesis: Prithvi Rajasekaran (Anthropic Labs) — https://www.anthropic.com/engineering/harness-design-long-running-apps (referenced via research/claude-code/features.md + features.md §Managed Agents)
- AIP Evals alignment: research/palantir-foundry/aip/aip-evals-*.md (10 files, 2026-04-20 fetch)
- Lead Protocol v2 integration: research/claude-code/lead-system-v2.md §3 (frontmatter spec), §5 (protocol principles)
- Managed Agents Session/Harness/Sandbox mirroring: research/palantir-vision/synthesis/2026-04-20-managed-agents-harness-mapping.md (closes gap #1 — "No Outcomes-style grader loop")

### Why MINOR
All changes are additive: new primitive files, new event types, new subpath exports. No existing type shapes renamed, no existing semantics changed, no validator behavior altered. Consumers pinned at `^1.13.0` (inclusive of `1.13.0 ≤ x < 2.0.0`) gain access to new primitives by import; those that don't import remain untouched. Per rule 08 (`~/.claude/rules/08-schema-versioning.md`), additive primitive surface → MINOR bump.

### Consumer impact
- palantir-mini plugin (`compatibleSchemaVersions >=1.13.0 <2.0.0`) — compatible, no version pin update required. Phase H2 consumes this surface via 5 new MCP handlers + 6 new agents.
- Downstream repos (kosmos, palantir-math, mathcrew) — additive, no migration needed. mathcrew ontology refactor (Phase H4) will adopt these primitives.

---

## [1.13.1] — 2026-04-19

### Changed — ontology/project-validator.ts file-structure refactor (D2, steward-splits)
Split 1265-LOC `ontology/project-validator.ts` into 8 sub-files under
`ontology/project-validator/` plus a barrel. Externally additive: all prior
exports reachable through the unchanged `ontology/project-validator.ts`
barrel; consumer imports continue to resolve.

- **New subfolder** `ontology/project-validator/` containing:
  - `pv-01-naming.ts` (~81 LOC) — `validateNaming`,
    `RESERVED_FRONTEND_ACTION_PREFIXES`, `isReservedFrontendAction`
  - `pv-02-referential.ts` (~118 LOC) — `validateReferentialIntegrity`
  - `pv-03-hc-compliance.ts` (~58 LOC) — `validateHcCompliance`
  - `pv-04-structural.ts` (~72 LOC) — `validateStructuralCompleteness`
  - `pv-05-propagation.ts` (~80 LOC) — `validatePropagationGraph`
  - `pv-07-frontend.ts` (~116 LOC) — `validateFrontendOntology`
  - `pv-08-runtime.ts` (~165 LOC) — `validateRuntimeOntology`
  - `pv-runner.ts` (~609 LOC) — `runProjectValidation` orchestrator +
    `validateProjectOntology` (no-test structured-report API; contains
    inline PV-01..07 + PV-06 security checks)
  - `index.ts` — subfolder barrel
- **`ontology/project-validator.ts`** rewritten as 52-line re-export barrel.
- Each PV-0X sub-file is ≤ 200 LOC per task spec; `pv-runner.ts` exceeds
  the target because it houses the non-test `validateProjectOntology`
  inline form (duplicated logic for PV-01..07 + PV-06). Future work may
  collapse this duplication by sharing the per-PV helpers.

### Changed — ontology/semantic-audit.ts file-structure refactor (D3, steward-splits)
Split 1153-LOC `ontology/semantic-audit.ts` into 3 sub-files under
`ontology/semantic-audit/` plus a barrel. Externally additive: all prior
exports reachable through the unchanged `ontology/semantic-audit.ts`
barrel; consumer imports (`from "./semantic-audit"`) continue to resolve.

- **New subfolder** `ontology/semantic-audit/` containing:
  - `sa-types.ts` (~70 LOC) — `CoverageLevel`, `UpgradePriority`,
    `EvidenceKind`, `SectionAudit`, `UpgradeSpec`, `SemanticAuditReport`
  - `sa-core.ts` (~1046 LOC) — `auditSemantics(exports)` monolith kept
    intact. Walks all 32 SA sections, computes maturity stage, builds
    upgrade specs. Deeper per-axis split (twin layers / HRP / LEARN /
    security / infrastructure / frontend-runtime) is deferred because
    the sections share local computations (e.g. `learnActive`,
    `toolExposedFns`) that would otherwise need a shared `AuditContext`
    refactor — flagged as a follow-up.
  - `sa-runner.ts` (~56 LOC) — `runSemanticAudit(exports)` bun:test
    driver
  - `index.ts` — subfolder barrel (parent barrel is still canonical)
- **`ontology/semantic-audit.ts`** rewritten as 32-line re-export barrel.
- **Note**: `sa-core.ts` exceeds the 700-LOC target. Deferring the deeper
  per-axis refactor preserves behavior parity and keeps this PR scoped
  to a safe structural split. Future work: extract `AuditContext` +
  per-axis section builders (`auditTwinLayers(ctx)`, `auditHrp(ctx)`,
  `auditLearn(ctx)`, `auditSecurity(ctx)`, `auditInfrastructure(ctx)`,
  `auditFrontendRuntime(ctx)`) returning `SectionAudit[]`, composed by
  `auditSemantics` orchestrator.

### Changed — ontology/types.ts file-structure refactor (D4, steward-splits)
Split 894-LOC `ontology/types.ts` into 6 sub-files under `ontology/types/`
matching the six primitive families. Externally additive: all prior exports
remain reachable through the unchanged `ontology/types.ts` barrel; consumer
imports (`from "../types"`) continue to resolve.

- **New subfolder** `ontology/types/` containing:
  - `types-core.ts` (~242 LOC) — test infrastructure (TestResult,
    DomainGateResult), shared enums/unions (OntologyDomain,
    OntologyPropertyType, BasePropertyType, LinkCardinality, MutationType,
    QueryType, FunctionCategory, AutonomyLevel, PermissionModel,
    MarkingType, CrudOperation, ImplementationStatus, etc.), StructuralRule,
    BilingualDesc, ValueConstraint, PropagationEdge/Graph, SemanticIssue,
    VALID_PK_TYPES / VALID_BASE_TYPES / SPECIAL_TYPES
  - `types-data.ts` (~148 LOC) — DATA entity shapes (Property, ObjectType,
    ValueType, StructType, SharedPropertyType, geo/temporal/vector/cipher,
    DerivedProperty, OntologyData)
  - `types-logic.ts` (~88 LOC) — LOGIC shapes (LinkType, OntologyInterface,
    OntologyQuery, Parameter, OntologyFunction, OntologyLogic)
  - `types-action.ts` (~76 LOC) — ACTION shapes (OntologyMutation, Webhook,
    Automation, OntologyAction)
  - `types-security.ts` (~80 LOC) — SECURITY shapes (Role, Marking,
    RLSPolicy, CLSPolicy, Object/PropertySecurityPolicy, OntologySecurity)
  - `types-learn.ts` (~325 LOC) — HookEventSchema, LearnInfrastructure,
    BackendOntology, FrontendOntology (views, agent surfaces, scenario
    flows), RuntimeOntology (source/write/review/transaction/audit/support/
    view bindings), ProjectOntologyScope, OntologyExports
  - `index.ts` — subfolder barrel (parent barrel is still canonical)
- **`ontology/types.ts`** rewritten as 30-line star-re-export barrel.
- All cross-file imports resolve at load time via explicit per-file `import
  type` declarations; no implicit global scope relied on.

### Changed — ontology/semantics.ts file-structure refactor (D1, steward-splits)
Split 3549-LOC `ontology/semantics.ts` into 6 sub-files under `ontology/semantics/`
to bring the module under the per-file complexity budget. Externally additive:
all prior exports remain reachable through the unchanged `ontology/semantics.ts`
barrel (consumers keep `from "../semantics"` imports; package export map
`./ontology/semantics` resolves to the same file).

- **New subfolder** `ontology/semantics/` containing:
  - `semantics-core.ts` (~495 LOC) — terminology charter, base types,
    heuristics, transitions, `DOMAIN_SEMANTICS`, `DIGITAL_TWIN_LOOP`,
    `CONCEPT_OWNER`, `CONSISTENCY_INVARIANTS`
  - `semantics-security.ts` (~72 LOC) — `SECURITY_OVERLAY` + overlay type
  - `semantics-data.ts` (~172 LOC) — `DATA_SEMANTICS`
  - `semantics-logic.ts` (~174 LOC) — `LOGIC_SEMANTICS`
  - `semantics-action.ts` (~172 LOC) — `ACTION_SEMANTICS`
  - `semantics-learn.ts` (~2524 LOC) — philosophy meta-layer, LEARN
    mechanisms, twin fidelity/maturity, evaluation taxonomy, LEARN
    evaluation surfaces, workflow lineage, Ontology MCP, scenarios,
    platform boundary, orchestration map, governance surfaces
  - `index.ts` — subfolder barrel (parent barrel is still canonical)
- **`ontology/semantics.ts`** rewritten as 32-line star-re-export barrel.
- **No semantic change**: identical export surface, identical constant
  values, identical `SCHEMA_VERSION = "1.12.0"`.
- **Note**: `semantics-learn.ts` exceeds the 700-LOC target because the
  task spec fixes the file count at 6 and learn-axis cross-references are
  best kept co-located. A future MAJOR may split it further
  (learn-philosophy / learn-governance / learn-ops).

### Why PATCH
Pure file-structure refactor — no added, removed, or renamed exports.
ForwardProp chain (~/.claude/schemas/ → ~/ontology/shared-core/ → consumers)
unaffected; barrel import paths preserved. Per rule 08, structural
refactors with identical public surface are PATCH.

---

## [1.13.0] — 2026-04-19

### Added — governance primitive surface (palantir-mini v1.3 substrate)
v1.13.0 lands the 12-primitive governance surface that palantir-mini v1.3 needs for
Context Engineering (impact queries), BackwardProp closure, schema-pin verification,
dead-code reaping, file-budget audits, managed-settings drift detection, and doc-drift
tracking. Purely additive — all pre-existing exports, type shapes, and semantics are
preserved.

- **12 new primitive files** under `ontology/primitives/`:
  - `research-document.ts` (LEARN) — ResearchDocumentRid + declaration + registry
  - `memory-index-entry.ts` (LEARN) — MEMORY.md index-line primitive
  - `claude-code-version.ts` (LEARN) — runtime version pin primitive
  - `hook-event-allowlist.ts` (LEARN) — which events a hook may observe
  - `plugin-manifest.ts` (LEARN) — typed plugin.json mirror
  - `project-schema-pin.ts` (LEARN) — rule 08 pin-verification substrate
  - `file-complexity-budget.ts` (LEARN) — per-path line/symbol budgets (+ 3 default budgets)
  - `dead-code-marker.ts` (LEARN) — gated/@deprecated tracking with reapableAfter
  - `lineage-conformance-policy.ts` (LEARN) — 5-dim requirement policy (+ DEFAULT_POLICY + SESSION_STARTED_POLICY)
  - `managed-settings-fragment.ts` (LEARN) — typed RBAC fragment + drift audit
  - `codegen-header-contract.ts` (LEARN) — rule 11 header contract (+ DEFAULT_CONTRACT)
  - `impact-edge.ts` (LEARN, **CRITICAL**) — Context Engineering graph substrate with O(1) forward/backward + walkTransitive
- **`ontology/primitives/index.ts`** — new barrel re-exporting all 21 primitive files
- **EVENT_TYPE_REGISTRY expanded 16→20** in `ontology/lineage/event-types.ts`:
  `doc_drift_detected`, `refinement_proposed`, `review_decision`, `impact_edge_registered`
  (all LEARN domain)
- **`BACKWARD_PROP_V1`** in `ontology/policies/propagation.ts` — closes the two V0
  non-durable gaps (refinement persistence + ontologist review as LEARN event)
  via the new `refinement_proposed` + `review_decision` events. Exported
  `BACKWARD_PROP_V1_EMISSIONS` declares the emission contract for each event.
  `BACKWARD_PROP_V0` is retained and tagged `@deprecated` for back-compat.
- **New `package.json` subpath exports** — 13 new entries (barrel + 12 individual
  primitive paths)
- **Root `index.ts`** re-exports all 12 new primitives alongside the v1.0 set

### Rationale
- Palantir-mini v1.3 consumes this surface for `impact_query`, `audit_events_5d_conformance`,
  `verify_schema_pin`, `scan_file_size_violations`, `scan_dead_code`,
  `validate_managed_settings_fragments`, `verify_codegen_headers`, and `detect_doc_drift`
  MCP handlers. Without these primitives the handlers would need ad-hoc type shapes.
- Context Engineering (`impact-edge.ts`) is load-bearing: the whole "if I edit X, what
  propagates?" question becomes a deterministic graph walk instead of grep + intuition.
- BackwardProp V1 formalises that refinements and reviews ARE lineage, not a parallel
  inbox-only log — keeps the events.jsonl substrate authoritative.

### Per-Axis Delta (v1.0.0 → v1.13.0)
| Axis | v1.0.0 | v1.13.0 | Delta |
|------|--------|---------|-------|
| ontology/types.ts | 1.12.0 | 1.12.0 (unchanged) | primitives surface extended separately |
| ontology/primitives/ | 14 files | 21 files (+barrel) | +12 primitives +1 barrel |
| ontology/lineage/event-types | 16 events | 20 events | +4 LEARN events |
| ontology/policies/propagation | V0 only | V0 (@deprecated) + V1 + emissions | BackwardProp closed |
| interaction | 0.1.2 | 0.1.2 | unchanged |
| meta | 0.1.0 | 0.1.0 | unchanged |
| rendering | 0.1.0 | 0.1.0 | unchanged |
| root package | 1.0.0 | 1.13.0 | MINOR bump (additive) |

### Consumer impact
- Additive-only — consumers pinned at `^1.0.0` continue to work untouched.
- Consumers that want the new surface should import from
  `@palantirKC/claude-schemas/ontology/primitives` (barrel) or an explicit
  per-primitive subpath. No peerDep pin change required for access.

---

## [1.0.0] — 2026-04-17

### Major Version Signal
v1.0.0 introduces the canonical primitive surface under `ontology/primitives/`. This is
a major version bump to signal a stable, enumerable primitive API for consumer projects
and the home shared-core layer (W3). Zero actual breaking changes — all v0.2.x exports
are preserved. Existing consumer peerDependency pins at `0.2.1` continue to work until
explicitly migrated to `1.0.0` in W5.

### Added
- **9 new primitive files** under `ontology/primitives/`:
  - `struct.ts` (DATA) — StructRid + StructDeclaration + StructRegistry
  - `value-type.ts` (DATA) — ValueTypeRid + ValueTypeDeclaration + ValueTypeRegistry + BaseScalarType
  - `shared-property-type.ts` (DATA) — SharedPropertyTypeRid + SharedPropertyTypeDeclaration + SharedPropertyTypeRegistry
  - `capability-token.ts` (SECURITY L2) — CapabilityTokenRid + CapabilityTokenDeclaration + CapabilityTokenRegistry
  - `marking-declaration.ts` (SECURITY L2/L3) — MarkingRid + MarkingDeclaration + MarkingDeclarationRegistry
  - `automation-declaration.ts` (ACTION) — AutomationRid + AutomationDeclaration + AutomationDeclarationRegistry
  - `webhook-declaration.ts` (ACTION) — WebhookRid + WebhookDeclaration + WebhookDeclarationRegistry
  - `scenario-sandbox.ts` (LEARN) — ScenarioRid + ScenarioSandboxDeclaration + ScenarioSandboxRegistry
  - `aip-logic-function.ts` (LOGIC) — AIPLogicFunctionRid + AIPLogicFunctionDeclaration + AIPLogicFunctionRegistry
- **EVENT_TYPE_REGISTRY expanded 10→16** in `ontology/lineage/event-types.ts`:
  `ontology_registered`, `capability_token_issued`, `schema_locked`, `scenario_created`, `pr_body_generated`, `session_complete`
- **New primitive subpath exports** in `package.json` — 9 new `./ontology/primitives/*` export entries
- **Root `index.ts`** re-exports all 9 new primitives under the `Ontology` namespace
- **`breaking-changes`** note in `package.json` clarifying the major version signal

### Per-Axis Delta (v0.2.1 → v1.0.0)
| Axis | v0.2.1 | v1.0.0 | Delta |
|------|--------|--------|-------|
| ontology/types.ts | 1.12.0 | 1.12.0 (unchanged) | primitives/ surface added separately |
| ontology/primitives/ | 5 files | 14 files | +9 new files |
| ontology/lineage/event-types | 10 events | 16 events | +6 events |
| interaction | 0.1.2 | 0.1.2 | unchanged |
| meta | 0.1.0 | 0.1.0 | unchanged |
| rendering | 0.1.0 | 0.1.0 | unchanged |
| root package | 0.2.1 | 1.0.0 | major bump |

---

## [0.2.1] — 2026-04-17

### Added

- **Extended `exports` map** in `package.json` — explicit subpath exports for `./ontology/types`, `./rendering/types`, `./interaction/types`, `./meta/types`, and semantics/helpers entrypoints. Lets consumer projects import from either the axis shortcut (`@palantirKC/claude-schemas/ontology`) or the explicit types path (`@palantirKC/claude-schemas/ontology/types`) without needing to restructure existing import sites.
- **Root `index.ts`** — namespaced re-exports (`Ontology`, `Rendering`, `Interaction`, `Meta`) for consumers that want a single import surface.
- **Public `README.md`** — consumer pin reference, OSDK-style distribution rationale, install instructions.
- **`repository` field** in `package.json` pointing at the GitHub repo.
- Dropped `"private": true` — the schemas repo (`park-kyungchan/claude-schemas`) is the public distribution channel consumed via git-URL peerDeps.

### Notes

- v0.2.1 is purely additive. Zero changes to type definitions, semantics, validators, or codegen.
- Consumer projects (kosmos, palantir-math, mathcrew) bumped their peerDep pin from `v0.2.0` → `v0.2.1` in the same rollout to gain the extended exports.

---

## [0.2.0] — 2026-04-17

### Added (Universalization additive metadata layer)

- **Root `package.json`** — declares `@palantirKC/claude-schemas` v0.2.0 with per-axis exports, engine pins, and compatibleConsumers map.
- **Root `CHANGELOG.md`** — this file; aggregates per-axis history.
- **Root `.manifest.json`** — machine-readable axis + version registry for consumer pinning and `pm-verify` compatibility checks.
- **`interaction/index.ts`** — unified entrypoint exporting types, semantics, validator.
- **`meta/index.ts`** — unified entrypoint exporting types.
- **`rendering/index.ts`** — unified entrypoint exporting types + semantics.
- **`ontology/codegen/manifest.ts`** — structured generator manifest (generator id, inputs, outputs, version) for codegen consumers.

### Notes

- v0.2.0 is **purely additive metadata**. Zero changes to existing type definitions, validators, or codegen.
- No version bump to ontology axis (remains at 1.12.0 per its own CHANGELOG).
- Consumer projects pin `@palantirKC/claude-schemas@0.2.x` via `peerDependencies` per rule 08.

---

## Per-Axis Version Matrix (as of 0.2.0)

| Axis | Version | Source |
|------|---------|--------|
| ontology | 1.12.0 | `ontology/CHANGELOG.md` + `ontology/semantics.ts` |
| interaction | 0.1.2 | `interaction/types.ts` + `.manifest.json` |
| meta | 0.1.0 | `meta/types.ts` |
| rendering | 0.1.0 | `rendering/types.ts` + `rendering/semantics.ts` |
| **root** | **0.2.0** | **this file + package.json** |

---

## [0.1.x] — pre-universalization baseline

Per-axis work accumulated before this root aggregator existed. See each axis's own CHANGELOG or `git log` for detailed history.
