# DESIGN.md - Jatin Naik Portfolio

This file defines exactly how the portfolio looks and feels. Follow it literally. If a request conflicts with this file, ask before deviating. Read it together with `agents.md` (how to work) and `architecture.md` (how it is built).

## 1. Design intent

- **Goal:** a creative, memorable portfolio for a final-year B.Tech IT student (class of 2027) applying for entry-level jobs.
- **Feel:** calm, tactile, premium. Light that responds to touch, surfaces that feel like glass, motion that feels like springs.
- **Inspiration:** OriginOS 7 ideas (translucent material, fluid motion, spring animation, dark layered cards, the multitasking window stack). We borrow ideas and techniques only.
- **Priority order:** 1) content is readable, 2) proof of skills is obvious, 3) personality and polish.
- **Core promise:** the site must look deliberately engineered by a person with taste, not generated. See section 12 (Anti-slop checklist). Every choice must be defensible.

### Legal and originality rules

- Do NOT use vivo or OriginOS logos, wallpapers, icons, sticker art, screenshots, or the name "OriginOS" anywhere on the site.
- Do NOT use the vivo Sans font.
- Do NOT copy any screen pixel for pixel. Re-interpret ideas in our own shapes, colors and content.

## 2. Themes (dark and light toggle is mandatory)

Both themes ship. Default follows the visitor's system setting. A round toggle in the nav overrides it and the choice is remembered (localStorage wrapped in try/catch). Colors are CSS variables on `:root`. Dark values live under `@media (prefers-color-scheme: dark)` guarded with `:root:not([data-theme="light"])` and again under `:root[data-theme="dark"]`. The body always has an explicit background.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | #F5F7FA | #050506 | page background |
| `--ink` | #171A22 | #F4F4F6 | headlines, primary text |
| `--mute` | #5D6577 | #8E8E93 | secondary text, paragraphs |
| `--card` | #FFFFFF | #141416 | cards |
| `--line` | rgba(23,26,34,.12) | rgba(255,255,255,.12) | borders, dividers |
| `--accent` | #415FFF | #415FFF | primary action, focus ring |
| `--glow1` | #FFD9B0 | #C4631C | warm glow |
| `--glow2` | #C9D4FF | #2B3FB8 | cool glow |
| `--glass` | rgba(255,255,255,.45) | rgba(255,255,255,.08) | glass fill |
| `--glass-edge` | rgba(255,255,255,.8) | rgba(255,255,255,.28) | glass border and highlight |

Rules:
- One accent only: blue `#415FFF`. Never pair it with purple or use it in gradients. Keep it a true blue.
- Glows are **fixed** (they do not drift on scroll). Maximum two (one warm, one cool), low opacity, anchored near the hero art. They must never become a full-page neon or aurora wash. If it reads as aurora, reduce it.
- In light mode the glows become soft pastel washes.
- Project windows in dark mode may use dark, low-saturation tints (charcoal, navy, warm brown).
- Contrast must meet WCAG AA (4.5:1 for body text) in both themes.
- Green `#34D399` is used only for the "Open to work" dot.

## 3. Typography

- **Font:** `"Outfit"` (Google Fonts, weights 300, 400, 500, 600). Fallback: `"Avenir Next", -apple-system, "Segoe UI", sans-serif`. Never Inter, Roboto, Arial or bare system fonts as the primary face.
- **Three-tier text stack** for every section and window:
  1. **Label:** small, muted, sentence case.
  2. **Headline:** very large, weight 500, tracking -0.03em, line-height about 0.95 to 1.1.
  3. **Paragraph:** large, muted, weight 400, line-height 1.5, max 30em wide.
- **Scale (clamp):** hero name `clamp(52px, 10vw, 118px)`; section title `clamp(32px, 6vw, 56px)`; lead `clamp(17px, 2.2vw, 22px)`; body 16px; small 13 to 14px.
- Sentence case everywhere. No all-caps labels, no gradient text, no tracked-out eyebrows. Line length under 80 characters.

## 4. Shape, spacing, layers

- Spacing unit 4px. Steps: 8, 12, 16, 24, 36, 56, 96.
- Radius: pills and round buttons `999px`; windows and cards `28px to 40px`; image frames `28px to 36px`; small items `14px`.
- Max content width 1120px, centered. Side padding 24px (12px for the nav).
- Layer order: background, glows, content, 3D art, glass elements, lens, nav (`z-index: 20`).
- Shadows are soft, large, low-opacity only: `0 10px 30px rgba(0,0,0,.12)`.
- Use varied sizes and asymmetry in layouts. Avoid rows of identical centered cards.

## 5. Glass material

```css
.glass {
  background: var(--glass);
  backdrop-filter: blur(18px) saturate(1.6);
  -webkit-backdrop-filter: blur(18px) saturate(1.6);
  border: 1px solid var(--glass-edge);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.25), 0 10px 30px rgba(0,0,0,.12);
}
```

- Glass sits only over rich background (glow, image, gradient), never over flat color.
- Never stack more than two blur layers in one area (performance).
- Keep text on glass at AA contrast.
- Optional future material styles: Realistic (blur 18px), Natural (26px), Soft (34px).

## 6. Motion system

Motion is physical: things overshoot slightly and settle. One signature moment per screen, everything else calm. Motion must carry meaning, never decoration.

**Easing tokens**
- `--spring: cubic-bezier(.34, 1.5, .5, 1)` for panels, nav expansion and section entrances (about 550 to 900ms).
- `--pop: cubic-bezier(.34, 2.2, .5, 1)` for button press and release (about 450ms).
- Plain fades: 200 to 600ms ease.

**One frame loop (requestAnimationFrame)** drives the lens, the 3D tilt, the stacking, the timeline and the avatar flight.
- Smoothing is time-based, so it feels the same on 60 Hz and 120 Hz screens: `value += (target - value) * (1 - exp(-rate * dt))`. Rates per second: stacking 10, avatar flight 7, timeline 8.
- Lens and tilt use springs scaled by the frame time. Tilt clamps: rotateX +/-14deg, rotateY +/-18deg.
- Each frame reads from the DOM first and writes afterward, never alternating (no layout thrash).
- Scroll effects use only `transform` and `opacity`. Set `will-change` only while an element is actually moving.

**Page-level motion (locked)**
- **Entrances replay every time.** Each `.rise` element and each hero part springs in whenever it enters the viewport and resets when it leaves, so it plays again on the next visit. The hero text replays when you return to the top.
- **Stacking:** a section that fits in the viewport pins and the next one slides over it, while the pinned one scales to about 0.94 and dims. Sections taller than the viewport scroll normally, because pinning very tall layers flickers on phones.
- **Avatar flight:** the hero avatar travels into the About slot as you scroll (see 7.5), in both directions.
- **Drawing timeline:** the Experience path draws itself with scroll; nodes pop when the line reaches them.
- **Splash:** see 7.11.
- **Not included:** drifting glows and a progress rail.
- **Reduced motion:** disable the lens, tilt, springs, stacking, flight, drawing and splash. Everything becomes visible immediately, and the Projects stack becomes a plain list. The site must stay fully usable.

## 7. Components

### 7.1 Top navigation (fixed, Realistic glass)
- Glass pill (centered) with logo "Jatin Naik" and links About, Skills, Projects, Experience, Contact.
- **Realistic style:** the clearest and most see-through glass. Background and content show through, blurred and slightly color-boosted. Bright specular top edge, faint inner glow at the bottom, soft floating shadow.
- The active link gets its own small glass bubble that slides between links with a spring.
- Beside the pill, two separate round droplets in the same glass: a 44px **theme toggle** and a **Hire me** button (accent blue) that jumps to Contact. (Hire me hides on mobile; the same link sits inside the expanded menu.)
- **Readability guard:** after the hero, add a very light tint (dark in dark mode, white in light mode) and slightly more blur. Link text stays at AA contrast in both themes.
- **Mobile (under 760px):** the pill shows the logo and a menu button; tapping expands it downward with `--spring-soft`.
- Position: `top: calc(env(safe-area-inset-top) + 12px)`.

### 7.2 Buttons
- **Primary:** `--ink` fill, `--bg` text, pill, padding 14px 26px, weight 500.
- **Secondary:** transparent with 1px `--line` border, same size.
- **Accent CTA:** `--accent` fill, white text. Used only for "Hire me".
- **Round glass button:** 40 to 44px circle. Used for theme toggle, social links, back to top.
- **Resume pair:** a "View resume" button (opens the PDF in a new tab) plus a small round **Download** icon button beside it. Appears in Hero, About and Contact.
- All buttons: minimum 44px touch target, visible focus ring (2px `--accent`, 2px offset), spring press.

### 7.3 Chips
- Glass pill, 14px text, optional leading dot. Used for "Open to entry-level roles", About facts and skills.

### 7.4 Glass lens (signature effect, magnifies text)
- Hidden until the pointer (mouse or finger) becomes active. It then flies in from the nearest screen corner and follows the pointer with a spring. It never roams on its own.
- Size follows context: tiny (24px, or 18px on touch) over empty areas or a window with no text under the pointer; about 112px (92px on touch) when the pointer is over actual text, where it magnifies that text 1.4x. Text detection uses the real line boxes of the text (10px tolerance), not the whole block.
- When the pointer leaves the page or the finger lifts, it flies back to the corner and disappears.
- Look: clear glass with a soft white highlight top-left, a faint blue inner shadow bottom-right, a thin translucent edge, and a light blurred backdrop so the real text under it recedes.
- It stretches slightly with speed. `pointer-events: none`, below the nav, removed entirely under reduced motion.

### 7.5 Hero avatar (3D art)
- A transparent 3D render of the avatar (WebP) floats directly on the page. No frame, plate or card sits behind it. The warm glow of the hero is the only background. Its bottom edge fades out with a mask because the render is cropped at the chest.
- It tilts toward the pointer with the tilt spring, and two small glass orbs add depth.
- Swappable slot: one image element, so the PNG can later become a real 3D model (GLB) without a redesign.
- **Avatar flight:** while you scroll from the Hero into About, one flying copy of the avatar travels from the Hero slot to the About slot (position, size and crop interpolate with a smootherstep curve). It zooms from the full portrait to a head-and-chest close-up while keeping its tilt. The Hero and About images are swapped for the flying copy only during the flight, so it lands exactly in place. It works in both scroll directions.
- About shows the avatar on the left. On mobile the avatar sits above the text in both sections (max 290px in the Hero, 280px in About).

### 7.6 Project window (Projects section, multitasking idea)
- **Main window:** one large rounded window floats in front showing the active project: screenshot, label, name, summary, two result bullets, tech chips and the link buttons.
- **Folded stack on the left edge:** the other projects as narrow cards tilted in perspective, plus a dashed "+ More on GitHub" slot linking to the profile. Tapping a card springs it forward and folds the old window back.
- **Three-dot menu:** only "Next project" and "Close" (collapses the window; reopen from the stack). On mobile you can also swipe the window sideways.
- **Fits one screen:** the section is about one viewport tall, so a whole project is visible without page scrolling. The header is a compact three-tier stack (label with a hint, then the headline, same style as other sections).
- **Desktop:** two columns inside the window (screenshot left, details right). Window height is min(560px, viewport minus 250px), at least 430px.
- **Mobile:** a slim 60px stack on the left with the window beside it. The screenshot flexes to fill the height that is left (minimum 76px). On very short screens the window scrolls inside itself as a last resort.
- **Buttons are data-driven:** Live demo, Watch demo (video) and Code. The first one shown is primary. They open in a new tab. Missing links are hidden, and a link set to TODO shows a disabled "(link soon)" button.
- **Placeholder screenshots** ("Screenshot coming soon") are a tinted panel with the project initial until real images are added in `js/data.js`.
- **Reduced motion:** the stack becomes a plain vertical list of all four projects.
- Order: SentinelX, Setu-Drishti, DocVault, VIGAM.

### 7.7 Experience timeline
- A **gentle S-curve** path winds softly left and right down the page (not a straight line).
- **Round glass nodes** sit on the curve; each entry card sits beside its node and alternates sides on desktop.
- Newest first. Each entry has a small glass tag (Award, Certification or Leadership), a date and one line.
- The path draws on scroll; nodes pop with a spring when reached.
- Mobile: the curve narrows and hugs the left edge.

### 7.8 Skill group
- Heading plus wrapped glass chips. No percentage bars. Chips stay restrained (no more than two blur layers). If chips look templated at build time, switch the group to a typeset list and tell Jatin.

### 7.9 Section header
- Three-tier stack, left aligned. Top padding 96px desktop, 64px mobile.

### 7.10 Footer
- Very small and quiet: "Jatin Naik, B.Tech IT, Class of 2027", the current year, a back-to-top round glass button and the theme toggle.

### 7.11 Splash (every load)
- "JATIN NAIK" appears letter by letter (spring, staggered) on the page background.
- Then each letter flies to the matching letter of the hero heading "Jatin Naik", scaling to the heading size and switching to its real case on the way, while the background fades out. The rest of the hero rises in as the letters land.
- About two seconds in total. It plays on every load, is skipped under reduced motion, and a 7-second failsafe removes it if anything goes wrong. If the heading is below the fold, the letters just fade.

## 8. Page layout and sections (all locked)

Order: Hero, About, Skills, Projects, Experience, Contact, Footer.

| Section | Layout and content |
|---|---|
| Hero | Two columns (1.1fr / 0.9fr). Left: label "Final-year B.Tech IT, Class of 2027", huge name "Jatin Naik" on two lines, short general lead, View projects button, resume pair, status chip, social circles (GitHub, LinkedIn, email). Right: the floating avatar (7.5). Lens active. Full height (`100svh`). |
| About | Avatar on the left (arrives by the flight), text on the right: label "About me", headline "Practical technology, built with care.", the approved two paragraphs, four fact tiles (College, Degree, Graduating, Location: Bhilai, Chhattisgarh) and the resume pair. |
| Skills | Intro on the left, six rows on the right (Languages, Core CS, ML and AI, Cloud, DevOps, Web and tools) with bordered chips. LeetCode link chip sits in the Core CS row. Stacked on mobile. |
| Projects | The multitasking window stack (7.6). |
| Experience | S-curve timeline (7.7), six entries with exact dates, newest first. Two award entries carry a "View post" link to LinkedIn. |
| Contact | Label "Contact", headline "Let's talk.", one line about being open to entry-level roles, the email as a large link, round glass buttons for Email, LinkedIn, GitHub and LeetCode, and the resume pair. No phone number, no form. |
| Footer | Section 7.10. |

## 9. Responsive rules

- Mobile first. Breakpoints: 760px (nav), 860px (hero stacks).
- No horizontal page scroll. Wide content scrolls inside its own container.
- Use `100svh` for full-height blocks; respect safe-area insets.
- Images: `max-width: 100%`, explicit width and height, lazy-load below the fold.

## 10. Accessibility

- Semantic landmarks, skip link, keyboard reachable controls with visible focus.
- `aria-label` on icon-only buttons; `aria-expanded` on the mobile menu; `aria-hidden` on decorative layers (glow, lens, orbs).
- Alt text on all images written by a person, describing the real content.
- Color is never the only signal. Respect `prefers-reduced-motion`.
- A `noscript` fallback keeps all content visible if JavaScript is off.
- The lens never replaces real text: the real text stays selectable and readable.

## 11. Imagery

- Real project screenshots only, never mocked-up generic UI or stock photos.
- All images share one consistent color grade and lighting so the set feels unified.
- The 3D avatar and its close-up come from the same render style.

## 12. Anti-slop checklist (must pass before showing any section)

Research from designer posts, a Hacker News product audit and "anti-slop" rulebooks shows what makes a site read as AI-generated. Audit every section against this list.

**Banned**
- Purple or indigo gradients, gradient headline text, purple-to-blue anything.
- Inter as the main font, or bare system fonts.
- Aurora or neon glow washes behind the hero.
- Emojis used as icons (use inline SVG).
- Colored left borders on cards.
- A centered hero followed by three identical rounded cards.
- Everything-in-a-card layouts with identical sizes.
- Generic dashboard mockups, stock imagery, soft grey floating-card shadows used everywhere.
- The default "fade in from below at 600ms with stagger" for every element.
- Bland, polite, buzzword copy ("passionate", "innovative", "cutting-edge").

**Required**
- Specific names and real numbers (AUROC 0.87, 30 FPS, 604 students, 70+ teams).
- Real screenshots with one consistent grade.
- Asymmetric, varied layouts and varied section transitions.
- One consistent visual system across all sections (same tokens, radii, easing).
- Motion that serves meaning, with custom easing curves, not defaults.
- Copy in Jatin's own plain voice.

**Our own watch list (re-check every release)**
- Glow count and intensity (max two, never aurora).
- Amount of glass and number of pill chips.
- The lens: it must feel like a purposeful tool, not a gimmick. Tiny when idle, never roaming.
- Entrance springs: keep the stagger and distances varied so they do not read as one template.
- Accent blue staying a true blue, not drifting toward indigo or purple.
- Skills chips looking templated.
- Placeholders ("Screenshot coming soon") must be gone before the site is shared.

**Review step:** before each release, run any available design-critic or review skill, then check a screenshot at 360px and 1280px in both themes and ask: "Would a visitor guess an AI made this?" If yes, redo it.

## 13. Do and do not

Do:
- Keep one signature moment per screen.
- Test both themes on every change.
- Question every default and note why a choice was made.

Do not:
- Introduce new colors, fonts, radii or animations without updating this file first.
- Add autoplay audio, heavy video, or effects that hide content.
- Use skill percentage bars, lorem ipsum, fake testimonials or fake metrics.
