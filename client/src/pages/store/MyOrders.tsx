/**
 * My orders — everything placed in this browser (shop, studio, checkout, builder),
 * plus the seeded studio records, with live status per order.
 */
import { Link } from "wouter";
import { ArrowRight, RotateCcw } from "lucide-react";
import StorePage from "@/components/StorePage";
import { allOrders, progressFor, resetDemoOrders } from "@/lib/orders";
import { formatINR } from "@/lib/costing";

export default function MyOrders() {
  const orders = [...allOrders()].sort((a, b) => b.placedAt.localeCompare(a.placedAt));

  return (
    <StorePage
      label="My orders"
      title={<>Everything you’ve<br /><em>put on the bench.</em></>}
      lead="A real store would keep this on an account; a demo keeps it in your browser. Either way — status updates as the studio moves."
      className="page-orders"
      aside={
        orders.length > 4 ? (
          <button className="text-button" onClick={() => { resetDemoOrders(); window.location.reload(); }}><RotateCcw size={13} /> Clear your demo orders</button>
        ) : undefined
      }
    >
      {orders.length === 0 ? (
        <p className="store-lead">Nothing yet — place a demo order from the <Link className="inline-link" href="/shop">shop</Link> or the <Link className="inline-link" href="/studio">studio</Link>.</p>
      ) : (
        <div className="orders-table">
          {orders.map((order) => {
            const progress = progressFor(order);
            return (
              <article className="order-row" key={order.ref}>
                <div className="order-row-ref">
                  <b>{order.ref}</b>
                  <span>{new Date(order.placedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                </div>
                <div className="order-row-items">
                  {order.items.map((item, i) => <p key={i}>{item.quantity}× {item.name}{item.personalization ? ` — “${item.personalization}”` : ""}</p>)}
                </div>
                <div className="order-row-status">
                  <em className={progress.dispatched ? "is-dispatched" : ""}>{progress.dispatched ? "Dispatched" : progress.timeline[progress.stageIndex].title}</em>
                  <div className="track-progress thin"><i style={{ width: `${progress.percent}%` }} /></div>
                </div>
                <div className="order-row-end">
                  <strong>{formatINR(order.total)}</strong>
                  <Link href={`/order/${order.ref}`}>Open <ArrowRight size={13} /></Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </StorePage>
  );
}
