# BirdFuel Storefront (Vue + Vite)

Responsive storefront UI converted to a routed Vue 3 + Vite application with reusable components, a local catalog feed, and Mercado Pago checkout.

## Stack
- Vue 3 + TypeScript
- Vue Router
- Vite

## Run
```bash
npm install
npm run dev
```

## Build
```bash
npm run typecheck
npm run build
```

## Routes
- `/` Home template
- `/collections/:handle?` Collection template
- `/products/:handle` Product detail template (PDP)
- `/cart` Cart template
- `/blog` Blog index template

## Shared Layout
- Header, announcement bar, footer, and cart drawer are shared through:
- `src/components/layout/AppLayout.vue`

## Data Contracts
- Catalog contract definitions:
- `src/contracts/catalog.ts`
- Internal typed view models:
- `src/types/storefront.ts`

## API-Ready Services
- Product mapper/service:
- `src/services/productService.ts`
- Mercado Pago checkout client:
- `src/services/mercadoPagoCheckout.ts`
- Blog service:
- `src/services/blogService.ts`

## Local Catalog
Product data is served from `public/api/products.json` and mapped into the internal `StorefrontProduct` model at runtime.

1. Copy `.env.example` to `.env`
2. Review `public/api/products.json` and update it with your catalog data as needed.

## Local API JSON (development fallback)
- `public/api/products.json`
- `public/api/blog-posts.json`

## Mercado Pago Checkout
The app creates Mercado Pago Checkout Pro preferences through a lightweight Node endpoint in `server/mercado-pago-server.mjs`.

1. Copy `.env.example` to `.env`
2. Set `MERCADO_PAGO_ACCESS_TOKEN`
3. Start the checkout server in one terminal: `npm run mercado-pago:server`
4. Start the storefront in another terminal: `npm run dev`

The frontend posts cart items to `VITE_MERCADO_PAGO_PREFERENCE_ENDPOINT`, and the backend returns the Mercado Pago redirect URL.

Notes:
- Keep `MERCADO_PAGO_ACCESS_TOKEN` server-side only.
- Vite proxies `/api/mercado-pago/*` to `MERCADO_PAGO_SERVER_URL` during local development.
- By default, approved, failed, and pending returns come back to `/cart` with `checkout_status` in the query string.

## Admin Authentication
The `/admin` page is protected by server-side credentials and an HTTP-only session cookie.

Set these values in `.env`:
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_TTL_MS`
- `ADMIN_MAX_FAILED_ATTEMPTS`
- `ADMIN_LOCKOUT_MS`

Behavior:
- login attempts are checked server-side, not in the frontend
- after 3 failed login attempts from the same client, admin login is locked for the configured timeout window
- successful login clears the failure counter for that client
