---
description: Prevents fixed background elements from being broken by clip-path or transform containers.
---

# CSS Stacking Context & Fixed Elements

1. **Never wrap global fixed elements in transforms:** When applying complex scroll animations like `clip-path`, `transform`, or `filter` wrappers (e.g., a ScrollExpand portal), never place globally fixed backgrounds (WebGL canvases, particles) or global sticky Navbars inside them.
2. **Why?** These CSS properties create a new containing block. A `position: fixed` element inside them becomes relative to the wrapper, not the viewport. When the wrapper scrolls away, the background will scroll away with it, breaking the page.
3. **Alternative:** Keep backgrounds and fixed navbars at the root of the React tree. If you need them to animate alongside the wrapper, apply synchronized entrance animations (like `scale` or `opacity` keyframes) directly to the root elements.

## Sticky Elements & Parent Height

4. **`position: sticky` needs explicit parent height:** Any scroll-driven animation using `position: sticky` (like ScrollExpand) requires the parent container to have an **explicit height** (e.g., `height: 100vh`). Without it, the browser collapses the parent to `0px` and the sticky element never renders, making the entire section disappear.

## HeroPortal Pattern (Correct Architecture)

5. **Use `position: fixed` + `clip-path` for full-page intro portals:** The correct pattern for a "portal that expands to fill the screen" is a `position: fixed; inset: 0` container with `clip-path` animated via `requestAnimationFrame` reading `window.scrollY`. 
6. **Children must use `position: absolute`:** Elements inside a `position: fixed` portal (like a Navbar) must use `position: absolute` (not `fixed`) to stay inside the portal bounds. A `position: fixed` child inside a `position: fixed` parent with `clip-path` will escape the clipping boundary.
7. **Always add a spacer div:** The portal is `position: fixed` so it takes no layout space. A sibling `div.hero-portal-spacer` with `height: 220vh` must be added after it to push the remaining page sections down and create the scroll distance for the animation.
