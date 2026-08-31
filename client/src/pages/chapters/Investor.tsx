/**
 * Chapter 12 — The investor case & expansion. Deliberately free of unverified claims.
 */
import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
import ChapterPage from "@/components/ChapterPage";
import { expansionLanes } from "@/data/presentation";

const cards = [
  { n: "01", title: "Use of funds", copy: "Prioritize essential equipment, safety, molds, core materials, packaging, and product presentation." },
  { n: "02", title: "Milestone logic", copy: "Prove demand, margin, and repeatability before expanding the catalogue or B2B commitment." },
  { n: "03", title: "Investor discipline", copy: "No unverified market, revenue, valuation, or return claims are presented here." },
];

const stagedUse = [
  { phase: "Phase 1", detail: "Safety, ventilation, scale, molds, and a restricted palette — the bench before the brand." },
  { phase: "Phase 2", detail: "Core material stock, launch photography, and gift-ready packaging for the 12-product edit." },
  { phase: "Phase 3", detail: "Selected capacity tools, better packaging, and a small content budget once orders are steady." },
];

export default function Investor() {
  return (
    <ChapterPage number="12" label="The investor case" className="investor-section">
      <div className="investor-layout">
        <div className="investor-top reveal">
          <p className="micro-label">A measured case for growth</p>
          <h2>Fund the proof,<br />then fund the <em>reach.</em></h2>
        </div>
        <div className="investor-copy reveal">
          <p>The source plan provides a controlled setup reference of ₹10,000–₹14,000 for essential equipment, safety, multipurpose molds, core materials, protective packaging, and early presentation. It is a starting cost reference—not a valuation, forecast, or capital request.</p>
          <p>Growth should follow evidence—reliable unit costs, stable quality, demand-validated products, operating capacity, and repeat or referral signals.</p>
        </div>
      </div>
      <div className="investor-cards">
        {cards.map((card) => (
          <article className="investor-card reveal" key={card.n}><span>{card.n}</span><h3>{card.title}</h3><p>{card.copy}</p></article>
        ))}
      </div>
      <div className="staged-funds reveal">
        <p className="micro-label">Staged capital logic (no fixed ask — every tranche opens on evidence)</p>
        <div>
          {stagedUse.map((item) => <article key={item.phase}><b>{item.phase}</b><p>{item.detail}</p></article>)}
        </div>
      </div>
      <div className="expansion-index reveal">
        <p className="micro-label">Source-defined future expansion lanes</p>
        <div>{expansionLanes.map((lane) => <span key={lane}>{lane}</span>)}</div>
      </div>
      <Link className="document-inline-link" href="/documents">Open investor brief <ArrowUpRight size={16} /></Link>
    </ChapterPage>
  );
}
