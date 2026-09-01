/**
 * Product detail page — one SKU, fully argued: what it is, what it costs and why,
 * the safety line where relevant, and three ways forward (add, personalize, redesign).
 */
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { AlertTriangle, Brush, Check, ShieldCheck, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import StorePage from "@/components/StorePage";
import { catalogue } from "@/data/products";
import { computeQuote, formatINR, presetForProduct } from "@/lib/costing";
import { useCart } from "@/lib/cart";
import DesignPreview from "@/components/DesignPreview";
import { newDesign, uid } from "@/lib/design";

const HEAT_OR_FOOD = /bowl|plate|cup|trivet|coaster|candle|diya|mug|utensil|feeding/i;

export default function ProductPage({ id }: { id: string }) {
  const product = catalogue.find((item) => item.id === Number(id));
  const [personalize, setPersonalize] = useState("");
  const [qty, setQty] = useState(1);
  const cart = useCart();

  const quote = useMemo(() => (product ? computeQuote(presetForProduct(product)) : null), [product]);

  const previewDesign = useMemo(() => {
    if (!product) return null;
    const base = newDesign();
    return {
      ...base,
      id: `preview-${product.id}`,
      shape: /pendant|drop|charm|locket/i.test(product.name) ? "droplet" as const : /plaque|plate|tag|card|menu/i.test(product.name) ? "tablet" as const : /tray|coaster|tile/i.test(product.name) ? "square" as const : "circle" as const,
      effect: ["clear", "sunset", "ocean", "marble", "glitter", "galaxy"][product.id % 6] as typeof base.effect,
      size: product.scale === "premium" ? "XL" as const : product.scale === "large" ? "L" as const : product.scale === "small" ? "S" as const : "M" as const,
      tint: ["#d9983a", "#9eaa87", "#d9a08f", "#c98d9b"][product.id % 4],
      accent: "#f6f0e7",
      text: personalize,
      inclusions: base.inclusions.map((i) => ({ ...i, id: uid() })),
    };
  }, [product, personalize]);

  if (!product || !quote || !previewDesign) {
    return (
      <StorePage label="Product" title={<>That SKU<br /><em>isn’t in the book.</em></>} className="page-product">
        <p className="store-lead">Catalogue ids run 001–150. Try the browser, or start from the shop.</p>
        <div className="demo-next">
          <Link className="amber-button" href="/shop">Back to the shop</Link>
          <Link className="text-button" href="/demos/catalogue">Browse all 150 ideas</Link>
        </div>
      </StorePage>
    );
  }

  const unitPrice = personalize.trim() ? quote.roundedPrice + 60 : quote.roundedPrice;
  const safetyNote = HEAT_OR_FOOD.test(product.name);

  const add = () => {
    cart.add({
      key: `p${product.id}-${personalize.trim() || "plain"}`,
      kind: "product",
      productId: product.id,
      name: product.name,
      unitPrice,
      cost: quote.costWithWastage,
      quantity: qty,
      personalization: personalize.trim() || undefined,
    });
    toast.success(`${qty} × ${product.name} added`, { description: personalize.trim() ? `Cast text “${personalize.trim()}” will be proofed first.` : "Proof before production, always." });
  };

  const clean = (t: string) => t.replaceAll("_", " ");

  return (
    <StorePage label={`Product ${String(product.id).padStart(3, "0")}`} title={<>{product.name}<br /><em>{product.launch ? "In the launch edit." : "First expansion line."}</em></>} className="page-product">
      <div className="product-page-grid">
        <div className="product-stage">
          <DesignPreview design={previewDesign} />
          <div className="product-stage-caption">Live preview of your cast text · the studio sends a print-accurate proof before pouring</div>
        </div>

        <div className="product-detail">
          <p className="micro-label">{product.family} · {product.scale} piece</p>
          <p className="product-note">{product.note}</p>

          <div className="product-price-row">
            <strong>{formatINR(unitPrice)}</strong>
            <span>per piece · {qty > 1 && <b>{qty} × = {formatINR(unitPrice * qty)}</b>}</span>
            <Link className="inline-link" href={`/demos/pricing?p=${product.id}`}>see why it prices here</Link>
          </div>

          <div className="field">
            <span>Cast a line into it (optional)</span>
            <input value={personalize} maxLength={30} onChange={(e) => setPersonalize(e.target.value)} placeholder='Name · date · a few words — ₹60, proofed first' />
          </div>
          <div className="field">
            <span>Quantity</span>
            <div className="stepper dark">
              <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <b>{qty}</b>
              <button onClick={() => setQty(Math.min(60, qty + 1))}>+</button>
            </div>
          </div>

          <div className="product-actions">
            <button className="amber-button" onClick={add}><ShoppingBag size={16} /> Add to cart</button>
            <Link className="text-button" href={`/studio?from=${product.id}`}><Brush size={15} /> Redesign it your way</Link>
          </div>

          <div className="product-specs">
            <div>
              <b>Makes it real</b>
              <ul>{product.materials.slice(0, 6).map((m) => <li key={m}><Check size={12} /> {clean(m)}</li>)}</ul>
            </div>
            <div>
              <b>Bench & care</b>
              <ul>{product.tools.slice(0, 5).map((t) => <li key={t}>{clean(t)}</li>)}</ul>
            </div>
          </div>

          {safetyNote && (
            <p className="guard-note is-warn on-dark"><AlertTriangle size={14} /> Display and gentle-use only. No hot-fill, food-contact, or open-flame claims — that boundary is part of the brand, not a limitation.</p>
          )}
          <p className="product-foot"><ShieldCheck size={13} /> Cure, QC, and dispatch follow the 16-step process — track any order from the confirmation page.</p>
        </div>
      </div>
    </StorePage>
  );
}
