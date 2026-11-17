# Taste and Anti-Slop (canonical)

Merged from: design-taste-frontend (v2, base), design-taste-frontend-v1, redesign-existing-projects, anti-ui-slop, frontend-design, frontend-ui-engineering, and the overlapping rules of unslop. Unique code and catalogs are in `recipes.md`. The unslop pass-by-pass method and its token/sign/visual references are in `unslop/` and are linked from section 11.

Scope: landing pages, portfolios, marketing sites and redesigns. For dashboards and dense product UI use section 12 plus `reference/ui-polish/` and `reference/design-systems/`.

Every rule is contextual. First read the brief, then pull only what fits. The brief's own words win over any default here.

---

## 0. Read the room first

### 0.1 Signals
1. Page kind: landing (SaaS, consumer, agency, event), portfolio (dev, designer, studio), redesign (preserve vs overhaul), editorial.
2. Vibe words ("calm", "Linear-style", "Awwwards", "brutalist", "Apple-y", "serious B2B", "dark tech").
3. Reference signals: URLs, screenshots, named products and competitors.
4. Audience. The audience picks the aesthetic, not your taste.
5. Existing brand assets (logo, color, type, photography). In a redesign these are starting material.
6. Quiet constraints: accessibility-first, public sector, regulated, trust-first commerce, kids. These override aesthetic preference.

### 0.2 Ground it in the subject
If the brief does not pin down the subject, pin it yourself: one concrete subject, its audience, the page's single job. Say your choice. Distinctive choices come from the subject's own world: its materials, instruments, artifacts, vocabulary. Build with the real content and subject matter throughout.

### 0.3 Output a one-line Design Read before any code
"Reading this as: <page kind> for <audience>, with a <vibe> language, leaning toward <design system or aesthetic family>."

If the read genuinely diverges, ask exactly one clarifying question. If you can infer, do not ask.

### 0.4 Anti-default discipline
Do not default to: AI-purple gradients, centered hero over dark mesh, three equal feature cards, glassmorphism on everything, infinite micro-loops everywhere, Inter + slate-900.

Calibration: current AI output clusters in three looks. (1) warm cream background (~#F4F1EA), high-contrast serif display, terracotta accent. (2) near-black with one acid-green or vermilion accent. (3) broadsheet layout, hairline rules, zero radius, dense columns. All are legitimate for some briefs but they are defaults, not choices. Where the brief leaves an axis free, do not spend that freedom on them.

### 0.5 Plan before building (two passes)
1. Brainstorm a compact plan: Color (4-6 named hex values), Type (2+ roles: characterful display used with restraint, complementary body, utility face for captions/data), Layout (one-sentence concept, ASCII wireframes to compare), Signature (the single element the page will be remembered by).
2. Review the plan against the brief. If any part is what you would produce for any similar page, revise it and say what changed. Only then code, deriving every color and type decision from the plan.

Spend boldness in one place. Keep everything around the signature quiet and disciplined. Cut one accessory before leaving the house: remove any decoration that does not serve the brief. Do the planning in thinking and show ideas when confident.

When writing CSS, watch selector specificity (a `.section` class vs an element selector like `.cta` often cancel each other on padding/margins between sections).

---

## 1. The three dials

- `DESIGN_VARIANCE` 1 = perfect symmetry, 10 = artsy chaos. Baseline 8.
- `MOTION_INTENSITY` 1 = static, 10 = cinematic physics. Baseline 6.
- `VISUAL_DENSITY` 1 = art gallery, 10 = cockpit. Baseline 4.

Use baseline 8/6/4 unless the design read overrides. Overrides happen conversationally; never ask the user to edit files. Use these exact variable names everywhere.

### Dial inference
| Signal | VARIANCE | MOTION | DENSITY |
|---|---|---|---|
| minimalist / clean / calm / editorial / Linear-style | 5-6 | 3-4 | 2-3 |
| premium consumer / Apple-y / luxury / brand | 7-8 | 5-7 | 3-4 |
| playful / wild / Awwwards / experimental / agency | 9-10 | 8-10 | 3-4 |
| landing / portfolio / marketing (default) | 7-9 | 6-8 | 3-5 |
| trust-first / public sector / regulated / a11y-critical | 3-4 | 2-3 | 4-5 |
| redesign, preserve | match existing | +1 | match |
| redesign, overhaul | +2 | +2 | match |

### Use-case presets (V / M / D)
SaaS landing 7/6/4 - Agency or creative landing 9/8/3 - Premium consumer landing 7/6/3 - Designer or studio portfolio 8/7/3 - Developer portfolio 6/5/4 - Editorial or blog 6/4/3 - Public-sector service 3/2/5.

### Dial definitions
- DESIGN_VARIANCE 1-3: symmetrical 12-col grids, equal padding, centered. 4-7: `margin-top:-2rem` overlaps, mixed aspect ratios (4:3 beside 16:9), left-aligned headers over centered data. 8-10: masonry, fractional grids (`2fr 1fr 1fr`), big empty zones (`padding-left:20vw`). MOBILE OVERRIDE for 4-10: any asymmetric layout above `md:` collapses to strict single column (`w-full px-4 py-8`) below 768px.
- MOTION_INTENSITY 1-3: no automatic animation, CSS hover/active only. 4-7: `transition: all .3s cubic-bezier(.16,1,.3,1)`, `animation-delay` cascades for load-ins, transform and opacity only. 8-10: scroll-triggered reveals, parallax, scroll-driven animation (CSS `animation-timeline` or GSAP ScrollTrigger), Motion hooks.
- VISUAL_DENSITY 1-3: lots of space, huge section gaps (`py-32` to `py-48`). 4-7: normal app spacing (`py-16` to `py-24`). 8-10: tight paddings, no card boxes, 1px lines separate data, `font-mono` for all numbers.

---

## 2. Design system or aesthetic?

If the brief reads as an existing system, install and use the official package (map and install commands in `recipes.md`). Do not recreate its CSS by hand and do not import tokens then override 90% of them. One system per project: never mix Fluent with Carbon, or shadcn into a Material 3 app.

If the brief is an aesthetic (glassmorphism, bento, brutalism, editorial, dark tech, aurora/mesh, kinetic type), no official package exists. Build with native CSS + Tailwind + a maintained component library and be honest in comments about what is borrowed inspiration. Apple Liquid Glass is Apple-platform only: web versions are approximations and must be labeled so, with a solid fallback under `prefers-reduced-transparency`.

---

## 3. Stack defaults (unless the project or a design system says otherwise)

- React or Next.js, Server Components by default. Global state only in Client Components; wrap providers in a `"use client"` component.
- Interactivity isolation: anything with motion, scroll listeners or pointer physics is an isolated leaf component with `'use client'` at the top, memoized. Server Components render static layout only.
- Tailwind v4 default, v3 only if the project requires. Check `package.json` version first. v4: no `tailwindcss` plugin in `postcss.config.js`; use `@tailwindcss/postcss` or the Vite plugin. Use Tailwind for ~90% of styling.
- Animation: Motion (`import { motion } from "motion/react"`); `framer-motion` is the legacy alias. Never mix GSAP/Three.js with Motion in the same component tree.
- Fonts: `next/font` or self-hosted `@font-face` with `font-display: swap`. No Google Fonts `<link>` in production.
- State: `useState`/`useReducer` locally; global (Zustand, Jotai, context) only to avoid deep prop drilling. Never track continuous user-driven values (mouse position, scroll progress, magnetic hover) in `useState`; use `useMotionValue`/`useTransform`/`useScroll`.
- Dependency verification (mandatory): before importing any third-party library check `package.json`; if missing, print the install command first. Never assume a library exists.
- One design system per project; shadcn/ui is allowed but never in default state (customize radii, colors, shadows, type).
- Icons: `@phosphor-icons/react`, `hugeicons-react`, `@radix-ui/react-icons`, `@tabler/icons-react`, in that priority. Lucide only if the project already uses it or the user asks. Never hand-roll SVG icon paths. One family per project, one global `strokeWidth` (1.5 or 2). No emoji as UI.
- Emoji: avoided in code, markup, visible text and alt text; allowed only for an explicitly playful/chat/social vibe, sparingly.
- Layout mechanics: breakpoints `sm 640, md 768, lg 1024, xl 1280, 2xl 1536`; contain layouts with `max-w-[1400px] mx-auto` or `max-w-7xl`; full-height sections use `min-h-[100dvh]`, never `h-screen`/`100vh`; use CSS Grid, never flex percentage math (`w-[calc(33%-1rem)]`); declare the `<768px` fallback for every multi-column layout in the same component.

---

## 4. Typography

- Display default `text-4xl md:text-6xl tracking-tighter leading-none`; body `text-base text-gray-600 leading-relaxed max-w-[65ch]`.
- Inter as default is discouraged (v1 said banned). Reach for Geist, Outfit, Cabinet Grotesk, Satoshi, or a brand-appropriate face first. Inter is fine when the user asks for neutral/Linear-style, or for public-sector/accessibility-first work, or when it is the real brand font. Swap an unchosen Inter default when another family fits the direction better.
- Pairings: Geist + Geist Mono, Satoshi + JetBrains Mono, Cabinet Grotesk + Inter Tight, GT America + IBM Plex Mono. Dashboards and software UI use sans + mono pairings.
- Serif discipline: serif is very discouraged as a default. "Feels premium/creative/editorial" is not a reason. Allowed only when the brief names a serif, or the family is genuinely editorial/luxury/publication/heritage and you can say why this serif fits this brand. Never on clean dashboards. `Fraunces` and `Instrument Serif` are banned as defaults. If a serif is justified, rotate from: PP Editorial New, GT Sectra Display, Cardinal Grotesque, Reckless Neue, Tiempos Headline, Recoleta, Cormorant Garamond, Playfair Display, EB Garamond, IvyPresto, Migra, Saol Display, Domaine Display, Canela, Schnyder, Tobias, ITC Galliard, and do not reuse the same one in consecutive projects.
- Sans display options when the instinct says "creative": Geist Display, ABC Diatype, Soehne Breit, Cabinet Grotesk Display, Migra Sans, GT Walsheim, Inter Display, PP Neue Montreal.
- Emphasis inside a headline uses italic or bold of the SAME family. Never inject a random serif word into a sans headline (or the reverse).
- Italic descender clearance: display italics with `y g j p q` need `leading-[1.1]` minimum plus `pb-1`/`mb-1` reserve.
- Hierarchy by weight and color, not just scale. No screaming oversized H1.
- Use 400/500/600 weights (not just 400 and 700). Tabular numbers on data. Negative tracking for large headlines only; never on small text. Sentence case, not Title Case On Every Header; avoid all-caps subheaders everywhere. Fix orphans with `text-wrap: balance`/`pretty`. No italic for emphasis (unslop) unless same-family italic is the deliberate choice above.
- No gradient text on large headers.
- Tracking and leading caveat (resolved against `typography/typography.md`): `tracking-tighter` and `leading-none` are the aggressive end for short display lines only. Headings at 24px and up take -0.01em to -0.02em; display line-height 1.1, headings 1.2-1.3, and anything that wraps to 3+ lines needs at least 1.4. Prefer `tracking-tight` unless a display face truly needs more. Never negative tracking on small text.
- Detailed type CSS (scale, features, wrapping, truncation, punctuation, iOS 16px inputs) lives in `reference/typography/typography.md`. Palette structure, tokens, contrast and gradients live in `reference/color/color.md`.

---

## 5. Color and surfaces

- Max one accent color, saturation under 80%. Lock it for the whole page (Color Consistency Lock): a warm-grey site does not get a blue CTA in section 7.
- AI purple/blue ("Lila") is discouraged as default: no automatic purple button glows or neon gradients. Use neutral bases (Zinc/Slate/Stone) with a singular high-contrast accent (Emerald, Electric Blue, Deep Rose, Burnt Orange). If the brand or brief asks for purple, embrace it with intent: consistent palette, harmonised neutrals, restrained gradients.
- One neutral family per project. Do not mix warm and cool greys; tint all greys with one hue.
- No pure `#000000` and no pure `#ffffff`. Use off-black (zinc-950, charcoal, `#0a0a0a`, `#121212`) and off-white.
- No neon or outer glows by default. Use inner borders or tinted shadows. Tint shadows to the background hue; keep a single consistent light source across shadows.
- Premium-consumer palette ban: the LLM default for cookware, wellness, artisan, luxury, heritage, DTC home goods is warm beige/cream + brass/clay/oxblood/ochre + espresso text. Banned as default: backgrounds `#f5f1ea #f7f5f1 #fbf8f1 #efeae0 #ece6db #faf7f1 #e8dfcb`; accents `#b08947 #b6553a #9a2436 #9c6e2a #bc7c3a #7d5621`; text `#1a1714 #1a1814 #1b1814`. Rotate instead: Cold Luxury (silver-grey, chrome, smoke), Forest (deep green, bone, amber), Black and Tan (true off-black + warm tan, no beige), Cobalt + Cream, Terracotta + Slate, Olive + Brick + Paper, Monochrome + one saturated pop. If the previous premium-consumer project used beige+brass, this one must use a different family. Allowed only if the brief names those colors or the brand is genuinely vintage/artisan and you can say why.
- Page Theme Lock: the page has ONE theme. No light section sandwiched between dark ones, or the reverse. Section-level tints inside one family are fine (`bg-zinc-950` next to `bg-zinc-900`). Exception: one deliberate, strongly transitioned "color block story" or theme switch per page. If contrast is needed, use a slightly darker shade of the same palette.
- Dark mode is dual by default: design both modes from the start with Tailwind `dark:` or CSS variable semantic tokens (`--surface`, `--surface-elevated`, `--text-primary`, `--accent`) under `[data-theme="dark"]`/`prefers-color-scheme`. Hierarchy parity, brand fidelity (do not desaturate the brand into dark mode), AA contrast (AAA for hero copy), test both before finishing. Set the theme once at the root.
- Surfaces: depth from surface steps and hairlines in dark UIs; soft neutral shadows in light. Add texture only with intent: grain/noise on a fixed `pointer-events-none` overlay, never on scroll containers. Break uniform linear gradients with radial/mesh/noise. A gradient inside one neutral (tone shift) is fine; hue-to-hue gradients on surfaces, colored glows and blobs are not.
- Borders are quiet hairlines (text color at 6-10% opacity).
- Deep color-system work lives in `reference/color/`.

---

## 6. Layout and shape

- Anti-center bias: when `DESIGN_VARIANCE > 4` avoid centered hero/H1; use split screen 50/50, left text + right asset, asymmetric whitespace, or scroll-pinned structures. Centered is fine for editorial/manifesto/launch briefs and short heroes with no visual.
- Ban the generic three equal feature cards. Use 2-column zig-zag, asymmetric grid, scroll-pinned or horizontal-scroll alternatives.
- Break symmetry: offset margins, mixed aspect ratios, left-aligned header over centered content, overlap via negative margins for depth, variable card heights/masonry when content varies. Equal-height forced cards are a tell.
- Section-layout repetition ban: a layout family appears at most once per page; an 8-section page uses at least 4 families.
- Zigzag alternation cap: max 2 consecutive image+text split sections; the third is a failure.
- Bento: exactly as many cells as content (no blank tiles), with rhythm (alternate full-width rows, asymmetric sizes), and at least 2-3 cells with real visual variation (image, brand-appropriate gradient, pattern, tinted background). Not six white-on-white text cards.
- Cards only when elevation communicates hierarchy; otherwise group with `border-t`, `divide-y` or space. For `VISUAL_DENSITY > 7`, generic cards are banned.
- Shape Consistency Lock: one corner-radius system per page (all sharp, all soft 12-16px, or all pill for interactive), or a documented rule (buttons pill, cards 16px, inputs 8px) followed everywhere. Inner radius = outer radius minus padding, min 4. Vary radius: tighter inside, softer on containers.
- No dashboard-default left sidebar assumption: consider top nav, floating command menu or collapsible panel.
- Generous whitespace on marketing pages; dense layouts for data dashboards only.
- Optical alignment beats math: icons next to text, play buttons in circles, text in buttons often need 1-2px adjustments; bottom padding slightly larger than top. In card groups pin buttons to the bottom, start feature lists at the same Y across pricing columns, align shared baselines across side-by-side items.
- Mathematically perfect padding and margins; no floating elements with awkward gaps. Standard `gap-2` for input blocks.
- Z-index restraint: only systemic layers (sticky nav, modal, overlay, grain). Keep a documented scale; no `9999`, no spraying `z-10`/`z-50`.

### Hard layout rules (failing any ships broken work)
- Hero fits the initial viewport: headline max 2 lines at desktop, subtext max 20 words and 4 lines, CTAs visible without scroll. A 4-line headline is a font-size error: plan font and image size together (`text-4xl md:text-5xl lg:text-6xl` normally; `text-6xl md:text-7xl` only for 3-5 word headlines).
- Hero top padding max `pt-24` at desktop.
- Hero stack: max 4 text elements (eyebrow OR brand strip or neither, headline, subtext, CTAs with 1 primary + max 1 secondary). No tagline under CTAs, trust strip, pricing teaser, feature bullets or avatar row in the hero. Logo walls live in their own section under the hero.
- Hero needs a real visual. Text plus a gradient blob is a placeholder. For restraint, "standard hero" is text left/right with a relevant image fading into the background color; a scene hero (generated image behind the whole hero with calm space for text, product view rising from the bottom edge) is the strongest option.
- Navigation: one line at desktop, height 64-72px (80px max). Quiet nav: logo, existing links, one button; "log in" as a text link.
- Eyebrow restraint (most violated rule): max 1 eyebrow per 3 sections, hero counts as one. Mechanical check: count small uppercase tracked labels above headlines; fail if `> ceil(sectionCount / 3)`. Better to drop it: the headline alone is enough.
- Split-header ban: "big left headline + small right explainer" as a section header is banned by default. Stack headline over body (max 65ch) unless the right column carries a real visual or interaction. Also no tiny floating sub-text in the top-right of a section heading.
- Content density: per section a short headline (8 words max), sub-paragraph (25 words max), and one visual or one CTA.

---

## 7. States, interaction and forms

- Implement the full cycle, not just the success state: loading (skeletons matching final layout, not circular spinners; skeleton shimmer is fine), empty (composed, says how to populate, with a primary action), error (inline for forms, toasts only for transient; never `window.alert`), success.
- Tactile feedback: `:active` uses `-translate-y-[1px]` or `scale-[0.98]`. Hover states on buttons (background shift, slight scale/translate). Transitions 200-300ms on interactive elements. Visible `:focus-visible` rings. Current-page indicator in nav. `scroll-behavior: smooth` for anchors.
- Button contrast check (a11y): every CTA text readable on its background, AA 4.5:1 (3:1 for 18px+). No white-on-white, no borderless transparent button on the page background. Ghost buttons over photos need a scrim, backdrop or stroke.
- CTA wrap ban: labels fit on one line at desktop (3 words max for primary, ideally 1-2); shorten or widen, do not cap max-width.
- No duplicate CTA intent: one label per intent across the page ("Get in touch"/"Contact us"/"Let's talk" are one intent; "Try free"/"Get started"/"Sign up free" are one). Avoid always "one filled + one ghost"; add text links or tertiary styles.
- Forms: label ABOVE input (never placeholder-as-label), helper text present in markup, error text BELOW the input. Placeholders, focus rings, helper and error text all pass AA against the section background. Client-side validation.
- No dead links (`#`): link to real destinations or visually disable. Every control has a real outcome.
- Use modals sparingly: inline editing, slide-overs or expandable sections for simple actions.
- Tactile/engineering rules for interaction code (accessibility, focus management, ARIA, responsive testing) are in `ui-engineering.md` and `reference/accessibility/`.

---

## 8. Motion (taste layer)

Full motion craft lives in `reference/motion/`. Taste-layer rules:
- Motion must be motivated: every animation answers "what does this communicate?" (hierarchy, storytelling in sequence, feedback, state transition). "It looked cool" is invalid. If you cannot say it in one sentence, drop it. Extra animation also makes a design feel AI-generated.
- Motion claimed, motion shown: if `MOTION_INTENSITY > 4` the page must actually move (hero entry, scroll reveal, CTA hover physics). A static page claiming MOTION 7 is broken. If you cannot ship working motion, drop the dial to 3 and ship clean static. Never half-build motion.
- Perpetual micro-interactions (pulse, typewriter, float, shimmer, carousel) only when `MOTION_INTENSITY > 5` AND the element is genuinely live (status indicators, AI-feel feeds). Informational sections stay still. Remove looping `animate-pulse`/`animate-ping`, breathing glows, floating elements and heading shimmer on things that are not live.
- Spring physics (`type:"spring", stiffness:100, damping:20`) for interactive elements in Motion UIs; no linear easing. In low-motion/quiet-chrome work use one easing curve and few durations.
- Animate only `transform` and `opacity`; never `top/left/width/height`. Name transitioned properties (`transition-colors`) instead of `transition-all` where quiet chrome is the goal. `will-change: transform` sparingly.
- `window.addEventListener('scroll')`, `window.scrollY` in React state, and `requestAnimationFrame` loops that touch React state are banned. Use `useScroll`, GSAP ScrollTrigger, IntersectionObserver or CSS scroll-driven animations (`animation-timeline: view()`).
- Layout transitions: `layout`/`layoutId` for visible state changes only (reorder, expand, shared element). Do not wrap static content in `layout`.
- Staggered orchestration (`staggerChildren` or `animation-delay: calc(var(--index) * 100ms)`) for reveals where sequence matters. Parent variants and children must share the same Client Component tree. Never mount lists/grids instantly; at most one entrance on load with small stagger.
- Marquee: max one per page.
- Reduced motion is mandatory above `MOTION_INTENSITY > 3`: `useReducedMotion()`, or `@media (prefers-reduced-motion: no-preference)` gating; infinite loops, parallax, scroll hijack and magnetic physics collapse to static.
- Every `useEffect` animation has strict cleanup (`gsap.context(...).revert()`).
- Perf: grain on fixed pointer-events-none pseudo-elements only; infinite loops memoized in their own microscopic client component; lazy-load heavy libs (Motion is not tiny, Three.js is large).
- Core Web Vitals: LCP < 2.5s (hero image `priority`/preloaded), INP < 200ms, CLS < 0.1. Run Lighthouse.
- No custom mouse cursors.

---

## 9. Images and visual assets

Landing pages and portfolios are visual products. Text-only pages with fake-screenshot divs are slop.

Priority:
1. Image-generation tool first, if any exists in the environment. Generate section-specific assets at the right aspect ratio.
2. Real web images: `https://picsum.photos/seed/{descriptive-seed}/{w}/{h}` (seed describes the section), brief-provided URLs, open-license direct URLs. Do not use unreliable Unsplash links.
3. Last resort: clearly labeled placeholder slots (`<!-- TODO: hero product photo, 1600x1200 -->`) and tell the user which placements need real images.

Even minimalist sites need 2-3 real images. Blurred, overlaid or masked background imagery and subtle full-width photos at low opacity add presence to empty flat sections.

Social proof: use real SVG logos (Simple Icons CDN `https://cdn.simpleicons.org/{slug}/ffffff`, devicon). An invented brand gets an invented SVG mark (monogram, ligature, glyph), not a plain-text wordmark. Logos must work in light and dark. Logo wall is logos only: no industry/category label under each logo.

Banned: div-based fake product screenshots (fake task list, terminal, dashboard) and fake version footers inside them; hand-rolled decorative SVG illustrations (allowed only if explicitly requested or a single simple geometric mark); stock "diverse team" photos (use real or a consistent illustration style); missing favicon (always include a branded one); the same avatar for multiple users.

---

## 10. Content, copy and the AI tells

### Content and data
- Realistic names (locale-appropriate, never John Doe/Sarah Chan/Jack Su), unique avatars (no egg/Lucide user icons), organic numbers (`47.2%`, `+1 (312) 847-1928`, not `99.99%`, `50%`, `1234567`), believable brand names (no Acme, Nexus, SmartFlow, Cloudly), varied dates, no Lorem Ipsum.
- Fake-precise spec numbers (`92%`, `4.1x`, `5.8 mm`) are allowed only from real data or when labeled mock.
- Banned filler: Elevate, Seamless, Unleash, Next-Gen, Revolutionize, Game-changer, Delve, Tapestry, "In the world of...", supercharge, unlock, magic, "AI-powered" on everything. Use concrete verbs.
- Copy rules: sentence case; active voice ("We couldn't save your changes"); no exclamation marks in success messages; no "Oops!" errors ("Connection failed. Please try again."); short labels (`Search`, not `Search anything...`); a change says what it compares to (`+12% vs last month`); short strings end without a period; no greeting headlines like `Welcome back, Damir`; unverifiable claims (`Loved by 10,000+ teams`) removed or confirmed with the user; one copy register per page; headlines name what the product does for whom. Name things by what users control, an action keeps the same name through the flow (button "Publish" -> toast "Published"), errors explain what went wrong and how to fix it without apologizing, empty states invite action. Details in `reference/writing/`.
- Copy self-audit before shipping: re-read every visible string (headlines, labels, captions, alt text, errors). Rewrite anything grammatically broken, with unclear referents, hallucinated cute wordplay, forced metaphors, or "LLM trying to sound thoughtful". Boring and functional beats cute and wrong.
- Quotes: max 3 lines of body, attribution with name + role (+ company), real typographic quotes or none.
- Long lists need a different UI component, not a longer `<ul>`: 2-column grouped split, card grid, tabs/accordion, scroll-snap pills, carousel, marquee, or a "view full list" link. No 10-row spec tables with a hairline on every row. Spec sheets: 2-col card grid, scroll-snap pills, 3 grouped clusters with one divider each, or 3-4 hero specs plus a "view full specifications" disclosure. No 20-row data dumps on marketing pages.
- Testimonials: avoid 3-card carousels with dots (masonry wall, embedded posts, single rotating quote). Pricing: highlight the recommended tier with color and emphasis, not just extra height. FAQ: avoid plain accordion where a side-by-side list or searchable help fits. Footer: avoid the 4-column link farm; main paths plus legal links.

### Production-test tells (banned unless the brief explicitly asks)
Hero and top: version labels (`V0.6`, `BETA`, `EARLY ACCESS`), "Brand - No. 01" sub-eyebrows, scroll cues (`Scroll`, `scroll to explore`, mouse-wheel icons), decoration text strips at hero bottom (`BRAND. MOTION. SPATIAL.`), locale/city/time/weather strips (`LIS 14:23 - 18C`; allowed only for travel brands, physical venues or distributed studios).
Numbering and micro-labels: section-number eyebrows (`00 / INDEX`, `06 - how it works`), `01 / 4` pagination on tiles, "Index of Work, 2018-2026" range labels, generic step labels (`Stage 1`, `Step 1`, `Phase 01`; use verb-nouns like Install/Configure/Ship), micro-meta-sentences under eyebrows.
Separators: middle-dot `·` rationed to max 1 per line; no decorative status dots on every nav/list/badge (only real semantic state, one per section at most); no crosshair/hairline grid lines as decoration; no vertical rotated text except deliberate agency/experimental work; no `<br>`-split italic headline gimmicks as default.
Copy tells: "Quietly in use at/trusted by" (use "Trusted by" or no heading), "From the field", "Field notes", "Currently on the bench", "On our desks", "Loose plates" poetic labels, mock-humble lines ("We respect the French ones").
Pills and stamps: pills/labels/tags overlaid on photos (let the image speak or caption below), decorative photo-credit captions (`Field study no. 12`, `Plate 03`), version footers on marketing pages (`v1.4.2`, `Build 0048`), live-stock counters (`Reservation 412 of 800`) without real data.
Lists: `border-t` plus `border-b` on every row of long lists; scoring/progress bars with filled background tracks as comparison visuals.
Typography flourish: ZERO em-dashes (`-` long form) and zero en-dashes as separators anywhere visible (headlines, eyebrows, pills, body, quotes, attribution, captions, buttons, alt text). Use a period, comma, colon, parentheses or a plain hyphen. Date and number ranges use a hyphen. This is the single most-violated tell.
Visual: neon/outer glows, pure black, oversaturated accents, gradient text, custom cursors, glossy blobs/orbs/floating cubes/holographic brains, pill "New"/"Beta" badges (use square, flag or plain text), Lucide/Feather as the default icon set, cliche icon metaphors (rocket = launch, shield = security; try bolt, fingerprint, spark, vault), sun/moon toggle as the only theme control (consider dropdown, system detection or settings), avatar circles only (try squircles), glass/grain/neon/bento swapped in as the next trend.

### Strategic omissions AI usually forgets
Privacy and terms links in the footer, back navigation (no dead ends), custom branded 404, form validation, skip-to-content link, cookie consent where jurisdiction requires, `<title>`/description/og:image meta, branded favicon, semantic HTML (`nav main article aside section`, no div soup), alt text on meaningful images, relative units instead of hardcoded px widths, no commented-out dead code, no inline-style/class mixing, no arbitrary z-index, verified imports.

---

## 11. Redesign protocol

1. Detect mode (first action): Greenfield; Redesign-Preserve (modernise, keep brand); Redesign-Overhaul (new visual language, preserve content and IA). If ambiguous ask once: "Should this redesign preserve the existing brand, or are we starting visually from scratch?"
2. Scan: read the code, find framework and styling method. Diagnose: audit before touching. Document brand tokens (colors, type, logo treatment, radii), information architecture, content blocks and what does work, patterns to preserve (signature interactions, copy voice), patterns to retire (slop tells, broken layouts, dead links, stock imagery, perf traps), existing dial reading (that is the starting point, not baseline), SEO baseline (SEO migration is the #1 redesign risk).
3. Fix with the existing stack, small and reviewable. Do not migrate frameworks, rewrite from scratch, or break functionality; test after each change; check dependencies and Tailwind version first; vanilla CSS if no framework.
4. Preservation rules: keep IA, slugs, anchor IDs and primary nav labels stable; extract brand colors before applying palette rules (a purple brand stays purple); keep copy voice unless a rewrite is asked; do not regress focus, alt text, keyboard nav or contrast; do not rename buttons, field names or section IDs that analytics depend on.
5. Never change silently: URL structure, primary nav labels, form field names/order, logo or wordmark, legal/consent/cookie copy.
6. Modernisation levers in order, stopping when the brief is satisfied: font swap (biggest instant lift, lowest risk), color cleanup, hover/active states, layout and spacing (grid, max-width, consistent padding, whitespace), replace generic components, add loading/empty/error states, polish type scale and spacing. Optional layers: motion, hero and key-section recomposition, full block replacement only for unsalvageable blocks.
7. Targeted evolution vs full redesign: sound IA, content and SEO means targeted evolution (about 70% of value at 40% of risk); structural visual debt (broken IA, no design system, broken mobile) means full redesign with strict content preservation; a brand change means greenfield.
8. Light slop vs heavy slop (unslop): heavy slop gets the full nine-pass process; light slop gets polish mode (fix only what the audit finds, keep the existing brand); no slop gets a plain "this is fine" plus at most two or three refinements. Never change a good screen just to make it different.
9. Do not replace removed decoration with new decoration; do not rename the product; do not invent features, claims or data.

---

## 12. Out of scope for the taste layer

Dashboards and dense product UI, data tables, multi-step wizards, code editors, native mobile, realtime collaborative UIs. Say so explicitly and point to the right tool (Fluent, Carbon, Atlassian, Polaris, TanStack Table or AG Grid, Monaco/CodeMirror, Apple HIG/Material), then apply only the marketing/landing surface parts of this file. For dashboard craft, see `unslop/` (stat cards, charts, density) and `reference/ui-polish/interface-design`.

---

## 13. Resolved conflicts between the merged sources

| Topic | Sources disagreed | Resolution |
|---|---|---|
| Inter | v1 banned, v2 discouraged, unslop "swap if unchosen", engineering skill silent | Discouraged default with explicit override paths (section 4) |
| Serif | v1 editorial only, v2 very discouraged + banned list, frontend-design warns about cream+serif default | v2 rules |
| Lucide | v1 forced Phosphor/Radix, v2 discouraged, unslop used lucide as fallback | Allowed list first; Lucide when the project already uses it or user asks |
| Perpetual loops | v1 mandatory above MOTION 5, v2 contextual, unslop removes loops | Only on genuinely live elements (section 8) |
| Emoji | v1 banned absolutely, v2 discouraged with override | v2 |
| Pure black | v1, v2, redesign agree; v2 also bans pure white | Both banned |
| Cards | v1 banned at density > 7, v2 same plus bento rules, engineering skill "composition" | Cards only when elevation means hierarchy |
| Shadows | v1 "diffusion shadow bento" vs engineering "subtle or none" | Tinted, soft, single light source; none in dark UIs |
| Motion on load | v1 stagger everything, unslop "at most one entrance" | At most one entrance sequence with small stagger |

## 14. Final pre-flight check (run every line; any failure means not done)

Brief and system
- [ ] Design Read stated; dial values explicit and reasoned
- [ ] Design system chosen from the map, or aesthetic labeled honestly; one system only
- [ ] Redesign mode detected and audit done, if a redesign
- [ ] Dependencies verified in `package.json`

Locks and consistency
- [ ] ONE theme for the whole page; dark and light both tested
- [ ] One accent used identically everywhere; one neutral family
- [ ] One corner-radius system; nested radii add up
- [ ] Serif is not Fraunces/Instrument Serif without justification and differs from last project
- [ ] Premium-consumer palette is not the beige+brass+espresso default and differs from last project
- [ ] Italic words with descenders have `leading-[1.1]` and `pb-1`

Contrast and a11y
- [ ] Button text and form elements pass AA; no wrapped CTAs; no duplicate CTA intent
- [ ] Visible focus, keyboard navigation, skip link, alt text, semantic HTML
- [ ] Reduced motion handled for anything above MOTION 3

Layout
- [ ] Hero fits the viewport (headline max 2 lines, subtext max 20 words, CTA visible), top padding max `pt-24`, max 4 text elements
- [ ] Logo wall below hero, real SVG logos, logos only
- [ ] Nav on one line, max 80px
- [ ] Eyebrow count <= ceil(sections / 3); no split headers; no floating top-right sub-text
- [ ] At least 4 layout families across 8 sections; zigzag cap; bento cell count and background variety
- [ ] No three equal feature cards; cards omitted in favor of spacing where possible
- [ ] `min-h-[100dvh]` not `h-screen`; Grid not flex math; explicit mobile collapse
- [ ] Long lists use the right component; content density sane; quotes max 3 lines

Content
- [ ] ZERO em-dashes or en-dash separators anywhere visible
- [ ] Copy self-audit done; no filler words; no fake-precise numbers; realistic names
- [ ] No tells from section 10 (version labels, scroll cues, section numbers, decorative dots, overlay pills, photo-credit captions, locale strips, decoration strips, filled progress tracks)
- [ ] Real images (gen tool, then Picsum seed, then labeled slots); no div fake screenshots; no hand-rolled SVG

Motion and perf
- [ ] Every animation motivated; motion claimed equals motion shown; max one marquee
- [ ] No `window.addEventListener('scroll')`; only transform and opacity animated
- [ ] `useEffect` animations have cleanup; motion isolated in client leaves
- [ ] Sticky-stack and horizontal-pan use the canonical skeletons (`start: "top top"`, `pin: true`)
- [ ] LCP/INP/CLS plausibly met

States
- [ ] Loading, empty, error and success states exist and are reachable; controls all lead somewhere

Finish gate (anti-ui-slop)
- [ ] Purpose obvious immediately; one primary action leads
- [ ] Every control has a real outcome; labels belong to this product
- [ ] Template test: swap the product name for another product's. If the screen still fits, push the direction harder in the copy, the visual and the signature detail.


---

## 15. AI slop indicators, community checklist (20)

Collected from short-form design videos. Items already covered elsewhere point to the section; **new** items are rules added here. All are "flag unless the brief earns it".
1. **Tags and pills** everywhere: badges on every card, "New", "Beta", pill-shaped categories. Keep one real status at most (section 10 "Pills and stamps"). **new emphasis**
2. **Excessive italics**: random words italicized in headlines/body. Same-family emphasis only and rarely (section 4). **new**
3. **Instrument Serif** (and Fraunces) as the "premium" default (section 4).
4. **Negative kerning/tracking** applied to everything, especially small text (section 4; typography.md).
5. **Over-the-top detailed UI**: every surface with gradient + border + shadow + glow + inner highlight. Simplify; one treatment per surface. **new**
6. **Overusing dividers**: hairlines between every row and section. Group with space first (section 6; section 10 lists). **new emphasis**
7. **Color shades and opacities**: many near-identical grays and `white/5`, `white/10`, `white/20` layers. Use a small ramp with roles (`reference/color/color.md`). **new**
8. **Containers with borders**: every item a bordered box (cards inside cards). Remove the border or the box (section 6 cards rule).
9. **Overly detailed diagrams**: fake architecture/flow diagrams with tiny labels and dozens of nodes. Show the real product or a simple diagram. **new**
10. **Verbose, redundant text**: subtitles that repeat headlines, helper text that restates the label (section 10 copy; writing.md). **new emphasis**
11. **Code breadcrumbs**: faux paths or terminal prompts like `~/project/src` as decoration. **new**
12. **Section numbering**: `01 / 02 / 03` (section 10).
13. **Eyebrows** above every section (section 6 eyebrow cap).
14. **Dithering** and noisy bitmap texture as default decoration (brutalist direction only, `reference/styles/styles.md` C). **new**
15. **ASCII images** and ASCII art banners as decoration (same). **new**
16. **Squircles** / over-rounded corners on everything (section 6 shape lock: pick one radius system). **new emphasis**
17. **Excessive mono fonts**: monospace for labels, nav, headings, numbers all at once. Mono only where it carries meaning (code, IDs, tabular data). **new emphasis**
18. **ALL CAPS subtitles** and uppercase tracked labels (section 4; unslop signs).
19. **Gradient backgrounds**: purple/blue mesh and radial blobs as the default hero (section 5).
20. **Periods in titles**: headline and short label strings ending in a full stop (unslop copy rule; section 10).

## 16. Unslop quick pass, community checklist (20)

A fast order of operations for cleaning an AI design. The full method (direction first, nine passes) is `reference/taste-anti-slop/unslop/SKILL.md`; this is the 40-second version.
1. Delete filler badges and pills.
2. Drop redundant labels (labels that restate the control or heading).
3. Unitalicize random words and de-capitalize needless Title Case.
4. Mono only where needed (code, IDs, tabular numbers).
5. Use a design system (tokens + one component library) instead of one-off styling (`reference/design-systems/design-systems.md`).
6. Show the actual product (real screenshot/preview) instead of a fake diagram or abstract illustration.
7. Enlarge the main feature; give the one thing that matters the most area.
8. Group with spacing instead of borders and boxes.
9. Make headlines specific (what it does, for whom), not generic.
10. Emphasize the CTA: one clear primary action.
11. Add an accent colour (one, used for primary action/selection) over a quiet neutral base.
12. Keep icons consistent (one set, one size, one stroke).
13. Remove embellishments: glows, gradients, blobs, decorative borders.
14. Inner radius = outer radius minus padding (concentric corners; `reference/ui-polish/ui-polish.md`).
15. Improve text contrast (`reference/color/color.md`).
16. Wrap headlines properly: `text-wrap: balance`, no orphans (`reference/typography/typography.md`).
17. Align by eye, not pixels: optical alignment for icons, triangles, text in buttons.
18. Use tabular numbers on changing values.
19. Add loading states (skeletons matching layout) plus empty and error states.
20. Animate useful feedback only (press, success, state change), nothing decorative (`reference/motion/motion.md`).

## 17. Reference products to emulate (taste anchors)

When the brief names a category, borrow the *quality bar and decisions* (not the brand) from these; lookup details in `reference/styles/inspiration-references.md`: animation = Apple, onboarding = Duolingo, UI design = Linear, typography = Pentagram, minimalism = Muji, art direction = Aesop, dashboards = Notion, page layout = Stripe, micro-interactions = Framer.
