/**
 * Chapter 06 — The full catalogue narrative; browsing itself lives in the working demo.
 */
import { Link } from "wouter";
import { ArrowRight, Search } from "lucide-react";
import ChapterPage from "@/components/ChapterPage";
import { productFamilies } from "@/data/products";

export default function CatalogueChapter() {
  return (
    <ChapterPage number="06" label="The full product catalogue" className="catalogue-section">
      <div className="catalogue-heading reveal">
        <div><p className="micro-label">150 source products · one browsable library</p><h2>The whole range,<br /><em>kept in context.</em></h2></div>
        <p>The source list spans jewelry, keepsakes, home and living, office and corporate pieces, celebrations, hobby objects, garden items, and pet memorial products. Browse it in full, then keep the sales range disciplined.</p>
      </div>
      <div className="catalogue-family-grid reveal">
        {productFamilies.map((family) => <span key={family}>{family}</span>)}
      </div>
      <Link className="catalogue-open-demo reveal" href="/demos/catalogue">
        <span className="demo-card-play"><Search size={16} /></span>
        <div>
          <h3>Open the working catalogue browser</h3>
          <p>Search all 150 ideas, filter by family, inspect materials and tools, and jump from any product into the pricing guardrail.</p>
        </div>
        <ArrowRight size={19} />
      </Link>
      <div className="catalogue-discipline reveal">
        <p className="micro-label">Why the range stays closed</p>
        <p>A 150-item wall would bury the business story. The presentation shows curated representatives and the 12 recommended launch products, while the library behind them guides what opens next — each SKU first tested for safety, unit cost, production time, quality, demand, packaging, and dispatch risk.</p>
      </div>
      <Link className="document-inline-link ink-link light-on-dark" href="/documents">Open or download the full 150-product reference <ArrowRight size={16} /></Link>
    </ChapterPage>
  );
}
