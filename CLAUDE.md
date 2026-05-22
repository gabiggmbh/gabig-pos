# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Dev server at http://localhost:5173
npm run build     # Production build
npm run preview   # Preview production build
npx tsc --noEmit  # Type check only (no emit)
```

## Architecture

Vite + React 18 + TypeScript SPA. No Redux, no RTK Query — plain `fetch()` with React context for state.

### Key files

- `src/api.ts` — All API calls to `https://api.gabig.app`. Auth via `Bearer` token read from `localStorage('token')` (stored as a JSON-stringified string, i.e. `JSON.stringify(jwtString)`).
- `src/App.tsx` — Root state machine: `AppContext` holds global state + all actions. Screen routing is a simple `screen` string enum rendered with conditionals.
- `src/sdk.tsx` — Scandit SDK wrapper (SDKController class + SDKProvider + useSDK hook). Copied from `fulfillment-web-app`. Requires WASM files served from `/sdc-lib/` (copied by `vite-plugin-static-copy` from `node_modules/@scandit/web-datacapture-*`).
- `src/types.ts` — All shared TypeScript interfaces.
- `src/pos.css` — Design system CSS (variables `--b-*`, `--n-*`, `--egg-*`, `--sem-*`). Imported in `main.tsx`.

### Screen flow

`login` → `station_select` → `sale` ↔ `customer_picker` → `payment_select` → `card_payment` | `cash_payment` → `receipt`

The `sale` and `customer_picker` screens are both rendered by `Sale.tsx` (customer picker is an overlay).

### State patterns

- **Stale closure prevention**: `saleRef`, `companyRef`, `profileRef`, `statusRef`, `pmRef` are `useRef` mirrors updated via `useEffect`, used inside async functions where `useState` would be stale.
- **Order preview**: After each cart change, `POST /v1/order?test=true` is debounced 400ms to get live price totals. The preview `OrderDto` drives the cart totals display.
- **Order name**: Auto-generated as `POS-YYYYMMDD-HHmm` (mandatory field).
- **Station**: Persisted in `localStorage('pos_station')` across sessions.

### API patterns

- JWT decoded with `jwt-decode` to extract `{ email, roles, language, company: companyUuid }`.
- Product variants searched via `GET /v1/productvariant/flat?search=&languageCode=&currencyIsoCode=&productProfileUuid=`.
- Payment method matched by name keyword (karte → card, bar → cash, rechnung → invoice) with fallback to `default: true`.
- `vatType: 'free'` is hardcoded on all order creates.

### Scandit

Uses `@scandit/web-datacapture-barcode` + `@scandit/web-datacapture-core` v7.3.0. License key is hardcoded in `src/sdk.tsx`. The SDK requires WASM files at `/sdc-lib/` — `vite.config.ts` copies them from `node_modules` at build time.
