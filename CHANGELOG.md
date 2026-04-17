# @palantirKC/claude-schemas — CHANGELOG

Root-level aggregator. Each axis has its own CHANGELOG:
- `ontology/CHANGELOG.md` (canonical for ontology axis, currently at v1.12.0)
- `interaction/` (no CHANGELOG; see types.ts version constants)
- `meta/` (no CHANGELOG; see types.ts)
- `rendering/` (no CHANGELOG; see types.ts)

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
