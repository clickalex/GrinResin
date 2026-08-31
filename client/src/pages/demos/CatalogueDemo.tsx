/**
 * Working demo — the complete 150-product catalogue, browsable.
 */
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Filter, Search, Sparkles, X } from "lucide-react";
import DemoShell from "./DemoShell";
import { catalogue, productFamilies, type CatalogueProduct } from "@/data/products";
import { computeQuote, formatINR, presetForProduct } from "@/lib/costing";

type SortKey = "id" | "name" | "scale";
const scaleRank = { small: 0, medium: 1, large: 2, premium: 3 } as const;

const clean = (token: string) => token.replaceAll("_", " ");

export default function CatalogueDemo() {
  const [query, setQuery] = useState("");
  const [family, setFamily] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("id");
  const [launchOnly, setLaunchOnly] = useState(false);
  const [visible, setVisible] = useState(24);
  const [selected, setSelected] = useState<CatalogueProduct | null>(null);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    let rows = catalogue.filter((product) => {
      if (family && product.family !== family) return false;
      if (launchOnly && !product.launch) return false;
      if (!needle) return true;
      return [product.name, product.note, product.family, ...product.materials, ...product.tools].join(" ").toLowerCase().includes(needle);
    });
    rows = [...rows].sort((a, b) =>
      sort === "name" ? a.name.localeCompare(b.name) : sort === "scale" ? scaleRank[a.scale] - scaleRank[b.scale] || a.id - b.id : a.id - b.id
    );
    return rows;
  }, [query, family, sort, launchOnly]);

  const reset = () => { setQuery(""); setFamily(null); setSort("id"); setLaunchOnly(false); setVisible(24); };
  const quote = selected ? computeQuote(presetForProduct(selected)) : null;

  return (
    <DemoShell
      className="demo-catalogue"
      intro="All 150 source products · one browsable library"
      title={<>The whole range,<br /><em>open on the bench.</em></>}
      next={{ href: "/shop", label: "Buy from the launch edit" }}
    >
      <div className="demo-controls reveal">
        <div className="demo-search">
          <Search size={16} />
          <input
            value={query}
            onChange={(event) => { setQuery(event.target.value); setVisible(24); }}
            placeholder="Try ‘wedding’, ‘clock’, ‘keychain’ or ‘flower’"
            aria-label="Search the catalogue"
          />
          {query && <button className="demo-search-clear" onClick={() => setQuery("")} aria-label="Clear search"><X size={14} /></button>}
        </div>
        <label className="demo-sort">
          <span>Sort</span>
          <select value={sort} onChange={(event) => setSort(event.target.value as SortKey)}>
            <option value="id">Source order</option>
            <option value="name">Name A–Z</option>
            <option value="scale">Scale (small → premium)</option>
          </select>
        </label>
        <button className={`demo-toggle ${launchOnly ? "is-on" : ""}`} onClick={() => { setLaunchOnly(!launchOnly); setVisible(24); }} aria-pressed={launchOnly}>
          <Sparkles size={13} /> Launch edit only
        </button>
      </div>

      <div className="filter-chips reveal" role="group" aria-label="Filter by family">
        <button className={`chip ${!family ? "is-active" : ""}`} onClick={() => { setFamily(null); setVisible(24); }}><Filter size={12} /> All families</button>
        {productFamilies.map((name) => (
          <button key={name} className={`chip ${family === name ? "is-active" : ""}`} onClick={() => { setFamily(family === name ? null : name); setVisible(24); }}>
            {name}
          </button>
        ))}
        <span className="filter-count">{filtered.length} / {catalogue.length} products</span>
      </div>

      <div className="product-grid">
        {filtered.slice(0, visible).map((product) => (
          <button className="product-chip" key={product.id} onClick={() => setSelected(product)}>
            <span>{String(product.id).padStart(3, "0")}{product.launch && <em className="chip-launch">launch</em>}</span>
            <h3>{product.name}</h3>
            <p>{product.materials.slice(0, 3).map(clean).join(" · ")}</p>
          </button>
        ))}
      </div>
      {filtered.length > visible && (
        <button className="catalogue-more" onClick={() => setVisible((current) => current + 24)}>Show 24 more products <ArrowRight size={16} /></button>
      )}
      {!filtered.length && (
        <div className="catalogue-empty-state">
          <p>Nothing in the 150-item library matches “{query}”{family ? ` in ${family}` : ""}.</p>
          <button className="text-button" onClick={reset}>Reset the filters</button>
        </div>
      )}

      {selected && quote && (
        <div className="document-modal" role="dialog" aria-modal="true" aria-labelledby="specimen-title" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
          <button className="modal-backdrop" aria-label="Close product" onClick={() => setSelected(null)} />
          <article className="document-sheet specimen-sheet">
            <button className="close-document" onClick={() => setSelected(null)} aria-label="Close product"><X size={19} /></button>
            <div className="document-sheet-header">
              <span>{String(selected.id).padStart(3, "0")}</span>
              <p>{selected.family}</p>
            </div>
            <h2 id="specimen-title">{selected.name}</h2>
            <p className="specimen-note">{selected.note}</p>
            {selected.launch && <p className="specimen-launch"><Sparkles size={13} /> Recommended 12-product launch edit</p>}
            <div className="specimen-grid">
              <div>
                <b>Scale band</b>
                <p>{selected.scale} · materials ₹{selected.material_range[0]}–₹{selected.material_range[1]}{selected.scale === "premium" ? "+" : ""}</p>
              </div>
              <div>
                <b>Guardrail price demo</b>
                <p>{formatINR(quote.roundedPrice)} suggested · {formatINR(quote.costWithWastage)} cost</p>
              </div>
              <div>
                <b>Materials</b>
                <ul>{selected.materials.map((material) => <li key={material}>{clean(material)}</li>)}</ul>
              </div>
              <div>
                <b>Tools</b>
                <ul>{selected.tools.map((tool) => <li key={tool}>{clean(tool)}</li>)}</ul>
              </div>
            </div>
            <div className="specimen-actions">
              <Link className="amber-button" href={`/demos/pricing?p=${selected.id}`}>Cost this piece <ArrowRight size={15} /></Link>
              <Link className="text-button dark-text" href={`/demos/order?p=${selected.id}`}>Build a custom order</Link>
              <Link className="text-button dark-text" href={`/documents`}>Catalogue document</Link>
            </div>
          </article>
        </div>
      )}
    </DemoShell>
  );
}
