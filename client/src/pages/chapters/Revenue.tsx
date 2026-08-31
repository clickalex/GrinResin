/**
 * Chapter 03 — The business system: revenue streams in sequence.
 */
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import ChapterPage from "@/components/ChapterPage";

const revenueStack = [
  { n: "01", title: "Direct pieces", copy: "Everyday gifts that invite discovery and repeat purchase." },
  { n: "02", title: "Personalization", copy: "Names, dates, photos, and flowers that make price less comparable." },
  { n: "03", title: "Occasion orders", copy: "Wedding and gifting sets that lift order value once the system is ready." },
  { n: "04", title: "Channel depth", copy: "Corporate, wholesale, DIY kits, and workshops only after the core process holds." },
];

export default function Revenue() {
  return (
    <ChapterPage number="03" label="The business system" className="system-section">
      <div className="system-layout">
        <div className="system-image reveal">
          <img src="/manus-storage/grinrex-floral-tray_fc53a30a.jpg" alt="Handmade floral resin keepsake tray" />
          <div className="image-tag">Small studio<br />→ repeatable practice</div>
        </div>
        <div className="system-content reveal">
          <p className="micro-label">A focused route to revenue</p>
          <h2>Begin close to the<br /><em>customer and the craft.</em></h2>
          <p>Individual sales and personalized orders are the first engines. Gift sets and small event orders follow. Corporate gifting, wholesale, workshops, and DIY kits are future branches—not launch distractions. The route is designed for an Indian home-studio context: digital discovery, direct conversation, and selected local selling.</p>
          <div className="revenue-stack">
            {revenueStack.map((item) => (
              <div key={item.n}><span>{item.n}</span><b>{item.title}</b><p>{item.copy}</p></div>
            ))}
          </div>
          <Link className="ink-text-link" href="/chapters/studio">Next: the studio that runs it <ArrowRight size={15} /></Link>
        </div>
      </div>
    </ChapterPage>
  );
}
