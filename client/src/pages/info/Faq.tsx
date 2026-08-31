/**
 * FAQ — the answers the studio repeats on WhatsApp, on the page so fewer messages start.
 */
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import StorePage from "@/components/StorePage";
import { Link } from "wouter";

const faqs = [
  { q: "How long from order to doorstep?", a: "Most pieces ship within 6–9 working days: a proof reply (24h), then pour, full cure, finishing, QC, and packing. Wedding and corporate lots are scheduled against the cure calendar — that is why we never promise a date before checking it." },
  { q: "Why is there a proof step at all?", a: "Because names misspelled in resin cannot be un-misspelled. Every cast text, photo crop, or petal placement gets an approval image before a drop of resin is mixed. It is the one step that makes custom orders safe for both sides." },
  { q: "Can I watch my order move?", a: "Yes — every order gets a studio reference and a status page: eight states from receipt to dispatch. Try the live flow on the order tracker demo with GRX-1002." },
  { q: "Can pieces touch food or hot drinks?", a: "Not as a rule. Cured epoxy is chemically stable but coatings, edges, and DIY finishing rarely pass true food-contact certification — so coasters protect tables, they do not carry salad. Any piece that could claim otherwise would only do so after the full material-and-design system is verified." },
  { q: "What about heat — candles, car dashboards, sunny windows?", a: "Resin softens near sustained heat and yellows under long UV. Candle pieces use a heat-safe insert cup, everything is care-carded for shade and cool surfaces, and sun-catchers hang where light comes through — not where it stays." },
  { q: "Why are colors slightly different from the preview?", a: "The studio preview is layout-honest (text, placement, palette) but pigment in resin is hand-mixed: two pours of “sunset” are siblings, not twins. Dried petals curl where they please — that is the price of real botanicals." },
  { q: "What if a piece arrives damaged?", a: "Dispatch is courier-tested and photographed before sealing. If it arrives hurt, send the unboxing in within 48 hours — replacement or full refund, no argument. Damage rate itself is a tracked SKU metric, and a recurring failure changes the packing spec, not the excuse." },
  { q: "Do you take bulk, wedding, or corporate work?", a: "Yes — the right way: a lot quote, a deposit before pour, and a calendar check first. The wed and corporate pages carry the same forms the studio uses." },
  { q: "Why does pricing look… detailed?", a: "Because every price on this site comes from one published formula: material + labor + packaging + overhead + fees + profit. You can open the pricing guardrail demo and move any component yourself — the shop prices are that same math with studio presets." },
];

export default function Faq() {
  return (
    <StorePage
      label="FAQ · before you message us"
      title={<>The honest<br /><em>fine print.</em></>}
      lead="Nine answers covering everything from cure time to car dashboards. If yours isn’t here, the contact page is one form away."
      className="page-faq"
      aside={<div className="wedding-aside"><p>Can’t find it here? <Link className="inline-link" href="/contact">Ask the studio</Link> — replies land the same day between 10:00–19:00 IST.</p></div>}
    >
      <div className="faq-list">
        <Accordion type="multiple" className="faq-accordion">
          {faqs.map((item, index) => (
            <AccordionItem value={`faq-${index}`} key={item.q}>
              <AccordionTrigger><b>{String(index + 1).padStart(2, "0")}</b>{item.q}</AccordionTrigger>
              <AccordionContent>{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </StorePage>
  );
}
