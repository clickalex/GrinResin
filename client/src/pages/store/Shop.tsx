/**
 * The shop — the 12-product launch edit plus the first expansions from the library.
 * Same guardrail prices as the demos; quick-add goes straight to the real cart.
 */
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { Brush, Plus, Search, SlidersHorizontal, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import StorePage from "@/components/StorePage";
import { catalogue, launchEditProducts, type CatalogueProduct } from "@/data/products";
import { computeQuote, formatINR, presetForProduct } from "@/lib/costing";
import { useCart } from "@/lib/cart";

const EXTRA_SHOP = ["Custom Lyric Plaque", "Wall Clock Face", "City Map Keychain", "Guitar Pick Set", "Succulent Planter", "Terrarium Vessel"];
const shopProducts: CatalogueProduct[] = [...launchEditProducts, ...catalogue.filter((p) => EXTRA_SHOP.includes(p.name))];

export default function Shop() {
  const [query, setQuery] = useState("");
  const [family, setFamily] = useState<string | null>(null);
  const [launchOnly, setLaunchOnly] = useState(false);
  const cart = useCart();

  const families = useMemo(() => Array.from(new Set(shopProducts.map((p) => p.family))), []);
  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return shopProducts.filter((p) => {
      if (family && p.family !== family) return false;
      if (launchOnly && !p.launch) return false;
      if (!needle) return true;
      return `${p.name} ${p.note} ${p.family}`.toLowerCase().includes(needle);
    });
  }, [query, family, launchOnly]);

  const add = (product: CatalogueProduct) => {
    const quote = computeQuote(presetForProduct(product));
    cart.add({
      key: `p${product.id}-plain`,
      kind: "product",
      productId: product.id,
      name: product.name,
      unitPrice: quote.roundedPrice,
      cost: quote.costWithWastage,
      quantity: 1,
    });
    toast.success(`${product.name} added`, { description: "Checkout sends a proof before anything pours." });
  };

  return (
    <StorePage
      label="Shop · launch collection"
      title={<>Gift-ready,<br /><em>made to order.</em></>}
      lead="The twelve products the source plan recommends to launch with, plus the first six expansions that survived costing. Every piece is cast to order — most ship within a week of proof approval."
      className="page-shop"
      aside={
        <div className="shop-aside">
          <p className="micro-label">How ordering works</p>
          <ol>
            <li>Add a piece (or design your own)</li>
            <li>Checkout with your cast text</li>
            <li>Approve the studio proof</li>
            <li>Cure → QC → protected dispatch</li>
          </ol>
          <Link href="/demos/track" className="inline-link">See the flow in the tracker demo →</Link>
        </div>
      }
    >
      <div className="shop-toolbar">
        <div className="demo-search">
          <Search size={16} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search the shop — “coaster”, “gift”, “pet”…" aria-label="Search shop" />
          {query && <button className="demo-search-clear" onClick={() => setQuery("")} aria-label="Clear"><X size={14} /></button>}
        </div>
        <button className={`demo-toggle ${launchOnly ? "is-on" : ""}`} onClick={() => setLaunchOnly(!launchOnly)} aria-pressed={launchOnly}>
          <Sparkles size={13} /> Launch edit
        </button>
        <span className="shop-count"><SlidersHorizontal size={13} /> {rows.length} of {shopProducts.length}</span>
      </div>
      <div className="filter-chips">
        <button className={`chip ${!family ? "is-active" : ""}`} onClick={() => setFamily(null)}>All</button>
        {families.map((name) => (
          <button key={name} className={`chip ${family === name ? "is-active" : ""}`} onClick={() => setFamily(family === name ? null : name)}>{name}</button>
        ))}
      </div>

      <div className="shop-grid wide">
        {rows.map((product) => {
          const quote = computeQuote(presetForProduct(product));
          return (
            <article className="shop-card" key={product.id}>
              <div className="shop-card-top">
                <span>{String(product.id).padStart(3, "0")}</span>
                <em>{product.launch ? "launch edit" : product.scale}</em>
              </div>
              <ProductSwatch product={product} />
              <h3><Link href={`/product/${product.id}`}>{product.name}</Link></h3>
              <p>{product.note}</p>
              <div className="shop-card-foot">
                <b>{formatINR(quote.roundedPrice)}</b>
                <div className="shop-card-actions">
                  <button className="ghost" onClick={() => add(product)}>Quick add <Plus size={13} /></button>
                  <Link href={`/studio?from=${product.id}`} className="ghost customize"><Brush size={13} /> Make it yours</Link>
                </div>
              </div>
            </article>
          );
        })}
        {!rows.length && (
          <div className="shop-empty">
            <p>Nothing in the shop matches that.</p>
            <Link className="amber-button" href="/studio">Design your own instead</Link>
          </div>
        )}
      </div>
    </StorePage>
  );
}

/** Deterministic mini-cast swatch so each product feels like a specimen, not a stock photo. */
function ProductSwatch({ product }: { product: CatalogueProduct }) {
  const hues = ["#d9983a", "#9eaa87", "#d9a08f", "#c98d9b", "#e8c48f", "#2f3430"];
  const seed = product.id * 31;
  const tint = hues[seed % hues.length];
  const accent = hues[(seed >> 2) % hues.length];
  return (
    <div className="product-swatch" style={{ background: `radial-gradient(120% 90% at 30% 22%, ${tint}66, ${accent}22 48%, #141513 96%)` }} aria-hidden="true">
      <span style={{ background: accent }} /><i style={{ background: tint }} />
    </div>
  );
}
