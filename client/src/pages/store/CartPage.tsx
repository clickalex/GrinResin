/**
 * The cart — product lines and custom design lines side by side, each design showing
 * its live SVG preview. Checkout happens on the next page; nothing pays here.
 */
import { Link } from "wouter";
import { ArrowRight, Trash2 } from "lucide-react";
import StorePage from "@/components/StorePage";
import { useCart } from "@/lib/cart";
import { formatINR } from "@/lib/costing";
import DesignPreview from "@/components/DesignPreview";

export default function CartPage() {
  const cart = useCart();

  if (!cart.items.length) {
    return (
      <StorePage label="Cart" title={<>The tray is<br /><em>waiting.</em></>} className="page-cart">
        <p className="store-lead">Nothing here yet — start from the launch edit, or pour your own piece in the studio.</p>
        <div className="demo-next">
          <Link className="amber-button" href="/shop">Open the shop <ArrowRight size={15} /></Link>
          <Link className="text-button" href="/studio">Design your own piece <ArrowRight size={15} /></Link>
        </div>
      </StorePage>
    );
  }

  return (
    <StorePage label="Cart · one step from the proof" title={<>Review, then send it<br /><em>to the bench.</em></>} className="page-cart">
      <div className="cart-flow">
        <div className="cart-lines">
          {cart.items.map((line) => (
            <div className="cart-line" key={line.key}>
              <div className="cart-thumb">
                {line.kind === "design" && line.design ? (
                  <DesignPreview design={line.design} />
                ) : (
                  <span className="cart-thumb-mark">{String(line.productId ?? 0).padStart(3, "0")}</span>
                )}
              </div>
              <div className="cart-line-copy">
                <b>{line.name}</b>
                <span className="cart-kind">{line.kind === "design" ? "your design · placed inclusions, guardrail-priced" : "shop piece · from the launch edit"}</span>
                {line.personalization && <em>“{line.personalization}”</em>}
              </div>
              <div className="cart-line-tools">
                <div className="stepper dark">
                  <button onClick={() => cart.setQuantity(line.key, line.quantity - 1)} aria-label="Decrease">−</button>
                  <b>{line.quantity}</b>
                  <button onClick={() => cart.setQuantity(line.key, line.quantity + 1)} aria-label="Increase">+</button>
                </div>
                <p>{formatINR(line.unitPrice * line.quantity)}</p>
                <button className="cart-remove" onClick={() => cart.remove(line.key)} aria-label={`Remove ${line.name}`}><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>

        <aside className="cart-aside">
          <div className="quote-sheet-top"><span>Order summary</span><em>{cart.count} pieces</em></div>
          <div className="cart-sum-rows">
            <div><span>Subtotal</span><b>{formatINR(cart.subtotal)}</b></div>
            <div><span>Shipping</span><b>quoted at proof</b></div>
            <div><span>Studio contribution covered</span><b>{formatINR(cart.contribution)}</b></div>
          </div>
          <div className="cart-sum-total"><span>Total now</span><strong>{formatINR(cart.subtotal)}</strong></div>
          <Link className="amber-button full" href="/checkout">Go to checkout <ArrowRight size={15} /></Link>
          <button className="text-button" onClick={cart.clear}>Empty the tray</button>
          <p className="quote-foot">Checkout asks who you are and where it goes — the price never moves after a proof is approved.</p>
        </aside>
      </div>
    </StorePage>
  );
}
