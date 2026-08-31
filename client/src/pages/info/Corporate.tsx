/**
 * Corporate gifting — the B2B lane from chapter 12, with its own lead flow.
 */
import { useState } from "react";
import { Link } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowRight, Building2 } from "lucide-react";
import StorePage from "@/components/StorePage";
import { saveLead } from "@/lib/leads";

const schema = z.object({
  company: z.string().trim().min(2, "Company name, for the sheet."),
  contact: z.string().trim().min(2, "Who do we send the proof to?"),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, "10-digit mobile."),
  qty: z.coerce.number().int().min(25, "Corporate lots start at 25 — below that, the shop price is already fair.").max(5000),
  occasion: z.enum(["Onboarding kits", "Festive gifting", "Recognition & awards", "Client gifts", "Event giveaways"]),
  deadline: z.string().min(1, "Target delivery date."),
  logo: z.string().trim().max(120, "One line is plenty at this stage.").optional(),
});

const tiers = [
  { n: "01", title: "Onboarding kits", copy: "Nameplate + card holder + desk tray in brand palette. Priced per joiner, proofed per spelling.", band: "₹749–₹1,499 / kit" },
  { n: "02", title: "Festive lots", copy: "Coaster sets and Diya trays with sealed logo plates. Deposit before pour; batched dispatch.", band: "−18% at 50+, −25% at 200+" },
  { n: "03", title: "Recognition", copy: "Trophy blocks and commemorative plaques that survive the shelf behind the trophy cabinet.", band: "quoted per ceremony" },
];

export default function Corporate() {
  const [placed, setPlaced] = useState<string | null>(null);
  const form = useForm<z.input<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { company: "", contact: "", phone: "", qty: 50, occasion: "Onboarding kits", deadline: "", logo: "" },
  });

  const onSubmit = form.handleSubmit((values) => {
    const lead = saveLead({
      kind: "corporate", name: values.contact.trim(), phone: values.phone.trim(), city: values.company.trim(),
      detail: `${values.occasion} · ${values.qty} pieces by ${values.deadline}${values.logo ? ` · logo: ${values.logo.trim()}` : ""}`,
    });
    setPlaced(lead.ref);
  });

  return (
    <StorePage
      label="Corporate · the B2B lane"
      title={<>Gifting your finance<br /><em>can approve.</em></>}
      lead="Chapter 03 says corporate work follows system-proof — this page is how the studio takes that order seriously: real tiers, deposits, and a logo plate that passes brand review."
      className="page-corporate"
      aside={<div className="wedding-aside"><Building2 size={17} /><p><b>GST invoice per lot.</b> Proofs go to one approver — one name spelling the 200 plates correctly.</p></div>}
    >
      <div className="wedding-grid">
        <div>
          <div className="collection-panels tight stacked">
            {tiers.map((tier) => (
              <article className="collection-card small row" key={tier.n}>
                <span className="card-number">{tier.n}</span>
                <div><h3>{tier.title}</h3><p>{tier.copy}</p></div>
                <small>{tier.band}</small>
              </article>
            ))}
          </div>
          <div className="lot-table">
            <p className="micro-label">How a corporate lot runs</p>
            <table>
              <tbody>
                <tr><td>01 · Brief</td><td>Logo files, quantities, delivery city, budget band — one form, one reply</td></tr>
                <tr><td>02 · Proof</td><td>One physical-accuracy mock of the logo plate; sign-off freezes artwork</td></tr>
                <tr><td>03 · Pour</td><td>Deposit confirmed, lot scheduled on the cure calendar, batches inspected per the 16-step process</td></tr>
                <tr><td>04 · Dispatch</td><td>Packed to courier-tested spec with a packing photo record and AWB list</td></tr>
              </tbody>
            </table>
            <p className="quote-foot"><Link className="inline-link" href="/chapters/playbook">The playbook</Link> is why the dates hold at 200 pieces and at 2,000.</p>
          </div>
        </div>

        <aside className="wedding-form">
          {placed ? (
            <div className="success-card">
              <span className="success-mark"><Building2 size={20} /></span>
              <h3>Lead received · {placed}</h3>
              <p>A studio would reply the same day with a lot quote and calendar check. This demo keeps it in your browser.</p>
              <Link className="amber-button" href="/demos/pricing">Try the pricing guardrail</Link>
              <button className="text-button" onClick={() => { setPlaced(null); form.reset(); }}>Send another brief</button>
            </div>
          ) : (
            <form className="order-form" onSubmit={onSubmit} noValidate>
              <p className="micro-label">Bulk enquiry</p>
              <div className="inline-pair">
                <label className="field"><span>Company</span><input {...form.register("company")} />
                  {form.formState.errors.company && <em className="field-error">{form.formState.errors.company.message}</em>}</label>
                <label className="field"><span>Approver name</span><input {...form.register("contact")} />
                  {form.formState.errors.contact && <em className="field-error">{form.formState.errors.contact.message}</em>}</label>
              </div>
              <div className="inline-pair">
                <label className="field"><span>WhatsApp</span><input inputMode="numeric" {...form.register("phone")} />
                  {form.formState.errors.phone && <em className="field-error">{form.formState.errors.phone.message}</em>}</label>
                <label className="field"><span>Pieces (25–5000)</span><input type="number" min={25} {...form.register("qty")} />
                  {form.formState.errors.qty && <em className="field-error">{form.formState.errors.qty.message}</em>}</label>
              </div>
              <div className="inline-pair">
                <label className="field"><span>Occasion</span><select {...form.register("occasion")}>
                  <option>Onboarding kits</option><option>Festive gifting</option><option>Recognition & awards</option><option>Client gifts</option><option>Event giveaways</option>
                </select></label>
                <label className="field"><span>Delivery by</span><input type="date" {...form.register("deadline")} />
                  {form.formState.errors.deadline && <em className="field-error">{form.formState.errors.deadline.message}</em>}</label>
              </div>
              <label className="field"><span>Logo & colors (describe)</span><input {...form.register("logo")} placeholder="e.g. wordmark in amber, box in ink" />
                {form.formState.errors.logo && <em className="field-error">{form.formState.errors.logo.message}</em>}</label>
              <button className="amber-button full" type="submit">Request a lot quote <ArrowRight size={15} /></button>
              <p className="quote-foot">Demo form — saved in your browser only.</p>
            </form>
          )}
        </aside>
      </div>
    </StorePage>
  );
}
