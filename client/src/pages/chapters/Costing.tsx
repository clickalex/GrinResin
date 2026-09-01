/**
 * Chapter 07 — The discipline: costing components, category ranges, and the pricing guardrail.
 */
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import ChapterPage from "@/components/ChapterPage";
import { costComponents } from "@/data/presentation";

export default function Costing() {
  return (
    <ChapterPage number="07" label="Costing, quality & safety" className="discipline-section">
      <div className="discipline-layout">
        <div className="discipline-title reveal">
          <p className="micro-label">Quality is the product</p>
          <h2>A beautiful pour<br />needs a rigorous <em>finish.</em></h2>
        </div>
        <div className="discipline-grid reveal">
          <div className="discipline-item"><span>01</span><h3>Cost what is real</h3><p>Include materials, labor, packaging, overhead, payment fees, shipping, and wastage before price is set.</p></div>
          <div className="discipline-item"><span>02</span><h3>Standardize the work</h3><p>Document the route from design and mold selection through cure, trimming, polishing, assembly, and safe handling.</p></div>
          <div className="discipline-item"><span>03</span><h3>Protect the result</h3><p>Inspect cure, surface, personalization, hardware, and packaging before every piece leaves the studio.</p></div>
          <div className="discipline-item"><span>04</span><h3>Respect the boundary</h3><p>Do not make food-contact or heat-use claims unless the material and complete product design are verified for that use.</p></div>
        </div>
      </div>
      <div className="cost-basis reveal">
        <p className="micro-label">Every source cost component belongs in the SKU file</p>
        <div>{costComponents.map((component, index) => <span key={component}><b>{String(index + 1).padStart(2, "0")}</b>{component}</span>)}</div>
        <small>Source category examples: small raw materials ₹15–₹40; medium ₹30–₹100; large ₹60–₹250; premium ₹150–₹1,000+. Tool amortization must be tracked alongside the product decision.</small>
      </div>
      <div className="formula-card reveal">
        <p>Pricing guardrail</p>
        <strong>Material <i>+</i> labor <i>+</i> packaging <i>+</i> overhead <i>+</i> fees <i>+</i> profit</strong>
      </div>
      <div className="costing-demo-row reveal">
        <Link className="amber-button" href="/demos/pricing">Run the pricing guardrail live <ArrowRight size={16} /></Link>
        <p>The demo applies this formula to any catalogue product — every component is editable.</p>
      </div>
    </ChapterPage>
  );
}
