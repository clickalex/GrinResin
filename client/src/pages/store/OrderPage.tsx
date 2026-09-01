/**
 * /order/:ref — confirmation + live status for one order. Designs render from their
 * snapshot, the timeline mirrors the studio states, and a receipt can be downloaded.
 */
import { Link } from "wouter";
import { ArrowRight, Check, Download, Truck } from "lucide-react";
import StorePage from "@/components/StorePage";
import { allOrders, findOrder, progressFor } from "@/lib/orders";
import { formatINR } from "@/lib/costing";
import DesignPreview from "@/components/DesignPreview";
import { downloadText } from "@/components/DesignPreview";

export default function OrderPage({ ref: refParam }: { ref: string }) {
  const ref = decodeURIComponent(refParam ?? "");
  const order = findOrder(ref);

  if (!order) {
    return (
      <StorePage label="Order" title={<>No record at<br /><em>this reference.</em></>} className="page-order">
        <p className="store-lead">“{ref}” isn’t in the demo drawer. Orders live in this browser — check the reference, or open your orders.</p>
        <div className="demo-next">
          <Link className="amber-button" href="/orders">My orders <ArrowRight size={15} /></Link>
          <Link className="text-button" href="/shop">Back to the shop</Link>
        </div>
      </StorePage>
    );
  }

  const progress = progressFor(order);
  const receipt = [
    "GRINREX RESIN — ORDER RECEIPT (demo)",
    "─".repeat(44),
    `Ref        ${order.ref}`,
    `Placed     ${new Date(order.placedAt).toLocaleString("en-IN")}`,
    `Customer   ${order.customer} · ${order.city}`,
    `Status     ${progress.dispatched ? "Dispatched" : progress.timeline[progress.stageIndex].title}`,
    ``,
    ...order.items.map((item) => `${String(item.quantity).padStart(3)}× ${item.name}${item.personalization ? ` — “${item.personalization}”` : ""}   ${formatINR(item.unitPrice * item.quantity)}`),
    ``,
    `Total      ${formatINR(order.total)}`,
    order.notes ? `Notes      ${order.notes}` : "",
    ``,
    "Demo receipt — no payment processed, no data sent.",
  ].filter(Boolean).join("\n");

  return (
    <StorePage
      label={`Order ${order.ref}`}
      title={order.channel === "store" ? <>Order placed.<br /><em>Proof first, pour second.</em></> : <>Studio record<br /><em>{order.ref}.</em></>}
      className="page-order"
      aside={
        <div className="order-aside-card">
          <span>{progress.dispatched ? "Dispatched" : "In the studio"}</span>
          <strong>{progress.percent}%</strong>
          <div className="track-progress"><i style={{ width: `${progress.percent}%` }} /></div>
          <p>{progress.dispatched ? <>AWB <b>{progress.awb}</b> · delivered in 2–5 days after dispatch</> : `≈ ${progress.etaDays} more working day${progress.etaDays === 1 ? "" : "s"} to dispatch`}</p>
        </div>
      }
    >
      <div className="order-layout">
        <div>
          <div className="order-items">
            {order.items.map((item, index) => (
              <article className="order-item" key={index}>
                <div className="cart-thumb design">
                  {item.design ? <DesignPreview design={item.design} /> : <span className="cart-thumb-mark">{String(item.productId || index + 1).padStart(3, "0")}</span>}
                </div>
                <div className="order-item-copy">
                  <b>{item.quantity} × {item.name}</b>
                  {item.personalization && <em>“{item.personalization}”</em>}
                  {item.design && (
                    <p className="order-specs">
                      {item.design.shape} · {item.design.size} · {item.design.inclusions.length} inclusions · {item.design.finish} · {item.design.packaging} box
                      {item.design.rush ? " · rush slot" : ""}
                    </p>
                  )}
                  {item.design?.note && <p className="order-notes">“{item.design.note}”</p>}
                </div>
                <div className="order-item-price">
                  <strong>{formatINR(item.unitPrice * item.quantity)}</strong>
                  <span>{formatINR(item.unitPrice)} each</span>
                </div>
              </article>
            ))}
          </div>
          <div className="order-meta-row">
            <p>{order.customer} · {order.city}{order.notes ? ` · ${order.notes}` : ""}</p>
            <button className="text-button" onClick={() => downloadText(`grinrex-receipt-${order.ref.toLowerCase()}.txt`, receipt, "text/plain")}><Download size={14} /> Receipt</button>
          </div>
        </div>

        <ol className="track-timeline order-timeline">
          {progress.timeline.map((step, index) => (
            <li key={step.title} className={step.done ? "done" : step.current ? "current" : ""}>
              <span className="track-step-mark">{step.done ? <Check size={13} /> : index + 1}</span>
              <div>
                <b>{step.title}</b>
                <p>{step.detail}</p>
              </div>
              {step.current && !step.done && <em className="track-live"><Truck size={11} /> now</em>}
            </li>
          ))}
        </ol>
      </div>

      <div className="order-next">
        <Link className="text-button" href="/orders">See all my orders</Link>
        <Link className="amber-button" href="/studio">Start another design <ArrowRight size={15} /></Link>
        {allOrders().length <= 4 && <Link className="text-button" href="/demos/track">Compare with the seeded demo refs</Link>}
      </div>
    </StorePage>
  );
}
