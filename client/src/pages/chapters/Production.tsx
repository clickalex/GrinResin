/**
 * Chapter 08 — Production & care: the full 16-step workflow, QC, and safety boundaries.
 */
import { Link } from "wouter";
import { ArrowRight, ShieldCheck } from "lucide-react";
import ChapterPage from "@/components/ChapterPage";
import { productionSteps } from "@/data/presentation";

const groups = [
  { n: "01", title: "Prepare", copy: "Choose the design and mold, set up the bench, follow the resin maker’s measurement instructions, then mix with care." },
  { n: "02", title: "Cast", copy: "Add pigments or inclusions, pour, address bubbles as directed, and allow complete curing before demolding." },
  { n: "03", title: "Finish", copy: "Trim, sand, drill where needed, polish, and attach hardware only after the cast surface is fully ready." },
  { n: "04", title: "Release", copy: "Confirm cure, bubbles, cracks, dimensions, personalization, hardware, finished edges, protection, and product-specific safety requirements." },
];

export default function Production() {
  return (
    <ChapterPage number="08" label="The production & care process" className="process-section">
      <div className="process-heading reveal">
        <div><p className="micro-label">Every piece earns its finish</p><h2>From design to<br /><em>protected dispatch.</em></h2></div>
        <p>The source process is a 16-step workflow. Each step has an owner, a check, and a record — which is what makes a handmade piece feel trustworthy to buy.</p>
      </div>
      <ol className="step-rail reveal" aria-label="The 16-step production process">
        {productionSteps.map((step, index) => (
          <li key={step}><span>{String(index + 1).padStart(2, "0")}</span>{step}</li>
        ))}
      </ol>
      <div className="process-steps reveal">
        {groups.map((group) => (
          <article key={group.n}><span>{group.n}</span><h3>{group.title}</h3><p>{group.copy}</p></article>
        ))}
      </div>
      <div className="safety-band reveal">
        <ShieldCheck size={21} />
        <p><b>Safety is non-negotiable.</b> Follow product SDS and manufacturer guidance; use suitable protection and ventilation; avoid skin and eye contact; control access; and avoid food-contact or heat-use claims unless the full material-and-design system is verified for that use.</p>
      </div>
      <div className="costing-demo-row reveal">
        <Link className="amber-button" href="/demos/track">See an order move through these steps <ArrowRight size={16} /></Link>
        <p>The tracker demo shows the eight customer-facing states that sit over this workflow.</p>
      </div>
    </ChapterPage>
  );
}
