/**
 * GrinRex Resin — presentation content model.
 * Every page reads its sequence position, copy, and documents from here so the
 * chapter reel stays consistent across the site.
 */

export type ChapterRoute = {
  /** Two-digit chapter number, e.g. "03". */
  number: string;
  /** Short rail label. */
  rail: string;
  /** Full section label. */
  label: string;
  /** wouter route path. */
  path: string;
  /** One-line description for the cover contents grid. */
  blurb: string;
  /** Optional interactive companion (demo) page. */
  demoPath?: string;
  demoLabel?: string;
};

export const chapters: ChapterRoute[] = [
  {
    number: "01",
    rail: "The promise",
    label: "The promise",
    path: "/",
    blurb: "What GrinRex Resin is and why it exists.",
  },
  {
    number: "02",
    rail: "The opening",
    label: "The opening",
    path: "/chapters/opportunity",
    blurb: "The market opening for meaningful, personalised gifts.",
  },
  {
    number: "03",
    rail: "The system",
    label: "The business system",
    path: "/chapters/revenue",
    blurb: "Revenue streams, sequenced from direct sales outward.",
  },
  {
    number: "04",
    rail: "The studio",
    label: "The studio foundation",
    path: "/chapters/studio",
    blurb: "Bench, materials, safety envelope, and the source setup budget.",
  },
  {
    number: "05",
    rail: "Launch edit",
    label: "The launch collection",
    path: "/chapters/collection",
    blurb: "Twelve launch products distilled from a 150-product idea library.",
  },
  {
    number: "06",
    rail: "Catalogue",
    label: "The full product catalogue",
    path: "/chapters/catalogue",
    blurb: "All 150 source products, kept in context.",
    demoPath: "/demos/catalogue",
    demoLabel: "Open the working catalogue browser",
  },
  {
    number: "07",
    rail: "Discipline",
    label: "Costing, quality & safety",
    path: "/chapters/costing",
    blurb: "The pricing guardrail and every cost component it carries.",
    demoPath: "/demos/pricing",
    demoLabel: "Run the pricing guardrail yourself",
  },
  {
    number: "08",
    rail: "Process",
    label: "The production & care process",
    path: "/chapters/production",
    blurb: "The 16-step route from design to protected dispatch.",
    demoPath: "/demos/track",
    demoLabel: "Track an order through the process",
  },
  {
    number: "09",
    rail: "Market field",
    label: "The market & risk field",
    path: "/chapters/market",
    blurb: "SWOT, channel strategy, and the marketing content system.",
  },
  {
    number: "10",
    rail: "Roadmap",
    label: "The roadmap",
    path: "/chapters/roadmap",
    blurb: "Six stages from starter setup to scaled production.",
  },
  {
    number: "11",
    rail: "Playbook",
    label: "The internal playbook",
    path: "/chapters/playbook",
    blurb: "The metrics every SKU must answer.",
    demoPath: "/demos/order",
    demoLabel: "Build a custom order with the quote sheet",
  },
  {
    number: "12",
    rail: "Investors",
    label: "The investor case",
    path: "/chapters/investor",
    blurb: "Use of funds, milestone logic, and expansion lanes.",
  },
  {
    number: "13",
    rail: "The PRD",
    label: "One page of requirements",
    path: "/documents",
    blurb: "The product, stated once — scope, rules, and what the demo leaves out.",
  },
];

export type DocumentEntry = {
  id: string;
  number: string;
  eyebrow: string;
  title: string;
  /** Markdown file served from client/public/manus-storage/. */
  file: string;
  summary: string[];
};

export const documents: DocumentEntry[] = [
  {
    id: "prd",
    number: "01",
    eyebrow: "Product requirements · one page",
    title: "GrinRex Resin — the demo, stated once",
    file: "grinrex-prd.md",
    summary: [
      "What this site is: a thirteen-chapter pitch reel with a working storefront attached — design studio, guardrail-priced cart and checkout, demo order tracking, and an enquiry desk. Everything runs browser-local; nothing is ever charged.",
      "The old source documents, planning data, and the single-page export archive were retired so that one page states the scope instead.",
    ],
  },
];

export const roadmap = [
  { phase: "01", title: "Starter setup", detail: "Essential tools, safe workspace, restricted palette, multipurpose molds, and sample testing." },
  { phase: "02", title: "MVP catalogue", detail: "Launch 10–12 items, create consistent photography, cost every SKU, and open direct sales." },
  { phase: "03", title: "Customization system", detail: "Build proof approvals for names, photos, flowers, wedding details, and sentimental pieces." },
  { phase: "04", title: "Controlled expansion", detail: "Move toward 50 demand-validated products, bundles, premium editions, and seasonal drops." },
  { phase: "05", title: "Business development", detail: "Introduce selected wholesale, corporate gifting, repeat-customer programs, and marketplace tests." },
  { phase: "06", title: "Scale with proof", detail: "Add SOPs, bulk buying, dedicated workstations, stronger quality control, and B2B capacity." },
];

export const metrics = [
  "Material cost per product",
  "Labor time and cost",
  "Packaging, fees & damage rate",
  "Wastage percentage",
  "Gross & net contribution",
  "Order volume & average order value",
  "Repeat or referral demand",
  "Customer acquisition cost",
];

export const costComponents = [
  "Resin & hardener",
  "Pigments & inclusions",
  "Hardware & packaging",
  "Tool amortization",
  "Labor & electricity",
  "Wastage, fees & shipping",
];

export const swot = [
  { title: "Strengths", summary: "Low setup, personalization, broad gifting potential, online and offline routes." },
  { title: "Constraints", summary: "Cure time, variable conditions, careful finishing, safety controls, early capacity limits." },
  { title: "Openings", summary: "Weddings, corporate gifting, social commerce, kits, workshops, wholesale, and special collections." },
  { title: "Watch-outs", summary: "Low-cost competition, material volatility, copycats, shipping damage, and compliance expectations." },
];

export const launchEdit = [
  "Keychains", "Earrings", "Bookmarks", "Coasters", "Personalized Nameplates", "Fridge Magnets",
  "Photo Blocks", "Jewelry Dishes", "Ring Dishes", "Phone Stands", "Wedding Keepsakes", "Pet Memorial Products",
];

export const productionSteps = [
  "Design concept", "Mold selection", "Workspace preparation", "Measure resin & hardener",
  "Slow mixing", "Pigments & inclusions", "Pour", "Bubble removal", "Cure", "Demold",
  "Trim & sand", "Drill / assembly", "Polish & hardware", "Quality inspection",
  "Protective packaging", "Storage & dispatch",
];

/** 16 source steps compressed into the eight states a customer is shown. */
export const trackerStages = [
  { key: "received", title: "Order received", detail: "Payment confirmed; brief and personalization text logged." },
  { key: "proof", title: "Design proof", detail: "Layout, name spelling, and inclusion placement approved by the customer." },
  { key: "mix", title: "Mold, mix & pour", detail: "Measured resin mixed with pigment and inclusions, then poured." },
  { key: "cure", title: "Curing", detail: "Full cure under controlled temperature and humidity — never rushed." },
  { key: "finish", title: "Demold & finish", detail: "Trim, sand, drill, polish, and attach hardware after the cast is ready." },
  { key: "qc", title: "Quality inspection", detail: "Cure, bubbles, cracks, dimensions, personalization, and edges checked." },
  { key: "pack", title: "Protected packing", detail: "Wrapped, boxed, and taped for dispatch with a packing photo record." },
  { key: "dispatch", title: "Dispatched", detail: "Handed to the courier with a live tracking number." },
];

export const expansionLanes = [
  "Jewelry brand", "Home décor", "Wedding collection", "Corporate gifting", "Pet memorials",
  "Gaming collection", "DIY kits", "Workshops", "Wholesale", "Custom molds",
  "Supplies store", "Design marketplace",
];

export const contentSystem = [
  "Product photography", "Making reels", "Customization stories", "Packaging videos",
  "Festival collections", "Behind the scenes", "Educational content",
];

/** Chapter lookup helpers used by the rail, the cover, and page footers. */
export function chapterIndexForPath(pathname: string): number {
  const clean = pathname.replace(/\/+$/, "") || "/";
  const index = chapters.findIndex((chapter) => chapter.path === clean);
  if (index >= 0) return index;
  if (clean.startsWith("/demos")) return chapters.length; // demos read as "after the reel"
  return -1;
}
