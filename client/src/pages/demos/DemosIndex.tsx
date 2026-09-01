/**
 * The demo bench — every interactive tool that backs a chapter of the presentation.
 */
import { Link } from "wouter";
import { ArrowRight, Database, Inbox, Package, ScrollText, SlidersHorizontal, Sparkles, Truck } from "lucide-react";
import { SectionMarker } from "@/components/ChapterPage";

const demos = [
  { icon: SlidersHorizontal, path: "/demos/catalogue", title: "Catalogue browser", chapter: "Ch. 06", detail: "Search, filter, and inspect all 150 source products exactly as the idea library describes them." },
  { icon: Package, path: "/shop", title: "Launch shop → now live", chapter: "Ch. 05", detail: "The demo graduated: the 12-product edit, cart, and checkout now run as the real store flow — design-your-own included." },
  { icon: ScrollText, path: "/demos/pricing", title: "Pricing guardrail", chapter: "Ch. 07", detail: "Move every cost component and watch the selling price, fee, and contribution recompute live." },
  { icon: Sparkles, path: "/demos/order", title: "Custom order builder", chapter: "Ch. 11", detail: "Configure a personalised piece, validate the enquiry form, and produce a studio-ready quote sheet." },
  { icon: Truck, path: "/demos/track", title: "Order tracker", chapter: "Ch. 08", detail: "Enter any demo reference — or one you created — and watch it move through the eight studio states." },
  { icon: Inbox, path: "/demos/desk", title: "Studio desk", chapter: "Ch. 13", detail: "Wedding, corporate, workshop, and contact enquiries as the studio sees them — count, reply-status cycling, removal. All browser-local." },
];

export default function DemosIndex() {
  return (
    <section className="chapter demos-index-section">
      <SectionMarker number="D" label="The working demo bench" />
      <div className="demos-heading reveal">
        <div>
          <p className="micro-label">Nothing here is a picture of a product</p>
          <h2>Every tool on this page<br /><em>actually runs.</em></h2>
        </div>
        <p>The presentation says the studio earns trust with systems, not promises. These demos are those systems in miniature — the same catalogue data, the same pricing formula, and a working order flow you can place and track.</p>
      </div>
      <div className="demos-grid">
        {demos.map((demo) => (
          <Link key={demo.path} href={demo.path} className="demo-entry reveal">
            <demo.icon size={22} />
            <span className="demo-entry-chapter">{demo.chapter}</span>
            <h3>{demo.title}</h3>
            <p>{demo.detail}</p>
            <i>Open <ArrowRight size={14} /></i>
          </Link>
        ))}
      </div>
      <div className="demos-note reveal">
        <Database size={18} />
        <p>Everything runs locally: the catalogue is the real 150-item source list, prices use the studio’s source formula, and demo orders live in your browser’s storage — <Link className="inline-link" href="/demos/track">the tracker</Link> reads them back. Nothing is sent anywhere.</p>
      </div>
      <Link className="document-inline-link" href="/documents">Prefer the paper trail? Open the document library <ArrowRight size={15} /></Link>
    </section>
  );
}
