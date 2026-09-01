/**
 * GrinRex Resin — customer design model for the Design-Your-Own studio.
 * A design is a serializable spec: base shape, effect, inclusions, cast text, finish,
 * packaging. The same spec powers the SVG preview, the pricing guardrail, cart lines,
 * saved designs, and order snapshots.
 */
import type { Quote, QuoteInput } from "@/lib/costing";
import { computeQuote, defaultQuoteInput } from "@/lib/costing";

export type DesignShape = "circle" | "square" | "hex" | "tablet" | "heart" | "droplet";
export type DesignSize = "S" | "M" | "L" | "XL";
export type EffectPreset = "clear" | "sunset" | "ocean" | "marble" | "glitter" | "galaxy";
export type InclusionKind = "petal" | "leaf" | "foil" | "bead" | "star" | "butterfly" | "ring";
export type Finish = "gloss" | "matte";
export type Packaging = "standard" | "gift" | "premium";
export type TextFont = "serif" | "script" | "sans";

export type DesignInclusion = {
  id: string;
  kind: InclusionKind;
  x: number; // 0–100 % of canvas
  y: number;
  rot: number; // degrees
  scale: number; // 0.6–1.8
};

export type Design = {
  id: string;
  name: string;
  createdAt: string;
  shape: DesignShape;
  size: DesignSize;
  effect: EffectPreset;
  tint: string; // hex
  accent: string; // hex (inclusions + details)
  inclusions: DesignInclusion[];
  text: string;
  textFont: TextFont;
  textSize: "sm" | "md" | "lg";
  textColor: "chalk" | "ink" | "amber";
  finish: Finish;
  packaging: Packaging;
  rush: boolean;
  careCard: boolean;
  quantity: number;
  note: string; // studio brief — colors, occasion, who it is for
};

export const uid = () => Math.random().toString(36).slice(2, 10);

export const shapeLabels: Record<DesignShape, string> = {
  circle: "Round cast",
  square: "Square coaster",
  hex: "Hexagon dish",
  tablet: "Name plate",
  heart: "Heart keepsake",
  droplet: "Pendant drop",
};

export const sizeLabels: Record<DesignSize, string> = {
  S: "Small · ~5 cm",
  M: "Medium · ~8 cm",
  L: "Large · ~12 cm",
  XL: "Statement · ~16 cm",
};

export const effectLabels: Record<EffectPreset, string> = {
  clear: "Clear pour",
  sunset: "Amber sunset",
  ocean: "Mineral ocean",
  marble: "Sage marble",
  glitter: "Gold glitter",
  galaxy: "Ink galaxy",
};

export const paletteSwatches = [
  { label: "Cast honey", value: "#d9983a" },
  { label: "Blush petal", value: "#d9a08f" },
  { label: "Dried sage", value: "#9eaa87" },
  { label: "Chalk", value: "#f6f0e7" },
  { label: "Rose quartz", value: "#c98d9b" },
  { label: "Deep ink", value: "#2f3430" },
  { label: "Amber cream", value: "#e8c48f" },
  { label: "Terracotta", value: "#b0674a" },
];

export const inclusionTools: { kind: InclusionKind; label: string }[] = [
  { kind: "petal", label: "Petal" },
  { kind: "leaf", label: "Leaf" },
  { kind: "foil", label: "Gold foil" },
  { kind: "bead", label: "Bead" },
  { kind: "star", label: "Star" },
  { kind: "butterfly", label: "Butterfly" },
  { kind: "ring", label: "Ring" },
];

export function newDesign(): Design {
  return {
    id: uid(),
    name: "Untitled pour",
    createdAt: new Date().toISOString(),
    shape: "circle",
    size: "M",
    effect: "sunset",
    tint: "#d9983a",
    accent: "#f6f0e7",
    inclusions: [
      { id: uid(), kind: "petal", x: 38, y: 40, rot: 24, scale: 1 },
      { id: uid(), kind: "leaf", x: 58, y: 52, rot: -18, scale: 0.9 },
      { id: uid(), kind: "foil", x: 47, y: 30, rot: 40, scale: 0.8 },
    ],
    text: "",
    textFont: "serif",
    textSize: "md",
    textColor: "chalk",
    finish: "gloss",
    packaging: "gift",
    rush: false,
    careCard: true,
    quantity: 1,
    note: "",
  };
}

export function designDisplayName(design: Design): string {
  const trimmed = design.text.trim();
  const base = `${effectLabels[design.effect]} ${shapeLabels[design.shape].toLowerCase()}`;
  return trimmed ? `${base} · “${trimmed}”` : base;
}

// ---------------------------------------------------------------------------
// Design → costing. Keeps the store honest: everything flows through the same
// pricing guardrail used by the chapters and demos.
// ---------------------------------------------------------------------------
const MATERIAL_BY_SIZE: Record<DesignSize, number> = { S: 18, M: 35, L: 70, XL: 130 };
const LABOR_MINUTES_BY_SIZE: Record<DesignSize, number> = { S: 20, M: 30, L: 45, XL: 60 };
const AMORTIZATION_BY_SIZE: Record<DesignSize, number> = { S: 4, M: 6, L: 9, XL: 14 };
const PACKAGING_COST: Record<Packaging, number> = { standard: 12, gift: 40, premium: 85 };

export function designQuoteInput(design: Design): QuoteInput {
  const hasText = design.text.trim().length > 0;
  const materialCost =
    MATERIAL_BY_SIZE[design.size] +
    design.inclusions.length * 4 +
    (hasText ? 8 : 0) +
    (design.effect === "clear" ? 0 : 10);
  const laborMinutes =
    LABOR_MINUTES_BY_SIZE[design.size] +
    design.inclusions.length * 4 +
    (hasText ? 15 : 0) +
    (design.effect === "marble" || design.effect === "galaxy" ? 10 : 0) +
    (design.rush ? 20 : 0);
  return {
    ...defaultQuoteInput,
    materialCost,
    packagingCost: PACKAGING_COST[design.packaging] + (design.careCard ? 8 : 0),
    laborMinutes,
    toolAmortization: AMORTIZATION_BY_SIZE[design.size],
    personalizationFee: hasText ? 60 : 0,
    quantity: Math.max(1, design.quantity),
  };
}

export function designQuote(design: Design): { input: QuoteInput; quote: Quote } {
  const input = designQuoteInput(design);
  return { input, quote: computeQuote(input) };
}

// ---------------------------------------------------------------------------
// Saved designs (browser storage — the customer's own library)
// ---------------------------------------------------------------------------
const DESIGNS_KEY = "grinrex-designs-v1";

export function readDesigns(): Design[] {
  try {
    const raw = localStorage.getItem(DESIGNS_KEY);
    return raw ? (JSON.parse(raw) as Design[]) : [];
  } catch {
    return [];
  }
}

export function writeDesigns(designs: Design[]) {
  try {
    localStorage.setItem(DESIGNS_KEY, JSON.stringify(designs.slice(0, 60)));
  } catch {
    /* storage unavailable */
  }
}

export function saveDesign(design: Design): Design[] {
  const others = readDesigns().filter((item) => item.id !== design.id);
  const next = [{ ...design, createdAt: new Date().toISOString() }, ...others];
  writeDesigns(next);
  return next;
}

export function deleteDesign(id: string): Design[] {
  const next = readDesigns().filter((item) => item.id !== id);
  writeDesigns(next);
  return next;
}

export function findDesign(id: string): Design | undefined {
  return readDesigns().find((design) => design.id === id);
}
