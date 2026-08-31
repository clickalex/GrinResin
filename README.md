# GrinRex Resin — presentation site & working demos

A personalized resin gifting and keepsake brand: the full "Lacquered Portfolio"
presentation (13 chapters, one page each) plus a bench of working demo tools that
prove the operating story — catalogue, pricing guardrail, shop, custom-order flow,
and order tracking.

## Quick start

```bash
pnpm install     # deps are locked with pnpm@10.4.1
pnpm dev         # dev server on :3000, host-exposed
pnpm check       # TypeScript
pnpm test        # vitest — pricing engine & catalogue integrity
pnpm build       # client → dist/public, server → dist/index.js
pnpm start       # production: express serves dist/public (SPA fallback included)
```

## Pages

| Route | Chapter | What it holds |
| --- | --- | --- |
| `/` | 01 · The promise | Cover, contents reel, demo strip |
| `/chapters/opportunity` | 02 · The opening | Market opening for meaningful gifting |
| `/chapters/revenue` | 03 · The system | Revenue streams in sequence |
| `/chapters/studio` | 04 · The studio | Bench, materials, safety, ₹10k–₹14k setup |
| `/chapters/collection` | 05 · Launch edit | The recommended 12-product MVP |
| `/chapters/catalogue` | 06 · Catalogue | The 150-product library in context |
| `/chapters/costing` | 07 · Discipline | Cost components, bands, pricing guardrail |
| `/chapters/production` | 08 · Process | Full 16-step workflow, QC, safety |
| `/chapters/market` | 09 · Market field | SWOT, channels, content system |
| `/chapters/roadmap` | 10 · Roadmap | Six phases from setup to scale |
| `/chapters/playbook` | 11 · Playbook | Metrics, order workflow, evidence cards |
| `/chapters/investor` | 12 · Investor case | Staged capital logic, expansion lanes |
| `/documents` | 13 · Library | Every source doc, readable in-site + downloadable |

## Working demos (`/demos`)

- **Catalogue browser** `/demos/catalogue` — real 150-item data: search, family filters, sort, launch toggle, specimen sheets, "cost this piece" handoff.
- **Launch shop** `/demos/shop` — storefront over the 12 launch products: personalization, cart, checkout → creates a trackable demo order.
- **Pricing guardrail** `/demos/pricing` — the source formula live (material + labor + packaging + overhead + fees + profit), per-SKU presets, contribution breakdown. Accepts `?p=<id>` from any product.
- **Custom order builder** `/demos/order` — validated enquiry (zod + react-hook-form), live quote sheet, downloadable `.txt`, saves a trackable order.
- **Order tracker** `/demos/track` — eight studio states over the 16-step process; reads seeded refs (`GRX-1001…1004`) plus orders created in the shop/builder (localStorage, resettable).

No backend is required: demo orders live in `localStorage`; all data ships from `client/public/manus-storage/`.

## Structure

```
client/            React app (wouter routes, shadcn/ui primitives, index.css design system)
  src/data/        presentation.ts · products.ts (generated)
  src/lib/         costing.ts (guardrail engine) · orders.ts (demo store)
  src/pages/       chapters/ + demos/ + Home/Documents/NotFound
  public/manus-storage/  source JSON, markdown documents, brand imagery
server/            express static host with SPA fallback (production)
scripts/           build-catalogue.mjs — regenerates products.ts, source JSON, catalogue md
```

Regenerate the catalogue after editing `scripts/build-catalogue.mjs`:

```bash
node scripts/build-catalogue.mjs
```

## Notes

- Product/photography images in `client/public/manus-storage/` are AI-generated placeholders for the demo; replace with real studio photography before launch.
- All ₹ figures are source planning ranges, not supplier quotations; nothing in the demos is charged, stored remotely, or sent anywhere.
- The repository also preserves `grinrex-resin-presentation.zip` — the original single-page Manus export this build was expanded from.
