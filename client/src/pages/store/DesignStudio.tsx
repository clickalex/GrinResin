/**
 * Design-Your-Own studio — the centerpiece of the ordering flow.
 * The customer places real inclusions on a live SVG cast, casts a name, picks packaging,
 * sees the guardrail price update, then adds to cart / saves / exports the design.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";
import { Bookmark, Copy, Eraser, Heart, RotateCcw, Save, ShoppingBag, Sparkles, Trash2 } from "lucide-react";
import StorePage from "@/components/StorePage";
import DesignPreview, { designToSvgString, downloadText } from "@/components/DesignPreview";
import { catalogue } from "@/data/products";
import { useCart } from "@/lib/cart";
import {
  designDisplayName, designQuote, effectLabels, findDesign, inclusionTools, newDesign, paletteSwatches,
  saveDesign, shapeLabels, sizeLabels, uid,
  type Design, type DesignSize, type EffectPreset, type InclusionKind, type Packaging,
} from "@/lib/design";
import { formatINR } from "@/lib/costing";

const tabs = [
  { id: "piece", label: "Piece" },
  { id: "pour", label: "Pour & color" },
  { id: "text", label: "Cast text" },
  { id: "order", label: "Pack & order" },
] as const;

type TabId = (typeof tabs)[number]["id"];

const EFFECT_ORDER: EffectPreset[] = ["clear", "sunset", "ocean", "marble", "glitter", "galaxy"];

export default function DesignStudio() {
  const [design, setDesign] = useState<Design>(() => newDesign());
  const [tab, setTab] = useState<TabId>("piece");
  const [tool, setTool] = useState<InclusionKind | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loadedSaved, setLoadedSaved] = useState(false);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const cart = useCart();

  // Deep links: /studio?design=<id> loads a saved design; ?from=<productId> seeds from a catalogue piece.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const savedId = params.get("design");
    if (savedId) {
      const loaded = findDesign(savedId);
      if (loaded) { setDesign(loaded); setLoadedSaved(true); return; }
    }
    const from = params.get("from");
    if (from) {
      const product = catalogue.find((item) => item.id === Number(from));
      if (product) {
        const sizeByScale: Record<string, DesignSize> = { small: "S", medium: "M", large: "L", premium: "XL" };
        setDesign((current) => ({
          ...current,
          name: product.name,
          size: sizeByScale[product.scale] ?? "M",
          note: `Based on ${String(product.id).padStart(3, "0")} · ${product.name}. ${product.note}`,
          shape: /pendant|drop|charm|locket/i.test(product.name) ? "droplet" : /key/i.test(product.name) ? "tablet" : current.shape,
        }));
      }
    }
  }, []);

  const { input, quote } = useMemo(() => designQuote(design), [design]);
  const patch = (next: Partial<Design>) => setDesign((current) => ({ ...current, ...next }));
  const selected = design.inclusions.find((item) => item.id === selectedId) ?? null;

  const placeAt = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!tool || !canvasRef.current) return;
    const svg = canvasRef.current.querySelector("svg");
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const x = Math.round(Math.min(94, Math.max(6, ((event.clientX - rect.left) / rect.width) * 100)) * 10) / 10;
    const y = Math.round(Math.min(94, Math.max(6, ((event.clientY - rect.top) / rect.height) * 100)) * 10) / 10;
    const id = uid();
    setDesign((current) => ({
      ...current,
      inclusions: [...current.inclusions, { id, kind: tool, x, y, rot: Math.floor(Math.random() * 360), scale: 1 }].slice(-24),
    }));
    setSelectedId(id);
  };

  const addToCart = () => {
    cart.add({
      kind: "design",
      name: design.text.trim() ? designDisplayName(design) : `${effectLabels[design.effect]} ${shapeLabels[design.shape].toLowerCase()}`,
      unitPrice: quote.roundedPrice,
      cost: quote.costWithWastage,
      quantity: design.quantity,
      personalization: design.text.trim() || undefined,
      design,
    });
    toast.success("Added to your cart", { description: `${design.quantity} × ${formatINR(quote.roundedPrice)} — proof before the pour, always.` });
  };

  const save = () => {
    const named = { ...design, name: design.name === "Untitled pour" ? designDisplayName(design) : design.name };
    setDesign(named);
    saveDesign(named);
    setLoadedSaved(true);
    toast.success("Design saved", { description: "Find it under My designs on this browser." });
  };

  const exportSvg = () => {
    const svg = canvasRef.current?.querySelector("svg") ?? null;
    const source = designToSvgString(svg);
    if (!source) { toast.error("Open the canvas first, then export."); return; }
    downloadText(`grinrex-design-${design.id}.svg`, source);
    toast.success("Design sheet downloaded", { description: "A vector copy of your piece — safe to share with anyone." });
  };

  return (
    <StorePage
      label="Design studio · your own pour"
      title={<>Cast it, arrange it,<br /><em>order it.</em></>}
      lead="The same bench discipline as the studio, opened to you: choose a base, pour a color story, place dried petals and foil where you want them, and add the name. The price stays honest — every element runs through the studio's pricing guardrail."
      className="page-studio"
      aside={
        <div className="studio-price-card">
          <span>Your quote · per piece</span>
          <strong>{formatINR(quote.roundedPrice)}</strong>
          <p>
            {shapeLabels[design.shape]} · {sizeLabels[design.size].split(" ·")[0]} · {design.inclusions.length} inclusion{design.inclusions.length === 1 ? "" : "s"}
            {design.text.trim() ? " · cast text" : ""}
          </p>
          <p className="studio-price-note">Unit cost {formatINR(quote.costWithWastage)} — this is why the price is what it is.</p>
        </div>
      }
    >
      <div className="designer-layout">
        <div className="designer-canvas-col">
          <div className="designer-canvas" ref={canvasRef}>
            <div className="canvas-hint">
              {tool ? (
                <span><Sparkles size={12} /> Click the cast to place — drag anything to adjust</span>
              ) : (
                <span>Pick a tool below, or click a piece to select it</span>
              )}
            </div>
            <div onClick={placeAt} className={tool ? "is-placing" : undefined}>
              <DesignPreview
                design={design}
                interactive
                selectedId={selectedId}
                onSelect={setSelectedId}
                onMove={(id, x, y) =>
                  setDesign((current) => ({
                    ...current,
                    inclusions: current.inclusions.map((item) => (item.id === id ? { ...item, x, y } : item)),
                  }))
                }
              />
            </div>
          </div>

          <div className="inclusion-bar">
            {inclusionTools.map((item) => (
              <button
                key={item.kind}
                className={`tool ${tool === item.kind ? "is-active" : ""}`}
                onClick={() => setTool(tool === item.kind ? null : item.kind)}
                aria-pressed={tool === item.kind}
              >
                <PreviewGlyph kind={item.kind} /> {item.label}
              </button>
            ))}
            <button className={`tool clear ${design.inclusions.length ? "" : "is-quiet"}`} onClick={() => { setDesign((c) => ({ ...c, inclusions: [] })); setSelectedId(null); setTool(null); }}>
              <Eraser size={13} /> Clear all
            </button>
          </div>

          {selected && (
            <div className="selected-bar">
              <b><Heart size={12} /> Selected: {selected.kind}</b>
              <label>Rotate <input type="range" min={0} max={359} value={selected.rot} onChange={(e) => setDesign((c) => ({ ...c, inclusions: c.inclusions.map((i) => i.id === selected.id ? { ...i, rot: Number(e.target.value) } : i) }))} /></label>
              <label>Size <input type="range" min={0.6} max={1.8} step={0.05} value={selected.scale} onChange={(e) => setDesign((c) => ({ ...c, inclusions: c.inclusions.map((i) => i.id === selected.id ? { ...i, scale: Number(e.target.value) } : i) }))} /></label>
              <button onClick={() => setDesign((c) => ({ ...c, inclusions: [...c.inclusions, { ...selected, id: uid(), x: Math.min(90, selected.x + 6), y: Math.min(90, selected.y + 6) }] }))}><Copy size={13} /> Duplicate</button>
              <button className="danger" onClick={() => { setDesign((c) => ({ ...c, inclusions: c.inclusions.filter((i) => i.id !== selected.id) })); setSelectedId(null); }}><Trash2 size={13} /> Remove</button>
            </div>
          )}

          <div className="studio-actions">
            <button className="amber-button" onClick={addToCart}><ShoppingBag size={16} /> Add to cart — {formatINR(quote.roundedPrice * design.quantity)}</button>
            <button className="text-button" onClick={save}><Save size={15} /> {loadedSaved ? "Update saved design" : "Save this design"}</button>
            <button className="text-button" onClick={exportSvg}>Download SVG sheet</button>
            <button className="text-button quiet" onClick={() => { setDesign(newDesign()); setSelectedId(null); setTool(null); setLoadedSaved(false); }}><RotateCcw size={14} /> Start over</button>
          </div>
        </div>

        <aside className="designer-controls">
          <div className="tab-row" role="tablist">
            {tabs.map((item) => (
              <button key={item.id} role="tab" aria-selected={tab === item.id} className={tab === item.id ? "is-active" : ""} onClick={() => setTab(item.id)}>
                {item.label}
              </button>
            ))}
          </div>

          {tab === "piece" && (
            <div className="tab-panel">
              <p className="micro-label">01 · Shape & scale</p>
              <div className="shape-grid">
                {(Object.keys(shapeLabels) as (keyof typeof shapeLabels)[]).map((shape) => (
                  <button key={shape} className={`shape-tile ${design.shape === shape ? "is-active" : ""}`} onClick={() => patch({ shape })}>
                    <DesignPreview design={{ ...design, shape, inclusions: [], text: "", effect: "clear" }} className="shape-thumb" />
                    <span>{shapeLabels[shape]}</span>
                  </button>
                ))}
              </div>
              <div className="field">
                <span>Size</span>
                <div className="seg-row">
                  {(Object.keys(sizeLabels) as DesignSize[]).map((size) => (
                    <button key={size} className={`seg ${design.size === size ? "is-active" : ""}`} onClick={() => patch({ size })} title={sizeLabels[size]}>{size}</button>
                  ))}
                </div>
                <em>{sizeLabels[design.size]} · material band scales with size</em>
              </div>
              <div className="field">
                <span>Finish</span>
                <div className="seg-row">
                  <button className={`seg ${design.finish === "gloss" ? "is-active" : ""}`} onClick={() => patch({ finish: "gloss" })}>Gloss — light pools on it</button>
                  <button className={`seg ${design.finish === "matte" ? "is-active" : ""}`} onClick={() => patch({ finish: "matte" })}>Matte — soft and quiet</button>
                </div>
              </div>
              <div className="field">
                <span>Studio note for this piece</span>
                <textarea rows={2} value={design.note} maxLength={180} onChange={(e) => patch({ note: e.target.value })} placeholder="Colour story, who it is for, the memory behind it…" />
              </div>
            </div>
          )}

          {tab === "pour" && (
            <div className="tab-panel">
              <p className="micro-label">02 · The pour</p>
              <div className="field">
                <span>Effect</span>
                <div className="effect-row">
                  {EFFECT_ORDER.map((effect) => (
                    <button key={effect} className={`effect-chip ${design.effect === effect ? "is-active" : ""}`} onClick={() => patch({ effect })}>{effectLabels[effect]}</button>
                  ))}
                </div>
              </div>
              <div className="field">
                <span>Resin tint</span>
                <div className="swatch-grid">
                  {paletteSwatches.map((swatch) => (
                    <button key={swatch.value} className={`swatch ${design.tint === swatch.value ? "is-active" : ""}`} style={{ background: swatch.value }} title={swatch.label} onClick={() => patch({ tint: swatch.value })} />
                  ))}
                  <label className="swatch custom" title="Custom color">
                    <input type="color" value={design.tint} onChange={(e) => patch({ tint: e.target.value })} aria-label="Custom tint" />
                  </label>
                </div>
              </div>
              <div className="field">
                <span>Inclusion accent</span>
                <div className="swatch-grid">
                  {paletteSwatches.map((swatch) => (
                    <button key={swatch.value} className={`swatch ${design.accent === swatch.value ? "is-active" : ""}`} style={{ background: swatch.value }} title={swatch.label} onClick={() => patch({ accent: swatch.value })} />
                  ))}
                  <label className="swatch custom" title="Custom color">
                    <input type="color" value={design.accent} onChange={(e) => patch({ accent: e.target.value })} aria-label="Custom accent" />
                  </label>
                </div>
                <em>Petals and foil pull their tone from here; dried botanicals keep their own muted palette.</em>
              </div>
              <p className="tab-foot">Real pieces follow real limits: soft tones need slow mixing, glitter and galaxy pours cure longest — that patience is priced in.</p>
            </div>
          )}

          {tab === "text" && (
            <div className="tab-panel">
              <p className="micro-label">03 · Cast into the piece</p>
              <div className="field">
                <span>Name, date, or a short line (≤ 30 characters)</span>
                <input value={design.text} maxLength={30} onChange={(e) => patch({ text: e.target.value })} placeholder='e.g. "Aarav · 14.11.2026"' />
                <em>{design.text.trim() ? "Adds ₹60 personalization + typesetting time — and it will be proofed before pouring." : "No text keeps it at base price."}</em>
              </div>
              <div className="field">
                <span>Lettering</span>
                <div className="seg-row">
                  <button className={`seg ${design.textFont === "serif" ? "is-active" : ""}`} onClick={() => patch({ textFont: "serif" })}>Editorial serif</button>
                  <button className={`seg ${design.textFont === "script" ? "is-active" : ""}`} onClick={() => patch({ textFont: "script" })}>Italic hand</button>
                  <button className={`seg ${design.textFont === "sans" ? "is-active" : ""}`} onClick={() => patch({ textFont: "sans" })}>Caps, spaced</button>
                </div>
              </div>
              <div className="field">
                <span>Size</span>
                <div className="seg-row">
                  {(["sm", "md", "lg"] as const).map((size) => <button key={size} className={`seg ${design.textSize === size ? "is-active" : ""}`} onClick={() => patch({ textSize: size })}>{size === "sm" ? "Small" : size === "md" ? "Medium" : "Large"}</button>)}
                </div>
              </div>
              <div className="field">
                <span>Color</span>
                <div className="seg-row">
                  {(["chalk", "ink", "amber"] as const).map((color) => <button key={color} className={`seg ${design.textColor === color ? "is-active" : ""}`} onClick={() => patch({ textColor: color })}>{color}</button>)}
                </div>
                <em>Long names set small cast small — keep it short so it stays legible for decades.</em>
              </div>
            </div>
          )}

          {tab === "order" && (
            <div className="tab-panel">
              <p className="micro-label">04 · Packaging & quantity</p>
              <div className="field">
                <span>How it arrives</span>
                <div className="pack-row">
                  {([
                    ["standard", "Standard", "boxed for safety"],
                    ["gift", "Gift box", "ribbon + hand note"],
                    ["premium", "Premium case", "rigid keepsake box"],
                  ] as [Packaging, string, string][]).map(([key, label, detail]) => (
                    <button key={key} className={`pack ${design.packaging === key ? "is-active" : ""}`} onClick={() => patch({ packaging: key })}>
                      <b>{label}</b><span>{detail}</span><em>{key === "standard" ? "included" : key === "gift" ? "+₹40" : "+₹85"}</em>
                    </button>
                  ))}
                </div>
              </div>
              <div className="field">
                <span>Quantity — {input.quantity}× {formatINR(quote.roundedPrice)} = {formatINR(quote.roundedPrice * design.quantity)}</span>
                <input type="range" min={1} max={40} value={design.quantity} onChange={(e) => patch({ quantity: Number(e.target.value) })} className="wide-slider" />
                <em>Bulk occasion orders get a lot quote and a cure-calendar check before any date is promised.</em>
              </div>
              <div className="check-row">
                <label className="check"><input type="checkbox" checked={design.rush} onChange={(e) => patch({ rush: e.target.checked })} /><span>Rush bench slot — earliest cure window</span><em>+20 min scheduling</em></label>
                <label className="check"><input type="checkbox" checked={design.careCard} onChange={(e) => patch({ careCard: e.target.checked })} /><span>Add care card & polish cloth</span><em>+₹8</em></label>
              </div>
              <p className="tab-foot">
                Checkout asks for contact and delivery only — the proof is where the order actually locks. Questions first? <Link className="inline-link" href="/contact">Talk to the studio</Link>.
              </p>
            </div>
          )}

          <div className="quote-summary">
            <div className="quote-sheet-top"><span>Guardrail breakdown</span><em>per piece</em></div>
            <table className="quote-table tight">
              <tbody>
                {quote.lines.map((line) => <tr key={line.label}><td>{line.label}</td><td>{formatINR(line.amount)}</td></tr>)}
                <tr><td>Suggested price</td><td><b>{formatINR(quote.roundedPrice)}</b></td></tr>
              </tbody>
            </table>
            <p className="quote-foot">Want to move the numbers yourself? <Link className="inline-link" href="/demos/pricing">Open the pricing guardrail</Link>.</p>
            {loadedSaved && <p className="saved-flag"><Bookmark size={12} /> Loaded from your saved designs</p>}
          </div>
        </aside>
      </div>
    </StorePage>
  );
}

function PreviewGlyph({ kind }: { kind: InclusionKind }) {
  switch (kind) {
    case "petal": return <span className="glyph glyph-petal" aria-hidden="true" />;
    case "leaf": return <span className="glyph glyph-leaf" aria-hidden="true" />;
    case "foil": return <span className="glyph glyph-foil" aria-hidden="true" />;
    case "bead": return <span className="glyph glyph-bead" aria-hidden="true" />;
    case "star": return <span className="glyph glyph-star" aria-hidden="true" />;
    case "butterfly": return <span className="glyph glyph-butterfly" aria-hidden="true" />;
    case "ring": return <span className="glyph glyph-ring" aria-hidden="true" />;
    default: return null;
  }
}
