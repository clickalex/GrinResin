/**
 * Weddings — occasion landing page with a real offer structure and an enquiry lead.
 */
import { useState } from "react";
import { Link } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowRight, CalendarHeart } from "lucide-react";
import StorePage from "@/components/StorePage";
import { saveLead } from "@/lib/leads";

const schema = z.object({
  name: z.string().trim().min(2, "Names for the invitation list, please."),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, "10-digit WhatsApp number."),
  weddingDate: z.string().min(1, "The date sets the cure calendar."),
  qty: z.coerce.number().int().min(10, "Wedding lots start at 10 pieces — that’s where pricing becomes real.").max(2000),
  items: z.string().trim().min(3, "Tell us what you have in mind."),
});

const offers = [
  { code: 101, title: "Wedding date keepsakes", copy: "Names and the date cast per piece — favours with a shelf life instead of a dustbin.", tag: "from ₹349/pc" },
  { code: 102, title: "Bridal party sets", copy: "Matched trays, toppers and favours in one palette, one pour week.", tag: "lot quote" },
  { code: 106, title: "Bouquet preservation", copy: "The real bouquet, dried flat, cast deep under a museum face.", tag: "premium pour" },
  { code: 104, title: "Favour magnets", copy: "A hundred tiny gifts that outlive the buffet line.", tag: "bulk friendly" },
];

export default function Weddings() {
  const [placed, setPlaced] = useState<{ ref: string } | null>(null);
  const form = useForm<z.input<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { name: "", phone: "", weddingDate: "", qty: 50, items: "" } });

  const onSubmit = form.handleSubmit((values) => {
    const lead = saveLead({
      kind: "wedding", name: values.name.trim(), phone: values.phone.trim(), city: "wedding enquiry",
      detail: `${values.qty} pieces wanted for ${values.weddingDate} — ${values.items.trim()}`,
    });
    setPlaced({ ref: lead.ref });
  });

  return (
    <StorePage
      label="Weddings · the occasion line"
      title={<>One date, cast a<br /><em>hundred times.</em></>}
      lead="Wedding work is the studio’s highest-trust order type: fixed dates, bulk lots, zero room for a missed cure. It runs on a calendar, an approval, and a lot quote."
      className="page-weddings"
      aside={
        <div className="wedding-aside">
          <CalendarHeart size={17} />
          <p><b>Book the pour week, not the delivery day.</b> Proof approved ≥ 10 days before the event keeps everything on schedule.</p>
        </div>
      }
    >
      <div className="wedding-grid">
        <div>
          <div className="collection-panels tight">
            {offers.map((offer) => (
              <article className="collection-card small" key={offer.title}>
                <h3>{offer.title}</h3>
                <p>{offer.copy}</p>
                <small>{offer.tag}</small>
                <Link href={`/product/${offer.code}`}>See the piece <ArrowRight size={13} /></Link>
              </article>
            ))}
          </div>
          <div className="lot-table">
            <p className="micro-label">Lot logic from the playbook</p>
            <table>
              <tbody>
                <tr><td>10–49 pieces</td><td>standard price −10% · 1 proof round</td></tr>
                <tr><td>50–199 pieces</td><td>−18% · shared pallet curing · packing photo set</td></tr>
                <tr><td>200+ pieces</td><td>quoted on the cure calendar · deposit before pour · batched dispatch</td></tr>
              </tbody>
            </table>
            <p className="quote-foot">No date is promised before the calendar check — that rule is why the dates hold.</p>
          </div>
        </div>

        <aside className="wedding-form">
          {placed ? (
            <div className="success-card">
              <span className="success-mark"><CalendarHeart size={20} /></span>
              <h3>Enquiry logged · {placed.ref}</h3>
              <p>In the real studio this lands in the wedding sheet with the date checked against cure capacity. Nothing was sent anywhere from this demo.</p>
              <Link className="amber-button" href="/studio">Start a keepsake design</Link>
              <button className="text-button" onClick={() => { setPlaced(null); form.reset(); }}>Send another enquiry</button>
            </div>
          ) : (
            <form className="order-form" onSubmit={onSubmit} noValidate>
              <p className="micro-label">Wedding enquiry</p>
              <div className="inline-pair">
                <label className="field"><span>Couple / contact name</span><input {...form.register("name")} placeholder="Who’s asking" />
                  {form.formState.errors.name && <em className="field-error">{form.formState.errors.name.message}</em>}</label>
                <label className="field"><span>WhatsApp</span><input inputMode="numeric" {...form.register("phone")} placeholder="10 digits" />
                  {form.formState.errors.phone && <em className="field-error">{form.formState.errors.phone.message}</em>}</label>
              </div>
              <div className="inline-pair">
                <label className="field"><span>Event date</span><input type="date" {...form.register("weddingDate")} />
                  {form.formState.errors.weddingDate && <em className="field-error">{form.formState.errors.weddingDate.message}</em>}</label>
                <label className="field"><span>Pieces (min 10)</span><input type="number" min={10} max={2000} {...form.register("qty")} />
                  {form.formState.errors.qty && <em className="field-error">{form.formState.errors.qty.message}</em>}</label>
              </div>
              <label className="field"><span>What do you have in mind?</span><textarea rows={4} {...form.register("items")} placeholder="Favour magnets for 120 guests in sage + chalk, boxed…" />
                {form.formState.errors.items && <em className="field-error">{form.formState.errors.items.message}</em>}</label>
              <button className="amber-button full" type="submit">Check the calendar <ArrowRight size={15} /></button>
              <p className="quote-foot">Demo form — saved in your browser only, exactly like the order flow.</p>
            </form>
          )}
        </aside>
      </div>
    </StorePage>
  );
}
