/**
 * My designs — the customer's saved casts, editable, orderable, and exportable.
 */
import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Copy, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import StorePage from "@/components/StorePage";
import DesignPreview from "@/components/DesignPreview";
import { deleteDesign, designQuote, readDesigns, saveDesign, uid, type Design } from "@/lib/design";
import { formatINR } from "@/lib/costing";
import { useCart } from "@/lib/cart";

export default function MyDesigns() {
  const [designs, setDesigns] = useState<Design[]>(() => readDesigns());
  const cart = useCart();

  return (
    <StorePage
      label="My designs"
      title={<>Your library of<br /><em>almost-poured pieces.</em></>}
      lead="Every design you save in the studio lives here, in this browser. Send one straight to the cart, open it back up and keep designing, or delete it."
      className="page-designs"
      aside={<Link className="text-button" href="/studio">Open the studio <ArrowRight size={14} /></Link>}
    >
      {designs.length === 0 ? (
        <div className="designs-empty">
          <p>No saved designs yet. The studio keeps your work between visits — save anything you’re not ready to order.</p>
          <Link className="amber-button" href="/studio">Design your own piece <ArrowRight size={15} /></Link>
        </div>
      ) : (
        <div className="designs-grid">
          {designs.map((design) => {
            const { quote } = designQuote(design);
            return (
              <article className="design-card" key={design.id}>
                <Link href={`/studio?design=${design.id}`} className="design-card-canvas">
                  <DesignPreview design={design} />
                </Link>
                <div className="design-card-copy">
                  <b>{design.name}</b>
                  <span>{new Date(design.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · {design.inclusions.length} inclusions{design.text ? " · cast text" : ""}</span>
                  <strong>{formatINR(quote.roundedPrice)}</strong>
                </div>
                <div className="design-card-actions">
                  <button onClick={() => {
                    cart.add({
                      kind: "design",
                      name: design.name,
                      unitPrice: quote.roundedPrice,
                      cost: quote.costWithWastage,
                      quantity: design.quantity,
                      personalization: design.text.trim() || undefined,
                      design,
                    });
                    toast.success("Added to cart", { description: `${design.quantity} × ${formatINR(quote.roundedPrice)}` });
                  }}><ShoppingBag size={14} /> Order</button>
                  <Link href={`/studio?design=${design.id}`}>Edit</Link>
                  <button onClick={() => { const copy = { ...design, id: uid(), name: `${design.name} copy`, createdAt: new Date().toISOString() }; setDesigns(saveDesign(copy)); toast("Duplicated — edit the copy freely"); }} aria-label="Duplicate design"><Copy size={14} /></button>
                  <button className="danger" onClick={() => { setDesigns(deleteDesign(design.id)); toast("Design removed"); }} aria-label="Delete design"><Trash2 size={14} /></button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </StorePage>
  );
}
