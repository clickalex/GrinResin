/**
 * GrinRex Resin — the shared cart. Products from the shop and finished designs from the
 * studio both become cart lines; checkout turns lines into an order the tracker can find.
 * Persisted in localStorage so the flow survives refreshes. Demo only — no payment stack.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Design } from "@/lib/design";

export type CartItem = {
  key: string;
  kind: "product" | "design";
  productId?: number;
  name: string;
  unitPrice: number;
  cost: number;
  quantity: number;
  personalization?: string;
  design?: Design;
};

type CartState = {
  items: CartItem[];
  add: (item: Omit<CartItem, "key"> & { key?: string }) => void;
  remove: (key: string) => void;
  setQuantity: (key: string, quantity: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  contribution: number;
};

const STORAGE_KEY = "grinrex-cart-v1";
const CartContext = createContext<CartState | null>(null);

function readCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => readCart());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* private mode — cart lives in memory */
    }
  }, [items]);

  const add = useCallback((item: Omit<CartItem, "key"> & { key?: string }) => {
    setItems((current) => {
      const existing = current.find((line) => line.key === item.key || (item.key && line.key === item.key));
      if (existing) {
        return current.map((line) =>
          line === existing ? { ...line, quantity: Math.min(999, line.quantity + item.quantity) } : line
        );
      }
      return [...current, { ...item, key: item.key ?? `${item.kind}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}` }];
    });
  }, []);

  const remove = useCallback((key: string) => setItems((c) => c.filter((line) => line.key !== key)), []);
  const setQuantity = useCallback(
    (key: string, quantity: number) =>
      setItems((current) =>
        quantity <= 0
          ? current.filter((line) => line.key !== key)
          : current.map((line) => (line.key === key ? { ...line, quantity: Math.min(999, quantity) } : line))
      ),
    []
  );
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartState>(() => {
    const subtotal = items.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
    const contribution = items.reduce((sum, line) => sum + (line.unitPrice - line.cost) * line.quantity, 0);
    return { items, add, remove, setQuantity, clear, count: items.reduce((s, l) => s + l.quantity, 0), subtotal, contribution };
  }, [items, add, remove, setQuantity, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartState {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
