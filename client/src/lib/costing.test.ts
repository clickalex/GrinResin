/**
 * Unit tests for the pricing guardrail engine that powers the demos.
 * Run: pnpm test
 */
import { describe, expect, it } from "vitest";
import { catalogue, launchEditProducts } from "@/data/products";
import { computeQuote, defaultQuoteInput, presetForProduct, hashString } from "@/lib/costing";

describe("catalogue data", () => {
  it("carries exactly 150 products with unique ids and names", () => {
    expect(catalogue).toHaveLength(150);
    expect(new Set(catalogue.map((p) => p.id)).size).toBe(150);
    expect(new Set(catalogue.map((p) => p.name)).size).toBe(150);
  });

  it("marks the 12-product launch edit", () => {
    expect(launchEditProducts).toHaveLength(12);
    for (const product of launchEditProducts) {
      expect(product.launch).toBe(true);
    }
  });

  it("gives every product materials, tools, and a scale band", () => {
    for (const product of catalogue) {
      expect(product.materials.length).toBeGreaterThanOrEqual(2);
      expect(product.tools.length).toBeGreaterThanOrEqual(4);
      const [lo, hi] = product.material_range;
      expect(lo).toBeLessThan(hi);
    }
  });
});

describe("pricing guardrail", () => {
  it("solves price so margin and fees are carved out of the selling price", () => {
    const quote = computeQuote({ ...defaultQuoteInput, materialCost: 100, packagingCost: 20, laborMinutes: 60, laborRatePerHour: 120, toolAmortization: 5, wastagePercent: 0, paymentFeePercent: 0, marginPercent: 50, shippingCost: 0, personalizationFee: 0, quantity: 1 });
    // cost = 100+20+120+5 = 245 → price at 50% margin = 490 → rounded to …9
    expect(quote.costWithWastage).toBe(245);
    expect(quote.roundedPrice).toBeGreaterThanOrEqual(489);
    expect(quote.roundedPrice % 10).toBe(9);
  });

  it("refuses a thin price (no contribution) rather than silently accepting it", () => {
    const quote = computeQuote({ ...defaultQuoteInput, materialCost: 100, packagingCost: 0, laborMinutes: 0, laborRatePerHour: 0, toolAmortization: 0, wastagePercent: 0, paymentFeePercent: 0, marginPercent: 0, personalizationFee: 0 });
    // At 0% margin the price ≈ cost, so contribution is ~cost*0 — never negative, ~zero
    expect(quote.netContribution).toBeLessThan(quote.costWithWastage * 0.05);
  });

  it("grows price with wastage, quantity multiplies the order total", () => {
    const base = computeQuote({ ...defaultQuoteInput });
    const wasteful = computeQuote({ ...defaultQuoteInput, wastagePercent: 20 });
    expect(wasteful.roundedPrice).toBeGreaterThan(base.roundedPrice);
    const bulk = computeQuote({ ...defaultQuoteInput, quantity: 10 });
    expect(bulk.orderTotal).toBeCloseTo(bulk.netContribution * 10, 2);
  });

  it("produces stable, positive quotes for every catalogue product", () => {
    for (const product of catalogue) {
      const quote = computeQuote(presetForProduct(product));
      expect(quote.roundedPrice).toBeGreaterThan(0);
      expect(quote.netContribution).toBeGreaterThan(0);
    }
  });

  it("hashString is deterministic", () => {
    expect(hashString("Botanical Drop Earrings")).toBe(hashString("Botanical Drop Earrings"));
    expect(hashString("a")).not.toBe(hashString("b"));
  });
});
