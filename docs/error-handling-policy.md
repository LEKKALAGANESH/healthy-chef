# Error Handling Policy

> Decisions for the **healthy-chef** MERN app. Use this taxonomy whenever surfacing or designing for errors. Different error classes have different correct responses — don't blur them.

## Why this exists

A user reported that leaving the Phone field empty disabled the *Save Invoice* button with no explanation. Silent-disabled buttons are bad UX. While fixing that, we also locked in the boundary between server-startup failures, runtime API errors, and server-side Zod rejections. This document captures the full taxonomy so every future error decision in the repo pulls from the same rubric.

## How to apply

When adding or reviewing any error path, classify it into one of the four tiers below and follow the pattern for that tier. Don't invent a new pattern. Don't mix tiers.

---

## Tier 1 — Server startup / infrastructure errors

**Examples:** MongoDB connection failure (bad auth, IP not whitelisted, cluster paused), missing `MONGO_URI` env var, port already in use.

**Correct behavior:** fail-fast. Log a clear error, `process.exit(1)`. No UI involved — Express hasn't bound yet, there's no user to show anything to.

The existing pattern at [`server/src/server.ts`](../server/src/server.ts) is correct as-is:

```ts
connectDB()
  .then(() => { /* listen */ })
  .catch((err) => {
    console.error('❌ Mongo connection failed:', err);
    process.exit(1);
  });
```

**Do NOT:**

- Try to render an error screen.
- Buffer requests until the DB reconnects.
- Retry silently at startup.

The developer needs to see the error and fix it.

---

## Tier 2 — Runtime API errors (server alive, request failed mid-session)

**Examples:** `POST /api/invoices` fails because the server went down, network dropped, or returned a 500.

**Correct behavior:** toast notification with a retry affordance.

The current pattern at [`client/src/pages/NewInvoicePage.tsx:82-84`](../client/src/pages/NewInvoicePage.tsx) (a static red paragraph shown when `create.isError`) is functional but weak — it doesn't retry and doesn't dismiss on success.

**Upgrade path when we add a toast system:**

- Show a toast: **"Failed to save invoice. Retry · Dismiss"** on mutation error.
- Auto-dismiss on next successful mutation.
- Preserve form state so the user doesn't re-type.

---

## Tier 3 — Server validation errors (Zod schema failed on the server)

**Examples:** client submitted an invoice with an invalid GST rate that slipped past client-side guards, or a stale client shape.

**Correct behavior:** parse the server's structured Zod field-error map and map each field error back onto the corresponding form input — same visual treatment as Tier 4 inline errors.

The server's `validate` middleware already returns a shape like:

```json
{ "fieldErrors": { "customer.email": ["Invalid email"], "lineItems": ["At least one line item required"] } }
```

The client should walk that object and attach each message to its matching input.

**Do NOT** show server validation errors as a generic toast. The toast is for Tier 2 (network / 5xx). Field-level errors belong **next to** the offending field.

---

## Tier 4 — Client-side form validation

**Examples:** Phone field left empty, email format invalid, no line items added.

**Correct behavior:**

1. Inline helper text under each field, shown after the user **blurs** the field (not while typing — less punishing).
2. Summary strip above the submit button:
   > **3 issues:** Phone required · Email invalid · Add at least 1 line item

   Each entry is a link that focuses the offending field on click.
3. Disabled submit button gets a `title` attribute explaining why.

**Never acceptable:** a silently-disabled submit button with no accompanying hint. That is the original bug this policy was written to prevent.

Current offender: [`client/src/pages/NewInvoicePage.tsx:46-51`](../client/src/pages/NewInvoicePage.tsx) — all validation is hidden inside a `canSave` boolean with nothing visible.

### Implementation options

| Option | Effort | Notes |
|---|---|---|
| **1. Extend `Input` with `error?: string` prop** (recommended) | ~30 min | No new deps. Track touched state per field. Render inline error + summary strip. |
| **2. `react-hook-form` + `zodResolver`** | ~60 min | Heavier but reuses the server's Zod schema for single source of truth. Worth it if more forms are added. |
| **3. Toast-on-submit** | ~20 min | Transient, weakest UX. Avoid. |

---

## Summary — which tier gets what surface

| Tier | Cause | Where it shows | UX |
|---|---|---|---|
| 1 | Server can't start | stderr | Process exits with a clear log |
| 2 | API request failed at runtime | Global toast | Toast with Retry, form state preserved |
| 3 | Server rejected body (Zod) | Form field | Inline error under each offending field |
| 4 | Local form validation | Form field | Inline helper + summary + disabled-button tooltip |

When in doubt about which tier an error belongs to, ask: **Who can act on it, and where are they looking?**

- The developer (stderr) → Tier 1.
- The end user (toast) → Tier 2.
- The end user at a specific field (inline) → Tiers 3 and 4.
