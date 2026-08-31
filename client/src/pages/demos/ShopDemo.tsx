/**
 * Working demo — the launch shop. Real cart math, checkout through the pricing guardrail,
 * and an order the tracker can find. Demo only: nothing is charged or sent anywhere.
 */
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { AlertCircle, ArrowRight, Check, Minus, Plus, ShoppingBag, X } from "lucide-react";
import DemoShell from "./DemoShell";
import { launchEditProducts, type CatalogueProduct } from "@/data/products";
import { computeQuote, formatINR, presetForProduct } from "@/lib/costing";
import { nextRef, saveOrder, type DemoOrder } from "@/lib/orders";

type CartLine = { product: CatalogueProduct; quantity: number; personalization: string };

export default function ShopDemo() {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState<CatalogueProduct | null>(null);
  const [draftQty, setDraftQty] = useState(1);
  const [draftText, setDraftText] = useState("");
  const [customer, setCustomer] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [placed, setPlaced] = useState<DemoOrder | null>(null);

  const priced = useMemo(() =>
    launchEditProducts.map((product) => ({ product, quote: computeQuote(presetForProduct(product)) })),
  []);

  const totals = useMemo(() => {
    const unit = (line: CartLine) => {
      const base = computeQuote(presetForProduct(line.product));
      const personalization = line.personalization.trim() ? 60 : 0;
      return { unitPrice: base.roundedPrice + personalization, cost: base.costWithWastage };
    };
    const items = lines.map((line) => ({ line, ...unit(line) }));
    return {
      items,
      total: items.reduce((sum, item) => sum + item.unitPrice * item.line.quantity, 0),
      pieces: items.reduce((sum, item) => sum + item.line.quantity, 0),
    };
  }, [lines]);

  const addLine = (product: CatalogueProduct, quantity: number, personalization: string) => {
    setLines((current) => {
      const existing = current.find((line) => line.product.id === product.id && line.personalization === personalization);
      if (existing) return current.map((line) => line === existing ? { ...line, quantity: Math.min(99, line.quantity + quantity) } : line);
      return [...current, { product, quantity, personalization }];
    });
    setOpen(null); setDraftQty(1); setDraftText("");
  };

  const removeLine = (index: number) => setLines((current) => current.filter((_, i) => i !== index));

  const checkout = () => {
    if (!lines.length) { setError("Add at least one piece to the tray."); return; }
    if (customer.trim().length < 2) { setError("A name of two letters or more, please — proofs are addressed to someone."); return; }
    if (city.trim().length < 2) { setError("Add a delivery city so dispatch can quote an ETA."); return; }
    setError(null);
    const order: DemoOrder = {
      ref: nextRef(),
      placedAt: new Date().toISOString(),
      channel: "shop",
      customer: customer.trim(),
      city: city.trim(),
      notes: "Placed through the launch shop demo.",
      total: totals.total,
      items: totals.items.map(({ line, unitPrice }) => ({
        productId: line.product.id,
        name: line.product.name,
        personalization: line.personalization.trim() || undefined,
        quantity: line.quantity,
        unitPrice,
      })),
    };
    saveOrder(order);
    setPlaced(order);
    setLines([]); setCustomer(""); setCity("");
  };

  return (
    <DemoShell
      className="demo-shop"
      intro="The 12-product launch edit · open for a test sale"
      title={<>A storefront<br /><em>that behaves like one.</em></>}
      next={{ href: "/demos/track", label: "Track the orders you place" }}
    >
      <div className="shop-grid-wrap">
        <div>
          <div className="shop-grid">
            {priced.map(({ product, quote }) => (
              <article className="shop-card reveal" key={product.id}>
                <div className="shop-card-top"><span>{String(product.id).padStart(3, "0")}</span><em>{product.scale}</em></div>
                <h3>{product.name}</h3>
                <p>{product.note}</p>
                <div className="shop-card-foot">
                  <b>{formatINR(quote.roundedPrice)}</b>
                  <button onClick={() => { setOpen(product); setDraftQty(1); setDraftText(""); }}>Add <Plus size={14} /></button>
                </div>
              </article>
            ))}
          </div>
          <p className="shop-foot-note">Prices come straight from the <Link className="inline-link" href="/demos/pricing">pricing guardrail demo</Link> using each SKU’s source costing preset. Search beyond these twelve in the <Link className="inline-link" href="/demos/catalogue">full catalogue browser</Link>.</p>
        </div>

        <aside className="cart-box reveal" aria-label="Order tray">
          <div className="cart-head"><ShoppingBag size={17} /><b>Order tray</b><span>{totals.pieces} pcs</span></div>
          {placed ? (
            <div className="success-card">
              <span className="success-mark"><Check size={22} /></span>
              <h3>Order placed — demo</h3>
              <p>Reference <strong>{placed.ref}</strong> · {formatINR(placed.total)} · {placed.items.length} line{placed.items.length > 1 ? "s" : ""}</p>
              <p className="success-note">No payment moved; nothing left this browser. The studio would now confirm your proof and open the SKU evidence card.</p>
              <Link className="amber-button" href={`/demos/track?ref=${placed.ref}`}>Track this order <ArrowRight size={15} /></Link>
              <button className="text-button" onClick={() => setPlaced(null)}>Back to the shop</button>
            </div>
          ) : (
            <>
              {totals.items.length === 0 && <p className="cart-empty">The tray is empty. Start with a keychain — that is how most customers do.</p>}
              {totals.items.map(({ line, unitPrice }) => (
                <div className="line-row" key={`${line.product.id}-${line.personalization}`}>
                  <div>
                    <b>{line.product.name}</b>
                    {line.personalization && <em>“{line.personalization}”</em>}
                    <span>{line.quantity} × {formatINR(unitPrice)}</span>
                  </div>
                  <button onClick={() => removeLine(totals.items.findIndex((item) => item.line === line))} aria-label={`Remove ${line.product.name}`}><X size={14} /></button>
                </div>
              ))}
              {lines.length > 0 && (
                <div className="cart-summary">
                  <div><span>Pieces total</span><b>{formatINR(totals.total)}</b></div>
                  <p>Shipping quoted at proof stage · GST receipt on dispatch</p>
                </div>
              )}
              <div className="cart-form">
                <input value={customer} onChange={(event) => setCustomer(event.target.value)} placeholder="Your name (for the proof)" aria-label="Your name" />
                <input value={city} onChange={(event) => setCity(event.target.value)} placeholder="City" aria-label="City" />
              </div>
              {error && <p className="cart-error"><AlertCircle size={13} /> {error}</p>}
              <button className="amber-button full" onClick={checkout}>Place demo order <ArrowRight size={15} /></button>
            </>
          )}
        </aside>
      </div>

      {open && (
        <div className="document-modal" role="dialog" aria-modal="true" aria-label="Configure piece" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(null); }}>
          <button className="modal-backdrop" aria-label="Close" onClick={() => setOpen(null)} />
          <article className="document-sheet">
            <button className="close-document" onClick={() => setOpen(null)} aria-label="Close"><X size={19} /></button>
            <div className="document-sheet-header"><span>{String(open.id).padStart(3, "0")}</span><p>{open.family}</p></div>
            <h2 id="specimen-title">{open.name}</h2>
            <p className="specimen-note">{open.note}</p>
            <div className="draft-controls">
              <label>
                <span>Personalize (optional)</span>
                <input value={draftText} onChange={(event) => setDraftText(event.target.value.slice(0, 40))} placeholder="Name, date, or short line — proofed before the pour" />
                <em>{draftText.trim() ? "₹60 personalization adds to the unit price" : "Plain cast — no surcharge"}</em>
              </label>
              <div>
                <span className="draft-label">Quantity</span>
                <div className="stepper">
                  <button onClick={() => setDraftQty(Math.max(1, draftQty - 1))} aria-label="Decrease quantity"><Minus size={14} /></button>
                  <b>{draftQty}</b>
                  <button onClick={() => setDraftQty(Math.min(99, draftQty + 1))} aria-label="Increase quantity"><Plus size={14} /></button>
                </div>
              </div>
            </div>
            <button className="amber-button full" onClick={() => addLine(open, draftQty, draftText)}>Add {draftQty} to the tray <ArrowRight size={15} /></button>
          </article>
        </div>
      )}
    </DemoShell>
  );
}
