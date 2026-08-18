---
description: Replaces generic AI-looking glassmorphism with modern, interactive UI patterns.
---

# Modern UI Design Standards

1. **Avoid Generic Glassmorphism:** Do not default to `rgba()` backgrounds with static `backdrop-filter: blur()` and basic white borders for cards. This creates a generic, "AI-generated" aesthetic.
2. **Use Dynamic Spotlight Cards:** For dark-theme cards, default to a "Spotlight" effect. Track the user's cursor (`onMouseMove`) and pass `--mouse-x` and `--mouse-y` to CSS.
3. **Interactive Gradients:** Use `radial-gradient` in CSS mapped to the mouse coordinates to create a soft, glowing hover effect that follows the cursor across the card's border and background.
4. **Refined Typography:** Always pair pure white headers (`#ffffff`) with muted gray body text (`#a1a1aa` or `rgba(255, 255, 255, 0.6)`) to establish visual hierarchy. Avoid pure white for body paragraphs.
