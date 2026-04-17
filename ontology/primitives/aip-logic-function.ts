/**
 * @stable — AIPLogicFunction primitive (prim-logic-03, v1.0)
 *
 * LLM-backed logic function (Palantir AIP Logic analog). Distinct from
 * deterministic EditFunctions — an AIPLogicFunction wraps a model call with a
 * prompt template and output schema. `deterministic` is always false for
 * LLM-backed functions; the field exists as an explicit contract signal.
 *
 * Authority chain:
 *   research/palantir/logic/ → schemas/ontology/primitives/aip-logic-function.ts (this file)
 *   → home-ontology/shared-core → per-project ontology/ → codegen
 *
 * D/L/A domain: LOGIC (LLM-backed function enables reasoning over ontology data;
 * not a stored fact, not a direct mutation — produces derived reasoning outputs)
 */

export type AIPLogicFunctionRid = string & { readonly __brand: "AIPLogicFunctionRid" };

export const aipLogicFunctionRid = (s: string): AIPLogicFunctionRid => s as AIPLogicFunctionRid;

export interface AIPLogicFunctionDeclaration {
  readonly functionId: AIPLogicFunctionRid;
  /** Model identifier (e.g. "claude-sonnet-4-6", "claude-opus-4-7") */
  readonly modelRef: string;
  /** Prompt template — may reference ontology properties via {{property.name}} tokens */
  readonly promptTemplate: string;
  /** RID or JSON-schema reference for the expected structured output */
  readonly outputSchema: string;
  /**
   * Always false for LLM-backed functions. Declared explicitly as a contract
   * signal: consumers must not assume deterministic re-invocation behavior.
   */
  readonly deterministic: false;
  readonly description?: string;
}

export class AIPLogicFunctionRegistry {
  private readonly items = new Map<AIPLogicFunctionRid, AIPLogicFunctionDeclaration>();

  register(decl: AIPLogicFunctionDeclaration): void {
    this.items.set(decl.functionId, decl);
  }

  get(rid: AIPLogicFunctionRid): AIPLogicFunctionDeclaration | undefined {
    return this.items.get(rid);
  }

  keys(): IterableIterator<AIPLogicFunctionRid> {
    return this.items.keys();
  }

  list(): AIPLogicFunctionDeclaration[] {
    return [...this.items.values()];
  }
}

export const AIP_LOGIC_FUNCTION_REGISTRY = new AIPLogicFunctionRegistry();
