# Rebranded Proxy of pwmarco.pages.dev

Serve your existing site through this project unchanged, except for the logo, the brand name, and the loader script's login/signup/popup behaviour.

## What I found (verified)

- `pwmarco.pages.dev` is a Next.js app on Cloudflare Pages. `/` redirects (307) to `/study/batches`.
- The HTML has inline scripts that set brand values: `NAME="PW-MARCO"`, `ICON="https://i.ibb.co/PZThbjmf/1000002876-removebg-preview-2.png"`, `PLAYER="PW-MARCO Premium Player"`, plus `<title>PW-MARCO</title>`.
- It loads `https://marco-magic-loader.lovable.app/api/public/loader.js`, which in turn loads and caches `https://cdn.jsdelivr.net/gh/raghu554tiwari-lang/batch-layout@main/layout.js` (cached in localStorage under `marco_cached_js_v8`).
- `layout.js` is where the auth UI and popups live: `showLogin()`, `showSignup()`, a gate that calls `showLogin()` when no user is present, `showWelcomePopup()` (auto-shown on load), plus a Telegram popup and a "Brainix" floating popup.

## How it will work

A catch-all server proxy route forwards every request to `pwmarco.pages.dev`, passes method, headers, cookies and body through, and returns the upstream response. Binary and static assets (`/_next/*`, images, fonts) stream through untouched. HTML and JavaScript responses get rewritten on the fly.

```text
browser -> this app (proxy + rewrite) -> pwmarco.pages.dev
                     |-> /__ext/loader.js  -> marco-magic-loader.lovable.app
                     |-> /__ext/layout.js  -> cdn.jsdelivr.net (patched)
```

### Rewrites applied to HTML

1. Logo: every occurrence of the old ibb URL replaced with `https://i.ibb.co/BKQM1dSs/71696247-c72a-491e-9b18-4d0e3d23c905.jpg` (covers `<img src>`, favicon/apple-touch links, and the inline `ICON=` constant).
2. Branding: `PW-MARCO`, `PW MARCO`, `PWMARCO`, and `pwmarco` in visible text/titles replaced with `STUDYxANSHU` (case-insensitive, but leaving the `pwmarco.pages.dev` host references and internal `data-pw-marco` attributes intact so nothing breaks).
3. The `marco-magic-loader` script tag is repointed to our own `/__ext/loader.js` so its code can be patched.

### Rewrites applied to the loader/layout scripts

- Inside `loader.js`, the jsdelivr `layout.js` URL is repointed to `/__ext/layout.js`, and the localStorage cache key is bumped so a stale cached copy can't reintroduce the original behaviour.
- Inside `layout.js`:
  - `showLogin()` and `showSignup()` become no-ops, and the auth gate no longer calls them, so the Login and Sign Up screens never render.
  - `showWelcomePopup()` and the other auto-opening popups (Telegram, Brainix floating popup) become no-ops so nothing appears unprompted.
  - Popups only opened by an explicit button tap (Info, Live, Batch Token) — decision needed below; default in this plan is to also suppress them, per "block any popup created by the loader script".
  - The same logo and branding replacements run over this file.
- A small guard script is injected in the page head as a safety net: it blanks `window.showLogin` / `showSignup` / `showWelcomePopup` if a cached or future version of the script tries to define them.

### Routing

The proxy keeps paths identical, so `/study/batches` and every other upstream route work the same. The current placeholder home route is replaced so `/` proxies upstream (following its redirect to `/study/batches`).

## Technical notes

- Implemented as a TanStack server route (`src/routes/api/...` style catch-all plus a root splat) running in the edge runtime; `fetch` with `redirect: "manual"` so upstream 307s are surfaced to the browser as-is.
- `Set-Cookie` headers are forwarded with domain attributes stripped so sessions still work on this origin.
- Content-encoding is not re-sent for rewritten text bodies (decoded before rewrite), and `content-length` is dropped to avoid mismatches.
- Only `text/html`, `application/javascript`, and `text/css` bodies are read into memory for rewriting; everything else streams.

## Open point

"Block any popup created by the loader script" can mean all popups, or only the ones that appear on their own. This plan suppresses all loader-created popups, including the Info / Live / Batch Token ones opened by the floating buttons. Say the word and I'll keep those button-triggered ones working and only block the automatic ones.
