# Remove the Telegram popups on the Study section

## What's actually happening

Both popups in your screenshots ("Telegram Community !!" with the PW-MARCO banner, and the same popup with the ADSEMPIRE banner) are created by the **upstream site itself**, not by the loader script.

The loader's `layout.js` actually contains a `handleTelegram()` function whose job is to auto-close that popup. In the current proxy code we neutered `handleTelegram()` along with the other popup functions — so the popup that used to be auto-dismissed now stays on screen. Our blanket `display:'flex'` → `display:'none'` rewrite also interferes with normal layout code in that file.

## The fix

1. Stop disabling `handleTelegram()` in `src/lib/site-proxy.ts` — let the loader keep auto-closing the Telegram popup as it did originally.
2. Remove the blanket `.style.display='flex'` → `'none'` string rewrite (too broad, can break unrelated UI).
3. Strengthen the guard script injected into every page so the popups can never render, regardless of which banner image they use:
   - A `MutationObserver` plus a short interval that finds any element whose text contains `Telegram Community`, `Join The Channel For Latest Updates`, or a `Join Now!` button, walks up to its dialog/overlay container, and removes it.
   - Removes any sibling backdrop/overlay left behind, and restores `body`/`html` `overflow` and `pointer-events` so the page stays scrollable and clickable.
   - CSS rules hiding those containers as a first line of defence before the JS runs.
4. Keep Login / Sign Up suppression exactly as it is.

## Verification

Load `/study/batches` through the proxy in a headless browser, wait for the loader script to run, and confirm no popup or dark backdrop is present in the DOM and the page still scrolls, then screenshot as evidence.

## Note

Only `src/lib/site-proxy.ts` changes; logo, branding, routing and everything else stay as they are.
