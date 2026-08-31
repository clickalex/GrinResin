/**
 * About — the brand page shoppers expect, distilled from the presentation.
 */
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import StorePage from "@/components/StorePage";

const principles = [
  { n: "01", title: "Story before detail", copy: "A name, a flower, a date — the meaning decides the object, not the other way around." },
  { n: "02", title: "Resin as a material", copy: "Transparency, pooled color, and suspended botanicals are the design language, not decoration." },
  { n: "03", title: "Discipline over hype", copy: "Every piece follows a 16-step process with quality checks and a safety boundary we never cross." },
];

export default function About() {
  return (
    <StorePage
      label="About the studio"
      title={<>A home studio that<br /><em>keeps promises.</em></>}
      lead="GrinRex Resin started with a simple unfairness: the objects people love most are mass-made, and the ones made with love rarely last. A name, a flower, a photograph — cast to keep — is the answer."
      className="page-about"
      aside={
        <div className="about-mark">
          <span className="mark-orbit hero-mark"><span>G</span></span>
          <div><b>GRINREX</b><em>RESIN</em></div>
        </div>
      }
    >
      <div className="about-grid">
        <div className="about-copy">
          <p>The studio is a home bench, not a factory — deliberately. Small format means every pour gets weighed, every cure gets watched, and every dispatch gets photographed. It also means limits we state honestly: cure time, weather, and a refusal to claim what epoxy can’t do.</p>
          <p>What began as a 150-product idea library became a twelve-product launch edit because growth without costing is just noise. Prices carry real labor, real wastage, and a pricing guardrail you can inspect — even recalculate — on this site.</p>
          <div className="about-stats">
            <div><strong>12</strong><span>launch products, each costed per SKU</span></div>
            <div><strong>16</strong><span>steps from design to protected dispatch</span></div>
            <div><strong>₹10–14k</strong><span>the source-plan studio setup, held as planning truth</span></div>
          </div>
          <div className="about-links">
            <Link className="amber-button" href="/chapters/opportunity">Read the full presentation <ArrowRight size={15} /></Link>
            <Link className="text-button" href="/shop">Shop the launch edit</Link>
          </div>
        </div>
        <div className="about-principles">
          {principles.map((item) => (
            <article className="swot-card" key={item.n}>
              <span>{item.n}</span><h3>{item.title}</h3><p>{item.copy}</p>
            </article>
          ))}
          <div className="about-image"><img src="/manus-storage/grinrex-floral-ornament_bb6a5236.png" alt="Resin pendant with pressed flowers" /></div>
        </div>
      </div>
    </StorePage>
  );
}
