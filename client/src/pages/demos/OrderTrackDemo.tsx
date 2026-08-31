/**
 * Working demo — order status through the eight studio states that sit over the
 * 16-step production process. Reads seeded references plus any order placed in the
 * shop or builder demos (localStorage), and lets you reset them.
 */
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Check, RotateCcw, Search, Truck } from "lucide-react";
import DemoShell from "./DemoShell";
import { formatINR } from "@/lib/costing";
import { allOrders, findOrder, progressFor, resetDemoOrders, type DemoOrder } from "@/lib/orders";

function RefChip({ order, onPick }: { order: DemoOrder; onPick: (ref: string) => void }) {
  const progress = progressFor(order);
  return (
    <button className="ref-chip" onClick={() => onPick(order.ref)}>
      <b>{order.ref}</b>
      <span>{progress.dispatched ? "Dispatched" : progress.timeline[progress.stageIndex].title}</span>
      <em>{order.customer.split(" ")[0]} · {order.city}</em>
    </button>
  );
}

export default function OrderTrackDemo() {
  const initialRef = useMemo(() => new URLSearchParams(window.location.search).get("ref") ?? "", []);
  const [query, setQuery] = useState(initialRef);
  const [result, setResult] = useState<{ ref: string; ok: boolean } | null>(
    initialRef ? { ref: initialRef, ok: Boolean(findOrder(initialRef)) } : null
  );

  const orders = allOrders();
  const found = result?.ok ? findOrder(result.ref) : undefined;
  const progress = found ? progressFor(found) : null;

  const lookup = (raw?: string) => {
    const ref = (raw ?? query).trim().toUpperCase();
    setQuery(ref);
    setResult(ref ? { ref, ok: Boolean(findOrder(ref)) } : null);
  };

  return (
    <DemoShell
      className="demo-track"
      intro="Production & care · where my piece is right now"
      title={<>Every pour is<br /><em>a promise with a queue.</em></>}
      next={{ href: "/demos/shop", label: "Place another demo order" }}
    >
      <div className="track-lookup reveal">
        <div className="demo-search">
          <Search size={16} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && lookup()}
            placeholder="Order reference — try GRX-1002 or GRX-1004"
            aria-label="Order reference"
          />
        </div>
        <button className="amber-button" onClick={() => lookup()}>Track <ArrowRight size={15} /></button>
        <button className="text-button" onClick={() => { resetDemoOrders(); setResult(null); setQuery(""); }}><RotateCcw size={14} /> Reset demo orders</button>
      </div>

      {result && !result.ok && (
        <p className="track-error reveal">No studio record for “{result.ref}”. Check the digits — or pick one of the references below to see the flow.</p>
      )}

      {found && progress && (
        <div className="track-card reveal">
          <div className="track-head">
            <div>
              <p className="micro-label"><span /> {found.ref} · {found.channel === "shop" ? "launch shop order" : found.channel === "custom-quote" ? "custom brief" : "studio demo record"}</p>
              <h3>{found.items.map((item) => `${item.quantity}× ${item.name}`).join(", ")}</h3>
              {found.items.some((item) => item.personalization) && (
                <p className="track-personalization">{found.items.filter((item) => item.personalization).map((item) => `“${item.personalization}”`).join(" ")}</p>
              )}
              <p className="track-meta">{found.customer} · {found.city} · {formatINR(found.total)} · placed {new Date(found.placedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
              {found.notes && <p className="track-notes">“{found.notes}”</p>}
            </div>
            <div className="track-score">
              <span>Progress</span>
              <strong>{progress.percent}%</strong>
              <div className="track-progress"><i style={{ width: `${progress.percent}%` }} /></div>
              <p>{progress.dispatched
                ? <>Dispatched · courier AWB <b>{progress.awb}</b></>
                : <>Est. {progress.etaDays} more working day{progress.etaDays === 1 ? "" : "s"} to dispatch</>}
              </p>
              {!progress.dispatched && <p className="track-eta"><Truck size={13} /> Protected packing happens the morning after QC passes — never the same evening.</p>}
            </div>
          </div>
          <ol className="track-timeline">
            {progress.timeline.map((step, index) => (
              <li key={step.title} className={step.done ? "done" : step.current ? "current" : ""}>
                <span className="track-step-mark">{step.done ? <Check size={13} /> : index + 1}</span>
                <div>
                  <b>{step.title}</b>
                  <p>{step.detail}</p>
                </div>
                {step.current && !step.done && <em className="track-live">in the studio now</em>}
              </li>
            ))}
          </ol>
          <p className="track-foot">The eight customer-facing states compress the 16-step <Link className="inline-link" href="/chapters/production">production process</Link>: nothing skips QC, and no food-contact or heat-use claims are made unless the system is verified for that use.</p>
        </div>
      )}

      <div className="track-refs reveal">
        <p className="micro-label">References in the demo drawer {orders.length > 4 && <span className="track-count">· includes your {orders.length - 4} placed order(s)</span>}</p>
        <div className="ref-row">
          {orders.slice(0, 8).map((order) => <RefChip key={order.ref} order={order} onPick={(ref) => lookup(ref)} />)}
        </div>
      </div>
    </DemoShell>
  );
}
