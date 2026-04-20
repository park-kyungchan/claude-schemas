/**
 * A8.1 — ImpactEdge primitive tests (Context Engineering substrate)
 */

import { describe, test, expect } from "bun:test";
import {
  impactEdgeRid,
  ImpactEdgeRegistry,
  type ImpactEdgeDeclaration,
} from "../../ontology/primitives/impact-edge";

const makeEdge = (id: string, from: string, to: string): ImpactEdgeDeclaration => ({
  rid: impactEdgeRid(id),
  fromRid: from,
  toRid: to,
  edgeKind: "forwardProp",
  confidence: 1.0,
  registeredAt: "2026-04-19T00:00:00Z",
});

describe("ImpactEdge — Rid brand", () => {
  test("rid helper round-trip", () => {
    expect(String(impactEdgeRid("edge:1"))).toBe("edge:1");
  });
});

describe("ImpactEdge — Registry: register / get / list", () => {
  test("round-trip", () => {
    const reg = new ImpactEdgeRegistry();
    const edge = makeEdge("e-1", "A", "B");
    reg.register(edge);
    expect(reg.get(edge.rid)).toBe(edge);
    expect(reg.list()).toHaveLength(1);
  });

  test("register emits impact_edge_registered event when emitter provided", () => {
    const reg = new ImpactEdgeRegistry();
    const emitted: Array<{ type: string; payload: ImpactEdgeDeclaration }> = [];
    reg.register(makeEdge("e-1", "A", "B"), (type, payload) => emitted.push({ type, payload }));
    expect(emitted).toHaveLength(1);
    expect(emitted[0]!.type).toBe("impact_edge_registered");
  });
});

describe("ImpactEdge — queryForward / queryBackward", () => {
  test("queryForward returns outbound edges", () => {
    const reg = new ImpactEdgeRegistry();
    reg.register(makeEdge("e-1", "A", "B"));
    reg.register(makeEdge("e-2", "A", "C"));
    reg.register(makeEdge("e-3", "B", "C"));
    expect(reg.queryForward("A")).toHaveLength(2);
    expect(reg.queryBackward("C")).toHaveLength(2);
  });
});

describe("ImpactEdge — walkTransitive", () => {
  test("walks the forward-reachable subgraph within depth bound", () => {
    const reg = new ImpactEdgeRegistry();
    reg.register(makeEdge("e-1", "A", "B"));
    reg.register(makeEdge("e-2", "B", "C"));
    reg.register(makeEdge("e-3", "C", "D"));
    const graph = reg.walkTransitive("A", 2);
    expect(graph.root).toBe("A");
    expect(graph.nodes.map((n) => n.rid).sort()).toEqual(["A", "B", "C"]);
    expect(graph.edges).toHaveLength(2);
  });

  test("breaks cycles with visited set", () => {
    const reg = new ImpactEdgeRegistry();
    reg.register(makeEdge("e-1", "A", "B"));
    reg.register(makeEdge("e-2", "B", "A"));
    const graph = reg.walkTransitive("A", 10);
    expect(graph.nodes.map((n) => n.rid).sort()).toEqual(["A", "B"]);
  });
});
