# GrinRex Resin — Product Requirements (one page)

**Status:** the demo is the product. Everything below ships inside this site and is
exercisable in a browser. Nothing charges, nothing sends, no backend exists — by design.

## 1 · What it is

A presentation site with a working storefront attached, for a personalized resin
gifting and keepsake brand (India). Thirteen chapters tell the business story; the
store lets a visitor design their own piece, price it through the same costing
guardrail the founder uses, check out, and track the order. Wedding, corporate,
workshop, and contact enquiries run through real validated forms into a local desk.

## 2 · Who it serves

- **Buyers** — gift shoppers, wedding parties, small offices: browse → personalize → order → track.
- **The studio owner** — pitches the operating model with live tools, not slideware.
- **Evaluators** — every number on screen traces to a source planning range, labeled as one.

## 3 · Surface

13 chapter pages (`/`, `/chapters/*`) · `/shop`, `/product/:id` · `/studio`,
`/designs` · `/cart`, `/checkout`, `/orders`, `/order/:ref` · `/about`,
`/weddings`, `/corporate`, `/workshops`, `/faq`, `/care`, `/contact` ·
6 demos (`/demos`: catalogue, pricing, order builder, tracker, studio desk) ·
this page (`/documents`).

## 4 · Core flows & rules

1. **Design → price.** Shape, size, effect, palette, click-placed inclusions, cast
   text, finish, packaging, rush, quantity — priced live by `designQuote()`, which
   feeds the guardrail: material + labor + packaging + tool amortization + shipping,
   wastage % on cost, price solved so margin + payment fees are carved *out* of the
   selling price, rounded to a ₹…9 price point. The same engine drives `/demos/pricing`.
2. **Cart → order.** Identical configs merge into one line (`p<id>-<text|plain>` /
   design-keyed). Checkout validates with zod; each line stores a **full design
   snapshot**, so order history renders the piece as ordered even after edits.
3. **Tracking.** Eight studio stages over the 16-step process; deterministic
   progress from placed-date plus reference jitter; ETA and simulated courier AWB
   shown honestly as demo values. `/order/:ref` and `/demos/track` share one store.
4. **Enquiries.** One lead store, `GRXL-` refs; workshop seats decrement on booking
   and release on cancel; `/demos/desk` is the owner-side view (counts, status
   cycling, removal).

## 5 · Data & state

All of it lives in `localStorage` on this browser: designs (`grinrex-designs-v1`),
cart (`grinrex-cart-v1`), orders (`grinrex-demo-orders-v1`, seeded `GRX-1001…1004`,
resettable), leads (`grinrex-leads-v1`). The 150-SKU catalogue is generated data
(`scripts/build-catalogue.mjs` → `client/src/data/products.ts`).

## 6 · Out of scope — deliberately

Payments and shipping integrations, accounts, server persistence, inventory,
real photography (AI placeholders), supplier-grade pricing. Cash-on-delivery and
UPI language in copy is illustrative; no money moves anywhere.

## 7 · Quality bar

`tsc` clean · 13 unit tests on the guardrail (size ladder, ₹…9 endings, text /
inclusion / rush surcharges, linear quantity, contribution split) · production
build green · every route serves 200 · layout holds to 360 px · no network calls
beyond static assets.
