# Ontology Schema — Structure Index

Structural reference for `~/.claude/schemas/ontology/`.

`BROWSE.md` routes schema questions. `INDEX.md` explains coverage, authority flow, and maintenance discipline.

## Role Contract
- Schema-level automation should stay reusable across projects.
- Project-specific meaning belongs downstream in project ontology, contracts, tests, and runtime.

## Role Map

| File | Role |
|------|------|
| `semantics.ts` | meta-level semantic authority and schema version |
| `types.ts` | export contracts for backend, frontend, runtime, and LEARN infrastructure |
| `project-validator.ts` | deterministic structural/reference validation |
| `semantic-audit.ts` | meaning-level coverage audit and upgrade planning |
| `project-test.test.ts` | portable project-facing entrypoint that composes validator + audit |
| `upgrade-apply.ts` | upgrade spec to patch generation |
| `helpers.ts` | shared naming helpers |
| `validate-file.ts` / `validate-rules.ts` | file/rule-level validation utilities |
| `CHANGELOG.md` | versioned change history |

## palantir-mini Primitives Layer (v0)

Five new subdirectories add the typed executable contracts for the
`palantir-mini` plugin (`~/.claude/plugins/palantir-mini/`). These primitives
promote `~/.claude/research/palantir/` from declarative evidence to
executable contract across `kosmos / palantir-math / mathcrew`.

| Subdir | Files | Role |
|--------|-------|------|
| `primitives/` | `object-type.ts`, `link-type.ts`, `action-type.ts`, `property-type.ts`, `interface-type.ts` | DATA + LOGIC primitive declarations (5 Palantir ontology types) |
| `functions/` | `function-signature.ts`, `derived-property.ts`, `reducer.ts` | LOGIC compute primitives (EditFunction, DerivedProperty, Reducer) |
| `policies/` | `submission-criteria.ts`, `rbac.ts`, `propagation.ts` | SECURITY + propagation policies (9 constraint classes, Layer-1 RBAC, ForwardProp + BackwardProp) |
| `lineage/` | `decision-lineage.ts`, `event-types.ts` | LEARN Decision Lineage 5-dim + 10-variant EventEnvelope registry |
| `generators/` | `osdk-2.0-config.ts`, `lazy-loader.ts` | Codegen configuration (OSDK 2.0 client/generated split, LazyRef pattern) |

**Provenance**: Derived from the kosmos TechBlueprint
(`park-kyungchan/kosmos@767fa10`) produced by the 7-agent Agent Teams
research pipeline (T1–T12, R1–R15 evaluator gates, 0 debate rounds,
evaluator verdict ACCEPT). H-A append-only event log won 0 lost / 2000
at 2-writer adversarial race vs H-B 484 / 2000 (24.2% loss rate).

**Consumers**: The locally-installed `palantir-mini` plugin
(`plugins/palantir-mini/lib/codegen/descender-gen.ts`) reads these
declarations and emits per-project generated TypeScript into
`<project>/src/generated/`. End-to-end verified against `~/palantir-math`.

## Authority Flow

```text
~/.claude/research/palantir/
  -> semantics.ts
  -> types.ts
  -> project-validator.ts / semantic-audit.ts
  -> project ontology/schema.ts
  -> project runtime/tests
```

## Change Discipline
- When LEARN, Workflow Lineage, BackPropagation, or project-scope semantics change, update `types.ts`, `semantic-audit.ts`, `project-validator.ts`, `project-test.test.ts` when needed, `CHANGELOG.md`, and this directory’s `BROWSE.md` / `INDEX.md` together.
- Keep schema docs maintainable and extensible by documenting new validation or upgrade paths here instead of hiding them in ad hoc scripts.
