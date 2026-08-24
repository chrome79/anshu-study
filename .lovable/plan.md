# Standalone Frontend Clone of STUDYxANSHU

## Goal

Upstream site (`lite-pwmarco.pages.dev`) ka poora frontend yahan React + TanStack Start mein rebuild karna hai, static dummy data ke saath. Aap baad mein isi frontend ko apni nayi website ke liye reuse kar sakte ho.

## Current state

- Project abhi proxy mode mein chal raha hai: `src/lib/site-proxy.ts` upstream se fetch karke rewrite karta hai.
- Upstream site abhi "temporarily paused" hai, toh fresh scrape abhi possible nahi hai.
- Proxy code mein already branding rules, logo asset, aur menu structure kaafi kuch pata chalta hai.

## Approach

Proxy hata kar standalone React app banayenge. Upstream ke pages ko real components mein todenge.

```text
src/routes/
  __root.tsx              -> shared shell (header, drawer, footer)
  index.tsx               -> /  (landing/hero + welcome modal)
  study.batches.tsx       -> /study/batches  (batch cards grid/list)
  study.batch.$id.tsx     -> /study/batch/:id  (batch detail + lectures)
  lecture.$id.tsx         -> /lecture/:id  (video player page)
  about.tsx               -> /about  (static about page)
  contact.tsx             -> /contact  (static contact page)
```

### Phase 1: Design system + assets

- Existing `src/styles.css` ko extend karna, dark theme dominate rakhte hue.
- Logo: existing embedded AK logo / `public/brand-logo.jpg` use karna.
- Typography, colors, spacing upstream ke closest match mein set karna.
- Lucide icons use karna for menu/items.

### Phase 2: Shared chrome

- Header: hamburger trigger + "STUDYxANSHU" wordmark + optional logo.
- Hamburger drawer: custom menu items (Study, Join Telegram, WhatsApp Channel, About Developer, About Us, Contact Us) — title case + unique icons.
- Footer: copyright + developer links.
- Welcome modal: 20s countdown, progress bar, feature list, Telegram/WhatsApp/Instagram CTAs, sessionStorage se ek baar hi dikhana, sirf X button se band.

### Phase 3: Pages rebuild

- **Home (`/`)**: hero section, feature highlights, CTA buttons, welcome modal.
- **Study/Batches (`/study/batches`)**: batch cards grid with filters/search, batch categories (Regular, Infinity, Infinity Pro, Fastrack, etc.).
- **Batch Detail (`/study/batch/$id`)**: batch info, lectures list, notes/DPP tabs.
- **Lecture Player (`/lecture/$id`)**: video player iframe/placeholder, lecture metadata.
- **About / Contact**: static content with proper branding.

### Phase 4: Components

- `BatchCard`, `LectureRow`, `VideoPlayer`, `WelcomeModal`, `MobileDrawer`, `FeatureList`, `CountdownBar`.
- Static data files: `src/data/batches.ts`, `src/data/lectures.ts`, `src/data/menu.ts`.

### Phase 5: Branding & cleanup

- Proxy routes (`src/routes/$.ts`, `src/routes/index.tsx` proxy handler) remove karna.
- `src/lib/site-proxy.ts` remove ya archive karna.
- Global text: "PW-MARCO" variants -> "STUDYxANSHU", standalone "MARCO" -> "ANSHU".
- Popups, login/signup, XP badge — sab disable ya remove karna.

### Phase 6: SEO + metadata

- Har route ka apna `head()` with title, description, og tags.
- Canonical logo path for og:image.

## Technical notes

- Stack: TanStack Start v1, React 19, Tailwind v4, shadcn/ui components, Lucide icons.
- Data: static TypeScript files (no backend needed for now).
- Routing: file-based; `routeTree.gen.ts` auto-generate hoga.
- Video: external stream iframe/URL placeholder; real DRM/stream URLs dummy data mein.
- Images: logo local asset; batch thumbnails placeholder ya user-provided.

## Open point

Upstream site abhi paused hai. Do options hain:

1. **Wait for upstream**: Jab site wapas aaye, uska full scrape karke exact UI copy karein.
2. **Build from existing knowledge**: Abhi shuru karein proxy code aur previous screenshots se, aur upstream ke wapas aane par refine karein.

Kya aap chahte ho ki abhi se Phase 1-2 shuru karun, ya upstream ke live hone ka wait karun?
