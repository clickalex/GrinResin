/**
 * Care & safety — the boundaries that make the brand trustworthy, stated plainly.
 */
import { Link } from "wouter";
import { AlertTriangle, ShieldCheck, Sun, Droplets, HeartCrack } from "lucide-react";
import StorePage from "@/components/StorePage";

const dos = [
  { icon: Droplets, title: "Wipe, don’t scour", copy: "Soft cloth, water, a drop of mild soap. Abrasive pads and acetone will scratch the gloss." },
  { icon: Sun, title: "Love the light, avoid the soak", copy: "Suncatchers belong in windows; long direct sun still ages pigment slowly — rotate hanging pieces seasonally." },
  { icon: ShieldCheck, title: "Keep the polish", copy: "A dab of furniture wax or the polish cloth from your care kit restores surface depth every few months." },
];

const donts = [
  { title: "No hot mugs directly on resin", copy: "Under-sides soften near sustained heat (roughly 60°C+). Use the coaster’s felt side down, drink on ceramic." },
  { title: "No food contact, ever claimed", copy: "Bowls and plates here are decorative unless explicitly stated and verified. Trust the product page, not the ingredient optimism." },
  { title: "No solvents, no boiling water", copy: "Acetone, oven cleaners, and dishwasher heat cloud the surface — permanently." },
];

export default function Care() {
  return (
    <StorePage
      label="Care · keep it keeping"
      title={<>Built for decades,<br /><em>treated like it.</em></>}
      lead="Resin outlives almost everything else on the shelf if you give it three things: shade from standing heat, gentle cleaning, and no claims it can’t keep. This page is the contract."
      className="page-care"
      aside={<div className="wedding-aside"><HeartCrack size={17} /><p><b>If something chips, photograph it first.</b> Damage within 48h of arrival is replaced, no argument — it’s also a QC signal the studio tracks per SKU.</p></div>}
    >
      <div className="care-grid">
        <div>
          <p className="micro-label">The easy part</p>
          <div className="care-cards">
            {dos.map((item) => (
              <article className="swot-card" key={item.title}>
                <span><item.icon size={18} /></span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
        <div>
          <p className="micro-label">The boundaries</p>
          <div className="care-cards">
            {donts.map((item, index) => (
              <article className="swot-card is-dont" key={item.title}>
                <span><AlertTriangle size={16} /></span>
                <h3>{index + 1}. {item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
          <div className="safety-band">
            <ShieldCheck size={21} />
            <p><b>The same rules run the studio.</b> SDS guidance, protection, ventilation, and no heat/food claims unless the whole system is verified — chapter <Link className="inline-link" href="/chapters/production">The process</Link> is the long version.</p>
          </div>
        </div>
      </div>
    </StorePage>
  );
}
