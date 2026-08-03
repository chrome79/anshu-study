# Mobile polish, welcome modal, canonical logo, floating toggle

## What I checked

- The whole app is a reverse proxy of the upstream site — there are no local UI components. Every visual change has to be made through the injected stylesheet/script inside `src/lib/site-proxy.ts` (the guard script currently injects one small `<style>` plus DOM fixers for menu, logo and wordmark).
- The current logo is already the gold AK asset (`src/assets/ak-logo.png.asset.json`), applied at rewrite time and again at runtime for any `img` whose src looks like a logo. It has no cache-busting version and the header image is fixed at 24px.
- The header, XP badge, Select Batch / Today's Class / Community cards and the right-edge floating toggle all live behind the sign-in wall, so they can't be inspected headlessly. Styling must therefore be written as resilient, attribute/text-based CSS rather than exact upstream class names.
- There is no welcome modal of our own; the upstream one (`showWelcomePopup`) is neutralized. Ours will be a brand-new injected element, so it is fully under our control.

## 1. Injected mobile stylesheet (Tasks 1 and 2 of the styling asks)

Add a single versioned `<style data-sx-ui>` block to the guard script, mobile-first with `@media (max-width:480px)` refinements:

- `html, body { overflow-x: hidden; max-width: 100vw; }` to kill horizontal scroll and layout shift.
- Header row: force the top bar container to `display:flex; justify-content:space-between; align-items:center; gap:8px; padding:8px 16px;` with `min-width:0` on the left group so the wordmark truncates gracefully instead of pushing controls off-screen.
- Logo/title scaling: header logo capped at 36px (34px under 360px width), wordmark `clamp(14px, 4.2vw, 19px)` with `min-width:0` and no truncation at 320px.
- XP pill: compact padding, smaller font, `border-radius:9999px`, `flex-shrink:0`, aligned next to the theme toggle with `gap:8px`.
- Content: uniform `padding:16px` on the main content wrapper, `gap:16px` vertical rhythm between top-level sections, font sizes normalized to 14/16/18px with stronger contrast.
- Cards: batch select gets `border-radius:12px`, thin translucent border, dark field styling; the class/community cards get `border-radius:16px`, subtle dark surface, thin border, balanced padding, and `overflow-wrap:anywhere` + `line-height:1.5` so the community text stops breaking awkwardly.
- Buttons: consistent pill/rounded primary and secondary styling with proper tap targets (min 40px height).

Selectors are written defensively (attribute, tag, and structural selectors plus a small runtime pass that tags the header/XP/section nodes with `data-sx-*` hooks by text match) so they survive upstream class-name churn.

## 2. Welcome announcement modal (Task 2)

Build it entirely in the injected script, rendered into a container appended to `body` (never inside the React tree, so hydration stays clean):

- Opens automatically on first paint of each page load, after hydration settles.
- Backdrop: `rgba(0,0,0,.8)` + `backdrop-filter: blur(12px)`, click-outside closes.
- Card: centered, `border-radius:24px`, near-black slate/emerald background, emerald glow border and large shadow, internal scroll on short screens, fade+scale in/out animation.
- Content in order: `🌟ANSHU KESHAWAT🌟` heading in neon emerald; centered `LOVE ❤️ FROM` with `SUGANDHNAGAR` beneath it in a cyan/gold gradient; red warning box ("Do NOT purchase this app from anyone. It is 100% FREE always."); "What is Available Free" emerald heading with the eight bullet items exactly as listed; full-width pink→rose→purple gradient pill CTA "Follow Developer on Instagram" linking to the Instagram profile in a new tab.
- Footer: `Auto-closing in Xs` counting 20 → 0 plus a 1px emerald progress bar animating 100% → 0% width over 20s; auto-closes at zero. Top-right `X` button also closes. Shown once per page load (guarded so re-renders don't duplicate it).

## 3. Canonical logo + cache invalidation (Task 3)

- Re-publish the supplied gold AK monogram as a new permanent CDN asset named `anshu_keshawat_logo_v1_canonical.png`, compressed but full fidelity, and retire references to the old pointer.
- Reference it everywhere through one constant with a version query (`...png?v=fixed_final_2024`): HTML/JS/CSS rewrites, the runtime image fixer, the header wordmark image, the drawer logo, and the favicon (`public/favicon.png` regenerated from the same source, referenced from `src/routes/__root.tsx`).
- Header logo rendered at max 40px with `p-2`-equivalent breathing room, circular, `object-fit:cover`, `flex-shrink:0`, sitting left of the standardized `STUDYxANSHU` wordmark.

## 4. Floating right-edge toggle (Task 4)

- Pin it with `position:fixed !important`, `right:0`, vertically centered, `z-index:2147483000` so nothing overlays or clips it, and neutralize `overflow:hidden`/`transform` on its ancestor chain (via a runtime pass that reparents it to `body` if an ancestor clips it) so it never vanishes on scroll or hover.
- Suppress the flicker by removing opacity/visibility transitions tied to hover and forcing `opacity:1; visibility:visible; pointer-events:auto`.
- Bump size ~18%: larger padding and min dimensions (~44x56px), keeping the black pill shape and the arrow icon centered.
- Ensure the popup-killer and iframe guard never treat it as an overlay (explicit allowlist).

## 5. Cross-device fit

Add tablet/desktop breakpoints (`min-width:768px`, `min-width:1024px`) so the same injected styles centre content with a max width instead of stretching, and verify the header, cards, modal and floating button at 320 / 360 / 414 / 768 / 1280 px widths in a headless browser (public routes) before finishing.

## Technical notes

- All work stays in `src/lib/site-proxy.ts` (plus the new asset pointer and `public/favicon.png`); no new routes or dependencies.
- Nothing is removed from the DOM — elements are only styled, attributed, or hidden — to avoid the React hydration error (#418) seen earlier.
- The modal and style injections run after hydration settles, matching the existing `hydrated` gate.
- Anything behind the login wall can't be visually verified from here; that part is styled defensively and will need one check on your logged-in device.
