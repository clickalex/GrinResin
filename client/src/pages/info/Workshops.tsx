/**
 * Workshops — the future branch from the revenue stack, made bookable (demo seats).
 */
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowRight, CalendarDays, Users, Wine } from "lucide-react";
import StorePage from "@/components/StorePage";
import { dropLead, readLeads, saveLead } from "@/lib/leads";

const sessions = [
  { id: "sat-12-sep", date: "Sat 12 Sep 2026", time: "10:00 – 1:30", theme: "First pour: coasters & bookmarks", seats: 8, price: 1499 },
  { id: "sun-27-sep", date: "Sun 27 Sep 2026", time: "15:00 – 18:30", theme: "Botanical keepsakes: preserve a petal", seats: 6, price: 1699 },
  { id: "sat-10-oct", date: "Sat 10 Oct 2026", time: "10:00 – 1:30", theme: "Names & monograms: cast personal gifts", seats: 8, price: 1499 },
];

const schema = z.object({
  name: z.string().trim().min(2, "Name for the seat list."),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, "10-digit WhatsApp."),
  sessionId: z.enum(sessions.map((s) => s.id) as [string, ...string[]]),
  guests: z.coerce.number().int().min(1).max(3),
});

export default function Workshops() {
  const [version, force] = useState(0);
  const [justBooked, setJustBooked] = useState<{ ref: string; session: string } | null>(null);
  const bookings = useMemo(() => readLeads().filter((lead) => lead.kind === "workshop"), [version]);
  const bookedSeats = (id: string) =>
    bookings.filter((b) => b.detail.startsWith(id)).reduce((sum, b) => sum + (Number(b.detail.match(/×(\d+)/)?.[1]) || 1), 0);
  const form = useForm<z.input<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { name: "", phone: "", sessionId: sessions[0].id, guests: 1 } });
  const chosenSession = sessions.find((s) => s.id === form.watch("sessionId")) ?? sessions[0];

  const onSubmit = form.handleSubmit((values) => {
    const session = sessions.find((s) => s.id === values.sessionId)!;
    const guests = Math.max(1, Math.min(3, Number(values.guests) || 1));
    const left = session.seats - bookedSeats(session.id) - guests;
    if (left < 0) { form.setError("guests", { message: `Only ${Math.max(0, session.seats - bookedSeats(session.id))} seat(s) left.` }); return; }
    const lead = saveLead({
      kind: "workshop", name: values.name.trim(), phone: values.phone.trim(), city: session.date,
      detail: `${session.id} ×${guests} · ${session.theme}`,
    });
    force((n) => n + 1);
    form.reset();
    setJustBooked({ ref: lead.ref, session: session.date });
  });

  return (
    <StorePage
      label="Workshops · hands on the bench"
      title={<>Pour it yourself,<br /><em>the safe way.</em></>}
      lead="The revenue stack ends in workshops for a reason: they teach the material, earn trust, and quietly recruit future customers. Small batches, real safety gear, everything yours to take home."
      className="page-workshops"
      aside={<div className="wedding-aside"><Wine size={17} /><p><b>₹1,499–1,699 · kit included.</b> Molds, resin, botanicals, PPE, and your finished pieces go home in a gift box.</p></div>}
    >
      <div className="wedding-grid">
        <div className="session-list">
          {sessions.map((session) => {
            const taken = bookedSeats(session.id);
            const left = session.seats - taken;
            return (
              <article className="session-card" key={session.id}>
                <div className="session-when"><CalendarDays size={15} /><b>{session.date}</b><span>{session.time}</span></div>
                <h3>{session.theme}</h3>
                <div className="session-foot">
                  <p><Users size={13} /> {left > 0 ? `${left} of ${session.seats} seats open` : "Full — join the waitlist"}</p>
                  <div className="seat-bar"><i style={{ width: `${(taken / session.seats) * 100}%` }} /></div>
                  <b>₹{session.price.toLocaleString("en-IN")}</b>
                </div>
                <button className={left > 0 ? "amber-button" : "text-button"} disabled={left === 0} onClick={() => form.setValue("sessionId", session.id)}>
                  {left > 0 ? "Pick this session" : "Waitlist only"} <ArrowRight size={14} />
                </button>
              </article>
            );
          })}
          {bookings.length > 0 && (
            <div className="my-bookings">
              <p className="micro-label">Your bookings</p>
              {bookings.map((b) => (
                <div className="booking-row" key={b.ref}>
                  <b>{b.ref}</b><span>{b.city} · {b.detail.split(" · ")[1]}</span>
                  <button onClick={() => { dropLead(b.ref); force((n) => n + 1); }}>Cancel</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <aside className="wedding-form">
          {justBooked ? (
            <div className="success-card">
              <span className="success-mark"><Users size={20} /></span>
              <h3>Seat held · {justBooked.ref}</h3>
              <p>{justBooked.session} — the studio would confirm by WhatsApp within the hour and share what to wear (closed shoes, tied hair, sleeves you don’t love).</p>
              <button className="amber-button" onClick={() => setJustBooked(null)}>Book another</button>
            </div>
          ) : (
            <form className="order-form" onSubmit={onSubmit} noValidate>
              <p className="micro-label">Booking · {chosenSession.date}</p>
              <div className="inline-pair">
                <label className="field"><span>Name</span><input {...form.register("name")} />
                  {form.formState.errors.name && <em className="field-error">{form.formState.errors.name.message}</em>}</label>
                <label className="field"><span>WhatsApp</span><input inputMode="numeric" {...form.register("phone")} />
                  {form.formState.errors.phone && <em className="field-error">{form.formState.errors.phone.message}</em>}</label>
              </div>
              <div className="inline-pair">
                <label className="field"><span>Session</span><select {...form.register("sessionId")}>
                  {sessions.map((s) => <option key={s.id} value={s.id}>{s.date} — {s.theme}</option>)}
                </select></label>
                <label className="field"><span>Guests (1–3)</span><input type="number" min={1} max={3} {...form.register("guests")} />
                  {form.formState.errors.guests && <em className="field-error">{form.formState.errors.guests.message as string}</em>}</label>
              </div>
              <button className="amber-button full" type="submit">Hold my seat <ArrowRight size={15} /></button>
              <p className="quote-foot">Demo booking — seats tracked in your browser so the flow behaves; nothing is charged or sent. <Link className="inline-link" href="/contact">Questions</Link> go to the studio.</p>
            </form>
          )}
        </aside>
      </div>
    </StorePage>
  );
}
