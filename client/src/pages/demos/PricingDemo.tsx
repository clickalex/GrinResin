/**
 * Working demo — the pricing guardrail: material + labor + packaging + overhead + fees + profit.
 * Reads ?p=<product id> from the catalogue browser so any SKU can be costed directly.
 */
import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Check } from "lucide-react";
import DemoShell from "./DemoShell";
import { catalogue, scaleBands, type ProductScale } from "@/data/products";
import { computeQuote, defaultQuoteInput, formatINR, presetForProduct, type QuoteInput } from "@/lib/costing";

function NumberField({ label, hint, value, min, max, step = 1, suffix = "₹", onChange }: {
  label: string; hint?: string; value: number; min: number; max: number; step?: number; suffix?: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="calc-field">
      <span>{label}{hint && <em>{hint}</em>}</span>
      <span className="calc-input">
        {suffix === "₹" && <i>₹</i>}
        <input type="number" inputMode="decimal" min={min} max={max} step={step} value={value}
          onChange={(event) => { const next = Number(event.target.value); if (!Number.isNaN(next)) onChange(Math.min(max, Math.max(min, next))); }} />
        {suffix === "%" && <i>%</i>}
      </span>
      <input className="calc-slider" type="range" min={min} max={max} step={step} value={Math.min(max, value)}
        onChange={(event) => onChange(Number(event.target.value))} aria-label={`${label} slider`} />
    </label>
  );
}

export default function PricingDemo() {
  const initial = useMemo(() => {
    const param = new URLSearchParams(window.location.search).get("p");
    const product = param ? catalogue.find((item) => item.id === Number(param)) : undefined;
    return { product, input: product ? presetForProduct(product) : { ...defaultQuoteInput } };
  }, []);

  const [productId, setProductId] = useState<number | null>(initial.product?.id ?? null);
  const [input, setInput] = useState<QuoteInput>(initial.input);
  const [touched, setTouched] = useState(Boolean(initial.product));

  useEffect(() => {
    if (productId === null) return;
    const product = catalogue.find((item) => item.id === productId);
    if (product && !touched) setInput(presetForProduct(product));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const quote = computeQuote(input);
  const set = (patch: Partial<QuoteInput>) => { setInput((current) => ({ ...current, ...patch })); setTouched(true); };
  const applyScale = (scale: ProductScale) => {
    const [lo, hi] = scaleBands[scale];
    set({ materialCost: Math.round((lo + hi) / 2) });
  };

  const thin = quote.netContribution <= 0;
  const warnings: string[] = [];
  if (thin) warnings.push("This price does not cover cost and fees. The guardrail refuses it — raise the price or cut spend.");
  if (input.marginPercent + input.paymentFeePercent >= 95) warnings.push("Margin + fees approach 95% of price; the formula caps out there.");
  if (input.wastagePercent > 15) warnings.push("Wastage above 15% usually means the pour recipe or cure conditions need work before pricing does.");
  if (input.laborMinutes > 180) warnings.push("Over 3 bench hours per unit is a scheduling decision as much as a pricing one.");

  return (
    <DemoShell
      className="demo-pricing"
      intro="Costing method · the source guardrail, live"
      title={<>Price the way<br /><em>the studio works.</em></>}
      next={{ href: "/demos/order", label: "Turn a quote into an order" }}
    >
      <div className="pricing-grid">
        <div className="calc-panel reveal">
          <div className="calc-product">
            <label htmlFor="calc-select">Cost a catalogue piece</label>
            <select id="calc-select" value={productId ?? ""} onChange={(event) => {
              const value = event.target.value ? Number(event.target.value) : null;
              setProductId(value);
              const product = value ? catalogue.find((item) => item.id === value) : undefined;
              setInput(product ? presetForProduct(product) : { ...defaultQuoteInput });
              setTouched(false);
            }}>
              <option value="">Custom piece — set every component</option>
              {catalogue.map((product) => <option key={product.id} value={product.id}>{String(product.id).padStart(3, "0")} · {product.name}{product.launch ? " ★" : ""}</option>)}
            </select>
          </div>
          <div className="scale-presets">
            <span>Material band presets</span>
            {(Object.keys(scaleBands) as ProductScale[]).map((scale) => (
              <button key={scale} className="chip" onClick={() => applyScale(scale)}>
                {scale} · ₹{scaleBands[scale][0]}–₹{scaleBands[scale][1]}{scale === "premium" ? "+" : ""}
              </button>
            ))}
          </div>
          <div className="calc-fields">
            <NumberField label="Resin, pigments & inclusions" value={input.materialCost} min={0} max={5000} onChange={(v) => set({ materialCost: v })} />
            <NumberField label="Gift packaging" value={input.packagingCost} min={0} max={500} onChange={(v) => set({ packagingCost: v })} />
            <NumberField label="Bench labor" hint={`${Math.round((input.laborMinutes / 60) * input.laborRatePerHour)} ₹ cost`} value={input.laborMinutes} min={0} max={480} suffix="min" onChange={(v) => set({ laborMinutes: v })} />
            <NumberField label="Labor rate" value={input.laborRatePerHour} min={40} max={600} suffix="₹/h" onChange={(v) => set({ laborRatePerHour: v })} />
            <NumberField label="Tool amortization" hint="per unit" value={input.toolAmortization} min={0} max={100} onChange={(v) => set({ toolAmortization: v })} />
            <NumberField label="Wastage allowance" value={input.wastagePercent} min={0} max={30} suffix="%" onChange={(v) => set({ wastagePercent: v })} />
            <NumberField label="Payment fee" value={input.paymentFeePercent} min={0} max={10} step={0.25} suffix="%" onChange={(v) => set({ paymentFeePercent: v })} />
            <NumberField label="Target margin" value={input.marginPercent} min={0} max={80} suffix="%" onChange={(v) => set({ marginPercent: v })} />
            <NumberField label="Personalization surcharge" value={input.personalizationFee} min={0} max={1000} onChange={(v) => set({ personalizationFee: v })} />
            <NumberField label="Order quantity" value={input.quantity} min={1} max={100} suffix="×" onChange={(v) => set({ quantity: v })} />
          </div>
        </div>

        <div className="quote-sheet reveal" aria-live="polite">
          <div className="quote-sheet-top"><span>SKU evidence card</span><em>{productId ? `${String(productId).padStart(3, "0")} · ${catalogue.find((item) => item.id === productId)?.name}` : "Custom piece"}</em></div>
          <table className="quote-table">
            <tbody>
              {quote.lines.map((line) => (
                <tr key={line.label}><td>{line.label}{line.note && <em>{line.note}</em>}</td><td>{formatINR(line.amount)}</td></tr>
              ))}
            </tbody>
          </table>
          <div className="contribution-bar" title="Unit cost vs. fee vs. contribution">
            <div className="bar-cost" style={{ width: `${Math.min(100, (quote.costWithWastage / Math.max(quote.roundedPrice, 1)) * 100)}%` }} />
            <div className="bar-fee" style={{ width: `${Math.min(100, (quote.paymentFee / Math.max(quote.roundedPrice, 1)) * 100)}%` }} />
            <div className="bar-profit" style={{ width: `${Math.max(0, Math.min(100, 100 - (quote.costWithWastage / Math.max(quote.roundedPrice, 1)) * 100 - (quote.paymentFee / Math.max(quote.roundedPrice, 1)) * 100))}%` }} />
          </div>
          <p className="bar-legend"><span className="dot dot-cost">Unit cost {formatINR(quote.costWithWastage)}</span><span className="dot dot-fee">Fee {formatINR(quote.paymentFee)}</span><span className="dot dot-profit">Contribution {formatINR(quote.netContribution)}</span></p>
          <div className="quote-total">
            <div><span>Suggested price</span><strong>{formatINR(quote.roundedPrice)}</strong></div>
            <div><span>Contribution</span><strong>{quote.contributionPercent.toFixed(1)}%</strong></div>
            <div><span>{input.quantity}× order total</span><strong>{formatINR(quote.roundedPrice * input.quantity)}</strong></div>
          </div>
          {thin ? (
            <p className="guard-note is-bad"><AlertTriangle size={14} /> Guardrail refused — price below break-even.</p>
          ) : (
            <p className="guard-note is-ok"><Check size={14} /> Guardrail passed — cost, wastage, fees, and margin all carry.</p>
          )}
          {warnings.map((warning) => <p className="guard-note is-warn" key={warning}><AlertTriangle size={14} /> {warning}</p>)}
          <p className="quote-foot">All figures ₹ per unit. Demo inputs derived from the source planning ranges — recompute with real supplier quotations before selling.</p>
        </div>
      </div>
    </DemoShell>
  );
}
