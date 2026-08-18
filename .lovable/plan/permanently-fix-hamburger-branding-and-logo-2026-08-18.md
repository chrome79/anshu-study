# Permanently fix hamburger branding and logo

## Confirmed current issue

- The proxy already rewrites common visible `PW-MARCO` / `MARCO` branding, but some protected/runtime content can still restore upstream branding after the drawer re-renders.
- The hamburger brand fixer currently edits a detected upstream title node. If that node is replaced by the upstream app, the custom name and logo disappear until detection succeeds again.
- The requested logo is already stored locally as `anshu_logo_v2.jpg`, but the general header image-hiding CSS can conflict with it; the drawer exception is too dependent on runtime attributes being present at the right moment.

## Changes

1. **Remove old branding everywhere visible**
   - Expand the safe visible-text rewrite to cover `PW MARCO`, `PW-MARCO`, `PWMARCO`, standalone visible `PW`/`MARCO`, and related upstream brand variants without modifying hostnames, loader identifiers, API paths, media URLs, or code keys required for the proxy to work.
   - Add a runtime text pass that repeatedly replaces old branding in rendered text nodes, including content mounted later by the upstream app.

2. **Make hamburger name permanent**
   - Create a dedicated drawer brand block owned by the proxy rather than relying on an upstream title node.
   - Hide only the original upstream drawer brand row and render `STUDYxANSHU` in the same position.
   - On every drawer remount/mutation, confirm the custom block is attached to the current drawer and recreate it if necessary, while preventing duplicates.

3. **Fix the hamburger logo**
   - Use the local cached copy of the exact requested logo (`71696247-c72a-491e-9b18-4d0e3d23c905.jpg`) so an external image-host failure cannot leave a white/blank logo.
   - Place it immediately beside `STUDYxANSHU`, force a stable circular 34px size, and scope the show rule specifically to the drawer brand block.
   - Exclude that block and image from every generic brand-image hiding pass, even before runtime marker attributes are added.
   - Add an image-load fallback that reapplies the local asset if the drawer image source is replaced or fails.

4. **Verification**
   - Check initial load, open/close/reopen of the hamburger, and navigation/remount behavior.
   - Verify no visible old branding remains and the hamburger consistently shows the requested logo beside `STUDYxANSHU` without affecting the main header or other UI.

## Technical scope

- Changes remain limited to `src/lib/site-proxy.ts`; the existing local logo asset is reused.
- Required upstream hostnames and internal `marco-magic-loader` identifiers remain protected so proxy routing and lecture playback are not broken.