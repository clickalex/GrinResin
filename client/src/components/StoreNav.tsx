/**
 * Store section navigation — the horizontal companion to the presentation rail.
 * Cart link carries the live item count so the whole store feels connected.
 */
import { Link, useLocation } from "wouter";
import { Heart, LayoutGrid, Palette, ShoppingBag, Tickets } from "lucide-react";
import { useCart } from "@/lib/cart";

const links = [
  { href: "/shop", label: "Shop", icon: LayoutGrid },
  { href: "/studio", label: "Design your own", icon: Palette },
  { href: "/designs", label: "My designs", icon: Heart },
  { href: "/orders", label: "My orders", icon: Tickets },
];

export default function StoreNav() {
  const [location] = useLocation();
  const { count } = useCart();
  return (
    <nav className="store-nav" aria-label="Store navigation">
      {links.map((link) => (
        <Link key={link.href} href={link.href} className={location === link.href || location.startsWith(`${link.href}/`) ? "is-active" : ""}>
          <link.icon size={14} /> {link.label}
        </Link>
      ))}
      <Link href="/cart" className={`cart-link ${location === "/cart" ? "is-active" : ""}`} aria-label={`Cart, ${count} items`}>
        <ShoppingBag size={14} /> Cart{count > 0 && <b className="cart-badge">{count}</b>}
      </Link>
    </nav>
  );
}
