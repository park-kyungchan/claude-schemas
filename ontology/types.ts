/**
 * Ontology Pipeline Validation — Shared Types
 *
 * Aligned with production schema (ontology/schema.ts).
 * Foundation types for all 40 validation test files.
 * Every test file imports from here — zero duplication.
 */

import type { InteractionExports } from "../interaction/types";
import type { RenderingExports } from "../rendering/types";

// === Test Infrastructure ===

export type TestSeverity = "error" | "warn" | "info";

export interface TestResult {
  readonly id: string;
  readonly description: string;
  readonly severity: TestSeverity;
  readonly passed: boolean;
  readonly details?: string;
}

export interface DomainGateResult {
  readonly domain: OntologyDomain;
  readonly passed: boolean;
  readonly results: TestResult[];
  readonly errorCount: number;
  readonly warnCount: number;
  readonly timestamp: number;
}

/**
 * 4-value domain identifier used in test infrastructure (DomainGateResult).
 * Includes "security" because tests validate security schema independently.
 * Equivalent to DomainOrOverlay in semantics.ts — see TERMINOLOGY_CHARTER.
 * NOTE: This is a LOCAL NORMALIZATION. Official Palantir does not formalize
 * semantic domains. See semantics.ts file header for details.
 */
export type OntologyDomain = "data" | "logic" | "action" | "security";

// === Base Enums (aligned with schema.ts — lowercase for special types) ===
//
// BasePropertyType (19 members): Ontology-level property types declared on entities.
// Differs from OntologyPropertyType (24 members) which adds:
//   - `number` (alias for generic numeric), `enum` (handled via ValueConstraint)
//   - `optional`, `array` (type modifiers/wrappers)
//   - `GeoTemporal` (composite: array of timestamped coordinates)
// Casing: BasePropertyType uses lowercase for special types (geopoint, cipher, etc.);
// OntologyPropertyType uses PascalCase (GeoPoint, Cipher). Adapters normalize via map lookup.

/**
 * Full ontology-level property type union (24 members).
 * Extends BasePropertyType with aliases, modifiers, and composite types.
 * Adapters normalize between casing conventions via lookup maps.
 */
export type OntologyPropertyType =
  | BasePropertyType
  | "number"       // alias for generic numeric (maps to integer/long/float/double)
  | "enum"         // handled via ValueConstraint, not a storage type
  | "optional"     // type modifier/wrapper
  | "array"        // type modifier/wrapper
  | "GeoTemporal"; // composite: array of timestamped coordinates

/** All 24 OntologyPropertyType members as a constant array. */
export const ONTOLOGY_PROPERTY_TYPES: readonly OntologyPropertyType[] = [
  // BasePropertyType (19)
  "string", "integer", "long", "float", "double",
  "boolean", "date", "timestamp",
  "geopoint", "geoshape",
  "attachment", "mediaReference",
  "timeseries", "cipher",
  "struct", "vector", "marking",
  "FK", "BrandedType",
  // Extended types (5)
  "number", "enum", "optional", "array", "GeoTemporal",
] as const;

export type BasePropertyType =
  | "string" | "integer" | "long" | "float" | "double"
  | "boolean" | "date" | "timestamp"
  | "geopoint" | "geoshape"
  | "attachment" | "mediaReference"
  | "timeseries" | "cipher"
  | "struct" | "vector" | "marking"
  | "FK" | "BrandedType";

export type LinkCardinality = "1:1" | "M:1" | "1:M" | "M:N";

export type MutationType = "create" | "modify" | "delete" | "batch" | "custom";

export type QueryType =
  | "list" | "getById" | "filter" | "search"
  | "paginated" | "aggregation" | "searchAround";

export type FunctionCategory = "pureLogic" | "readHelper" | "computedField";

export type DerivedMode = "onRead" | "cached";

export type WebhookKind = "transactional" | "sideEffect";

export type AutomationKind = "cron" | "eventDriven";

/** Progressive autonomy level for AI-driven action execution. Source: ontology-ultimate-vision.md §6 */
export type AutonomyLevel =
  | "monitor"
  | "recommend"
  | "approve-then-act"
  | "act-then-inform"
  | "full-autonomy";

export type MarkingType = "mandatory" | "cbac";

/** 6 property reducer strategies for MDO conflict resolution. Source: data/properties.md §Property Reducers */
export type PropertyReducerStrategy = "firstNonNull" | "lastUpdated" | "min" | "max" | "sum" | "custom";

/** Ontology permission model — traditional roles vs project-based. Source: security/permissions.md §Project-Based (Jan 2026) */
export type PermissionModel = "ontologyRoles" | "projectBased";

/** Marking category visibility mode. Source: security/markings.md §Marking Management */
export type MarkingCategoryVisibility = "visible" | "hidden";

export type CrudOperation = "create" | "read" | "update" | "delete";

/** TypeScript function version — v2 is the recommended default since Jul 2025 GA. Source: logic/functions.md */
export type FunctionVersion = "v1" | "v2";

/** 7 condition types for Automate (1 time-based + 6 object set). Source: action/automation.md §7 Condition Types */
export type AutomationConditionType =
  | "timeBased"
  | "objectsAdded"
  | "objectsRemoved"
  | "objectsModified"
  | "runOnAll"
  | "metricChanged"
  | "thresholdCrossed";

/** 4 effect types when an automation condition fires. Source: action/automation.md §Effect Types */
export type AutomationEffectType = "action" | "notification" | "function" | "aipLogic";

/** 4-layer security model (OFFICIAL FACT). Source: palantir.com/docs/foundry/object-permissioning/object-security-policies */
export type SecurityLayerType = "rbac" | "cbac" | "rls_cls" | "cell_level";

/** 3 mandatory control types for row-level marking enforcement (OSv2 only). Source: security/markings.md §Three Mandatory Control Types */
export type MandatoryControlType = "markings" | "organizations" | "classifications";

/** CC adapter implementation status for platform features. Source: architecture/adapter-gap-analysis.md */
export type ImplementationStatus = "implemented" | "partial" | "declaration_only" | "not_applicable";

// === Structural Naming Rule (shared across all domains) ===

/**
 * Ontology naming convention rule — defines casing, regex patterns, and length constraints
 * for domain artifact names (entity apiNames, property names, link names, etc.).
 *
 * NOT the same as adapter StructuralRule (schemas/types.ts) which defines code generation
 * structure (outputFiles, imports, naming maps, boundaries). Both use the same name but serve
 * different purposes and are never imported together — TypeScript resolves via import path.
 *
 * Source: per-domain research files
 */
export interface StructuralRule {
  readonly target: string;
  readonly casing: string;
  readonly pattern: string;
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly source: string;
}

// === Bilingual Description ===

export interface BilingualDesc {
  readonly ko: string;
  readonly en: string;
}

// === Value Constraints (discriminated union, aligned with schema.ts) ===

export type ValueConstraint =
  | { readonly kind: "regex"; readonly pattern: string; readonly message?: string }
  | { readonly kind: "range"; readonly min?: number; readonly max?: number; readonly message?: string }
  | { readonly kind: "enum"; readonly values: readonly string[]; readonly message?: string }
  | { readonly kind: "uuid"; readonly version?: 4 | 7; readonly message?: string }
  | { readonly kind: "arrayUnique"; readonly message?: string };

// =========================================================================
// DATA Domain Export Shapes
// =========================================================================

export interface Property {
  readonly apiName: string;
  readonly type: string;
  readonly baseType: BasePropertyType;
  readonly required: boolean;
  readonly readonly: boolean;
  readonly description: BilingualDesc;
  readonly constraints?: readonly ValueConstraint[];
  readonly valueType?: string;
  readonly targetEntity?: string;
  readonly isArray?: boolean;
  readonly defaultValue?: string;
  readonly indexCandidate?: boolean;
  /** Conflict resolution strategy for multi-datasource properties. Source: data/properties.md §Property Reducers */
  readonly reducerStrategy?: PropertyReducerStrategy;
}

export interface ValueType {
  readonly apiName: string;
  readonly baseType: BasePropertyType;
  readonly description: BilingualDesc;
  readonly constraints: readonly ValueConstraint[];
  readonly validatorFn: string;
}

export interface StructType {
  readonly apiName: string;
  readonly description: BilingualDesc;
  readonly fields: readonly Property[];
}

export interface SharedPropertyType {
  readonly apiName: string;
  readonly description: BilingualDesc;
  readonly properties: readonly Property[];
  readonly usedBy: readonly string[];
}

// === Special Type Sub-Arrays (aligned with schema.ts) ===

export interface GeoPointProperty {
  readonly apiName: string;
  readonly description: BilingualDesc;
  readonly crs: "WGS84";
}

export interface GeoShapeProperty {
  readonly apiName: string;
  readonly description: BilingualDesc;
  readonly geometryTypes: readonly ("Point" | "LineString" | "Polygon" | "MultiPoint" | "MultiLineString" | "MultiPolygon")[];
  readonly indexed: boolean;
}

export interface GeoTemporalProperty {
  readonly apiName: string;
  readonly description: BilingualDesc;
  readonly timestampType: "timestamp";
  readonly includesAltitude?: boolean;
}

export interface TimeSeriesProperty {
  readonly apiName: string;
  readonly description: BilingualDesc;
  readonly valueType: "number" | "string" | "boolean";
  readonly regularity: "regular" | "irregular";
  readonly partitioning?: string;
  readonly retentionDays?: number;
}

export interface AttachmentProperty {
  readonly apiName: string;
  readonly description: BilingualDesc;
  readonly kind: "attachment" | "mediaReference";
  readonly mimeTypes: readonly string[];
  readonly maxSizeMB?: number;
}

export interface VectorProperty {
  readonly apiName: string;
  readonly description: BilingualDesc;
  readonly dimensions: number;
  readonly similarity: "cosine" | "euclidean" | "dotProduct";
}

export interface CipherProperty {
  readonly apiName: string;
  readonly description: BilingualDesc;
  readonly encryption: "aes256" | "rsa" | "applicationLevel";
}

// === Derived Properties ===

export interface DerivedProperty {
  readonly apiName: string;
  readonly entityApiName: string;
  readonly description: BilingualDesc;
  readonly mode: DerivedMode;
  readonly returnType: string;
  readonly sourceProperties: readonly string[];
  readonly computeFn: string;
}

// === Object Type (full sub-array model, aligned with schema.ts) ===

export interface ObjectType {
  readonly apiName: string;
  readonly displayName: string;
  readonly pluralName: string;
  readonly primaryKey: string;
  readonly titleKey: string;
  readonly description?: BilingualDesc;
  readonly properties: readonly Property[];
  readonly structs?: readonly string[];
  readonly geoProperties?: readonly (GeoPointProperty | GeoShapeProperty | GeoTemporalProperty)[];
  readonly timeSeriesProperties?: readonly TimeSeriesProperty[];
  readonly attachments?: readonly AttachmentProperty[];
  readonly vectors?: readonly VectorProperty[];
  readonly ciphers?: readonly CipherProperty[];
  readonly derivedProperties?: readonly DerivedProperty[];
  readonly implements?: readonly string[];
  readonly indexCandidates?: readonly string[];
  /** Number of backing datasources. >1 indicates a Multi-Datasource Object (MDO). Source: data/entities.md §Multi-Datasource Types */
  readonly datasourceCount?: number;
}

export interface OntologyData {
  readonly objectTypes: readonly ObjectType[];
  readonly valueTypes: readonly ValueType[];
  readonly structTypes: readonly StructType[];
  readonly sharedPropertyTypes: readonly SharedPropertyType[];
}

// =========================================================================
// LOGIC Domain Export Shapes
// =========================================================================

export interface LinkType {
  readonly apiName: string;
  readonly description: BilingualDesc;
  readonly sourceEntity: string;
  readonly targetEntity: string;
  readonly cardinality: LinkCardinality;
  readonly fkProperty?: string;
  readonly fkSide?: "source" | "target";
  readonly joinEntity?: string;
  readonly reverseApiName?: string;
}

export interface InterfaceLinkConstraint {
  readonly linkApiName: string;
  readonly targetType: string;
  readonly cardinality: "ONE" | "MANY";
  readonly required: boolean;
}

export interface OntologyInterface {
  readonly apiName: string;
  readonly description: BilingualDesc;
  readonly properties: readonly string[];
  readonly linkConstraints?: readonly InterfaceLinkConstraint[];
  readonly implementedBy: readonly string[];
}

export interface QueryFilterField {
  readonly propertyApiName: string;
  readonly operators: readonly string[];
}

export interface Parameter {
  readonly name: string;
  readonly type: string;
  readonly description?: BilingualDesc;
  readonly required?: boolean;
}

export interface OntologyQuery {
  readonly apiName: string;
  readonly description: BilingualDesc;
  readonly entityApiName: string;
  readonly queryType: QueryType;
  readonly filterFields?: readonly QueryFilterField[];
  readonly parameters?: readonly Parameter[];
  readonly returnType?: string;
  readonly traversalPath?: readonly string[];
}

export interface OntologyFunction {
  readonly apiName: string;
  readonly description: BilingualDesc;
  readonly category: FunctionCategory;
  readonly parameters: readonly Parameter[];
  readonly returnType: string;
  readonly operatesOn?: string;
  readonly pureLogic: string;
  /** Whether this function is exposed as an LLM-callable tool (Pattern 2: Logic Tool Handoff). */
  readonly toolExposure?: boolean;
  /** TypeScript function version — v2 recommended for ontology transactions. Source: logic/functions.md */
  readonly functionVersion?: FunctionVersion;
}

export interface OntologyLogic {
  readonly linkTypes: readonly LinkType[];
  readonly interfaces: readonly OntologyInterface[];
  readonly queries: readonly OntologyQuery[];
  readonly derivedProperties: readonly DerivedProperty[];
  readonly functions: readonly OntologyFunction[];
}

// =========================================================================
// ACTION Domain Export Shapes
// =========================================================================

export interface MutationEdit {
  readonly type: "create" | "modify" | "delete" | "addLink" | "removeLink";
  readonly target: string;
  readonly properties?: readonly string[];
}

export interface MutationSideEffect {
  readonly kind: "webhook" | "notification" | "log" | "external";
  readonly target: string;
}

export interface OntologyMutation {
  readonly apiName: string;
  readonly description: BilingualDesc;
  readonly mutationType: MutationType;
  readonly entityApiName: string;
  readonly parameters: readonly Parameter[];
  /**
   * Optional guidance shown to external agents when this action is exposed via
   * Ontology MCP. Mirrors Palantir's "Agent tool description" field.
   */
  readonly agentToolDescription?: BilingualDesc;
  readonly validationFns?: readonly string[];
  readonly edits: readonly MutationEdit[];
  readonly sideEffects?: readonly MutationSideEffect[];
  /** AI action review tier — gates AI-proposed actions through human review. Source: ontology-ultimate-vision.md §6 */
  readonly reviewLevel?: AutonomyLevel;
}

export interface Webhook {
  readonly apiName: string;
  readonly description: BilingualDesc;
  readonly kind: WebhookKind;
  readonly transactional: boolean;
  readonly triggeredBy: readonly string[];
  readonly endpoint: string;
  readonly payload?: readonly string[];
}

export interface Automation {
  readonly apiName: string;
  readonly description: BilingualDesc;
  readonly kind: AutomationKind;
  readonly schedule?: string;
  readonly triggerEvent?: string;
  readonly targetMutation: string;
  readonly idempotent: boolean;
  /** Progressive autonomy tier for this automation. Source: ontology-ultimate-vision.md §6 */
  readonly autonomyLevel?: AutonomyLevel;
  /** Which of the 6 Automate condition types triggers this automation. Source: action/automation.md */
  readonly conditionType?: AutomationConditionType;
  /** Which effect type fires when the condition is met. Source: action/automation.md */
  readonly effectType?: AutomationEffectType;
}

export interface OntologyAction {
  readonly mutations: readonly OntologyMutation[];
  readonly webhooks: readonly Webhook[];
  readonly automations: readonly Automation[];
}

// =========================================================================
// SECURITY Domain Export Shapes
// =========================================================================

export interface Role {
  readonly apiName: string;
  readonly displayName: BilingualDesc;
  readonly hierarchy?: number;
}

export interface PermissionEntry {
  readonly entityApiName: string;
  readonly roleApiName: string;
  readonly operations: readonly CrudOperation[];
}

export interface Marking {
  readonly apiName: string;
  readonly description: BilingualDesc;
  readonly markingType: MarkingType;
  readonly levels?: readonly string[];
  readonly appliedTo: readonly string[];
}

export interface RLSPolicy {
  readonly userAttribute: string;
  readonly objectProperty: string;
  readonly operator: "equals" | "contains" | "in";
}

export interface CLSPolicy {
  readonly propertyApiName: string;
  readonly readableBy: readonly string[];
  readonly writableBy: readonly string[];
}

export interface ObjectSecurityPolicy {
  readonly entityApiName: string;
  readonly description: BilingualDesc;
  readonly rls?: RLSPolicy;
  readonly cls?: readonly CLSPolicy[];
}

/**
 * Property security policy — guards visibility of specific properties.
 * Unauthorized users see null values for guarded properties, not access denied.
 * Combinable with ObjectSecurityPolicy for cell-level granularity.
 * Source: security/object-security.md §Property Security Policies
 */
export interface PropertySecurityPolicy {
  readonly entityApiName: string;
  readonly description: BilingualDesc;
  readonly guardedProperties: readonly string[];
  readonly readableBy: readonly string[];
  /** Unauthorized users see null for guarded properties. */
  readonly unauthorizedBehavior: "null";
}

export interface OntologySecurity {
  /** Permission surface for this ontology: legacy per-resource roles or Compass project membership. */
  readonly permissionModel?: PermissionModel;
  readonly roles: readonly Role[];
  readonly permissionMatrix: readonly PermissionEntry[];
  readonly markings: readonly Marking[];
  readonly objectPolicies: readonly ObjectSecurityPolicy[];
  readonly propertyPolicies?: readonly PropertySecurityPolicy[];
}

// =========================================================================
// LEARN Infrastructure Export Shapes
// =========================================================================

/**
 * Schema for hookEvents table — captures 5D Decision Lineage for every mutation.
 * Source: research/palantir/cross-cutting/decision-lineage.md [§DL-02]
 */
export interface HookEventSchema {
  /** 5D Decision Lineage fields */
  readonly timestamp: true;         // WHEN
  readonly atopCommit?: true;       // ATOP WHICH (git SHA)
  readonly sessionId: true;         // THROUGH WHICH
  readonly toolName: true;          // THROUGH WHICH (action name)
  readonly byIdentity: true;        // BY WHOM
  readonly withReasoning?: true;    // WITH WHAT
  /** Metadata */
  readonly eventType: true;
  readonly targetTable?: true;
  readonly targetId?: true;
  readonly provider?: true;         // LLM provider (if AI-driven)
  readonly model?: true;            // LLM model (if AI-driven)
}

/**
 * LEARN infrastructure declaration — enables typed (not inferential) audit validation.
 * Projects declare their LEARN capabilities here; semantic-audit.ts validates against them.
 * Source: research/palantir/philosophy/digital-twin.md [§PHIL.DT-01..10]
 */
export interface LearnInfrastructure {
  /** hookEvents table captures Decision Lineage 5D for every mutation */
  readonly hookEventsTable?: HookEventSchema;
  /** User or operator feedback entity for LEARN-02. */
  readonly feedbackEntityRef?: string;
  /** Mutations that persist end-user / operator feedback into ontology state. */
  readonly feedbackMutationRefs?: readonly string[];
  /** Explicit evaluation/rubric entity for evaluator output. */
  readonly evaluationEntityRef?: string;
  /** Mutations that persist evaluator / rubric results. */
  readonly evaluationMutationRefs?: readonly string[];
  /** Functions that score, judge, or grade decisions before write-back. */
  readonly evaluationFunctionRefs?: readonly string[];
  /** evaluatorResults stores scoring of decisions/outputs */
  readonly hasEvaluatorResults?: boolean;
  /** Canonical outcome-tracking entity for LEARN-03 / REF-01. */
  readonly outcomeEntityRef?: string;
  /** Mutations that persist predicted-vs-actual outcome records. */
  readonly outcomeMutationRefs?: readonly string[];
  /** outcomeRecords tracks predicted vs actual outcomes */
  readonly hasOutcomeRecords?: boolean;
  /** Accuracy or calibration entity feeding REF-02 / REF-03. */
  readonly accuracyEntityRef?: string;
  /** Refinement/drift signal entity feeding DH updates. */
  readonly refinementSignalEntityRef?: string;
  /** Actions that graduate PA levels or commit refinement updates. */
  readonly graduationMutationRefs?: readonly string[];
  /** Workflow lineage / trace entities that record execution history. */
  readonly workflowLineageEntityRefs?: readonly string[];
  /** Provider-neutral: no direct provider SDK imports in ontology/ */
  readonly providerNeutral?: boolean;
}

// =========================================================================
// Project Scope Ontology
// =========================================================================

/**
 * Backend ontology contract.
 * This is the semantic core AI agents should produce before they attempt
 * frontend scaffolding: what exists, how it is reasoned about, how it changes,
 * how it is secured, and how it learns.
 */
export interface BackendOntology {
  readonly data: OntologyData;
  readonly logic: OntologyLogic;
  readonly action: OntologyAction;
  readonly security: OntologySecurity;
  /** Optional LEARN infrastructure — enables typed (not inferential) audit validation */
  readonly learn?: LearnInfrastructure;
}

/**
 * Frontend surface kinds grounded in DevCon 5 builder surfaces.
 * Source: research/palantir/platform/devcon.md §DC5-* and platform/ai-fde.md §FDE-*
 */
export type FrontendSurfaceKind =
  | "workshop"
  | "osdkApp"
  | "embeddedOntologyApp"
  | "dashboard"
  | "voiceAgent"
  | "agentPanel"
  | "workflowInbox"
  | "scenarioPlanner"
  | "mobile"
  | "3dScene";

/**
 * Route-level frontend declaration.
 * Keeps frontend scope explicitly tied back to ontology entities, queries, and actions
 * so AI agents can scaffold full-stack flows without inventing view/data contracts.
 */
export interface FrontendView {
  readonly apiName: string;
  readonly route: string;
  readonly description: BilingualDesc;
  readonly surface: FrontendSurfaceKind;
  readonly entityApiName?: string;
  readonly primaryQueryRef?: string;
  readonly secondaryQueryRefs?: readonly string[];
  readonly mutationActionRefs?: readonly string[];
  readonly functionRefs?: readonly string[];
  /** Whether this surface is expected to keep working against locally synced ontology data. */
  readonly supportsOffline?: boolean;
  /** Explicit entity sync set for embedded ontology / local-first views. */
  readonly syncEntityApiNames?: readonly string[];
}

/**
 * Agent-facing frontend surface.
 * Covers voice agents, inbox reviewers, assistant panels, and scenario planners.
 */
export interface FrontendAgentSurface {
  readonly apiName: string;
  readonly description: BilingualDesc;
  readonly surface: FrontendSurfaceKind;
  readonly entityApiName?: string;
  readonly queryRefs?: readonly string[];
  readonly functionRefs?: readonly string[];
  readonly actionRefs?: readonly string[];
  readonly automationRefs?: readonly string[];
  readonly reviewLevel?: AutonomyLevel;
}

/**
 * Scenario / sandbox flow declaration.
 * Encodes the ontology-foundation pattern shown at DevCon 5:
 * sandbox changes, compare options, then submit/merge into production.
 */
export interface FrontendScenarioFlow {
  readonly apiName: string;
  readonly description: BilingualDesc;
  readonly scenarioEntityApiName: string;
  readonly comparisonFunctionRefs?: readonly string[];
  readonly submitActionRef: string;
  readonly commitActionRef?: string;
}

/**
 * Frontend ontology contract.
 * This is the minimum project-scope declaration needed for AI agents to connect
 * backend ontology semantics to user-facing applications with reduced HITL.
 */
export interface FrontendOntology {
  readonly views: readonly FrontendView[];
  readonly agentSurfaces?: readonly FrontendAgentSurface[];
  readonly scenarioFlows?: readonly FrontendScenarioFlow[];
  readonly interaction?: InteractionExports;
  readonly rendering?: RenderingExports;
}

export type RuntimeSourceKind = "artifact" | "query" | "computed";

export type RuntimeWriteTargetKind = "artifact" | "mutation" | "download";

export type RuntimeAtomicityKind = "singleMutation" | "multiStepTransaction" | "stagedCommit";

export type RuntimeSupportKind = "table" | "query" | "mutation" | "artifactStore" | "auth" | "embeddedOntology";

/**
 * Runtime data source binding.
 * Bridges project-scope ontology semantics into actual route loaders and view hydration.
 * `semanticRef` points back to ontology-level contracts when one exists.
 * `adapterRef` points at the concrete runtime helper, query export, or artifact key.
 */
export interface RuntimeSourceBinding {
  readonly apiName: string;
  readonly kind: RuntimeSourceKind;
  readonly entityApiName?: string;
  readonly semanticRef?: string;
  readonly adapterRef?: string;
  readonly required?: boolean;
  readonly precedence?: number;
}

/**
 * Runtime write target binding.
 * Captures where an interactive surface persists state: ontology mutation, artifact snapshot,
 * non-blocking download, or other adapter-specific target.
 */
export interface RuntimeWriteTarget {
  readonly apiName: string;
  readonly kind: RuntimeWriteTargetKind;
  readonly entityApiName?: string;
  readonly semanticRef?: string;
  readonly adapterRef?: string;
  readonly blocking?: boolean;
}

/**
 * Runtime review / approval binding.
 * Encodes how a runtime surface participates in scenario review, sandbox compare,
 * staged approval, and commit flows.
 */
export interface RuntimeReviewBinding {
  readonly apiName: string;
  readonly scenarioFlowRef: string;
  readonly actorSurfaceRef?: string;
  readonly reviewLevel?: AutonomyLevel;
  readonly submitActionRef?: string;
  readonly commitActionRef?: string;
}

/**
 * Runtime transaction binding.
 * Captures the atomicity boundary for a runtime workflow: whether a single mutation,
 * an explicit multi-step transaction, or a staged sandbox commit is the contract.
 */
export interface RuntimeTransactionBinding {
  readonly apiName: string;
  readonly atomicity: RuntimeAtomicityKind;
  readonly mutationRefs: readonly string[];
  readonly scenarioFlowRef?: string;
  readonly description: BilingualDesc;
}

/**
 * Runtime audit / evaluation binding.
 * Declares which ontology-backed lineage and LEARN actions close the loop for a view or workflow.
 */
export interface RuntimeAuditBinding {
  readonly apiName: string;
  readonly hookEventActionRef?: string;
  readonly auditLogActionRef?: string;
  readonly evaluationActionRefs?: readonly string[];
  readonly outcomeActionRefs?: readonly string[];
  readonly accuracyActionRefs?: readonly string[];
}

/**
 * Runtime support binding.
 * Captures runtime support surfaces that are necessary for execution but are not
 * themselves the primary semantic source: support tables, compatibility adapters,
 * artifact stores, and bridge queries/mutations.
 */
export interface RuntimeSupportBinding {
  readonly apiName: string;
  readonly kind: RuntimeSupportKind;
  readonly description: BilingualDesc;
  readonly entityApiName?: string;
  readonly semanticRef?: string;
  readonly adapterRef: string;
  readonly status?: ImplementationStatus;
}

/**
 * Runtime route/view binding.
 * Declares how a frontend surface is materialized in the actual application runtime:
 * route, component, mode, data sources, and persistence targets.
 */
export interface RuntimeViewBinding {
  readonly apiName: string;
  readonly route: string;
  readonly description: BilingualDesc;
  readonly componentRef: string;
  readonly frontendViewRef?: string;
  readonly mode?: string;
  readonly legacyRoutes?: readonly string[];
  readonly sourceBindings?: readonly RuntimeSourceBinding[];
  readonly writeTargets?: readonly RuntimeWriteTarget[];
  readonly reviewBindingRef?: string;
  readonly transactionBindingRef?: string;
  readonly auditBindingRef?: string;
}

/**
 * Runtime ontology contract.
 * Keeps route loaders, persistence targets, and adapter bindings typed and inspectable
 * instead of leaving them implicit inside React/Convex runtime code.
 */
export interface RuntimeOntology {
  readonly viewBindings: readonly RuntimeViewBinding[];
  readonly reviewBindings?: readonly RuntimeReviewBinding[];
  readonly transactionBindings?: readonly RuntimeTransactionBinding[];
  readonly auditBindings?: readonly RuntimeAuditBinding[];
  readonly supportBindings?: readonly RuntimeSupportBinding[];
}

/**
 * Full project scope: backend semantic core plus optional frontend scope.
 * Projects may export either:
 *   1. OntologyExports      (flat, backward-compatible)
 *   2. ProjectOntologyScope ({ backend, frontend, runtime? })
 */
export interface ProjectOntologyScope {
  readonly backend: BackendOntology;
  readonly frontend?: FrontendOntology;
  readonly runtime?: RuntimeOntology;
}

/**
 * Backward-compatible project export shape.
 * Existing projects exporting { data, logic, action, security, learn? } still work.
 * New projects may additionally declare `frontend` and `runtime` for project-scope
 * route/agent/view scope and runtime materialization.
 */
export interface OntologyExports extends BackendOntology {
  readonly frontend?: FrontendOntology;
  readonly runtime?: RuntimeOntology;
}

// =========================================================================
// Propagation Graph (L8)
// =========================================================================

export interface PropagationEdge {
  readonly trigger: { entityApiName: string; propertyApiName: string };
  readonly affected: { entityApiName: string; propertyApiName: string };
  readonly mechanism: "link" | "derived" | "interface" | "query";
}

export interface PropagationGraph {
  readonly edges: readonly PropagationEdge[];
  readonly orphanEntities: readonly string[];
  readonly cycles: readonly string[][];
}

// =========================================================================
// Semantic Validation Result (L7)
// =========================================================================

export interface SemanticIssue {
  readonly checkId: string;
  readonly entity: string;
  readonly field?: string;
  readonly expected: string;
  readonly actual: string;
  readonly severity: TestSeverity;
}

// =========================================================================
// Valid PK/Base Types
// =========================================================================

export const VALID_PK_TYPES: readonly BasePropertyType[] = [
  "string", "integer", "long", "BrandedType",
] as const;

export const VALID_BASE_TYPES: readonly BasePropertyType[] = [
  "string", "integer", "long", "float", "double",
  "boolean", "date", "timestamp",
  "geopoint", "geoshape",
  "attachment", "mediaReference",
  "timeseries", "cipher",
  "struct", "vector", "marking",
  "FK", "BrandedType",
] as const;

export const SPECIAL_TYPES: readonly BasePropertyType[] = [
  "geopoint", "geoshape",
  "timeseries", "attachment", "mediaReference",
  "vector", "cipher", "marking",
] as const;
