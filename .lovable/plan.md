# Switch proxy target, drop drawer branding, restore popup countdown

All work stays in `src/lib/site-proxy.ts`.

## 1. New target website

- `UPSTREAM_ORIGIN` changes from `https://pwmarco-phi.vercel.app` to `https://lite-pwmarco.pages.dev`.
- The `PROTECTED` token list swaps `pwmarco-phi.vercel.app` for `lite-pwmarco.pages.dev` so the branding rewrite never corrupts the new hostname in links, redirects, or asset URLs.
- The self-frame guard's hostname check is updated to match the new host as well.
- Everything else (rewrites, menu links, popup, loader patching, routing) stays exactly as it is.

## 2. Remove name + logo from the hamburger

- The proxy-owned drawer brand block is already only a cleanup no-op, so what still shows the custom name is the global branding text pass rewriting the upstream drawer title to `STUDYxANSHU`, plus the forced logo image pass.
- Scope those two passes so nothing inside the open drawer is rewritten: skip drawer-scoped text nodes in the runtime branding cleanup and skip drawer-scoped images in the logo-forcing pass. The drawer then shows the upstream name and its own icon untouched.
- Header/top-bar behaviour is unchanged.

## 3. Welcome popup: visible 20-second countdown

- Add back a countdown to the modal: a live `20s ... 1s` number line plus a thin progress bar that drains over exactly 20 seconds.
- When the timer hits zero, the modal auto-closes with the same fade/scale animation.
- Closing early via ✕ clears the timer.
- Trigger behaviour is unchanged: immediate on first visit, once per session (`hasSeenWelcomePopup`), and only ✕ dismisses it (outside taps stay blocked).

## Technical notes

- Single file touched: `src/lib/site-proxy.ts`.
- The countdown uses one `setInterval` with a stored handle so both auto-close and manual close cancel it.
- Verification: load the app, confirm content now comes from `lite-pwmarco.pages.dev`, open the hamburger to confirm original name/icon, and confirm the popup counts down from 20 and self-closes.
