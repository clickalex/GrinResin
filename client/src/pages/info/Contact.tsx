/**
 * Contact — channels the studio really runs, plus a saved-locally enquiry form.
 */
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowRight, Instagram, Mail, MapPin, MessageCircle } from "lucide-react";
import StorePage from "@/components/StorePage";
import { saveLead } from "@/lib/leads";
import { Link } from "wouter";

const schema = z.object({
  name: z.string().trim().min(2, "A name, so the reply has an addressee."),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, "10-digit mobile — replies go to WhatsApp."),
  topic: z.enum(["A custom piece", "Wedding lot", "Corporate lot", "Workshops", "Press / collab", "Just saying hi"]),
  message: z.string().trim().min(10, "A sentence or two is plenty.").max(600),
});

const channels = [
  { icon: MessageCircle, title: "WhatsApp Business", copy: "Fastest for quotes, proofs, and dispatch photos. Replies 10:00–19:00 IST, six days.", value: "+91 ····· ····· (demo)" },
  { icon: Instagram, title: "@grinrexresin", copy: "Making reels, festival drops, and the occasional 2 a.m. cure log.", value: "DMs open" },
  { icon: Mail, title: "hello@grinrex.in", copy: "For invoices, corporate paperwork, and anything with an attachment.", value: "3-day reply" },
  { icon: MapPin, title: "The bench", copy: "Home studio in South Delhi — visits by appointment, because pouring is a scheduled thing.", value: "By appointment" },
];

export default function Contact() {
  const [placed, setPlaced] = useState<string | null>(null);
  const form = useForm<z.input<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { name: "", phone: "", topic: "A custom piece", message: "" } });

  const onSubmit = form.handleSubmit((values) => {
    const lead = saveLead({ kind: "contact", name: values.name.trim(), phone: values.phone.trim(), city: values.topic, detail: values.message.trim() });
    setPlaced(lead.ref);
  });

  return (
    <StorePage
      label="Contact the studio"
      title={<>Real people,<br /><em>at a real bench.</em></>}
      lead="One studio answers every channel — the same voice from first message to dispatch photo. Pick whichever lane fits the question."
      className="page-contact"
    >
      <div className="contact-grid">
        <div className="contact-channels">
          {channels.map((channel) => (
            <article className="contact-card" key={channel.title}>
              <channel.icon size={19} />
              <div><b>{channel.title}</b><p>{channel.copy}</p></div>
              <em>{channel.value}</em>
            </article>
          ))}
          <p className="quote-foot">Demo notice: these are illustrative handles. Forms on this site save to your browser only — nothing reaches any inbox.</p>
        </div>

        <aside className="wedding-form tall">
          {placed ? (
            <div className="success-card">
              <span className="success-mark"><Mail size={20} /></span>
              <h3>Message kept · {placed}</h3>
              <p>A real studio replies the same evening. Yours stayed local, exactly as promised.</p>
              <Link className="amber-button" href="/shop">Meanwhile — browse the shop</Link>
              <button className="text-button" onClick={() => { setPlaced(null); form.reset(); }}>Write another</button>
            </div>
          ) : (
            <form className="order-form" onSubmit={onSubmit} noValidate>
              <p className="micro-label">Send a note</p>
              <div className="inline-pair">
                <label className="field"><span>Name</span><input {...form.register("name")} />
                  {form.formState.errors.name && <em className="field-error">{form.formState.errors.name.message}</em>}</label>
                <label className="field"><span>Mobile</span><input inputMode="numeric" {...form.register("phone")} />
                  {form.formState.errors.phone && <em className="field-error">{form.formState.errors.phone.message}</em>}</label>
              </div>
              <label className="field"><span>Topic</span><select {...form.register("topic")}>
                <option>A custom piece</option><option>Wedding lot</option><option>Corporate lot</option><option>Workshops</option><option>Press / collab</option><option>Just saying hi</option>
              </select></label>
              <label className="field"><span>Message</span><textarea rows={5} {...form.register("message")} placeholder="What are you thinking of casting?" />
                {form.formState.errors.message && <em className="field-error">{form.formState.errors.message.message}</em>}</label>
              <button className="amber-button full" type="submit">Send to the bench <ArrowRight size={15} /></button>
            </form>
          )}
        </aside>
      </div>
    </StorePage>
  );
}
