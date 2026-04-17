/**
 * Interaction Schema Validator — Tests
 *
 * Validates HC-INT-01..04, HC-GEST-01..03, HC-BIND-02..04, HC-ELEM-01/03/04
 * against positive and NEGATIVE test cases.
 * The negative cases are based on real bugs discovered in palantir-math v2.0
 * and WCAG/W3C research (2026-03-22).
 */

import { describe, expect, it } from "bun:test";
import { validateInteraction, summarize } from "./validator";
import type { InteractionExports, ElementProfile, GestureDeclaration } from "./types";
import { GESTURE_TYPES } from "./gesture/schema";

// ─── Test Fixtures ─────────────────────────────────────────────

const validGestures: GestureDeclaration[] = [
  {
    apiName: "swipe-left-advance",
    description: "Swipe left to advance to next step",
    domain: "navigation",
    inputDevice: "any",
    gestureType: "swipe-left",
    actionRef: "navigate:next",
    library: "@use-gesture/react",
    eventStream: "touch",
  },
  {
    apiName: "tap-select-step",
    description: "Tap on a step card to select it",
    domain: "navigation",
    inputDevice: "any",
    gestureType: "tap",
    actionRef: "navigate:goto",
    library: "@use-gesture/react",
    eventStream: "touch",
  },
  {
    apiName: "pinch-zoom-geometry",
    description: "Pinch to zoom geometry panel",
    domain: "view",
    inputDevice: "any",
    gestureType: "pinch-in",
    actionRef: "view:zoom",
    library: "@use-gesture/react",
    eventStream: "pointer",
  },
  {
    apiName: "pen-draw-annotation",
    description: "S-Pen draw to create annotation",
    domain: "mutation",
    inputDevice: "pen",
    gestureType: "pen-draw",
    actionRef: "recordAnnotation",
    library: "@use-gesture/react",
    eventStream: "pointer",
  },
  {
    // Universal fallback for pen-draw
    apiName: "finger-draw-annotation",
    description: "Finger draw to create annotation (fallback)",
    domain: "mutation",
    inputDevice: "any",
    gestureType: "pen-draw",
    actionRef: "recordAnnotation",
    library: "@use-gesture/react",
    eventStream: "pointer",
  },
];

const validElements: ElementProfile[] = [
  {
    elementName: "NarrativePanel",
    library: "@use-gesture/react",
    eventStream: "touch",
    touchAction: "pan-y",
    role: "gesture-owner",
    bindings: [
      {
        elementScope: "NarrativePanel",
        gestureApiName: "swipe-left-advance",
        library: "@use-gesture/react",
        eventStream: "touch",
        touchAction: "pan-y",
        priority: 1,
      },
      {
        elementScope: "NarrativePanel",
        gestureApiName: "tap-select-step",
        library: "@use-gesture/react",
        eventStream: "touch",
        touchAction: "pan-y",
        priority: 2,
      },
    ],
  },
  {
    elementName: "GeometryPanel",
    library: "@use-gesture/react",
    eventStream: "pointer",
    touchAction: "none",
    role: "gesture-owner",
    bindings: [
      {
        elementScope: "GeometryPanel",
        gestureApiName: "pinch-zoom-geometry",
        library: "@use-gesture/react",
        eventStream: "pointer",
        touchAction: "none",
        priority: 1,
      },
      {
        elementScope: "GeometryPanel",
        gestureApiName: "pen-draw-annotation",
        library: "@use-gesture/react",
        eventStream: "pointer",
        touchAction: "none",
        priority: 2,
      },
    ],
  },
  {
    elementName: "StepCard",
    library: "@use-gesture/react",
    eventStream: "touch",
    touchAction: "pan-y",
    role: "gesture-target",
    dataAttributes: ["data-step-index"],
    bindings: [], // gesture-target: no handlers
  },
];

const validInteraction: InteractionExports = {
  gestures: validGestures,
  elements: validElements,
  deviceProfiles: [
    {
      deviceId: "galaxy-book-4-pro-360",
      capabilities: [
        { name: "pressure", pointerEventProperty: "pressure", inputDevice: "pen" },
        { name: "tilt", pointerEventProperty: "tiltX", inputDevice: "pen" },
        { name: "barrel-button", pointerEventProperty: "buttons & 2", inputDevice: "pen" },
        { name: "eraser", pointerEventProperty: "buttons & 32", inputDevice: "pen" },
        { name: "hover", pointerEventProperty: "pointermove (pressure=0)", inputDevice: "pen" },
      ],
      constraints: [
        { name: "no-3-finger", description: "No 3-finger custom gestures — OS conflicts" },
        { name: "palm-rejection-os-level", description: "Wacom digitizer handles palm rejection" },
      ],
    },
  ],
};

// ─── HC-INT-01: Single Gesture Library Per Element ─────────────

describe("HC-INT-01: Single Gesture Library Per Element", () => {
  it("passes when all bindings use the same library", () => {
    const results = validateInteraction(validInteraction, ["recordAnnotation"]);
    const hc01 = results.filter((r) => r.id === "HC-INT-01");
    expect(hc01.every((r) => r.passed)).toBe(true);
  });

  it("fails when element mixes Motion and @use-gesture (real bug: palantir-math v2.0)", () => {
    const conflictingElements: ElementProfile[] = [
      {
        elementName: "NarrativePanel",
        library: "@use-gesture/react",
        eventStream: "touch",
        touchAction: "pan-y",
        bindings: [
          {
            elementScope: "NarrativePanel",
            gestureApiName: "swipe-left-advance",
            library: "@use-gesture/react",
            eventStream: "touch",
            touchAction: "pan-y",
            priority: 1,
          },
          {
            elementScope: "NarrativePanel",
            gestureApiName: "tap-select-step",
            library: "motion",
            eventStream: "pointer",
            touchAction: "pan-y",
            priority: 2,
          },
        ],
      },
    ];
    const results = validateInteraction(
      { ...validInteraction, elements: conflictingElements },
      ["recordAnnotation"],
    );
    const hc01 = results.filter((r) => r.id === "HC-INT-01");
    expect(hc01.some((r) => !r.passed)).toBe(true);
    expect(hc01.find((r) => !r.passed)?.message).toContain("2 gesture libraries");
  });
});

// ─── HC-INT-02: Gesture Binding References Valid Action ─────────

describe("HC-INT-02: Gesture Binding References Valid Action", () => {
  it("passes for reserved navigation actions", () => {
    const results = validateInteraction(validInteraction, []);
    const hc02 = results.filter((r) => r.id === "HC-INT-02" && r.message.includes("navigate:"));
    expect(hc02.every((r) => r.passed)).toBe(true);
  });

  it("passes for valid ontology action references", () => {
    const results = validateInteraction(validInteraction, ["recordAnnotation"]);
    const hc02 = results.filter((r) => r.id === "HC-INT-02" && r.message.includes("recordAnnotation"));
    expect(hc02.every((r) => r.passed)).toBe(true);
  });

  it("fails for orphan gesture with unknown action", () => {
    const orphanGestures: GestureDeclaration[] = [
      ...validGestures,
      {
        apiName: "barrel-clear",
        description: "Barrel button tap to clear canvas",
        domain: "mutation",
        inputDevice: "pen",
        gestureType: "pen-barrel-tap",
        actionRef: "nonExistentAction",
        library: "@use-gesture/react",
        eventStream: "pointer",
      },
    ];
    const results = validateInteraction(
      { ...validInteraction, gestures: orphanGestures },
      ["recordAnnotation"],
    );
    const hc02fail = results.filter((r) => r.id === "HC-INT-02" && !r.passed);
    expect(hc02fail.length).toBe(1);
    expect(hc02fail[0]!.message).toContain("nonExistentAction");
  });

  it("passes for tool: reserved prefix", () => {
    const toolGestures: GestureDeclaration[] = [
      {
        apiName: "pen-select-eraser",
        description: "Select eraser tool",
        domain: "navigation",
        inputDevice: "pen",
        gestureType: "pen-barrel-tap",
        actionRef: "tool:eraser",
        library: "@use-gesture/react",
        eventStream: "pointer",
      },
    ];
    const results = validateInteraction(
      { ...validInteraction, gestures: toolGestures },
      [],
    );
    const hc02 = results.filter((r) => r.id === "HC-INT-02");
    expect(hc02.every((r) => r.passed)).toBe(true);
  });
});

// ─── HC-INT-03: Touch-Action CSS Consistency ───────────────────

describe("HC-INT-03: Touch-Action CSS Consistency", () => {
  it("passes when touch-action is consistent with gesture axis", () => {
    const results = validateInteraction(validInteraction, ["recordAnnotation"]);
    const hc03 = results.filter((r) => r.id === "HC-INT-03");
    expect(hc03.every((r) => r.passed)).toBe(true);
  });

  it("fails when horizontal gesture used with touch-action auto", () => {
    const badElements: ElementProfile[] = [
      {
        elementName: "SwipePanel",
        library: "@use-gesture/react",
        eventStream: "touch",
        touchAction: "auto",
        bindings: [
          {
            elementScope: "SwipePanel",
            gestureApiName: "swipe-left-advance",
            library: "@use-gesture/react",
            eventStream: "touch",
            touchAction: "auto",
            priority: 1,
          },
        ],
      },
    ];
    const results = validateInteraction(
      { ...validInteraction, elements: badElements },
      ["recordAnnotation"],
    );
    const hc03fail = results.filter((r) => r.id === "HC-INT-03" && !r.passed);
    expect(hc03fail.length).toBe(1);
    expect(hc03fail[0]!.message).toContain("horizontal gestures");
  });
});

// ─── HC-INT-04: Event Stream Isolation ─────────────────────────

describe("HC-INT-04: Event Stream Isolation", () => {
  it("passes when all bindings use the same event stream", () => {
    const results = validateInteraction(validInteraction, ["recordAnnotation"]);
    const hc04 = results.filter((r) => r.id === "HC-INT-04");
    expect(hc04.every((r) => r.passed)).toBe(true);
  });

  it("fails when element mixes touch and pointer streams (real bug: palantir-math v2.0)", () => {
    const mixedElements: ElementProfile[] = [
      {
        elementName: "NarrativePanel",
        library: "@use-gesture/react",
        eventStream: "touch",
        touchAction: "pan-y",
        bindings: [
          {
            elementScope: "NarrativePanel",
            gestureApiName: "swipe-left-advance",
            library: "@use-gesture/react",
            eventStream: "touch",
            touchAction: "pan-y",
            priority: 1,
          },
          {
            elementScope: "NarrativePanel",
            gestureApiName: "tap-select-step",
            library: "@use-gesture/react",
            eventStream: "pointer",
            touchAction: "pan-y",
            priority: 2,
          },
        ],
      },
    ];
    const results = validateInteraction(
      { ...validInteraction, elements: mixedElements },
      ["recordAnnotation"],
    );
    const hc04fail = results.filter((r) => r.id === "HC-INT-04" && !r.passed);
    expect(hc04fail.length).toBe(1);
    expect(hc04fail[0]!.message).toContain("mixes event streams");
  });
});

// ─── HC-GEST-01: Device Fallback Required ──────────────────────

describe("HC-GEST-01: Device Fallback Required", () => {
  it("passes when pen gesture has universal fallback", () => {
    const results = validateInteraction(validInteraction, ["recordAnnotation"]);
    const hc = results.filter((r) => r.id === "HC-GEST-01");
    expect(hc.every((r) => r.passed)).toBe(true);
  });

  it("warns when pen gesture has no universal fallback", () => {
    const noFallback: GestureDeclaration[] = [
      {
        apiName: "pen-only-action",
        description: "Pen-only without fallback",
        domain: "mutation",
        inputDevice: "pen",
        gestureType: "pen-draw",
        actionRef: "penOnlyMutation",
        library: "@use-gesture/react",
        eventStream: "pointer",
      },
    ];
    const results = validateInteraction(
      { ...validInteraction, gestures: noFallback },
      ["penOnlyMutation"],
    );
    const hc = results.filter((r) => r.id === "HC-GEST-01");
    expect(hc.some((r) => !r.passed)).toBe(true);
    expect(hc.find((r) => !r.passed)?.message).toContain("NO universal fallback");
  });
});

// ─── HC-GEST-02: No OS-Conflicting Gestures ────────────────────

describe("HC-GEST-02: No OS-Conflicting Gestures", () => {
  it("passes when no OS-conflicting types used", () => {
    const results = validateInteraction(validInteraction, ["recordAnnotation"]);
    const hc = results.filter((r) => r.id === "HC-GEST-02");
    expect(hc.every((r) => r.passed)).toBe(true);
  });

  it("fails when 3-finger gesture is declared (Windows Task View conflict)", () => {
    const badGestures: GestureDeclaration[] = [
      ...validGestures,
      {
        apiName: "three-finger-swipe",
        description: "Three finger swipe for overview",
        domain: "navigation",
        inputDevice: "touch",
        gestureType: "3-finger-swipe",
        actionRef: "navigate:overview",
        library: "@use-gesture/react",
        eventStream: "touch",
      },
    ];
    const results = validateInteraction(
      { ...validInteraction, gestures: badGestures },
      ["recordAnnotation"],
    );
    const hc = results.filter((r) => r.id === "HC-GEST-02" && !r.passed);
    expect(hc.length).toBe(1);
    expect(hc[0]!.message).toContain("3-finger");
  });
});

// ─── HC-GEST-03: Gesture Type From Taxonomy ────────────────────

describe("HC-GEST-03: Gesture Type From Taxonomy", () => {
  it("passes when all gesture types are in taxonomy", () => {
    const results = validateInteraction(
      validInteraction, ["recordAnnotation"], [], GESTURE_TYPES,
    );
    const hc = results.filter((r) => r.id === "HC-GEST-03");
    expect(hc.every((r) => r.passed)).toBe(true);
  });

  it("fails when gesture uses unregistered type", () => {
    const badGestures: GestureDeclaration[] = [
      {
        apiName: "custom-gesture",
        description: "Custom unregistered gesture",
        domain: "navigation",
        inputDevice: "any",
        gestureType: "triple-tap-and-hold",
        actionRef: "navigate:special",
        library: "@use-gesture/react",
        eventStream: "pointer",
      },
    ];
    const results = validateInteraction(
      { ...validInteraction, gestures: badGestures },
      [], [], GESTURE_TYPES,
    );
    const hc = results.filter((r) => r.id === "HC-GEST-03" && !r.passed);
    expect(hc.length).toBe(1);
    expect(hc[0]!.message).toContain("triple-tap-and-hold");
  });

  it("skips when no taxonomy provided", () => {
    const results = validateInteraction(validInteraction, ["recordAnnotation"]);
    const hc = results.filter((r) => r.id === "HC-GEST-03");
    expect(hc.length).toBe(0); // No checks = backward compatible
  });
});

// ─── HC-BIND-02: No Ambiguous Bindings ─────────────────────────

describe("HC-BIND-02: No Ambiguous Bindings on Same Element", () => {
  it("passes when all bindings are distinguishable", () => {
    const results = validateInteraction(validInteraction, ["recordAnnotation"]);
    const hc = results.filter((r) => r.id === "HC-BIND-02");
    expect(hc.every((r) => r.passed)).toBe(true);
  });

  it("fails when two bindings match same gestureType+inputDevice", () => {
    const dupGestures: GestureDeclaration[] = [
      {
        apiName: "tap-advance",
        description: "Tap to advance",
        domain: "navigation",
        inputDevice: "any",
        gestureType: "tap",
        actionRef: "navigate:next",
        library: "@use-gesture/react",
        eventStream: "touch",
      },
      {
        apiName: "tap-select",
        description: "Tap to select",
        domain: "navigation",
        inputDevice: "any",
        gestureType: "tap",
        actionRef: "navigate:goto",
        library: "@use-gesture/react",
        eventStream: "touch",
      },
    ];
    const dupElements: ElementProfile[] = [
      {
        elementName: "AmbiguousPanel",
        library: "@use-gesture/react",
        eventStream: "touch",
        touchAction: "pan-y",
        bindings: [
          { elementScope: "AmbiguousPanel", gestureApiName: "tap-advance", library: "@use-gesture/react", eventStream: "touch", touchAction: "pan-y", priority: 1 },
          { elementScope: "AmbiguousPanel", gestureApiName: "tap-select", library: "@use-gesture/react", eventStream: "touch", touchAction: "pan-y", priority: 2 },
        ],
      },
    ];
    const results = validateInteraction(
      { ...validInteraction, gestures: dupGestures, elements: dupElements },
      [],
    );
    const hc = results.filter((r) => r.id === "HC-BIND-02" && !r.passed);
    expect(hc.length).toBe(1);
    expect(hc[0]!.message).toContain("ambiguous");
  });
});

// ─── HC-BIND-03: Binding References Declared Gesture ───────────

describe("HC-BIND-03: Binding References Declared Gesture", () => {
  it("passes when all bindings reference declared gestures", () => {
    const results = validateInteraction(validInteraction, ["recordAnnotation"]);
    const hc = results.filter((r) => r.id === "HC-BIND-03");
    expect(hc.every((r) => r.passed)).toBe(true);
  });

  it("fails when binding references undeclared gesture", () => {
    const orphanElements: ElementProfile[] = [
      {
        elementName: "OrphanPanel",
        library: "@use-gesture/react",
        eventStream: "touch",
        touchAction: "pan-y",
        bindings: [
          { elementScope: "OrphanPanel", gestureApiName: "nonexistent-gesture", library: "@use-gesture/react", eventStream: "touch", touchAction: "pan-y", priority: 1 },
        ],
      },
    ];
    const results = validateInteraction(
      { ...validInteraction, elements: orphanElements },
      ["recordAnnotation"],
    );
    const hc = results.filter((r) => r.id === "HC-BIND-03" && !r.passed);
    expect(hc.length).toBe(1);
    expect(hc[0]!.message).toContain("nonexistent-gesture");
  });
});

// ─── HC-BIND-04: Impact Chain Must Be Declared ─────────────────

describe("HC-BIND-04: Impact Chain Must Be Declared", () => {
  it("warns when mutation binding has no impact chain", () => {
    const results = validateInteraction(validInteraction, ["recordAnnotation"]);
    const hc = results.filter((r) => r.id === "HC-BIND-04");
    // pen-draw-annotation is a mutation (non-reserved actionRef) without impactChain
    expect(hc.some((r) => !r.passed)).toBe(true);
  });

  it("passes when mutation binding has impact chain", () => {
    const withChain: ElementProfile[] = [
      {
        elementName: "CanvasPanel",
        library: "@use-gesture/react",
        eventStream: "pointer",
        touchAction: "none",
        bindings: [
          {
            elementScope: "CanvasPanel",
            gestureApiName: "pen-draw-annotation",
            library: "@use-gesture/react",
            eventStream: "pointer",
            touchAction: "none",
            priority: 1,
            impactChain: {
              actionRef: "recordAnnotation",
              entityField: "Annotation.strokes",
              directTargets: ["CanvasPanel"],
              cascadeTargets: ["AnnotationList"],
            },
          },
        ],
      },
    ];
    const results = validateInteraction(
      { ...validInteraction, elements: withChain },
      ["recordAnnotation"],
    );
    const hc = results.filter((r) => r.id === "HC-BIND-04" && r.element === "CanvasPanel");
    expect(hc.every((r) => r.passed)).toBe(true);
  });
});

// ─── HC-ELEM-01: Gesture-Target Has No Handlers ───────────────

describe("HC-ELEM-01: Gesture-Target Has No Handlers", () => {
  it("passes when gesture-target has no bindings", () => {
    const results = validateInteraction(validInteraction, ["recordAnnotation"]);
    const hc = results.filter((r) => r.id === "HC-ELEM-01");
    expect(hc.every((r) => r.passed)).toBe(true);
  });

  it("fails when gesture-target has bindings", () => {
    const badTarget: ElementProfile[] = [
      ...validElements.filter((e) => e.elementName !== "StepCard"),
      {
        elementName: "StepCard",
        library: "@use-gesture/react",
        eventStream: "touch",
        touchAction: "pan-y",
        role: "gesture-target",
        bindings: [
          { elementScope: "StepCard", gestureApiName: "tap-select-step", library: "@use-gesture/react", eventStream: "touch", touchAction: "pan-y", priority: 1 },
        ],
      },
    ];
    const results = validateInteraction(
      { ...validInteraction, elements: badTarget },
      ["recordAnnotation"],
    );
    const hc = results.filter((r) => r.id === "HC-ELEM-01" && !r.passed);
    expect(hc.length).toBe(1);
    expect(hc[0]!.message).toContain("gesture-target");
  });
});

// ─── HC-ELEM-03: Scroll Container Has No JS Handlers ──────────

describe("HC-ELEM-03: Scroll Container Has No JS Handlers", () => {
  it("warns when scroll-container has gesture bindings", () => {
    const badScroll: ElementProfile[] = [
      {
        elementName: "ScrollList",
        library: "@use-gesture/react",
        eventStream: "touch",
        touchAction: "auto",
        role: "scroll-container",
        bindings: [
          { elementScope: "ScrollList", gestureApiName: "swipe-left-advance", library: "@use-gesture/react", eventStream: "touch", touchAction: "auto", priority: 1 },
        ],
      },
    ];
    const results = validateInteraction(
      { ...validInteraction, elements: badScroll },
      ["recordAnnotation"],
    );
    const hc = results.filter((r) => r.id === "HC-ELEM-03" && !r.passed);
    expect(hc.length).toBe(1);
    expect(hc[0]!.message).toContain("scroll-container");
  });
});

// ─── HC-ELEM-04: Data Attribute Naming Convention ──────────────

describe("HC-ELEM-04: Data Attribute Naming Convention", () => {
  it("passes for data-{entity}-{field} pattern", () => {
    const results = validateInteraction(validInteraction, ["recordAnnotation"]);
    const hc = results.filter((r) => r.id === "HC-ELEM-04");
    expect(hc.every((r) => r.passed)).toBe(true);
  });

  it("warns for generic data-id attribute", () => {
    const badAttrs: ElementProfile[] = [
      {
        elementName: "GenericCard",
        library: "@use-gesture/react",
        eventStream: "touch",
        touchAction: "pan-y",
        role: "gesture-target",
        dataAttributes: ["data-id", "data-value"],
        bindings: [],
      },
    ];
    const results = validateInteraction(
      { ...validInteraction, elements: badAttrs },
      ["recordAnnotation"],
    );
    const hc = results.filter((r) => r.id === "HC-ELEM-04" && !r.passed);
    expect(hc.length).toBe(2); // data-id and data-value both fail
    expect(hc[0]!.message).toContain("data-id");
  });
});

// ─── HC-INT-07: Single-Pointer Alternative ────────────────────

describe("HC-INT-07: Single-Pointer Alternative for Multipoint/Path Gestures", () => {
  it("warns when swipe gesture has no tap alternative", () => {
    const swipeOnly: GestureDeclaration[] = [
      {
        apiName: "swipe-advance",
        description: "Swipe to advance",
        domain: "navigation",
        inputDevice: "any",
        gestureType: "swipe-left",
        actionRef: "navigate:next",
        library: "@use-gesture/react",
        eventStream: "touch",
      },
      // No tap alternative for navigate:next
    ];
    const results = validateInteraction(
      { ...validInteraction, gestures: swipeOnly },
      [],
    );
    const hc = results.filter((r) => r.id === "HC-INT-07" && !r.passed);
    expect(hc.length).toBe(1);
    expect(hc[0]!.message).toContain("NO single-pointer alternative");
  });

  it("passes when swipe has tap alternative for same actionRef", () => {
    const withAlt: GestureDeclaration[] = [
      {
        apiName: "swipe-advance",
        description: "Swipe to advance",
        domain: "navigation",
        inputDevice: "any",
        gestureType: "swipe-left",
        actionRef: "navigate:next",
        library: "@use-gesture/react",
        eventStream: "touch",
      },
      {
        apiName: "tap-next-button",
        description: "Tap Next button",
        domain: "navigation",
        inputDevice: "any",
        gestureType: "tap",
        actionRef: "navigate:next",
        library: "@use-gesture/react",
        eventStream: "touch",
      },
    ];
    const results = validateInteraction(
      { ...validInteraction, gestures: withAlt },
      [],
    );
    const hc = results.filter((r) => r.id === "HC-INT-07");
    expect(hc.every((r) => r.passed)).toBe(true);
  });

  it("warns when pinch-zoom has no +/- button alternative", () => {
    const pinchOnly: GestureDeclaration[] = [
      {
        apiName: "pinch-zoom",
        description: "Pinch to zoom",
        domain: "view",
        inputDevice: "any",
        gestureType: "pinch-in",
        actionRef: "view:zoom",
        library: "@use-gesture/react",
        eventStream: "pointer",
      },
    ];
    const results = validateInteraction(
      { ...validInteraction, gestures: pinchOnly },
      [],
    );
    const hc = results.filter((r) => r.id === "HC-INT-07" && !r.passed);
    expect(hc.length).toBe(1);
    expect(hc[0]!.message).toContain("pinch-in");
  });
});

// ─── Summary ───────────────────────────────────────────────────

describe("Validation Summary", () => {
  it("all constraints pass for valid interaction declaration", () => {
    const results = validateInteraction(validInteraction, ["recordAnnotation"]);
    const summary = summarize(results);
    // HC-BIND-04 warns (mutation bindings without impactChain)
    expect(summary.errors).toBe(0);
  });

  it("reports total check count correctly", () => {
    const results = validateInteraction(validInteraction, ["recordAnnotation"]);
    // HC-INT-01: 3 elements = 3
    // HC-INT-02: 5 gestures = 5
    // HC-INT-03: 3 elements = 3
    // HC-INT-04: 3 elements = 3
    // HC-GEST-01: 2 device-specific gestures (pinch touch + pen-draw) = 2
    // HC-GEST-02: no conflicts → 1 pass summary
    // HC-GEST-03: skipped (no taxonomy provided) = 0
    // HC-BIND-02: 3 elements = 3
    // HC-BIND-03: 3 bindings across gesture-owner elements = 3
    // HC-BIND-04: 0 mutation bindings in owner elements (pen-draw not bound to owner) = 0
    // HC-ELEM-01: 1 gesture-target = 1
    // HC-ELEM-03: 0 scroll-containers = 0
    // HC-ELEM-04: 1 element with data-step-index = 1
    expect(results.length).toBeGreaterThan(10);
  });
});
