---
name: ui-remix
description: All-in-one UI/UX and visual design reference for web, mobile and desktop. Use for ANY task that designs, builds, reviews, redesigns or polishes an interface, page, component, design system, brand, animation, color, typography, layout, accessibility or UI copy. Routes to merged topic files and ships a searchable database of styles, palettes, font pairings, UX rules, charts and stack guidelines.
---

# UI REMIX

One skill, many topic files. Do not read everything. Pick the route below, load only those files, then build. Each topic folder has ONE canonical merged file at its top level (plus detail files in subfolders).

## 1. Route the task

| If the task is... | Load first | Then, as needed |
|---|---|---|
| New page/app, no direction yet; "make it look designed" | `reference/taste-anti-slop/taste.md` | `reference/styles/styles.md`, `reference/ux-rules/ux-rules.md` |
| Redesign / "looks generic" / "AI slop" | `reference/taste-anti-slop/taste.md` (section 11) | `reference/taste-anti-slop/unslop/SKILL.md`, `reference/workflows/workflows.md` |
| Pick a visual style or aesthetic | `reference/styles/styles.md` | `python scripts/search.py "<q>" --domain style` |
| Fonts, type scale, line-height, wrapping | `reference/typography/typography.md` | |
| Palette, tokens, contrast, gradients, dark mode | `reference/color/color.md` | `reference/design-systems/design-systems.md` |
| Spacing, grouping, responsive, RTL | `reference/layout/layout.md` | |
| Keyboard, focus, ARIA, forms, hit areas, zoom | `reference/accessibility/accessibility.md` | |
| Animation, transitions, springs, gestures | `reference/motion/motion.md` | `motion-recipes.md`, `motion-review.md`, `motion-vocabulary.md` |
| Radius, shadows, icons, "feels off" polish | `reference/ui-polish/ui-polish.md` | `reference/ui-polish/interface-design.md` (dashboards/tools) |
| Labels, errors, empty states, microcopy | `reference/writing/writing.md` | |
| Ready-made components, animated UI libraries, inspiration sites, generators (user bookmarks) | `reference/design-systems/resources-catalog.md` | `design-systems.md` section 3 |
| Tokens, shadcn/Tailwind, library choice, icons | `reference/design-systems/design-systems.md` | `tokens/`, `shadcn-tailwind/` |
| Brand identity, voice, logos, banners, decks, social | `reference/brand/brand.md` | `brandkit.md`, `design-studio.md`, `identity/`, `studio/` |
| UX rule lookup, checklists, charts, stacks | `reference/ux-rules/ux-rules.md` | search tool below |
| UX laws (Fitts, Hick, Miller, Doherty, Postel, Jakob), animation principles | `reference/ux-rules/ux-laws.md` | `reference/motion/motion.md` |
| "Who sets the bar for X" (animation, onboarding, typography, minimalism, art direction, dashboards, layout, micro-interactions) | `reference/styles/inspiration-references.md` | |
| Quick AI-slop scan or fast cleanup (20-item lists) | `reference/taste-anti-slop/taste.md` sections 15-16 | `unslop/SKILL.md` |
| Forms, states, dashboards, charts, chat UI, auth/landing/dashboard recipes | `reference/patterns/patterns.md` | `reference/ux-rules/ux-rules.md` |
| Audit / review / critique / teardown / image-to-code / variants | `reference/workflows/workflows.md` | `review-report-format.md`, `ui-craft/`, `impeccable/`, plus the topic files for each finding |

`reference/INDEX.md` lists every file. `SOURCES.md` records what was merged from where and which conflicts were resolved. If two files disagree, the topic's canonical file wins over `ux-rules.md`, and `taste.md` wins for page-level taste/anti-slop decisions.

## 2. Search the database

Local data (CSV): 79 styles, 192 product palettes + reasoning, 74 font pairings, 119 UX guidelines, icons, GSAP presets, 25 chart types, 22 stacks.

```bash
python scripts/search.py "<query>" --design-system          # full recommendation: pattern, style, palette, fonts
python scripts/search.py "<query>" --domain style|color|typography|ux|product|chart|landing|motion|icons|gsap|react|web|google-fonts
python scripts/search.py "<query>" --stack react|nextjs|shadcn|html-tailwind|svelte|vue|flutter|swiftui|...
```
Run from this skill's folder. Optional dials: `--variance 1-10 --motion 1-10 --density 1-10`. Full CLI notes and query contract: `reference/ux-rules/ux-rules.md`. Regenerate the index with `python scripts/build_index.py`.

## 3. Priority when rules conflict

1. Accessibility (contrast, keyboard, focus, hit areas, reduced motion)
2. Touch and interaction (44px targets, feedback, no hover-only)
3. Performance (layout shift, image formats, no layout-property animation)
4. Fit to product and audience (style, palette, type chosen for the product, not by default)
5. Layout and responsive
6. Typography and color
7. Motion
8. Polish details

A lower number never loses to a higher one. A beautiful choice that fails contrast or keyboard is wrong.

## 4. Always-on rules (survive any routing)

- Read the room first (`taste.md` section 0): state a one-line Design Read, set the three dials, then choose. No default purple gradients, no stock hero + three equal cards, no beige+brass "premium" palette unless the brief earns it.
- Semantic tokens (color, space, type, radius, motion) from one source; no raw hex or magic numbers in components.
- Design every state: default, hover, focus-visible, active, disabled, loading, empty, error, success.
- SVG or a real icon set for icons, never emoji as UI.
- Respect `prefers-reduced-motion`; animate `transform`/`opacity` only; ask "should this animate at all?" (`motion.md` section 3).
- Check at 320px, 768px, 1280px+ and at 200% zoom before calling it done.
- Real content shapes (long names, missing images, RTL, empty lists), not lorem ipsum.

## 5. Growing this skill

New rules go in the topic file they belong to. If a new rule duplicates an existing one, merge into the better wording rather than appending, and note the merge in `SOURCES.md`. Plugin skills ui-craft and impeccable were added as detail files (not line-merged); open-design contributed only its critique skill (the rest is MCP/tool plumbing and a template library). Not yet included: canva, figma, design plugin, hallmark, take-one, huashu-*, rossark-motion, reanimate, mobile-android-design, Roblox GUI, slides skill. Add on request.
