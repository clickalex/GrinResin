/**
 * Chapter 09 — Market & risk field: positioning, SWOT, channels, and content system.
 */
import ChapterPage from "@/components/ChapterPage";
import { contentSystem, swot } from "@/data/presentation";

const channels = [
  "Instagram & reels", "WhatsApp Business", "Exhibitions & fairs", "Gift-store consignment", "Marketplaces", "Owned website",
];

export default function Market() {
  return (
    <ChapterPage number="09" label="The market & risk field" className="market-section">
      <div className="market-heading reveal">
        <div><p className="micro-label">The opportunity needs a clear view</p><h2>Sell with taste.<br /><em>Operate with eyes open.</em></h2></div>
        <p>GrinRex Resin is positioned as an affordable-to-premium customized handmade resin offering. The source plan combines social and direct commerce with exhibitions, gift stores, corporate conversation, marketplaces, and an owned website.</p>
      </div>
      <div className="swot-grid">
        {swot.map((item, index) => (
          <article className="swot-card reveal" key={item.title}><span>0{index + 1}</span><h3>{item.title}</h3><p>{item.summary}</p></article>
        ))}
      </div>
      <div className="content-system reveal">
        <p className="micro-label">Marketing content system</p>
        <div>{contentSystem.map((item) => <span key={item}>{item}</span>)}</div>
      </div>
      <div className="content-system reveal">
        <p className="micro-label">Channel sequence</p>
        <div>{channels.map((item) => <span key={item}>{item}</span>)}</div>
      </div>
    </ChapterPage>
  );
}
