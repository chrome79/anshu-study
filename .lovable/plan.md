# Logo kyu nahi dikhta + hamburger me wapas laana

## Asli wajah (code me confirmed)

`src/lib/site-proxy.ts` me do rules aapke hi purane requests se aaye hain, aur ab wahi har naye logo ko chhupa dete hain:

1. Injected CSS: `[data-sx-wordmark] img, [data-sx-header] img, [data-sx-brandimg] { display:none!important; ... }`
2. Guard script ka runtime image scanner: har `img` jiska `src`/`alt` `logo|favicon|brand|anshu|ak-logo|i.ibb.co|71696247` jaisa dikhta hai use `data-sx-brandimg` lagakar hide kar deta hai.
3. Drawer ka custom brand block (`drawerBrand()`) pichhle request par no-op kar diya gaya tha — is liye hamburger me na naam na logo.

Matlab: logo asset theek upload hota hai (`anshu_logo_v2.jpg` project me maujood hai), lekin render hote hi hamara khud ka hide rule use invisible kar deta hai.

## Fix (jo aapne choose kiya: sirf hamburger drawer, purana AK gold logo)

1. `drawerBrand()` ko dobara chaalu karna — proxy ka apna brand block jo drawer ke top par insert hota hai: gol 34px AK logo + `STUDYxANSHU` text, aur upstream ka original brand row hide.
2. Us block ko hide-rules se exempt karna:
   - image scanner me `[data-sx-drawer-logo]` aur drawer ke andar ki images skip karna (attribute lagne se pehle bhi, parent check se).
   - CSS me `[data-sx-drawer-brand="owned"] [data-sx-drawer-logo]` ko `display:block!important; visibility:visible!important; opacity:1!important` force karna (rule already hai, sirf order/specificity pakka karna).
3. Permanence: har MutationObserver tick par check — agar drawer remount hua ya block gayab hua to phir se insert, duplicate banaye bina.
4. Fallback: image `error`/blank hone par `src` ko wapas local asset URL par set karna, taaki white/blank logo na dikhe.
5. Header (top bar) ka logo pehle jaisa hidden rahega — sirf drawer me dikhega.

## Aage aap khud logo kaise badloge

Poore proxy me logo ek hi constant se aata hai: `NEW_LOGO` / `LOGO_ASSET` in `src/lib/site-proxy.ts`.

- Aasaan: chat me image ya direct image URL bhejo + "ye logo lagao" — main CDN asset banake wahi constant point kar dunga.
- Manual: file `src/assets/` me asset banao aur wahi ek constant badal do; header/drawer/rewritten URLs sab automatically pick karenge.

## Technical notes

- Sirf `src/lib/site-proxy.ts` change hoga; naya asset nahi chahiye (`anshu_logo_v2.jpg` reuse).
- Upstream DOM se kuch remove nahi hoga (hide-by-attribute), so React hydration safe.
- Drawer sign-in ke peeche hai, is liye verification aapke logged-in device par ek baar confirm karna hoga.
