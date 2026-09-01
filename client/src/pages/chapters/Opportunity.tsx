/**
 * Chapter 02 — The opening: why a meaningful-gift system, not a general craft store.
 */
import { Flower2, Gem, PackageCheck, ShieldCheck } from "lucide-react";
import ChapterPage from "@/components/ChapterPage";

export default function Opportunity() {
  return (
    <ChapterPage number="02" label="The opening" className="opportunity-section">
      <div className="opportunity-grid">
        <div className="section-lede reveal">
          <p className="micro-label">Where the brand begins</p>
          <h2>Not a general craft store.<br /><em>A meaningful-gift system.</em></h2>
        </div>
        <div className="lede-copy reveal">
          <p>GrinRex Resin enters through the moments mass production cannot quite hold: a wedding date, a familiar flower, a name, a photograph, or a simple sign that someone was considered.</p>
          <p>Its advantage is not a vast catalogue. It is a reliable way to make personal pieces feel intentional, polished, and safe to give — an India-based home studio selling online, at exhibitions, and through selected local gift stores.</p>
        </div>
      </div>
      <div className="opportunity-strip reveal">
        <div><Flower2 size={22} /><span>Personalized<br />keepsakes</span></div>
        <div><Gem size={22} /><span>Small-batch<br />craft</span></div>
        <div><PackageCheck size={22} /><span>Gift-ready<br />presentation</span></div>
        <div><ShieldCheck size={22} /><span>Disciplined<br />production</span></div>
      </div>
    </ChapterPage>
  );
}
