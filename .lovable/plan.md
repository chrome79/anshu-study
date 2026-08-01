# Fix hamburger menu items + new logo

## What I checked

- The proxy's guard script already contains the code that hides `About us` / `UA-NEXA` and inserts `JOIN TELEGRAM`, `WHATSAPP CHANNEL`, and the `About Developer` section.
- Loading `/study/batches` in a headless browser shows the sign-in screen, so the drawer never renders there and nothing gets marked (`data-sx-menu-hidden` and `data-sx-menu-item` counts are both 0). The insertion logic therefore can't be verified without a logged-in session — it has to be made resilient instead of matching one exact DOM shape.
- The drawer rows are not plain upstream markup: the loader's own script clones the `My Batches` row to create `About Us`, and rewrites `NEXA` to `UA-NEXA`, marking its clone with `data-pw-about`. These rows are anchors containing nested `span`/`p` nodes, and they are created only after the drawer opens.

That nesting is the most likely reason nothing appeared: the current row matcher bails out (`continue`) when a candidate contains an inner `a`/`li`/`button`, and it requires an exact text match, so on the real drawer no template row is found and no new rows get inserted.

## 1. Make the menu injection work

In the guard script in `src/lib/site-proxy.ts`:

- Match rows by trimmed, whitespace-normalised text containing `about us` / `ua-nexa` / `nexa` instead of a strict exact match, and drop the inner-element bail-out. Pick the deepest matching row (the anchor/button itself) as both the hide target and the clone template.
- Also treat the loader's own `[data-pw-about]` clone as a row to hide, since that is what actually renders.
- Insert the new rows into the same parent as the hidden row, right after it, so they land inside the drawer list rather than at the end of an unrelated container.
- Re-check on every observer tick: if the drawer re-mounts (rows disappear from the document), insert again. Idempotency is keyed on the rows being present *inside the current drawer*, not on a global query.
- Fallback: when no template row can be found but a drawer-like scroll container is present, build the rows from scratch with matching padding/font styling so the options always exist.
- Keep the existing behaviour: labels `JOIN TELEGRAM`, `WHATSAPP CHANNEL`, then an `ABOUT DEVELOPER` heading, then `TELEGRAM` and `INSTAGRAM`, each opening its assigned link in a new tab.

## 2. New logo

- Upload the provided gold `AK / ANSHU KESHAWAT` circular logo as a CDN asset and use its URL as the replacement for the current logo image everywhere the old logo URL appears (replacing the temporary `i.ibb.co` link currently used).
- Use the same image for the browser favicon.

## 3. Logo next to the wordmark

- The header control that currently reads `STUDYxANSHU` (where `- back` used to be) gets the logo added inline: a small round image (about 22px, circular) inserted so the text reads `STUDY` + logo + `xANSHU`, i.e. the mark sits between the two halves of the wordmark.
- Sizing keeps the header on one line on mobile: the image is `flex-shrink:0`, vertically centred, with a small horizontal gap, and the text keeps its truncation guard.

## Technical notes

- All edits stay inside `src/lib/site-proxy.ts` (guard script + branding rewrite constants); no new routes or dependencies.
- Elements are still hidden via attribute + `display:none!important`, never removed, so React hydration stays intact.
- The logo is added as a `.asset.json` pointer under `src/assets/` and referenced by its CDN URL inside the injected script; the favicon is written as a real file in `public/`.
