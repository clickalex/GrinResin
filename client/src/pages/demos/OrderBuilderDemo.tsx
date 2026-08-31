/**
 * Working demo — the custom order builder. The enquiry validates like the studio’s
 * WhatsApp flow, prices through the guardrail, saves a trackable order, and exports a
 * one-page quote sheet you can download.
 */
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowRight, Check, Download } from "lucide-react";
import DemoShell from "./DemoShell";
import { catalogue, launchEditProducts } from "@/data/products";
import { computeQuote, formatINR, presetForProduct, type QuoteInput } from "@/lib/costing";
import { nextRef, saveOrder, type DemoOrder } from "@/lib/orders";

const occasions = ["Birthday", "Wedding / anniversary", "New job or achievement", "Memorial", "Corporate gifting", "Just because"] as const;
const inclusionKeys = ["botanicals", "foil", "photo", "box", "care"] as const;
type InclusionOption = { key: (typeof inclusionKeys)[number]; label: string; material?: number; packaging?: number };
const inclusionOptions: InclusionOption[] = [
  { key: "botanicals", label: "Dried botanicals", material: 40 },
  { key: "foil", label: "Gold foil detail", material: 30 },
  { key: "photo", label: "Photo under clear face", material: 50 },
  { key: "box", label: "Rigid gift box + ribbon", packaging: 85 },
  { key: "care", label: "Care card & polish cloth", packaging: 15 },
];

const schema = z.object({
  productId: z.coerce.number().int().positive("Choose a base piece."),
  personalization: z.string().trim().min(2, "A name, date, or line — even two characters.").max(80, "Keep it under 80 characters — resin is unforgiving of small type."),
  occasion: z.enum(occasions),
  inclusions: z.array(z.enum(inclusionKeys)).default([]),
  rush: z.boolean().default(false),
  quantity: z.coerce.number().int().min(1).max(100),
  name: z.string().trim().min(2, "Who is the proof addressed to?").max(60),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, "A 10-digit Indian mobile number — proof goes over WhatsApp."),
  city: z.string().trim().min(2, "City for the shipping note."),
  date: z.string().optional(),
  notes: z.string().trim().max(240, "Short brief, please — the long version lives in the proof.").optional(),
});

type FormValues = z.input<typeof schema>;

const popular = [...launchEditProducts, ...catalogue.filter((p) => [42, 77, 106, 119, 136, 128].includes(p.id))];

export default function OrderBuilderDemo() {
  const initial = useMemo(() => {
    const param = new URLSearchParams(window.location.search).get("p");
    return param ? Number(param) : popular[0].id;
  }, []);

  const [placed, setPlaced] = useState<DemoOrder | null>(null);
  const [sheet, setSheet] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { productId: initial, personalization: "", occasion: undefined as never, inclusions: [], rush: false, quantity: 1, name: "", phone: "", city: "", date: "", notes: "" },
  });

  const watch = form.watch();
  const product = catalogue.find((item) => item.id === Number(watch.productId)) ?? popular[0];
  const minDate = new Date(Date.now() + 4 * 86_400_000).toISOString().slice(0, 10);

  const quoteInput: QuoteInput = useMemo(() => {
    const base = presetForProduct(product);
    let materialCost = base.materialCost;
    let packagingCost = base.packagingCost;
    let laborMinutes = base.laborMinutes;
    let personalizationFee = 60;
    for (const key of watch.inclusions ?? []) {
      const option = inclusionOptions.find((item) => item.key === key);
      materialCost += option?.material ?? 0;
      packagingCost += option?.packaging ?? 0;
    }
    if (watch.rush) laborMinutes += 20; // overnight scheduling + priority bench slot
    if ((watch.personalization ?? "").trim().length > 40) laborMinutes += 10; // tight typesetting
    return { ...base, materialCost, packagingCost, laborMinutes, personalizationFee, quantity: Math.max(1, Number(watch.quantity) || 1) };
  }, [product, watch.inclusions, watch.rush, watch.quantity, watch.personalization]);

  const quote = computeQuote(quoteInput);

  const buildSheet = (ref: string | "DRAFT") => {
    const chosen = (watch.inclusions ?? []).map((key) => inclusionOptions.find((item) => item.key === key)?.label ?? key);
    return [
      `GRINREX RESIN — QUOTE SHEET (${ref})`,
      `${"─".repeat(46)}`,
      `Base piece     ${String(product.id).padStart(3, "0")} · ${product.name}`,
      `Family         ${product.family} (${product.scale} band)`,
      `Personalize    ${watch.personalization || "—"}`,
      `Occasion       ${watch.occasion || "—"}`,
      `Inclusions     ${chosen.length ? chosen.join(", ") : "none"}`,
      `Rush window    ${watch.rush ? "yes — priority bench slot" : "no"}`,
      `Quantity       ${quoteInput.quantity}`,
      ``,
      `Cost structure per unit`,
      ...quote.lines.map((line) => `  ${line.label.padEnd(30, " ")} ${formatINR(line.amount)}`),
      ``,
      `Suggested unit price      ${formatINR(quote.roundedPrice)}`,
      `Order total (${quoteInput.quantity}×)        ${formatINR(quote.roundedPrice * quoteInput.quantity)}`,
      `Net contribution          ${formatINR(quote.netContribution)} / unit (${quote.contributionPercent.toFixed(1)}%)`,
      ``,
      `Customer       ${watch.name || "—"} · ${watch.phone || "—"} · ${watch.city || "—"}`,
      `Needed by      ${watch.date || "flexible"}`,
      `Brief          ${watch.notes || "—"}`,
      ``,
      `Demo document — figures follow the studio's source pricing guardrail.`,
      `No payment or personal data leaves this browser.`,
    ].join("\n");
  };

  const downloadSheet = (text: string, ref: string) => {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = window.document.createElement("a");
    anchor.href = url;
    anchor.download = `grinrex-quote-${ref.toLowerCase()}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const onSubmit = form.handleSubmit((values) => {
    const order: DemoOrder = {
      ref: nextRef(),
      placedAt: new Date().toISOString(),
      channel: "custom-quote",
      customer: values.name.trim(),
      city: values.city.trim(),
      notes: values.notes?.trim() || (values.rush ? "Rush window requested." : undefined),
      total: quote.roundedPrice * quoteInput.quantity,
      items: [{
        productId: product.id,
        name: product.name,
        personalization: values.personalization.trim(),
        quantity: quoteInput.quantity,
        unitPrice: quote.roundedPrice,
      }],
    };
    saveOrder(order);
    setPlaced(order);
    setSheet(buildSheet(order.ref));
  });

  if (placed) {
    return (
      <DemoShell className="demo-order" intro="Custom order builder · brief received"
        title={<>Brief locked.<br /><em>Proof is next.</em></>}>
        <div className="success-card wide reveal">
          <span className="success-mark"><Check size={22} /></span>
          <h3>Studio reference {placed.ref}</h3>
          <p>{quoteInput.quantity}× {product.name}{placed.items[0].personalization ? ` · “${placed.items[0].personalization}”` : ""} — {formatINR(placed.total)}</p>
          <p className="success-note">
            In the real flow, {placed.customer.split(" ")[0]} would get a layout proof on WhatsApp within 24 hours; nothing moves to the bench until it is approved.
            This demo stops at the same place: no payment, no message sent.
          </p>
          <div className="success-actions">
            <button className="text-button dark-text" onClick={() => setSheet(sheet)}><Download size={15} /> View quote sheet</button>
            <button className="text-button dark-text" onClick={() => sheet && downloadSheet(sheet, placed.ref)}><Download size={15} /> Download .txt</button>
            <Link className="amber-button" href={`/demos/track?ref=${placed.ref}`}>Track this order <ArrowRight size={15} /></Link>
          </div>
          {sheet && <pre className="quote-pre">{sheet}</pre>}
          <button className="text-button" onClick={() => { setPlaced(null); setSheet(null); form.reset(); }}>Start another order</button>
        </div>
      </DemoShell>
    );
  }

  return (
    <DemoShell
      className="demo-order"
      intro="Playbook in action · enquiry → brief → quote"
      title={<>Build an order<br /><em>the studio can keep.</em></>}
    >
      <form className="order-grid" onSubmit={onSubmit} noValidate>
        <div className="order-form reveal">
          <fieldset>
            <legend>01 · The piece</legend>
            <label className="field">
              <span>Base product (from the catalogue)</span>
              <select {...form.register("productId")}>
                {popular.map((item) => <option key={item.id} value={item.id}>{String(item.id).padStart(3, "0")} · {item.name}</option>)}
              </select>
              {form.formState.errors.productId && <em className="field-error">{form.formState.errors.productId.message as string}</em>}
            </label>
            <label className="field">
              <span>Cast this text into the piece</span>
              <input {...form.register("personalization")} placeholder="e.g. “Aarav · 14.11.2026” or a lyric line" />
              {form.formState.errors.personalization && <em className="field-error">{form.formState.errors.personalization.message}</em>}
            </label>
            <label className="field">
              <span>Occasion</span>
              <select {...form.register("occasion")}>
                <option value="">Choose an occasion…</option>
                {occasions.map((occasion) => <option key={occasion} value={occasion}>{occasion}</option>)}
              </select>
              {form.formState.errors.occasion && <em className="field-error">{form.formState.errors.occasion.message}</em>}
            </label>
          </fieldset>
          <fieldset>
            <legend>02 · The extras</legend>
            <div className="check-row">
              {inclusionOptions.map((option) => (
                <label key={option.key} className="check">
                  <input type="checkbox" {...form.register("inclusions")} value={option.key} />
                  <span>{option.label}</span>
                  <em>+{formatINR(option.material ?? option.packaging ?? 0)}</em>
                </label>
              ))}
            </div>
            <div className="inline-pair">
              <label className="field">
                <span>Quantity (1–100)</span>
                <input type="number" min={1} max={100} {...form.register("quantity")} />
                {form.formState.errors.quantity && <em className="field-error">{form.formState.errors.quantity.message as string}</em>}
              </label>
              <label className="check rush">
                <input type="checkbox" {...form.register("rush")} />
                <span>Rush bench slot (+20 min scheduling)</span>
              </label>
            </div>
          </fieldset>
          <fieldset>
            <legend>03 · For the proof</legend>
            <div className="inline-pair">
              <label className="field">
                <span>Your name</span>
                <input {...form.register("name")} placeholder="Who signs off the proof" />
                {form.formState.errors.name && <em className="field-error">{form.formState.errors.name.message}</em>}
              </label>
              <label className="field">
                <span>WhatsApp number</span>
                <input inputMode="numeric" {...form.register("phone")} placeholder="10 digits" />
                {form.formState.errors.phone && <em className="field-error">{form.formState.errors.phone.message}</em>}
              </label>
            </div>
            <div className="inline-pair">
              <label className="field">
                <span>City</span>
                <input {...form.register("city")} placeholder="Dispatch & ETA" />
                {form.formState.errors.city && <em className="field-error">{form.formState.errors.city.message}</em>}
              </label>
              <label className="field">
                <span>Needed by (optional)</span>
                <input type="date" min={minDate} {...form.register("date", { validate: (value) => !value || value >= minDate || "Cure + finish needs about 4 days before the date." })} />
                {form.formState.errors.date && <em className="field-error">{form.formState.errors.date.message as string}</em>}
              </label>
            </div>
            <label className="field">
              <span>Brief for the studio (optional)</span>
              <textarea rows={3} {...form.register("notes")} placeholder="Colour story, the photo to use, the gift note inside…" />
              {form.formState.errors.notes && <em className="field-error">{form.formState.errors.notes.message}</em>}
            </label>
          </fieldset>
          <button className="amber-button full" type="submit">Send the brief to the demo studio <ArrowRight size={16} /></button>
          <p className="form-foot">Validated like the real intake form: a name to address, a number to reach, a city to ship to, and text short enough to cast legibly.</p>
        </div>

        <aside className="order-quote reveal" aria-live="polite">
          <div className="quote-sheet-top"><span>Live quote sheet</span><em>updates as you type</em></div>
          <div className="order-quote-piece">
            <span>{String(product.id).padStart(3, "0")}</span>
            <h3>{product.name}</h3>
            <p>{product.note}</p>
          </div>
          <table className="quote-table tight">
            <tbody>
              {quote.lines.map((line) => <tr key={line.label}><td>{line.label}{line.note && <em>{line.note}</em>}</td><td>{formatINR(line.amount)}</td></tr>)}
            </tbody>
          </table>
          <div className="quote-total stacked">
            <div><span>Per piece</span><strong>{formatINR(quote.roundedPrice)}</strong></div>
            <div><span>Total · {quoteInput.quantity}×</span><strong>{formatINR(quote.roundedPrice * quoteInput.quantity)}</strong></div>
            <div><span>Contribution</span><strong>{formatINR(quote.netContribution)} <i>({quote.contributionPercent.toFixed(1)}%)</i></strong></div>
          </div>
          <button type="button" className="text-button dark-text" onClick={() => { const text = buildSheet("DRAFT"); setSheet(text); downloadSheet(text, "draft"); }}>
            <Download size={15} /> Download draft quote sheet
          </button>
          <p className="quote-foot">Same guardrail as the pricing demo, with your extras folded into cost and labor.</p>
        </aside>
      </form>
    </DemoShell>
  );
}
