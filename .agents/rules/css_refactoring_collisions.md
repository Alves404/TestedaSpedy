---
description: Prevents CSS layout collisions when refactoring full-screen components into scrollable layouts.
---

# CSS Layout Refactoring

When converting a component from a "Full-Screen Centered" layout (e.g., using `height: 100vh`, `overflow: hidden`, `justify-content: center`) to a "Scrollable Multi-Section" layout:
1. **Always hunt for legacy global styles:** Check global files like `index.css` or `App.css` for old classes (like `.layout`, `.container`, `.wrapper`) that might impose hardcoded heights or centering logic.
2. **Remove conflicting legacy CSS:** Delete the old styling blocks to prevent Flexbox overlapping, which typically causes all new sections to pile up on top of each other.
3. **Backgrounds:** If the new scrollable page has a canvas/WebGL background, ensure its container uses `position: fixed` (not `absolute`) so it doesn't scroll away out of view.
