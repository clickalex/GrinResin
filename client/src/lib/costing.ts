/**
 * GrinRex Resin — pricing guardrail engine.
 * Implements the source formula: material + labor + packaging + overhead + fees + profit.
 * All values are ₹ per unit unless noted. Figures are demo planning inputs, not quotations.
 */
import type { CatalogueProduct, ProductScale } from "@/data/products";

export type QuoteInput = {
  /** Material spend for this piece (resin, hardener, pigments, inclusions, hardware). */
  materialCost: number;
  /** Gift box, insert cards, wrap. */
  packagingCost: number;
  /** Bench minutes for mixing, pouring, finishing, and QC time. */
  laborMinutes: number;
  /** Studio labor rate per hour. */
  laborRatePerHour: number;
  /** Per-unit share of bench tool cost (scale, molds, drill, lamp…). */
  toolAmortization: number;
  /** Rejected-pour allowance, percent of base cost. */
  wastagePercent: number;
  /** UPI/gateway fee, percent of the selling price. */
  paymentFeePercent: number;
  /** Target margin, percent of the selling price. */
  marginPercent: number;
  /** Per-unit shipping absorbed by the brand (0 when the buyer pays). */
  shippingCost: number;
  /** Personalization surcharge added to the price directly. */
  personalizationFee: number;
  /** Piece count for the order. */
  quantity: number;
};

export type QuoteLine = { label: string; amount: number; note?: string };

export type Quote = {
  lines: QuoteLine[];
  baseCost: number;
  costWithWastage: number;
  priceBeforeFees: number;
  unitPrice: number;
  roundedPrice: number;
  paymentFee: number;
  netContribution: number;
  contributionPercent: number;
  orderTotal: number;
  orderContribution: number;
};

export const defaultQuoteInput: QuoteInput = {
  materialCost: 60,
  packagingCost: 25,
  laborMinutes: 40,
  laborRatePerHour: 120,
  toolAmortization: 6,
  wastagePercent: 8,
  paymentFeePercent: 2,
  marginPercent: 45,
  shippingCost: 0,
  personalizationFee: 50,
  quantity: 1,
};

const LABOR_COST_BY_SCALE: Record<ProductScale, [number, number]> = {
  small: [15, 30],
  medium: [30, 55],
  large: [50, 90],
  premium: [90, 180],
};

/** Deterministic string hash so demo figures are stable across reloads. */
export function hashString(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash);
}

function between(seed: number, [lo, hi]: [number, number]): number {
  return Math.round(lo + (seed % 1000) / 999 * (hi - lo));
}

/** Stable demo costing for a catalogue product (mid-band materials by design). */
export function presetForProduct(product: CatalogueProduct): QuoteInput {
  const seed = hashString(product.name);
  const [bandLo, bandHi] = product.material_range;
  const materialCost = product.launch ? Math.round(((bandLo + bandHi) / 2) / 5) * 5 : between(seed, [bandLo, bandHi]);
  const laborMinutes = between(seed >> 3, LABOR_COST_BY_SCALE[product.scale]);
  return {
    ...defaultQuoteInput,
    materialCost,
    laborMinutes,
    packagingCost: between(seed >> 5, product.scale === "premium" || product.scale === "large" ? [35, 70] : [12, 35]),
    toolAmortization: product.scale === "premium" ? 12 : product.scale === "large" ? 9 : product.scale === "medium" ? 6 : 4,
    personalizationFee: /name|initial|monogram|photo|portrait|lyric|quote|date|coordinate|logo|plaque|plate/i.test(product.name) ? 60 : 0,
  };
}

export function computeQuote(input: QuoteInput): Quote {
  const laborCost = Math.round((input.laborMinutes / 60) * input.laborRatePerHour * 100) / 100;
  const baseCost =
    input.materialCost + input.packagingCost + laborCost + input.toolAmortization + input.shippingCost;
  const wastageAmount = baseCost * (input.wastagePercent / 100);
  const costWithWastage = baseCost + wastageAmount;

  // margin and fees are percentages of the selling price → divide to solve.
  const marginAndFees = Math.min(95, input.marginPercent + input.paymentFeePercent);
  const priceBeforeFees = costWithWastage / (1 - marginAndFees / 100) + input.personalizationFee;
  const unitPrice = Math.round(priceBeforeFees);
  const roundedPrice = Math.max(5, Math.ceil(unitPrice / 5) * 5 - 1); // gallery-tidy ₹…9 price point

  const paymentFee = roundedPrice * (input.paymentFeePercent / 100);
  const netContribution = roundedPrice - costWithWastage - paymentFee;
  const quantity = Math.max(1, Math.round(input.quantity));

  const lines: QuoteLine[] = [
    { label: "Resin, pigments & inclusions", amount: input.materialCost, note: "SKU material spend" },
    { label: "Gift packaging", amount: input.packagingCost },
    { label: "Labor", amount: laborCost, note: `${input.laborMinutes} bench minutes @ ₹${input.laborRatePerHour}/h` },
    { label: "Tool amortization", amount: input.toolAmortization, note: "Per-unit share of the bench" },
    { label: "Wastage allowance", amount: Math.round(wastageAmount * 100) / 100, note: `${input.wastagePercent}% of base cost` },
  ];
  if (input.shippingCost > 0) lines.push({ label: "Shipping absorbed", amount: input.shippingCost });
  if (input.personalizationFee > 0) lines.push({ label: "Personalization surcharge", amount: input.personalizationFee, note: "Priced on top of the base piece" });

  return {
    lines,
    baseCost: round2(baseCost),
    costWithWastage: round2(costWithWastage),
    priceBeforeFees: round2(priceBeforeFees),
    unitPrice,
    roundedPrice,
    paymentFee: round2(paymentFee),
    netContribution: round2(netContribution),
    contributionPercent: roundedPrice > 0 ? round2((netContribution / roundedPrice) * 100) : 0,
    orderTotal: round2(roundedPrice * quantity),
    orderContribution: round2(netContribution * quantity),
  };
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function formatINR(value: number): string {
  return `₹${value.toLocaleString("en-IN", { maximumFractionDigits: value % 1 === 0 ? 0 : 2, minimumFractionDigits: value % 1 === 0 ? 0 : 2 })}`;
}
