# Layout (canonical)

Merged from better-layout. Rules first, then detail sections. Review/report format: `reference/workflows/review-report-format.md`.

This skill sets grouping, alignment, spacing and responsive structure. It then stress-tests that structure by resizing it, translating it and mirroring it for RTL.

Write every fix in the project's styling system. The numbers below apply only where the project has no spacing scale or density system; otherwise use its tokens. A finding needs a failure you can show, such as a clip, an overlap, a broken mirror or a misread group. A value that differs from these starting points is not one.

Hit areas and focus behavior belong to `accessibility.md`. Radius, shadows and animation belong to `ui-polish.md`. Line length, text spacing and truncation mechanics belong to `typography.md`. The words themselves belong to `writing.md`.

## Group with space, not lines

Space groups first, background shapes second, separator lines last and only where space alone can't carry the structure. The gap between groups is at least 2× the gap within one, so `8px` inside a group means `16px` or more between groups. Recipes are in [grouping-and-alignment.md](#group-with-space-not-lines).

## Keep controls distinct from content

Give every interactive element a background shape, a border, an underline or a consistent placement zone such as a toolbar. A control styled like the static text beside it does not read as a control. See [grouping-and-alignment.md](#keep-controls-distinct-from-content).

## Align to shared edges

Pick a small set of alignment edges and put everything on them. Use one project spacing step per level of nesting, where `16px` is a useful default. See [grouping-and-alignment.md](#align-to-shared-edges).

## Logical properties for anything that mirrors

Write direction-dependent layout as leading and trailing: `margin-inline-start`, `padding-inline-end`, `inset-inline-start`, `text-align: start`. Reserve physical left and right for physical geometry such as safe-area insets. The mapping table and the RTL progression rules are in [grouping-and-alignment.md](#logical-properties-for-anything-that-mirrors).

## Order by importance

The most important content sits near the top and the leading edge. Within a row, identifying content leads and metadata and actions trail. Visual order matches DOM order, so never move content out of source sequence with `order`, `row-reverse` or grid placement. See [grouping-and-alignment.md](#order-by-importance).

## One primary action per view

Give each view one primary action. Put secondary actions behind a menu once there are more than 3. Prefer a short view that links deeper over one long view that shows everything at the top level. `color.md` owns how color marks the primary action.

## Hint at hidden content

Every piece of off-screen or collapsed content needs a visible cue. Use the project's established cue, let the next item peek `16–32px` past the scroll edge or show a disclosure control.

A truncated value the user needs has a way to the full text: an expand control, a detail view or a tooltip that is also keyboard-reachable. Truncation mechanics are `typography.md`'s. Recipes are in [spacing-and-adaptivity.md](#hint-at-hidden-content).

## Borderless controls need more clearance

Without an established density system, start with `12px` between adjacent bordered or filled controls. Leave `24px` between the visible glyphs of borderless text and icon controls, counting each button's own padding. Compact layouts may use less, as long as hit areas never overlap and the controls stay distinct. See [spacing-and-adaptivity.md](#borderless-controls-need-more-clearance).

## Inset buttons from the edges

In content layouts, keep full-width buttons inside the layout margins, starting near `16px` inline on mobile. Edge-to-edge actions work when they follow established platform chrome, account for safe areas and stay distinguishable from system UI. See [spacing-and-adaptivity.md](#inset-buttons-from-the-edges).

## Content bleeds, controls float

Backgrounds and media extend to the viewport edges. Controls and text stay inside the layout margins and safe areas. `env(safe-area-inset-*)` is non-zero only when the viewport meta includes `viewport-fit=cover`.

Content scrolls beneath sticky chrome. Set `scroll-padding-block-start` to the sticky header's height, so anchored targets and focused elements never land under it. See [spacing-and-adaptivity.md](#content-bleeds-controls-float).

## Hold structure until it breaks

Breakpoints come from the content, not device presets. Keep the expanded layout until it stops fitting, then collapse. Prefer container queries for component-level adaptation, and test the smallest and largest supported sizes first. See [spacing-and-adaptivity.md](#hold-structure-until-it-breaks).

## Plan for growth and clipping

Translated strings grow, and short ones grow proportionally more, so a one-word button label is the riskiest thing on the screen. Size text containers with `max-width` and `min-height`, never a fixed width or height, and let rows wrap. Test with pseudo-localization and one long-string locale such as German.

Never park a critical action where resizing, zoom or scrolling clips it. Keep it in the normal flow or in stable chrome. See [spacing-and-adaptivity.md](#plan-for-growth-and-clipping).

## Before you finish

| Detection pattern | Fix |
| --- | --- |
| `grid-template-columns: … 1fr` or a flex child holding long text or a wide table, overflowing its track | `minmax(0, 1fr)` on the track, `min-width: 0` on the flex child |
| `width: 100vw` | `width: 100%`; `100vw` includes the scrollbar and scrolls horizontally on desktop |
| `height: 100vh` on a full-height mobile pane | `100dvh`, so the browser toolbar and keyboard never cover the bottom |
| `height:` with a fixed length on a box holding text | `min-height`, or `max-height` with `overflow-y: auto` |
| `@media (max-width: …)` inside a reusable component | `@container` on the component's parent |
| `container-type: inline-size` on a flex item, inline-block or absolute element with no width | Give it a definite width; size containment collapses a shrink-to-fit box to zero |
| `env(safe-area-inset-*)` with no `viewport-fit=cover` in the viewport meta | Add it, or the insets resolve to `0` |
| `inset-inline-*` or `*-inline-*` combined with `safe-area-inset-left` or `-right` | Physical `left` or `right` with the matching inset, plus a `[dir="rtl"]` override |
| `float: left` on mirrored UI | `float: inline-start` |
| `translateX` or `background-position: left` on mirrored UI | A `[dir="rtl"]` override; neither has a logical form |
| Sticky header with no `scroll-padding-block-start` | Set it to the header height |


---

## Grouping and alignment

Recipes for grouping, control distinction, shared edges, logical properties and ordering.

### Group with space, not lines

Reach for each tool only where the one before it can't carry the structure:

1. **Negative space**, the default.
2. **Background shapes**, a card or filled container, where a group must read as one unit such as a selectable row or a draggable card.
3. **Separator lines**, for dense data where space costs too much, such as tables and long settings lists.

```css
/* Good: spacing alone communicates the grouping */
.field-group { display: flex; flex-direction: column; gap: 8px; }
.form { display: flex; flex-direction: column; gap: 24px; }

/* Bad: uniform spacing plus lines to compensate */
.form > * { margin-bottom: 12px; border-bottom: 1px solid var(--separator); }
```

```html
<!-- Good: Tailwind -->
<div class="space-y-6">
  <div class="space-y-2">…field group…</div>
  <div class="space-y-2">…field group…</div>
</div>
```

Where a separator is genuinely needed, keep it a low-contrast hairline. Never pair it with a large gap that already did the job.

### Keep controls distinct from content

```html
<!-- Bad: action looks exactly like the description text next to it -->
<p class="text-zinc-600">Your trial ends soon. Upgrade now</p>

<!-- Good: the underline marks the action -->
<p class="text-zinc-600">Your trial ends soon.</p>
<button class="font-medium underline underline-offset-2">Upgrade now</button>
```

The inverse holds too. A non-clickable badge shaped exactly like the buttons beside it collects dead clicks.

### Align to shared edges

- Typical stray edges are an icon 2px off the text edge and a card padded unlike its neighbor.
- Deeper nesting repeats the same spacing step rather than inventing a new one.
- Numbers in tables take `text-align: end`, text takes `text-align: start`. Tabular figures are `typography.md`'s.

```css
/* Good: one shared leading edge, one indent step */
.section { padding-inline: 24px; }
.section .child { margin-inline-start: 16px; }

/* Bad: three unrelated leading edges in one column */
.header { padding-inline-start: 20px; }
.list-item { padding-inline-start: 14px; }
.footer { padding-inline-start: 24px; }
```

### Logical properties for anything that mirrors

| Physical | Logical |
| --- | --- |
| `margin-left` | `margin-inline-start` |
| `padding-right` | `padding-inline-end` |
| `left: 0` | `inset-inline-start: 0` |
| `text-align: left` | `text-align: start` |
| `border-right` | `border-inline-end` |
| `float: left` | `float: inline-start` |
| `border-top-left-radius` | `border-start-start-radius` |

```html
<!-- Good: Tailwind logical utilities -->
<div class="ms-4 pe-6 text-start">…</div>

<!-- Bad: breaks in RTL -->
<div class="ml-4 pr-6 text-left">…</div>
```

Flex rows and grid columns follow the inline direction, so they mirror under `dir="rtl"` on their own. Physical values inside them do not mirror, and neither do `translateX`, `background-position` or anything hand-positioned with `left` and `right`.

Where arrangement encodes progression, as in star ratings, step indicators and progress bars, the sequence mirrors in RTL. Stars fill from the leading edge, which is the right in RTL. Digit order inside numbers never reverses; that and other bidi rules belong to `typography.md`.

### Order by importance

Never bury the one number the user came for under rows of secondary detail. Move secondary detail into collapsed sections, tabs or detail views.

```html
<!-- Good: primary fact first, detail demoted -->
<div>
  <p class="text-2xl font-semibold">$4,320.00</p>
  <p class="text-sm text-zinc-500">Available balance</p>
</div>

<!-- Bad: the key fact sits last, below the metadata -->
<div>
  <p class="text-sm">Account 4402 · Opened 2019 · Standard tier</p>
  <p class="text-sm">Last statement: June 30</p>
  <p class="text-sm">Balance: $4,320.00</p>
</div>
```


---

## Spacing and adaptivity

Recipes for control clearance, edge insets, disclosure cues, edge behavior, breakpoints and growth.

### Borderless controls need more clearance

| Between | Starting point |
| --- | --- |
| Adjacent bordered or filled controls, such as buttons and inputs | `12px` |
| Visible glyphs of borderless controls, such as text and icon buttons | `24px` |
| Unrelated control groups | `24px` or more |

Nothing marks where one borderless target ends and the next begins, so the space is the boundary. Preserve an established, usable density rather than expanding controls to match these values.

```html
<!-- Good: bordered buttons at 12px -->
<div class="flex gap-3">
  <button class="rounded-lg border px-4 py-2">Cancel</button>
  <button class="rounded-lg bg-blue-600 px-4 py-2 text-white">Save</button>
</div>

<!-- Bad: three borderless icon buttons packed at 4px -->
<div class="flex gap-1">
  <button><TrashIcon /></button>
  <button><ArchiveIcon /></button>
  <button><ShareIcon /></button>
</div>
```

Target sizes and hit-area expansion belong to `accessibility.md`. Space controls so their expanded hit areas never overlap.

### Inset buttons from the edges

A button pressed against the viewport looks like system chrome and clips against curved corners and gesture zones.

```css
/* Good: inset action bar */
.action-bar {
  padding-inline: 16px;
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
}
.action-bar button { width: 100%; }

/* Bad: button glued to three edges, and 100vw adds the scrollbar width */
.action-bar button {
  width: 100vw;
  position: fixed;
  bottom: 0;
}
```

The button can still span the full content width inside the margins.

### Hint at hidden content

- **Peeking items.** A row of cards that ends exactly at the container edge looks complete, and nobody scrolls it.
- **Disclosure controls.** A collapsed section gets a chevron or a "Show more" control naming what is hidden: "Show 12 more results", not "More".
- **Truncated values.** Pair the clamp with an expand control, a link to a detail view or a tooltip that also opens on keyboard focus. A hover-only `title` attribute does not count, because keyboard and touch users never see it.

The item width sets the peek: width = `100%` + gap − peek, since `100%` is the container's content box. Scroll padding keeps snapped items on the content edge.

```css
.scroller {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-inline: 24px;
  scroll-padding-inline: 24px;
  scroll-snap-type: x mandatory;
}
.scroller > * {
  flex: 0 0 calc(100% - 12px); /* content box + 12px gap - 24px peek */
  scroll-snap-align: start;
}
```

```html
<!-- Tailwind: the same 24px peek -->
<div class="flex gap-3 overflow-x-auto px-6 scroll-px-6 snap-x snap-mandatory">
  <div class="w-[calc(100%-12px)] shrink-0 snap-start">…</div>
  <div class="w-[calc(100%-12px)] shrink-0 snap-start">…</div>
</div>
```

### Content bleeds, controls float

```css
/* Good: full-bleed media inside a constrained article */
.article {
  display: grid;
  grid-template-columns: 1fr min(65ch, calc(100% - 48px)) 1fr;
}
.article > * { grid-column: 2; }
.article > .full-bleed { grid-column: 1 / -1; }
```

Safe-area insets are physical, so a floating button pairs each physical side with its own inset and overrides it in RTL:

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
```

```css
.fab {
  position: fixed;
  right: calc(16px + env(safe-area-inset-right));
  bottom: calc(16px + env(safe-area-inset-bottom));
}
[dir="rtl"] .fab {
  right: auto;
  left: calc(16px + env(safe-area-inset-left));
}

/* Sticky header never covers an anchor target or a focused element */
html { scroll-padding-block-start: var(--header-height); }
```

### Hold structure until it breaks

Break where the layout stops fitting, not at `768px` because a preset says so. That is where the sidebar squeezes content below its minimum measure, or a card grid drops below a usable column width.

```css
/* Good: component adapts to its container */
.card-list { container-type: inline-size; }
@container (width < 400px) {
  .card { grid-template-columns: 1fr; }
}

/* Bad: viewport media query breaks the card inside a narrow sidebar */
@media (max-width: 768px) {
  .card { grid-template-columns: 1fr; }
}
```

A query styles only descendants of the container, never the container itself. `container-type: inline-size` adds size containment, so the container no longer takes its width from its content. A shrink-to-fit container such as a flex item with no width, an inline-block or an absolutely positioned box collapses to zero.

### Plan for growth and clipping

```css
/* Good: label defines the size, and the row wraps */
.button { padding-inline: 16px; max-width: 100%; }
.button-row { display: flex; flex-wrap: wrap; gap: 12px; }

/* Bad: German will overflow or truncate */
.button { width: 96px; overflow: hidden; }
```

A grid track or flex child refuses to shrink below its content's minimum width, so long words and wide tables push the layout past the viewport. Use `grid-template-columns: minmax(0, 1fr)` and `min-width: 0` on flex children.

Fixed-height containers clip text at 200% zoom and in long locales. Use `min-height` where a floor is needed. Where a box must cap its height, pair `max-height` with `overflow-y: auto`.

Typical clip-prone spots are the bottom edge of a resizable pane, the bottom of a modal taller than the viewport and anything the on-screen keyboard covers:

- Size full-height panes with `100dvh`, not `100vh`, which ignores mobile browser toolbars.
- Give a modal `max-height: 100dvh`, a scrolling body and an action row outside the scroll area.
- Keep primary actions in stable chrome, such as a sticky footer with safe-area padding or the top of the view.


---

## See also: additions from the ui-craft and impeccable plugins (not line-merged)

These were added verbatim as detail files. They overlap this topic in subject but not in wording, so they were kept rather than merged. Where they disagree with this file, this file wins.
- ui-craft: layout/ui-craft/layout.md, layout/ui-craft/responsive.md
- impeccable: layout/impeccable/layout.md, adapt.md, adapt.native.md
