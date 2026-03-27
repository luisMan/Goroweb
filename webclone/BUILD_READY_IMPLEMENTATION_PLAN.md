# Build-Ready Implementation Plan

Project: Rebuild a close functional equivalent of `https://mx.birdman.com/`  
Date: March 4, 2026  
Target stack: Shopify Plus storefront + app integrations + analytics/pixels

## 1) Scope And Success Criteria

### In Scope
- Shopify storefront with:
- Theme-based UI/UX equivalent (home, collection, PDP, cart, pages, blog, policies).
- Mexico market setup (MXN, Spanish copy, local payment options).
- App/integration layer equivalent to observed stack.
- Event tracking and attribution pipeline.
- Production-ready QA, performance, and launch process.

### Out Of Scope (Phase 1)
- Native mobile app.
- Full ERP/WMS replacement.
- Custom headless frontend.

### Success Criteria (Launch Gate)
- All critical routes functional and SEO-indexable.
- Checkout conversion path works across desktop/mobile.
- Subscription/cart upsell behavior matches business rules.
- Tracking parity verified for key commerce events.
- Lighthouse mobile score >= 70 and desktop >= 85 on key templates.
- 0 open Sev-1 defects and 0 open Sev-2 defects at launch.

## 2) Architecture Baseline

### Platform
- Shopify Plus store (Production + Staging themes).
- Cloudflare + Shopify CDN edge delivery.
- Shopify customer accounts and checkout.

### Frontend
- Shopify Liquid theme with section blocks.
- AJAX cart + predictive search.
- Product/collection/page/blog templates.

### Data/API
- Shopify Admin (products, collections, pages, blogs, policies).
- Shopify AJAX endpoints (`/products/*.js`, `/cart.js`, recommendations).
- App APIs through script/app blocks.

### Integration Layer (Target Parity)
- Cart/Upsell/Subscriptions: Rebuy.
- Email/SMS capture: Klaviyo + Postscript/SMS app equivalent.
- Reviews: Loox.
- Loyalty: Smile.io.
- Experiments/personalization: Convert.
- Attribution/analytics: GTM + GA4 + Meta + Triple Whale.
- Quiz/surveys/forms: Quiz/Zigpoll/Form builder.
- Chat: Wizybot.
- Invoicing (MX): Facturama.
- Payment risk/anti-fraud extension(s): Mercado Pago plugin stack.

## 3) Delivery Model

### Team
- 1 Tech Lead (Shopify).
- 1 Frontend Theme Engineer.
- 1 Integrations Engineer.
- 1 QA Engineer.
- 1 Analyst (tracking + attribution).
- 1 PM/Product Owner.

### Timeline (10 Weeks)
- Week 1: Sprint 0 foundation.
- Week 2-3: Core storefront templates.
- Week 4-5: PDP/cart/subscriptions/upsell.
- Week 6: Content migration + SEO controls.
- Week 7: Tracking + pixels + attribution QA.
- Week 8: Full regression + performance/security hardening.
- Week 9: UAT + bug burn.
- Week 10: Cutover + launch + hypercare.

## 4) Environment And Repo Setup

### Repositories
- `webclone-theme` (Shopify theme source, CI checks).
- `webclone-docs` (runbooks, tracking map, QA evidence).

### Branching
- `main` = production-ready.
- `develop` = integration branch.
- feature branches per ticket.

### CI/CD
- Shopify CLI deploy to:
- `staging` theme on every merge to `develop`.
- `preprod` theme on release branch.
- `main` deploy on tagged release.

### Required Environments
- Dev store/app sandbox.
- Staging theme with production-like data.
- Production theme (published) + rollback theme snapshot.

## 5) Workstreams And Backlog

## EPIC A: Platform And Store Configuration

### A1. Store bootstrap
- Configure domain, MX market, tax, shipping zones, legal policies.
- Acceptance: checkout shows MXN and valid MX shipping/payment options.

### A2. Access and security
- Roles, 2FA enforcement, app approval process, webhook secret handling.
- Acceptance: least-privilege matrix approved and applied.

### A3. Theme pipeline
- Shopify CLI, linting, preview links, deployment scripts.
- Acceptance: one-command deploy to staging theme.

## EPIC B: Theme And UX Templates

### B1. Global layout
- Header, mega menu, footer, announcement bar, account/cart icons.
- Acceptance: responsive parity with approved reference screenshots.

### B2. Home page sections
- Hero, collection tabs, featured product, cards, testimonials, FAQs, logos.
- Acceptance: all sections editable from theme customizer.

### B3. Catalog pages
- Collection grids, filters/sort behavior, pagination, badges.
- Acceptance: accurate filtering and SEO metadata.

### B4. PDP
- Gallery, variant selection, pricing, reviews widget, add-to-cart.
- Acceptance: variant switching and cart add flow pass all QA cases.

### B5. Cart
- Drawer/cart page behavior, upsell slots, coupon handling.
- Acceptance: subtotal/discount logic validated with test orders.

### B6. Content templates
- Pages, blogs, article template, policy page styles.
- Acceptance: migrated sample content renders correctly.

## EPIC C: Commerce Features

### C1. Subscriptions and bundles
- Rebuy subscription UI, frequency selection, offer rules.
- Acceptance: subscription SKU orders complete in checkout.

### C2. Recommendations and cross-sell
- Product recommendations + smart cart upsells.
- Acceptance: recommendations fire on PDP/cart with configured rules.

### C3. Payments and anti-fraud
- PayPal + local methods + Mercado Pago integrations.
- Acceptance: end-to-end payment tests pass for enabled methods.

### C4. Invoicing workflow
- Facturama flow from order to invoice request page.
- Acceptance: invoice generation test pass with sandbox account.

## EPIC D: Data Migration

### D1. Catalog migration
- Products, variants, images, collections, tags/metafields.
- Acceptance: >99.5% migration parity check.

### D2. Content migration
- Pages, blogs/articles, FAQs, legal docs.
- Acceptance: URLs and canonical tags validated.

### D3. Redirects
- 301 map for changed or legacy URLs.
- Acceptance: no broken high-traffic URLs in crawl report.

## EPIC E: Tracking, Pixels, And Attribution

### E1. Event specification
- Define canonical events: `view_item`, `add_to_cart`, `begin_checkout`, `purchase`, `search`, etc.
- Acceptance: signed-off tracking map with payload schema.

### E2. Implement pixel stack
- GTM, GA4, Meta pixel/CAPI, Triple Whale, app pixels.
- Acceptance: event parity tests pass in staging and production smoke.

### E3. Consent and privacy
- Cookie/consent handling, policy links, data-sharing controls.
- Acceptance: legal review approved.

## EPIC F: QA, Performance, And Launch

### F1. Functional QA
- Test matrix: device/browser/payment/subscription/account flows.
- Acceptance: 100% pass for P0/P1 cases.

### F2. Performance
- Optimize JS, image formats, lazy loading, app script budget.
- Acceptance: scores and web vitals hit agreed thresholds.

### F3. Security and compliance
- CSP/HSTS verification, app scope audit, webhook validation.
- Acceptance: security checklist signed by Tech Lead.

### F4. Cutover and rollback
- DNS/launch runbook, release checklist, rollback protocol.
- Acceptance: launch rehearsal completed with rollback drill.

## 6) Sprint Plan (Execution Ready)

### Sprint 0 (Week 1)
- Finalize architecture and app list.
- Create repos, CI/CD, envs, credentials.
- Define acceptance criteria and QA plan.
- Exit criteria: all blockers resolved, implementation starts next sprint.

### Sprint 1 (Week 2)
- Global shell and navigation.
- Home template v1.
- Collection/PDP base templates.
- Exit criteria: browse-to-PDP flow complete.

### Sprint 2 (Week 3)
- Cart drawer/page.
- Reviews and loyalty integration.
- Content templates and policy pages.
- Exit criteria: browse-to-cart flow stable.

### Sprint 3 (Week 4)
- Rebuy smart cart and subscription offers.
- Recommendation widgets.
- Exit criteria: subscription add-to-cart flow passes QA.

### Sprint 4 (Week 5)
- Payment stack validation including local methods.
- Facturama integration.
- Exit criteria: end-to-end order + invoice workflow validated.

### Sprint 5 (Week 6)
- Catalog/content migration.
- Redirect map and SEO QA.
- Exit criteria: migration parity report approved.

### Sprint 6 (Week 7)
- Full tracking implementation and UAT dashboards.
- Pixel event parity + attribution checks.
- Exit criteria: analytics sign-off.

### Sprint 7 (Week 8)
- Performance, accessibility, and security hardening.
- Full regression pass.
- Exit criteria: release candidate tagged.

### Sprint 8 (Week 9)
- Business UAT and bug burn-down.
- Launch readiness review.
- Exit criteria: go/no-go approval.

### Sprint 9 (Week 10)
- Production cutover.
- Post-launch monitoring and 7-day hypercare.
- Exit criteria: stable KPIs and incident-free closeout.

## 7) Test Strategy

### P0 Journeys
- Home -> Collection -> PDP -> Add to cart -> Checkout -> Purchase.
- PDP subscription purchase.
- Coupon + discount + payment method permutations.
- Account login/create/reset.
- Invoice request flow.

### Validation Layers
- Unit/theme snippet checks.
- Integration tests for app/widget interactions.
- Manual exploratory QA across devices.
- Analytics validation in GTM/GA4/Meta/Triple Whale.

## 8) Risks And Mitigations

### App script bloat impacts performance
- Mitigation: script inventory, defer/lazy-load policy, budget per page template.

### Pixel event duplication/mismatch
- Mitigation: single event contract + staging event diff checklist.

### Migration data quality gaps
- Mitigation: pre-migration profiling + deterministic reconciliation report.

### Payment/subscription edge-case failures
- Mitigation: sandbox + live small-value checkout tests before launch.

## 9) Definition Of Done (DoD)

Each ticket is done only when:
- Code deployed to staging theme.
- QA case(s) linked and passed.
- Analytics impacts validated (if relevant).
- Accessibility checks performed for touched UI.
- Documentation updated in `webclone-docs`.
- PM/Tech Lead approval logged.

## 10) Immediate Next Actions (This Week)

1. Confirm app contract:
- Decide exact vendors per function (keep current stack or replacements).

2. Create project artifacts:
- Jira board with epics above.
- Tracking spec sheet.
- QA matrix template.

3. Start Sprint 0 tasks:
- Provision Shopify environments.
- Configure CI/CD and release flow.
- Lock acceptance criteria for P0 journeys.

