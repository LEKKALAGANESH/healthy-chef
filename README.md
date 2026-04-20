# HealthyChef — Invoice Generator

Take-home assessment for HealthyChef (Full-Stack Developer). A MERN invoicing app: manage items, build invoices with live GST/discount math, save to MongoDB, download a polished PDF, and review history.

## Quickstart

```bash
# 1. Install
npm install

# 2. Configure env
cp server/.env.example server/.env
# Edit server/.env and paste your MongoDB Atlas connection string into MONGO_URI
cp client/.env.example client/.env   # defaults work out of the box

# 3. Start both workspaces
npm run dev
# server → http://localhost:5000   (GET /api/health returns { ok: true })
# client → http://localhost:5173
```

Requires **Node 20+** (see `.nvmrc`) and a MongoDB Atlas cluster (free tier is fine).

## Features

| Module | Requirement | Where |
|---|---|---|
| 1 | Item CRUD with variants + base price | `server/src/models/Item.ts`, `client/src/pages/ItemsPage.tsx` |
| 2 | New Invoice screen with customer details + auto-generated invoice number | `client/src/pages/NewInvoicePage.tsx`, `server/src/services/invoiceNumber.ts` |
| 3 | Dynamic line items with live GST/discount math | `client/src/components/invoice/*`, `client/src/utils/invoiceMath.ts` |
| 4 | Save to MongoDB + download PDF with T&Cs | `server/src/controllers/invoiceController.ts`, `client/src/components/pdf/*` |
| 5 | History dashboard with re-download | `client/src/pages/HistoryPage.tsx` |

## Architecture

Monorepo with two npm workspaces. Both are strict TypeScript.

```
healthy-chef/
├── server/   # Express 4 + Mongoose + Zod + Helmet + rate-limit
└── client/   # Vite + React 18 + styled-components + TanStack Query + Redux Toolkit + @react-pdf/renderer
```

**Backend (MVC):** routes call controllers call services/models. Global error handler + async wrapper + zod validation middleware. Env validated at startup — app crashes loudly if misconfigured. All monetary values stored as **paise (integer)** to avoid floating-point drift.

**Frontend:** lazy-routed pages wrapped in ErrorBoundary + Suspense. Server state in TanStack Query (items + invoices); draft invoice state in Redux Toolkit; theme via `styled-components` with a typed `DefaultTheme`. Skeleton loading on every async surface. PDF rendered client-side by `@react-pdf/renderer` with Roboto fonts (to support the ₹ glyph — the built-in Helvetica does not).

**Invoice math formula** (standard, discount-before-GST):

```
rowGross    = qty × basePrice
rowDiscount = percentage ? (rowGross × pct/100) : min(absolute, rowGross)
rowTaxable  = rowGross − rowDiscount
rowGst      = rowTaxable × (gstRate/100)
rowTotal    = rowTaxable + rowGst
```

All values rounded to nearest paise. Grand total = Σ rowTotal across lines.

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, TypeScript, Vite, styled-components, Framer Motion, TanStack Query v5, Redux Toolkit, React Router v6, Axios |
| Backend | Node 20, Express 4, TypeScript (ESM), Mongoose 8, Zod, Helmet, CORS, express-rate-limit, express-mongo-sanitize |
| Database | MongoDB Atlas |
| PDF | `@react-pdf/renderer` with locally hosted Roboto TTFs |
| Testing | Jest + ts-jest + Supertest + mongodb-memory-server (server), Vitest + React Testing Library (client) |
| Tooling | Commitizen, commitlint (Conventional Commits), Husky v9, concurrently |

## Running the tests

```bash
npm test                   # runs both workspaces
npm test --workspace=server   # 31 tests: services, models, routes, health
npm test --workspace=client   # 9 tests: money helpers, invoice math, app shell
```

Type-checking both workspaces:

```bash
npm run typecheck
```

## Project Structure

```
server/src/
├── config/          # env.ts (zod-validated), db.ts (mongoose connect)
├── models/          # Item, Invoice (embedded customer + lineItems)
├── controllers/     # itemController, invoiceController (async wrapped)
├── routes/          # itemRoutes, invoiceRoutes
├── middleware/      # asyncHandler, errorHandler, validate (zod)
├── services/        # invoiceCalc (paise math), invoiceNumber (INV-YYYY-NNNN)
├── schemas/         # zod request shapes
├── types/           # HttpError
├── app.ts           # express app factory (testable)
└── server.ts        # bootstrap: connectDB → listen

client/src/
├── api/             # axios instance + items, invoices endpoints
├── app/             # store, rootReducer
├── components/
│   ├── ui/          # Button, Input, Select, Modal, Table, IconButton
│   ├── skeletons/   # BaseSkeleton, ItemListSkeleton, InvoiceListSkeleton
│   ├── layouts/     # AppShell (nav + Outlet), PageHeader
│   ├── items/       # ItemList, ItemRow, ItemFormModal
│   ├── invoice/    # CustomerForm, LineItemRow, LineItemTable, InvoiceSummary
│   ├── history/     # InvoiceHistoryTable, InvoiceRow (expandable)
│   └── pdf/         # pdfTheme, PDFHeader, PartiesBlock, ItemsTable,
│                    # SummaryBlock, PDFFooter, InvoicePDFDocument,
│                    # PDFDownloadButton
├── features/        # invoiceDraft Redux slice (customer + lineItems)
├── hooks/           # useItems, useInvoices, useInvoiceCalculations
├── pages/           # ItemsPage, NewInvoicePage, HistoryPage
├── styles/          # theme, GlobalStyle, animations (Framer variants)
├── types/           # api, item, invoice
├── utils/           # money (Intl en-IN), invoiceMath (server mirror)
└── constants/       # config, routes, gst, supplier
```

## Design Decisions

- **Paise integers for money.** No FP rounding drift — one source of truth, Intl formatting only at display.
- **Server recomputes totals.** The client sends just the inputs (qty, base, GST, discount); server runs `calculateInvoice` before persisting. Client math is a UX affordance, not a trust boundary.
- **Unique invoice numbers per year.** `INV-YYYY-NNNN` via `countDocuments({ createdAt: {$gte: Jan 1, $lt: Jan 1 next year} })`.
- **60-30-10 color palette** (Friendly persona): `#FFFDF7` dominant, `#F0F7EE` secondary, `#3A7D44` accent on CTAs/totals.
- **Roboto TTF** registered at `client/public/assets/fonts/` — `@react-pdf/renderer`'s built-in fonts don't include ₹ (U+20B9).
- **Two-column PDF header + side-by-side From/Bill-To + striped rows + right-aligned totals** follow conventions from `tuanpham-dev/react-invoice-generator`, `anvilco/html-pdf-invoice-template`, and standard Indian GST invoice layouts.

## Out of Scope (intentional)

- Authentication (not in the brief)
- Mobile/Flutter (JD mentions it; assessment is web only)
- Deployment (local demo per brief)
- HSN/SAC codes, CGST/SGST split, e-invoicing IRN/QR (beyond brief)

## Conventional Commits

Commit messages follow `type(scope): subject`. Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `ci`, `style`, `perf`. Scopes: `scaffold`, `db`, `api`, `items`, `invoice`, `pdf`, `dashboard`, `ui`, `theme`.

Husky v9's `commit-msg` hook runs `commitlint` on every commit. Use `npm run commit` for a guided message.
