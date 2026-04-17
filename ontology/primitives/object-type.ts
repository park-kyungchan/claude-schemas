/**
 * palantir-mini — ObjectType primitive (prim-data-02)
 *
 * OSDK 2.0-compatible ObjectType declaration. Each ObjectType holds
 * stored-fact properties only (no derived). DerivedProperty lives in
 * ../functions/derived-property.ts.
 *
 * Authority chain:
 *   research/palantir/ -> schemas/ontology/primitives/object-type.ts (this file)
 *   -> palantir-mini/lib/codegen/descender-gen.ts
 *   -> <project>/src/generated/objects.d.ts
 *
 * Branded RID pattern (zero runtime cost):
 *   type ObjectTypeRid = string & { __brand: "ObjectTypeRid" };
 *
 * This file is STABLE CONTRACT. Do not change without a migration plan.
 */

export type ObjectTypeRid = string & { readonly __brand: "ObjectTypeRid" };

export const objectTypeRid = (s: string): ObjectTypeRid => s as ObjectTypeRid;

export interface ObjectTypeDeclaration {
  readonly rid: ObjectTypeRid;
  /** Human-readable name (matches the generated interface) */
  readonly name: string;
  /** Optional description — propagated to generated code as comment */
  readonly description?: string;
  /** Stored property declarations */
  readonly properties: ReadonlyArray<{
    readonly name: string;
    readonly type: string;   // TS type literal or PropertyTypeName
    readonly optional?: boolean;
  }>;
  /** Link declarations pointing to other ObjectTypes */
  readonly links?: ReadonlyArray<{
    readonly name: string;
    readonly to: ObjectTypeRid;
    readonly cardinality: "one" | "many";
  }>;
  /** InterfaceType RIDs this ObjectType implements */
  readonly implements?: ReadonlyArray<string>;
}

/** Registry helper — v0 minimal registry via plain Map */
export class ObjectTypeRegistry {
  private readonly types = new Map<ObjectTypeRid, ObjectTypeDeclaration>();

  register(decl: ObjectTypeDeclaration): void {
    this.types.set(decl.rid, decl);
  }

  get(rid: ObjectTypeRid): ObjectTypeDeclaration | undefined {
    return this.types.get(rid);
  }

  list(): ObjectTypeDeclaration[] {
    return [...this.types.values()];
  }
}

export const OBJECT_TYPE_REGISTRY = new ObjectTypeRegistry();
