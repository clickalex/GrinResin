/**
 * Checkout — a real-shaped order form (zod-validated), but a demo studio:
 * payment is chosen, never processed. Placing an order writes a trackable record.
 */
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CreditCard, Landmark, PackageCheck, Wallet } from "lucide-react";
import StorePage from "@/components/StorePage";
import { useCart } from "@/lib/cart";
import { nextRef, saveOrder } from "@/lib/orders";
import { formatINR } from "@/lib/costing";

const schema = z.object({
  name: z.string().trim().min(2, "The proof needs a name.").max(60),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, "A 10-digit mobile — proofs go over WhatsApp."),
  email: z.union([z.literal(""), z.string().trim().email("Looks off — check the @ and the dot.")]).optional(),
  address: z.string().trim().min(10, "House, street, landmark — courier legs, please."),
  city: z.string().trim().min(2, "City for the shipping note."),
  pincode: z.string().trim().regex(/^[1-9]\d{5}$/, "Six-digit PIN code."),
  date: z.string().optional(),
  payment: z.enum(["upi", "cod", "bank"]),
  consent: z.boolean().refine((v) => v, "We need the OK to hold your piece’s brief."),
});

type FormValues = z.input<typeof schema>;

export default function CheckoutPage() {
  const cart = useCart();
  const [, setLocation] = useLocation();
  const [minDate] = useState(() => new Date(Date.now() + 5 * 86_400_000).toISOString().slice(0, 10));

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", phone: "", email: "", address: "", city: "", pincode: "", date: "", payment: "upi", consent: false },
  });

  if (!cart.items.length) {
    return (
      <StorePage label="Checkout" title={<>Nothing to<br /><em>check out yet.</em></>} className="page-checkout">
        <p className="store-lead">The cart is empty — fill it from the shop or the studio first.</p>
        <div className="demo-next">
          <Link className="amber-button" href="/shop">Open the shop</Link>
          <Link className="text-button" href="/studio">Design a piece</Link>
        </div>
      </StorePage>
    );
  }

  const onSubmit = form.handleSubmit((values) => {
    const order = {
      ref: nextRef(),
      placedAt: new Date().toISOString(),
      channel: "store" as const,
      customer: values.name.trim(),
      city: values.city.trim(),
      notes: `${values.address.trim()}, ${values.city.trim()} ${values.pincode.trim()} · paid by ${values.payment === "upi" ? "UPI" : values.payment === "cod" ? "cash on delivery" : "bank transfer"}${values.date ? ` · wanted by ${values.date}` : ""}${values.email ? ` · ${values.email}` : ""}`,
      total: cart.subtotal,
      items: cart.items.map((line) => ({
        productId: line.productId ?? 0,
        name: line.name,
        personalization: line.personalization,
        quantity: line.quantity,
        unitPrice: line.unitPrice,
        kind: line.kind,
        design: line.design,
      })),
    };
    saveOrder(order);
    cart.clear();
    setLocation(`/order/${order.ref}`);
  });

  return (
    <StorePage label="Checkout · demo studio" title={<>One form, then<br /><em>a proof arrives.</em></>} className="page-checkout">
      <div className="checkout-grid">
        <form className="order-form" onSubmit={onSubmit} noValidate>
          <fieldset>
            <legend>01 · Who it’s for</legend>
            <div className="inline-pair">
              <label className="field">
                <span>Name on the order</span>
                <input {...form.register("name")} placeholder="Full name" />
                {form.formState.errors.name && <em className="field-error">{form.formState.errors.name.message}</em>}
              </label>
              <label className="field">
                <span>WhatsApp number</span>
                <input inputMode="numeric" {...form.register("phone")} placeholder="10 digits" />
                {form.formState.errors.phone && <em className="field-error">{form.formState.errors.phone.message}</em>}
              </label>
            </div>
            <label className="field">
              <span>Email (optional — receipt & proof copy)</span>
              <input {...form.register("email")} placeholder="you@example.com" />
              {form.formState.errors.email && <em className="field-error">{form.formState.errors.email.message}</em>}
            </label>
          </fieldset>
          <fieldset>
            <legend>02 · Where it lands</legend>
            <label className="field">
              <span>Delivery address</span>
              <textarea rows={2} {...form.register("address")} placeholder="Flat, building, street, landmark" />
              {form.formState.errors.address && <em className="field-error">{form.formState.errors.address.message}</em>}
            </label>
            <div className="inline-pair">
              <label className="field">
                <span>City</span>
                <input {...form.register("city")} />
                {form.formState.errors.city && <em className="field-error">{form.formState.errors.city.message}</em>}
              </label>
              <label className="field">
                <span>PIN code</span>
                <input inputMode="numeric" maxLength={6} {...form.register("pincode")} />
                {form.formState.errors.pincode && <em className="field-error">{form.formState.errors.pincode.message}</em>}
              </label>
            </div>
            <label className="field">
              <span>Needed by (optional · earliest ≈ 5 days)</span>
              <input type="date" min={minDate} {...form.register("date", { validate: (v) => !v || v >= minDate || `Cure + QC needs dates on or after ${minDate}.` })} />
              {form.formState.errors.date && <em className="field-error">{form.formState.errors.date.message as string}</em>}
            </label>
          </fieldset>
          <fieldset>
            <legend>03 · Payment (demo — nothing is charged)</legend>
            <div className="pay-row">
              {([
                ["upi", "UPI collect", "A link lands after the proof"],
                ["cod", "Cash on delivery", "Under ₹2,000, selected cities"],
                ["bank", "Bank transfer", "For bulk & corporate lots"],
              ] as const).map(([value, label, detail]) => (
                <label key={value} className={`pay-option ${form.watch("payment") === value ? "is-active" : ""}`}>
                  <input type="radio" value={value} {...form.register("payment")} />
                  {value === "upi" ? <Wallet size={16} /> : value === "cod" ? <Landmark size={16} /> : <CreditCard size={16} />}
                  <b>{label}</b>
                  <span>{detail}</span>
                </label>
              ))}
            </div>
            {form.formState.errors.payment && <em className="field-error">{form.formState.errors.payment.message}</em>}
          </fieldset>
          <label className="check consent">
            <input type="checkbox" {...form.register("consent")} />
            <span>I understand this is a demo order — kept in my browser, nothing sent, nothing charged.</span>
          </label>
          {form.formState.errors.consent && <em className="field-error">{form.formState.errors.consent.message}</em>}
          <button className="amber-button full" type="submit"><PackageCheck size={16} /> Place the order — {formatINR(cart.subtotal)}</button>
        </form>

        <aside className="cart-aside">
          <div className="quote-sheet-top"><span>Locked at proof</span><em>{cart.count} pieces</em></div>
          {cart.items.map((line) => (
            <div className="line-row" key={line.key}>
              <div>
                <b>{line.quantity} × {line.name}</b>
                {line.personalization && <em>“{line.personalization}”</em>}
              </div>
              <span>{formatINR(line.unitPrice * line.quantity)}</span>
            </div>
          ))}
          <div className="cart-sum-total"><span>Payable</span><strong>{formatINR(cart.subtotal)}</strong></div>
          <p className="quote-foot">Prices freeze once you approve the proof. Cancellations before the pour are fine — after it, the resin decides.</p>
        </aside>
      </div>
    </StorePage>
  );
}
