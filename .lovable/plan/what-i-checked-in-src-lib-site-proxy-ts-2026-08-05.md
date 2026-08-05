- Fix: logo next to the name, and missing hamburger menu options

## What I checked in `src/lib/site-proxy.ts`

- The logo next to the wordmark is hidden only by CSS scoped to `[data-sx-wordmark] img` and `[data-sx-header] img`. Those attributes are set only when the script finds an element whose text is exactly `back` (the old "- back" control). On screens where that control doesn't exist, neither `data-sx-wordmark` nor `data-sx-header` ever gets set, so the CSS matches nothing and the logo stays visible. Separately, the image fixer actively rewrites any `img` whose src looks like a logo to the new logo instead of hiding it — so a brand image next to the title is re-shown, not removed.
- The custom menu rows (`JOIN TELEGRAM`, `WHATSAPP CHANNEL`, `ABOUT DEVELOPER`, `TELEGRAM`, `INSTAGRAM`) are inserted only when a template row is found by exact text match on `about us` / `ua-nexa` / `[data-pw-about]`. If those rows don't exist in the drawer (different wording, or the loader hid them first), `tpl` stays null and nothing is inserted at all — that is why nothing appears. There is no fallback path.

## 1. Kill the logo next to the name (completely)

- Stop relying on `data-sx-header` tagging. Add a runtime pass that finds the brand image directly: any `img` (or inline `svg`) whose `src`/`alt` matches the logo patterns (`i.ibb.co`, `1000002876`, `71696247`, our canonical/asset URLs, `logo`, `pw`, `favicon`) **and** which sits in the top ~120px of the page or inside the same row as the brand/wordmark text, gets marked and hidden with `display:none!important` (kept in the DOM for hydration safety).
- Exclude it from the image-fixer rewrite so it is never re-pointed and re-shown.
- Broaden the CSS so it no longer depends on the `back` control: hide brand images by the new marker attribute plus a top-bar structural selector, and tag the header row independently (widest element near the top of the page containing the hamburger button).
- The wordmark stays text-only: `STUDYxANSHU`, no image, no leftover gap.

## 2. Make the hamburger options actually appear

- Add drawer detection independent of the `About us` row: find the open drawer/panel (`[role="dialog"]`, `aside`, `nav`, or a fixed/absolute panel that contains the menu rows such as `My Batches` / `Settings` / `Logout`) and treat its scrollable list as the insertion host.
- Insertion order of preference: (a) clone an existing real menu row as template so styling matches; (b) if no clone target exists, build rows from scratch with padding/font/colour matching the neighbouring rows.
- Keep hiding `UA-NEXA` / `[data-pw-about]` when present, but no longer make insertion conditional on finding them.
- Re-check on every observer tick: if the drawer re-mounts, insert again. Idempotency is keyed on the rows existing **inside the current drawer**, not a global query.
- Labels and links stay exactly as before: `JOIN TELEGRAM`, `WHATSAPP CHANNEL`, then an `ABOUT DEVELOPER` heading, then `TELEGRAM` and `INSTAGRAM`, each opening in a new tab.

## Technical notes

- All changes stay inside the guard script and injected stylesheet in `src/lib/site-proxy.ts`; no new routes, files, or dependencies.
- Nothing is removed from the DOM (hide-by-attribute only) so the React hydration error stays away.
- The drawer and header live behind the sign-in wall, so this is written defensively against class-name churn; I can't verify the drawer headlessly and will ask you to confirm on your logged-in device.