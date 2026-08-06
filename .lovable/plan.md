# Fix the floating right-edge toggle + how you can swap the logo yourself

## Why the toggle is missing right now

`dock()` in `src/lib/site-proxy.ts` never creates a button — it only *finds* one the upstream site already renders, and only if all of these match at the same time:

- computed `position: fixed`
- size between 10x10 and 90x110 px
- right edge within 24 px of the viewport edge
- inner text is 2 characters or less and one of `< > ‹ › « » ⟨ ⟩ ← → |`

On most screens (and on every page after login where the upstream layout differs) at least one of those checks fails, so nothing gets tagged and no styling applies. That is why it appears only briefly around the login screen. The popup killer also treats fixed, high `z-index` nodes as overlay candidates, which can suppress it before it is ever tagged.

## The fix: stop depending on the upstream button

1. **Inject our own toggle.** The guard script appends a single `<button data-sx-dock>` directly to `body` (created once, re-created if React wipes it). Being ours, it exists on every device, every route, logged in or out, and can never be clipped by an ancestor.
2. **Behaviour:** tapping it opens the site's hamburger drawer by locating the existing menu/hamburger button and dispatching a click; if no drawer button is found, it falls back to scroll-to-top so it is never a dead control. Icon flips (arrow ‹ / ›) with drawer state.
3. **Styling:** black pill flush to the right edge, vertically centred, ~44x56 px (current sizing kept), `position: fixed`, `z-index` just under the welcome modal, `opacity/visibility` forced, no transitions so it can't flicker on hover or scroll.
4. **Protection:** add `[data-sx-dock]` to the popup-killer and overlay-detection allowlists (already partly there) and make sure the mobile stylesheet's `overflow-x: hidden` rules can't clip it.
5. **Keep the old detection too**, but only to hide the upstream duplicate if one exists, so you never see two toggles.

## How you can apply a logo yourself later

All logo references in the proxy already resolve to **one constant** in `src/lib/site-proxy.ts`. To change the logo you have two options:

- **Easiest:** send me the image in chat (or a direct image URL) and say "use this logo" — I upload it to the project CDN and point that constant at it, including the favicon.
- **Manual:** put the file at `src/assets/<name>` as a Lovable asset and change the single logo constant + `public/favicon.png`. Everything else (header, drawer, rewritten upstream image URLs) picks it up automatically because they all read that one constant.

Note: today the header logo next to `STUDYxANSHU` is deliberately hidden, per your earlier request. If you want a logo visible there again, that CSS rule has to be removed at the same time — tell me and I'll include it.

## Technical notes

- Only `src/lib/site-proxy.ts` changes; no new routes, files, or dependencies.
- The toggle is appended outside the React tree (like the welcome modal) so hydration error #418 is not re-triggered.
- Verification at 320 / 360 / 442 / 768 / 1280 px widths on public routes in a headless browser; the logged-in pages I can only cover defensively and would ask you to confirm once.
