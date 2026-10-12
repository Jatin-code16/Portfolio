---
name: anti-slop-audit
description: Audit the portfolio site for AI-generated "slop" and design-system violations before it is shown or shared. Use after building or changing any section, and before every release.
---

# Anti-slop audit

Check the portfolio against `docs/design.md` (sections 2 to 12) and `AGENTS.md`. The goal is a site that looks engineered by a person with taste, not generated.

## Steps

1. Read `docs/design.md` section 12 (banned list, required list, watch list) and `AGENTS.md` section 2.
2. Open the site in a real browser tool if one is available. Check 360px, 768px and 1280px, in both dark and light mode. If no browser tool exists, say so and review the code only.
3. Go through each section and test every item below.

## Checklist

**Banned (fail if present):** purple or indigo gradients, gradient headline text, Inter or bare system fonts, aurora or neon glow washes, emoji used as icons, colored left borders on cards, a centered hero followed by three identical cards, stock imagery, generic dashboard mockups, the same fade-up on everything, buzzword copy.

**Required (fail if missing):** specific names and real numbers, real screenshots (no "coming soon" left), asymmetric layouts, one consistent token system, motion that carries meaning, copy in Jatin's plain voice, visible focus and AA contrast, reduced-motion support.

**Watch list:** glow count (max two), amount of glass, the lens (tiny when idle, never roaming), entrance variety, accent staying true blue, skills chips looking templated.

**Engineering:** no console errors, no layout shift, images compressed, Lighthouse mobile 90 or more, all links working, no secrets, no dead code.

## Output format

Reply with a short list: **Pass**, **Fix** (with file and line or section), and **Ask Jatin** (anything needing his decision). End with one sentence answering: "Would a visitor guess an AI made this?" If yes, say what to redo first. Keep it brief and mobile friendly.
