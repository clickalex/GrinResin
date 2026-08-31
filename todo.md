# Shared Document Integration Checklist

- [x] Locate the shared project documents available to this presentation.
- [x] Review their content and identify material not yet represented on the site.
- [x] Map additions to the existing presentation and document-library sequence.
- [x] Implement the approved content updates without disrupting the current narrative.
- [x] Verify the updated site, save a checkpoint, and provide the revised project version.

## JSON Document Integration

- [x] Locate the shared JSON documents and verify their structure.
- [x] Extract business, product, roadmap, operational, and investor content that can be validated from the JSON.
- [x] Integrate the new material into the corresponding presentation chapters and document library.

## Pasted Source Integration

- [x] Review Pasted_Content_08.txt against the existing presentation and identify missing source-backed material.
- [x] Add only validated source content to the appropriate presentation chapters and supporting documents.

## Complete Source Consolidation

- [x] Audit every source section and catalogue entry from Pasted_Content_08.txt against the live presentation.
- [x] Reorder the presentation so the complete story moves from brand, market, and setup through products, operations, roadmap, and investor case.
- [x] Add a dedicated, categorized product catalogue that covers the full source-product list.
- [x] Add any missing source-backed business, costing, production, safety, SWOT, marketing, and expansion material.
- [x] Verify the full desktop and mobile presentation, save a checkpoint, and publish the updated version.

## Multi-Page Rebuild (2026-08-31)

- [x] Split the single-page reel into 13 routed pages with the persistent chapter rail.
- [x] Add working demo pages: catalogue browser, launch shop, pricing guardrail, custom order builder, order tracker.
- [x] Local-source the Manus storage dependency (JSON, documents, and imagery now ship in client/public/manus-storage).
- [x] Type-check, unit-test, and production-build the restructured project.

## Storefront & Design Studio (2026-09-01)

- [x] `/shop` storefront over the launch edit with search, family filter, sort; `/product/:id` detail pages with live cost cards.
- [x] `/studio` custom design tool: shape, size, effect, palette, draggable inclusions, cast text, finish, packaging, rush — priced live through the pricing guardrail (`designQuote`).
- [x] Saved designs (`/designs`, localStorage), cart (`/cart`) and validated checkout (`/checkout`) that snapshot each design into the order.
- [x] Order tracking for store orders: `/orders` list, `/order/:ref` receipt + 8-stage timeline; shared store with `/demos/track`.
- [x] Info pages: About, Weddings, Corporate, Workshops (seat booking via lead store), FAQ, Care, Contact.
- [x] Fixed `orderTotal` semantics in the guardrail (customer total vs. contribution split), extended unit tests to 13.
- [x] Removed `/demos/shop` (superseded by `/shop`); rail badge shows live cart count.
