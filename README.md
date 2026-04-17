# @palantirKC/claude-schemas

> Shared meta-schemas for ontology-first Claude Code projects.

Four axes of project structure type definitions and validators that are shared
across the [palantir-mini](https://github.com/park-kyungchan/palantirkc/tree/main/.claude/plugins/palantir-mini)
plugin and downstream consumer projects.

## Consumers

| Project | Version Pin |
|---------|-------------|
| [kosmos](https://github.com/park-kyungchan/kosmos) | `git+https://github.com/park-kyungchan/claude-schemas.git#v0.2.1` |
| [palantir-math](https://github.com/park-kyungchan/palantir-math) | `git+https://github.com/park-kyungchan/claude-schemas.git#v0.2.1` |
| [mathcrew](https://github.com/park-kyungchan/mathcrew) | `git+https://github.com/park-kyungchan/claude-schemas.git#v0.2.1` |

## Four axes

| Axis | Purpose | Version |
|------|---------|---------|
| `ontology` | Backend/frontend/runtime ontology model (OSDK-mirror) | 1.12.0 |
| `interaction` | User/agent surface gestures, bindings, WCAG | 0.1.2 |
| `meta` | Shared meta-types (temporal, identifiers, constraints) | 0.1.0 |
| `rendering` | Materials, pipeline, scene, performance (WebGPU/Three.js) | 0.1.0 |

## Install

```bash
bun add --peer "@palantirKC/claude-schemas@git+https://github.com/park-kyungchan/claude-schemas.git#v0.2.1"
```

## Import

Prefer subpath imports:

```ts
import type { OntologyExports, RuntimeOntology } from "@palantirKC/claude-schemas/ontology";
import type { RenderingExports } from "@palantirKC/claude-schemas/rendering";
import type { InteractionExports } from "@palantirKC/claude-schemas/interaction";
```

## Why a dedicated git repo

This package mirrors Palantir Foundry's OSDK distribution pattern: a versioned
artifact consumed via a versioned git tag. CI environments can install the
schema without npm auth; consumer projects pin a specific tag to guarantee
reproducible builds.

The schema evolves through semver-tagged releases. Every breaking change ships
with a MAJOR bump; additive types ship with MINOR; docs/metadata changes ship
with PATCH.

## Changelog

See [CHANGELOG.md](./CHANGELOG.md).
