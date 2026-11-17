# UI polish (canonical)

Merged from better-ui (base: exact values) and make-interfaces-feel-better (near-superset duplicate; only its unique parts were added, see the end of this file). Review/report format: `reference/workflows/review-report-format.md`.

This skill holds the visual polish for surfaces, icons and motion, with the exact value each detail takes. It applies once the underlying interaction is sound, and a polish finding never outranks a broken interaction.

## Exact values, optional polish

The values below are exact, not ranges to approximate. `cubic-bezier(0.2, 0, 0, 1)` is not `cubic-bezier(0.4, 0, 0.2, 1)`, and `0.96` is not `0.95`. The optical nudges and the concentric padding cutoff are the exceptions. They are starting points, judged by eye.

Keep the project's component library, tokens and density, and match its motion language wherever no rule here gives a value. A deliberate and consistent project convention, such as a style with no shadows, is a preference and not a finding. The same detail done two ways within the project is a finding.

Text wrapping, font rendering, tabular numbers and text spacing belong to `typography.md`. Hit areas, keyboard support, ARIA and the reduced-motion requirement belong to `accessibility.md`. Grouping, section spacing, breakpoints and spatial RTL belong to `layout.md`, except directional icon mirroring. Color tokens and contrast measurement belong to `color.md`.

## Outer radius equals inner radius plus padding

Where nested surfaces share a visible, even inset, the outer radius is the inner radius plus the padding plus any border width. Past `24px` of padding, or where the padding is deliberately asymmetric, treat the layers as separate surfaces and keep each one's radius token. Recipes are in [surfaces.md](#surfaces).

## Align optically where geometry looks off

Where geometric centering looks off, nudge by eye. Give a button `2px` less padding on its icon side, shift a play triangle toward its point and fix asymmetric glyphs in the SVG itself. Recipes are in [surfaces.md](#optical-alignment).

## Shadows for elevation, borders for structure

Where a border exists only to create depth, replace it with layered transparent `box-shadow` values. Keep borders on dividers, separators, table cells and selected states. Keep them on form inputs too, whose boundary needs 3:1 non-text contrast under `accessibility.md`. Focus rings belong to `accessibility.md` as well.

Forced-colors mode removes every `box-shadow`. Keep `border: 1px solid transparent` under a shadow ring so that mode still draws an edge. Recipes are in [surfaces.md](#shadow-recipes).

## Outline images in pure black or white

Give content images a `1px` outline inset by `1px`. Use `oklch(0 0 0 / 0.1)` in light mode and `oklch(1 0 0 / 0.1)` in dark. Never use a palette near-black, a tinted neutral or the accent color, because the tint shows as a colored fringe on the image edge. Skip transparent artwork such as logos and illustrations. The recipe is in [surfaces.md](#image-outlines).

## Transitions, not keyframes, for interactive state

Drive interactive state changes with CSS transitions or a motion library's springs, which retarget when the user reverses mid-flight. Keyframes run a fixed timeline and cannot reverse, so reserve them for sequences that run once. See [animations.md](#animations).

## Press scales to 0.96

A pressed button scales to `0.96` over `150ms` with `ease-out`, and a disabled one never scales. Give the button an opt-out where the motion would distract, through the component's existing variant API or a `static` prop. See [recipes for CSS, Tailwind and Motion](#scale-on-press).

## High-frequency interactions respond instantly

Keystrokes, row hovers and tab switches get instant feedback, or a transition of `150ms` or less on `opacity` or `background-color`. Reserve expressive motion for infrequent moments such as a view's first load, a success state or an empty state.

Every animated state change also leaves a static cue in the form of a color, icon or label. Motion is never the only feedback channel.

## Gate motion behind the reduced-motion preference

`accessibility.md` owns the requirement, and no recipe here ships without it. Run movement, scale and blur only under `prefers-reduced-motion: no-preference`. Under reduced motion, replace them with an opacity cross-fade rather than removing the element instantly. Recipes for CSS, Tailwind and Motion are in [animations.md](#reduced-motion-fallback).

## Stagger infrequent entrances by 100ms

Where sequence communicates hierarchy in a staged entrance, split the content into semantic chunks such as title, description and actions. Stagger them `100ms` apart, each entering with opacity, `4px` of blur and `12px` of `translateY` over `300ms` with `ease-out`. Never stagger routine interactions. See [enter-exit.md](#enter-exit).

## Exits are shorter and smaller than enters

Exit with opacity, `4px` of blur and a fixed `-12px` `translateY` over `150ms` with `ease-out`, never the full container height. Slide fully out only where the destination carries meaning, such as a drawer closing. Remove the element instantly where motion adds no information. See [enter-exit.md](#exit-animations).

## Skip state animations on first render

Set `initial={false}` on an `AnimatePresence` that wraps a state swap, so the default state does not animate in on mount. Never set it around an intentional entrance such as a staggered hero. See [animations.md](#skip-animation-on-page-load).

## Cross-fade contextual icons with exact values

Where an icon swaps on an infrequent state change, such as play to pause or copy to copied, cross-fade it. Scale runs `0.25` to `1`, opacity `0` to `1` and blur `4px` to `0px`. With a motion library, use `{ type: "spring", duration: 0.3, bounce: 0 }`, and bounce is always `0`. Without one, keep both icons in the DOM and cross-fade over `300ms` with `cubic-bezier(0.2, 0, 0, 1)`.

A tab's icon swap and the actions a row reveals on hover fall under **High-frequency interactions respond instantly**. Both recipes are in [icon-transitions.md](#icon-transitions).

## Suppress transitions on theme switch

Disable every transition for the theme swap, force a style flush and restore transitions after the next frame. Otherwise every color transition fires at once and the switch smears. See the [recipe](#suppress-transitions-on-theme-switch).

## Transition only what changes

Name the exact properties, as in `transition-property: scale, opacity`, and never `all`. See [performance.md](#performance).

## Name the animated property in will-change

Add `will-change` only after you see first-frame stutter, and name the property you animate: `scale` for `scale`, `transform` for `transform`. Limit it to transform properties, `opacity` and `filter`, and never use `all`. See [performance.md](#use-will-change-sparingly).

## Hover effects only on hover-capable pointers

Put hover-only styling behind `@media (hover: hover)`. On touch, `:hover` latches after a tap and reads as a stuck selected state. Tailwind 4's `hover:` variant already compiles under that query, and Tailwind 3's does not. Where a control draws its own pressed state, set `-webkit-tap-highlight-color: transparent` so the default gray flash does not double it.

## Contain scroll inside overlays

Give scrollable dialogs, drawers, menus and side panels `overscroll-behavior: contain`, so scrolling past their end never scrolls the page behind.

## Match icon stroke to text weight

An icon's rendered stroke tracks the weight of the text beside it, from `1.5px` at 400 to `2.5px` at 700. Use one icon library per surface. The table, sizing and grid rules are in [icons.md](#icons).

## One SVG, recolored per state

Icons use `currentColor` and take hover, selected and disabled states from CSS color and opacity, never from separate assets. Outline is the default variant, and fill marks the active state. Under `dir="rtl"`, mirror only icons whose meaning follows reading direction. See [icons.md](#icons-in-rtl).

## Before you finish

| Detection | Fix |
| --- | --- |
| Padded parent and child with the same `rounded-*` or `border-radius` | Add the padding to the outer radius |
| `box-shadow: 0 0 0 1px` ring with no `border` beside it | `border: 1px solid transparent` |
| `outline-slate-*`, `outline-zinc-*` or a hex outline color on `img` | `outline-black/10` and `dark:outline-white/10` |
| `transition-all` or `transition: all` | Name the changing properties |
| `animation:` set on `:hover`, `.open` or another toggled class | A transition on the same properties |
| `active:scale-95`, `scale-90` or `whileTap` below `0.96` | `0.96` |
| `:active` scale with no `:disabled` exclusion | `enabled:active:` or `:not(:disabled):active` |
| `bounce:` set to anything but `0` | `bounce: 0` |
| `opacity: 0` in a base rule that only an `animation` reveals | Hidden state in the `from` keyframe, `animation-fill-mode: both` |
| `translate`, `scale`, `filter` or `motion.*` animation with no `prefers-reduced-motion`, `motion-safe:` or `MotionConfig` guard | Gate it and cross-fade opacity under reduced motion |
| Color transitions plus a theme toggle with no `disableTransitionOnChange` or override | The theme-switch suppression recipe |
| `will-change: all`, or `will-change` on an element that never animates | Name the animated property or delete it |
| `fill="#..."` or `stroke="#..."` inside an icon SVG | `currentColor` |
| Plain-CSS `:hover` or Tailwind 3 `hover:` outside `@media (hover: hover)` | Wrap it in the query |
| `overflow: auto` or `overflow-y-auto` on a dialog, drawer or menu with no `overscroll-behavior` | `overscroll-behavior: contain` |


---

## Surfaces

Recipes for concentric radius, optical alignment, shadow rings and image outlines.

### Concentric border radius

```
outerRadius = innerRadius + padding + borderWidth
```

```css
/* Good: concentric radii */
.card {
  border-radius: 20px; /* 12 + 8 */
  padding: 8px;
}
.card-inner {
  border-radius: 12px;
}

/* Bad: same radius on both */
.card {
  border-radius: 12px;
  padding: 8px;
}
.card-inner {
  border-radius: 12px;
}
```

```tsx
// Good: outer radius accounts for padding
<div className="rounded-2xl p-2">       {/* 16px radius, 8px padding */}
  <div className="rounded-lg">          {/* 8px radius = 16 - 8 */}
    ...
  </div>
</div>

// Bad: same radius on both
<div className="rounded-xl p-2">
  <div className="rounded-xl">
    ...
  </div>
</div>
```

### Optical alignment

#### Buttons with text and an icon

Start the icon side at `2px` less padding than the text side, then judge by eye.

```css
/* Good: less padding on the trailing icon side */
.button-with-icon {
  padding-inline-start: 16px;
  padding-inline-end: 14px;
}

/* Bad: equal padding pushes the icon visually outward */
.button-with-icon {
  padding-inline: 16px;
}
```

```tsx
// Tailwind
<button className="ps-4 pe-3.5 flex items-center gap-2">
  <span>Continue</span>
  <ArrowRightIcon />
</button>
```

#### Play button triangles

A triangle's geometric center sits left of its visual center, so shift it toward its point:

```css
.play-button svg {
  transform: translateX(2px); /* physical on purpose: playback icons never mirror */
}
```

#### Asymmetric icons

Stars, arrows and carets carry uneven visual weight. Fix the `viewBox` or path in the SVG, so the component needs no extra offset. Where the asset cannot change, nudge its wrapper:

```tsx
<span className="translate-x-px">
  <StarIcon />
</span>
```

### Shadow recipes

#### Light mode

Three layers. The first acts as a 1px ring, the second adds lift and the third ambient depth:

```css
:root {
  --shadow-border:
    0px 0px 0px 1px oklch(0 0 0 / 0.06),
    0px 1px 2px -1px oklch(0 0 0 / 0.06),
    0px 2px 4px 0px oklch(0 0 0 / 0.04);
  --shadow-border-hover:
    0px 0px 0px 1px oklch(0 0 0 / 0.08),
    0px 1px 2px -1px oklch(0 0 0 / 0.08),
    0px 2px 4px 0px oklch(0 0 0 / 0.06);
}
```

#### Dark mode

Depth shadows vanish on dark backgrounds, so dark mode keeps one white ring:

```css
/* Redefine under the project's dark selector */
--shadow-border: 0 0 0 1px oklch(1 0 0 / 0.08);
--shadow-border-hover: 0 0 0 1px oklch(1 0 0 / 0.13);
```

#### Usage

```css
.card {
  border: 1px solid transparent; /* forced-colors mode drops box-shadow and paints this border */
  box-shadow: var(--shadow-border);
  transition-property: box-shadow;
  transition-duration: 150ms;
  transition-timing-function: ease-out;
}

.card:hover {
  box-shadow: var(--shadow-border-hover);
}
```

The transparent border keeps the box the same size as the border it replaces.

### Image outlines

```css
:root {
  --image-outline: oklch(0 0 0 / 0.1);
}
/* Redefine under the project's dark selector */
--image-outline: oklch(1 0 0 / 0.1);

.content-image {
  outline: 1px solid var(--image-outline);
  outline-offset: -1px;
}
```

```tsx
<img
  className="outline outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10"
  src={src}
  alt={alt}
/>
```

Never `outline-slate-*`, `outline-zinc-*`, `outline-neutral-*` or a palette near-black such as `#111827`.

Use `outline` rather than `border` because it never changes the image's size. At `outline-offset: -1px` it sits just inside the edge and follows the corner radius.


---

## Animations

Recipes for interruptible transitions, press feedback, first-render behavior, theme switches and the reduced-motion fallback. Staged entrances and exits live in [enter-exit.md](#enter-exit), and icon swaps in [icon-transitions.md](#icon-transitions).

### Interruptible animations

| | CSS transitions | CSS keyframe animations |
| --- | --- | --- |
| **Behavior** | Interpolate toward the latest state | Run on a fixed timeline |
| **Interrupted** | Retarget mid-flight and reverse | Snap or restart from the beginning |
| **Use for** | Hover, toggle, open and close | Sequences that run once, such as enters and loading |

```css
/* Good: clicking again mid-animation reverses smoothly */
.drawer {
  transform: translateX(-100%);
  transition: transform 200ms ease-out;
}
.drawer.open {
  transform: translateX(0);
}

/* Bad: closing mid-animation snaps */
.drawer.open {
  animation: slideIn 200ms ease-out forwards;
}
```

### Scale on press

```css
.button {
  transition-property: scale;
  transition-duration: 150ms;
  transition-timing-function: ease-out;
}

.button:not(:disabled):active {
  scale: 0.96;
}
```

```tsx
// Tailwind
<button className="transition-transform duration-150 ease-out enabled:active:scale-[0.96]">
  Click me
</button>

// Motion
<motion.button whileTap={disabled ? undefined : { scale: 0.96 }} disabled={disabled}>
  Click me
</motion.button>
```

#### Static prop pattern

Where the button has no variant API to carry the opt-out, apply the scale class conditionally on a `static` prop:

```tsx
const tapScale = "enabled:active:scale-[0.96]";

function Button({ static: isStatic, className, children, ...props }) {
  return (
    <button
      className={cn(
        "transition-transform duration-150 ease-out",
        !isStatic && tapScale,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// Usage
<Button>Click me</Button>           {/* scales on press */}
<Button static>Submit</Button>       {/* no scale */}
```

### Skip animation on page load

The icon recipe in [icon-transitions.md](#motion) shows `initial={false}` used correctly. It suits icon swaps, toggles, tabs and segmented controls, anything with a default state on page load.

Setting it around a first-time entrance skips that entrance entirely. Check the component on a full page refresh before adding it.

```tsx
// Bad: initial={false} skips the staggered page enter
<AnimatePresence initial={false}>
  <motion.div initial="hidden" animate="visible" variants={...}>
    ...
  </motion.div>
</AnimatePresence>
```

### Suppress transitions on theme switch

Inject a stylesheet that turns off every transition, force a style flush so the new colors commit while it applies, then remove it after the next frame:

```tsx
"use client";

import { useEffect } from "react";

export function DisableThemeTransitions() {
  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      const style = document.createElement("style");
      style.append(
        document.createTextNode(
          "*,*::before,*::after{transition:none !important}"
        )
      );
      document.head.append(style);

      void document.body.offsetHeight; // forces a synchronous style flush

      requestAnimationFrame(() => {
        requestAnimationFrame(() => style.remove());
      });
    };

    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  return null;
}
```

The new theme resolves while the override is still in the document, so no transition starts. The nested `requestAnimationFrame` removes the override only after that paint.

That covers the OS-level change. An in-app toggle needs the same steps around its own flip: apply the override, change the theme, flush and remove. `next-themes` ships this as `disableTransitionOnChange`.

### High-frequency motion

```css
/* Good: high-frequency hover gets a minimal transition */
.row:hover {
  background-color: var(--surface-hover);
  transition: background-color 100ms ease-out;
}

/* Bad: every hover replays a full entrance */
.row:hover .row-icon {
  animation: bounceIn 500ms;
}
```

### Reduced-motion fallback

The opacity fade runs for everyone, and movement, scale and blur join it only without the preference:

```css
.panel {
  transition: opacity 150ms ease-out;
}

@media (prefers-reduced-motion: no-preference) {
  .panel {
    transition-property: opacity, translate, scale, filter;
    transition-duration: 300ms;
  }
}
```

In Tailwind, prefix movement, scale and blur utilities with `motion-safe:`. In Motion, wrap the app in `<MotionConfig reducedMotion="user">`. It turns off transform and layout animations under the preference and keeps opacity. Blur still runs there, so branch on `useReducedMotion()` where a recipe animates `filter`.


---

## Enter and exit animations

Recipes for staged entrances and the exits that follow them. For interactive state feedback see [animations.md](#animations), and for icon swaps see [icon-transitions.md](#icon-transitions).

### Enter animations

1. **Split** into semantic groups such as title, description and actions.
2. **Stagger** the groups `100ms` apart.
3. **Split a short display headline** into words, staggered `80ms` apart, where it should read word by word.
4. **Combine** `opacity`, `blur` and `translateY` for each group's enter.

#### Motion

```tsx
const item = {
  hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

function PageHeader() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      <motion.h1 variants={item}>Welcome</motion.h1>
      <motion.p variants={item}>A description of the page.</motion.p>
      <motion.div variants={item}>
        <Button>Get started</Button>
      </motion.div>
    </motion.div>
  );
}
```

#### CSS

The hidden state lives in the `from` keyframe, so an item whose animation never runs stays visible. Reduced motion keeps only the opacity keyframe.

```css
.stagger-item {
  animation: fade-in 300ms ease-out both;
}

@media (prefers-reduced-motion: no-preference) {
  .stagger-item {
    animation-name: fade-in-up;
  }
}

.stagger-item:nth-child(2) { animation-delay: 100ms; }
.stagger-item:nth-child(3) { animation-delay: 200ms; }

@keyframes fade-in {
  from { opacity: 0; }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(12px);
    filter: blur(4px);
  }
}
```

#### Entering from display: none

A popover, dialog or element toggled from `display: none` has no previous style to transition from. `@starting-style` supplies one, and `transition-behavior: allow-discrete` keeps it rendered through the exit. The open state's duration applies on enter and the closed state's on exit.

```css
[popover] {
  opacity: 0;
  translate: 0 12px;
  transition-property: opacity, translate, display, overlay;
  transition-duration: 150ms;
  transition-timing-function: ease-out;
  transition-behavior: allow-discrete;
}

[popover]:popover-open {
  opacity: 1;
  translate: 0 0;
  transition-duration: 300ms;
}

@starting-style {
  [popover]:popover-open {
    opacity: 0;
    translate: 0 12px;
  }
}
```

`@starting-style` and discrete `display` transitions are Baseline 2024. `overlay` is Chromium only, and browsers without support show and hide instantly.

### Exit animations

#### Subtle exit

```tsx
<motion.div
  exit={{
    opacity: 0,
    y: -12,
    filter: "blur(4px)",
    transition: { duration: 0.15, ease: "easeOut" },
  }}
>
  {content}
</motion.div>
```

#### Full exit

Slide fully out only where the destination carries meaning, such as a card returning to a list or a drawer closing:

```tsx
<motion.div
  exit={{
    opacity: 0,
    x: "-100%",
    transition: { duration: 0.2, ease: "easeOut" },
  }}
>
  {content}
</motion.div>
```

#### Good and bad

```css
/* Good: subtle exit */
.item-exit {
  opacity: 0;
  transform: translateY(-12px);
  transition: opacity 150ms ease-out, transform 150ms ease-out;
}

/* Bad: dramatic exit that steals focus */
.item-exit {
  opacity: 0;
  transform: translateY(-100%) scale(0.5);
  transition: all 400ms ease-out;
}

/* Sometimes correct: remove at once when motion adds no information */
.item-exit {
  display: none;
}
```


---

## Icons

Icon stroke weight, sizing, state colors, variants and RTL mirroring.

### Match icon stroke to text weight

| Adjacent text | Rendered stroke width |
| --- | --- |
| Regular (400), 14–16px | `1.5px` |
| Medium or semibold (500–600) | `2px` |
| Bold (700), or an emphasized standalone icon | `2.5px` |

The widths are rendered pixels. A 24px-grid icon drawn at 16px scales its stroke by 16/24, so `stroke-width="2"` paints about `1.33px`. Use the library's absolute-stroke option, such as Lucide's `absoluteStrokeWidth`, or set `vector-effect: non-scaling-stroke` on the SVG's shapes.

```tsx
// Good: stroke tuned to the semibold label
<button className="flex items-center gap-2 font-semibold">
  <Plus size={16} strokeWidth={2} absoluteStrokeWidth />
  New project
</button>

// Bad: 1.5px stroke against a bold label
<button className="flex items-center gap-2 font-bold">
  <Plus size={16} strokeWidth={1.5} absoluteStrokeWidth />
  New project
</button>
```

- **One library per surface.** Never mix icon libraries on one toolbar. Where the library has no stroke variants, keep its native stroke and use size or color for emphasis.
- **Size inline icons at `1em`–`1.25em`** of the adjacent font size, so the pair scales together.

### One SVG, recolored per state

Draw every icon with `currentColor` and let CSS state drive the color. Strip hardcoded fills such as `fill="#666"` to `currentColor` when importing icons.

```html
<svg fill="none" stroke="currentColor" stroke-width="2">…</svg>
```

```css
/* Use the project's color tokens */
.icon-button { color: var(--icon-muted); }
.icon-button:hover { color: var(--icon-strong); }
.icon-button[aria-pressed="true"] { color: var(--icon-active); }
.icon-button:disabled { opacity: 0.4; }
```

```html
<!-- Tailwind, with the project's token names -->
<button class="text-icon-muted hover:text-icon-strong aria-pressed:text-icon-active disabled:opacity-40">
  <BookmarkIcon />
</button>
```

### Outline default, fill active

Where an icon set offers outline and filled variants, use them as a state pair, never interchangeably:

| Variant | Use for |
| --- | --- |
| Outline | Default state in toolbars, list rows and inline text |
| Fill | Selected or active state, such as the active tab, a toggled bookmark or a liked heart |

```tsx
// Good: variant communicates state
<TabIcon variant={isActive ? "solid" : "outline"} />

// Bad: filled everywhere, so the active tab has no state signal
<TabIcon variant="solid" />
```

Cross-fade the swap with the values in [icon-transitions.md](#icon-transitions) only where the change is infrequent, such as a bookmark or a like. An active tab swaps instantly.

### Design at render size

- Test every icon at the smallest size it renders, often `16px`. It must stay recognizable there.
- Prefer a simplified glyph for small contexts over scaling down detailed artwork.
- Where the set ships per-size grids such as `16`, `20` and `24`, use the grid that matches the render size. A 24px drawing scaled to 16px lands off the pixel grid and renders soft.
- Always SVG, never raster.

### Icons in RTL

Under `dir="rtl"`, flip icons whose meaning is tied to reading direction, and leave the rest alone:

| Flip | Don't flip |
| --- | --- |
| Back and forward arrows, navigation chevrons | Logos and brand marks |
| Text-block glyphs for alignment, lists and indent | Checkmarks |
| Speaker and volume waves | Physical objects such as clocks, cups and pencils |
| Directional glyphs such as "send" | Media playback, which stays LTR by convention |

Use one mechanism per element. Two flips on one icon can compound back to unflipped.

```css
[dir="rtl"] .icon-directional {
  scale: -1 1;
}
```

```tsx
// Tailwind
<ChevronRightIcon className="rtl:-scale-x-100" />
```

Analyze composite icons part by part. A badge or slash overlay may keep its position while the base glyph flips. Accessible names for icon-only buttons belong to `accessibility.md`.


---

## Icon transitions

Cross-fade recipes for an icon that swaps on a state change, with and without a motion library. Icon weight, color and direction live in [icons.md](#icons).

### Which library

Check the project's `package.json`. Import from `"motion/react"` when `motion` is installed, or `"framer-motion"` when that is. Where both exist, follow the imports the component or its nearest peers already use. Where neither is present, use the CSS cross-fade and never add a dependency just for icon transitions.

### Motion

```tsx
import { AnimatePresence, motion } from "motion/react";

function IconButton({ isActive, icon: Icon }) {
  return (
    <button>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={isActive ? "active" : "inactive"}
          initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
          transition={{ type: "spring", duration: 0.3, bounce: 0 }}
        >
          <Icon />
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
```

`initial={false}` keeps the default icon from animating in on mount.

### CSS, both icons in the DOM

Both icons stay mounted in one grid cell, so enter and exit both animate and the larger icon sets the size. The `motion-reduce:` classes leave only the opacity fade under reduced motion.

```tsx
const layer = cn(
  "[grid-area:1/1] transition-[opacity,filter,scale] duration-300",
  "ease-[cubic-bezier(0.2,0,0,1)]",
  "motion-reduce:scale-100 motion-reduce:blur-[0px]"
);
const shown = "scale-100 opacity-100 blur-[0px]";
const hidden = "scale-[0.25] opacity-0 blur-[4px]";

function IconButton({ isActive, ActiveIcon, InactiveIcon }) {
  return (
    <button>
      <span className="grid place-items-center">
        <span className={cn(layer, isActive ? shown : hidden)}>
          <ActiveIcon />
        </span>
        <span className={cn(layer, isActive ? hidden : shown)}>
          <InactiveIcon />
        </span>
      </span>
    </button>
  );
}
```

Tailwind 4's `scale-*` utilities write the `scale` property, so `transition-[...scale]` animates them. Tailwind 3's write `transform`, so name `transform` in the transition instead.

### Which icons animate

| Animate | Don't animate |
| --- | --- |
| Infrequent state swaps such as play to pause, like to liked or copy to copied | Hover-revealed actions in list rows |
| Icons in a toolbar that appears on selection | Tab and navigation icon swaps |
| Loading and success indicators | Decorative or always-visible icons |


---

## Performance

Recipes for transition specificity and compositing hints.

### Transition only what changes

`transition: all` animates properties nobody meant to animate, such as colors on a theme flip. On layout properties such as `width` and `padding` it re-runs layout on every frame. Tailwind's bare `transition` is a curated list rather than `all`, and still covers more than most elements change.

```css
/* Good: only what changes */
.button {
  transition-property: scale, background-color;
  transition-duration: 150ms;
  transition-timing-function: ease-out;
}

/* Bad: everything */
.button {
  transition: all 150ms ease-out;
}
```

```tsx
// Good: explicit properties
<button className="transition-[scale,background-color] duration-150 ease-out">

// Bad: transition all
<button className="transition-all duration-150 ease-out">
```

In Tailwind 4, `transition-transform` covers `transform, translate, scale, rotate`, and in Tailwind 3 only `transform`. Use it when animating transforms alone. Mixing transform and other properties takes the bracket syntax, as in `transition-[scale,opacity,filter]`.

### Use will-change sparingly

`will-change` promotes an element to its own compositing layer ahead of time. Without it the browser promotes when the animation starts, and that one-time promotion can stutter on the first frame. Each extra layer costs memory, so never add it preemptively.

```css
/* Good: names the property that animates */
.animated-card {
  will-change: scale, opacity;
}

/* Bad: never all */
.animated-card {
  will-change: all;
}

/* Bad: these never composite */
.animated-card {
  will-change: background-color, padding;
}
```

| Property | Worth `will-change` |
| --- | --- |
| `transform`, `translate`, `scale`, `rotate` | Yes |
| `opacity` | Yes |
| `filter` | Yes |
| `clip-path` | Rarely, since compositing it is not reliable across browsers |
| `top`, `left`, `width`, `height` | No |
| `background`, `border`, `color` | No |

`will-change` on a transform property or `filter` makes the element the containing block for its `position: fixed` descendants, so a fixed modal or tooltip inside it stops tracking the viewport. Any of these values also creates a stacking context, which can reorder `z-index` against siblings.


---

## Additions from make-interfaces-feel-better (unique parts only)

Process: before suggesting a fix, identify the project's styling system and express the change in it (Tailwind in Tailwind projects, plain CSS in CSS projects, the established CSS-in-JS otherwise). Never introduce a second styling system just to apply a polish fix. When reviewing, slow the interface down: replay motion at 10% speed in the browser's Animations panel and walk every state (hover, focus, active, loading, empty). What feels off at 10% is subtly wrong at full speed.

Review modes: `quick` = primary user path and highest-traffic states, report only HIGH and MEDIUM, cap 5 findings. `full` (default) = entire requested scope across typography, surfaces, animations, icons, performance, cap 15. State the mode, exact scope, framework, styling conventions and review boundary. Show a coverage table (Category | Evidence inspected | Result: finding count, `Clear`, or `Not reviewed` with a reason) covering all five categories; never imply an uninspected surface was reviewed. Group findings by principle, consolidate repeated systemic issues into one row listing every location, omit principles with no findings, never pad to the cap. Add "Considered but rejected" (1-3 real candidates in quick, 2-5 in full; do not invent filler). Verdict: `Block` if any HIGH remains, `Needs changes` if only MEDIUM/LOW remain, `Approve` only with no actionable findings; list every unverified check beside it. No findings: state "No actionable interface-polish findings", report verification and rejected candidates, end with `Approve`.

Typography details that came with it (the full rules are in `reference/typography/typography.md`): `text-wrap: balance` only works on short blocks (6 lines in Chromium, 10 in Firefox), `text-wrap: pretty` is the default for short-to-medium text, skip both on very long text; font smoothing once on the root, macOS only; tabular-nums for changing numbers but not for phone numbers, zip codes, version numbers or decorative large numerals. Caveat: some fonts (Inter) change the look of `1` under `tabular-nums` (wider, centered), which is expected, verify it. Do not introduce a paid typeface just to satisfy a polish checklist.

Hit areas (full rules in `reference/accessibility/accessibility.md`): prefer 44x44px for touch, at least 40x40px in dense desktop UI, extend with a pseudo-element (`after:absolute after:top-1/2 after:left-1/2 after:size-11 after:-translate-1/2`), and shrink the pseudo-element rather than overlap another interactive element.

Shadow-vs-border table: use shadows for cards, containers with depth, bordered-style buttons, elevated elements (dropdowns, modals), elements on varied backgrounds, hover/focus lift. Use borders for dividers between list items, table cell boundaries, form input outlines (accessibility), hairline separators in dense UI.

## Values that differ from `reference/motion/` (resolved)
| Detail | This file | motion.md / motion-recipes.md | Resolution |
|---|---|---|---|
| Press scale | exactly 0.96, 150ms ease-out, never below 0.95 | 0.97, 160ms (range 0.95-0.98) | Use 0.96-0.97; 0.96/150ms when following this file; never below 0.95 |
| Icon swap scale | 0.25 to 1, spring duration .3 bounce 0, blur 4px | 0.8 to 1 (Jakub) | Use 0.25 for small contextual icon swaps (copy to check); 0.8 for larger content swaps |
| Exit | 150ms, -12px, blur 4px | subtler than enter, shorter | Same; use this file's values |
| Stagger | 100ms between semantic chunks, 300ms each | 30-80ms between list items | 100ms for staged hero chunks; 30-80ms for repeated list items |


---

## See also: additions from the ui-craft and impeccable plugins (not line-merged)

These were added verbatim as detail files. They overlap this topic in subject but not in wording, so they were kept rather than merged. Where they disagree with this file, this file wins.
- impeccable: ui-polish/impeccable/ (polish, bolder, quieter, delight, distill, extract, harden, optimize, component-review, craft-floor)
