/**
 * Domain Semantic Definitions — Ontology Schema Redesign
 *
 * TERMINOLOGY NOTICE — LOCAL NORMALIZATION
 * This file defines WHAT each domain (DATA, LOGIC, ACTION) MEANS in real-world
 * terms. It is the foundational contract from which all domain schemas
 * (data/schema.ts, logic/schema.ts, action/schema.ts) derive their scope.
 *
 * IMPORTANT: The three-domain classification (DATA/LOGIC/ACTION) and the
 * security governance overlay are LOCAL NORMALIZATIONS for LLM grounding
 * consistency. Official Palantir documentation (OOSD blog, Jan 2024) uses
 * "data, logic and action ELEMENTS" (lowercase, informal grouping of ontology
 * building blocks). Our schema elevates this to typed SemanticDomainId constants
 * to ensure every LLM session classifies concepts identically. This is a valid
 * abstraction (OOSD-02: Abstraction of Implementation) but is NOT official
 * Palantir architectural terminology. See TERMINOLOGY_CHARTER for details.
 *
 * Semantic Integrity: Every definition is internally complete — no gaps for
 * LLM sessions to fill differently.
 * Semantic Consistency: No two definitions contradict — no contradictions for
 * LLM sessions to resolve differently.
 *
 * Authority: .claude/research/palantir/architecture/ontology-model.md + all domain READMEs
 * Security is excluded — it is a governance overlay, not a semantic domain.
 * See SECURITY_OVERLAY constant for the typed governance overlay definition.
 */

import type { ConstraintContext } from "../meta/types";

/** Schema version following semver convention. */
export const SCHEMA_VERSION = "1.12.0" as const;

// =========================================================================
// Section 0: Terminology Charter
// =========================================================================

/**
 * TERMINOLOGY_CHARTER — Canonical boundary between official Palantir wording
 * and local normalization decisions.
 *
 * Every claim in this schema falls into exactly one of three categories:
 *   1. OFFICIAL FACT — verbatim or closely paraphrased from Palantir docs/blog
 *   2. LOCAL NORMALIZATION — our formalization of an official concept for LLM consistency
 *   3. LOCAL INFERENCE — our extension of official concepts, not directly stated by Palantir
 *
 * This charter exists because passing tests do not prove semantic correctness.
 * A test can validate that HC-SEC-01 has domain="security" without knowing
 * whether Palantir considers security a domain, overlay, or something else.
 *
 * Sources verified 2026-03-17:
 *   SRC-01: palantir.com/docs/foundry/ontology/why-ontology/ — decision capture, digital twin
 *   SRC-02: palantir.com/docs/foundry/architecture-center/ontology-system/ — "four-fold integration of data, logic, action, and security"
 *   SRC-03: palantir.com/docs/foundry/object-permissioning/object-security-policies — cell-level security
 *   SRC-05: palantir.com/docs/foundry/ontology-sdk/typescript-osdk-migration — $returnEdits (post-commit), $validateOnly (pre-commit)
 *   SRC-06: palantir.com/docs/foundry/action-types/action-log — action log, decision capture
 *   SRC-11: palantir.com/docs/foundry/ontology-sdk/overview/ — OSDK generated client, applyAction semantics
 *   SRC-12: blog.palantir.com "Ontology-Oriented Software Development" — data/logic/action elements
 */
export const TERMINOLOGY_CHARTER = {
  localNormalizations: [
    {
      concept: "SemanticDomainId ('data' | 'logic' | 'action')",
      officialWording: "data, logic and action elements (OOSD blog, Jan 2024, lowercase, informal grouping)",
      localDecision: "Elevated to typed SemanticDomainId union for LLM grounding consistency",
      justification: "OOSD-02 (Abstraction of Implementation) — formalized element grouping ensures every LLM session classifies concepts identically",
    },
    {
      concept: "SECURITY_OVERLAY (governance overlay, not 4th domain)",
      officialWording: "SRC-02 Architecture Center: security is a PEER in the 'four-fold integration' (equal column in Language/Engine/Toolchain matrix). SRC-02 also: 'woven into data, logic, and actions' and diagrammed as 'a security layer beneath'. SRC-12 OOSD blog: uses only 3 elements, no security. Official position is genuinely ambiguous — security is simultaneously peer, overlay, and foundation layer.",
      localDecision: "Modeled as GovernanceOverlaySemantics (not a 4th DomainSemantics) because security does not own ConceptTypes and has no digital twin stage mapping. DomainOrOverlay type allows security-tagged HardConstraints.",
      justification: "Security controls access TO data/logic/action but does not own ConceptTypes. The SRC-02 four-fold model treats security as equal for integration purposes, but our semantic classification (SemanticDomainId) models what EXISTS/REASONS/CHANGES — security does none of these. The overlay model is a valid local abstraction of the officially ambiguous positioning.",
    },
    {
      concept: "DomainOrOverlay ('data' | 'logic' | 'action' | 'security')",
      officialWording: "No official equivalent — Palantir does not classify constraints by semantic domain",
      localDecision: "Extended domain type allowing HardConstraints to be tagged with their true governance scope",
      justification: "HC-SEC-* constraints are about security governance, not data modeling — domain='data' was a type-system limitation",
    },
    {
      concept: "Digital Twin Loop (SENSE→DECIDE→ACT→LEARN)",
      officialWording: "Palantir uses 'digital twin' (why-ontology page), 'decision capture' (same page), 'feedback loop' (AIPCon demos)",
      localDecision: "Formalized as 4-stage loop with typed DigitalTwinLoopStage constants mapping to D/L/A + cross-domain",
      justification: "Aggregates official concepts into a computable loop model for Twin Maturity assessment",
    },
    {
      concept: "SH-03 (edit functions vs actions for LOGIC/ACTION classification)",
      officialWording: "Edit functions compute edits but 'running an edit function outside of an Action will not actually modify any object data' (Functions docs). Function-backed actions commit edits. OSDK: $returnEdits commits AND returns edits manifest (post-commit introspection); $validateOnly validates without committing (true preview). These are mutually exclusive.",
      localDecision: "Simplified to 'computes edits (LOGIC) vs commits edits (ACTION)' for classification heuristic. $returnEdits is NOT used for LOGIC/ACTION distinction — the distinction is at the function/action boundary, not the OSDK client mode.",
      justification: "The function/action boundary is the semantic classification point. OSDK client modes ($returnEdits, $validateOnly) are implementation-level concerns that do not affect domain classification.",
    },
  ],
  officialFacts: [
    "The Ontology models decisions through the four-fold integration of data, logic, action, and security (SRC-02, Architecture Center — canonical structural statement)",
    "Object types, link types, action types, functions, interfaces — official ontology building blocks (Palantir docs)",
    "OSDK exposes data, logic and action elements in idiomatic Python, TypeScript and Java (SRC-12, OOSD blog — uses 3 elements, no security)",
    "Object security policies provide row-level security; property security policies provide column-level; combined = cell-level (SRC-03)",
    "Action log captures: Action RID, timestamp, userId, edited objects (SRC-06)",
    "Property security policy restrictions: requires object policy, no PK, at most one policy per property (SRC-03)",
    "When security policies are configured, users do NOT need Viewer permissions on backing datasources (SRC-03)",
    "$returnEdits executes + commits + returns edits manifest; $validateOnly validates without executing; mutually exclusive (SRC-05, OSDK migration guide)",
    "Edit functions outside an Action 'will not actually modify any object data' — only function-backed Actions commit (Palantir Functions docs)",
    "Actions use 'apply' semantics (applyAction method), not 'execute' — edits are 'applied' (SRC-06, SRC-11)",
    "K-LLM is an official Palantir concept — CTO Shyam Sankar presented 'K-LLMs, not LLMs' publicly; Palantir LinkedIn posted 'Never use 1 LLM when you can use K-LLMs' (provenance-audit.md §PA-03.1)",
    "Every decision comprises data, logic, and action — the three constituent elements of decision-making (AIP platform page, search results)",
    "@osdk/maker provides ontology-as-code in TypeScript: defineObject, defineLink, defineInterface, defineAction (npmjs.com/@osdk/maker, provenance-audit.md §PA-08)",
    "Palantir ontology overview uses 2-category taxonomy: semantic (objects, properties, links) vs kinetic (action types, functions) — our 3-domain model splits kinetic into LOGIC + ACTION (provenance-audit.md §PA-03.4)",
  ],
} as const;

// =========================================================================
// Section 1: Type Definitions
// =========================================================================

/**
 * The three semantic domains (LOCAL NORMALIZATION).
 * Official Palantir uses "data, logic and action elements" (OOSD blog, Jan 2024).
 * We formalize these as typed domain IDs for LLM grounding consistency.
 * Security is a governance overlay, not a 4th domain — see SECURITY_OVERLAY.
 */
export type SemanticDomainId = "data" | "logic" | "action";

/**
 * Extended domain identifier that includes the security governance overlay.
 * Use this type when a field needs to represent BOTH semantic domains AND
 * the security overlay (e.g., HardConstraint.domain, SchemaStats keys).
 */
export type DomainOrOverlay = SemanticDomainId | "security";

/**
 * Digital Twin feedback loop stages.
 * The Ontology IS a digital twin — DATA/LOGIC/ACTION map to SENSE/DECIDE/ACT.
 * LEARN is not a separate domain — it is the feedback path from ACT back to SENSE.
 */
export type DigitalTwinStage = "sense" | "decide" | "act";

/** All concept types across the three domains (20 total). */
export type ConceptType =
  // DATA domain (12)
  | "ObjectType" | "Property" | "ValueType" | "StructType" | "SharedPropertyType"
  | "GeoPointProperty" | "GeoShapeProperty" | "GeoTemporalProperty"
  | "TimeSeriesProperty" | "AttachmentProperty" | "VectorProperty" | "CipherProperty"
  // LOGIC domain (5)
  | "LinkType" | "Interface" | "Query" | "DerivedProperty" | "Function"
  // ACTION domain (3)
  | "Mutation" | "Webhook" | "Automation";

/** Multi-domain commercial example. One per sector, representing the purest form. */
export interface DomainExample {
  readonly sector: "healthcare" | "logistics" | "finance" | "education" | "manufacturing" | "military" | "energy";
  readonly concept: string;
  readonly reasoning: string;
}

/** How to classify a specific concept into a domain. */
export interface ClassificationRule {
  readonly id: string;
  readonly concept: string;
  readonly semanticTest: string;
  readonly domain: SemanticDomainId;
  readonly reasoning: string;
  readonly counterArgument?: string;
}

/**
 * Domain-placement decision tree. Resolves to DOMAIN PLACEMENT.
 * Distinct from DecisionHeuristic constants (DH-DATA-*, DH-LOGIC-*, etc.
 * in each domain's schema.ts) which resolve IMPLEMENTATION CHOICES
 * (struct vs entity, etc.) within a domain.
 */
export interface SemanticHeuristic {
  readonly id: string;
  readonly question: string;
  readonly options: readonly {
    readonly condition: string;
    readonly choice: string;
    readonly reasoning: string;
  }[];
  readonly source: string;
  readonly realWorldExample: string;
  /** AI agent context — backpropagated from project bugs. Optional for backward compat. */
  readonly context?: ConstraintContext;
}

/** DATA-LOGIC boundary nuance where structural home differs from semantic domain. */
export interface TransitionZone {
  readonly concept: string;
  readonly structuralHome: string;
  readonly semanticDomain: SemanticDomainId;
  readonly explanation: string;
}

/**
 * Platform constraint that cannot be violated. All severity="error".
 * Domain field uses DomainOrOverlay so security-specific constraints
 * can be correctly tagged as domain="security" rather than masquerading
 * as domain="data". See WI-01 remediation (2026-03-17).
 */
export interface HardConstraint {
  readonly id: string;
  readonly domain: DomainOrOverlay;
  readonly rule: string;
  readonly severity: "error";
  readonly source: string;
  readonly rationale: string;
  /** AI agent context — backpropagated from project bugs. Optional for backward compat. */
  readonly context?: ConstraintContext;
}

/** Cross-domain verification rule. */
export interface ConsistencyInvariant {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly checkLogic: string;
  readonly violationMessage: string;
}

/** Main domain semantics interface — the complete semantic definition of one domain. */
export interface DomainSemantics {
  readonly domain: SemanticDomainId;
  readonly realWorldRole: string;
  readonly semanticQuestion: string;
  readonly description: string;
  readonly analogy: string;
  /** Digital Twin loop stage this domain implements. Source: philosophy/digital-twin.md */
  readonly digitalTwinStage: DigitalTwinStage;
  /** How this domain participates in the LEARN feedback loop. */
  readonly digitalTwinRole: string;
  readonly commercialExamples: readonly DomainExample[];
  /** Project-specific ontology examples (SaveTicker). */
  readonly projectExamples: readonly DomainExample[];
  readonly owns: readonly ConceptType[];
  readonly reads: readonly ConceptType[];
  readonly mustNotContain: readonly ConceptType[];
  readonly classificationRules: readonly ClassificationRule[];
  readonly hardConstraints: readonly HardConstraint[];
  readonly boundaryTestId: string;
}

// =========================================================================
// Section 2: Semantic Heuristics
// =========================================================================

export const SEMANTIC_HEURISTICS: readonly SemanticHeuristic[] = [
  {
    id: "SH-01",
    question: "Does this describe what EXISTS, how to REASON, or how to CHANGE reality?",
    options: [
      {
        condition: "It represents a stored fact about the world — an entity, attribute, measurement, or classification that exists independently of interpretation",
        choice: "DATA",
        reasoning: "DATA is ground truth. If you deleted all LOGIC and ACTION, this would still describe what exists.",
      },
      {
        condition: "It represents how to interpret, connect, traverse, or derive understanding from what exists — relationships, rules, computations, or patterns",
        choice: "LOGIC",
        reasoning: "LOGIC is the intelligence layer. It encodes expert reasoning — the 'tribal knowledge' that makes raw data useful.",
      },
      {
        condition: "It represents a lever that, when pulled, changes the state of the real world — creating, modifying, deleting, or triggering external effects",
        choice: "ACTION",
        reasoning: "ACTION is the execution layer. It follows LOGIC's blueprint to commit changes and fire side effects.",
      },
    ],
    source: ".claude/research/palantir/architecture/ontology-model.md §ARCH-19 — Decision-Centric Systems table",
    realWorldExample: "ERP inventory levels are DATA (current stock counts exist as facts). 'If stock < reorder point, flag' is LOGIC (reasoning rule). 'Create purchase order to replenish' is ACTION (changes reality).",
  },
  {
    id: "SH-02",
    question: "If I deleted all LOGIC and ACTION, would this still describe reality?",
    options: [
      {
        condition: "Yes — this concept exists as a stored fact independent of any interpretation, relationship, or execution",
        choice: "DATA",
        reasoning: "DATA is foundational and standalone. It has no upstream dependencies beyond ENTRY.",
      },
      {
        condition: "No — this concept is an interpretation, connection, or derivation that requires DATA to exist first",
        choice: "Not DATA — apply SH-01 to distinguish LOGIC from ACTION",
        reasoning: "LOGIC and ACTION both depend on DATA. This test confirms DATA independence.",
      },
    ],
    source: ".claude/research/palantir/data/README.md — 'DATA is standalone and foundational'",
    realWorldExample: "A Patient record (name, DOB, blood type) survives deletion of all reasoning and actions — it is DATA. A Diagnosis→Treatment link only makes sense because Patient and Treatment exist — it depends on DATA, so it is not DATA.",
  },
  {
    id: "SH-03",
    question: "Does this compute edits (describe impact) or commit edits (execute change)?",
    options: [
      {
        condition: "It computes edits without committing — describes what SHOULD happen along propagation paths",
        choice: "LOGIC",
        reasoning: "Edit functions compute ontology edits within a function context. They are the causality blueprint — they compute, not execute. (LOCAL NORMALIZATION: official Palantir 'Ontology edits' docs describe functions as making edits; our heuristic simplifies to 'compute vs commit' for classification.)",
      },
      {
        condition: "It commits edits permanently, triggers webhooks, or schedules automated execution",
        choice: "ACTION",
        reasoning: "Function-backed Actions wrap edit functions and COMMIT. The wrapper is ACTION; the inner edit function is LOGIC. OSDK client modes: $returnEdits commits AND returns the edits manifest (post-commit introspection, NOT a preview). $validateOnly checks submission criteria only without committing (true non-committing preview).",
      },
    ],
    source: ".claude/research/palantir/logic/README.md — Three-layer separation: (1) edit functions compute edits (LOGIC), (2) function-backed actions commit edits (ACTION), (3) OSDK $returnEdits=post-commit edit introspection, $validateOnly=pre-commit validation only. Source: OSDK TypeScript migration guide (palantir.com/docs/foundry/ontology-sdk/typescript-osdk-migration)",
    realWorldExample: "An edit function traversing Incident→Alerts and computing each Alert.status='Resolved' is LOGIC (computes impact). The function-backed Action that wraps it and commits those edits is ACTION. $returnEdits:true returns the edit manifest AFTER commit; $validateOnly:true validates WITHOUT commit.",
  },
] as const;

// =========================================================================
// Section 3: Transition Zones
// =========================================================================

export const TRANSITION_ZONES: readonly TransitionZone[] = [
  {
    concept: "LinkType",
    structuralHome: "data/links.md",
    semanticDomain: "logic",
    explanation:
      "Link Types have structural definitions (cardinality, FK property, join entity) that feel DATA-like. "
      + "But their PRIMARY purpose is enabling reasoning and traversal — 'given a Patient, find their Doctor' "
      + "is a reasoning path, not a stored fact. Links are the edges of the Impact Propagation Graph. "
      + "The structural definition is the schema; the semantic role is LOGIC.",
  },
  {
    concept: "Interface",
    structuralHome: "data/interfaces.md",
    semanticDomain: "logic",
    explanation:
      "Interfaces declare shape contracts (required properties, link constraints) that feel DATA-like. "
      + "But their PRIMARY purpose is enabling connection polymorphism — 'anything that implements ITrackable "
      + "can be tracked the same way' is a reasoning category, not an entity definition. "
      + "Interfaces are connection contracts for the Impact Propagation Graph.",
  },
  {
    concept: "Query/ObjectSet",
    structuralHome: "data/queries.md",
    semanticDomain: "logic",
    explanation:
      "Queries define API surface (filter fields, parameters, return types) that feel DATA-like. "
      + "But their PRIMARY computational use is graph traversal for reasoning — SearchAround patterns, "
      + "multi-hop cascading edit scope, impact scope determination. LOGIC owns the computational use "
      + "of Object Sets; DATA defines the Object Set API itself.",
  },
  {
    concept: "DerivedProperty",
    structuralHome: "data/derived-properties.md",
    semanticDomain: "logic",
    explanation:
      "Derived Properties have schema definitions (base type, derivation category) that feel DATA-like. "
      + "But their PRIMARY role is computation — link traversal formulas, weighted aggregations, "
      + "cascading derived values. They are interpretation of raw data, not the data itself. "
      + "The definition is in DATA's territory; the computation belongs to LOGIC.",
  },
] as const;

// =========================================================================
// Section 3.5: Security Governance Overlay
// =========================================================================

/**
 * Security governance overlay semantics.
 * Security is NOT a 4th semantic domain — it does not own ConceptTypes.
 * It is a governance layer that controls access, permissions, classification,
 * and visibility ACROSS all three semantic domains.
 */
export interface GovernanceOverlaySemantics {
  /** Governance overlay identifier. */
  readonly overlay: "security";
  /** What this overlay governs. */
  readonly realWorldRole: string;
  /** The semantic question for governance concerns. */
  readonly semanticQuestion: string;
  /** Description of governance scope. */
  readonly description: string;
  /** Three-layer security model. */
  readonly layers: readonly {
    readonly name: string;
    readonly mechanism: string;
    readonly scope: string;
  }[];
}

/** Typed security governance overlay — NOT a semantic domain. */
export const SECURITY_OVERLAY: GovernanceOverlaySemantics = {
  overlay: "security",
  realWorldRole: "Controls who can access, modify, or view ontology resources across all domains",
  semanticQuestion: "Does this control access, permissions, classification, or visibility?",
  description:
    "Security is a governance overlay that operates across DATA, LOGIC, and ACTION. "
    + "It does not own ConceptTypes (ObjectType, LinkType, etc.) — instead, it governs "
    + "access to them. A security policy does not describe what EXISTS (DATA), how to "
    + "REASON (LOGIC), or how to CHANGE reality (ACTION). It controls WHO is allowed to "
    + "do those things. This is why security is a cross-cutting overlay, not a 4th domain.",
  layers: [
    {
      name: "RBAC (Role-Based Access Control)",
      mechanism: "Ontology Roles define broad permission categories across resource types",
      scope: "Coarsest access control — which users can see which object types and which actions they can perform",
    },
    {
      name: "Marking-Based Access (Classification)",
      mechanism: "Classification labels (Public, Internal, Confidential, Secret) attached to individual data items",
      scope: "Data sensitivity — ensures sensitive information is only accessible to properly cleared users",
    },
    {
      name: "Object-Level Security (Row/Column)",
      mechanism: "Row-level security (individual object policies) and column-level security (restricted views)",
      scope: "Fine-grained — individual objects and properties can have distinct access policies",
    },
    {
      name: "Cell-Level Security (Object + Property Policies)",
      mechanism: "Object security policies guard per-instance view permissions via mandatory control properties; property security policies guard specific field visibility — unauthorized users see null values. Combined, they enable per-cell granularity independent of backing datasource permissions.",
      scope: "Most granular — per-object-instance × per-property access decisions. If user fails object policy the row is hidden; if user passes object policy but fails property policy the value is null. Datasource Viewer permissions are NOT required when policies are configured.",
    },
  ],
} as const;

// =========================================================================
// Section 4: DATA_SEMANTICS
// =========================================================================

export const DATA_SEMANTICS: DomainSemantics = {
  domain: "data",
  realWorldRole: "Represents the current state of the world as operational ground truth",
  semanticQuestion: "Does this describe WHAT EXISTS right now — independent of interpretation or action?",
  description:
    "DATA is the context store of what exists. It represents reality as-is: entities, their properties, "
    + "their types, and their structural shape. In a commercial sense: ERP inventory levels, CRM customer "
    + "records, engineering specs, sensor readings, financial instruments. On a battlefield: sensor fusion "
    + "data, intelligence reports, signals intelligence. DATA is standalone and foundational — if you deleted "
    + "all LOGIC and ACTION, DATA alone would still describe what exists in the world. DATA does not define "
    + "how entities relate (LOGIC), how state changes occur (ACTION), or who can access what (SECURITY).",
  analogy:
    "A library's catalog: it records what books exist, their titles, ISBNs, page counts, and shelf "
    + "locations — facts about the collection independent of how anyone uses or interprets them.",
  digitalTwinStage: "sense",
  digitalTwinRole:
    "SENSE: Multi-modal data integration captures the current state of reality. DATA entities are the "
    + "structured output of sensing — they reflect what the world looks like RIGHT NOW. In the LEARN "
    + "feedback path, ACTION outcomes produce new DATA (action logs, updated metrics, corrected predictions) "
    + "that become the next cycle's SENSE input. DATA also serves as the trusted query source for "
    + "LLM-grounded decisions (OAG Pattern 1).",
  commercialExamples: [
    {
      sector: "healthcare",
      concept: "Patient record — demographics (name, DOB, blood type), diagnoses (ICD-10 codes), vital signs (heart rate, BP, SpO2), lab results (CBC panel values)",
      reasoning: "A patient record describes what exists about a person in the healthcare system — stored facts independent of any clinical interpretation or treatment action",
    },
    {
      sector: "logistics",
      concept: "Warehouse — GPS coordinates (lat 40.7128, lon -74.0060), storage capacity (50,000 m³), throughput rate (200 pallets/hour), temperature zones (ambient, chilled -2C, frozen -18C)",
      reasoning: "A warehouse exists as a physical facility with measurable attributes — facts about the world independent of routing decisions or shipment dispatches",
    },
    {
      sector: "finance",
      concept: "Financial instrument — ticker symbol (AAPL), ISIN (US0378331005), market capitalization ($2.8T), sector (Technology), exchange (NASDAQ), currency (USD)",
      reasoning: "A security exists on an exchange with these attributes — they describe what is, not how to interpret risk or execute trades",
    },
    {
      sector: "education",
      concept: "Student enrollment — student ID (S-20260001), enrolled credits (15), cumulative GPA (3.7), degree program (Computer Science BS), academic standing (Good Standing)",
      reasoning: "A student's enrollment is a fact about their current state in the institution — stored ground truth independent of prerequisite reasoning or registration actions",
    },
    {
      sector: "manufacturing",
      concept: "CNC machine — serial number (CNC-4521), model (DMG MORI CMX 600V), axis count (5), spindle speed range (0-12000 RPM), tool magazine capacity (30), vibration sensor array (X/Y/Z accelerometers)",
      reasoning: "The machine exists with these engineering specifications — measurable physical facts about installed equipment on the factory floor",
    },
    {
      sector: "military",
      concept: "Intelligence report — classification level (SECRET), source reliability (B - Usually Reliable), content body, geolocation of origin (38.8977°N, 77.0365°W), corroboration status (Partially Corroborated)",
      reasoning: "The report exists as a collected artifact — its existence and attributes are facts, distinct from how analysts interpret or act on it",
    },
    {
      sector: "energy",
      concept: "Power generation unit — nameplate capacity (500 MW), fuel type (natural gas combined cycle), heat rate (6,200 BTU/kWh), grid connection point (Node-7A), emissions profile (CO2: 0.4 t/MWh), availability factor (92%)",
      reasoning: "The generator exists with these engineering parameters — physical facts about installed equipment independent of dispatch decisions or load balancing logic",
    },
  ],
  projectExamples: [
    { sector: "finance", concept: "NewsArticle — title, body, source, publishedAt, imageUrl, sentiment score", reasoning: "A news article exists with these journalistic attributes — factual content about a published item" },
    { sector: "finance", concept: "Stock — tickerSymbol, companyName, sector, marketCap, currentPrice", reasoning: "A stock entity stores observable market facts — the instrument exists with these properties" },
    { sector: "finance", concept: "ImpactChain — sourceArticleId, affectedStockId, impactDirection, confidence", reasoning: "Impact chain captures the data relationship between a news event and a stock — structural fact" },
    { sector: "finance", concept: "Explainer — generatedText, model, promptVersion, createdAt", reasoning: "An explainer record holds the generated explanation output — content artifact with metadata" },
  ],
  owns: [
    "ObjectType", "Property", "ValueType", "StructType", "SharedPropertyType",
    "GeoPointProperty", "GeoShapeProperty", "GeoTemporalProperty",
    "TimeSeriesProperty", "AttachmentProperty", "VectorProperty", "CipherProperty",
  ],
  reads: [],
  mustNotContain: [
    "LinkType", "Interface", "Query", "DerivedProperty", "Function",
    "Mutation", "Webhook", "Automation",
  ],
  classificationRules: [
    {
      id: "CR-DATA-01",
      concept: "GeoPoint property on a Warehouse entity",
      semanticTest: "Does the warehouse's physical location describe what EXISTS?",
      domain: "data",
      reasoning: "A GPS coordinate is a stored fact about where a physical facility is located — it exists independently of any routing logic or dispatch action",
    },
    {
      id: "CR-DATA-02",
      concept: "Cipher property storing an encrypted SSN",
      semanticTest: "Does the encrypted Social Security Number describe what EXISTS?",
      domain: "data",
      reasoning: "The encrypted value is stored state — the SSN exists as a fact about a person, encrypted at rest for compliance. Encryption is a storage concern, not reasoning or execution",
    },
    {
      id: "CR-DATA-03",
      concept: "Vector embedding on a Document entity",
      semanticTest: "Does the 1536-dimensional embedding describe what EXISTS?",
      domain: "data",
      reasoning: "The embedding is a stored numeric representation of the document's content — it exists as a computed artifact persisted alongside the document, not an active computation",
    },
    {
      id: "CR-DATA-04",
      concept: "Attachment property (X-ray DICOM image) on a Patient entity",
      semanticTest: "Does the X-ray file describe what EXISTS?",
      domain: "data",
      reasoning: "The image file exists as a stored binary asset — a fact about what was captured. Interpreting the X-ray (reading for fractures) would be LOGIC; the file itself is DATA",
    },
    {
      id: "CR-DATA-05",
      concept: "StructType (Address: street, city, state, zip, country)",
      semanticTest: "Does the address composite shape describe what EXISTS?",
      domain: "data",
      reasoning: "A struct defines how data is shaped — it is a schema-level fact about structure. The address exists as nested fields within an entity, not as an independent reasoning path",
    },
  ],
  hardConstraints: [
    {
      id: "HC-DATA-01",
      domain: "data",
      rule: "Cipher properties cannot be indexed or used in filters",
      severity: "error",
      source: ".claude/research/palantir/data/cipher.md",
      rationale: "Encrypted data cannot be compared, sorted, or filtered without decryption — indexing would require the plaintext, defeating the purpose of encryption at rest",
    },
    {
      id: "HC-DATA-02",
      domain: "data",
      rule: "Primary key property is immutable after object creation",
      severity: "error",
      source: ".claude/research/palantir/data/entities.md",
      rationale: "PK immutability ensures referential integrity across all links, indexes, and external references — changing a PK would orphan all downstream references",
    },
    {
      id: "HC-DATA-03",
      domain: "data",
      rule: "Maximum 2,000 properties per ObjectType (OSv2)",
      severity: "error",
      source: ".claude/research/palantir/architecture/ontology-model.md §ARCH-39 — Canonical Constraints",
      rationale: "Object Storage V2 hard limit — exceeding this causes schema compilation failure",
    },
    {
      id: "HC-DATA-04",
      domain: "data",
      rule: "KNN vector search maximum K=100 results",
      severity: "error",
      source: ".claude/research/palantir/data/vectors.md",
      rationale: "Platform limit on nearest-neighbor result count — requesting K>100 causes API error",
    },
    {
      id: "HC-DATA-05",
      domain: "data",
      rule: "KNN vector maximum 2,048 dimensions",
      severity: "error",
      source: ".claude/research/palantir/data/vectors.md",
      rationale: "Platform limit on embedding dimensionality — vectors exceeding 2048 dimensions cannot be indexed",
    },
  ],
  boundaryTestId: "DS-1",
} as const;

// =========================================================================
// Section 5: LOGIC_SEMANTICS
// =========================================================================

export const LOGIC_SEMANTICS: DomainSemantics = {
  domain: "logic",
  realWorldRole: "Models how to think about and interpret the current state — the causality blueprint",
  semanticQuestion: "Does this describe HOW TO REASON about what exists — connections, interpretations, derived understanding?",
  description:
    "LOGIC is the intelligence layer. It captures how experts reason about DATA — the 'tribal knowledge' "
    + "of institutions encoded as computable relationships and rules. In a commercial sense: the business "
    + "logic in 'the report named after Bob who has been there 20 years,' forecast models, optimization "
    + "models, the rules for interpreting which metrics matter. On a battlefield: link analysis, classifier "
    + "models, search-around patterns. LOGIC contains two complementary concerns: the Impact Propagation "
    + "Graph (primary — links, interfaces, derived properties, queries) defining how changes flow through "
    + "connections, and Pure Computation (supporting — validation, formatting, derivation functions) "
    + "operating along those paths. LOGIC describes; it does not execute.",
  analogy:
    "A librarian's expertise: knowing that these two authors influenced each other, that readers who "
    + "liked Book A will want Book B, how to trace a citation chain across disciplines — the intelligence "
    + "layer that makes the catalog useful for answering real questions.",
  digitalTwinStage: "decide",
  digitalTwinRole:
    "DECIDE: AI/ML modeling, expert reasoning, and impact propagation compute over current DATA state "
    + "to inform decisions. LOGIC functions produce decision recommendations without executing them. "
    + "In the LEARN feedback path, decision outcomes refine DecisionHeuristics — the DH constants evolve "
    + "from static tribal knowledge into continuously-improved institutional memory. Functions marked with "
    + "toolExposure serve as deterministic tools for LLM orchestration (Pattern 2: Logic Tool Handoff).",
  commercialExamples: [
    {
      sector: "healthcare",
      concept: "Diagnosis → Treatment protocol link chain with Drug → Contraindication traversal: given symptoms, traverse to matching diagnoses, follow links to approved treatments, check patient allergy links against drug contraindication links",
      reasoning: "This is expert clinical reasoning encoded as computable traversal — the path a clinician follows mentally to prescribe safely, not raw patient data or the act of prescribing",
    },
    {
      sector: "logistics",
      concept: "Shipment → Route → Checkpoint link chain with estimatedArrival derived property computed from distance, speed, and dwell-time along the chain, plus supplierDelay SearchAround: find all shipments affected by a single supplier disruption within 2 hops",
      reasoning: "Supply chain reasoning: understanding how a delay at one node propagates through the network is pure interpretation — it describes impact, not stored state or dispatched shipments",
    },
    {
      sector: "finance",
      concept: "Portfolio → Holding → Security link traversal with portfolioBeta derived property (weighted sum of individual betas across holdings) and sectorConcentration validation function (flag if >40% in one sector)",
      reasoning: "Risk analysis is reasoning about data — computing exposure, checking concentration limits, understanding how one security's move affects the whole portfolio. No state is changed.",
    },
    {
      sector: "education",
      concept: "Course prerequisite chain: Course A requires Course B which requires Course C. meetsPrerequisites derived property: student satisfies prerequisites if all ancestor courses have passing grades (recursive link traversal)",
      reasoning: "Prerequisite reasoning is graph traversal — the chain defines how to think about whether a student can enroll, not the enrollment itself or the courses themselves",
    },
    {
      sector: "manufacturing",
      concept: "Predictive maintenance function: if vibration exceeds threshold (>4.5 mm/s) AND operating hours surpass cycle limit (>2000h) AND last inspection >90 days ago, derive maintenanceUrgency from weighted factors (0.4*vibration + 0.35*hours + 0.25*inspection)",
      reasoning: "This is the tribal knowledge of a veteran machinist encoded as computable logic — expert reasoning about when a machine needs attention, independent of actually creating the work order",
    },
    {
      sector: "military",
      concept: "Link analysis: connecting intercepted communication nodes to known entity identifiers via signal metadata, with confidenceScore derived property aggregating corroboration across 3+ intelligence sources using Bayesian weight combination",
      reasoning: "Intelligence analysis is pure reasoning — connecting disparate data points into an understanding of who is connected to whom and how confident we are. No kinetic action is taken.",
    },
    {
      sector: "energy",
      concept: "Grid load balancing: generation units linked to grid nodes, with netLoadFactor derived property computed from (total generation - total demand) across connected nodes, plus contingency SearchAround: if Unit X trips, find all nodes affected within 2 hops",
      reasoning: "Grid reasoning is understanding how power flows and what happens when something changes — the causality blueprint of the electrical network. Adjusting generation output would be ACTION.",
    },
  ],
  projectExamples: [
    { sector: "finance", concept: "threadArticles link (1:M) — connects NewsArticle to StoryThread via camelCase link name", reasoning: "A link defines HOW articles relate to threads — structural reasoning about relationships, not the article data itself" },
    { sector: "finance", concept: "articleCount derived property — computed count of articles per StoryThread", reasoning: "A derived property computes aggregate values from existing data — interpretation layer, not raw storage" },
    { sector: "finance", concept: "findAffectedArticles query — ObjectSet filter for articles matching impact criteria", reasoning: "A query defines HOW to retrieve and filter data — reasoning about which objects match criteria" },
  ],
  owns: ["LinkType", "Interface", "Query", "DerivedProperty", "Function"],
  reads: ["ObjectType", "Property", "ValueType"],
  mustNotContain: [
    "ObjectType", "Property", "ValueType", "StructType", "SharedPropertyType",
    "GeoPointProperty", "GeoShapeProperty", "GeoTemporalProperty",
    "TimeSeriesProperty", "AttachmentProperty", "VectorProperty", "CipherProperty",
    "Mutation", "Webhook", "Automation",
  ],
  classificationRules: [
    {
      id: "CR-LOGIC-01",
      concept: "LinkType connecting Patient to Doctor (M:1 cardinality, FK on Patient)",
      semanticTest: "Does 'Patient has treating Doctor' describe how to REASON about entities?",
      domain: "logic",
      reasoning: "A link is a reasoning path between entities — 'given a Patient, find their Doctor' enables traversal and impact analysis. The link is an edge in the Impact Propagation Graph.",
      counterArgument: "Links have structural definitions (cardinality, FK property, join entity) that feel DATA-like. But the PURPOSE of a link is reasoning/traversal, not describing what exists. A Patient and a Doctor exist independently (DATA); how they relate is LOGIC.",
    },
    {
      id: "CR-LOGIC-02",
      concept: "Edit function computing ontology edits — traverses Incident→Alerts and computes each Alert.status='Resolved'",
      semanticTest: "Does computing impact edits without committing describe how to REASON?",
      domain: "logic",
      reasoning: "Edit functions compute what SHOULD happen along propagation paths without committing. They compute edits — a description of impact, not an execution of change. (OFFICIAL FACT: 'running an edit function outside of an Action will not actually modify any object data' — Palantir Functions docs.) (THREE-LAYER: function computes → action commits → OSDK $returnEdits=post-commit introspection, $validateOnly=pre-commit validation)",
    },
    {
      id: "CR-LOGIC-03",
      concept: "Interface ITrackable requiring {status, lastUpdated} properties and link to AuditLog",
      semanticTest: "Does a shape contract with link constraints describe how to REASON?",
      domain: "logic",
      reasoning: "An interface is a connection contract for polymorphic reasoning — 'anything implementing ITrackable can be tracked the same way.' It enables treating diverse entity types uniformly, which is a reasoning capability.",
      counterArgument: "Interfaces declare property shapes that feel DATA-like. But the PURPOSE is enabling connection polymorphism — a reasoning pattern, not an entity definition.",
    },
    {
      id: "CR-LOGIC-04",
      concept: "DerivedProperty totalRevenue computed from sum of linked LineItem.amount values",
      semanticTest: "Does a computed value from link traversal describe how to REASON?",
      domain: "logic",
      reasoning: "A derived property is interpretation of raw data via computation — totalRevenue doesn't exist as stored state, it's computed by traversing links and aggregating. This is reasoning about data, not the data itself.",
    },
    {
      id: "CR-LOGIC-05",
      concept: "Query/ObjectSet findAffectedSuppliers via SearchAround from Product through SupplyChain links",
      semanticTest: "Does graph traversal for scoping impact describe how to REASON?",
      domain: "logic",
      reasoning: "A query traverses the Impact Propagation Graph to scope the affected set — this is computational reasoning about which entities are impacted, not a stored fact or an execution.",
    },
    {
      id: "CR-LOGIC-06",
      concept: "$validateOnly operation checking submission criteria without mutating state",
      semanticTest: "Does checking validity without changing anything describe how to REASON?",
      domain: "logic",
      reasoning: "$validateOnly reasons about whether constraints are satisfied — it returns a validity assessment without committing any change. Reasoning about validity is LOGIC even though it is invoked via the Action API.",
      counterArgument: "$validateOnly is invoked in the context of an Action and is documented under Action Types. But the semanticTest is clear: no state changes occur, making it reasoning (LOGIC), not execution (ACTION).",
    },
  ],
  hardConstraints: [
    {
      id: "HC-LOGIC-01",
      domain: "logic",
      rule: "SearchAround maximum 3 hops per traversal chain",
      severity: "error",
      source: ".claude/research/palantir/architecture/ontology-model.md §ARCH-39 — Canonical Constraints",
      rationale: "Platform limit on graph traversal depth — exceeding 3 hops causes exponential result expansion and API timeout",
    },
    {
      id: "HC-LOGIC-02",
      domain: "logic",
      rule: "ObjectSet .all() maximum 100,000 objects",
      severity: "error",
      source: ".claude/research/palantir/architecture/ontology-model.md §ARCH-39 — Canonical Constraints",
      rationale: "Memory and performance limit on materializing Object Sets — exceeding this causes OOM or timeout in function execution",
    },
    {
      id: "HC-LOGIC-03",
      domain: "logic",
      rule: "No circular dependencies in derived property computation chains",
      severity: "error",
      source: ".claude/research/palantir/logic/README.md",
      rationale: "Circular derived dependencies cause infinite computation loops — property A derives from B which derives from A is undefined behavior",
    },
    {
      id: "HC-LOGIC-04",
      domain: "logic",
      rule: "Aggregation maximum 10,000 buckets",
      severity: "error",
      source: ".claude/research/palantir/architecture/ontology-model.md §ARCH-39 — Canonical Constraints",
      rationale: "Platform limit on aggregation granularity — exceeding 10K buckets causes performance degradation and potential timeout",
    },
  ],
  boundaryTestId: "DS-2",
} as const;

// =========================================================================
// Section 6: ACTION_SEMANTICS
// =========================================================================

export const ACTION_SEMANTICS: DomainSemantics = {
  domain: "action",
  realWorldRole: "Defines levers that affect the real world when executed — commits, triggers, orchestrates",
  semanticQuestion: "Does this CHANGE REALITY when executed — creating, modifying, deleting, or triggering external effects?",
  description:
    "ACTION is the execution layer. It commits state changes described by LOGIC, triggers external side "
    + "effects, and orchestrates automated workflows. In a commercial sense: creating a work order for a "
    + "technician, a stock transfer order to move product, adjusting reorder points, sending notifications. "
    + "On a battlefield: kinetic actions, simulations, operational plans that translate into real intervention. "
    + "ACTION is execution-only — it does not compute, derive, or describe. It commits and triggers. The core "
    + "principle: 'ACTION is merely the executor that follows LOGIC's blueprint when a change actually occurs.'",
  analogy:
    "The circulation desk: checking out books, processing returns, ordering new acquisitions, sending "
    + "overdue notices — the operations that change the library's state when actually executed. The desk "
    + "follows the librarian's expertise to know what to do.",
  digitalTwinStage: "act",
  digitalTwinRole:
    "ACT: Approved decisions execute across all enterprise substrates — mutations commit state changes, "
    + "webhooks sync external systems, automations orchestrate scheduled workflows. ACTION is the kinetic "
    + "layer that CHANGES reality. In the LEARN feedback path, every action execution produces outcomes that "
    + "become new DATA: action logs capture WHEN/WHO/WHAT, updated metrics reflect impact, and decision "
    + "lineage records the full reasoning chain. Progressive autonomy (5 levels) governs how much AI "
    + "independence the system allows for each action type.",
  commercialExamples: [
    {
      sector: "healthcare",
      concept: "Prescribe medication mutation: creates PrescriptionOrder, links to Patient and Pharmacy, fires transactional webhook to pharmacy dispensing system, with submission criteria: prescriber must hold active license AND drug not in patient allergy list",
      reasoning: "Prescribing changes reality — a new order exists, the pharmacy is notified, the patient's medication list is altered. This is a real-world intervention, not reasoning.",
    },
    {
      sector: "logistics",
      concept: "Dispatch shipment mutation: assigns Driver to Shipment, updates Route status to 'in-transit', creates initial TrackingEvent, fires webhook to customer notification system with estimated delivery window",
      reasoning: "Dispatching a shipment changes the real world — a driver is committed to a route, a truck begins moving, a customer receives a notification. These are irreversible operational changes.",
    },
    {
      sector: "finance",
      concept: "Execute trade mutation: creates TradeOrder with execution price, updates Portfolio holding quantities, fires compliance-check webhook, with submission criteria: order notional value < daily risk limit AND security not in restricted trading list",
      reasoning: "Executing a trade changes financial reality — capital is committed, positions shift, regulatory obligations are triggered. This is a real-world financial intervention.",
    },
    {
      sector: "education",
      concept: "Enroll student mutation: creates Enrollment record, decrements available seats on Course, fires prerequisite validation, with waitlist automation: if seat opens AND student is first on waitlist, auto-enroll and notify via email webhook",
      reasoning: "Enrollment changes reality — a seat is taken, a student's schedule is altered, billing and room assignment systems are triggered downstream.",
    },
    {
      sector: "manufacturing",
      concept: "Create work order mutation: assigns Technician to Machine, sets priority from maintenanceUrgency (LOGIC), fires notification to shift supervisor, with escalation automation: if priority='critical' AND unacknowledged after 4 hours, escalate to plant manager",
      reasoning: "Creating a work order commits resources — a technician's schedule changes, parts may be ordered, production may be interrupted. This is a real operational intervention.",
    },
    {
      sector: "military",
      concept: "Authorize operational plan mutation: commits resource allocations (personnel, equipment, logistics), updates force readiness status, fires encrypted webhook to command chain, with submission criteria: authorization requires two-star or higher clearance level",
      reasoning: "Authorizing an operation changes the real world irreversibly — forces are committed, supplies are consumed, the operational state shifts. This is the ultimate ACTION.",
    },
    {
      sector: "energy",
      concept: "Adjust generation output mutation: modifies plant MW setpoint, triggers SCADA webhook to distributed control system for governor adjustment, with automation: if grid frequency deviates >0.5Hz from 60Hz, auto-dispatch reserve generation units within 30 seconds",
      reasoning: "Adjusting output changes physical reality — turbines spin faster or slower, electrons flow differently, grid frequency responds. This is direct physical intervention via digital twin.",
    },
  ],
  projectExamples: [
    { sector: "finance", concept: "createStoryThread mutation — creates a new thread grouping related news articles", reasoning: "Creating a thread changes reality — a new entity is written to the database, affecting downstream views" },
    { sector: "finance", concept: "assignArticleToThread mutation — links an article into an existing story thread", reasoning: "Assignment modifies the relationship graph — a write operation that changes which articles belong to which thread" },
    { sector: "finance", concept: "addImpactNode mutation — adds a stock impact to an article's causal chain", reasoning: "Adding an impact node creates a new edge in the impact graph — a state-changing write operation" },
  ],
  owns: ["Mutation", "Webhook", "Automation"],
  reads: ["ObjectType", "Property", "Function", "LinkType"],
  mustNotContain: [
    "ObjectType", "Property", "ValueType", "StructType", "SharedPropertyType",
    "GeoPointProperty", "GeoShapeProperty", "GeoTemporalProperty",
    "TimeSeriesProperty", "AttachmentProperty", "VectorProperty", "CipherProperty",
    "LinkType", "Interface", "Query", "DerivedProperty", "Function",
  ],
  classificationRules: [
    {
      id: "CR-ACTION-01",
      concept: "Mutation createWorkOrder: creates WorkOrder entity, assigns Technician, sets priority",
      semanticTest: "Does creating a work order CHANGE REALITY?",
      domain: "action",
      reasoning: "Creating a work order is a real-world intervention — a technician is committed, maintenance is scheduled, production may be affected. State is permanently changed.",
    },
    {
      id: "CR-ACTION-02",
      concept: "Webhook notifySupplier: fires HTTP POST to supplier API on shipment delay detection",
      semanticTest: "Does sending a notification to an external system CHANGE REALITY?",
      domain: "action",
      reasoning: "A webhook fires a side effect to an external system — the supplier receives information and may take real-world action. This is execution, not reasoning.",
    },
    {
      id: "CR-ACTION-03",
      concept: "Automation nightlyInventoryReconciliation: cron job at 02:00 UTC comparing physical counts against system records",
      semanticTest: "Does a scheduled reconciliation job CHANGE REALITY?",
      domain: "action",
      reasoning: "A cron automation executes mutations on a schedule — it changes stored state by reconciling discrepancies. The scheduled execution makes it ACTION, not LOGIC.",
    },
    {
      id: "CR-ACTION-04",
      concept: "$validateOnly operation: checks submission criteria without committing any edits",
      semanticTest: "Does validation-only checking CHANGE REALITY?",
      domain: "logic",
      reasoning: "$validateOnly does NOT change reality — it reasons about whether constraints are satisfied. Despite being invoked via the Action API, its semantic nature is LOGIC (reasoning about validity).",
      counterArgument: "$validateOnly is documented under Action Types and invoked via applyAction with $validateOnly:true. But the semanticTest is decisive: no state changes = not ACTION. The invocation context is an implementation detail; the semantic classification follows the question 'does this CHANGE reality?' Answer: no.",
    },
    {
      id: "CR-ACTION-05",
      concept: "Function-backed Action wrapping an edit function: calls closeIncident edit function then commits all returned Edits[]",
      semanticTest: "Does wrapping and committing edit function results CHANGE REALITY?",
      domain: "action",
      reasoning: "The wrapper commits what the edit function described — the edit function itself is LOGIC (returns Edits[]), but the function-backed Action that calls it and commits the edits is ACTION. The boundary is at the commit point.",
    },
  ],
  hardConstraints: [
    {
      id: "HC-ACTION-01",
      domain: "action",
      rule: "Maximum 10,000 objects editable per single Action (OSv2)",
      severity: "error",
      source: ".claude/research/palantir/architecture/ontology-model.md §ARCH-39 — Canonical Constraints",
      rationale: "Object Storage V2 transaction size limit — exceeding this causes transaction failure. Batch actions must respect this ceiling.",
    },
    {
      id: "HC-ACTION-02",
      domain: "action",
      rule: "$validateOnly and $returnEdits are mutually exclusive — cannot use both in same request",
      severity: "error",
      source: ".claude/research/palantir/action/README.md — Execution-Only Principle",
      rationale: "$validateOnly checks submission criteria without executing (true non-committing mode); $returnEdits executes AND commits the action but also returns the edits manifest in the response (post-commit introspection, NOT a preview). These serve different purposes and cannot be combined. (OFFICIAL FACT: OSDK TypeScript migration guide states 'It is not possible to return edits and validateOnly at the same time.')",
    },
    {
      id: "HC-ACTION-03",
      domain: "action",
      rule: "Function-backed rule is exclusive — no other rules allowed when a function rule is present in an Action",
      severity: "error",
      source: ".claude/research/palantir/action/README.md — Two-Tier Action Architecture",
      rationale: "When a function rule is present, the function takes full responsibility for all edits. Mixing simple rules with function rules creates ambiguous ownership of state changes.",
    },
    {
      id: "HC-ACTION-04",
      domain: "action",
      rule: "Search APIs see OLD state during function execution (eventual consistency lag)",
      severity: "error",
      source: ".claude/research/palantir/action/README.md — Tier 2: Function-Backed Rules",
      rationale: "Functions execute within a transaction boundary where search indexes have not yet been updated. Queries within a function may return stale results — must design for this.",
    },
    {
      id: "HC-ACTION-05",
      domain: "action",
      rule: "ALL submission criteria must pass before action can execute — independent from edit permissions",
      severity: "error",
      source: ".claude/research/palantir/action/README.md — Submission Criteria",
      rationale: "Submission criteria are a business logic gate on execution — if any criterion fails, the action is rejected and no side effects are triggered. This is a hard precondition, not a soft warning.",
    },
  ],
  boundaryTestId: "DS-3",
} as const;

// =========================================================================
// Section 7: Aggregated Constants
// =========================================================================

/** All three domain semantic definitions. */
export const DOMAIN_SEMANTICS: readonly DomainSemantics[] = [
  DATA_SEMANTICS,
  LOGIC_SEMANTICS,
  ACTION_SEMANTICS,
] as const;

// =========================================================================
// Section 7.5: Digital Twin Operational Semantics
// =========================================================================

/**
 * The SENSE→DECIDE→ACT→LEARN feedback loop — the operational model of the Ontology as Digital Twin.
 * LEARN is not a 4th domain. It is the feedback path from ACT back to SENSE.
 *
 * Source: .claude/research/palantir/philosophy/digital-twin.md
 *        .claude/research/palantir/philosophy/ontology-ultimate-vision.md §6
 */
export interface DigitalTwinLoopStage {
  readonly stage: DigitalTwinStage | "learn";
  readonly domain: SemanticDomainId | "cross-domain";
  readonly role: string;
  readonly examples: string;
  /** What this stage produces that feeds the next stage. */
  readonly output: string;
}

export const DIGITAL_TWIN_LOOP: readonly DigitalTwinLoopStage[] = [
  {
    stage: "sense",
    domain: "data",
    role: "Multi-modal data integration captures the current state of reality",
    examples: "Entity definitions, property values, ingested records, sensor readings, IoT feeds, ERP data, API responses",
    output: "Structured entity state — the 'ground truth' snapshot that LOGIC reasons about",
  },
  {
    stage: "decide",
    domain: "logic",
    role: "AI/ML modeling, expert reasoning, and impact propagation compute over current DATA state to inform decisions",
    examples: "Functions, derived properties, link traversal, impact propagation, forecast models, anomaly detection, classification",
    output: "Decision recommendations (Edits[]) — descriptions of what SHOULD change, without committing",
  },
  {
    stage: "act",
    domain: "action",
    role: "Approved decisions execute across enterprise substrates, changing reality",
    examples: "Mutations, webhooks, automations, scheduled actions, external system sync, notification dispatch",
    output: "State changes committed + action logs — reality is altered, outcomes are recorded",
  },
  {
    stage: "learn",
    domain: "cross-domain",
    role: "Decision outcomes captured as new DATA, feeding the next SENSE cycle. Heuristics refined, models recalibrated",
    examples: "Action logs → new DATA entities, updated metrics, corrected predictions, DH refinement from tracked outcomes",
    output: "New SENSE input — the loop closes, and the next cycle begins with enriched ground truth",
  },
] as const;

/** All 20 concept types across all three domains. */
export const ALL_CONCEPT_TYPES: readonly ConceptType[] = [
  // DATA (12)
  "ObjectType", "Property", "ValueType", "StructType", "SharedPropertyType",
  "GeoPointProperty", "GeoShapeProperty", "GeoTemporalProperty",
  "TimeSeriesProperty", "AttachmentProperty", "VectorProperty", "CipherProperty",
  // LOGIC (5)
  "LinkType", "Interface", "Query", "DerivedProperty", "Function",
  // ACTION (3)
  "Mutation", "Webhook", "Automation",
] as const;

/** Lookup: which domain owns a given concept type. */
export const CONCEPT_OWNER: Readonly<Record<ConceptType, SemanticDomainId>> = {
  ObjectType: "data", Property: "data", ValueType: "data", StructType: "data",
  SharedPropertyType: "data", GeoPointProperty: "data", GeoShapeProperty: "data",
  GeoTemporalProperty: "data", TimeSeriesProperty: "data", AttachmentProperty: "data",
  VectorProperty: "data", CipherProperty: "data",
  LinkType: "logic", Interface: "logic", Query: "logic",
  DerivedProperty: "logic", Function: "logic",
  Mutation: "action", Webhook: "action", Automation: "action",
} as const;

// =========================================================================
// Section 8: Consistency Invariants
// =========================================================================

export const CONSISTENCY_INVARIANTS: readonly ConsistencyInvariant[] = [
  {
    id: "CI-01",
    name: "Partition Completeness",
    description: "The union of all domains' owns arrays equals ALL_CONCEPT_TYPES",
    checkLogic: "new Set([...DATA.owns, ...LOGIC.owns, ...ACTION.owns]) equals new Set(ALL_CONCEPT_TYPES)",
    violationMessage: "Some concept types are not owned by any domain — the partition is incomplete",
  },
  {
    id: "CI-02",
    name: "No Owns Overlap",
    description: "The intersection of any two domains' owns arrays is empty",
    checkLogic: "For every pair (A, B) of domains: A.owns ∩ B.owns = ∅",
    violationMessage: "A concept type is owned by multiple domains — ownership must be exclusive",
  },
  {
    id: "CI-03",
    name: "Acyclic Reads",
    description: "DATA reads nothing; LOGIC reads only from DATA.owns; ACTION reads only from DATA.owns ∪ LOGIC.owns",
    checkLogic: "DATA.reads = []; LOGIC.reads ⊆ DATA.owns; ACTION.reads ⊆ (DATA.owns ∪ LOGIC.owns)",
    violationMessage: "A domain reads from a concept not owned by an upstream domain — violates dependency order",
  },
  {
    id: "CI-04",
    name: "mustNotContain Equals Complement",
    description: "Each domain's mustNotContain is exactly ALL_CONCEPT_TYPES minus its own owns",
    checkLogic: "domain.mustNotContain = ALL_CONCEPT_TYPES \\ domain.owns (set difference)",
    violationMessage: "mustNotContain is not the exact complement of owns — gap or extra entry detected",
  },
  {
    id: "CI-05",
    name: "Semantic Question Uniqueness",
    description: "No concept can satisfy two domains' semanticQuestions simultaneously",
    checkLogic: "For each classification rule: the concept's semanticTest yields exactly one domain",
    violationMessage: "A concept is classifiable under multiple domains — semantic questions are not mutually exclusive for this concept",
  },
  {
    id: "CI-06",
    name: "Reads Only What Others Own",
    description: "Every item in a domain's reads array exists in some other domain's owns array",
    checkLogic: "For each domain D: every item in D.reads exists in (ALL_CONCEPT_TYPES \\ D.owns)",
    violationMessage: "A domain reads a concept type that no other domain owns — phantom dependency",
  },
  {
    id: "CI-07",
    name: "Hard Constraint Domain Alignment",
    description: "Each hard constraint's domain field matches its containing DomainSemantics (for domain HCs) or is 'security' (for SECURITY_HARD_CONSTRAINTS in security/schema.ts)",
    checkLogic: "For each domain D: every HC in D.hardConstraints has HC.domain === D.domain. For SECURITY_HARD_CONSTRAINTS: every HC has HC.domain === 'security'",
    violationMessage: "A hard constraint is filed under the wrong domain — domain field does not match container",
  },
  {
    id: "CI-08",
    name: "Classification Rule Consistency",
    description: "No concept is classified into two different domains across all classification rules",
    checkLogic: "Collect all CR.concept values: if the same concept appears in multiple CRs, all must have the same CR.domain",
    violationMessage: "A concept is classified differently in different rules — contradictory classification",
  },
  {
    id: "CI-09",
    name: "Digital Twin Stage Bijection",
    description: "Each domain maps to exactly one Digital Twin stage (sense/decide/act), and each stage maps to exactly one domain",
    checkLogic: "DOMAIN_SEMANTICS.map(d => d.digitalTwinStage) produces 3 unique values covering all of ['sense','decide','act']",
    violationMessage: "Digital Twin stage mapping is not a bijection — a stage is missing or duplicated across domains",
  },
] as const;

// =========================================================================
// Section 9: Philosophy Meta-Layer Constants
// =========================================================================
//
// These constants codify the cognitive frameworks from research/palantir/philosophy/
// that govern HOW the ontology system operates and evolves. They are the "meta-WHY"
// above the domain-level semantics in Sections 4-6.
//
// Authority: philosophy/README.md, tribal-knowledge.md, llm-grounding.md,
//            digital-twin.md, ontology-ultimate-vision.md

/**
 * Decision Lineage — the 5 dimensions automatically captured for every decision.
 * This is the LEARN mechanism of the Digital Twin made concrete.
 * Source: philosophy/README.md §Decision Lineage, ontology-ultimate-vision.md §1
 */
export interface DecisionLineageDimension {
  readonly dimension: string;
  readonly captures: string;
  readonly example: string;
}

export const DECISION_LINEAGE: readonly DecisionLineageDimension[] = [
  {
    dimension: "WHEN",
    captures: "Timestamp of the decision",
    example: "2026-03-14T09:22:00Z — the moment the rebalancing was approved",
  },
  {
    dimension: "ATOP_WHICH_DATA",
    captures: "Version of enterprise data the decision was based on",
    example: "Portfolio snapshot v2026.03.14.001 — positions as of market close yesterday",
  },
  {
    dimension: "THROUGH_WHICH_APP",
    captures: "Application or workflow that facilitated the decision",
    example: "AIP Automate → Risk Dashboard → rebalancing action panel",
  },
  {
    dimension: "BY_WHOM",
    captures: "Human user or AI agent that made or approved the decision",
    example: "AI agent proposed, Jane Smith (Risk Manager, Level 3 autonomy) approved",
  },
  {
    dimension: "WITH_WHAT_REASONING",
    captures: "Logic functions, heuristics, and models that informed the decision",
    example: "DH-LOGIC-05 (sector concentration > 40%), VaR function output, K-LLM consensus (3/3 models agreed)",
  },
] as const;

/**
 * Three official Palantir hallucination reduction patterns.
 * Each pattern maps to a semantic domain and provides a specific grounding mechanism.
 * Source: philosophy/llm-grounding.md §Three Official Patterns, Palantir Blog Jul 2024
 */
export interface HallucinationReductionPattern {
  readonly id: string;
  readonly name: string;
  readonly primaryDomain: SemanticDomainId;
  readonly mechanism: string;
  readonly withoutPattern: string;
  readonly withPattern: string;
  readonly systemImplication: string;
}

export const HALLUCINATION_REDUCTION_PATTERNS: readonly HallucinationReductionPattern[] = [
  {
    id: "HRP-01",
    name: "Ontology-Augmented Generation (OAG)",
    primaryDomain: "data",
    mechanism: "LLMs query the Ontology for trusted entity data instead of hallucinating answers from training data",
    withoutPattern: "LLM hallucinates plausible but wrong organization-specific facts (e.g., invents distribution center cities)",
    withPattern: "LLM invokes Query Tool → returns actual entity data from the Ontology's DATA layer",
    systemImplication: "DATA entity properties serve as the trusted LLM query source. DerivedProperty and Function must be designable as LLM-callable tools.",
  },
  {
    id: "HRP-02",
    name: "Logic Tool Handoff",
    primaryDomain: "logic",
    mechanism: "LLMs delegate computation to deterministic LOGIC Functions instead of approximating results",
    withoutPattern: "LLM approximates distance/simulation/forecasting calculations (wrong results)",
    withPattern: "LLM invokes typed Function (e.g., Haversine distance) → deterministic correct answer",
    systemImplication: "LOGIC Functions need toolExposure property marking them as available to LLM orchestration. Only computation tasks LLMs cannot do (distance, forecasting, optimization) should be exposed.",
  },
  {
    id: "HRP-03",
    name: "Human-in-the-Loop Action Review",
    primaryDomain: "action",
    mechanism: "AI-proposed actions pass through structured review gates before execution",
    withoutPattern: "AI autonomously executes actions that may be based on hallucinated reasoning",
    withPattern: "AI proposes action → human reviews in context (sees impact chain, data version, reasoning) → approves/rejects/modifies → action executes with full audit trail",
    systemImplication: "ACTION needs reviewLevel and approvalWorkflow properties — explicit human-in-the-loop gates governed by Progressive Autonomy levels.",
  },
] as const;

/**
 * Tribal Knowledge 5-Stage Progression — from implicit expertise to autonomous reasoning.
 * Source: philosophy/tribal-knowledge.md §5-Stage Progression, ontology-ultimate-vision.md §7
 */
export interface TribalKnowledgeStage {
  readonly stage: number;
  readonly name: string;
  readonly description: string;
  readonly mechanism: string;
  readonly ourSystemState: "achieved" | "partial" | "future";
}

export const TRIBAL_KNOWLEDGE_PROGRESSION: readonly TribalKnowledgeStage[] = [
  {
    stage: 1,
    name: "Tribal Knowledge",
    description: "Expert knowledge is implicit — lives in people's heads, fragile, session-dependent",
    mechanism: "Discovery: interviews, observation, incident post-mortems, code review patterns",
    ourSystemState: "achieved",
  },
  {
    stage: 2,
    name: "DecisionHeuristic",
    description: "Expert knowledge is explicit — encoded as typed DH/HC constants with reasoning",
    mechanism: "Encoding: DH-DATA-01..10, DH-LOGIC-01..14, DH-ACTION-01..15, DH-SEC-01..08, HC-*-01..N",
    ourSystemState: "achieved",
  },
  {
    stage: 3,
    name: "LLM-Accessible Tools",
    description: "Encoded knowledge grounds LLM sessions via OAG, Logic Tools, Action Review patterns",
    mechanism: "Operationalization: semantics.ts + domain schemas read by every LLM session → K-LLM consensus",
    ourSystemState: "achieved",
  },
  {
    stage: 4,
    name: "Institutional Memory",
    description: "Decision outcomes are captured via Decision Lineage, enriching future decisions",
    mechanism: "Decision Lineage: WHEN/ATOP/THROUGH/BY/WITH recorded per decision → feedback loop",
    ourSystemState: "partial",
  },
  {
    stage: 5,
    name: "Autonomous Reasoning",
    description: "System self-improves DHs from tracked outcomes, operates with progressive autonomy",
    mechanism: "Continuous Learning: outcome tracking → DH refinement → staged autonomy promotion (REF-01..05 BackPropagation chain)",
    ourSystemState: "partial",
  },
] as const;

/**
 * Semantic Compilation Pipeline — 4 stages reducing ambiguity from business language to execution.
 * Source: philosophy/README.md §4-Stage Semantic Compilation Pipeline
 */
export interface CompilationStage {
  readonly stage: number;
  readonly name: string;
  readonly input: string;
  readonly output: string;
  readonly ourMapping: string;
}

export const SEMANTIC_COMPILATION_PIPELINE: readonly CompilationStage[] = [
  {
    stage: 1,
    name: "Business Language",
    input: "Natural, ambiguous domain expert descriptions",
    output: "Requirements and domain concepts expressed in prose",
    ourMapping: "research/palantir/entry/ (requirements capture, decomposition)",
  },
  {
    stage: 2,
    name: "Domain Modeling",
    input: "Prose requirements from Stage 1",
    output: "Typed ontology definitions: objects, properties, links, actions",
    ourMapping: "ontology/*.ts files (the business language made formal)",
  },
  {
    stage: 3,
    name: "Schema Compilation",
    input: "Ontology definitions from Stage 2",
    output: "Platform-specific indexed, queryable, executable schemas",
    ourMapping: "schemas/ontology/ (semantic SSoT) → skill-time compilation → convex/schema.ts + src/ (adapter output)",
  },
  {
    stage: 4,
    name: "Logic Binding + Action Execution",
    input: "Compiled schemas from Stage 3",
    output: "Functions bound to the model, actions executing against reality",
    ourMapping: "convex/model/ (logic), convex/mutations.ts (actions), src/ (frontend execution)",
  },
] as const;

/**
 * K-LLM: Multi-Model Consensus via Ontology.
 * [Official — CTO Shyam Sankar, AIP product update] "K-LLM" IS an official Palantir
 * concept. CTO Shyam Sankar presented "K-LLMs, not LLMs" publicly; Palantir LinkedIn
 * posted "Never use 1 LLM when you can use K-LLMs." The developer quote elaborates the
 * mechanism. Our CC application (sessions reading semantics.ts) is [Inference].
 * Source: philosophy/llm-grounding.md §K-LLM
 */
export const K_LLM = {
  /** The core mechanism: multiple independent LLMs reason against the same Ontology ground truth. */
  mechanism:
    "Multiple LLMs (from different providers) reasoning against the same Ontology. "
    + "When independent models arrive at the same conclusion backed by Ontology data, "
    + "the probability of hallucination is very low — consensus through grounded agreement.",
  /** Our system implements K-LLM by construction. */
  ourImplementation:
    "Every provider or interface family that reads the same semantics.ts typed constants "
    + "operates against the same ontology ground truth, producing output verified by the same test suite. "
    + "Claude Code, Codex, or any future agent session should converge on the same decisions because they read "
    + "the same DecisionHeuristic/HardConstraint grounding constants instead of vendor-specific prompt lore.",
  /** The key principle. */
  principle: "Consensus-driven confidence, not single-model confidence",
} as const;

export interface LlmIndependenceInvariant {
  readonly id: string;
  readonly name: string;
  readonly requirement: string;
  readonly rationale: string;
  readonly implementationImplication: string;
}

/**
 * LLM Independence — provider-neutral runtime contract.
 * K-LLM only works in practice when the system does not leak vendor-specific
 * assumptions into ontology semantics or feedback loops.
 */
export const LLM_INDEPENDENCE: readonly LlmIndependenceInvariant[] = [
  {
    id: "LLMI-01",
    name: "Ontology Before Vendor",
    requirement:
      "Business semantics, decision heuristics, and hard constraints must be expressed without naming a preferred model vendor or interface family.",
    rationale:
      "If domain meaning depends on 'what Claude does' or 'what Codex prefers', the ontology is no longer the semantic source of truth — the vendor prompt style is.",
    implementationImplication:
      "Semantics live in ontology/research/schema constants. Runtime adapters may normalize provider names, but they must not redefine ontology concepts.",
  },
  {
    id: "LLMI-02",
    name: "Provider-Neutral Identity",
    requirement:
      "Runtime traces must distinguish actor type, interface family, model identity, and provider as separate fields instead of collapsing them into one opaque string.",
    rationale:
      "A system cannot audit Claude/Codex coexistence if 'agent:worker:gpt-5.3-codex' and 'agent:worker:claude-opus' are only stored as free-form labels.",
    implementationImplication:
      "Store normalized runtime fields such as actorType, interfaceFamily, normalizedModel, and modelProvider. Graphs and audits should reason over those fields.",
  },
  {
    id: "LLMI-03",
    name: "Evaluation Independence",
    requirement:
      "Rubrics, outcomes, and autonomy promotion logic must score decision quality, not vendor loyalty.",
    rationale:
      "If the LEARN loop rewards a specific provider instead of measured correctness, the system will drift toward vendor lock-in rather than operational truth.",
    implementationImplication:
      "Evaluation suites and autonomy policies may observe provider mix, but pass/fail and graduation criteria must be expressed in provider-neutral terms.",
  },
] as const;

/**
 * Ontology-Oriented Software Development (OOSD) — 4 principles.
 * Source: philosophy/README.md §OOSD, Palantir Blog "Ontology-Oriented Software Development"
 */
export interface OosdPrinciple {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly ourMapping: string;
}

export const OOSD_PRINCIPLES: readonly OosdPrinciple[] = [
  {
    id: "OOSD-01",
    name: "Code in Business Language",
    description: "Business concepts (Airplanes, Flight Schedules, Airports) become first-class API objects — not rows, columns, or joins",
    ourMapping: "ontology/*.ts files ARE the business language — entities named in domain terms, not technical primitives",
  },
  {
    id: "OOSD-02",
    name: "Abstraction of Implementation",
    description: "Internal storage, indexing, and query optimization are hidden behind the Ontology's semantic layer",
    ourMapping: "schemas/ defines the compilation rules; convex/ is the implementation detail hidden from ontology consumers",
  },
  {
    id: "OOSD-03",
    name: "Marginal Cost → Zero",
    description: "OSDK drives the marginal cost of bespoke enterprise software toward zero by generating typed clients from ontology definitions",
    ourMapping: "Schema-driven code generation: ontology definitions → convex schema → typed queries/mutations → frontend hooks",
  },
  {
    id: "OOSD-04",
    name: "Defragmented Enterprise",
    description: "Isolated systems (ERP, CRM, sensors, BI tools) integrate into a holistic semantic model",
    ourMapping: "Single ontology unifies all data sources — no separate schemas for different subsystems",
  },
] as const;

/**
 * Progressive Autonomy — 5 levels of AI-driven automation.
 * [Inference from AIPCon deployment demos + developer statements. The PA-01..PA-05
 * numbering is 100% local inference. Official Palantir mechanism is binary: staged
 * review (human-reviewed proposals) vs auto-apply. The phrase "progressive autonomy"
 * does not appear in official Palantir documentation. Closest official concept is
 * the Agent Tier Framework (Tier 1-4), which describes builder complexity, not
 * runtime autonomy levels.]
 * Source: philosophy/digital-twin.md §Progressive Autonomy, ontology-ultimate-vision.md §6
 */
export interface ProgressiveAutonomyLevel {
  readonly level: number;
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly example: string;
  readonly primaryDomain: SemanticDomainId;
}

export const PROGRESSIVE_AUTONOMY_LEVELS: readonly ProgressiveAutonomyLevel[] = [
  {
    level: 1,
    id: "PA-01",
    name: "Monitor",
    description: "Twin observes and reports — no action taken, human makes all decisions",
    example: "Dashboard shows anomalies in supply chain; operator decides what to do",
    primaryDomain: "data",
  },
  {
    level: 2,
    id: "PA-02",
    name: "Recommend",
    description: "Twin suggests actions to humans — AI proposes, human decides",
    example: "\"Consider rebalancing sector X\" — analyst reviews recommendation and acts manually",
    primaryDomain: "logic",
  },
  {
    level: 3,
    id: "PA-03",
    name: "Approve-then-act",
    description: "Twin prepares actions, human approves before execution",
    example: "AIP Automate staged review: AI drafts purchase order, procurement lead approves",
    primaryDomain: "action",
  },
  {
    level: 4,
    id: "PA-04",
    name: "Act-then-inform",
    description: "Twin executes autonomously, human is notified after the fact",
    example: "Automated maintenance scheduling: system reschedules shift, manager gets notification",
    primaryDomain: "action",
  },
  {
    level: 5,
    id: "PA-05",
    name: "Full autonomy",
    description: "Twin operates independently within defined risk boundaries",
    example: "Algorithmic trading within risk limits — no human in the loop for routine trades",
    primaryDomain: "action",
  },
] as const;

// =========================================================================
// Section 10: Operational Context Modeling
// =========================================================================
//
// The Ontology is the context store of operations. This is MORE than just data.
// DATA represents the current state of the world. LOGIC is HOW to think about
// that state. ACTION is the levers to affect the real world. All three must be
// modeled in the context of your operations — not how some BI tool needs it.
//
// "The semantics HAVE to be more than just data, and they have to be modeled
//  how the real world is actually working, not how some BI tool needs it."
// — Palantir developer practitioner
//
// This section defines the MODELING principles that make the ontology faithful
// to real-world operations across commercial and defense contexts.
//
// Source: Developer practitioner statement (verbatim)
//         philosophy/digital-twin.md, philosophy/ontology-ultimate-vision.md §1-6
//         AIPCon 8-9 demos (GE Aerospace, ShipOS, World View, Centrus)

/**
 * Operational context modeling example — demonstrates how a real-world domain
 * decomposes into DATA + LOGIC + ACTION in the context of actual operations,
 * not in the context of BI or reporting tools.
 *
 * "You need the data, logic, and actions modeled in the context of your operations."
 */
export interface OperationalContextExample {
  readonly id: string;
  readonly sector: string;
  readonly domain: string;
  /** What operations this domain runs. */
  readonly operationalContext: string;
  /** DATA: the ground truth of current state. */
  readonly data: string;
  /** LOGIC: how experts reason about that state — including tribal knowledge. */
  readonly logic: string;
  /** ACTION: the levers that affect the real world. */
  readonly action: string;
  /** LEARN: how outcomes feed back to improve the next cycle. */
  readonly learn: string;
  /** Source: AIPCon demo, partner case study, or industry deployment. */
  readonly source: string;
}

export const OPERATIONAL_CONTEXT_EXAMPLES: readonly OperationalContextExample[] = [
  {
    id: "OCE-01",
    sector: "manufacturing",
    domain: "Aerospace engine production",
    operationalContext:
      "Full production lifecycle: parts procurement → assembly → quality inspection → testing → delivery. "
      + "200-hour BOM approval cycles compressed to 15 seconds. 26% more engines output year-over-year.",
    data:
      "Bill of Materials (every part, every spec), supplier lead times, assembly line sensor telemetry "
      + "(torque, temperature, vibration), quality inspection results, production schedule, workforce allocation",
    logic:
      "BOM approval rules (previously 200 hours of manual cross-checking), predictive maintenance from sensor "
      + "anomaly patterns, bottleneck identification across production lines, supplier risk scoring from lead time "
      + "history — the tribal knowledge of 20-year veteran engineers encoded as computable functions",
    action:
      "Create work orders, adjust production schedules, trigger supplier re-sourcing, approve BOMs, "
      + "escalate quality holds, dispatch maintenance technicians",
    learn:
      "Production outcomes (actual yield vs predicted) → refine scheduling models. "
      + "2024 foundation → 2025 rigorous application → 26% output increase demonstrates compound learning.",
    source: "GE Aerospace — AIPCon 8-9",
  },
  {
    id: "OCE-02",
    sector: "military",
    domain: "Naval shipbuilding supply chain",
    operationalContext:
      "Entire supply chain from shipbuilders to shipyards to thousands of suppliers. "
      + "A single engineering change notice cascades across dozens of suppliers, hundreds of work orders, "
      + "and a production timeline measured in years.",
    data:
      "Ship specifications, supplier contracts, material inventories, production timelines, engineering "
      + "change notices, work order status, facility capacity, workforce certifications",
    logic:
      "Cascade analysis: one change notice → trace impact through ontology graph → find all affected "
      + "suppliers, parts, timelines. COA generation: produce 3 options with quantified trade-offs "
      + "(days of delay, dollars of cost, risk score). Email triage: AI classifies incoming supplier "
      + "communications and routes to correct decision-maker.",
    action:
      "Act now (minimal schedule/cost impact), Defer (defined cost growth, defined schedule risk), "
      + "or Reject and escalate (full impact assessment required). Each COA applies different edit sets. "
      + "'What used to land on somebody's desk as a problem now arrives as a decision with context, "
      + "options, and trade-offs already mapped.'",
    learn:
      "Actual schedule vs predicted → calibrate prediction models. "
      + "Risk identified earlier → intervention sooner → schedule recovery reduced, cost growth contained.",
    source: "US Navy ShipOS — AIPCon 9",
  },
  {
    id: "OCE-03",
    sector: "energy",
    domain: "Nuclear power operations",
    operationalContext:
      "Highly regulated operations where every action must be auditable. "
      + "'For us in the nuclear field, you have to audit everything. The NRC isn't very comfortable "
      + "with agentic autonomous control.'",
    data:
      "Reactor telemetry, component health metrics, regulatory compliance documents, inspection records, "
      + "maintenance history, personnel certifications, NRC regulatory requirements",
    logic:
      "Component health assessment: long-running agents that evaluate every component in every product "
      + "on every line. Regulatory rule tracing: each operational rule traced back to source NRC document. "
      + "Remediation suggestion: agents propose automated fixes based on component health patterns.",
    action:
      "Maintenance work orders, component replacements, regulatory reporting submissions, "
      + "compliance attestations — all with full decision lineage for NRC audit trail",
    learn:
      "'Every action taken here compounds. The system learns and improves, enables faster, "
      + "more accurate decisions tomorrow.' Outcome tracking feeds back into component health models, "
      + "improving predictive accuracy for the next maintenance cycle.",
    source: "Centrus Energy — AIPCon 9",
  },
  {
    id: "OCE-04",
    sector: "aerospace",
    domain: "Stratospheric flight operations",
    operationalContext:
      "Mission planning, real-time flight management, and post-mission intelligence. "
      + "AI Flight Director compressed mission planning from 2 weeks to minutes.",
    data:
      "Flight telemetry, weather data, payload specifications, airspace restrictions, "
      + "historical mission logs, sensor imagery, communications intercepts",
    logic:
      "Mission constraint propagation: update one constraint, see downstream effects instantaneously. "
      + "Flight path optimization: balance payload requirements, weather windows, and airspace restrictions. "
      + "Post-flight intelligence: synthesize sensor data into actionable intelligence reports.",
    action:
      "Launch authorization, real-time flight path adjustments, payload deployment, "
      + "emergency recovery procedures, intelligence dissemination",
    learn:
      "'Every mission, the ontology becomes a living memory of the operation.' "
      + "Past events, decisions, and outcomes enrich every future flight plan. "
      + "'The stratosphere ceases being a platform that collects data and starts becoming "
      + "a platform that participates in decisions.'",
    source: "World View — AIPCon 9",
  },
  {
    id: "OCE-05",
    sector: "finance",
    domain: "Mortgage operations at scale",
    operationalContext:
      "500K calls/month, regulatory documents, compliance rules — all flowing into the ontology. "
      + "Each customer interaction is a 'huge event operating uniformly inside the Ontology.'",
    data:
      "Call transcripts, loan documents, regulatory rule database, customer records, "
      + "property valuations, credit reports, title searches",
    logic:
      "Regulatory rule interpretation: each rule traced back to source regulatory document. "
      + "Call classification: AI categorizes call intent and routes to appropriate workflow. "
      + "Document completeness: verify all required documents are present for loan stage.",
    action:
      "Advance loan to next stage, request missing documents, schedule appraisal, "
      + "flag compliance exception, generate disclosure letters",
    learn:
      "IT projects that took months or years compressed to minutes, hours, and days. "
      + "Agent performance feedback from operators improves classification accuracy over time.",
    source: "Freedom Mortgage (Moder) — AIPCon 9",
  },
] as const;

// =========================================================================
// Section 11: LEARN Feedback Mechanisms
// =========================================================================
//
// The LEARN stage (DIGITAL_TWIN_LOOP[3]) is not a separate domain — it is the
// feedback path from ACT back to SENSE. These three mechanisms define HOW that
// feedback path operates, closing the loop from "snapshot" to "living system."
//
// Without these mechanisms, the digital twin is a dashboard.
// With them, it is an operating system that improves with every decision cycle.
//
// Source: philosophy/digital-twin.md §Three LEARN Mechanisms
//         AIPCon 8-9 demos (GE Aerospace, Centrus, Naval ShipOS)

/**
 * A discrete mechanism by which the LEARN stage feeds outcomes back into the twin.
 */
export interface LearnMechanism {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly palantirMechanism: string;
  /** Which domain layer receives the feedback from this mechanism. */
  readonly feedbackTarget: string;
  /** Real-world example from AIPCon deployments. */
  readonly realWorldExample: string;
  /** CC adapter implementation status. Source: architecture/adapter-gap-analysis.md */
  readonly implementationStatus: "implemented" | "partial" | "declaration_only" | "not_applicable";
  /** How the CC adapter implements this mechanism. Empty string if not_applicable. */
  readonly ccImplementation: string;
}

export const LEARN_MECHANISMS: readonly LearnMechanism[] = [
  {
    id: "LEARN-01",
    name: "Write-Back to Operational Systems",
    description:
      "ACTION outcomes are written back as new DATA entities, closing the SENSE→ACT loop. "
      + "The twin is not a mirror — it is a control panel. Changes made through the ontology "
      + "push back into downstream systems, update ERP states, and trigger work orders.",
    palantirMechanism:
      "Digital twin pushes state changes back into downstream operational systems "
      + "(ERPs, SCADA, supply chain planners) via webhooks and sync pipelines",
    feedbackTarget: "DATA layer — action outcomes become new entity state for the next SENSE cycle",
    realWorldExample:
      "Naval ShipOS: schedule predictions (DECIDE) → change execution (ACT) → "
      + "actual vs predicted timeline written back as new DATA → calibrated prediction models",
    implementationStatus: "implemented",
    ccImplementation: "Convex mutations → DB records + outcomeRecords table (REF-01). Every mutation result is persisted as new document state. DH-informed decisions recorded via recordPrediction, outcomes measured by analyzeOutcomes cron via recordActualOutcome.",
  },
  {
    id: "LEARN-02",
    name: "Evaluation Feedback Loop",
    description:
      "End-users flag AI outputs (correct/incorrect, helpful/unhelpful). Feedback is captured "
      + "as DATA in the ontology — not lost in chat history — then leveraged in the AI development "
      + "cycle to measure and improve quality through structured evaluation pipelines.",
    palantirMechanism:
      "AIP Evals: structured evaluation pipeline where user feedback is captured in the ontology, "
      + "dynamically integrated into eval suites, and used to improve model/prompt quality over time",
    feedbackTarget: "LOGIC layer — feedback refines Functions, models, and DecisionHeuristics",
    realWorldExample:
      "GE Aerospace: foundation laid in 2024, rigorous application of operational processes "
      + "in 2025 resulted in 26% more engines output — each production cycle's outcomes improved "
      + "the next cycle's planning models through continuous evaluation feedback",
    implementationStatus: "implemented",
    ccImplementation: "feedbackEvents table + dashboardActions.submitFeedback mutation + Lineage tab feedback buttons + /hooks/feedback HTTP route. Feedback feeds REF-01 outcome measurement (relatedFeedback → delta) in analyzeOutcomes cron.",
  },
  {
    id: "LEARN-03",
    name: "Decision Outcome Tracking",
    description:
      "Every decision's outcome is measured against its prediction, captured via Decision Lineage "
      + "(WHEN/ATOP/THROUGH/BY/WITH). Outcomes that contradict existing DecisionHeuristics trigger "
      + "refinement — DHs evolve from static tribal knowledge into continuously-improved institutional memory.",
    palantirMechanism:
      "Decision Lineage + AIP Automate outcome capture: selected COA rationale recorded, "
      + "outcome measured post-execution, heuristic accuracy tracked over time",
    feedbackTarget: "Cross-domain — outcomes update DATA, refine LOGIC heuristics, adjust ACTION autonomy levels",
    realWorldExample:
      "Centrus Energy (nuclear): 'Every action taken here compounds. The system learns "
      + "and improves, enables faster, more accurate decisions tomorrow.' Decision lineage is "
      + "critical for NRC audit compliance in the nuclear field.",
    implementationStatus: "implemented",
    ccImplementation: "outcomeAnalysis table + analyzeOutcomes action (cron: 30min) + REF-01..05 BackPropagation chain: outcomeRecords → dhAccuracyScores → refinementSignals → dhUpdateProposals → automationGraduation. Six crons: 30min(analysis), 6h(stale+accuracy), 12h(drift), 24h(graduation).",
  },
] as const;

// =========================================================================
// Section 12: Action Governance Model
// =========================================================================
//
// Every action in the ontology is governed by 5 dimensions. This is not RBAC alone
// (which is SECURITY_OVERLAY) — it is the full governance model that ENABLES
// progressive autonomy. Without auditable, staged, reversible actions, organizations
// cannot trust AI enough to let it act. Governance makes autonomy possible.
//
// Source: philosophy/digital-twin.md §Progressive Autonomy
//         Palantir Ontology platform page, AIPCon 9

/**
 * The 5 governance dimensions for every ontology action.
 * Governance is not a brake on AI — it is the mechanism that enables higher autonomy.
 */
export interface ActionGovernanceDimension {
  readonly id: string;
  readonly dimension: string;
  readonly mechanism: string;
  readonly enforcedBy: string;
}

export const ACTION_GOVERNANCE: readonly ActionGovernanceDimension[] = [
  {
    id: "AG-01",
    dimension: "Who can invoke it",
    mechanism: "Role-Based Access Control (RBAC) — ontology roles define broad permission categories",
    enforcedBy: "SECURITY_OVERLAY.layers[0] (RBAC)",
  },
  {
    id: "AG-02",
    dimension: "Under what conditions",
    mechanism: "Submission criteria — business rules that gate execution beyond RBAC (parameter validation, context checks, real-time attribute constraints)",
    enforcedBy: "HC-ACTION-05 (all submission criteria must pass)",
  },
  {
    id: "AG-03",
    dimension: "With what review level",
    mechanism: "Progressive autonomy — 5 levels from Monitor to Full Autonomy determine whether human review is required",
    enforcedBy: "PROGRESSIVE_AUTONOMY_LEVELS (PA-01..PA-05)",
  },
  {
    id: "AG-04",
    dimension: "What it changes",
    mechanism: "Typed edits — every mutation declares exactly which entities, properties, and links it modifies",
    enforcedBy: "ACTION_SEMANTICS.owns (Mutation, Webhook, Automation)",
  },
  {
    id: "AG-05",
    dimension: "What trace it leaves",
    mechanism: "Decision lineage — every execution captured across 5 dimensions (WHEN/ATOP/THROUGH/BY/WITH)",
    enforcedBy: "DECISION_LINEAGE (5 dimensions)",
  },
] as const;

// =========================================================================
// Section 13: Digital Twin Fidelity Dimensions
// =========================================================================
//
// The digital twin is MORE than a feedback loop diagram. It is a semantic modeling
// paradigm where typed definitions maintain correspondence between twin and reality.
// Without semantic modeling, the twin drifts from reality.
//
// Source: philosophy/digital-twin.md, philosophy/ontology-ultimate-vision.md §6-7

/**
 * How the twin maintains correspondence with physical reality.
 * Each dimension shows what happens WITHOUT vs WITH semantic modeling.
 */
export interface TwinFidelityDimension {
  readonly id: string;
  readonly name: string;
  readonly semanticRole: string;
  readonly withoutSemantic: string;
  readonly withSemantic: string;
}

export const TWIN_FIDELITY_DIMENSIONS: readonly TwinFidelityDimension[] = [
  {
    id: "TF-01",
    name: "Entity Correspondence",
    semanticRole: "Every real-world object has exactly one typed ObjectType with exhaustive properties",
    withoutSemantic: "Twin models a 'machine' with ad-hoc fields — different sessions add different properties, twin diverges from reality",
    withSemantic: "ObjectType 'CNCMachine' has 6 typed properties (serial, model, axes, spindle, magazine, vibration) — all sessions produce identical entity shape",
  },
  {
    id: "TF-02",
    name: "Relationship Faithfulness",
    semanticRole: "Every real-world connection has a typed LinkType with cardinality and traversal semantics",
    withoutSemantic: "Twin links 'Patient' to 'Doctor' with no cardinality — M:1 vs M:N ambiguity causes different traversal results per session",
    withSemantic: "LinkType 'treatingDoctor' (M:1, FK on Patient) — traversal semantics are deterministic across all sessions",
  },
  {
    id: "TF-03",
    name: "Interpretation Consistency",
    semanticRole: "Every derived value is a typed DerivedProperty with explicit computation formula",
    withoutSemantic: "Twin computes 'risk score' differently per session — one uses simple average, another uses weighted sum, results diverge",
    withSemantic: "DerivedProperty 'portfolioBeta' — weighted sum of individual betas across holdings — deterministic computation across sessions",
  },
  {
    id: "TF-04",
    name: "Action Determinism",
    semanticRole: "Every state change is a typed Mutation with submission criteria and typed edits",
    withoutSemantic: "Twin 'updates inventory' with free-form logic — some sessions validate before write, others don't, twin state becomes inconsistent",
    withSemantic: "Mutation 'adjustReorderPoint' — typed parameters, submission criteria (HC-ACTION-05), typed Edits[] — deterministic execution",
  },
  {
    id: "TF-05",
    name: "Temporal Coherence",
    semanticRole: "The LEARN loop ensures every decision outcome updates the twin's state, maintaining temporal fidelity",
    withoutSemantic: "Twin reflects yesterday's reality — decisions made today are not captured, twin drifts from current state",
    withSemantic: "LEARN-01 write-back + LEARN-03 decision outcome tracking — twin continuously reflects latest reality including decision impacts",
  },
] as const;

/**
 * Twin maturity progression: how a digital twin evolves from passive to autonomous.
 * Each stage requires the previous stage's semantic infrastructure.
 */
export interface TwinMaturityStage {
  readonly stage: number;
  readonly name: string;
  readonly description: string;
  readonly semanticRequirement: string;
  readonly realWorldExample: string;
}

export const TWIN_MATURITY_STAGES: readonly TwinMaturityStage[] = [
  {
    stage: 1,
    name: "Snapshot",
    description: "Twin reflects a point-in-time state of reality — data ingested but not continuously updated",
    semanticRequirement: "DATA layer with typed ObjectTypes and Properties — entity correspondence (TF-01)",
    realWorldExample: "Static asset registry: all machines cataloged with specs, but twin is refreshed manually",
  },
  {
    stage: 2,
    name: "Mirror",
    description: "Twin continuously reflects current reality — data streams in real-time, but twin is read-only",
    semanticRequirement: "DATA + real-time ingestion pipelines — temporal coherence (TF-05) for SENSE",
    realWorldExample: "Live production dashboard: sensor data streams in, operators observe but act through separate systems",
  },
  {
    stage: 3,
    name: "Model",
    description: "Twin reasons about reality — LOGIC layer interprets data, derives insights, propagates impact",
    semanticRequirement: "DATA + LOGIC with typed LinkTypes, DerivedProperties, Functions — relationship faithfulness (TF-02) + interpretation consistency (TF-03)",
    realWorldExample: "Predictive maintenance: twin computes maintenanceUrgency from vibration, hours, inspection — recommends but doesn't act",
  },
  {
    stage: 4,
    name: "Operator",
    description: "Twin changes reality — ACTION layer commits decisions, governed by progressive autonomy",
    semanticRequirement: "DATA + LOGIC + ACTION with typed Mutations, submission criteria, autonomy levels — action determinism (TF-04)",
    realWorldExample: "AIP Automate: twin proposes work orders, human approves, twin executes and logs decision lineage",
  },
  {
    stage: 5,
    name: "Living System",
    description: "Twin learns from outcomes — LEARN loop closes, every decision cycle improves the next",
    semanticRequirement: "Full SENSE-DECIDE-ACT-LEARN loop with all 3 LEARN_MECHANISMS + DECISION_LINEAGE",
    realWorldExample: "World View: 'Every mission, the ontology becomes a living memory of the operation — past events, decisions, and outcomes enrich every future flight plan'",
  },
] as const;

// =========================================================================
// Section 16: LEARN Graduation Criteria
// =========================================================================
//
// Autonomy increases as trust is earned through measured accuracy. Each
// graduation from staged review to auto-apply requires satisfying these
// criteria. Source: digital-twin.md §Graduation Pattern,
// automation.md §Auto-Apply Graduation Criteria
//
// This closes the gap between Stage 3 (LLM-Accessible Tools) and Stage 4-5
// (Institutional Memory → Autonomous Reasoning) in TRIBAL_KNOWLEDGE_PROGRESSION.

export interface LearnGraduationCriterion {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly metric: string;
  readonly source: string;
}

export const LEARN_GRADUATION_CRITERIA: readonly LearnGraduationCriterion[] = [
  {
    id: "LGC-01",
    name: "Accuracy Rate",
    description: "What percentage of AI proposals are accepted without modification? High acceptance signals readiness for auto-apply.",
    metric: "Proportion of accepted vs rejected/modified proposals in the staged review queue over a rolling window",
    source: "research/palantir/action/automation.md §Auto-Apply Graduation Criteria",
  },
  {
    id: "LGC-02",
    name: "Risk Profile",
    description: "Does the automation touch sensitive data or high-value objects? Low-risk, high-volume automations graduate first.",
    metric: "Object sensitivity classification + marking levels + financial impact threshold of affected entities",
    source: "research/palantir/action/automation.md §Auto-Apply Graduation Criteria",
  },
  {
    id: "LGC-03",
    name: "Volume Sufficiency",
    description: "Is there enough decision history to build statistical confidence in the automation's reliability?",
    metric: "Count of completed LEARN-03 decision outcome cycles for this specific automation pattern",
    source: "research/palantir/philosophy/digital-twin.md §Graduation Pattern",
  },
  {
    id: "LGC-04",
    name: "Reversibility",
    description: "Can the edits be easily undone if the AI makes errors? Reversible actions graduate faster.",
    metric: "Whether the action supports reverts (HC-ACTION-29) + downstream impact scope (propagation graph depth)",
    source: "research/palantir/action/automation.md §Auto-Apply Graduation Criteria + mutations.md §Action Reverts",
  },
] as const;

// =========================================================================
// Section 17: Agentic Workflow Patterns
// =========================================================================
//
// AI agents within the Ontology chain DATA queries (OAG Pattern 1), LOGIC tools
// (Pattern 2), and ACTION proposals (Pattern 3) — executing multi-step workflows.
// These are NOT free-form LLM agents. They are ontology-grounded: their tools,
// context, and actions are all derived from the ontology.
//
// Source: philosophy/digital-twin.md §Agentic Workflows
//         philosophy/llm-grounding.md §Ontology-Grounded Agents
//         AIPCon 9 demos (Freedom Mortgage, World View, Centrus)

export interface AgenticWorkflowPattern {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly toolChain: string;
  readonly realWorldDeployment: string;
  readonly source: string;
}

export const AGENTIC_WORKFLOW_PATTERNS: readonly AgenticWorkflowPattern[] = [
  {
    id: "AWP-01",
    name: "Document Processing Agent",
    description:
      "Agents grounded in domain ontology process documents at scale — extracting entities, "
      + "classifying content, and tracing rules back to source regulatory documents. The ontology "
      + "provides the entity schema that constrains what the agent can extract and how it classifies.",
    toolChain: "DATA queries (OAG) → LOGIC classification functions → ACTION entity creation",
    realWorldDeployment: "Freedom Mortgage: 500K calls/month, all documents uniformly operating inside the Ontology, rules traced to source regulatory documents",
    source: "research/palantir/philosophy/digital-twin.md §Agentic Workflows, AIPCon 9",
  },
  {
    id: "AWP-02",
    name: "Real-Time Planning Agent",
    description:
      "Agents with constraint propagation — update one constraint, see downstream effects instantaneously. "
      + "The ontology's Impact Propagation Graph (LOGIC layer) defines how changes cascade, enabling "
      + "agents to evaluate trade-offs across multiple scenarios before proposing actions.",
    toolChain: "DATA entity reads → LOGIC impact propagation → ACTION scenario proposals (PA-03)",
    realWorldDeployment: "World View: AI Flight Director compressed mission planning from 2 weeks to minutes — 'the stratosphere becomes a platform that participates in decisions'",
    source: "research/palantir/philosophy/digital-twin.md §Agentic Workflows, AIPCon 9",
  },
  {
    id: "AWP-03",
    name: "Continuous Monitoring Agent",
    description:
      "Long-running agents operating as advocates for every component in every product on every line. "
      + "These agents continuously SENSE (monitor ontology state), DECIDE (evaluate against thresholds "
      + "and heuristics), and propose ACTIONs with full decision lineage for audit compliance.",
    toolChain: "DATA subscriptions → LOGIC threshold evaluation → ACTION remediation proposals",
    realWorldDeployment: "Centrus Energy (nuclear): long-running agents with full NRC audit compliance — 'every action taken here compounds, the system learns and improves'",
    source: "research/palantir/philosophy/digital-twin.md §Agentic Workflows, AIPCon 9",
  },
] as const;

/**
 * The 4-layer architecture of ontology-grounded agents.
 * Agents are NOT free-form LLMs — their capabilities are derived from and constrained by the ontology.
 *
 * Source: research/palantir/philosophy/llm-grounding.md §Ontology-Grounded Agents
 */
export interface AgentGroundingLayer {
  readonly id: string;
  readonly layer: string;
  readonly derivedFrom: string;
  readonly purpose: string;
}

export const ONTOLOGY_GROUNDED_AGENT_LAYERS: readonly AgentGroundingLayer[] = [
  {
    id: "AGL-01",
    layer: "Tools",
    derivedFrom: "Ontology (DATA queries, LOGIC functions, ACTION mutations) — auto-surfaced from ontology definitions",
    purpose: "Type-safe operations the agent can perform — not arbitrary API calls but ontology-bound actions",
  },
  {
    id: "AGL-02",
    layer: "Context",
    derivedFrom: "Object properties, relationships, history — structured business context, not raw databases",
    purpose: "The agent reasons over the governed, real-world representation of the business",
  },
  {
    id: "AGL-03",
    layer: "Guardrails",
    derivedFrom: "Submission criteria (AG-02), RBAC (AG-01), markings — ACTION_GOVERNANCE dimensions",
    purpose: "Security and business rule constraints that prevent the agent from taking unauthorized actions",
  },
  {
    id: "AGL-04",
    layer: "Lineage",
    derivedFrom: "DECISION_LINEAGE (5 dimensions) — every tool call traced via Workflow Lineage",
    purpose: "Complete audit trail of what the agent did, why, and with what data — feeds LEARN-03",
  },
] as const;

// =========================================================================
// Section 18: Edge Semantics
// =========================================================================
//
// The Ontology is moving to the edge — embedded in NVIDIA hardware for real-time
// inference at the point of operations (factories, vehicles, battlefield sensors).
// Edge semantics means a subset of the full Ontology runs independently in
// disconnected environments, reconciling with the central truth when reconnected.
//
// Source: philosophy/llm-grounding.md §Edge Semantics
//         philosophy/ontology-ultimate-vision.md §5 NVIDIA Partnership
//         platform/aipcon.md §APC9-04 — Sovereign AI OS

export interface EdgeSemanticComponent {
  readonly id: string;
  readonly component: string;
  readonly edgeBehavior: string;
  readonly centralSyncBehavior: string;
}

export const EDGE_SEMANTICS: readonly EdgeSemanticComponent[] = [
  {
    id: "EDGE-01",
    component: "DATA at Edge",
    edgeBehavior: "Sensor fusion and local data ingestion — edge maintains a subset of ObjectTypes relevant to local operations",
    centralSyncBehavior: "On reconnect: edge DATA entities merged with central Ontology via primary key reconciliation",
  },
  {
    id: "EDGE-02",
    component: "LOGIC at Edge",
    edgeBehavior: "Local inference via edge models (NVIDIA Nemotron) — LOGIC functions execute with local data, no central dependency",
    centralSyncBehavior: "On reconnect: decision outcomes and derived values synced to central for global consistency checks",
  },
  {
    id: "EDGE-03",
    component: "ACTION at Edge",
    edgeBehavior: "Immediate response — edge executes actions locally without waiting for central approval (latency-critical)",
    centralSyncBehavior: "On reconnect: action logs and decision lineage synced to central for audit trail completeness",
  },
  {
    id: "EDGE-04",
    component: "Central Sync Protocol",
    edgeBehavior: "Edge operates autonomously during disconnection — security policies enforced locally",
    centralSyncBehavior: "Reconciliation protocol resolves conflicts (last-write-wins or domain-specific merge strategies)",
  },
] as const;

// =========================================================================
// Section 19: Workflow Lineage (Platform Tracing Infrastructure)
// =========================================================================
//
// Workflow Lineage is Palantir's platform-level tracing infrastructure that
// implements DECISION_LINEAGE concretely. It traces every function invocation,
// action execution, automation run, and LM call with full input/output context.
//
// GA: November 2025. Log Search expansion: February 2026.
// Source: platform/workflow-lineage.md §WL-01..06
//         philosophy/ontology-ultimate-vision.md §4.5

export interface WorkflowLineageTrace {
  readonly id: string;
  readonly traceType: string;
  readonly captured: string;
  readonly logSearchCapability: string;
}

export const WORKFLOW_LINEAGE: readonly WorkflowLineageTrace[] = [
  {
    id: "WL-01",
    traceType: "Function Trace",
    captured: "Input parameters, output values, execution duration, error states — per function invocation",
    logSearchCapability: "Search across all function logs within a 7-day window with wildcard support",
  },
  {
    id: "WL-02",
    traceType: "Action Trace",
    captured: "Submitting user/agent, parameters, edited objects, submission criteria results, side effect outcomes",
    logSearchCapability: "Search across all action execution logs, filterable by action type and user",
  },
  {
    id: "WL-03",
    traceType: "Automation Trace",
    captured: "Trigger condition, matched objects, effect execution, timeline of condition evaluations",
    logSearchCapability: "Search across automation run history with condition-match filtering",
  },
  {
    id: "WL-04",
    traceType: "Language Model Trace",
    captured: "Prompt, context window, response, tools invoked, confidence scores, token usage",
    logSearchCapability: "Search across LM invocation logs with prompt/response content matching",
  },
  {
    id: "WL-05",
    traceType: "Cross-Ontology Trace",
    captured: "Source ontology ID, target ontology ID, cross-ontology relationships, shared entity references, inter-ontology data flow direction",
    logSearchCapability: "Search across cross-ontology graph visualization logs with source/target ontology filtering",
  },
] as const;

// =========================================================================
// Section 20: Ontology MCP (External Agent Grounding)
// =========================================================================
//
// Ontology MCP enables external agents (Claude Code, LangChain, CrewAI) to
// access the Ontology via Model Context Protocol. This creates a new grounding
// vector beyond the 3 HRP patterns — agents can read entity definitions,
// invoke query/function tools, and execute agent-guided actions through a
// standardized protocol.
//
// Beta: January 2026.
// Source: cross-cutting/tool-exposure.md §TE-06 — Ontology MCP
//         platform/announcements.md §ANN-JAN — Ontology MCP Beta

export interface OntologyMcpCapability {
  readonly id: string;
  readonly capability: string;
  readonly grounding: string;
  readonly implication: string;
}

export const ONTOLOGY_MCP: readonly OntologyMcpCapability[] = [
  {
    id: "MCP-01",
    capability: "Entity Schema Access",
    grounding: "External agents read ObjectType definitions, property schemas, and link structures via MCP protocol",
    implication: "Agents ground their entity understanding in the Ontology's typed definitions rather than hallucinating schema",
  },
  {
    id: "MCP-02",
    capability: "Query and Function Invocation",
    grounding: "External agents invoke query functions and computational logic tools through MCP with typed parameters and application-scoped access",
    implication: "Extends HRP-01/02 beyond platform-internal agents to any MCP-compatible client without dropping typed ontology context",
  },
  {
    id: "MCP-03",
    capability: "Action Guidance and Proposal",
    grounding: "External agents use Ontology Manager's Agent tool description field plus higher-level Claude skills to compose search→reason→act workflows over ontology actions",
    implication: "Extends HRP-03 (Human-in-the-Loop) to external agent workflows while preserving submission criteria, review levels, and explicit action guidance",
  },
] as const;

// =========================================================================
// Section 21: Scenarios Framework (COA Generation)
// =========================================================================
//
// The Scenarios framework enables structured decision comparison — the concrete
// mechanism for PA-03 (Approve-then-act). AI proposes multiple courses of action
// as hypothetical edit sets, humans compare trade-offs, and the approved scenario
// applies edits with full decision lineage.
//
// Source: philosophy/ontology-ultimate-vision.md §4.5 Scenarios Framework
//         platform/aipcon.md §APC9-03 — ShipOS, CDAO demos

export interface ScenarioDefinition {
  readonly id: string;
  readonly component: string;
  readonly description: string;
  readonly palantirMechanism: string;
}

export const SCENARIOS_FRAMEWORK: readonly ScenarioDefinition[] = [
  {
    id: "SCN-01",
    component: "Scenario Generation",
    description: "AI evaluates current state and generates N alternative courses of action, each as a hypothetical edit set",
    palantirMechanism: "AIP Logic + COA generation: evaluate conditions, produce multiple action alternatives with distinct trade-off profiles",
  },
  {
    id: "SCN-02",
    component: "Trade-off Quantification",
    description: "Each scenario carries quantified impact dimensions (time, cost, risk) computed by LOGIC functions",
    palantirMechanism: "ShipOS: 3-COA with days-of-delay, dollars-of-cost, risk-score per option. Impact computed by traversing the ontology graph.",
  },
  {
    id: "SCN-03",
    component: "Side-by-Side Comparison",
    description: "Human reviewer compares scenarios in a structured UI with full decision context visible",
    palantirMechanism: "AIP Automate staged review: proposals in 24-hour visibility window, agent decision log (LLM reasoning) visible alongside quantified trade-offs",
  },
  {
    id: "SCN-04",
    component: "Scenario Application",
    description: "Approved scenario's edit set is committed atomically with full DECISION_LINEAGE (5D) capture",
    palantirMechanism: "Selected COA applies edits → action logs → decision lineage records which scenario was chosen, by whom, and why alternatives were rejected",
  },
] as const;

// =========================================================================
// Section 22: DH Refinement Protocol (BackPropagation)
// =========================================================================
//
// This is the CRITICAL gap in the LEARN loop. LEARN-01/02/03 capture outcomes
// as new DATA — they are FORWARD mechanisms. The Refinement Protocol defines
// how captured outcomes flow BACK through the LOGIC layer to modify existing
// DecisionHeuristics — the BACKPROPAGATION that makes the system self-improving.
//
// Without this protocol, LEARN mechanisms record but do not refine.
// With it, "every action compounds" (Centrus Energy, AIPCon 9).
//
// Source: philosophy/tribal-knowledge.md §Decision Lineage as LEARN Mechanism
//         philosophy/digital-twin.md §Self-Healing Enterprise Vision
//         AIPCon 9 demos (GE 26% improvement, Centrus compounding)

export interface RefinementStep {
  readonly id: string;
  readonly step: string;
  readonly input: string;
  readonly output: string;
  readonly mechanism: string;
  /** Which LEARN mechanism feeds this step. */
  readonly feedsFrom: string;
}

export const DH_REFINEMENT_PROTOCOL: readonly RefinementStep[] = [
  {
    id: "REF-01",
    step: "Outcome Collection",
    input: "Action execution results from LEARN-01 (write-back) + LEARN-03 (decision lineage)",
    output: "Structured outcome records: predicted impact vs actual impact per decision",
    mechanism: "Every action with decision lineage captures both the predicted outcome (from LOGIC) and actual outcome (from post-execution DATA). The delta is the refinement signal.",
    feedsFrom: "LEARN-01 + LEARN-03",
  },
  {
    id: "REF-02",
    step: "Accuracy Measurement",
    input: "Outcome deltas accumulated over a rolling window (LGC-03 volume sufficiency)",
    output: "Per-DH accuracy score: how often did decisions following this heuristic produce correct outcomes?",
    mechanism: "Aggregate outcome deltas grouped by the DH that informed the decision (captured in DECISION_LINEAGE.WITH_WHAT_REASONING). Compute acceptance rate, prediction error, and trend direction. Correctness evaluation uses per-DH criteria from EVALUATION_TAXONOMY (EVAL-01..03).",
    feedsFrom: "LEARN-02 (user feedback) + LEARN-03 (outcome tracking)",
  },
  {
    id: "REF-03",
    step: "Drift Detection",
    input: "Per-DH accuracy scores compared against historical baseline",
    output: "Refinement signals: which DHs have degraded beyond threshold, which have improved",
    mechanism: "If a DH's accuracy drops below a configurable threshold (e.g., <70% acceptance over 30-day rolling window), flag for review. If accuracy exceeds promotion threshold (e.g., >95%), flag for autonomy graduation.",
    feedsFrom: "REF-02 output",
  },
  {
    id: "REF-04",
    step: "Heuristic Update",
    input: "Flagged DHs with degraded accuracy + user/expert feedback from LEARN-02",
    output: "Updated DH constants: revised options, adjusted conditions, refined reasoning",
    mechanism: "Human-in-the-loop review of flagged DHs. Expert evaluates outcome data, adjusts DH options/conditions/reasoning. Updated DH is versioned and tested against existing test suite before deployment.",
    feedsFrom: "REF-03 + LEARN-02",
  },
  {
    id: "REF-05",
    step: "Autonomy Graduation",
    input: "LGC-01..04 criteria evaluated per automation pattern",
    output: "PA level promotion or demotion: staged-review ↔ auto-apply transitions",
    mechanism: "If LGC-01 (accuracy) + LGC-02 (risk) + LGC-03 (volume) + LGC-04 (reversibility) all satisfy thresholds, promote PA level. If accuracy degrades, demote. Graduation is bidirectional.",
    feedsFrom: "REF-02 + REF-03",
  },
] as const;

// =========================================================================
// Section 23: Agent Composition Protocol
// =========================================================================
//
// Ontology-grounded agents (AGL-01..04) chain DATA queries, LOGIC tools,
// and ACTION proposals into multi-step workflows. This protocol defines how
// agents compose tool calls, pass context between steps, and handle failures.
//
// Source: philosophy/llm-grounding.md §Ontology-Grounded Agents
//         philosophy/digital-twin.md §Agentic Workflows
//         platform/devcon.md §DC4-03 — AIP Agents + MCP

export interface AgentCompositionStep {
  readonly id: string;
  readonly phase: string;
  readonly description: string;
  readonly ontologyBinding: string;
}

export const AGENT_COMPOSITION_PROTOCOL: readonly AgentCompositionStep[] = [
  {
    id: "ACP-01",
    phase: "Context Acquisition",
    description: "Agent reads entity state via DATA queries (OAG Pattern 1), establishing the decision context",
    ontologyBinding: "HRP-01 (OAG) + AGL-02 (Context layer): agent reasons over governed, real-world representation, not raw databases",
  },
  {
    id: "ACP-02",
    phase: "Reasoning Chain",
    description: "Agent invokes LOGIC functions (HRP-02) for computation, traverses links for impact analysis, evaluates DH conditions",
    ontologyBinding: "HRP-02 (Logic Tool Handoff) + AGL-01 (Tools layer): deterministic functions, not LLM approximation",
  },
  {
    id: "ACP-03",
    phase: "Action Proposal",
    description: "Agent proposes ACTION mutations with full decision context, subject to submission criteria and PA review level",
    ontologyBinding: "HRP-03 (Human-in-the-Loop) + AG-01..05: governance dimensions enforced at proposal time",
  },
  {
    id: "ACP-04",
    phase: "Lineage Recording",
    description: "Every tool call in the composition chain is traced via WORKFLOW_LINEAGE (WL-01..04), feeding LEARN-03",
    ontologyBinding: "AGL-04 (Lineage layer) + DECISION_LINEAGE (5D): complete audit trail of the agent's reasoning path",
  },
  {
    id: "ACP-05",
    phase: "Error Recovery",
    description: "On failure at any step, agent rolls back to last successful state and proposes alternative path or escalates to human",
    ontologyBinding: "HC-ACTION-03 (function rule exclusivity) ensures atomic rollback. PA-03 escalation for unrecoverable failures.",
  },
] as const;

/**
 * ACP Real-World Validation — GE Aerospace (AIPCon 9, March 2026)
 *
 * GE Aerospace's 2026 architecture validates ACP in production:
 * - "Rich and powerful automation architecture with ORCHESTRATION AGENTS that are
 *    continuously monitoring and synthesizing signals, ROUTING TO FUNCTIONAL EXPERT
 *    AGENTS across fulfillment, MRO, customer service, all compounding into multiple
 *    workflows across the value chain." — Jess Salzbrun, CIO Defense & Systems
 *
 * Pattern: Orchestration Agent (ACP-01 continuous monitoring) → synthesizes signals →
 *          routes to Functional Expert Agent: Fulfillment (ACP-02 reasoning) →
 *          routes to Functional Expert Agent: MRO (ACP-02 reasoning) →
 *          routes to Functional Expert Agent: Customer Service (ACP-03 proposals) →
 *          compounds outcomes (ACP-04 lineage recording)
 *
 * Result: 26% more engines output in 2025 vs 2024 (J85 engine, T-38 fleet, US Air Force)
 * Source: devcon5-aipcon9-deep-dive-2026-03-17.md §2.5 GE Aerospace
 */

// =========================================================================
// Section 24: Schema Self-Audit BackPropagation (SSAB)
// =========================================================================
//
// The ontology schema defines LEARN mechanisms and REF-01..05 BackPropagation.
// Projects implement these protocols. But the schema itself never learns from
// being used — audit results go unrecorded, false positives go untracked,
// and declaration-implementation drift goes unmeasured.
//
// SSAB closes this gap by emitting schema audit results INTO the existing
// REF pipeline with an "SA-" dhId prefix. No new crons, no new tables for
// the REF chain — just a new namespace flowing through the same pipeline.
//
// Source: philosophy/digital-twin.md §Twin Maturity Stage 5 (Living System)
//         philosophy/tribal-knowledge.md §Decision Lineage (self-referential loop)

export interface SchemaAuditStep {
  readonly id: string;
  readonly step: string;
  readonly input: string;
  readonly output: string;
  readonly feedsExisting: string;
}

export const SCHEMA_SELF_AUDIT_BACKPROP: readonly SchemaAuditStep[] = [
  {
    id: "SSAB-01",
    step: "Audit Outcome Collection",
    input: "semantic-audit SA-01..25 execution results (coverage, evidence, twinMaturityStage)",
    output: "Structured schemaAuditResults records + outcomeRecords with dhId prefix 'SA-{NN}'",
    feedsExisting: "REF-01",
  },
  {
    id: "SSAB-02",
    step: "Gap Pattern Recognition",
    input: "Repeated gap patterns from audit history (layer-count-mismatch, dead-code-chain, declaration-impl-drift)",
    output: "Categorized gap frequencies per SA section, fed as accuracy measurements on SA-prefixed IDs",
    feedsExisting: "REF-02",
  },
  {
    id: "SSAB-03",
    step: "Declaration-Implementation Drift",
    input: "VIEW_DECLARATIONS from ontology/schema.ts vs actual component imports in src/",
    output: "Drift signals for declared views without matching implementations, fed as refinement signals",
    feedsExisting: "REF-03",
  },
  {
    id: "SSAB-04",
    step: "Schema Version Learning",
    input: "Git diff analysis of schemas/ after modifications — classify change type (addHC, modifyDH, addSection)",
    output: "New outcomeRecords from version deltas: what changed, why, and whether audit predictions held",
    feedsExisting: "REF-01",
  },
] as const;

// =========================================================================
// Section 25: Evaluation Taxonomy (EVAL-01..03)
// =========================================================================
//
// The REF pipeline (REF-02: Accuracy Measurement) requires per-DH correctness
// criteria. A binary classification decision (DH-DATA-01: struct vs entity) and
// a continuous metric (DH-LOGIC-05: timeseries threshold) cannot share a single
// hardcoded threshold. Palantir's AIP Evals defines a 3-tier evaluation taxonomy
// — deterministic, heuristic, expert_judgment — adopted here.
//
// Source: philosophy/digital-twin.md §LEARN-03 (outcome tracking)
//         Palantir AIP Evals — create-suite evaluation tiers
//         platform/aipcon.md §APC9-03 — GE Aerospace, ShipOS, Centrus

export type EvaluationTierId = "deterministic" | "heuristic" | "expert_judgment";

export interface EvaluationTier {
  readonly id: string;
  readonly tier: EvaluationTierId;
  readonly name: string;
  readonly description: string;
  readonly direction: "maximize" | "minimize";
  readonly defaultThreshold: number;
  /** Human-readable correctness check description. */
  readonly isCorrect: string;
  readonly palantirEquivalent: string;
  readonly source: string;
}

export const EVALUATION_TAXONOMY: readonly EvaluationTier[] = [
  {
    id: "EVAL-01",
    tier: "deterministic",
    name: "Deterministic Binary Evaluation",
    description:
      "Binary correct/incorrect decisions where outcome is unambiguous. "
      + "Examples: struct vs entity classification (DH-DATA-01), security role assignment (DH-SEC-*), "
      + "tool success/failure (tool:*). Delta must be near zero for correctness.",
    direction: "minimize",
    defaultThreshold: 0.01,
    isCorrect: "Math.abs(delta) <= 0.01 — binary decisions have no tolerance for partial correctness",
    palantirEquivalent: "AIP Evals deterministic scorer — exact match, boolean, regex",
    source: "Palantir AIP Evals create-suite: deterministic evaluators for factual accuracy",
  },
  {
    id: "EVAL-02",
    tier: "heuristic",
    name: "Heuristic Threshold Evaluation",
    description:
      "Continuous metrics where outcomes fall on a spectrum. "
      + "Examples: reasoning quality (DH-LOGIC-*), action impact estimation (DH-ACTION-*). "
      + "Correctness means delta is within a configurable threshold, not necessarily zero.",
    direction: "minimize",
    defaultThreshold: 0.5,
    isCorrect: "Math.abs(delta) <= threshold — continuous decisions allow configurable tolerance",
    palantirEquivalent: "AIP Evals heuristic scorer — semantic similarity, BLEU, F1",
    source: "Palantir AIP Evals create-suite: heuristic evaluators for nuanced quality",
  },
  {
    id: "EVAL-03",
    tier: "expert_judgment",
    name: "Expert Judgment Evaluation",
    description:
      "Human or multi-LLM agreement scores where correctness requires consensus. "
      + "Examples: K-LLM consensus validation, domain expert review of novel patterns. "
      + "Correct when agreement/confidence exceeds a threshold.",
    direction: "maximize",
    defaultThreshold: 0.7,
    isCorrect: "(1 - delta) >= threshold — expert agreement must exceed confidence floor",
    palantirEquivalent: "AIP Evals LLM-as-judge + human evaluator — rubric-based scoring",
    source: "Palantir AIP Evals create-suite: expert judgment for subjective quality assessment",
  },
] as const;

export interface DecisionCorrectnessConfig {
  /** Glob-like pattern matching DH IDs. '*' = fallback. */
  readonly dhPattern: string;
  /** Which evaluation tier applies to decisions matching this pattern. */
  readonly evaluationTier: EvaluationTierId;
  /** Delta threshold for correctness determination. */
  readonly threshold: number;
  /** Whether lower delta is better (minimize) or higher is better (maximize). */
  readonly direction: "maximize" | "minimize";
  /** Why this tier and threshold were chosen for this pattern. */
  readonly reasoning: string;
}

export const DEFAULT_CORRECTNESS_CONFIGS: readonly DecisionCorrectnessConfig[] = [
  {
    dhPattern: "DH-DATA-*",
    evaluationTier: "deterministic",
    threshold: 0.01,
    direction: "minimize",
    reasoning: "DATA decisions are binary classifications (struct vs entity, property type, value type). No middle ground.",
  },
  {
    dhPattern: "DH-LOGIC-*",
    evaluationTier: "heuristic",
    threshold: 0.3,
    direction: "minimize",
    reasoning: "LOGIC decisions involve reasoning quality with some tolerance. Tighter than default 0.5 but allows reasonable variance.",
  },
  {
    dhPattern: "DH-ACTION-*",
    evaluationTier: "heuristic",
    threshold: 0.5,
    direction: "minimize",
    reasoning: "ACTION decisions have broader impact estimation. Preserves backward-compatible 0.5 threshold for action outcome prediction.",
  },
  {
    dhPattern: "DH-SEC-*",
    evaluationTier: "deterministic",
    threshold: 0.01,
    direction: "minimize",
    reasoning: "Security decisions are binary: correct role, correct marking, correct policy. No tolerance for partial security.",
  },
  {
    dhPattern: "SA-*",
    evaluationTier: "deterministic",
    threshold: 0.01,
    direction: "minimize",
    reasoning: "Schema audit coverage is binary: implemented or not, drift detected or not. SSAB-01 feeds this as SA-prefixed IDs.",
  },
  {
    dhPattern: "tool:*",
    evaluationTier: "deterministic",
    threshold: 0.01,
    direction: "minimize",
    reasoning: "Tool calls succeed or fail. Error-based delta from analyzeOutcomes is binary in nature.",
  },
  {
    dhPattern: "SSAB-*",
    evaluationTier: "deterministic",
    threshold: 0.01,
    direction: "minimize",
    reasoning: "Schema self-audit steps produce binary pass/fail outcomes. Version learning and drift detection are factual.",
  },
  {
    dhPattern: "*",
    evaluationTier: "heuristic",
    threshold: 0.5,
    direction: "minimize",
    reasoning: "Fallback for unknown DH patterns. Uses backward-compatible 0.5 threshold. Override via evaluationCriteria table.",
  },
] as const;

// Section 25b: AIP Evals Built-In Evaluator Types [Official]
//
// Palantir AIP Evals provides 16 built-in deterministic evaluators + 3 marketplace
// LLM-backed evaluators. Verified 2026-03-17 from palantir.com/docs/foundry/aip-evals/create-suite/.
// These are the OFFICIAL evaluator types available in Foundry — our local analogue
// (evaluationRubrics + rubricEvaluations) should map to this taxonomy.

export type BuiltInEvaluatorCategory = "boolean" | "string" | "object" | "numeric" | "temporal";

export interface BuiltInEvaluatorType {
  readonly id: string;
  readonly name: string;
  readonly category: BuiltInEvaluatorCategory;
  readonly returnType: "boolean" | "numeric";
  readonly description: string;
}

export const BUILT_IN_EVALUATOR_TYPES: readonly BuiltInEvaluatorType[] = [
  { id: "BIE-01", name: "Exact boolean match", category: "boolean", returnType: "boolean", description: "Compare expected vs actual boolean value" },
  { id: "BIE-02", name: "Exact boolean array match", category: "boolean", returnType: "boolean", description: "Compare expected vs actual boolean arrays" },
  { id: "BIE-03", name: "Exact string match", category: "string", returnType: "boolean", description: "Compare strings with configurable case sensitivity and whitespace handling" },
  { id: "BIE-04", name: "Exact string array match", category: "string", returnType: "boolean", description: "Compare string arrays with configurable order, case, whitespace" },
  { id: "BIE-05", name: "Regex match", category: "string", returnType: "boolean", description: "Test if output matches a regular expression pattern" },
  { id: "BIE-06", name: "Levenshtein distance", category: "string", returnType: "numeric", description: "Edit distance between expected and actual strings" },
  { id: "BIE-07", name: "String length", category: "string", returnType: "boolean", description: "Check if string length falls within a specified range" },
  { id: "BIE-08", name: "Keyword checker", category: "string", returnType: "boolean", description: "Verify that specified keywords are present in text" },
  { id: "BIE-09", name: "Exact object match", category: "object", returnType: "boolean", description: "Compare expected vs actual ontology object reference" },
  { id: "BIE-10", name: "Object set contains", category: "object", returnType: "boolean", description: "Check if a specific object exists in a target object set" },
  { id: "BIE-11", name: "Object set size range", category: "object", returnType: "boolean", description: "Verify object set size falls within expected range" },
  { id: "BIE-12", name: "Integer range", category: "numeric", returnType: "boolean", description: "Check if integer value falls within specified range" },
  { id: "BIE-13", name: "Exact numeric match", category: "numeric", returnType: "boolean", description: "Compare expected vs actual numeric value (int, long, float, double, short)" },
  { id: "BIE-14", name: "Exact numeric array match", category: "numeric", returnType: "boolean", description: "Compare numeric arrays with configurable order" },
  { id: "BIE-15", name: "Floating-point range", category: "numeric", returnType: "boolean", description: "Check if floating-point value falls within specified range" },
  { id: "BIE-16", name: "Temporal range", category: "temporal", returnType: "boolean", description: "Check if Date or Timestamp falls within specified range" },
] as const;

export type MarketplaceEvaluatorId = "rubric_grader" | "contains_key_details" | "rouge_score";

export interface MarketplaceEvaluator {
  readonly id: MarketplaceEvaluatorId;
  readonly name: string;
  readonly description: string;
  readonly isLLMBacked: boolean;
  readonly returnType: "numeric" | "boolean";
}

export const MARKETPLACE_EVALUATORS: readonly MarketplaceEvaluator[] = [
  { id: "rubric_grader", name: "Rubric grader", description: "LLM-backed numeric grading against a dynamic marking rubric", isLLMBacked: true, returnType: "numeric" },
  { id: "contains_key_details", name: "Contains key details", description: "LLM-backed assessment of whether text contains specified key details", isLLMBacked: true, returnType: "boolean" },
  { id: "rouge_score", name: "ROUGE score", description: "Recall-Oriented Understudy for Gisting Evaluation — machine-generated text quality metric", isLLMBacked: false, returnType: "numeric" },
] as const;

// Section 25c: Evaluation Experiment Capabilities [Official]
//
// Experiment-level capabilities are distinct from evaluator types. They describe
// how AIP Evals compares targets, parameters, and grouped run results.

export interface EvaluationExperimentCapability {
  readonly id: string;
  readonly capability: string;
  readonly description: string;
  readonly officialMechanism: string;
  readonly localImplication: string;
  readonly source: string;
}

export const EVALUATION_EXPERIMENT_CAPABILITIES: readonly EvaluationExperimentCapability[] = [
  {
    id: "EEXP-01",
    capability: "Grid Search",
    description: "Full Cartesian comparison across configurable parameters such as model, prompt, and other inputs.",
    officialMechanism: "AIP Evals experiments / grid search",
    localImplication: "EvaluationSuite and EvaluationRun should remain attachable to a higher experiment grouping layer.",
    source: "research/palantir/platform/aip-evals.md §EVAL-04",
  },
  {
    id: "EEXP-02",
    capability: "Multi-Target Comparison",
    description: "Compare multiple function targets against the same evaluator suite, up to four simultaneous runs.",
    officialMechanism: "AIP Evals compare runs / multi-target mode",
    localImplication: "targetRef alone is insufficient; grouped comparison intent should be explicit.",
    source: "research/palantir/platform/aip-evals.md §EVAL-04",
  },
  {
    id: "EEXP-03",
    capability: "Versioned Evaluation Targets",
    description: "Run evaluations against last-saved, published, or other versioned function targets.",
    officialMechanism: "AIP Evals target version selection",
    localImplication: "targetVersion should be treated as first-class experiment metadata, not only an optional run field.",
    source: "research/palantir/platform/aip-evals.md §EVAL-04",
  },
  {
    id: "EEXP-04",
    capability: "Intermediate Parameter Evaluation",
    description: "Evaluate intermediate pipeline block outputs rather than only the final function result.",
    officialMechanism: "AIP Evals intermediate parameter evaluation",
    localImplication: "Local evaluation architecture should leave room for step-level observability.",
    source: "research/palantir/platform/aip-evals.md §EVAL-04",
  },
  {
    id: "EEXP-05",
    capability: "Results Analysis",
    description: "Cluster failures, suggest prompt changes, and persist grouped experiment results as analyzable datasets.",
    officialMechanism: "AIP Evals results analyzer + results dataset",
    localImplication: "LEARN should eventually reason over grouped experiment history, not only isolated rubric evaluations.",
    source: "research/palantir/platform/aip-evals.md §EVAL-04",
  },
] as const;

// =========================================================================
// Section 26: LEARN Evaluation Surfaces (LES-01..05)
// =========================================================================
//
// AIP Evals is the clearest official product surface for LEARN rubrics.
// These surfaces describe HOW Palantir turns human feedback and machine
// judgment into structured evaluation signals that can feed refinement.
//
// Source: research/palantir/platform/aip-evals.md §EVAL-01..05
//         Palantir AIP Evals docs

export type EvaluationSurfaceKind =
  | "deterministic"
  | "heuristic"
  | "rubricGrader"
  | "customFunction"
  | "ontologyEditSimulator";

export interface LearnEvaluationSurface {
  readonly id: string;
  readonly kind: EvaluationSurfaceKind;
  readonly name: string;
  readonly description: string;
  readonly officialMechanism: string;
  readonly outputSignal: string;
  readonly implementationImplication: string;
  readonly source: string;
}

export const LEARN_EVALUATION_SURFACES: readonly LearnEvaluationSurface[] = [
  {
    id: "LES-01",
    kind: "deterministic",
    name: "Deterministic Evaluators",
    description:
      "Exact-match or binary evaluators for objective correctness. Best for factual, structural, "
      + "or policy-conformance checks where the expected answer is unambiguous.",
    officialMechanism: "AIP Evals deterministic evaluators",
    outputSignal: "Binary or near-binary score mapped to low delta (correct/incorrect)",
    implementationImplication:
      "Maps naturally to EVAL-01 and should govern DATA/SECURITY classifications, tool success/failure, "
      + "and machine-checkable contract assertions.",
    source: "Palantir AIP Evals create-suite",
  },
  {
    id: "LES-02",
    kind: "heuristic",
    name: "Heuristic Evaluators",
    description:
      "Tolerance-based evaluators for quality dimensions that fall on a spectrum, such as semantic similarity, "
      + "coverage, or prediction error.",
    officialMechanism: "AIP Evals heuristic evaluators",
    outputSignal: "Continuous score or distance mapped to configurable tolerance thresholds",
    implementationImplication:
      "Maps to EVAL-02 and should drive rolling-window accuracy for LOGIC/ACTION decisions where partial correctness is meaningful.",
    source: "Palantir AIP Evals create-suite",
  },
  {
    id: "LES-03",
    kind: "rubricGrader",
    name: "Rubric Grader / LLM-as-Judge",
    description:
      "Multi-criterion rubric scoring where correctness is assessed against explicit dimensions instead of a single scalar threshold.",
    officialMechanism: "AIP Evals rubric grader / expert-judgment workflow",
    outputSignal: "Weighted rubric score + rationale mapped to normalized delta and pass/fail",
    implementationImplication:
      "This is the minimum viable self-improvement surface for LEARN-02 beyond thumbs-up/down. "
      + "Runtime systems should persist explicit criteria, evaluator provenance, and normalized score.",
    source: "Palantir AIP Evals create-suite",
  },
  {
    id: "LES-04",
    kind: "customFunction",
    name: "Custom Evaluation Functions",
    description:
      "Domain-specific evaluators implemented as custom logic when built-in scorers are insufficient for business semantics.",
    officialMechanism: "AIP Evals custom evaluation functions",
    outputSignal: "Arbitrary typed score or structured judgment converted into rubric or delta form",
    implementationImplication:
      "Use when tribal knowledge cannot be reduced to generic similarity metrics. "
      + "Best fit for domain-specific constraints or high-value workflows.",
    source: "Palantir AIP Evals create-suite",
  },
  {
    id: "LES-05",
    kind: "ontologyEditSimulator",
    name: "Ontology Edit Simulator",
    description:
      "Evaluation surface for proposed ontology edits before application, focusing on safety, policy conformance, and semantic validity.",
    officialMechanism: "AIP Evals evaluate ontology edits / ontology edits simulator",
    outputSignal: "Edit validity and policy-conformance judgment mapped to decision delta",
    implementationImplication:
      "Best aligned with ACTION proposals in digital twins: it evaluates whether a proposed change should be trusted before execution or autonomy promotion.",
    source: "Palantir AIP Evals evaluate-ontology-edits",
  },
] as const;

// =========================================================================
// Section 27: Platform Boundary — OSS vs Platform-Native (PB-01..03)
// =========================================================================
//
// The user-facing question is not only "what exists?" but "what can we import
// as OSS vs what must we model locally?" These entries capture the verified
// boundary from official docs/community surfaces.
//
// Source: research/palantir/platform/aipcon.md §APC9-04
//         research/palantir/cross-cutting/tool-exposure.md §TE-06..08
//         official Palantir GitHub community registry

export type PlatformBoundaryAvailability = "platformNative" | "protocolSurface" | "officialPublicRepo";

export interface PlatformBoundary {
  readonly id: string;
  readonly surface: string;
  readonly availability: PlatformBoundaryAvailability;
  readonly verifiedOpenSource: boolean;
  readonly description: string;
  readonly implementationImplication: string;
  readonly source: string;
}

export const PLATFORM_OPEN_SOURCE_BOUNDARY: readonly PlatformBoundary[] = [
  {
    id: "PB-01",
    surface: "AIP Evals + Workflow Lineage + autonomy graduation internals",
    availability: "platformNative",
    verifiedOpenSource: false,
    description:
      "The core LEARN engine surfaces are documented as Foundry platform capabilities, not as a verified official open-source package exposing internals.",
    implementationImplication:
      "Treat LEARN/rubric/lineage/autonomy logic as adapter-local runtime that mirrors platform behavior, not as a dependency imported from Palantir OSS.",
    source: "research/palantir/platform/aipcon.md §APC9-04 + research/palantir/platform/aip-evals.md §EVAL-01",
  },
  {
    id: "PB-02",
    surface: "Palantir MCP + Ontology MCP",
    availability: "protocolSurface",
    verifiedOpenSource: false,
    description:
      "Palantir exposes builder and ontology-consumption capabilities through documented MCP surfaces, but this is an integration boundary rather than open-sourcing platform internals.",
    implementationImplication:
      "Model these as external integration surfaces. They inform tool exposure and builder workflows, not local reimplementation of Foundry internals.",
    source: "research/palantir/platform/devcon.md §DC5-01..04 + research/palantir/platform/aipcon.md §APC9-01",
  },
  {
    id: "PB-03",
    surface: "AIP Community Registry",
    availability: "officialPublicRepo",
    verifiedOpenSource: true,
    description:
      "An official public GitHub community registry exists, but it is a community/open artifact surface rather than the managed LEARN core.",
    implementationImplication:
      "Community registry artifacts can be consumed as examples or integrations, but should not be conflated with platform-native evaluation/lineage engines.",
    source: "https://github.com/palantir/aip-community-registry",
  },
] as const;

// =========================================================================
// Section 28: MCP Product Split (MCP-PS-01..02)
// =========================================================================
//
// Official docs now distinguish two separate MCP products. This is a critical
// architectural boundary for builder-vs-runtime modeling.

export interface McpProductSurface {
  readonly id: string;
  readonly product: "Palantir MCP" | "Ontology MCP";
  readonly targetUser: string;
  readonly primaryCapability: string;
  readonly localImplication: string;
  readonly source: string;
}

export const MCP_PRODUCT_SPLIT: readonly McpProductSurface[] = [
  {
    id: "MCP-PS-01",
    product: "Palantir MCP",
    targetUser: "Ontology builders / developers",
    primaryCapability: "Build and modify ontology/project artifacts with platform context + tools",
    localImplication: "Maps to schema authoring, codegen, builder automation, and developer-console style workflows.",
    source: "research/palantir/cross-cutting/tool-exposure.md §TE-06..08",
  },
  {
    id: "MCP-PS-02",
    product: "Ontology MCP",
    targetUser: "Ontology consumers / external agents",
    primaryCapability: "Expose query/action/function surfaces for grounded external agent use",
    localImplication: "Maps to runtime tool consumption, external agent grounding, and action/query exposure boundaries.",
    source: "research/palantir/cross-cutting/tool-exposure.md §TE-06..08",
  },
] as const;

// =========================================================================
// Section 29: Foundry Orchestration Map (ORCH-01..06)
// =========================================================================
//
// A Palantir-aligned codebase should not drift into isolated features.
// It should remain legible as a builder-to-runtime-to-learning system.
// This map is the directional backbone for "is the whole codebase moving
// toward a Palantir-style digital twin and self-improving decision system?"
//
// Source: research/palantir/orchestration-map.md

export interface FoundryOrchestrationLayer {
  readonly id: string;
  readonly name: string;
  readonly purpose: string;
  readonly officialSurface: string;
  readonly localCodebaseMapping: string;
  readonly output: string;
}

export const FOUNDRY_ORCHESTRATION_MAP: readonly FoundryOrchestrationLayer[] = [
  {
    id: "ORCH-01",
    name: "Builder Surfaces",
    purpose: "Builders and AI coding surfaces shape ontology-backed systems coherently.",
    officialSurface: "AI FDE + Agent Studio + Pro-Code CLI + Palantir MCP",
    localCodebaseMapping: ".claude/research/ + .claude/schemas/ontology/ + builder-oriented skills and prompts",
    output: "Structured ontology and implementation intent",
  },
  {
    id: "ORCH-02",
    name: "Ontology Semantic Core",
    purpose: "The ontology remains the semantic center of the system rather than the UI or raw storage layer.",
    officialSurface: "Ontology + OSDK + data/logic/action/security integration",
    localCodebaseMapping: "schemas/ontology/ + palantir-learn/ontology/",
    output: "Typed semantic model of operational reality",
  },
  {
    id: "ORCH-03",
    name: "Runtime Digital Twin",
    purpose: "The system senses, reasons, and acts through explicit runtime constructs.",
    officialSurface: "Queries + Functions + Actions + Automations + runtime object services",
    localCodebaseMapping: "palantir-learn/convex/ + hooks + runtime ingestion paths",
    output: "Operational SENSE → DECIDE → ACT loop",
  },
  {
    id: "ORCH-04",
    name: "Governance and Lineage",
    purpose: "Actions become trustworthy through approval, security, and traceability.",
    officialSurface: "Workflow Lineage + staged review + project permissions + security controls",
    localCodebaseMapping: "hookEvents + pendingDecisions + approvalWorkflow + Lineage/Audit UI",
    output: "Auditable, governable decision execution",
  },
  {
    id: "ORCH-05",
    name: "LEARN and BackPropagation",
    purpose: "Outcomes become explicit evaluation signals that refine future decisions and autonomy levels.",
    officialSurface: "AIP Evals + feedback capture + outcome tracking + autonomy graduation",
    localCodebaseMapping: "feedbackEvents + outcomeRecords + evaluationRubrics + rubricEvaluations + REF tables",
    output: "Measured self-improvement instead of passive logging",
  },
  {
    id: "ORCH-06",
    name: "Integration and Expansion",
    purpose: "The system exposes stable integration surfaces for external agents, events, and future deployment environments.",
    officialSurface: "Ontology MCP + Listeners + Branching + external agent surfaces + edge direction",
    localCodebaseMapping: "HTTP hooks + MCP readiness + ontology sync + schema audit emit + future listener-style ingestion",
    output: "Externally connectable and evolvable platform boundary",
  },
] as const;

// =========================================================================
// Section 30: Palantir MCP Tool Categories (PMC-01..13)
// =========================================================================
//
// MCP_PRODUCT_SPLIT defines the builder-vs-consumer boundary. This section
// captures the official fixed builder-side taxonomy published for Palantir MCP.
//
// Source: research/palantir/cross-cutting/tool-exposure.md §TE-09..12

export interface PalantirMcpToolCategory {
  readonly id: string;
  readonly category: string;
  readonly totalTools: number;
  readonly readTools: number;
  readonly writeTools: number;
  readonly representativeTools: readonly string[];
  readonly localImplication: string;
  readonly source: string;
}

export const PALANTIR_MCP_TOOL_CATEGORIES: readonly PalantirMcpToolCategory[] = [
  {
    id: "PMC-01",
    category: "Compass",
    totalTools: 6,
    readTools: 5,
    writeTools: 1,
    representativeTools: ["create_foundry_project", "search_foundry_projects"],
    localImplication: "Maps to builder-side project discovery, project creation, and project-scoped workspace navigation.",
    source: "research/palantir/cross-cutting/tool-exposure.md §TE-09..12",
  },
  {
    id: "PMC-02",
    category: "Dataset",
    totalTools: 8,
    readTools: 6,
    writeTools: 2,
    representativeTools: ["run_sql_query_on_foundry_dataset", "create_and_write_to_foundry_dataset"],
    localImplication: "Distinguishes dataset inspection/write flows from ontology data writes. Useful for builder data bootstrap tooling.",
    source: "research/palantir/cross-cutting/tool-exposure.md §TE-09..12",
  },
  {
    id: "PMC-03",
    category: "Data Lineage",
    totalTools: 1,
    readTools: 1,
    writeTools: 0,
    representativeTools: ["get_resource_graph"],
    localImplication: "Builder-facing lineage graph retrieval is a distinct capability from runtime workflow lineage.",
    source: "research/palantir/cross-cutting/tool-exposure.md §TE-09..12",
  },
  {
    id: "PMC-04",
    category: "Ontology",
    totalTools: 12,
    readTools: 6,
    writeTools: 6,
    representativeTools: ["create_or_update_foundry_object_type", "create_or_update_foundry_link_type", "create_or_update_foundry_action_type"],
    localImplication: "This is the highest-signal structure-edit category. It should map to schema authoring and proposal-reviewed structural change flows.",
    source: "research/palantir/cross-cutting/tool-exposure.md §TE-09..12",
  },
  {
    id: "PMC-05",
    category: "Object Set",
    totalTools: 2,
    readTools: 2,
    writeTools: 0,
    representativeTools: ["query_ontology_objects", "aggregate_ontology_objects"],
    localImplication: "Builder-side object set querying is separate from Ontology MCP's app-scoped runtime tools.",
    source: "research/palantir/cross-cutting/tool-exposure.md §TE-09..12",
  },
  {
    id: "PMC-06",
    category: "OSDK",
    totalTools: 2,
    readTools: 2,
    writeTools: 0,
    representativeTools: ["get_ontology_sdk_context", "get_ontology_sdk_examples"],
    localImplication: "Builder workflows can pull SDK context/examples explicitly rather than inferring client patterns ad hoc.",
    source: "research/palantir/cross-cutting/tool-exposure.md §TE-09..12",
  },
  {
    id: "PMC-07",
    category: "Platform SDK",
    totalTools: 2,
    readTools: 2,
    writeTools: 0,
    representativeTools: ["list_platform_sdk_apis", "get_platform_sdk_api_reference"],
    localImplication: "Separates platform API discovery from ontology-specific SDK discovery.",
    source: "research/palantir/cross-cutting/tool-exposure.md §TE-09..12",
  },
  {
    id: "PMC-08",
    category: "Code Repository",
    totalTools: 6,
    readTools: 3,
    writeTools: 3,
    representativeTools: ["create_python_transforms_code_repository", "create_code_repository_pull_request"],
    localImplication: "Builder tooling explicitly spans repo bootstrap plus PR workflows; this is not just codegen.",
    source: "research/palantir/cross-cutting/tool-exposure.md §TE-09..12",
  },
  {
    id: "PMC-09",
    category: "Foundry Branching",
    totalTools: 6,
    readTools: 2,
    writeTools: 4,
    representativeTools: ["create_foundry_branch", "create_foundry_proposal"],
    localImplication: "Makes proposal review a first-class builder primitive rather than an afterthought.",
    source: "research/palantir/cross-cutting/tool-exposure.md §TE-09..12",
  },
  {
    id: "PMC-10",
    category: "Developer Console",
    totalTools: 5,
    readTools: 2,
    writeTools: 3,
    representativeTools: ["convert_to_osdk_react", "generate_new_ontology_sdk_version"],
    localImplication: "Builder automation includes app conversion and SDK generation, not only ontology edits.",
    source: "research/palantir/cross-cutting/tool-exposure.md §TE-09..12",
  },
  {
    id: "PMC-11",
    category: "Compute Module",
    totalTools: 5,
    readTools: 2,
    writeTools: 3,
    representativeTools: ["manage_compute_modules", "execute_compute_modules_function"],
    localImplication: "Compute Modules are a distinct builder surface and should not be collapsed into generic function tooling.",
    source: "research/palantir/cross-cutting/tool-exposure.md §TE-09..12",
  },
  {
    id: "PMC-12",
    category: "Data Connection",
    totalTools: 3,
    readTools: 0,
    writeTools: 3,
    representativeTools: ["create_foundry_rest_api_data_source"],
    localImplication: "Data connection setup is a pure builder-write surface with no symmetric runtime analogue.",
    source: "research/palantir/cross-cutting/tool-exposure.md §TE-09..12",
  },
  {
    id: "PMC-13",
    category: "Documentation",
    totalTools: 7,
    readTools: 7,
    writeTools: 0,
    representativeTools: ["search_foundry_documentation"],
    localImplication: "Documentation retrieval is a dedicated builder tool family, not just generic web search.",
    source: "research/palantir/cross-cutting/tool-exposure.md §TE-09..12",
  },
] as const;

// =========================================================================
// Section 31: Workflow Lineage Graph Model (WLG-01..10)
// =========================================================================
//
// WORKFLOW_LINEAGE defines the high-level trace semantics. This section captures
// the official graph surface shape: node families, visibility defaults, color
// groupings, refactoring tools, and AIP usage observability.
//
// Source: research/palantir/platform/workflow-lineage.md §WL-04..05

export interface WorkflowLineageNodeType {
  readonly id: string;
  readonly nodeType: string;
  readonly detailsPanel: string;
  readonly source: string;
}

export interface WorkflowLineageColorLegendGroup {
  readonly id: string;
  readonly group: "general" | "permissions" | "usage" | "organization";
  readonly options: readonly string[];
}

export interface WorkflowLineageGraphModel {
  readonly officialNodeTypes: readonly WorkflowLineageNodeType[];
  readonly hiddenEdgesByDefault: readonly string[];
  readonly colorLegendGroups: readonly WorkflowLineageColorLegendGroup[];
  readonly refactoringCapabilities: readonly string[];
  readonly aipUsageMetrics: readonly string[];
  readonly navigationBoundaries: readonly string[];
}

export const WORKFLOW_LINEAGE_GRAPH_MODEL: WorkflowLineageGraphModel = {
  officialNodeTypes: [
    {
      id: "WLG-01",
      nodeType: "Object Types",
      detailsPanel: "Properties, usage provenance counts, links, backing datasource, data preview",
      source: "research/palantir/platform/workflow-lineage.md §WL-04",
    },
    {
      id: "WLG-02",
      nodeType: "Object Links",
      detailsPanel: "Resource usage by objects, functions, actions, and Workshop apps",
      source: "research/palantir/platform/workflow-lineage.md §WL-04",
    },
    {
      id: "WLG-03",
      nodeType: "Actions",
      detailsPanel: "API name, RID, inputs, edits, submission criteria, code, action log",
      source: "research/palantir/platform/workflow-lineage.md §WL-04",
    },
    {
      id: "WLG-04",
      nodeType: "Functions",
      detailsPanel: "Inputs, outputs, dependencies, repository, code view",
      source: "research/palantir/platform/workflow-lineage.md §WL-04",
    },
    {
      id: "WLG-05",
      nodeType: "AIP Logic Functions",
      detailsPanel: "Dependencies, automations, creation metadata",
      source: "research/palantir/platform/workflow-lineage.md §WL-04",
    },
    {
      id: "WLG-06",
      nodeType: "Language Models",
      detailsPanel: "Description, creator metadata, context windows",
      source: "research/palantir/platform/workflow-lineage.md §WL-04",
    },
    {
      id: "WLG-07",
      nodeType: "Workshop Applications",
      detailsPanel: "Creation metadata, dependencies, view count",
      source: "research/palantir/platform/workflow-lineage.md §WL-04",
    },
    {
      id: "WLG-08",
      nodeType: "Automations",
      detailsPanel: "Property usages, condition dependencies, trigger connections",
      source: "research/palantir/platform/workflow-lineage.md §WL-04",
    },
    {
      id: "WLG-09",
      nodeType: "Interfaces",
      detailsPanel: "Cross-ontology resources shown with gray styling and warning icon",
      source: "research/palantir/platform/workflow-lineage.md §WL-04",
    },
    {
      id: "WLG-10",
      nodeType: "Text Nodes",
      detailsPanel: "User-created Markdown annotations",
      source: "research/palantir/platform/workflow-lineage.md §WL-04",
    },
  ],
  hiddenEdgesByDefault: [
    "Object→Action",
    "Object→Object",
    "Automation triggers",
  ],
  colorLegendGroups: [
    { id: "WLG-C-01", group: "general", options: ["Node type", "Custom color"] },
    { id: "WLG-C-02", group: "permissions", options: ["Ontology permissions", "Resource permissions"] },
    {
      id: "WLG-C-03",
      group: "usage",
      options: [
        "App views",
        "Out-of-date functions",
        "Model usage",
        "Ontology status",
        "Action rule",
        "Automation expiration",
        "Last modified",
      ],
    },
    {
      id: "WLG-C-04",
      group: "organization",
      options: ["Folder", "Project", "Portfolio", "Functions repository"],
    },
  ],
  refactoringCapabilities: [
    "Property provenance",
    "Function-backed action upgrade",
    "Bulk Workshop publish",
    "Bulk delete",
    "Bulk submission criteria update",
    "Bulk ontology role grant",
    "Marketplace product inspection",
  ],
  aipUsageMetrics: [
    "Successful requests",
    "Attempted requests",
    "Rate-limited requests",
    "Model requests count",
    "Token usage",
  ],
  navigationBoundaries: [
    "Pipeline Builder source-to-ontology lineage",
    "Workflow Lineage on-top-of-ontology graph",
    "Data Lineage end-to-end graph",
  ],
} as const;

// =========================================================================
// Section 32: Local Workflow Resource Taxonomy (LWR-01..24 / LWE-01..24)
// =========================================================================
//
// The official Workflow Lineage graph model is captured above. This section
// documents the adapter-local workflow graph so runtime/schema drift becomes
// explicit and testable.

export interface LocalWorkflowResourceType {
  readonly id: string;
  readonly resourceType: string;
  readonly description: string;
  readonly sourceTable: string;
}

export interface LocalWorkflowEdgeType {
  readonly id: string;
  readonly edgeType: string;
  readonly description: string;
}

export interface LocalWorkflowResourceTaxonomy {
  readonly resources: readonly LocalWorkflowResourceType[];
  readonly edges: readonly LocalWorkflowEdgeType[];
  readonly source: string;
}

export const LOCAL_WORKFLOW_RESOURCE_TAXONOMY: LocalWorkflowResourceTaxonomy = {
  resources: [
    { id: "LWR-01", resourceType: "application", description: "Application-level lineage node.", sourceTable: "workflowResources" },
    { id: "LWR-02", resourceType: "session", description: "Session-scoped execution container.", sourceTable: "workflowResources" },
    { id: "LWR-03", resourceType: "project", description: "Project-scoped lineage grouping.", sourceTable: "workflowResources" },
    { id: "LWR-04", resourceType: "tool", description: "Tool-call lineage node.", sourceTable: "workflowResources" },
    { id: "LWR-05", resourceType: "decision", description: "Governed decision artifact.", sourceTable: "workflowResources" },
    { id: "LWR-06", resourceType: "scenario", description: "Scenario / course-of-action artifact.", sourceTable: "workflowResources" },
    { id: "LWR-07", resourceType: "agent", description: "Agent identity node.", sourceTable: "workflowResources" },
    { id: "LWR-08", resourceType: "model", description: "Normalized model identity node.", sourceTable: "workflowResources" },
    { id: "LWR-09", resourceType: "provider", description: "Provider identity node.", sourceTable: "workflowResources" },
    { id: "LWR-10", resourceType: "workflow", description: "Workflow container node.", sourceTable: "workflowResources" },
    { id: "LWR-11", resourceType: "function", description: "Function lineage node.", sourceTable: "workflowResources" },
    { id: "LWR-12", resourceType: "functionExecution", description: "Function execution instance.", sourceTable: "workflowResources" },
    { id: "LWR-13", resourceType: "actionExecution", description: "Action execution instance.", sourceTable: "workflowResources" },
    { id: "LWR-14", resourceType: "automationExecution", description: "Automation execution instance.", sourceTable: "workflowResources" },
    { id: "LWR-15", resourceType: "ontologyObject", description: "Ontology-touched resource node.", sourceTable: "workflowResources" },
    { id: "LWR-16", resourceType: "trackable", description: "Tracked domain artifact.", sourceTable: "workflowResources" },
    { id: "LWR-17", resourceType: "outcome", description: "Outcome record node in the REF chain.", sourceTable: "workflowResources" },
    { id: "LWR-18", resourceType: "refinementSignal", description: "Drift/improvement signal node.", sourceTable: "workflowResources" },
    { id: "LWR-19", resourceType: "dhProposal", description: "DH update proposal node.", sourceTable: "workflowResources" },
    { id: "LWR-20", resourceType: "rubric", description: "Rubric definition node.", sourceTable: "workflowResources" },
    { id: "LWR-21", resourceType: "evaluation", description: "Rubric evaluation result node.", sourceTable: "workflowResources" },
    { id: "LWR-22", resourceType: "evaluationSuite", description: "Evaluation suite grouping node.", sourceTable: "workflowResources" },
    { id: "LWR-23", resourceType: "autonomyPolicy", description: "Autonomy graduation policy node.", sourceTable: "workflowResources" },
    { id: "LWR-24", resourceType: "automationTracker", description: "Automation tracking node.", sourceTable: "workflowResources" },
  ],
  edges: [
    { id: "LWE-01", edgeType: "invokes", description: "A resource invokes another resource." },
    { id: "LWE-02", edgeType: "produces", description: "A resource produces another artifact." },
    { id: "LWE-03", edgeType: "awaitsApproval", description: "Execution path is blocked on approval." },
    { id: "LWE-04", edgeType: "offersScenario", description: "Decision offers a scenario option." },
    { id: "LWE-05", edgeType: "selectsScenario", description: "Decision or user selects a scenario." },
    { id: "LWE-06", edgeType: "operatedBy", description: "Resource is operated by an agent." },
    { id: "LWE-07", edgeType: "usesModel", description: "Runtime resource uses a model." },
    { id: "LWE-08", edgeType: "servedBy", description: "Model is served by a provider." },
    { id: "LWE-09", edgeType: "belongsToApplication", description: "Resource belongs to an application scope." },
    { id: "LWE-10", edgeType: "hostsWorkflow", description: "Application or project hosts a workflow." },
    { id: "LWE-11", edgeType: "executesFunction", description: "Workflow executes a function." },
    { id: "LWE-12", edgeType: "realizesWorkflow", description: "Execution artifact realizes a workflow." },
    { id: "LWE-13", edgeType: "implementsFunction", description: "Execution artifact implements a function node." },
    { id: "LWE-14", edgeType: "emitsOutcome", description: "Execution emits an outcome node." },
    { id: "LWE-15", edgeType: "scopedToProject", description: "Resource is scoped to a project." },
    { id: "LWE-16", edgeType: "touchesOntology", description: "Execution path touches ontology resources." },
    { id: "LWE-17", edgeType: "tracks", description: "Tracker resource tracks another artifact." },
    { id: "LWE-18", edgeType: "evaluatedBy", description: "Artifact is evaluated by an evaluation node." },
    { id: "LWE-19", edgeType: "usesRubric", description: "Evaluation uses a rubric definition." },
    { id: "LWE-20", edgeType: "runsInSuite", description: "Evaluation run belongs to a suite." },
    { id: "LWE-21", edgeType: "detectsDrift", description: "Evaluation or signal detects drift." },
    { id: "LWE-22", edgeType: "proposesUpdate", description: "Signal proposes a DH update." },
    { id: "LWE-23", edgeType: "governs", description: "Policy node governs another resource." },
    { id: "LWE-24", edgeType: "promotes", description: "Graduation path promotes a resource or policy state." },
  ],
  source: "palantir-learn/convex/schema.ts",
} as const;

// =========================================================================
// Section 33: Human-Agent Leverage Criteria (HAL-01..03)
// =========================================================================
//
// DevCon 5 opening remarks framed the modern builder environment as a specific
// human-agent leverage pattern: shared mutable context, clear validation, and
// feedback-driven optimization. These are not just DX slogans. They are the
// criteria that determine whether AI agents can actually reduce HITL while
// preserving operational correctness.
//
// Source: research/palantir/platform/devcon.md §DC5-02..03

export interface HumanAgentLeverageCriterion {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly localImplication: string;
  readonly source: string;
}

export const HUMAN_AGENT_LEVERAGE_CRITERIA: readonly HumanAgentLeverageCriterion[] = [
  {
    id: "HAL-01",
    name: "Shared Mutable Context",
    description:
      "Humans and coding agents work best when they transmit context at high bandwidth against a shared mutable state, "
      + "not isolated prompts. The state itself becomes the coordination substrate.",
    localImplication:
      "Project scope should externalize shared state into typed backend and frontend ontology declarations, "
      + "not rely on chat memory or ad-hoc UI conventions.",
    source: "research/palantir/platform/devcon.md §DC5-02",
  },
  {
    id: "HAL-02",
    name: "Clear Validation Criteria",
    description:
      "Agentic work compounds only when each stage has explicit validation criteria, whether through phased review, "
      + "deterministic checks, or post-hoc analysis.",
    localImplication:
      "Backend and frontend ontology generation must end in explicit validators: schema checks, frontend reference integrity, "
      + "evaluation suites, and deterministic route/action/query contracts.",
    source: "research/palantir/platform/devcon.md §DC5-02 + research/palantir/platform/ai-fde.md §FDE-05",
  },
  {
    id: "HAL-03",
    name: "Feedback-Driven Optimization",
    description:
      "Prompt refinement, agent definitions, and structured operator feedback should improve the system over time instead of "
      + "being lost after a single run.",
    localImplication:
      "Durable feedback belongs in schema constants, task-context scaffolds, evaluation records, and typed frontend feedback surfaces "
      + "rather than free-form comments or transient chat history.",
    source: "research/palantir/platform/devcon.md §DC5-02 + research/palantir/platform/ai-fde.md §FDE-06",
  },
] as const;

// =========================================================================
// Section 34: Project Scope Ontology Surfaces (PS-01..04)
// =========================================================================
//
// DevCon 5 made the whole builder stack explicit: ontology primitives, functions,
// applications, voice/agent surfaces, scenarios, and automations are one project
// scope. If AI agents are expected to implement "the ontology" with minimal HITL,
// the contract must cover both backend and frontend surfaces.
//
// Source: research/palantir/platform/devcon.md §DC5-03, §DC5-08..10

export type ProjectScopeSurfaceLayer = "backend" | "frontend" | "cross";

export interface ProjectScopeOntologySurface {
  readonly id: string;
  readonly layer: ProjectScopeSurfaceLayer;
  readonly name: string;
  readonly officialSurface: string;
  readonly localImplication: string;
  readonly source: string;
}

export const PROJECT_SCOPE_ONTOLOGY_SURFACES: readonly ProjectScopeOntologySurface[] = [
  {
    id: "PS-01",
    layer: "backend",
    name: "Backend Semantic Core",
    officialSurface: "Object types, link types, functions, actions, security, and LEARN signals",
    localImplication:
      "This maps to BackendOntology: data, logic, action, security, and learn. AI agents must stabilize this semantic core before shipping UI.",
    source: "research/palantir/platform/devcon.md §DC5-03",
  },
  {
    id: "PS-02",
    layer: "frontend",
    name: "Application Surface",
    officialSurface: "Workshop applications, OSDK apps, dashboards, and local-first app scaffolds",
    localImplication:
      "Frontend ontology must declare routes/views against explicit entity/query/action references so AI agents can scaffold real applications without inventing bindings.",
    source: "research/palantir/platform/devcon.md §DC5-08..09",
  },
  {
    id: "PS-03",
    layer: "frontend",
    name: "Agent Surface",
    officialSurface: "Voice agents, assistant panels, inbox reviewers, and agent-built applications",
    localImplication:
      "Agent-facing UI surfaces must bind to explicit backend queries, functions, actions, and automations. This is the minimum contract for reducing HITL safely.",
    source: "research/palantir/platform/devcon.md §DC5-08..10 + research/palantir/platform/ai-fde.md §FDE-05..07",
  },
  {
    id: "PS-04",
    layer: "cross",
    name: "Sandbox and Review Surface",
    officialSurface: "Scenarios, staged review, Workflow Lineage, Object Security Policies, and transactions",
    localImplication:
      "Human-agent teaming should prefer sandboxed proposal flows over direct production mutation. Frontend contracts must be able to declare compare/submit/commit patterns explicitly.",
    source: "research/palantir/platform/devcon.md §DC5-10",
  },
] as const;

// =========================================================================
// Section 35: Ontology Design Principles (ODP-01..04)
// =========================================================================
//
// The advanced ontology session made four long-lived design principles explicit.
// These are durable enough to promote into schema authority because they improve
// how AI agents structure ontologies, not just how humans narrate them.
//
// Source: research/palantir/platform/devcon.md §DC5-04..06

export interface OntologyDesignPrinciple {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly aiAgentImplication: string;
  readonly source: string;
}

export const ONTOLOGY_DESIGN_PRINCIPLES: readonly OntologyDesignPrinciple[] = [
  {
    id: "ODP-01",
    name: "Domain-Driven Design",
    description:
      "Model real-world objects, links, and workflows as the virtual twin of operations rather than mirroring upstream datasets blindly.",
    aiAgentImplication:
      "Agents should translate source systems into operational semantics, not ontologize every upstream field one-to-one without abstraction.",
    source: "research/palantir/platform/devcon.md §DC5-05",
  },
  {
    id: "ODP-02",
    name: "Don't Repeat Yourself",
    description:
      "Use the rule of three: if the same workflow or schema is built repeatedly, refactor toward interfaces, shared representations, or canonical workflows.",
    aiAgentImplication:
      "When AI agents detect repeated object/view/workflow shapes, they should prefer interface-backed or shared constructs over copy-pasted ontology fragments.",
    source: "research/palantir/platform/devcon.md §DC5-05..06",
  },
  {
    id: "ODP-03",
    name: "Open for Extension, Closed for Modification",
    description:
      "Core workflows and interfaces should be stable enough to protect the canonical model while remaining extensible by downstream builders.",
    aiAgentImplication:
      "Agents should default to extending stable interfaces and action/query surfaces before mutating canonical definitions that many workflows depend on.",
    source: "research/palantir/platform/devcon.md §DC5-05..06",
  },
  {
    id: "ODP-04",
    name: "Producer Extends, Consumer Super",
    description:
      "Interface-based design increases plug-and-play reuse: producers can specialize while consumers operate over stable abstractions.",
    aiAgentImplication:
      "AI-generated frontend and backend workflows should prefer interface-level contracts when they need cross-type reuse or future-proof extensibility.",
    source: "research/palantir/platform/devcon.md §DC5-05..06",
  },
] as const;

// =========================================================================
// Section 36: Embedded Ontology App Surfaces (EO-01..05)
// =========================================================================
//
// Foundry now documents an explicit local-first / offline-capable application
// path using the embedded ontology. This gives DevCon 5's "embedded ontology"
// claim an official operational surface: explicit sync sets, local Wasm-backed
// runtime, PWA installation, and optional diff-based peering.
//
// Source: research/palantir/platform/devcon.md §DC5-09
//         research/palantir/platform/announcements.md §ANN-03

export interface EmbeddedOntologyAppSurface {
  readonly id: string;
  readonly component: string;
  readonly description: string;
  readonly localImplication: string;
  readonly source: string;
}

export const EMBEDDED_ONTOLOGY_APP_SURFACES: readonly EmbeddedOntologyAppSurface[] = [
  {
    id: "EO-01",
    component: "Offline-capable client-facing app",
    description: "Foundry can bootstrap a client-facing application that syncs ontology data locally and continues working without network connectivity.",
    localImplication: "Frontend ontology may need an explicit embeddedOntologyApp surface when the application semantics include offline operation.",
    source: "research/palantir/platform/devcon.md §DC5-09",
  },
  {
    id: "EO-02",
    component: "Explicit sync set",
    description: "Embedded ontology apps configure a bounded syncObjects set instead of implicitly mirroring the full ontology offline.",
    localImplication: "Offline-capable views should declare syncEntityApiNames rather than treating local sync scope as hidden runtime detail.",
    source: "research/palantir/platform/devcon.md §DC5-09",
  },
  {
    id: "EO-03",
    component: "Runtime support surface",
    description: "The embedded ontology runtime is a distinct support layer with its own bootstrapping, client, and sync lifecycle.",
    localImplication: "Runtime support bindings should be able to declare embedded ontology support explicitly instead of burying it in component code.",
    source: "research/palantir/platform/devcon.md §DC5-09",
  },
  {
    id: "EO-04",
    component: "Progressive Web App delivery",
    description: "Offline-capable applications can be installed as PWAs and keep working against synced ontology data while disconnected.",
    localImplication: "Local-first ontology surfaces are not only developer tooling; they are end-user runtime contracts that may affect routes, support bindings, and sync policy.",
    source: "research/palantir/platform/announcements.md §ANN-03",
  },
  {
    id: "EO-05",
    component: "Peering / diff sync",
    description: "Offline App Sync can switch from full reloads to diff-based peering for configured object types.",
    localImplication: "Projects with large offline sync sets should treat sync strategy as a semantic/runtime concern, not just a transport optimization.",
    source: "research/palantir/platform/announcements.md §ANN-03",
  },
] as const;

// =========================================================================
// Section 37: Structural Change Governance Surfaces (SCG-01..05)
// =========================================================================
//
// Builder-side ontology evolution is no longer a hidden admin concern. Foundry
// exposes explicit branch, proposal, and protection surfaces for structural
// changes. This is distinct from runtime scenarios: scenarios compare potential
// operational outcomes, while branch/proposal flows govern structural changes to
// the ontology/application stack itself.
//
// Source: research/palantir/platform/devcon.md §DC5-10
//         research/palantir/platform/announcements.md §ANN-07

export interface StructuralChangeGovernanceSurface {
  readonly id: string;
  readonly surface: string;
  readonly description: string;
  readonly localImplication: string;
  readonly source: string;
}

export const STRUCTURAL_CHANGE_GOVERNANCE_SURFACES: readonly StructuralChangeGovernanceSurface[] = [
  {
    id: "SCG-01",
    surface: "Global Branch",
    description: "Structural ontology and application edits are isolated on a dedicated branch before proposal or merge.",
    localImplication: "Project ontology changes should distinguish draft structural evolution from committed runtime behavior.",
    source: "research/palantir/platform/announcements.md §ANN-07",
  },
  {
    id: "SCG-02",
    surface: "Proposal review",
    description: "A proposal is the explicit review/merge object for branch-backed structural change, separate from the draft branch itself.",
    localImplication: "Review/approval semantics apply both to runtime actions and to structural change workflows; do not collapse them into one abstraction.",
    source: "research/palantir/platform/announcements.md §ANN-MCP",
  },
  {
    id: "SCG-03",
    surface: "Resource protection and project approval policies",
    description: "Protected resources and approval policies gate which structural changes can be promoted.",
    localImplication: "Local governance docs should treat protected structural surfaces as first-class authority boundaries, not as optional workflow hygiene.",
    source: "research/palantir/platform/devcon.md §DC5-10",
  },
  {
    id: "SCG-04",
    surface: "Delegated branch ownership",
    description: "Branch creators can assign owner-equivalent roles to additional users or groups, decoupling authorship from sole merge control.",
    localImplication: "Human-agent teaming should model ownership and review delegation explicitly instead of assuming one operator per change surface.",
    source: "research/palantir/platform/announcements.md §ANN-07",
  },
  {
    id: "SCG-05",
    surface: "Object view branching approval gap",
    description: "Object view branching exists, but approvals integration was still incomplete in the January 2026 announcement and explicitly on the roadmap.",
    localImplication: "Do not assume every branchable UI resource already inherits the full approval stack; review coverage itself must be checked.",
    source: "research/palantir/platform/announcements.md §ANN-JAN",
  },
] as const;
