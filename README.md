# @palantirKC/claude-schemas

> Shared meta-schemas for ontology-first Claude Code projects.

Four axes of project-structure type definitions and validators that are shared
across the [palantir-mini](https://github.com/park-kyungchan/palantirkc/tree/main/.claude/plugins/palantir-mini)
plugin and downstream consumer projects.

Canonical source: [`park-kyungchan/palantirkc` — `.claude/schemas/`](https://github.com/park-kyungchan/palantirkc/tree/main/.claude/schemas).
This repository is a **publication mirror** — tags land here so consumer `peerDependencies` git-URL pins can resolve.

## Consumers

| Project | Version Pin |
|---------|-------------|
| [palantir-mini](https://github.com/park-kyungchan/palantirkc/tree/main/.claude/plugins/palantir-mini) | `compatibleSchemaVersions: ">=1.15.0 <2.0.0"` |
| [mathcrew](https://github.com/park-kyungchan/mathcrew) | `git+https://github.com/park-kyungchan/claude-schemas.git#v1.15.0` (target) |
| [palantir-math](https://github.com/park-kyungchan/palantir-math) | `git+https://github.com/park-kyungchan/claude-schemas.git#v1.15.0` |
| [kosmos](https://github.com/park-kyungchan/kosmos) | `git+https://github.com/park-kyungchan/claude-schemas.git#v1.15.0` |

## Four axes

| Axis | Purpose | Version |
|------|---------|---------|
| `ontology` | DATA/LOGIC/ACTION/SECURITY/LEARN primitives + 28 primitive files + 36 event types | 1.12.0 (types.ts) / 1.15.0 (primitives surface) |
| `interaction` | Gesture / binding / element role / WCAG | 0.1.2 |
| `meta` | Cross-axis constraints | 0.1.0 |
| `rendering` | Material / pipeline / scene / performance (WebGPU / Three.js) | 0.1.0 |
| **root package** | Aggregator | **1.15.0** |

## Install

```jsonc
// consumer package.json
{
  "peerDependencies": {
    "@palantirKC/claude-schemas": "git+https://github.com/park-kyungchan/claude-schemas.git#v1.15.0"
  }
}
```

## Version history

See `CHANGELOG.md` (root) + `ontology/CHANGELOG.md`.

Primary tags: `v0.2.0` → `v0.2.1` → `v1.0.0` → **`v1.15.0`** (bulk catch-up covering the v1.13 governance + v1.14 harness + v1.15 pedagogy waves).

## License

UNLICENSED (internal).
