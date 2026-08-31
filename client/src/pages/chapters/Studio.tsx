/**
 * Chapter 04 — The studio foundation: bench, palette, safety, and setup budget.
 */
import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
import ChapterPage from "@/components/ChapterPage";

export default function Studio() {
  return (
    <ChapterPage number="04" label="The studio foundation" className="studio-section">
      <div className="studio-heading reveal">
        <div>
          <p className="micro-label">From source plan to working bench</p>
          <h2>Start with the<br /><em>right constraints.</em></h2>
        </div>
        <p>The source plan assumes a home-based manufacturing model with custom orders, online sales, and local selling. The first studio should remain deliberately compact: safety, repeatability, and a limited product edit come before equipment breadth.</p>
      </div>
      <div className="studio-grid">
        <article className="studio-card reveal"><span>01</span><h3>Core bench</h3><p>Scale, mixing cups and sticks, silicone molds, heat gun, drill, sandpaper, pliers, beakers, and protected storage form the essential working base.</p></article>
        <article className="studio-card reveal"><span>02</span><h3>Material palette</h3><p>Epoxy resin and hardener, pigments, mica, alcohol ink, foil, dried botanicals, hardware, and protective packaging make the first collection possible.</p></article>
        <article className="studio-card reveal"><span>03</span><h3>Safety envelope</h3><p>Use product instructions and SDS guidance, suitable protective wear, ventilation, controlled access, and boundaries around food-contact and heat-exposed use.</p></article>
      </div>
      <div className="startup-snapshot reveal">
        <div><span>Source-plan setup range</span><strong>₹10k–₹14k</strong></div>
        <p>Essential tools: ₹6k–₹8k · Initial raw materials: ₹4k–₹6k. These are source planning ranges, not supplier quotations. Advanced tools such as pressure pots, rotary tools, and polishing machines remain later-stage decisions.</p>
      </div>
      <Link className="document-inline-link ink-link" href="/documents">Open the complete studio, tool & material reference <ArrowUpRight size={16} /></Link>
    </ChapterPage>
  );
}
