# Menu rebrand + link cleanup

All changes stay inside the proxy rewrite layer (`src/lib/site-proxy.ts`), so the upstream site keeps working exactly as before.

## What I verified

- `layout.js` (the loader's layout script) contains `DOWNLOAD_LINK = 'https://m-store-chi.vercel.app'`, several rewrite rules mapping handles to `@official_marco_22`, Instagram/Telegram buttons pointing to `official_marco_22`, a `Powered by MARCO` watermark, and `editHamburgerMenu()` which already hides some menu rows by exact text match.
- "About us" and "UA-NEXA" come from the upstream Next.js drawer, not from `layout.js`, so they must be handled in the injected guard script that runs on the page.

## 1. Kill the m-store link

- In the layout-script rewrite, replace `https://m-store-chi.vercel.app` with a no-op, and neutralize the download/app-store popup that uses it so nothing opens.
- In HTML/JS rewrites, strip any anchor pointing at that host; the guard script also hides any `a[href*="m-store-chi"]` at runtime.

## 2. Handle replacement

- Every occurrence of `@official_marco_22`, `official_marco_22`, `officialmarco22` (in text, `instagram.com/...`, and `t.me/...` URLs) becomes `t.me/Liee070`, and visible handle text becomes `t.me/Liee070`.

## 3. Branding

- Extend the existing branding rewrite: `PW-MARCO` / `PW MARCO` / `PWMARCO` and standalone `MARCO` / `Marco` (including `Powered by MARCO` and the watermark text) become `ANSHU KESHAWAT`.
- The site title / header wordmark keeps `STUDYxANSHU` as already requested; body copy and credits read `ANSHU KESHAWAT`.
- Host names (`pwmarco.pages.dev`) and internal attribute names stay untouched so routing keeps working.

## 4. Hamburger menu

Handled by the injected guard script, which watches the drawer as it opens:

- Hide the `About us` and `UA-NEXA` rows.
- Insert two rows in their place:
  - `JOIN TELEGRAM` -> `https://t.me/+1YqS8Bxcj5M4OTk1`
  - `WHATSAPP CHANNEL` -> `https://whatsapp.com/channel/0029VbCvhNqGZNCp0sKLUk3G`
- Add a separate `About Developer` section below, with a small heading and two rows:
  - `TELEGRAM` -> `https://t.me/Liee070`
  - `INSTAGRAM` -> `https://www.instagram.com/ansh_u_keshawat?igsh=dXF0NDQ5NGh5cWVs`
- New rows copy the styling of the existing menu rows (same font size, padding, icon slot spacing) so they blend in; all open in a new tab.

## 5. Top bar

- The `- back` control next to the hamburger is replaced with the wordmark `STUDYxANSHU`, styled slightly larger and bolder than the current label, with letter-spacing and truncation guards so it fits the mobile header without pushing other controls off-screen.

## Technical notes

- All DOM work lives in the existing `GUARD_SCRIPT` in `src/lib/site-proxy.ts`, reusing its throttled `MutationObserver`; elements are hidden via attribute + `display:none!important` (never removed) so React hydration stays intact.
- Injected menu rows are idempotent (marked with a data attribute) so re-renders don't duplicate them.
- String replacements are added to `rewriteBranding`, `rewriteLayoutJs`, and `rewriteHtml`; no new routes or dependencies.
