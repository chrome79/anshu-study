# Fix the blank page caused by the popup blocker

## What's happening

The upstream site itself is fine — the proxy still returns a normal page (HTTP 200, `/` redirects to `/study/batches` as before). The blank screen comes from the popup-removal guard script that was added last round.

That guard searches every `div`/`section`/`aside` for text like "telegram community", then walks **up to 8 levels of ancestors** and deletes the biggest one that looks like an overlay. On the Study/Batches page the matching text sits inside the main page wrapper, so the guard deletes the entire page content instead of just the popup — leaving a blank screen. The `Cannot read properties of null (reading 'removeChild')` error in the console is the same code deleting a node twice.

## The fix (in `src/lib/site-proxy.ts`, guard script only)

1. **Only treat truly overlay-like elements as popups.** Require the candidate itself (or an ancestor within 3 levels) to be `position: fixed`/`absolute` with a high `z-index`, or `role="dialog"`. Plain in-page content that merely mentions Telegram is left alone.
2. **Never remove a page-level container.** Refuse to remove `body`, `html`, `main`, `#__next`, `#root`, or any element that covers most of the viewport while containing the page's primary content.
3. **Hide instead of delete.** Apply the existing `data-sx-popup-killed` class (display:none) rather than `removeChild`, which also removes the null-`removeChild` crash and the React hydration error (#418) caused by mutating server-rendered DOM.
4. **Run after hydration, and only for overlays.** Keep the MutationObserver + scroll restore, but drop the blind 500ms interval that repeatedly re-scans and mutates the tree.
5. Keep everything else untouched: logo swap, `STUDYxANSHU` branding, disabled Login/Sign Up, `marcoAuthDiv` / `marcoWelcomeOv` / `marcoBrainixPanel` hiding.

## Verification

- Load `/study/batches` through the proxy in a headless browser: page content renders, no console errors.
- Confirm no Telegram popup/overlay is visible and the page scrolls normally.
