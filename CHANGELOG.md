# @palantirKC/claude-schemas — CHANGELOG

Root-level aggregator. Each axis has its own CHANGELOG:
- `ontology/CHANGELOG.md` (canonical for ontology axis, currently at v1.12.0)
- `interaction/` (no CHANGELOG; see types.ts version constants)
- `meta/` (no CHANGELOG; see types.ts)
- `rendering/` (no CHANGELOG; see types.ts)

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
