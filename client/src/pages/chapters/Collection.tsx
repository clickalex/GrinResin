/**
 * Chapter 05 — The launch collection: twelve products, three families.
 */
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import ChapterPage from "@/components/ChapterPage";
import { launchEdit } from "@/data/presentation";

export default function Collection() {
  return (
    <ChapterPage number="05" label="The launch collection" className="collection-section">
      <div className="collection-heading reveal">
        <div>
          <p className="micro-label">A 150-product idea library, distilled</p>
          <h2>Twelve launch products.<br /><em>One coherent point of view.</em></h2>
        </div>
        <p>Start with three linked families. The catalogue grows only when quality, margin, and demand all agree.</p>
      </div>
      <div className="collection-panels">
        <article className="collection-card reveal card-gift">
          <span className="card-number">01</span>
          <h3>Everyday gifts</h3>
          <p>Keychains, bookmarks, fridge magnets, and earrings bring customers into the brand.</p>
          <div className="card-image everyday" />
          <small>Discoverable · small-format · giftable</small>
        </article>
        <article className="collection-card reveal card-keep">
          <span className="card-number">02</span>
          <h3>Personal keepsakes</h3>
          <p>Nameplates, photo blocks, jewelry dishes, and ring dishes carry the emotional signature.</p>
          <div className="card-image keepsake" />
          <small>Custom · meaningful · higher value</small>
        </article>
        <article className="collection-card reveal card-home">
          <span className="card-number">03</span>
          <h3>Home & gifting décor</h3>
          <p>Coasters, phone stands, compact trays, and curated sets create functional gifting moments.</p>
          <div className="card-image home" />
          <small>Useful · bundle-ready · seasonal</small>
        </article>
      </div>
      <div className="launch-edit reveal">
        <div className="launch-edit-top"><p className="micro-label">The recommended 12-product launch edit</p><span>Source-backed MVP</span></div>
        <div className="launch-tags">
          {launchEdit.map((product, index) => <span key={product}><b>{String(index + 1).padStart(2, "0")}</b>{product}</span>)}
        </div>
        <div className="collection-next-links">
          <Link className="text-button" href="/chapters/catalogue">Browse the complete 150-product catalogue <ArrowRight size={16} /></Link>
          <Link className="text-button" href="/demos/shop">Try the launch collection in the shop demo <ArrowRight size={16} /></Link>
        </div>
      </div>
    </ChapterPage>
  );
}
