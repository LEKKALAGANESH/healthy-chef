# Manual Steps Before Submission

> All code + commits are done. These are the tasks that need your keyboard / account / camera. Deadline: **25 Apr 2026, 5:00pm IST**. Submission form: https://forms.gle/g4QjYrZpBvxB4Emt9

---

## 1. Provide MongoDB Atlas connection string

**Why:** the server validates env at startup and crashes loudly if `MONGO_URI` is missing.

1. Go to https://cloud.mongodb.com → create a free-tier M0 cluster (or use an existing one).
2. Database Access → create a user with read/write perms.
3. Network Access → add IP `0.0.0.0/0` (for demo convenience; tighten in prod).
4. Connect → "Drivers" → copy the connection string; it looks like:
   ```
   mongodb+srv://<user>:<password>@<cluster>.mongodb.net/healthychef?retryWrites=true&w=majority
   ```
5. Open `D:\Desktop\Ultra corn\healty chef\healthy-chef\server\.env` and paste the string into `MONGO_URI=…`. Fill in your user + password.

---

## 2. Local smoke test

```bash
cd "D:\Desktop\Ultra corn\healty chef\healthy-chef"
npm run dev
```

Expected: server on :5000 logs `✅ MongoDB connected` and `🚀 http://localhost:5000`; client on :5173.

Open http://localhost:5173 and walk through:

- [ ] **Items page:** click "+ New Item" → create `Grilled Chicken Salad` (₹250, variant "Size: Standard") → create `Brown Jeera Rice` (₹150) → create `Cold Pressed Juice` (₹120, variant "Flavor: Watermelon & Basil")
- [ ] Edit one item (click pencil) → change description → save
- [ ] **New Invoice:** fill customer (name, phone, email, address)
- [ ] Add all 3 items. Set Salad qty=2 GST=5% discount=10%. Rice qty=1 GST=5% discount=0. Juice qty=3 GST=12% discount=₹20.
- [ ] Verify **row totals update live** as you change values.
- [ ] Verify **summary** shows Subtotal, Total Discount, Total GST, Grand Total.
- [ ] Click **Save Invoice** → banner shows `Invoice INV-2026-XXXX saved.`
- [ ] Click **Download PDF** → PDF opens with:
  - HealthyChef brand header + Invoice # + Issue + Due date
  - From (supplier with GSTIN) + Bill To (customer) side-by-side
  - Line items table with ₹ rendering correctly (NOT `1` or tofu — if you see that, the Roboto font wasn't registered; check DevTools Network tab for `/assets/fonts/Roboto-*.ttf` 200s)
  - Summary block right-aligned
  - Terms & Conditions + "Thank you for choosing HealthyChef!"
- [ ] **History tab** → saved invoice listed with grand total
- [ ] Click "Details" → expand → click Download PDF again → works

If any checkbox fails, let me know and I'll debug.

---

## 3. Push to GitHub

```bash
cd "D:\Desktop\Ultra corn\healty chef\healthy-chef"

# Option A — GitHub CLI (fastest):
gh repo create healthy-chef --public --source=. --push

# Option B — manually:
#   1. Create empty repo at https://github.com/new named `healthy-chef`
#   2. Then:
#      git remote add origin https://github.com/<your-username>/healthy-chef.git
#      git push -u origin main
```

Confirm it's public and the README + code are visible.

---

## 4. Record the <2 min video

**Tool:** OBS Studio, ShareX, or Windows Game Bar (Win+G). Record at 1080p.

**Script (60-second pacing):**

| Time      | What to show                                                                                                                                                                                                                                                                      |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0:00-0:12 | Terminal `npm run dev` — both server + client start. Point out `✅ MongoDB connected`                                                                                                                                                                                             |
| 0:12-0:28 | Items page — create 3 items (salad, rice, juice) with variants + prices                                                                                                                                                                                                           |
| 0:28-0:48 | New Invoice — fill customer, add 3 lines, change qty/GST/discount and show row totals + summary totals updating live                                                                                                                                                              |
| 0:48-1:02 | Click Save → click Download PDF → open the PDF, scroll through it (show ₹ rendering, T&Cs at bottom)                                                                                                                                                                              |
| 1:02-1:12 | History tab → click Details → Download PDF again                                                                                                                                                                                                                                  |
| 1:12-1:58 | VSCode scroll: `server/src/models/Invoice.ts`, `server/src/services/invoiceCalc.ts`, `client/src/components/pdf/InvoicePDFDocument.tsx`, `client/src/components/invoice/LineItemRow.tsx`. Mention "31 server tests + 9 client tests all green" and show `npm test` output briefly |

Export as MP4. Upload to Google Drive or YouTube (unlisted). Copy the shareable link.

---

## 5. Submit

1. Open https://forms.gle/g4QjYrZpBvxB4Emt9
2. Fill: name, email, GitHub repo URL, video URL.
3. Submit.
4. Confirm submission timestamp is before **25 Apr 2026, 5:00pm IST**.

---

## Reference files

- `IMPLEMENTATION_PLAN.md` — full plan with every task (personal reference, gitignored).
- `README.md` — project overview (committed, visible on GitHub).
- `server/.env.example`, `client/.env.example` — committed placeholders.
- `server/.env`, `client/.env` — local only, gitignored.

## If something breaks

- **Server won't start with env error:** `MONGO_URI` not pasted or malformed. Check `server/.env`.
- **PDF shows `1` where ₹ should be:** `client/public/assets/fonts/Roboto-Regular.ttf` missing or the path in `pdfTheme.ts` is wrong. Both TTFs should be ~160KB each.
- **Commit blocked by husky:** your message doesn't match Conventional Commits. Use `npm run commit` for a guided prompt, or write `type(scope): subject` manually.
- **Port in use:** server picks `5000` from env; edit `server/.env` if needed. Client's `5173` is Vite default.
