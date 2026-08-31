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
    rail: "Documents",
    label: "The document library",
    path: "/documents",
    blurb: "Every source document, in reading order.",
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
    id: "overview",
    number: "01",
    eyebrow: "Business overview",
    title: "The GrinRex Resin proposition",
    file: "grinrex-resin-business-overview_81d6cfea.md",
    summary: [
      "GrinRex Resin is a personalized handmade gifting and keepsake brand for the Indian market, transforming names, photographs, flowers, dates, and occasions into durable resin pieces.",
      "The source plan calls for a controlled 10–20 product launch through Instagram, WhatsApp Business, local exhibitions, gift shops, and online marketplaces.",
      "Customization — not catalogue size or lowest-price positioning — is the core differentiation.",
    ],
  },
  {
    id: "studio",
    number: "02",
    eyebrow: "Studio & business source reference",
    title: "The full studio foundation",
    file: "grinrex-resin-studio-source-reference_5fb89717.md",
    summary: [
      "The complete business basis: market, model, launch channels, revenue streams, source-plan startup ranges, tools, materials, pricing framework, production process, quality checks, safety requirements, SWOT, marketing, roadmap, metrics, and expansion lanes.",
      "All figures remain planning inputs that require supplier quotations, product-level costing, and compliance review before commercial use.",
    ],
  },
  {
    id: "catalogue",
    number: "03",
    eyebrow: "Full product catalogue",
    title: "The 150-product opportunity library",
    file: "grinrex-resin-full-product-catalogue_016c7d4b.md",
    summary: [
      "The complete list spans jewelry, keepsakes, home and living, office and corporate pieces, wedding and festival items, gaming and hobby objects, garden goods, pet memorials, and art-led pieces.",
      "It is an expansion library, not an immediate product promise — the launch still starts with a narrowed edit tested for safety, cost, time, demand, and dispatch risk.",
    ],
  },
  {
    id: "operations",
    number: "04",
    eyebrow: "Roadmap & internal operations",
    title: "The route from studio to system",
    file: "grinrex-resin-roadmap-and-operations_12f62ffc.md",
    summary: [
      "Initial setup is estimated at ₹10,000–₹14,000: roughly ₹6,000–₹8,000 for essential tools and ₹4,000–₹6,000 for raw materials. Planning ranges, not quotations.",
      "Every SKU records materials, labor, packaging, tool amortization, wastage, fees, margin, order volume, and quality outcome.",
    ],
  },
  {
    id: "investor",
    number: "05",
    eyebrow: "Investor brief",
    title: "A measured case for growth",
    file: "grinrex-resin-investor-brief_e402735d.md",
    summary: [
      "Designed to grow from a disciplined direct-to-consumer collection into a broader gifting and lifestyle platform.",
      "No unverified market-size, revenue, valuation, or return claims — growth materials must add verified sales history and product-level margin first.",
    ],
  },
  {
    id: "data",
    number: "06",
    eyebrow: "Source data",
    title: "The original planning data",
    file: "grinrex-resin-source-data_dd7cd205.json",
    summary: [
      "The structured source behind the startup ranges, catalogue, costing, process, quality, safety, SWOT, marketing, roadmap, and metric references in this presentation.",
      "Retained as a planning document — supplement it with verified supplier pricing and live sales data as the business develops.",
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
