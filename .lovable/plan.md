# Hamburger fixes, drawer branding, toggle removal, popup fix

All changes stay inside the guard script / injected CSS in `src/lib/site-proxy.ts`.

## What I checked

- The custom rows (`Join telegram`, `Whatsapp channel`, `About developer` heading, `Telegram`, `Instagram`) are all built in `injectMenuRows()`; `Join telegram` is inserted twice conceptually — once as a top row and once as `Telegram` under the developer heading.
- The drawer's `Contact us` / `Developer & maintainer` rows come from the upstream site; no code currently rewrites their hrefs.
- The drawer brand name and its logo are not handled at all in the drawer; the existing brand-image pass hides any logo image found near the top of the page or in the header/wordmark, which is why the drawer logo is invisible and the name falls back to the upstream site name.
- The floating right-edge pill is created by `dock()` and styled by `[data-sx-dock]` CSS.
- `welcome()` guards only on `window.__sxWelcome` and actively clears the `sessionStorage` flag, so any navigation that remounts/reloads the page shows the modal again.

## 1. Remove "Join telegram" from the About developer section

- In `injectMenuRows()`, drop the `Join telegram` row that sits under the `About developer` heading; that section keeps only `Telegram` and `Instagram`.
- The top-level `Whatsapp channel` row stays as-is. (Say the word if you also want the top `Join telegram` row gone — as written, only the one inside About developer is removed.)

## 2. Fix Contact us / Developer & maintainer links

Add a runtime href-rewrite pass in `menu()` that matches rows by their visible text (case-insensitive, whitespace-normalised) and forces `href`, `target="_blank"`, plus a click handler so upstream JS can't hijack them:

- `Join official channel` -> `https://t.me/+1YqS8Bxcj5M4OTk1`
- `Contact owner` -> `https://t.me/Liee070`
- `Developer` -> `https://t.me/Liee070`
- `Telegram bot` -> `https://t.me/Liee070`

Matching is on the row's own label only (deepest anchor/button), so `Developer` won't also catch the `About developer` heading.

## 3. Drawer brand name + logo

- Runtime pass over the open drawer: find the brand/title node near the top of the drawer (the largest-font text row above the menu list, or any node whose text matches the upstream site name / `PW` / `MARCO` / current site title) and set its text to `STUDYxANSHU`, re-applying on every observer tick so it can never revert.
- Stop hiding images inside the drawer: exclude drawer-scoped images from the brand-image hide rule and from the `[data-sx-header] img` CSS, then force that image's `src` to the provided logo (published as a versioned CDN asset), rendered circular, ~34px, `object-fit:cover`. If no image exists next to the drawer name, one is created and inserted before the text.
- The header (top bar) logo next to `STUDYxANSHU` stays hidden as you asked earlier; only the drawer shows the logo.

## 4. Remove the floating toggle

- Delete `dock()` and its call from `tick()`, plus the `[data-sx-dock]` styles; keep the `[data-sx-dock-upstream]` hide rule so no upstream duplicate appears, and keep the dock allowlist entries harmless.

## 5. Welcome popup: smaller, lighter, once per visit

- Show once per browser session: set a `sessionStorage` flag (`sx_welcome_seen`) when shown and return early if present; stop clearing it. Opening another section then never re-triggers it.
- Lighter and smaller: `max-width` 300px, `max-height` 74vh, reduced padding, backdrop `rgba(0,0,0,.55)` with lighter blur (6px), softer border/shadow, feature list font down to ~11px, CTA buttons ~10px padding / 12px text, countdown reduced to 12s with the progress bar timing matched.

## Technical notes

- Single file touched: `src/lib/site-proxy.ts`, plus one new logo asset pointer under `src/assets/`.
- Nothing is removed from the upstream DOM (hide-by-attribute / text rewrite only) so React hydration stays clean.
- Drawer internals sit behind the sign-in wall, so the label/link/logo passes are written defensively by text match rather than upstream class names; you'll need one check on your logged-in device.
