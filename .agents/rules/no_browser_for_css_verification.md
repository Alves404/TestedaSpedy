---
description: Avoids using browser subagents to verify visual CSS changes.
---

# Visual Verification Protocol

1. **Do NOT use `browser_subagent` for visual CSS validation:** When making aesthetic layout changes (like fixing alignments, removing CSS boxes, tweaking responsiveness up to 8K, or adjusting `mix-blend-mode`), apply the code changes and immediately ask the user to verify them in their own browser.
2. **Avoid autonomous loops:** The browser subagent is notoriously slow and unreliable for judging subjective visual correctness. Relying on it for CSS tasks causes frustrating loops for the user.
3. **Respect User Overrides:** If the user explicitly commands "do not use the browser", disable all `browser_subagent` calls for the remainder of the task.
