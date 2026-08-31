/**
 * GrinRex Resin — demo order store.
 * The shop, quote builder, and tracker share one localStorage-backed order list so the
 * demos behave like a small real system. Demo orders never leave the browser.
 */
import { hashString } from "./costing";
import { trackerStages } from "@/data/presentation";

export type DemoOrderItem = {
  productId: number;
  name: string;
  personalization?: string;
  quantity: number;
  unitPrice: number;
};

export type DemoOrder = {
  ref: string;
  placedAt: string; // ISO
  channel: "shop" | "custom-quote" | "seed";
  customer: string;
  city: string;
  notes?: string;
  items: DemoOrderItem[];
  total: number;
};

const STORAGE_KEY = "grinrex-demo-orders-v1";

const SEED_ORDERS: DemoOrder[] = [
  {
    ref: "GRX-1001", placedAt: "2026-08-27T09:15:00.000Z", channel: "seed",
    customer: "Ananya R.", city: "Pune", notes: "Match petals to the invitation blush.",
    items: [{ productId: 101, name: "Wedding Date Keepsake", personalization: "Aarav & Meera · 14 Nov", quantity: 24, unitPrice: 349 }],
    total: 8376,
  },
  {
    ref: "GRX-1002", placedAt: "2026-08-29T14:40:00.000Z", channel: "seed",
    customer: "Faizan K.", city: "Hyderabad", notes: "Photo from the 1998 print only, no digital.",
    items: [{ productId: 34, name: "Memory Photo Block", personalization: "Grandmother's kitchen, 1998", quantity: 1, unitPrice: 749 }],
    total: 749,
  },
  {
    ref: "GRX-1003", placedAt: "2026-08-30T05:05:00.000Z", channel: "seed",
    customer: "Nikhil S.", city: "Bengaluru", notes: "Gift box in sage, ribbon in chalk.",
    items: [
      { productId: 29, name: "Custom Name Keychain", personalization: "Ishita", quantity: 3, unitPrice: 249 },
      { productId: 58, name: "Jewelry Tray", personalization: "", quantity: 1, unitPrice: 329 },
    ],
    total: 1076,
  },
  {
    ref: "GRX-1004", placedAt: "2026-08-21T10:00:00.000Z", channel: "seed",
    customer: "Lakshmi Deepak", city: "Chennai", notes: "Send the packing photo before dispatch, please.",
    items: [{ productId: 135, name: "Pet Memorial Pendant", personalization: "In memory of Coco", quantity: 2, unitPrice: 549 }],
    total: 1098,
  },
];

function readStore(): DemoOrder[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as DemoOrder[]) : [];
  } catch {
    return [];
  }
}

function writeStore(orders: DemoOrder[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch {
    /* storage unavailable — demos still work in-memory */
  }
}

export function allOrders(): DemoOrder[] {
  return [...SEED_ORDERS, ...readStore()];
}

export function nextRef(): string {
  const taken = new Set(allOrders().map((order) => order.ref));
  for (let attempt = 0; attempt < 400; attempt += 1) {
    const candidate = `GRX-${1000 + (Math.floor(Math.random() * 9000) + attempt) % 9000}`;
    if (!taken.has(candidate)) return candidate;
  }
  return `GRX-${Date.now().toString().slice(-4)}`;
}

export function saveOrder(order: DemoOrder) {
  writeStore([order, ...readStore()]);
}

export function resetDemoOrders() {
  writeStore([]);
}

export type OrderProgress = {
  stageIndex: number;
  percent: number;
  etaDays: number;
  timeline: { title: string; detail: string; done: boolean; current: boolean }[];
  dispatched: boolean;
  awb?: string;
};

/** Demo orders move through eight studio states over ~6 working days. */
export function progressFor(order: DemoOrder, now = new Date()): OrderProgress {
  const placed = new Date(order.placedAt).getTime();
  const elapsedDays = Math.max(0, (now.getTime() - placed) / 86_400_000);
  const jitter = (hashString(order.ref) % 100) / 100;
  const stageIndex = Math.min(trackerStages.length - 1, Math.floor(elapsedDays / 0.8 + jitter));
  const dispatched = stageIndex >= trackerStages.length - 1;
  const percent = Math.round(((stageIndex + (dispatched ? 1 : 0.35)) / trackerStages.length) * 100);
  const timeline = trackerStages.map((stage, index) => ({
    title: stage.title,
    detail: stage.detail,
    done: index < stageIndex,
    current: index === stageIndex,
  }));
  return {
    stageIndex,
    percent: Math.min(100, percent),
    etaDays: Math.max(0, Math.ceil(6 - elapsedDays)),
    timeline,
    dispatched,
    awb: dispatched ? `IND${(hashString(order.ref) % 90_000_000) + 10_000_000}` : undefined,
  };
}

export function findOrder(ref: string): DemoOrder | undefined {
  const needle = ref.trim().toUpperCase();
  return allOrders().find((order) => order.ref.toUpperCase() === needle || order.ref.toUpperCase() === `GRX-${needle.replace(/^GRX-?/, "")}`);
}
