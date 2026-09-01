/**
 * Chapter 11 — The internal playbook: metrics, workflow, and pricing guardrails.
 */
import { Check } from "lucide-react";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import ChapterPage from "@/components/ChapterPage";
import { metrics } from "@/data/presentation";

const orderFlow = [
  { n: "01", title: "Enquiry", copy: "Instagram DM, WhatsApp, or marketplace message — logged in the order sheet within the hour." },
  { n: "02", title: "Proof", copy: "Name spelling, photo crop, and placement approved by the customer before any resin moves." },
  { n: "03", title: "Pour window", copy: "The piece enters the bench queue with its SKU card: material, labor minutes, and mold." },
  { n: "04", title: "Release", copy: "QC passed, boxed, photographed, dispatched — and the card records cost, outcome, and delivery date." },
];

export default function Playbook() {
  return (
    <ChapterPage number="11" label="The internal playbook" className="playbook-section">
      <div className="playbook-grid">
        <div className="playbook-copy reveal">
          <p className="micro-label">What gets managed gets stronger</p>
          <h2>Every product tells<br />a <em>useful story.</em></h2>
          <p>GrinRex Resin turns craft knowledge into decision-quality information. Each SKU is not just made—it is measured for effort, quality, demand, and contribution.</p>
          <Link className="amber-button" href="/demos/order">Practice the flow: build an order <ArrowRight size={17} /></Link>
        </div>
        <div className="metrics-cast reveal">
          <div className="metrics-top"><span>SKU evidence card</span><em>Live with every order</em></div>
          {metrics.map((metric, index) => <div className="metric-row" key={metric}><span>0{index + 1}</span><b>{metric}</b><Check size={16} /></div>)}
          <p className="metrics-note">The purpose is not bureaucracy. It is knowing which pieces deserve another pour.</p>
        </div>
      </div>
      <div className="order-flow reveal">
        <p className="micro-label">Order workflow — enquiry to evidence</p>
        <div className="order-flow-grid">
          {orderFlow.map((item) => (
            <article key={item.n}><span>{item.n}</span><h3>{item.title}</h3><p>{item.copy}</p></article>
          ))}
        </div>
      </div>
    </ChapterPage>
  );
}
